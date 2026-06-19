// ─────────────────────────────────────────────
// src/App.jsx
// Root component
// Connected with WordPress + ACF
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'

// UI
import PageCover from './components/ui/PageCover'
import Cursor from './components/ui/Cursor'

// Layout
import Navbar from './components/layout/Navbar'
import MenuOverlay from './components/layout/MenuOverlay'

// Sections
import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'
import About from './components/sections/About'
import Portfolio from './components/sections/Portfolio'
import Services from './components/sections/Services'
import Testimonials from './components/sections/Testimonials'
import Gallery from './components/sections/Gallery'
import Footer from './components/sections/Footer'
import Brands from './components/sections/Brands'
import Contact from './components/sections/Contact'

// Hooks
import { useCursor } from './hooks/useCursor'
import { useScrolled } from './hooks/useScrolled'

// API
import { getHomePage } from './services/pageService'

export default function App() {

  // ── State ──────────────────────────────────
  const [loaded, setLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // WORDPRESS DATA
  const [pageData, setPageData] = useState(null)

  // Custom cursor
  const { dot, ring, isLarge, setIsLarge } = useCursor()

  // Navbar slim mode
  const scrolled = useScrolled(30)

  // ── Intro Animation ────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120)

    return () => clearTimeout(t)
  }, [])

  // ── Fetch WordPress Home Page ──────────────
  useEffect(() => {

    const fetchHomePage = async () => {
      try {

        const data = await getHomePage()

        setPageData(data || {})

      } catch (error) {

        console.error('[App] Failed to fetch home page:', error.message)
        // Still let the site render with empty data — every section
        // has its own fallback content, so nothing breaks.
        setPageData({})

      }
    }

    fetchHomePage()

  }, [])

  // ── Loading Screen ─────────────────────────
  if (pageData === null) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}
      >
        Loading...
      </div>
    )
  }

  // ── Render ─────────────────────────────────
  return (
    <>
      {/* Intro wipe */}
      <PageCover visible={loaded} />

      {/* Custom Cursor */}
      <Cursor
        dot={dot}
        ring={ring}
        isLarge={isLarge}
      />

      {/* Fullscreen Menu */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onHover={setIsLarge}
      />

      {/* Navbar */}
      <Navbar
        scrolled={scrolled}
        onMenuOpen={() => setMenuOpen(true)}
        onHover={setIsLarge}
      />

      {/* ── PAGE SECTIONS ───────────────────── */}
      <main>

        {/* HERO */}
        <Hero
          loaded={loaded}
          onHover={setIsLarge}
          data={pageData}
        />

        {/* MARQUEE */}
        <Marquee />

        {/* ABOUT */}
        <About
          data={pageData}
        />

        {/* PORTFOLIO */}
        <Portfolio
          onHover={setIsLarge}
          data={pageData}
        />

        {/* SERVICES */}
        <Services
          onHover={setIsLarge}
          data={pageData}
        />

        {/* TESTIMONIALS */}
        <Testimonials
          onHover={setIsLarge}
          data={pageData}
        />

        {/* GALLERY */}
        <Gallery
          onHover={setIsLarge}
          data={pageData}
        />

        {/* CONTACT */}
        <Contact
          onHover={setIsLarge}
          data={pageData}
        />

        {/* BRANDS */}
        <Brands
          onHover={setIsLarge}
          data={pageData}
        />

        {/* FOOTER */}
        <Footer
          onHover={setIsLarge}
          data={pageData}
        />

      </main>
    </>
  )
}