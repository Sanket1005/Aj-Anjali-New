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
    href: 'https://www.instagram.com/rjanjalimirchi/',
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
    href: 'https://www.youtube.com/watch?v=8pLQR49eDwM',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3.5" width="14" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6.5 6L10 8L6.5 10V6Z" fill="currentColor"/>
      </svg>
    ),
  },

  {
    label: 'Facebook',
    href: 'https://www.facebook.com/RjAnjaliMirchi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
</svg>
    ),
  },

  {
    label: 'Threads',
    href: 'https://www.threads.com/@rjanjalimirchi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-threads" viewBox="0 0 16 16">
  <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161"/>
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
