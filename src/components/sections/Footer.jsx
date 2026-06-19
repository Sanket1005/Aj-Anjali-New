// ─────────────────────────────────────────────
// src/components/layout/Footer.jsx
//
// Features:
//   • Terracotta marquee divider at top
//   • Brand col: logo, italic tagline, social icons
//   • Navigate / Services / Contact columns
//   • Link hover: terracotta underline slides in from left
//   • Social icons: rise + scale on hover
//   • Heartbeat animation on ♥
//   • Back-to-top button (smooth scroll)
//   • Keyboard accessible throughout
// ─────────────────────────────────────────────

import '../../styles/footer.css'

const MARQUEE = ['RJ Anjali', 'Radio Jockey', 'Live Host', 'Digital Creator', 'Bihar', 'Unfiltered', 'Unapologetic']

const NAV_LINKS = [
  { label: 'Home',     href: '#home'         },
  { label: 'About',    href: '#about'        },
  { label: 'Projects', href: '#projects'     },
  { label: 'Services', href: '#services'     },
  { label: 'Gallery',  href: '#gallery'      },
  { label: 'Contact',  href: '#contact'      },
]

const SERVICE_LINKS = [
  { label: 'Event Hosting',      href: '#services' },
  { label: 'Brand Promotions',   href: '#services' },
  { label: 'Digital Campaigns',  href: '#services' },
  { label: 'Radio Collabs',      href: '#services' },
]

const CONTACT_ITEMS = [
  {
    label: 'anjali@rjanjali.com',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 4.5L7 8.5L13 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: '+91 98765 43210',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 2.5C2 2.5 3 5 5 7C7 9 9.5 11 9.5 11L11.5 9.5C11.5 9.5 10 8 9.5 7.5C9 7 10 6 10.5 6.5C11 7 12.5 8.5 12.5 8.5C12.5 8.5 12 11.5 9.5 12C7 12.5 2 7 1.5 4.5C1 2 4.5 1.5 4.5 1.5L6 3C5 4 4.5 5 4 5C3.5 5 2 2.5 2 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Patna, Bihar — India',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1C4.8 1 3 2.8 3 5C3 8 7 13 7 13C7 13 11 8 11 5C11 2.8 9.2 1 7 1Z" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="11.2" cy="4.8" r=".8" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3.5" width="14" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6.5 6L10 8L6.5 10V6Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2.5L6.8 8.5L2 13.5H3.5L7.5 9.5L11 13.5H14L9 7L13.5 2.5H12L8.3 6.2L5 2.5H2Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="13" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <line x1="5" y1="7" x2="5" y2="11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="5" cy="5.2" r=".8" fill="currentColor"/>
        <path d="M8 11.5V9C8 7.9 8.9 7 10 7C11.1 7 12 7.9 12 9V11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
]

// ── MARQUEE ITEMS ────────────────────────────
const DOUBLED = [...MARQUEE, ...MARQUEE]

export default function Footer({ onHover }) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="footer" id="contact">

      {/* ── MARQUEE DIVIDER ── */}
      <div className="footer__marquee" aria-hidden="true">
        <div className="footer__marquee-track">
          {DOUBLED.map((item, i) => (
            <span className="footer__marquee-item" key={i}>
              {item}
              <span className="footer__marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="footer__body">

        {/* Brand */}
        <div className="footer__brand">
          <a href="#home" className="footer__logo">RJ.ANJALI</a>
          <p className="footer__tagline">
            "Jo dekhti hoon,<br />wo bolne ki aadi hoon."
          </p>
          <div className="footer__socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="footer__social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                onMouseEnter={() => onHover?.(true)}
                onMouseLeave={() => onHover?.(false)}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navigate */}
        <div className="footer__col">
          <h3 className="footer__col-title">Navigate</h3>
          <ul className="footer__links">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onMouseEnter={() => onHover?.(true)}
                  onMouseLeave={() => onHover?.(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="footer__col">
          <h3 className="footer__col-title">Services</h3>
          <ul className="footer__links">
            {SERVICE_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onMouseEnter={() => onHover?.(true)}
                  onMouseLeave={() => onHover?.(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h3 className="footer__col-title">Get In Touch</h3>
          {CONTACT_ITEMS.map((c, i) => (
            <div className="footer__contact-item" key={i}>
              <div className="footer__contact-icon">{c.icon}</div>
              <span className="footer__contact-text">{c.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ── DIVIDER ── */}
      <div className="footer__divider" />

      {/* ── BOTTOM BAR ── */}
      <div className="footer__bottom">
        <p className="footer__copy">
          © 2025 RJ Anjali Singh. Made with
          <span className="footer__heart" aria-label="love">♥</span>
          in Bihar.
        </p>

        {/* Back to top */}
        <button
          className="footer__top-btn"
          onClick={scrollToTop}
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => onHover?.(false)}
          aria-label="Back to top"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p className="footer__credit">
          Design &amp; Development by <a href="https://themagicmonks.com/" onMouseEnter={() => onHover?.(true)} onMouseLeave={() => onHover?.(false)}>The Magic Monks</a>
        </p>
      </div>

    </footer>
  )
}
