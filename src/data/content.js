// ─────────────────────────────────────────────
//  src/data/content.js
//  Edit ALL text content for the site here.
//  No need to dig into component files.
// ─────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'HOME',     href: '#home' },
  { label: 'ABOUT',    href: '#about' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'SERVICES', href: '#services' },
  { label: 'CONTACT',  href: '#contact' },
]

export const HERO = {
  // Small pill tag at the top
  pill: 'RJ · HOST · CREATOR · UNFILTERED & UNAPOLOGETIC',



  // First word (upright / bold)
  titleUpright: 'Anjali Singh  Voices',

  // Remaining words (italic / light) — animate in one by one
  titleItalic: ['Opinions Energy'],

  // Body description
  description:
    'Radio Jockey, Host & Digital Personality from Bihar — creating conversations that people actually remember.',

  // Call-to-action buttons
  ctaPrimary: { label: 'WATCH SHOW REEL', href: '#reel' },
  ctaGhost:   { label: 'VIEW PROJECTS ↗', href: '#projects' },

  // Stats bottom-right
  stats: [
    { value: '8+',   label: 'YEARS ON AIR' },
    { value: '50M+', label: 'LISTENERS'    },
    { value: '200+', label: 'EPISODES'     },
  ],
}

// Marquee strip — repeated automatically
export const MARQUEE_ITEMS = [
  'RJ', 'HOST', 'CREATOR', 'UNFILTERED',
  'UNAPOLOGETIC', 'BIHAR', 'RADIO', 'DIGITAL',
]
