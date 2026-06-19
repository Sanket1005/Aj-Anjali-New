// ─────────────────────────────────────────────
// src/services/pageService.js
//
// Single source of truth for ALL WordPress data fetching.
// Every section component imports from here instead of
// writing its own fetch logic.
//
// Falls back to safe defaults if WordPress is unreachable
// or a field hasn't been filled in yet — the site never
// breaks, it just shows fallback content.
// ─────────────────────────────────────────────

import api from "../api/wordpress";

// ── Helper: resolve an ACF image field to a usable URL ──
// Handles both "Return Format: Image URL" (string) and
// "Return Format: Image ID" (number) just in case.
export async function resolveImage(value) {
  if (!value) return "";
  if (typeof value === "string" && value.startsWith("http")) return value;
  if (typeof value === "number" || /^\d+$/.test(value)) {
    try {
      const res = await api.get(`/media/${value}?_fields=source_url`);
      return res.data?.source_url || "";
    } catch (_) {
      return "";
    }
  }
  return "";
}

// ── HOME PAGE (Hero + About ACF fields) ──────────────
export const getHomePage = async () => {
  const response = await api.get("/pages?slug=home&_embed");
  return response.data[0] || null;
};

// ── TESTIMONIALS (Custom Post Type: testimonial) ─────
export const getTestimonials = async () => {
  const response = await api.get("/testimonial?per_page=50&_fields=id,acf");
  return response.data
    .map((post) => {
      const acf = post.acf || {};
      return {
        id: post.id,
        stars: Number(acf.stars) || 5,
        body: acf.body || "",
        name: acf.name || "",
        role: acf.role || "",
        initials: acf.initials || "",
      };
    })
    .filter((t) => t.body && t.name); // skip empty/incomplete entries
};

// ── GALLERY ITEMS (Custom Post Type: gallery_item) ───
export const getGalleryItems = async () => {
  const response = await api.get("/gallery_item?per_page=50&_fields=id,acf");
  const items = await Promise.all(
    response.data.map(async (post) => {
      const acf = post.acf || {};
      return {
        id: post.id,
        src: await resolveImage(acf.photo),
        caption: acf.caption || "",
      };
    })
  );
  return items.filter((g) => g.src); // skip items with no photo
};

// ── PORTFOLIO ITEMS (Custom Post Type: portfolio_item) ─
export const getPortfolioItems = async () => {
  const response = await api.get("/portfolio_item?per_page=50&_fields=id,acf");
  return response.data
    .map((post) => {
      const acf = post.acf || {};
      return {
        id: post.id,
        reelId: acf.reel_id || "",
        title: acf.pf_title || "",
        category: acf.category || "",
      };
    })
    .filter((p) => p.reelId); // skip items with no reel ID
};

// ── BRANDS (Custom Post Type: brand) ─────────────────
export const getBrands = async () => {
  const response = await api.get("/brand?per_page=50&_fields=id,acf");
  const items = await Promise.all(
    response.data.map(async (post) => {
      const acf = post.acf || {};
      return {
        id: post.id,
        name: acf.brand_name || "",
        initials: acf.initials || "",
        color: acf.color || "#888888",
        logo: await resolveImage(acf.logo),
      };
    })
  );
  return items.filter((b) => b.name);
};

// ── SERVICES (Custom Post Type: service) ─────────────
export const getServices = async () => {
  const response = await api.get("/service?per_page=50&_fields=id,acf");
  const items = await Promise.all(
    response.data.map(async (post) => {
      const acf = post.acf || {};
      return {
        id: post.id,
        title: acf.service_title || "",
        desc: acf.service_desc || "",
        icon: await resolveImage(acf.icon),
      };
    })
  );
  return items.filter((s) => s.title);
};
