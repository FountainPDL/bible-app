import { lookupBundled } from '../data/index.js'

const verseCache = {}

export async function fetchVerses(book, chapter, translation) {
  const key = `${translation}:${book}:${chapter}`
  if (verseCache[key]) return verseCache[key]

  try {
    const result = await lookupBundled(book, chapter, translation)
    if (result) {
      verseCache[key] = result
      return result
    }
  } catch (e) {
    console.error('Bible data load error:', e)
  }

  return { 1: `[${book} ${chapter} could not be loaded]` }
}

export async function lookupRef(ref, translation) {
  const match = ref.trim().match(/^(.+?)\s+(\d+):(\d+)(?:[–-](\d+))?$/)
  if (!match) return { text: `[Invalid reference: "${ref}"]`, ref }
  const [, book, chStr, startStr, endStr] = match
  const chapter = parseInt(chStr, 10)
  const start   = parseInt(startStr, 10)
  const end     = endStr ? parseInt(endStr, 10) : start
  const verses  = await fetchVerses(book, chapter, translation)
  let text = ''
  for (let i = start; i <= end; i++) { if (verses[i]) text += `${i} ${verses[i]} ` }
  const label = `${book} ${chapter}:${start}${end > start ? `–${end}` : ''}`
  return { text: text.trim() || `[No text for ${label}]`, ref: label }
}

export function clearVerseCache() {
  Object.keys(verseCache).forEach(k => delete verseCache[k])
}
