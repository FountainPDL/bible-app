import React, { useState } from 'react'
import { CHAPTER_COUNTS, READING_PLANS } from '../constants/books.js'
import { formatDate, formatShortDate } from '../utils/format.js'
import { lookupRef } from '../utils/verseApi.js'
import Modal, { FormLabel, FormInput, FormTextarea, ModalButtons } from '../components/Modal.jsx'

const TABS = ['history', 'bookmarks', 'highlights', 'notes', 'sermons', 'marathon']

export default function LibraryPage({
  T, settings,
  history, bookmarks, highlights, underlines, wordAnnotations, notes, sermons, marathons,
  setBookmarks, setHighlights, setUnderlines, setWordAnnotations, setNotes, setSermons, setMarathons,
  currentBook, currentChapter,
  onNavigate,
}) {
  const [tab, setTab] = useState('bookmarks')

  // Note form
  const [noteModal, setNoteModal] = useState(false)
  const [noteForm, setNoteForm] = useState({ topic: '', text: '', refs: '' })

  // Sermon form
  const [sermonModal, setSermonModal] = useState(false)
  const [sermonForm, setSermonForm] = useState({ title: '', blocks: [] })
  const [sermonTextInput, setSermonTextInput] = useState('')
  const [sermonVerseInput, setSermonVerseInput] = useState('')
  const [verseLoading, setVerseLoading] = useState(false)

  // Marathon form
  const [marathonModal, setMarathonModal] = useState(false)
  const [marathonForm, setMarathonForm] = useState({ name: '', plan: 'Full Bible (OT→NT)' })

  // ── Note actions ────────────────────────────────────────────────────────────
  const saveNote = () => {
    if (!noteForm.topic.trim() || !noteForm.text.trim()) return
    setNotes(n => [...n, { id: Date.now(), ...noteForm, ts: Date.now() }])
    setNoteForm({ topic: '', text: '', refs: '' })
    setNoteModal(false)
  }

  // ── Sermon actions ──────────────────────────────────────────────────────────
  const addTextBlock = () => {
    if (!sermonTextInput.trim()) return
    setSermonForm(f => ({ ...f, blocks: [...f.blocks, { id: Date.now(), type: 'text', content: sermonTextInput }] }))
    setSermonTextInput('')
  }

  const addVerseBlock = async () => {
    if (!sermonVerseInput.trim()) return
    setVerseLoading(true)
    const { text, ref } = await lookupRef(sermonVerseInput, settings.translation)
    setSermonForm(f => ({ ...f, blocks: [...f.blocks, { id: Date.now(), type: 'verse', ref, verseText: text }] }))
    setSermonVerseInput('')
    setVerseLoading(false)
  }

  const saveSermon = () => {
    if (!sermonForm.title.trim()) return
    setSermons(s => [...s, { id: Date.now(), ...sermonForm, ts: Date.now() }])
    setSermonForm({ title: '', blocks: [] })
    setSermonTextInput('')
    setSermonVerseInput('')
    setSermonModal(false)
  }

  // ── Marathon actions ────────────────────────────────────────────────────────
  const startMarathon = () => {
    if (!marathonForm.name.trim()) return
    const books = READING_PLANS[marathonForm.plan] || []
    const progress = {}
    books.forEach(b => { progress[b] = { completed: [], total: CHAPTER_COUNTS[b] } })
    setMarathons(m => [...m, {
      id: Date.now(), name: marathonForm.name, plan: marathonForm.plan,
      books, progress, startDate: Date.now(), lastRead: null,
    }])
    setMarathonForm({ name: '', plan: 'Full Bible (OT→NT)' })
    setMarathonModal(false)
  }

  const markChapterRead = (marathonId, book, chapter) => {
    setMarathons(ms => ms.map(m => {
      if (m.id !== marathonId) return m
      const p = { ...m.progress }
      if (!p[book]) p[book] = { completed: [], total: CHAPTER_COUNTS[book] }
      if (!p[book].completed.includes(chapter)) {
        p[book] = { ...p[book], completed: [...p[book].completed, chapter] }
      }
      return { ...m, progress: p, lastRead: Date.now() }
    }))
  }

  const marathonStats = (m) => {
    let done = 0, total = 0
    m.books.forEach(b => {
      total += CHAPTER_COUNTS[b] || 0
      done += m.progress[b]?.completed?.length || 0
    })
    return { done, total, pct: total ? Math.round(done / total * 100) : 0 }
  }

  // ── Shared styles ───────────────────────────────────────────────────────────
  const listItem = {
    padding: '12px 16px', borderBottom: `1px solid ${T.border}`,
    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
    transition: 'background 0.15s',
  }
  const refText = { fontFamily: "'Lora', serif", fontSize: '0.9rem', color: T.text }
  const subText = { fontSize: '0.7rem', color: T.sub, marginTop: 2 }
  const delBtn = {
    padding: '3px 9px', border: `1px solid ${T.border}`, borderRadius: 6,
    background: 'transparent', color: T.sub, fontSize: '0.7rem',
    cursor: 'pointer', fontFamily: "'Cinzel', serif", flexShrink: 0,
    transition: 'all 0.15s',
  }
  const addBtn = {
    padding: '8px 18px',
    border: 'none', borderRadius: 8,
    background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
    color: '#fff', cursor: 'pointer',
    fontFamily: "'Cinzel', serif", fontSize: '0.76rem', letterSpacing: '0.06em',
  }

  const empty = (icon, msg) => (
    <div style={{ textAlign: 'center', padding: '52px 20px', color: T.sub }}>
      <div style={{ fontSize: '2.2rem', opacity: 0.35, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: '0.88rem', fontFamily: "'Lora', serif" }}>{msg}</div>
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.surface }}>

      {/* Tab row */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, overflowX: 'auto', flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '11px 14px', border: 'none', background: 'transparent',
            color: tab === t ? T.primary : T.sub,
            fontFamily: "'Cinzel', serif", fontSize: '0.67rem',
            letterSpacing: '0.07em', cursor: 'pointer',
            borderBottom: `2px solid ${tab === t ? T.primary : 'transparent'}`,
            marginBottom: -1, whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* ── HISTORY ── */}
        {tab === 'history' && (
          history.length === 0 ? empty('📜', 'No reading history yet') :
          history.map((e, i) => (
            <div key={i} style={listItem} onClick={() => onNavigate(e.book, e.chapter)}
              onMouseEnter={el => el.currentTarget.style.background = T.card}
              onMouseLeave={el => el.currentTarget.style.background = 'transparent'}
            >
              <div style={{ flex: 1 }}>
                <div style={refText}>{e.ref}</div>
                <div style={subText}>{formatDate(e.ts)}</div>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))
        )}

        {/* ── BOOKMARKS ── */}
        {tab === 'bookmarks' && (
          bookmarks.length === 0 ? empty('🔖', 'No bookmarks yet — tap a verse to bookmark it') :
          bookmarks.map((b, i) => (
            <div key={i} style={listItem}
              onClick={() => onNavigate(b.book, b.chapter, b.verse !== 'ALL' ? b.verse : null)}
              onMouseEnter={el => el.currentTarget.style.background = T.card}
              onMouseLeave={el => el.currentTarget.style.background = 'transparent'}
            >
              <div style={{ flex: 1 }}>
                <div style={refText}>⊕ {b.label}</div>
                <div style={subText}>{formatDate(b.ts)}</div>
              </div>
              <button style={delBtn} onClick={e => { e.stopPropagation(); setBookmarks(bm => bm.filter(x => x.key !== b.key)) }}>Remove</button>
            </div>
          ))
        )}

        {/* ── HIGHLIGHTS ── */}
        {tab === 'highlights' && (
          Object.keys(highlights).length === 0 && Object.keys(underlines).length === 0 && wordAnnotations.length === 0
            ? empty('🖊', 'No highlights or underlines yet') :
            <>
              {Object.values(highlights).length > 0 && (
                <>
                  <SectionHead T={T}>Highlighted Verses</SectionHead>
                  {Object.entries(highlights).map(([k, h]) => (
                    <div key={k} style={{ ...listItem, background: T.hlBg }}
                      onClick={() => onNavigate(h.book, h.chapter, h.verse)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={refText}>◈ {h.book} {h.chapter}:{h.verse}</div>
                        <div style={subText}>Highlighted · {formatDate(h.ts)}</div>
                      </div>
                      <button style={delBtn} onClick={e => { e.stopPropagation(); setHighlights(hs => { const n = { ...hs }; delete n[k]; return n }) }}>Remove</button>
                    </div>
                  ))}
                </>
              )}
              {Object.values(underlines).length > 0 && (
                <>
                  <SectionHead T={T}>Underlined Verses</SectionHead>
                  {Object.entries(underlines).map(([k, u]) => (
                    <div key={k} style={listItem} onClick={() => onNavigate(u.book, u.chapter, u.verse)}>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...refText, textDecoration: 'underline', textDecorationColor: T.primary }}>
                          _ {u.book} {u.chapter}:{u.verse}
                        </div>
                        <div style={subText}>Underlined · {formatDate(u.ts)}</div>
                      </div>
                      <button style={delBtn} onClick={e => { e.stopPropagation(); setUnderlines(us => { const n = { ...us }; delete n[k]; return n }) }}>Remove</button>
                    </div>
                  ))}
                </>
              )}
              {wordAnnotations.length > 0 && (
                <>
                  <SectionHead T={T}>Word & Phrase Annotations</SectionHead>
                  {wordAnnotations.map(wa => (
                    <div key={wa.id} style={listItem} onClick={() => onNavigate(wa.book, wa.chapter, wa.verse)}>
                      <div style={{ flex: 1 }}>
                        <div style={refText}>{wa.type === 'highlight' ? '🖊' : '_'} {wa.book} {wa.chapter}:{wa.verse}</div>
                        <div style={subText}>"{wa.text.slice(0, 50)}{wa.text.length > 50 ? '…' : ''}" · {wa.type} · {formatDate(wa.ts)}</div>
                      </div>
                      <button style={delBtn} onClick={e => { e.stopPropagation(); setWordAnnotations(w => w.filter(x => x.id !== wa.id)) }}>Remove</button>
                    </div>
                  ))}
                </>
              )}
            </>
        )}

        {/* ── NOTES ── */}
        {tab === 'notes' && (
          <>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
              <button style={addBtn} onClick={() => { setNoteForm({ topic: '', text: '', refs: '' }); setNoteModal(true) }}>+ New Note</button>
            </div>
            {notes.length === 0 ? empty('📝', 'No notes yet') :
              notes.map(n => (
                <div key={n.id} style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.85rem', color: T.primary, fontWeight: 600, marginBottom: 6 }}>{n.topic}</div>
                    <button style={delBtn} onClick={() => setNotes(ns => ns.filter(x => x.id !== n.id))}>✕</button>
                  </div>
                  <div style={{ fontSize: '0.88rem', lineHeight: 1.7, color: T.text, fontFamily: `'${settings.fontFamily}', serif` }}>{n.text}</div>
                  {n.refs && <div style={{ fontSize: '0.72rem', color: T.accent, marginTop: 6, fontStyle: 'italic' }}>📍 {n.refs}</div>}
                  <div style={{ fontSize: '0.68rem', color: T.sub, marginTop: 4 }}>{formatDate(n.ts)}</div>
                </div>
              ))
            }
          </>
        )}

        {/* ── SERMONS ── */}
        {tab === 'sermons' && (
          <>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
              <button style={addBtn} onClick={() => { setSermonForm({ title: '', blocks: [] }); setSermonTextInput(''); setSermonVerseInput(''); setSermonModal(true) }}>+ New Sermon / Study</button>
            </div>
            {sermons.length === 0 ? empty('🎙️', 'No sermons or studies yet') :
              sermons.map(s => (
                <div key={s.id} style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.9rem', color: T.primary, fontWeight: 600 }}>{s.title}</div>
                    <button style={delBtn} onClick={() => setSermons(ss => ss.filter(x => x.id !== s.id))}>✕</button>
                  </div>
                  {s.blocks.map(bl => (
                    <div key={bl.id} style={{ marginBottom: 10 }}>
                      {bl.type === 'verse' ? (
                        <>
                          <div style={{ fontSize: '0.67rem', color: T.sub, fontFamily: "'Cinzel', serif", letterSpacing: '0.07em', marginBottom: 3 }}>{bl.ref}</div>
                          <div style={{ background: T.card, borderLeft: `3px solid ${T.primary}`, borderRadius: '0 6px 6px 0', padding: '8px 12px', fontSize: '0.84rem', fontFamily: `'${settings.fontFamily}', serif`, color: T.text, lineHeight: 1.65, fontStyle: 'italic' }}>{bl.verseText}</div>
                        </>
                      ) : (
                        <div style={{ fontSize: '0.88rem', color: T.text, lineHeight: 1.7, fontFamily: `'${settings.fontFamily}', serif` }}>{bl.content}</div>
                      )}
                    </div>
                  ))}
                  <div style={{ fontSize: '0.68rem', color: T.sub, marginTop: 4 }}>{formatDate(s.ts)}</div>
                </div>
              ))
            }
          </>
        )}

        {/* ── MARATHON ── */}
        {tab === 'marathon' && (
          <>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
              <button style={addBtn} onClick={() => setMarathonModal(true)}>+ Start Reading Marathon</button>
            </div>
            {marathons.length === 0 ? empty('🏁', 'No reading marathons yet') :
              marathons.map(m => {
                const { done, total, pct } = marathonStats(m)
                return (
                  <div key={m.id} style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.88rem', color: T.primary, fontWeight: 600 }}>{m.name}</div>
                      <button style={delBtn} onClick={() => setMarathons(ms => ms.filter(x => x.id !== m.id))}>✕</button>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: T.sub, fontFamily: "'Cinzel', serif", marginBottom: 4 }}>{m.plan} · {done}/{total} chapters · {pct}%</div>
                    <div style={{ width: '100%', height: 6, background: T.border, borderRadius: 3, marginBottom: 8 }}>
                      <div style={{ width: `${pct}%`, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${T.primary}, ${T.accent})`, transition: 'width 0.4s' }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: T.sub, marginBottom: 8 }}>
                      Started {formatShortDate(m.startDate)}{m.lastRead ? ` · Last read ${formatShortDate(m.lastRead)}` : ''}
                    </div>
                    <button
                      onClick={() => markChapterRead(m.id, currentBook, currentChapter)}
                      style={{ padding: '6px 14px', border: `1px solid ${T.border}`, borderRadius: 8, background: T.card, color: T.primary, cursor: 'pointer', fontSize: '0.74rem', fontFamily: "'Cinzel', serif" }}
                    >
                      ✓ Mark {currentBook} {currentChapter} as Read
                    </button>
                    {/* Book progress chips */}
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {m.books.map(b => {
                        const bDone = m.progress[b]?.completed?.length || 0
                        const bTotal = CHAPTER_COUNTS[b] || 0
                        const bPct = bTotal ? Math.round(bDone / bTotal * 100) : 0
                        return (
                          <span key={b} title={`${b}: ${bDone}/${bTotal} chapters`} style={{
                            display: 'inline-block', padding: '2px 7px', borderRadius: 10,
                            fontSize: '0.62rem', fontFamily: "'Cinzel', serif",
                            background: bPct === 100 ? T.primary : bPct > 0 ? T.primary + '44' : T.border,
                            color: bPct === 100 ? '#fff' : T.text,
                          }}>
                            {b.slice(0, 7)} {bPct}%
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            }
          </>
        )}
      </div>

      {/* ── Note Modal ── */}
      <Modal open={noteModal} onClose={() => setNoteModal(false)} title="📝 New Note" T={T}>
        <FormLabel T={T}>Topic / Title</FormLabel>
        <FormInput T={T} placeholder="e.g. Faith, Salvation, Grace…" value={noteForm.topic} onChange={e => setNoteForm(f => ({ ...f, topic: e.target.value }))} />
        <FormLabel T={T}>Note</FormLabel>
        <FormTextarea T={T} placeholder="Your thoughts, observations, revelations…" value={noteForm.text} onChange={e => setNoteForm(f => ({ ...f, text: e.target.value }))} />
        <FormLabel T={T}>Verse References</FormLabel>
        <FormInput T={T} placeholder="John 3:16; Romans 8:28; Psalm 23:1" value={noteForm.refs} onChange={e => setNoteForm(f => ({ ...f, refs: e.target.value }))} />
        <ModalButtons T={T} onCancel={() => setNoteModal(false)} onSave={saveNote} saveLabel="Save Note ✦" />
      </Modal>

      {/* ── Sermon Modal ── */}
      <Modal open={sermonModal} onClose={() => setSermonModal(false)} title="🎙️ Sermon / Bible Study Builder" T={T}>
        <FormLabel T={T}>Title / Topic</FormLabel>
        <FormInput T={T} placeholder="Sermon or study title…" value={sermonForm.title} onChange={e => setSermonForm(f => ({ ...f, title: e.target.value }))} />

        <FormLabel T={T}>Add Verse Reference (e.g. John 3:16 or Romans 8:28-39)</FormLabel>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <input
            style={{ flex: 1, padding: '9px 12px', border: `1px solid ${T.border}`, borderRadius: 8, background: T.card, color: T.text, fontSize: '0.86rem', fontFamily: 'inherit', outline: 'none' }}
            placeholder="Romans 8:28"
            value={sermonVerseInput}
            onChange={e => setSermonVerseInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addVerseBlock()}
          />
          <button onClick={addVerseBlock} disabled={verseLoading} style={{ padding: '9px 14px', border: `1px solid ${T.border}`, borderRadius: 8, background: T.card, color: T.primary, cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Cinzel', serif", flexShrink: 0 }}>
            {verseLoading ? '…' : '+ Verse'}
          </button>
        </div>

        <FormLabel T={T}>Add Note / Commentary Text</FormLabel>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <input
            style={{ flex: 1, padding: '9px 12px', border: `1px solid ${T.border}`, borderRadius: 8, background: T.card, color: T.text, fontSize: '0.86rem', fontFamily: 'inherit', outline: 'none' }}
            placeholder="Your commentary or note…"
            value={sermonTextInput}
            onChange={e => setSermonTextInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTextBlock()}
          />
          <button onClick={addTextBlock} style={{ padding: '9px 14px', border: `1px solid ${T.border}`, borderRadius: 8, background: T.card, color: T.primary, cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Cinzel', serif", flexShrink: 0 }}>
            + Text
          </button>
        </div>

        {sermonForm.blocks.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <FormLabel T={T}>Preview ({sermonForm.blocks.length} blocks)</FormLabel>
            {sermonForm.blocks.map((bl, i) => (
              <div key={bl.id} style={{ background: T.card, borderRadius: 8, padding: '8px 10px', marginBottom: 6, borderLeft: `3px solid ${bl.type === 'verse' ? T.accent : T.primary}`, fontSize: '0.82rem', color: T.text, lineHeight: 1.5, fontStyle: bl.type === 'verse' ? 'italic' : 'normal', position: 'relative' }}>
                {bl.type === 'verse' ? <><strong>{bl.ref}:</strong> {bl.verseText.slice(0, 120)}{bl.verseText.length > 120 ? '…' : ''}</> : bl.content}
                <button onClick={() => setSermonForm(f => ({ ...f, blocks: f.blocks.filter(b => b.id !== bl.id) }))} style={{ position: 'absolute', top: 4, right: 6, background: 'none', border: 'none', color: T.sub, cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
              </div>
            ))}
          </div>
        )}

        <ModalButtons T={T} onCancel={() => setSermonModal(false)} onSave={saveSermon} saveLabel="Save Study ✦" />
      </Modal>

      {/* ── Marathon Modal ── */}
      <Modal open={marathonModal} onClose={() => setMarathonModal(false)} title="🏁 New Reading Marathon" T={T}>
        <FormLabel T={T}>Marathon Name</FormLabel>
        <FormInput T={T} placeholder="e.g. 2025 Bible Read-Through" value={marathonForm.name} onChange={e => setMarathonForm(f => ({ ...f, name: e.target.value }))} />
        <FormLabel T={T}>Reading Plan</FormLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
          {Object.keys(READING_PLANS).map(plan => (
            <button key={plan} onClick={() => setMarathonForm(f => ({ ...f, plan }))} style={{
              padding: '9px 6px', border: `1.5px solid ${marathonForm.plan === plan ? T.primary : T.border}`,
              borderRadius: 8, background: marathonForm.plan === plan ? `${T.primary}22` : T.card,
              color: marathonForm.plan === plan ? T.primary : T.text,
              cursor: 'pointer', fontSize: '0.76rem', fontFamily: "'Lora', serif",
              textAlign: 'center', transition: 'all 0.15s', fontWeight: marathonForm.plan === plan ? 600 : 400,
            }}>
              {plan}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.76rem', color: T.sub, fontFamily: "'Cinzel', serif", marginBottom: 14 }}>
          {(READING_PLANS[marathonForm.plan] || []).length} books ·{' '}
          {(READING_PLANS[marathonForm.plan] || []).reduce((s, b) => s + (CHAPTER_COUNTS[b] || 0), 0)} chapters
        </div>
        <ModalButtons T={T} onCancel={() => setMarathonModal(false)} onSave={startMarathon} saveLabel="Begin Marathon 🏁" />
      </Modal>
    </div>
  )
}

function SectionHead({ children, T }) {
  return (
    <div style={{
      padding: '8px 16px', background: T.card,
      borderBottom: `1px solid ${T.border}`,
      fontFamily: "'Cinzel', serif", fontSize: '0.68rem',
      letterSpacing: '0.12em', color: T.sub, textTransform: 'uppercase',
    }}>
      {children}
    </div>
  )
}
