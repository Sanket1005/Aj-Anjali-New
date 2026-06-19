// ─────────────────────────────────────────────
// src/components/layout/Navbar.jsx
// Fixed top navigation bar.
// - Turns frosted-glass when user scrolls.
// - "MENU" button triggers full-screen overlay.
// ─────────────────────────────────────────────

import '../../styles/navbar.css'
import { NAV_LINKS } from '../../data/content'

export default function Navbar({ scrolled, onMenuOpen, onHover }) {
  return (
    <nav className={`rj-nav ${scrolled ? 'rj-nav--slim' : ''}`}>

      {/* Logo */}
      <a href="#home" className="nav-logo">RJ.ANJALI</a>

      {/* Desktop links */}
      <ul className="nav-links">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              onMouseEnter={() => onHover(true)}
              onMouseLeave={() => onHover(false)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Menu button (visible on all sizes) */}
      <button
        className="nav-menu-btn"
        onClick={onMenuOpen}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        aria-label="Open menu"
      >
        MENU
      </button>

    </nav>
  )
}
