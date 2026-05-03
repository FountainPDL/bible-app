import React, { useEffect, useRef } from 'react'
import { JESUS_VERSES } from '../constants/books.js'
import { NT_SET } from '../constants/books.js'
import { sortedVerseNums } from '../utils/format.js'

export default function ReadPage({
  book, chapter, verses, loading, T, settings,
  selectedVerses, onVerseToggle,
  highlights, underlines, bookmarks, wordAnnotations,
  onPrev, onNext, onToggleChapterBookmark, isChapterBookmarked,
  targetVerse,
}) {
  const verseRefs = useRef({})
  const jesusSet = JESUS_VERSES[`${book}:${chapter}`] || new Set()
  const isNT = NT_SET.has(book)
  const verseNums = sortedVerseNums(verses)

  // Scroll to target verse
  useEffect(() => {
    if (targetVerse && verseRefs.current[targetVerse]) {
      const timer = setTimeout(() => {
        verseRefs.current[targetVerse]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [targetVerse, verses])

  const vKey = (v) => `${book}:${chapter}:${v}`
  const isHL = (v) => !!highlights[vKey(v)]
  const isUL = (v) => !!underlines[vKey(v)]
  const isBM = (v) => bookmarks.some(b => b.key === vKey(v))
  const isSel = (v) => selectedVerses.has(v)

  const myWordAnns = (v) => wordAnnotations.filter(w => w.book === book && w.chapter === chapter && w.verse === v)

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: T.surface }}>
      {/* Chapter Header */}
      <div style={{
        textAlign: 'center',
        padding: '28px 20px 16px',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: T.sub,
          fontFamily: "'Cinzel', serif", marginBottom: 6,
        }}>
          {isNT ? 'New Testament' : 'Old Testament'}
        </div>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '1.9rem', fontWeight: 700,
          color: T.primary, letterSpacing: '0.03em', lineHeight: 1.1,
        }}>
          {book}
        </div>
        <div style={{
          fontSize: '0.75rem', letterSpacing: '0.14em',
          textTransform: 'uppercase', color: T.sub,
          fontFamily: "'Cinzel', serif", marginTop: 4,
        }}>
          Chapter {chapter}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <ChapBtn onClick={onPrev} T={T}>◂ Previous</ChapBtn>
          <ChapBtn onClick={onToggleChapterBookmark} T={T} active={isChapterBookmarked}>
            {isChapterBookmarked ? '★ Bookmarked' : '☆ Bookmark Chapter'}
          </ChapBtn>
          <ChapBtn onClick={onNext} T={T}>Next ▸</ChapBtn>
        </div>
      </div>

      {/* Verses */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: T.sub, fontStyle: 'italic' }}>
          Loading scripture…
        </div>
      ) : (
        <div style={{ padding: '14px 16px 120px' }}>
          {verseNums.map(v => {
            const hl = isHL(v)
            const ul = isUL(v)
            const bm = isBM(v)
            const sel = isSel(v)
            const red = settings.redLetter && isNT && jesusSet.has(v)
            const anns = myWordAnns(v)

            return (
              <div
                key={v}
                ref={el => { verseRefs.current[v] = el }}
                onClick={() => onVerseToggle(v)}
                style={{
                  padding: '8px 10px 8px 14px',
                  borderLeft: `3px solid ${sel ? T.primary : hl ? T.primary + '88' : 'transparent'}`,
                  borderRadius: '0 6px 6px 0',
                  marginBottom: 2,
                  cursor: 'pointer',
                  background: sel ? T.selBg : hl ? T.hlBg : 'transparent',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
              >
                {/* Bookmark dot */}
                {bm && (
                  <div style={{
                    position: 'absolute', right: 8, top: 10,
                    width: 6, height: 6, borderRadius: '50%',
                    background: T.accent,
                  }} />
                )}

                {/* Verse number */}
                {settings.verseNumbers && (
                  <span style={{
                    fontSize: '0.62em', color: T.sub,
                    verticalAlign: 'super', marginRight: 5,
                    fontFamily: "'Cinzel', serif", userSelect: 'none',
                  }}>
                    {v}
                  </span>
                )}

                {/* Verse text */}
                <span style={{
                  fontSize: settings.fontSize,
                  lineHeight: settings.lineHeight,
                  color: red ? T.redWord : T.text,
                  fontFamily: `'${settings.fontFamily}', Georgia, serif`,
                  textDecoration: ul ? 'underline' : 'none',
                  textDecorationColor: ul ? T.primary : undefined,
                  textUnderlineOffset: ul ? 3 : undefined,
                }}>
                  {verses[v]}
                </span>

                {/* Word annotations */}
                {anns.length > 0 && (
                  <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {anns.map(wa => (
                      <span key={wa.id} style={{
                        fontSize: '0.65rem', padding: '1px 6px',
                        borderRadius: 10, color: T.sub,
                        background: wa.type === 'highlight' ? wa.color + '33' : T.card,
                        border: `1px solid ${wa.color || T.primary}44`,
                      }}>
                        {wa.type === 'highlight' ? '🖊' : '_'} "{wa.text.slice(0, 24)}{wa.text.length > 24 ? '…' : ''}"
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ChapBtn({ children, onClick, T, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 15px',
        border: `1px solid ${active ? T.primary : T.border}`,
        borderRadius: 20,
        background: active ? `${T.primary}22` : 'transparent',
        color: active ? T.primary : T.sub,
        cursor: 'pointer',
        fontSize: '0.74rem',
        fontFamily: "'Cinzel', serif",
        letterSpacing: '0.05em',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}
