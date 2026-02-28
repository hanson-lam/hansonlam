# Design System & Style Guide

## Core Principle

Create a design system first. Every spacing value, color, radius, weight, and animation must reference a token defined in `css/tokens.css`.

Inconsistency signals "vibe coding" more than any single element.

Design should feel intentional, engineered, and repeatable — not generated.

---

## Visual Direction

* Minimalist, high-contrast, technical aesthetic
* Monospace-first typography gives the site a developer identity
* References: Stripe docs, Linear, personal sites by engineers
* Avoid "AI startup aesthetic" — no gradients, no glow, no glassmorphism

---

## Colors

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#f0f0f0` | Page background |
| `--color-surface` | `#ffffff` | Cards (skill, project) |
| `--color-border` | `#d8d8d8` | Card and section borders |
| `--color-border-subtle` | `#e8e8e8` | Lighter dividers |
| `--color-text-primary` | `#1a1a1a` | Headings, nav active, strong content |
| `--color-text-secondary` | `#555555` | Body text, descriptions |
| `--color-text-tertiary` | `#999999` | Meta text, icons at rest, footer |
| `--color-tag-text` | `#444444` | Tag label text |
| `--color-tag-border` | `#c0c0c0` | Tag border (outlined style) |

* No fills on tags — use an outlined border style with transparent background
* No decorative accent colors; contrast comes from weight and size, not color
* Avoid pure black (`#000`) — use near-black (`#1a1a1a`) for primary text
* All values must reference a token; do not hardcode hex values in CSS

---

## Typography

* **Font**: JetBrains Mono (loaded via Google Fonts) — used for everything: body, headings, nav, tags, footer
* No mixing of font families; monospace is the design signature

### Type Scale (from `tokens.css`)

| Token | Size | Usage |
|---|---|---|
| `--text-xs` | 11px | Tags, meta labels |
| `--text-sm` | 13px | Body text in cards, nav links |
| `--text-base` | 15px | Default body text |
| `--text-md` | 18px | Card titles |
| `--text-lg` | 22px | Project card headings |
| `--text-xl` | 28px | Subheadings |
| `--text-2xl` | 40px | Responsive section headings |
| `--text-3xl` | 56px | Section headings (desktop) |
| `--text-4xl` | 80px | Hero name |

### Rules

* Limit weights to 3: `400` (regular), `500` (medium), `700` (bold)
* Section headings (`h2`) are center-aligned — this is intentional
* Hero name is intentionally large; it anchors the identity of the page
* Body paragraphs are left-aligned with generous line height (`1.75`)
* Max line length for body text: ~65–70 characters (`max-width: 680px` on the About block)
* Tags use uppercase with `letter-spacing: 0.06em` and `font-size: 11px`
* Nav links use uppercase with `letter-spacing: 0.05em`

---

## Layout & Spacing

* **Spacing system**: 8px grid — all values come from `--space-1` through `--space-12`
* **Max content width**: `900px` — enforced by `.container`
* **Nav height**: `60px`, fixed to top
* **Section padding**: `120px` top/bottom (`--space-12`) on desktop, `80px` (`--space-10`) on ≤768px

### Grid structures

| Section | Layout |
|---|---|
| Skills | 2-column grid, single-column on mobile (≤720px) |
| Projects | 2-column grid, single-column on mobile (≤720px) |
| About | Single centered column, max-width `680px` |
| Hero | Centered flex column |

* No arbitrary positioning — all layout uses CSS Grid or Flexbox anchored to the token grid

---

## Components

### Nav
* Centered horizontally; no logo or wordmark
* Links: uppercase, monospace, `13px`
* Active state: bottom border underline (`2px solid --color-nav-active`)
* Box shadow appears on scroll (`nav.scrolled`) — not visible at top of page

### Tags
* Outlined style: transparent background, `1px solid --color-tag-border`
* Uppercase, monospace, `11px`, `letter-spacing: 0.06em`
* Border radius: `--radius-sm` (4px)
* No filled or colored tags

