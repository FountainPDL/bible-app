import React from 'react'
import Modal, { FormLabel, FormInput, FormTextarea, ModalButtons } from '../components/Modal.jsx'

export default function NoteModal({ open, onClose, T, noteForm, setNoteForm, onSave }) {
  return (
    <Modal open={open} onClose={onClose} title="📝 New Note" T={T}>
      <FormLabel T={T}>Topic / Title</FormLabel>
      <FormInput
        T={T}
        placeholder="e.g. Faith, Salvation, Grace, The Cross…"
        value={noteForm.topic}
        onChange={e => setNoteForm(f => ({ ...f, topic: e.target.value }))}
      />
      <FormLabel T={T}>Note</FormLabel>
      <FormTextarea
        T={T}
        placeholder="Your thoughts, observations, revelations…"
        value={noteForm.text}
        onChange={e => setNoteForm(f => ({ ...f, text: e.target.value }))}
        style={{ minHeight: 120 }}
      />
      <FormLabel T={T}>Verse References</FormLabel>
      <FormInput
        T={T}
        placeholder="John 3:16; Romans 8:28; Psalm 23:1"
        value={noteForm.refs}
        onChange={e => setNoteForm(f => ({ ...f, refs: e.target.value }))}
      />
      {noteForm.linkedRef && (
        <div style={{ fontSize: '0.76rem', color: T.primary, marginBottom: 10, fontFamily: "'Cinzel', serif" }}>
          Linked to: {noteForm.linkedRef}
        </div>
      )}
      <ModalButtons T={T} onCancel={onClose} onSave={onSave} saveLabel="Save Note ✦" />
    </Modal>
  )
}
