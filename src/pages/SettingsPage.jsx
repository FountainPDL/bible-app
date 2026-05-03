import React from 'react'
import { PRIMARY_PRESETS, ACCENT_PRESETS, FONT_OPTIONS } from '../utils/theme.js'

export default function SettingsPage({ T, settings, updateSetting, onClear }) {
  const Toggle = ({ settingKey, label, sub }) => (
    <div style={rowStyle}>
      <div>
        <div style={labelStyle(T)}>{label}</div>
        {sub && <div style={subStyle(T)}>{sub}</div>}
      </div>
      <label style={{ position: 'relative', width: 44, height: 24, flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={!!settings[settingKey]}
          onChange={e => updateSetting(settingKey, e.target.checked)}
          style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: settings[settingKey] ? T.primary : T.border,
          borderRadius: 12, cursor: 'pointer', transition: '0.3s',
        }}>
          <div style={{
            position: 'absolute',
            width: 18, height: 18,
            left: settings[settingKey] ? 23 : 3,
            top: 3, background: '#fff',
            borderRadius: '50%', transition: '0.3s',
          }} />
        </div>
      </label>
    </div>
  )

  const ColorRow = ({ label, presets, settingKey }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={subStyle(T, true)}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
        {presets.map(c => (
          <div
            key={c}
            onClick={() => updateSetting(settingKey, c)}
            style={{
              width: 30, height: 30, borderRadius: '50%', background: c,
              cursor: 'pointer', transition: 'transform 0.15s',
              border: settings[settingKey] === c ? `3px solid ${T.text}` : `2px solid ${T.border}`,
              transform: settings[settingKey] === c ? 'scale(1.15)' : 'scale(1)',
            }}
            title={c}
          />
        ))}
        {/* Custom color picker */}
        <input
          type="color"
          value={settings[settingKey]}
          onChange={e => updateSetting(settingKey, e.target.value)}
          title="Custom color"
          style={{
            width: 30, height: 30, borderRadius: '50%',
            border: `2px solid ${T.border}`, cursor: 'pointer',
            padding: 0, background: 'none',
          }}
        />
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: T.surface }}>

      {/* ── Translation ── */}
      <Section title="Translation" T={T}>
        <div style={rowStyle}>
          <div style={labelStyle(T)}>Active Translation</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['KJV', 'NIV'].map(t => (
              <button key={t} onClick={() => updateSetting('translation', t)} style={{
                padding: '5px 14px',
                border: `1.5px solid ${settings.translation === t ? T.primary : T.border}`,
                borderRadius: 20, cursor: 'pointer',
                background: settings.translation === t ? `${T.primary}22` : 'transparent',
                color: settings.translation === t ? T.primary : T.sub,
                fontFamily: "'Cinzel', serif", fontSize: '0.76rem',
                fontWeight: settings.translation === t ? 600 : 400,
              }}>{t}</button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Theme ── */}
      <Section title="Theme" T={T}>
        <div style={rowStyle}>
          <div style={labelStyle(T)}>Mode</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {[
              { val: 'light', label: 'Light' },
              { val: 'dark', label: 'Dark' },
              { val: 'amoled', label: 'AMOLED Black' },
            ].map(opt => (
              <button key={opt.val} onClick={() => updateSetting('themeMode', opt.val)} style={{
                padding: '5px 12px',
                border: `1.5px solid ${settings.themeMode === opt.val ? T.primary : T.border}`,
                borderRadius: 20, cursor: 'pointer',
                background: settings.themeMode === opt.val ? `${T.primary}22` : 'transparent',
                color: settings.themeMode === opt.val ? T.primary : T.sub,
                fontFamily: "'Cinzel', serif", fontSize: '0.73rem',
                fontWeight: settings.themeMode === opt.val ? 600 : 400,
              }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <Toggle settingKey="autoNightMode" label="Auto Night Mode" sub={`Switches to dark at ${settings.nightStart}:00`} />
        {settings.autoNightMode && (
          <div style={rowStyle}>
            <div style={labelStyle(T)}>Night starts at hour</div>
            <input type="range" min="18" max="23" value={settings.nightStart}
              onChange={e => updateSetting('nightStart', +e.target.value)}
              style={{ accentColor: T.primary, width: 120, cursor: 'pointer' }} />
            <span style={{ fontSize: '0.78rem', color: T.sub, minWidth: 28 }}>{settings.nightStart}:00</span>
          </div>
        )}
      </Section>

      {/* ── Colors ── */}
      <Section title="Custom Colors" T={T}>
        <ColorRow label="Primary Color (Purple family)" presets={PRIMARY_PRESETS} settingKey="primaryColor" />
        <ColorRow label="Accent Color (Red family)" presets={ACCENT_PRESETS} settingKey="accentColor" />
        <div style={{ fontSize: '0.74rem', color: T.sub, fontFamily: "'Lora', serif", lineHeight: 1.5 }}>
          Tap the color circle at the end of each row to pick any custom color.
        </div>
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography" T={T}>
        <div style={rowStyle}>
          <div style={labelStyle(T)}>Font Size ({settings.fontSize}px)</div>
          <input type="range" min="13" max="30" value={settings.fontSize}
            onChange={e => updateSetting('fontSize', +e.target.value)}
            style={{ accentColor: T.primary, width: 120, cursor: 'pointer' }} />
        </div>
        <div style={rowStyle}>
          <div style={labelStyle(T)}>Line Spacing ({settings.lineHeight})</div>
          <input type="range" min="1.3" max="2.6" step="0.1" value={settings.lineHeight}
            onChange={e => updateSetting('lineHeight', +e.target.value)}
            style={{ accentColor: T.primary, width: 120, cursor: 'pointer' }} />
        </div>
        <div style={rowStyle}>
          <div style={labelStyle(T)}>Font Family</div>
          <select
            value={settings.fontFamily}
            onChange={e => updateSetting('fontFamily', e.target.value)}
            style={{ background: T.card, color: T.text, border: `1px solid ${T.border}`, borderRadius: 8, padding: '5px 10px', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none' }}
          >
            {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        {/* Font preview */}
        <div style={{ padding: '10px 14px', background: T.card, borderRadius: 8, border: `1px solid ${T.border}`, fontSize: settings.fontSize * 0.85, fontFamily: `'${settings.fontFamily}', Georgia, serif`, color: T.text, lineHeight: settings.lineHeight, fontStyle: 'italic', marginTop: 4 }}>
          "For God so loved the world…" — John 3:16
        </div>
      </Section>

      {/* ── Reading ── */}
      <Section title="Reading" T={T}>
        <Toggle settingKey="verseNumbers" label="Show Verse Numbers" />
        <Toggle settingKey="redLetter" label="Red Letter (Words of Christ)" sub="New Testament only" />
        <div style={rowStyle}>
          <div>
            <div style={labelStyle(T)}>Reading Mode</div>
            <div style={subStyle(T)}>Chapter = open full chapter (scroll to verse)</div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {['chapter', 'verse'].map(m => (
              <button key={m} onClick={() => updateSetting('readingMode', m)} style={{
                padding: '5px 12px',
                border: `1.5px solid ${settings.readingMode === m ? T.primary : T.border}`,
                borderRadius: 20, cursor: 'pointer',
                background: settings.readingMode === m ? `${T.primary}22` : 'transparent',
                color: settings.readingMode === m ? T.primary : T.sub,
                fontFamily: "'Cinzel', serif", fontSize: '0.73rem',
                fontWeight: settings.readingMode === m ? 600 : 400, textTransform: 'capitalize',
              }}>{m}</button>
            ))}
          </div>
        </div>
        <div style={rowStyle}>
          <div>
            <div style={labelStyle(T)}>Display Mode</div>
            <div style={subStyle(T)}>Scroll, Book (page flip), Dual Page (landscape)</div>
          </div>
          <select
            value={settings.displayMode}
            onChange={e => updateSetting('displayMode', e.target.value)}
            style={{ background: T.card, color: T.text, border: `1px solid ${T.border}`, borderRadius: 8, padding: '5px 10px', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none', flexShrink: 0 }}
          >
            <option value="scroll">Scroll</option>
            <option value="book">Book</option>
            <option value="dual">Dual Page</option>
          </select>
        </div>
      </Section>

      {/* ── Data Management ── */}
      <Section title="Data Management" T={T}>
        {[
          { label: 'Clear Reading History', key: 'history' },
          { label: 'Clear All Bookmarks', key: 'bookmarks' },
          { label: 'Clear Highlights & Underlines', key: 'highlights' },
          { label: 'Clear All Notes', key: 'notes' },
          { label: 'Clear All Sermons', key: 'sermons' },
          { label: 'Clear All Marathons', key: 'marathons' },
        ].map(({ label, key }) => (
          <div key={key} style={rowStyle}>
            <span style={labelStyle(T)}>{label}</span>
            <button onClick={() => onClear(key)} style={{
              padding: '5px 14px', border: `1px solid ${T.border}`, borderRadius: 8,
              background: 'transparent', color: T.sub, cursor: 'pointer',
              fontSize: '0.76rem', fontFamily: "'Cinzel', serif",
            }}>Clear</button>
          </div>
        ))}
      </Section>

      {/* ── About ── */}
      <Section title="About" T={T}>
        <p style={{ fontSize: '0.82rem', color: T.sub, lineHeight: 1.75, fontFamily: "'Lora', serif" }}>
          <strong style={{ color: T.primary }}>FountainPDL's Holy Bible</strong><br />
          Version 1.0.0<br /><br />
          King James Version (1769 Blayney Edition) — Public Domain<br />
          New International Version — NIV® © Biblica, used for personal study<br /><br />
          All annotations, notes, bookmarks, highlights and history are stored
          locally on your device and never sent to any server.
        </p>
      </Section>

      {/* Bottom spacer */}
      <div style={{ height: 24 }} />
    </div>
  )
}

function Section({ title, T, children }) {
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <div style={{
        padding: '12px 16px 6px',
        fontFamily: "'Cinzel', serif", fontSize: '0.68rem',
        letterSpacing: '0.14em', color: T.sub, textTransform: 'uppercase',
        borderBottom: `1px solid ${T.border}55`,
      }}>
        {title}
      </div>
      <div style={{ padding: '8px 16px 12px' }}>
        {children}
      </div>
    </div>
  )
}

const rowStyle = {
  display: 'flex', alignItems: 'center',
  justifyContent: 'space-between', gap: 10, marginBottom: 12,
}

const labelStyle = (T) => ({ fontSize: '0.86rem', color: T.text })
const subStyle = (T, bold) => ({ fontSize: '0.71rem', color: T.sub, marginTop: bold ? 0 : 1 })
