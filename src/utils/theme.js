/**
 * Convert hex color string to [h, s, l] array
 */
export function hexToHsl(hex) {
  if (!hex || hex.length < 7) return [270, 60, 40]
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
      default: h = 0
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

/**
 * Convert [h, s, l] to hex string
 */
export function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n) => {
    const k = (n + h / 30) % 12
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * Build the full theme token map from settings
 */
export function buildTheme(settings) {
  const { themeMode, primaryColor, accentColor } = settings
  const isDark = themeMode === 'dark' || themeMode === 'amoled'
  const isAmoled = themeMode === 'amoled'

  return {
    bg:        isAmoled ? '#000000' : isDark ? '#0F0A1A' : '#FFFFFF',
    surface:   isAmoled ? '#080408' : isDark ? '#160E24' : '#FDF8FF',
    card:      isAmoled ? '#0E080E' : isDark ? '#1E1030' : '#F5EEFF',
    cardHover: isAmoled ? '#150D15' : isDark ? '#261540' : '#EDE0FF',
    border:    isDark ? `${primaryColor}44` : `${primaryColor}2E`,
    text:      isDark ? '#EDE0FF' : '#1A0A2E',
    textMuted: isDark ? '#9B7FC0' : '#5A3A80',
    sub:       isDark ? '#7A5898' : '#7B4DB0',
    navBg:     isAmoled ? '#050305' : isDark ? '#120D1E' : '#FEFAFF',
    navBorder: isDark ? `${primaryColor}33` : `${primaryColor}20`,
    hlBg:      isDark ? `${primaryColor}2A` : `${primaryColor}18`,
    selBg:     isDark ? `${primaryColor}35` : `${primaryColor}22`,
    primary:   primaryColor,
    accent:    accentColor,
    redWord:   isDark ? '#FF7070' : accentColor,
    isDark,
    isAmoled,
  }
}

export const PRIMARY_PRESETS = [
  '#7B2FBE', '#9333EA', '#6D28D9', '#5B21B6',
  '#8B5CF6', '#A855F7', '#4C1D95', '#7C3AED',
]

export const ACCENT_PRESETS = [
  '#C0392B', '#E74C3C', '#DC2626', '#B91C1C',
  '#BE185D', '#DB2777', '#D97706', '#9A3412',
]

export const FONT_OPTIONS = [
  'EB Garamond',
  'Crimson Text',
  'Lora',
  'Merriweather',
  'Playfair Display',
  'Libre Baskerville',
  'Palatino Linotype',
  'Georgia',
  'Times New Roman',
]

export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=Merriweather:ital,wght@0,300;0,400;1,300&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&display=swap'
