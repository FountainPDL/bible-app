import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { fetchVerses, clearVerseCache } from './utils/verseApi.js'
import { buildTheme, GOOGLE_FONTS_URL } from './utils/theme.js'
import { ALL_BOOKS, CHAPTER_COUNTS } from './constants/books.js'
import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import ActionBar from './components/ActionBar.jsx'
import ReadPage from './pages/ReadPage.jsx'
import NavPage from './pages/NavPage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import NoteModal from './modals/NoteModal.jsx'
import WordActionModal from './modals/WordActionModal.jsx'

// ── Default settings ────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  translation:  'KJV',
  themeMode:    'light',       // 'light' | 'dark' | 'amoled'
  primaryColor: '#7B2FBE',
  accentColor:  '#C0392B',
  autoNightMode: false,
  nightStart:   22,
  fontSize:     18,
  fontFamily:   'EB Garamond',
  lineHeight:   1.9,
  verseNumbers: true,
  redLetter:    true,
  readingMode:  'chapter',     // 'chapter' | 'verse'
  displayMode:  'scroll',      // 'scroll' | 'book' | 'dual'
}

export default function App() {
  // ── Persistent state ──────────────────────────────────────────────────────
  const [settings,      setSettings]      = useLocalStorage('fpb_settings', DEFAULT_SETTINGS)
  const [book,          setBook]          = useLocalStorage('fpb_book', 'John')
  const [chapter,       setChapter]       = useLocalStorage('fpb_chapter', 3)
  const [history,       setHistory]       = useLocalStorage('fpb_history', [])
  const [bookmarks,     setBookmarks]     = useLocalStorage('fpb_bookmarks', [])
  const [highlights,    setHighlights]    = useLocalStorage('fpb_highlights', {})
  const [underlines,    setUnderlines]    = useLocalStorage('fpb_underlines', {})
  const [wordAnnotations, setWordAnnotations] = useLocalStorage('fpb_wordann', [])
  const [notes,         setNotes]         = useLocalStorage('fpb_notes', [])
  const [sermons,       setSermons]       = useLocalStorage('fpb_sermons', [])
  const [marathons,     setMarathons]     = useLocalStorage('fpb_marathons', [])

  // ── Ephemeral state ───────────────────────────────────────────────────────
  const [page,          setPage]          = useState('read')
  const [verses,        setVerses]        = useState({})
  const [loading,       setLoading]       = useState(false)
  const [targetVerse,   setTargetVerse]   = useState(null)
  const [selectedVerses, setSelectedVerses] = useState(new Set())

  // Modals
  const [noteModal,      setNoteModal]     = useState(false)
  const [noteForm,       setNoteForm]      = useState({ topic: '', text: '', refs: '', linkedRef: '' })
  const [wordModal,      setWordModal]     = useState(false)

  // ── Theme ─────────────────────────────────────────────────────────────────
  const T = useMemo(() => buildTheme(settings), [settings])

  const updateSetting = useCallback((key, value) => {
    setSettings(s => ({ ...s, [key]: value }))
  }, [setSettings])

  // ── Auto Night Mode ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!settings.autoNightMode) return
    const check = () => {
      const h = new Date().getHours()
      const isNight = h >= settings.nightStart || h < 6
      if (isNight && settings.themeMode === 'light') updateSetting('themeMode', 'dark')
      else if (!isNight && settings.themeMode === 'dark') updateSetting('themeMode', 'light')
    }
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [settings.autoNightMode, settings.nightStart, settings.themeMode, updateSetting])

  // ── Load chapter ──────────────────────────────────────────────────────────
  const loadChapter = useCallback(async (b, c, scrollTo = null) => {
    setLoading(true)
    setSelectedVerses(new Set())
    const data = await fetchVerses(b, c, settings.translation)
    setVerses(data)
    setLoading(false)
    setTargetVerse(scrollTo)

    // Record history
    const ref = `${b} ${c}`
    setHistory(h => [
      { ref, book: b, chapter: c, ts: Date.now() },
      ...h.filter(x => x.ref !== ref).slice(0, 199),
    ])
  }, [settings.translation, setHistory])

  // Load last-opened chapter on mount
  useEffect(() => { loadChapter(book, chapter) }, []) // eslint-disable-line

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigate = useCallback((b, c, scrollTo = null) => {
    setBook(b)
    setChapter(c)
    loadChapter(b, c, scrollTo)
    setPage('read')
  }, [setBook, setChapter, loadChapter])

  const prevChapter = useCallback(() => {
    if (chapter > 1) navigate(book, chapter - 1)
    else {
      const i = ALL_BOOKS.indexOf(book)
      if (i > 0) { const nb = ALL_BOOKS[i - 1]; navigate(nb, CHAPTER_COUNTS[nb]) }
    }
  }, [book, chapter, navigate])

  const nextChapter = useCallback(() => {
    if (chapter < (CHAPTER_COUNTS[book] || 1)) navigate(book, chapter + 1)
    else {
      const i = ALL_BOOKS.indexOf(book)
      if (i < ALL_BOOKS.length - 1) navigate(ALL_BOOKS[i + 1], 1)
    }
  }, [book, chapter, navigate])

  // ── Verse selection ───────────────────────────────────────────────────────
  const handleVerseToggle = useCallback((v) => {
    setSelectedVerses(prev => {
      const n = new Set(prev)
      if (n.has(v)) n.delete(v); else n.add(v)
      return n
    })
  }, [])

  const clearSelection = useCallback(() => setSelectedVerses(new Set()), [])

  // ── Annotation helpers ────────────────────────────────────────────────────
  const vKey = (v) => `${book}:${chapter}:${v}`

  const isChapterBookmarked = bookmarks.some(b => b.key === `${book}:${chapter}:ALL`)

  const toggleChapterBookmark = () => {
    const k = `${book}:${chapter}:ALL`
    if (isChapterBookmarked) setBookmarks(bm => bm.filter(b => b.key !== k))
    else setBookmarks(bm => [...bm, { key: k, book, chapter, verse: 'ALL', label: `${book} Chapter ${chapter}`, ts: Date.now() }])
  }

  const applyHighlight = () => {
    setHighlights(h => {
      const n = { ...h }
      const allHL = [...selectedVerses].every(v => !!n[vKey(v)])
      selectedVerses.forEach(v => {
        if (allHL) delete n[vKey(v)]
        else n[vKey(v)] = { book, chapter, verse: v, ts: Date.now() }
      })
      return n
    })
    clearSelection()
  }

  const applyUnderline = () => {
    setUnderlines(u => {
      const n = { ...u }
      const allUL = [...selectedVerses].every(v => !!n[vKey(v)])
      selectedVerses.forEach(v => {
        if (allUL) delete n[vKey(v)]
        else n[vKey(v)] = { book, chapter, verse: v, ts: Date.now() }
      })
      return n
    })
    clearSelection()
  }

  const applyBookmark = () => {
    setBookmarks(bm => {
      const allBM = [...selectedVerses].every(v => bm.some(b => b.key === vKey(v)))
      if (allBM) return bm.filter(b => ![...selectedVerses].includes(parseInt(b.key.split(':')[2])) || b.book !== book || b.chapter !== chapter)
      const newBMs = [...selectedVerses].filter(v => !bm.some(b => b.key === vKey(v))).map(v => ({
        key: vKey(v), book, chapter, verse: v, label: `${book} ${chapter}:${v}`, ts: Date.now(),
      }))
      return [...bm, ...newBMs]
    })
    clearSelection()
  }

  const applyWordAction = ({ phrase, type, color, note }) => {
    const txt = phrase || [...selectedVerses].sort((a, b) => a - b).map(v => verses[v] || '').join(' ').slice(0, 80)
    if (type === 'note' && note) {
      setNotes(n => [...n, {
        id: Date.now(), topic: `Word note: "${txt.slice(0, 30)}"`,
        text: note, refs: selectedRef, ts: Date.now(),
      }])
    } else {
      setWordAnnotations(wa => [...wa, ...[...selectedVerses].map(v => ({
        id: Date.now() + v, type, book, chapter, verse: v, text: txt, color, ts: Date.now(),
      }))])
    }
    clearSelection()
  }

  // ── Data clear handler ────────────────────────────────────────────────────
  const handleClear = (key) => {
    const labels = {
      history: 'Clear all reading history?',
      bookmarks: 'Clear all bookmarks?',
      highlights: 'Clear all highlights and underlines?',
      notes: 'Delete all notes?',
      sermons: 'Delete all sermons and studies?',
      marathons: 'Delete all reading marathons?',
    }
    if (!confirm(labels[key])) return
    switch (key) {
      case 'history':   setHistory([]); break
      case 'bookmarks': setBookmarks([]); break
      case 'highlights': setHighlights({}); setUnderlines({}); setWordAnnotations([]); break
      case 'notes':     setNotes([]); break
      case 'sermons':   setSermons([]); break
      case 'marathons': setMarathons([]); break
    }
  }

  // ── Computed values ───────────────────────────────────────────────────────
  const selectedSorted = [...selectedVerses].sort((a, b) => a - b)
  const selectedText = selectedSorted.map(v => `${v} ${verses[v] || ''}`).join(' ')
  const selectedRef = selectedVerses.size > 0
    ? `${book} ${chapter}:${selectedSorted.join(',')}`
    : ''

  // ── Global CSS ────────────────────────────────────────────────────────────
  const globalCss = `
    @import url('${GOOGLE_FONTS_URL}');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; overflow: hidden; }
    body {
      background: ${T.bg};
      color: ${T.text};
      font-family: '${settings.fontFamily}', Georgia, serif;
      -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${T.primary}55; border-radius: 4px; }
    ::selection { background: ${T.primary}44; color: ${T.text}; }
    @keyframes slideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(12px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    input, textarea, select, button { font-family: inherit; }
  `

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{globalCss}</style>

      <div style={{
        display: 'flex', flexDirection: 'column',
        height: '100vh', maxWidth: 960, margin: '0 auto',
        position: 'relative', background: T.bg,
      }}>
        {/* Top Bar */}
        <TopBar
          book={book} chapter={chapter}
          translation={settings.translation} T={T}
          onToggleTranslation={() => {
            const next = settings.translation === 'KJV' ? 'NIV' : 'KJV'
            updateSetting('translation', next)
            clearVerseCache()
            loadChapter(book, chapter)
          }}
          onNewNote={() => {
            setNoteForm({ topic: '', text: '', refs: '', linkedRef: selectedRef })
            setNoteModal(true)
          }}
        />

        {/* Page Content */}
        {page === 'read' && (
          <ReadPage
            book={book} chapter={chapter}
            verses={verses} loading={loading} T={T} settings={settings}
            selectedVerses={selectedVerses} onVerseToggle={handleVerseToggle}
            highlights={highlights} underlines={underlines}
            bookmarks={bookmarks} wordAnnotations={wordAnnotations}
            onPrev={prevChapter} onNext={nextChapter}
            onToggleChapterBookmark={toggleChapterBookmark}
            isChapterBookmarked={isChapterBookmarked}
            targetVerse={targetVerse}
          />
        )}
        {page === 'nav' && (
          <NavPage T={T} settings={settings} onNavigate={navigate} />
        )}
        {page === 'library' && (
          <LibraryPage
            T={T} settings={settings}
            history={history} bookmarks={bookmarks}
            highlights={highlights} underlines={underlines}
            wordAnnotations={wordAnnotations} notes={notes}
            sermons={sermons} marathons={marathons}
            setBookmarks={setBookmarks} setHighlights={setHighlights}
            setUnderlines={setUnderlines} setWordAnnotations={setWordAnnotations}
            setNotes={setNotes} setSermons={setSermons} setMarathons={setMarathons}
            currentBook={book} currentChapter={chapter}
            onNavigate={navigate}
          />
        )}
        {page === 'settings' && (
          <SettingsPage
            T={T} settings={settings}
            updateSetting={updateSetting}
            onClear={handleClear}
          />
        )}

        {/* Floating Action Bar */}
        {selectedVerses.size > 0 && (
          <ActionBar
            selectedVerses={selectedVerses}
            book={book} chapter={chapter} T={T}
            highlights={highlights} underlines={underlines} bookmarks={bookmarks}
            onHighlight={applyHighlight}
            onUnderline={applyUnderline}
            onBookmark={applyBookmark}
            onWordAction={() => setWordModal(true)}
            onNote={() => {
              setNoteForm({ topic: '', text: '', refs: '', linkedRef: selectedRef })
              setNoteModal(true)
            }}
            onClear={clearSelection}
          />
        )}

        {/* Bottom Nav */}
        <BottomNav page={page} T={T} onNavigate={p => { setPage(p); clearSelection() }} />

        {/* Note Modal */}
        <NoteModal
          open={noteModal} onClose={() => setNoteModal(false)}
          T={T} noteForm={noteForm} setNoteForm={setNoteForm}
          onSave={() => {
            if (!noteForm.topic.trim() || !noteForm.text.trim()) return
            setNotes(n => [...n, { id: Date.now(), ...noteForm, ts: Date.now() }])
            setNoteForm({ topic: '', text: '', refs: '', linkedRef: '' })
            setNoteModal(false)
            clearSelection()
          }}
        />

        {/* Word Annotation Modal */}
        <WordActionModal
          open={wordModal} onClose={() => { setWordModal(false); clearSelection() }}
          T={T} settings={settings}
          selectedVerses={selectedVerses}
          selectedText={selectedText} selectedRef={selectedRef}
          onApply={applyWordAction}
        />
      </div>
    </>
  )
}
