// ─── Complete Bible Data Index ────────────────────────────────────────────────
// KJV: 31,102 verses across 1,189 chapters — King James Version (1769), Public Domain
// NIV: 31,086 verses across 1,189 chapters — New International Version
//
// Data sourced from provided SQL databases and converted to JS at build time.
// Split into OT/NT files for manageable chunk sizes with Vite code-splitting.

import { KJV_OT } from './kjv-ot.js'
import { KJV_NT } from './kjv-nt.js'
import { NIV_OT } from './niv-ot.js'
import { NIV_NT } from './niv-nt.js'

// Merge OT + NT into single complete lookup maps
export const KJV_DATA = { ...KJV_OT, ...KJV_NT }
export const NIV_DATA = { ...NIV_OT, ...NIV_NT }

/**
 * Look up a chapter from the complete bundled Bible.
 * Returns verse object { 1: "text", 2: "text", ... } or null if not found.
 */
export function lookupBundled(book, chapter, translation) {
  const key = `${book}:${chapter}`
  const data = translation === 'KJV' ? KJV_DATA : NIV_DATA
  return data[key] || null
}

/**
 * Always returns true — both translations are now complete.
 */
export function isBundled() {
  return true
}
