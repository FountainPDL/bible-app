/**
 * Format a timestamp to a readable date+time string
 */
export function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/**
 * Format a short date only
 */
export function formatShortDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

/**
 * Build a verse reference string from parts
 */
export function buildRef(book, chapter, start, end) {
  if (!start) return `${book} ${chapter}`
  if (!end || end === start) return `${book} ${chapter}:${start}`
  return `${book} ${chapter}:${start}–${end}`
}

/**
 * Parse a ref like "John 3:16" or "Romans 8:28-39"
 */
export function parseRef(ref) {
  const match = ref.trim().match(/^(.+?)\s+(\d+):(\d+)(?:[–\-](\d+))?$/)
  if (!match) return null
  const [, book, chapter, start, end] = match
  return {
    book,
    chapter: parseInt(chapter),
    start: parseInt(start),
    end: end ? parseInt(end) : parseInt(start),
  }
}

/**
 * Get sorted verse numbers from a verse object
 */
export function sortedVerseNums(verses) {
  return Object.keys(verses).map(Number).sort((a, b) => a - b)
}
