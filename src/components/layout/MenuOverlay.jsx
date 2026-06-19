// ─────────────────────────────────────────────
// src/components/layout/MenuOverlay.jsx
// Full-screen circular-reveal navigation menu.
// Opens from top-right corner with clip-path.
// ─────────────────────────────────────────────

import '../../styles/navbar.css'
import { NAV_LINKS } from '../../data/content'

export default function MenuOverlay({ isOpen, onClose, onHover }) {
  return (
    <div
      className={`menu-overlay ${isOpen ? 'menu-overlay--open' : ''}`}
      aria-modal="true"
      role="dialog"
      aria-label="Site navigation"
    >
      {/* Close button */}
      <button
        className="menu-overlay__close"
        onClick={onClose}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        aria-label="Close menu"
      >
        CLOSE
      </button>

      {/* Big nav links */}
      {NAV_LINKS.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          className="menu-overlay__link"
          onClick={onClose}
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
        >
          {label}
        </a>
      ))}

      {/* Bottom tagline */}
      <p className="menu-overlay__tagline">RJ · HOST · CREATOR · BIHAR</p>
    </div>
  )
}
