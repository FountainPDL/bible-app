import React from 'react'

export default function TopBar({ book, chapter, translation, T, onToggleTranslation, onNewNote }) {
  return (
    <div style={{
      background: T.navBg,
      borderBottom: `1px solid ${T.navBorder}`,
      padding: '0 14px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(16px)',
    }}>
      {/* Logo */}
      <div style={{ flex: 1, lineHeight: 1.2 }}>
        <div style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: '0.82rem',
          fontWeight: 700,
          color: T.primary,
          letterSpacing: '0.03em',
        }}>
          FountainPDL
        </div>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.5rem',
          letterSpacing: '0.16em',
          color: T.accent,
          textTransform: 'uppercase',
          marginTop: 1,
        }}>
          Holy Bible
        </div>
      </div>

      {/* Current reference */}
      <span style={{
        fontSize: '0.78rem',
        color: T.sub,
        fontFamily: "'Cinzel', serif",
        letterSpacing: '0.04em',
        fontStyle: 'italic',
      }}>
        {book} {chapter}
      </span>

      {/* Translation toggle */}
      <button
        onClick={onToggleTranslation}
        style={{
          padding: '4px 11px',
          border: `1.5px solid ${T.primary}88`,
          borderRadius: 20,
          background: `${T.primary}18`,
          color: T.primary,
          fontSize: '0.7rem',
          cursor: 'pointer',
          fontFamily: "'Cinzel', serif",
          letterSpacing: '0.06em',
          fontWeight: 600,
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
        title={`Switch to ${translation === 'KJV' ? 'NIV' : 'KJV'}`}
      >
        {translation}
      </button>

      {/* Note button */}
      <button
        onClick={onNewNote}
        title="New note"
        style={{
          width: 34, height: 34, border: 'none',
          background: 'transparent',
          color: T.sub, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 8, transition: 'all 0.15s', flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </div>
  )
}