### Skill Cards
* White background (`--color-surface`), `1px` border, `--radius-lg` (12px) corner
* Header row: SVG icon + bold title side by side
* Skills listed as bullet points using CSS `::before` pseudo-element (gray filled circle)
* No hover effect on skill cards — they are informational, not interactive

### Project Cards
* Same card style as skill cards (white, bordered, rounded)
* Contents: title → description → tags → GitHub/external link icons
* Tags live between description and icon links
* Link icons: GitHub and external link SVG, `20px`, gray at rest, near-black on hover
* No arrow or "view project" button — icons only

### Footer
* Centered, single line
* Font: monospace, `13px`, `--color-text-tertiary`
* No links, no social icons — just the copyright line

---

## Interactions & Animations

* Every animation must have a clear purpose
* Use easing curves (`cubic-bezier`), never `linear`
* Keep durations consistent: `--duration-fast` (150ms) for hovers, `--duration-base` (200ms) for state transitions

### Defined animations

| Animation | Purpose | Duration |
|---|---|---|
| Nav box shadow on scroll | Indicates page has scrolled | 200ms |
| Nav link color + underline | Active section feedback | 150ms |
| Social / link icon color | Hover feedback | 150ms |
| Hero typing animation | Identity, personality | Per-character (80ms type / 40ms delete) |
| Scroll cue bounce | Draw eye downward | 2s loop, `ease-in-out` |

* No bounce, elastic, or exaggerated motion
* No animation overload — only the elements listed above animate

---

## Interactions & Behavior

* Nav active state tracks the current section via `IntersectionObserver` — no manual tracking
* Typing animation in the hero loops through phrases defined in `js/main.js`; update the `phrases` array with real content
* All interactive elements have `:hover` states
* All icon links have `aria-label` attributes for accessibility
* No fake toggles, static carousels, or broken UI patterns

---

## Copywriting

* Write like a real person describing real work
* Be direct and specific — avoid vague filler:
  * ❌ "Passionate developer who loves crafting clean code"
  * ✅ "I work on [specific thing] at [context]. Right now I'm focused on [thing]."
* No placeholder names, fake testimonials, or generic AI-generated copy
* Typing animation phrases should reflect real roles or descriptors, not marketing slogans
* Project descriptions: say what the project does and why you built it, not what stack it uses

---

## Responsiveness

* Two main breakpoints: `720px` (tablets) and `480px` (small mobile)
* At `≤720px`: skill grid and project grid collapse to single column, section headings scale down
* At `≤480px`: container padding reduces, hero name scales further
* Test readability on small screens — monospace at small sizes can compress poorly

---

## Accessibility

* All icon-only links must have `aria-label`
* Decorative SVGs must have `aria-hidden="true"`
* Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`
* Color contrast must be WCAG AA compliant (text on `#f0f0f0` background)
* Ensure focus states are visible for keyboard navigation

---

## Technical Consistency

Reuse tokens for:

* Colors
* Spacing
* Typography (size, weight)
* Border radius
* Shadow
* Animation durations and easing

* Never hardcode a value that has a token equivalent
* CSS is split across four files with strict responsibilities:
  * `tokens.css` — all design tokens (single source of truth)
  * `base.css` — reset, global type, utility classes
  * `components.css` — nav, tags, skill cards, project cards, footer, animations
  * `layout.css` — page structure, section spacing, grids, breakpoints

---

## Anti–Vibe Coding Checklist

Reject any design or code that includes:

* Hardcoded hex values, pixel sizes, or durations outside `tokens.css`
* Gradient backgrounds or hero overlays
* Glow effects, neon accents, or colored shadows
* Tags with filled/colored backgrounds
* Center-aligned body paragraphs (headings and hero only)
* Animations without a defined purpose
* Placeholder or fake content in production
* Inconsistent border radii or spacing across similar components
* A sans-serif or display font mixed in with JetBrains Mono

---

## Final Standard

The site should feel like it was built by an engineer with taste.

Not a template. Not a Figma export. Not AI-generated.

If a design choice cannot be justified by the system — remove it.