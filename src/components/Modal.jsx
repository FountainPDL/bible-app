import React from 'react'

export default function Modal({ open, onClose, title, T, children }) {
  if (!open) return null
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 200, backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: T.surface,
        borderRadius: '18px 18px 0 0',
        padding: '20px 18px 36px',
        width: '100%', maxWidth: 900,
        maxHeight: '88vh', overflowY: 'auto',
        borderTop: `2px solid ${T.border}`,
      }}>
        {title && (
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1rem', fontWeight: 600,
            color: T.primary, marginBottom: 16,
          }}>
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export function FormLabel({ children, T }) {
  return (
    <label style={{
      fontSize: '0.7rem', color: T.sub,
      fontFamily: "'Cinzel', serif", letterSpacing: '0.1em',
      textTransform: 'uppercase', display: 'block', marginBottom: 5,
    }}>
      {children}
    </label>
  )
}

export function FormInput({ T, style, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: '100%', padding: '9px 12px',
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        background: T.card, color: T.text,
        fontSize: '0.88rem', fontFamily: 'inherit',
        marginBottom: 12, outline: 'none',
        transition: 'border-color 0.15s',
        ...style,
      }}
      onFocus={e => { e.target.style.borderColor = T.primary }}
      onBlur={e => { e.target.style.borderColor = T.border }}
    />
  )
}

export function FormTextarea({ T, style, ...props }) {
  return (
    <textarea
      {...props}
      style={{
        width: '100%', padding: '9px 12px',
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        background: T.card, color: T.text,
        fontSize: '0.88rem', fontFamily: 'inherit',
        marginBottom: 12, outline: 'none',
        resize: 'vertical', minHeight: 100,
        transition: 'border-color 0.15s',
        ...style,
      }}
      onFocus={e => { e.target.style.borderColor = T.primary }}
      onBlur={e => { e.target.style.borderColor = T.border }}
    />
  )
}

export function ModalButtons({ onCancel, onSave, saveLabel = 'Save ✦', T }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
      <button onClick={onCancel} style={{
        flex: 1, padding: 11,
        border: `1px solid ${T.border}`,
        borderRadius: 10, cursor: 'pointer',
        fontFamily: "'Cinzel', serif", fontSize: '0.8rem',
        background: 'transparent', color: T.sub,
        transition: 'all 0.15s',
      }}>
        Cancel
      </button>
      <button onClick={onSave} style={{
        flex: 2, padding: 11, border: 'none',
        borderRadius: 10, cursor: 'pointer',
        fontFamily: "'Cinzel', serif", fontSize: '0.8rem',
        fontWeight: 600, color: '#fff',
        background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
        transition: 'opacity 0.15s',
      }}>
        {saveLabel}
      </button>
    </div>
  )
}
