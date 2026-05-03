import React from 'react'
import Modal, { FormLabel, FormInput, FormTextarea, ModalButtons } from '../components/Modal.jsx'

const HIGHLIGHT_COLORS = [
  '#7B2FBE', '#C0392B', '#F1C40F', '#27AE60',
  '#2980B9', '#E67E22', '#8E44AD', '#16A085',
]

export default function WordActionModal({ open, onClose, T, settings, selectedVerses, selectedText, selectedRef, onApply }) {
  const [form, setForm] = React.useState({ phrase: '', type: 'highlight', color: '#F1C40F', note: '' })

  React.useEffect(() => {
    if (open) setForm({ phrase: '', type: 'highlight', color: '#F1C40F', note: '' })
  }, [open])

  const handleApply = () => {
    onApply({ ...form, phrase: form.phrase || selectedText.slice(0, 80) })
    onClose()
  }

  const typeBtn = (val, label) => (
    <button onClick={() => setForm(f => ({ ...f, type: val }))} style={{
      padding: '6px 14px',
      border: `1.5px solid ${form.type === val ? T.primary : T.border}`,
      borderRadius: 20, cursor: 'pointer',
      background: form.type === val ? `${T.primary}22` : 'transparent',
      color: form.type === val ? T.primary : T.sub,
      fontFamily: "'Cinzel', serif", fontSize: '0.76rem',
      fontWeight: form.type === val ? 600 : 400,
    }}>{label}</button>
  )

  return (
    <Modal open={open} onClose={onClose} title="✏️ Annotate Word / Phrase" T={T}>
      {/* Selection preview */}
      <div style={{
        background: T.card, borderRadius: 8, padding: '10px 12px',
        marginBottom: 14, fontSize: '0.88rem',
        fontFamily: `'${settings.fontFamily}', serif`,
        color: T.text, lineHeight: 1.65,
        borderLeft: `3px solid ${T.primary}`,
      }}>
        {selectedText.slice(0, 220)}{selectedText.length > 220 ? '…' : ''}
      </div>
      <div style={{ fontSize: '0.72rem', color: T.sub, fontFamily: "'Cinzel', serif", marginBottom: 12 }}>
        From: {selectedRef}
      </div>

      <FormLabel T={T}>Specific word or phrase (optional — leave blank to apply to full selection)</FormLabel>
      <FormInput
        T={T}
        placeholder='e.g. "born again" or "God so loved"'
        value={form.phrase}
        onChange={e => setForm(f => ({ ...f, phrase: e.target.value }))}
      />

      <FormLabel T={T}>Annotation Type</FormLabel>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {typeBtn('highlight', 'Highlight')}
        {typeBtn('underline', 'Underline')}
        {typeBtn('note', 'Word Note')}
      </div>

      {form.type === 'highlight' && (
        <>
          <FormLabel T={T}>Highlight Color</FormLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {HIGHLIGHT_COLORS.map(c => (
              <div
                key={c}
                onClick={() => setForm(f => ({ ...f, color: c }))}
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: c,
                  cursor: 'pointer', transition: 'transform 0.15s',
                  border: form.color === c ? `3px solid ${T.text}` : `2px solid ${T.border}`,
                  transform: form.color === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${T.border}`, cursor: 'pointer', padding: 0, background: 'none' }} />
          </div>
        </>
      )}

      {form.type === 'note' && (
        <>
          <FormLabel T={T}>Note about this word or phrase</FormLabel>
          <FormTextarea
            T={T}
            placeholder="e.g. Greek word 'agape' meaning unconditional love…"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            style={{ minHeight: 80 }}
          />
        </>
      )}

      <ModalButtons T={T} onCancel={onClose} onSave={handleApply} saveLabel="Apply Annotation ✦" />
    </Modal>
  )
}
