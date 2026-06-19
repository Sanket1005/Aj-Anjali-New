// ─────────────────────────────────────────────
// src/components/sections/Marquee.jsx
// Infinitely scrolling ticker strip below hero.
// Items are doubled so the loop is seamless.
// Pauses on hover.
// ─────────────────────────────────────────────

import '../../styles/marquee.css'
import { MARQUEE_ITEMS } from '../../data/content'

// Double the items so the CSS animation loops seamlessly
const DOUBLED = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

export default function Marquee() {
  return (
    <section className="marquee-strip" aria-hidden="true">
      <div className="marquee-track">
        {DOUBLED.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
            <span className="marquee-sep" />
          </span>
        ))}
      </div>
    </section>
  )
}
