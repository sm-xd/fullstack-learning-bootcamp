# Week 02: CSS & Responsive Design

## Project: Artify - Art Store Landing Page

A modern, elegant art store landing page built with pure HTML5 and CSS3 using mobile-first responsive design.

### Project Overview

| Feature | Implementation |
|---------|---------------|
| Layout | CSS Grid + Flexbox |
| Approach | Mobile-First |
| Breakpoints | 600px, 900px, 1200px |
| Styling | CSS Variables, Pastel Theme |

### Files

```
responsive-landing-site/
├── index.html    # Semantic HTML structure
└── style.css     # Mobile-first CSS
```

### Sections Built

1. **Navigation** - Fixed header with CSS-only hamburger menu
2. **Hero** - Full-screen with gradient overlay
3. **Gallery** - Responsive grid (1→2→3 columns)
4. **About** - Two-column layout on desktop
5. **Collections** - Pastel category cards
6. **Testimonials** - Customer reviews grid
7. **Highlights** - Stats section
8. **Footer** - Centered with social links

---

## Key Learnings

### 1. Mobile-First Design
```css
/* Base styles for mobile */
.gallery-grid { grid-template-columns: 1fr; }

/* Scale up for larger screens */
@media (min-width: 600px) {
    .gallery-grid { grid-template-columns: repeat(2, 1fr); }
}
```

### 2. CSS Variables
```css
:root {
    --color-pastel-pink: #FFD6E0;
    --space-md: 1.5rem;
    --transition: 0.3s ease;
}
```
**Benefits:** Single source of truth, easy theme changes, consistent spacing.

### 3. CSS Grid vs Flexbox

| Use Grid | Use Flexbox |
|----------|-------------|
| 2D layouts (rows + columns) | 1D layouts (row OR column) |
| Gallery, card grids | Navigation, centering |
| Equal-sized items | Flexible spacing |

### 4. CSS-Only Hamburger Menu
```css
.nav-toggle:checked ~ .nav-links { display: flex; }
.nav-toggle:checked ~ .nav-toggle-label span { background: transparent; }
```
Uses checkbox hack - no JavaScript needed!

### 5. Smooth Hover Effects
```css
.art-card {
    transition: all 0.3s ease;
}
.art-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}
```

### 6. Aspect Ratio for Images
```css
.art-card-image {
    aspect-ratio: 4/5;
    overflow: hidden;
}
```
Maintains consistent image proportions without height hacks.

### 7. Gradient Overlays
```css
.hero-overlay {
    background: linear-gradient(135deg, 
        rgba(255,214,224,0.85),
        rgba(230,217,255,0.85),
        rgba(217,240,255,0.85));
}
```

---

## Color Palette Used

| Color | Hex | Usage |
|-------|-----|-------|
| Pastel Pink | `#FFD6E0` | Accents, cards |
| Soft Lavender | `#E6D9FF` | Testimonials |
| Mint Green | `#DFF5E1` | Collection cards |
| Baby Blue | `#D9F0FF` | Highlights |
| Warm Cream | `#FFF6E5` | Backgrounds |

---

## Skills Practiced

- [x] Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- [x] CSS Custom Properties (Variables)
- [x] Flexbox for navigation & centering
- [x] CSS Grid for responsive layouts
- [x] Media queries (mobile-first)
- [x] CSS transitions & hover effects
- [x] Responsive images with `object-fit`
- [x] Accessible markup (ARIA labels, alt text)
