import { lookupBundled } from '../data/index.js'

// Session cache — avoids repeated object lookups for frequently visited chapters
const verseCache = {}

/**
 * Returns verses for a given book, chapter, and translation.
 * Both KJV (31,102 verses) and NIV (31,086 verses) are fully bundled —
 * no internet connection is ever required.
 *
 * @param {string} book         Full book name e.g. "Genesis", "John"
 * @param {number} chapter
 * @param {'KJV'|'NIV'} translation
 * @returns {Promise<Record<number, string>>}
 */
export async function fetchVerses(book, chapter, translation) {
  const cacheKey = `${translation}:${book}:${chapter}`

  // Session cache hit
  if (verseCache[cacheKey]) return verseCache[cacheKey]

  // Complete bundled data — always available offline
  const result = lookupBundled(book, chapter, translation)
  if (result) {
    verseCache[cacheKey] = result
    return result
  }

  // Should never reach here since both translations are complete,
  // but return a safe fallback just in case
  console.warn(`lookupBundled missed: ${translation} ${book} ${chapter}`)
  return { 1: `[${book} ${chapter} — verse data unavailable]` }
}

/**
 * Resolve a reference string like "John 3:16" or "Romans 8:28-39"
 * into { text, ref } for use in sermon/study blocks.
 */
export async function lookupRef(ref, translation) {
  const match = ref.trim().match(/^(.+?)\s+(\d+):(\d+)(?:[–-](\d+))?$/)
  if (!match) return { text: `[Invalid reference: "${ref}"]`, ref }

  const [, book, chStr, startStr, endStr] = match
  const chapter = parseInt(chStr, 10)
  const start   = parseInt(startStr, 10)
  const end     = endStr ? parseInt(endStr, 10) : start

  const verses = await fetchVerses(book, chapter, translation)
  let text = ''
  for (let i = start; i <= end; i++) {
    if (verses[i]) text += `${i} ${verses[i]} `
  }

  const refLabel = `${book} ${chapter}:${start}${end > start ? `–${end}` : ''}`
  return {
    text: text.trim() || `[No verse text found for ${refLabel}]`,
    ref: refLabel,
  }
}

/**
 * Clear the session cache (called when switching translations).
 */
export function clearVerseCache() {
  Object.keys(verseCache).forEach(k => delete verseCache[k])
}
