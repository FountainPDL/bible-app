import React from 'react'

export default function ActionBar({ selectedVerses, book, chapter, T, onHighlight, onUnderline, onBookmark, onWordAction, onNote, onClear, highlights, underlines, bookmarks }) {
  if (selectedVerses.size === 0) return null

  const sorted = [...selectedVerses].sort((a, b) => a - b)
  const ref = `${book} ${chapter}:${sorted.join(',')}`

  const anyHL = sorted.some(v => highlights[`${book}:${chapter}:${v}`])
  const anyUL = sorted.some(v => underlines[`${book}:${chapter}:${v}`])
  const anyBM = sorted.some(v => bookmarks.some(b => b.key === `${book}:${chapter}:${v}`))

  const btnStyle = (active, accent = false) => ({
    padding: '7px 11px',
    border: `1px solid ${active ? (accent ? T.accent : T.primary) : T.border}`,
    borderRadius: 10,
    background: active ? (accent ? T.accent : T.primary) : T.card,
    color: active ? '#fff' : T.text,
    cursor: 'pointer',
    fontSize: '0.72rem',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.04em',
    display: 'flex', alignItems: 'center', gap: 5,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  })

  return (
    <div style={{
      position: 'fixed',
      bottom: 68, left: '50%', transform: 'translateX(-50%)',
      background: T.navBg,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: '10px 12px',
      display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center',
      maxWidth: 560, width: 'calc(100% - 24px)',
      boxShadow: `0 8px 32px ${T.primary}33`,
      backdropFilter: 'blur(16px)',
      zIndex: 45,
      animation: 'slideUp 0.2s ease',
    }}>
      {/* Selection info row */}
      <div style={{
        width: '100%', textAlign: 'center',
        fontSize: '0.68rem', color: T.sub,
        fontFamily: "'Cinzel', serif", letterSpacing: '0.06em',
        paddingBottom: 6,
        borderBottom: `1px solid ${T.border}`,
        marginBottom: 2,
      }}>
        {selectedVerses.size} verse{selectedVerses.size !== 1 ? 's' : ''} · {ref}
      </div>

      <button style={btnStyle(anyHL)} onClick={onHighlight}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        {anyHL ? 'Remove Highlight' : 'Highlight'}
      </button>

      <button style={btnStyle(anyUL)} onClick={onUnderline}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
          <line x1="4" y1="21" x2="20" y2="21"/>
        </svg>
        {anyUL ? 'Remove Underline' : 'Underline'}
      </button>

      <button style={btnStyle(anyBM)} onClick={onBookmark}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        {anyBM ? 'Bookmarked' : 'Bookmark'}
      </button>

      <button style={btnStyle(false)} onClick={onWordAction}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
        Word/Phrase
      </button>

      <button style={btnStyle(false)} onClick={onNote}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Note
      </button>

      <button onClick={onClear} style={{
        ...btnStyle(false),
        background: T.card,
        color: T.sub,
        border: `1px solid ${T.border}`,
      }}>
        ✕ Clear
      </button>
    </div>
  )
}
