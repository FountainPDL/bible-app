import React, { useState } from 'react'
import { OT_BOOKS, NT_BOOKS, CHAPTER_COUNTS } from '../constants/books.js'

export default function NavPage({ T, settings, onNavigate }) {
  const [step, setStep] = useState(1)
  const [selBook, setSelBook] = useState('John')
  const [selChapter, setSelChapter] = useState(3)
  const [selStart, setSelStart] = useState(1)
  const [selEnd, setSelEnd] = useState(1)
  const [search, setSearch] = useState('')

  const filter = (list) => list.filter(b => b.toLowerCase().includes(search.toLowerCase()))

  const inputStyle = {
    width: '100%', padding: '9px 13px',
    border: `1px solid ${T.border}`, borderRadius: 10,
    background: T.card, color: T.text,
    fontSize: '0.88rem', fontFamily: 'inherit',
    marginBottom: 12, outline: 'none',
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: T.surface }}>
      {/* Stepper */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '14px 16px', borderBottom: `1px solid ${T.border}`, gap: 0,
      }}>
        {[
          { n: 1, label: 'Book' },
          { n: 2, label: 'Chapter' },
          { n: 3, label: 'Verse' },
        ].map((s, i) => (
          <React.Fragment key={s.n}>
            <div
              onClick={() => step > s.n && setStep(s.n)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: step > s.n ? 'pointer' : 'default' }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                border: `2px solid ${step >= s.n ? T.primary : T.border}`,
                background: step > s.n ? T.primary : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontFamily: "'Cinzel', serif",
                color: step > s.n ? '#fff' : step === s.n ? T.primary : T.sub,
                transition: 'all 0.2s',
              }}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span style={{
                fontSize: '0.72rem', fontFamily: "'Cinzel', serif",
                letterSpacing: '0.06em',
                color: step === s.n ? T.primary : T.sub,
              }}>
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div style={{ flex: 1, height: 1, background: T.border, margin: '0 8px' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {/* ── Step 1: Book ── */}
        {step === 1 && (
          <>
            <input
              style={inputStyle}
              placeholder="Search books…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <SectionLabel T={T}>Old Testament</SectionLabel>
            <BookGrid books={filter(OT_BOOKS)} selected={selBook} T={T} onSelect={b => { setSelBook(b); setSelChapter(1); setSelStart(1); setSelEnd(1); setStep(2); setSearch('') }} />
            <SectionLabel T={T}>New Testament</SectionLabel>
            <BookGrid books={filter(NT_BOOKS)} selected={selBook} T={T} onSelect={b => { setSelBook(b); setSelChapter(1); setSelStart(1); setSelEnd(1); setStep(2); setSearch('') }} />
          </>
        )}

        {/* ── Step 2: Chapter ── */}
        {step === 2 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <BackBtn T={T} onClick={() => setStep(1)}>◂ {selBook}</BackBtn>
              <SectionLabel T={T} inline>Select Chapter</SectionLabel>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
              {Array.from({ length: CHAPTER_COUNTS[selBook] || 1 }, (_, i) => i + 1).map(c => (
                <button key={c} onClick={() => { setSelChapter(c); setSelStart(1); setSelEnd(1); setStep(3) }}
                  style={numBtnStyle(selChapter === c, T)}>
                  {c}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Step 3: Verse ── */}
        {step === 3 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <BackBtn T={T} onClick={() => setStep(2)}>◂ Ch {selChapter}</BackBtn>
              <SectionLabel T={T} inline>{selBook} {selChapter}</SectionLabel>
            </div>

            <div style={{
              fontSize: '0.76rem', color: T.sub, fontFamily: "'Cinzel', serif",
              letterSpacing: '0.06em', marginBottom: 10,
            }}>
              Mode: <strong style={{ color: T.primary }}>{settings.readingMode === 'chapter' ? 'Full Chapter (scrolls to verse)' : 'Verse / Range'}</strong>
            </div>

            {/* Verse range selectors */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.75rem', color: T.sub, fontFamily: "'Cinzel', serif", flexShrink: 0 }}>From</span>
              <select
                value={selStart}
                onChange={e => { const n = +e.target.value; setSelStart(n); if (selEnd < n) setSelEnd(n) }}
                style={selectStyle(T)}
              >
                {Array.from({ length: 200 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span style={{ fontSize: '0.75rem', color: T.sub, fontFamily: "'Cinzel', serif", flexShrink: 0 }}>To</span>
              <select
                value={selEnd}
                onChange={e => setSelEnd(+e.target.value)}
                style={selectStyle(T)}
              >
                {Array.from({ length: 200 }, (_, i) => i + 1).filter(n => n >= selStart).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Preview */}
            <div style={{
              padding: '10px 14px', background: T.card,
              borderRadius: 8, border: `1px solid ${T.border}`,
              marginBottom: 14, fontSize: '0.88rem',
              color: T.sub, fontStyle: 'italic',
              fontFamily: `'${settings.fontFamily}', serif`,
            }}>
              {selBook} {selChapter}:{selStart}{selEnd > selStart ? `–${selEnd}` : ''}
            </div>

            <button
              onClick={() => {
                const scrollTo = settings.readingMode === 'chapter' ? selStart : null
                onNavigate(selBook, selChapter, scrollTo)
                setStep(1)
              }}
              style={{
                width: '100%', padding: 13, border: 'none', borderRadius: 10,
                background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
                color: '#fff', cursor: 'pointer',
                fontFamily: "'Cinzel', serif", fontSize: '0.88rem',
                letterSpacing: '0.08em', fontWeight: 600,
              }}
            >
              Open Scripture ✦
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function BookGrid({ books, selected, T, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, marginBottom: 8 }}>
      {books.map(b => (
        <button key={b} onClick={() => onSelect(b)} style={{
          padding: '8px 4px',
          border: `1px solid ${selected === b ? T.primary : T.border}`,
          borderRadius: 6,
          background: selected === b ? T.primary : T.card,
          color: selected === b ? '#fff' : T.text,
          cursor: 'pointer', fontSize: '0.74rem',
          fontFamily: "'Lora', serif", textAlign: 'center',
          transition: 'all 0.15s',
        }}>
          {b}
        </button>
      ))}
    </div>
  )
}

function SectionLabel({ children, T, inline }) {
  return (
    <div style={{
      fontFamily: "'Cinzel', serif",
      fontSize: '0.67rem', letterSpacing: '0.14em',
      color: T.sub, textTransform: 'uppercase',
      padding: inline ? 0 : '8px 0 5px',
      margin: 0,
    }}>
      {children}
    </div>
  )
}

function BackBtn({ children, T, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 12px',
      border: `1px solid ${T.border}`, borderRadius: 20,
      background: 'transparent', color: T.sub,
      cursor: 'pointer', fontSize: '0.74rem',
      fontFamily: "'Cinzel', serif",
    }}>
      {children}
    </button>
  )
}

function numBtnStyle(active, T) {
  return {
    padding: '10px 2px',
    border: `1px solid ${active ? T.primary : T.border}`,
    borderRadius: 6,
    background: active ? T.primary : T.card,
    color: active ? '#fff' : T.text,
    cursor: 'pointer', fontSize: '0.82rem',
    fontFamily: "'Lora', serif", textAlign: 'center',
    transition: 'all 0.15s',
  }
}

function selectStyle(T) {
  return {
    flex: 1, background: T.card, color: T.text,
    border: `1px solid ${T.border}`, borderRadius: 8,
    padding: '8px 10px', fontSize: '0.86rem',
    fontFamily: 'inherit', outline: 'none',
  }
}
