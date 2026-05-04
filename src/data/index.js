// Bible data is loaded as JSON on demand — not bundled into JS.
// This keeps the startup bundle small and prevents WebView memory crashes.

const cache = {}

async function loadJson(path) {
  if (cache[path]) return cache[path]
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  cache[path] = await res.json()
  return cache[path]
}

const NT_BOOKS = new Set([
  'Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians',
  'Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians',
  '1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter',
  '1 John','2 John','3 John','Jude','Revelation'
])

function isNT(book) { return NT_BOOKS.has(book) }

/**
 * Lazy-load the correct JSON shard for a given book + translation.
 * Returns the full data object for that shard.
 */
async function getShard(book, translation) {
  const section = isNT(book) ? 'nt' : 'ot'
  const trans   = translation === 'KJV' ? 'kjv' : 'niv'
  const path    = `/bible/${trans}-${section}.json`
  return loadJson(path)
}

/**
 * Look up a chapter. Returns verse object or null.
 */
export async function lookupBundled(book, chapter, translation) {
  const shard = await getShard(book, translation)
  return shard[`${book}:${chapter}`] || null
}

export function isBundled() { return true }
