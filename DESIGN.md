# 두근두근타운 채집도감 — Design System

> A cozy, dreamy game collection guide inspired by a starlit village.
> Mobile-first (max-width 480px), deployed on GitHub Pages as a static Vite + React SPA.

---

## 1. Design Philosophy

| Principle | Description |
|---|---|
| **Dreamy Night Sky** | The app lives in a twilight world — deep navy canvas with soft glowing accents that feel like fireflies in a forest village. |
| **Kawaii Premium** | Cute but not childish. Rounded shapes, bubbly typography, and candy-gradient accents balanced with glassmorphism sophistication. |
| **Game-Native** | Every UI element should feel like it belongs *inside* 두근두근타운 — pixel-art-friendly image containers, RPG-style stat grids, collectible card layouts. |
| **Ambient Immersion** | The logo's blurred colors bleed into the background, creating a living, breathing atmosphere that shifts subtly. |
| **Instant Readability** | Korean text must be crisp and scannable — large, bold names, clear hierarchy, minimal line-wrapping. |

---

## 2. Color Palette

### 2.1 Backgrounds (Dark-First)

| Token | Value | Usage |
|---|---|---|
| `--bg-deep` | `#111a37` | Page background — matches logo's navy sky |
| `--bg-surface` | `#1a254c` | Cards, modals, elevated surfaces |
| `--bg-card` | `rgba(26, 37, 76, 0.7)` | Semi-transparent card panels |
| `--bg-glass` | `rgba(255, 255, 255, 0.04)` | Glassmorphism base layer |
| `--bg-glass-hover` | `rgba(255, 255, 255, 0.08)` | Glassmorphism hover state |
| `--bg-input` | `rgba(255, 255, 255, 0.06)` | Form inputs, dropdowns |

### 2.2 Accent Colors (Neon Candy)

Derived from the logo's pink-purple-teal character palette:

| Token | Value | Glow | Usage |
|---|---|---|---|
| `--neon-pink` | `#ff6b9d` | `rgba(255,107,157,0.4)` | Primary accent — CTAs, active states, highlights |
| `--neon-purple` | `#a78bfa` | `rgba(167,139,250,0.3)` | Secondary accent — "전체 도감", bird category |
| `--neon-blue` | `#60a5fa` | `rgba(96,165,250,0.3)` | Info accent — time display, fish category |
| `--neon-green` | `#34d399` | `rgba(52,211,153,0.3)` | Success accent — insect category |
| `--neon-orange` | `#fbbf24` | `rgba(251,191,36,0.3)` | Warning accent — sunny weather, bird category |
| `--neon-cyan` | `#22d3ee` | — | Decorative — aurora gradients |

### 2.3 Text Colors

| Token | Value | Usage |
|---|---|---|
| `--text-primary` | `#f1f5f9` | Headings, card names |
| `--text-secondary` | `#94a3b8` | Descriptions, metadata |
| `--text-muted` | `#64748b` | Disabled states, footnotes |
| `--text-white` | `#ffffff` | On-accent text |

### 2.4 Gradients

| Token | Value | Usage |
|---|---|---|
| `--grad-primary` | `linear-gradient(135deg, #ff6b9d, #c084fc)` | Primary buttons, title text clips |
| `--grad-blue` | `linear-gradient(135deg, #60a5fa, #34d399)` | Info elements, fish highlights |
| `--grad-sunset` | `linear-gradient(135deg, #fbbf24, #f97316, #ef4444)` | Weather-warm elements |
| `--grad-aurora` | `linear-gradient(135deg, #22d3ee, #a78bfa, #ff6b9d)` | Decorative shimmer, loading states |

---

## 3. Typography

### 3.1 Font Stack

| Role | Font | Fallback | Weight Range |
|---|---|---|---|
| **Display / Titles** | `Jua` (Google Fonts) | `sans-serif` | 400 (single weight — inherently bold & bubbly) |
| **Body / UI** | `Outfit` (Google Fonts) | `-apple-system, BlinkMacSystemFont, sans-serif` | 300–800 |

### 3.2 Type Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| App Title (Logo) | Image-based | — | — | — |
| Section Headings | Jua | 17px | 400 | `--text-secondary` |
| Card Item Name | Outfit | 16px | 700 | `--text-primary` |
| Modal Name | Jua | 24px | 400 | `--grad-primary` (text-clip) |
| Button Text | Jua | 16–22px | 700 | `--text-white` |
| Metadata / Tags | Outfit | 10–12px | 600–700 | `--text-secondary` |
| Footer | Outfit | 10px | 400 | `--text-muted`, 50% opacity |

### 3.3 Korean Text Rules

- **Never wrap item names** — use `text-overflow: ellipsis` if needed.
- **Bold is default** for scannable content (≥600 weight for body text in lists).
- Jua is inherently rounded-bold; do not apply `font-weight: bold` on Jua text.

---

## 4. Spacing & Layout

### 4.1 Container

- **Max-width**: `440px` (mobile-optimized)
- **Padding**: `20px 16px` (desktop), `16px 12px` (≤440px)
- **Centered**: `margin: 0 auto`
- **Full-height**: `min-height: 100vh; display: flex; flex-direction: column`

### 4.2 Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `gap-xs` | 4px | Inline tag spacing |
| `gap-sm` | 8px | Button groups, compact lists |
| `gap-md` | 10–12px | Card list gaps, grid gaps |
| `gap-lg` | 14–16px | Section margins |
| `gap-xl` | 20px | Page section padding |

### 4.3 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 12px | Inputs, tags, small cards |
| `--radius-md` | 16px | Image wrappers, modal stat blocks |
| `--radius-lg` | 24px | Cards, navigation bars, buttons |
| `--radius-xl` | 32px | Setup card, modals |
| `--radius-full` | 9999px | Pills, badges, level indicators |

---

## 5. Component Patterns

### 5.1 Glassmorphism Card

The signature surface treatment. Used for all elevated panels.

```
background: rgba(255, 255, 255, 0.04)
backdrop-filter: blur(12–20px)
border: 1px solid rgba(255, 255, 255, 0.08)
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)
border-radius: var(--radius-lg) or var(--radius-xl)
```

### 5.2 Collection Item Card

Horizontal layout: `[64px image] [info block]`

- **Image container**: 64×64px, `border-radius: 16px`, white bg `#f6f6f6`, 2px glass border
- **Name**: 16px Outfit bold, primary text
- **Stats row**: Shadow size + Price, 0.85rem, secondary text, bold
- **Meta row**: Location pin emoji + weather tags
- **Level badge**: Pill shape, color-coded by level (1=gray, 2=green, 3=blue, 4=purple, 5=orange+glow)
- **Hover**: Slide right 4px, pink border glow, pink shadow
- **Click**: Opens detail modal

### 5.3 Detail Modal

Centered overlay with blur backdrop.

- **Overlay**: `rgba(0,0,0,0.6)` + `backdrop-filter: blur(8px)`
- **Card**: `--bg-surface`, `--radius-xl`, 28px padding, pink glow shadow
- **Image**: 120×120px centered, pink glow ring
- **Name**: Jua 24px, gradient text clip (`--grad-primary`)
- **Stats grid**: 2-column grid of stat blocks (shadow, price, type, level, location, weather, time)
- **Close button**: Top-right, 36px circle, muted → hover bright

### 5.4 Buttons

**Primary CTA (도감 열기)**:
- Full-width, 20px padding
- `--grad-primary` background, animated gradient shift (3s cycle)
- Jua 22px white text
- Pink glow shadow + blurred pseudo-element behind
- Hover: lift 3px, intensify glow
- Tap: scale(0.97)

**Mode Toggle Buttons**:
- Full-width, glass background
- Inactive: muted text, glass border
- Active (현재 잡을 수 있는): Pink-purple gradient bg, pink glow
- Active (전체 도감): Purple-blue gradient bg, purple glow

**Filter Tabs (물고기/곤충/새)**:
- Horizontal row, centered
- Column layout: `[emoji icon] [label]`
- Active: Scale 1.08, category-colored bg + border + glow

### 5.5 Time Slot Selector

2×2 grid of time-of-day cards:

| Slot | Icon | Color |
|---|---|---|
| 새벽 (0–6) | 🌃 | Indigo `#6366f1` |
| 오전 (6–12) | 🌄 | Amber `#f59e0b` |
| 오후 (12–18) | 🌇 | Red `#ef4444` |
| 저녁 (18–0) | 🌆 | Purple `#8b5cf6` |

- Active: Colored border + glow shadow, scale 1.04, white text
- Inactive: 50% opacity
- NOW badge: Tiny gradient pill, top-right, pulse animation

### 5.6 Weather Selector

3-column grid:

| Weather | Icon | Active Style |
|---|---|---|
| 맑음 | ☀️ | Orange border + glow |
| 비/눈 | 🌧️ | Blue border + glow |
| 무지개 | 🌈 | Purple gradient border + glow |

---

## 6. Ambient Background System

The most distinctive visual feature — the logo itself becomes the background atmosphere.

```css
.ambient-background {
  position: fixed;
  top: -20%; left: -20%;
  width: 140%; height: 140%;
  background-image: url('/logo.png');
  background-size: cover;
  background-position: center;
  filter: blur(140px) saturate(1.8) brightness(0.7);
  opacity: 0.8;
  z-index: -1;
  animation: pulse-ambient 10s infinite alternate ease-in-out;
}
```

This creates a warm pink-purple-navy gradient that breathes slowly, making the entire app feel alive without any static gradient definitions.

---

## 7. Animation & Motion

### 7.1 Page Transitions

| Transition | Animation | Duration |
|---|---|---|
| Landing → Guide | `fadeInRight` (opacity + translateX 30px) | 500ms ease |
| Guide → Landing | `fadeInUp` (opacity + translateY 30px) | 600ms ease |
| Modal open | `scaleIn` (opacity + scale 0.8→1) | 300ms spring |
| Modal close | Reverse scaleIn | 300ms |

### 7.2 Micro-Interactions

| Element | Trigger | Effect |
|---|---|---|
| Cards | Enter viewport | Staggered `cardSlideIn` (50ms delay per item) |
| Cards | Hover | `translateX(4px)`, pink border glow |
| Cards | Tap | `scale(0.98)` |
| Buttons | Tap | `scale(0.93–0.97)` |
| Active tab | Select | `scale(1.08)` with spring physics |
| NOW badge | Continuous | `pulse-ring` — scale 1→1.3, fade out |
| Ambient bg | Continuous | `pulse-ambient` — subtle scale + brightness shift, 10s cycle |
| CTA button | Continuous | `gradientShift` — animated gradient position, 3s cycle |
| Sparkle decorations | Continuous | `float` + `starTwinkle` — bobbing + opacity flicker |

### 7.3 Motion Library

Uses `motion/react` (Framer Motion) for:
- `AnimatePresence` for mount/unmount transitions
- `motion.div` / `motion.button` for declarative animations
- `whileHover`, `whileTap` for interaction states
- Spring physics (`stiffness: 200–300, damping: 25–30`)
- `layout` prop for smooth list reordering

---

## 8. Iconography

### 8.1 Emoji-Based Icons

No icon library — uses native emoji for warmth and game-like feel:

| Context | Icons Used |
|---|---|
| Categories | 🐟 물고기, 🐛 곤충, 🐦 새 |
| Time | 🌃🌄🌇🌆, 🕐, ⏰ |
| Weather | ☀️🌧️🌈🌤️ |
| Actions | ✨ (confirm), 🎣 (available), 📖 (all), 🔍 (empty) |
| Location | 📍 |
| Decorative | ✨🌟 (floating particles) |

### 8.2 In-Game Asset Icons

- **돈 (Money)**: `/src/data/돈_nobg.png` — 14×14px inline icon
- **취미 (Hobby Level)**: `/src/data/취미_nobg.png` — 14×14px inline icon
- **미발견 (Undiscovered)**: `/src/data/미발견.png` — placeholder for unknown creatures

---

## 9. Data Architecture

### 9.1 Collection Types

| Type | JSON File | Image Folder | Count |
|---|---|---|---|
| 물고기 (Fish) | `fish.json` | `fish_images/` | ~82 |
| 곤충 (Insect) | `insect.json` | `insect_images/` | ~64 |
| 새 (Bird) | `bird.json` | `bird_images/` | ~63 |

### 9.2 Item Schema

```json
{
  "id": "f1",
  "name": "민물배스",
  "type": "fish",
  "image_url": "/src/data/fish_images/민물배스.png",
  "hobby_level": 1,
  "location": "모든 강",
  "price": 75,
  "shadow_size": "중",
  "time_slots": ["06-12", "12-18", "18-00", "00-06"],
  "weathers": ["sunny", "rain", "rainbow"]
}
```

### 9.3 Level Color Coding

| Level | Color | Background | Extra |
|---|---|---|---|
| Lv.1 | `#94a3b8` | `rgba(148,163,184,0.1)` | — |
| Lv.2 | `--neon-green` | `rgba(52,211,153,0.1)` | — |
| Lv.3 | `--neon-blue` | `rgba(96,165,250,0.1)` | — |
| Lv.4 | `--neon-purple` | `rgba(167,139,250,0.1)` | — |
| Lv.5 | `--neon-orange` | `rgba(251,191,36,0.1)` | Orange glow shadow |
| Lv.6+ | `--neon-pink` | `rgba(255,107,157,0.1)` | Pink glow shadow |

---

## 10. Responsive Behavior

### 10.1 Breakpoints

| Breakpoint | Behavior |
|---|---|
| ≤440px | Reduce container padding (16px 12px), slightly smaller fonts |
| 441–768px | Default layout (440px max-width centered) |
| ≥769px | Same centered layout — this is a mobile-first app |

### 10.2 Touch Optimizations

- All tap targets ≥44px
- `whileTap: scale(0.93–0.97)` for tactile feedback
- No hover-dependent functionality (hover is enhancement only)
- Smooth scroll behavior enabled
- `-webkit-font-smoothing: antialiased`

---

## 11. GitHub Pages Deployment

### 11.1 Build Configuration

```js
// vite.config.js
export default defineConfig({
  base: '/두근두근타운-도감앱-v2/',  // repo name for GitHub Pages
  plugins: [react()],
})
```

### 11.2 Static Assets

- All creature images are local PNG files (not external URLs)
- Logo is in `/public/logo.png`
- No server-side rendering — pure client-side SPA
- Hash-based routing recommended for GitHub Pages compatibility

### 11.3 SEO

- Title: `두근두근타운 채집도감 | HeartBeat Town Collection Guide`
- Meta description: 두근두근타운에서 잡을 수 있는 물고기, 곤충, 새를 시간과 날씨별로 확인하세요
- Favicon: Custom SVG in `/public/favicon.svg`
- Open Graph image: Logo PNG

---

## 12. Do's and Don'ts

### ✅ Do

- Use glassmorphism for all elevated surfaces
- Keep neon glow effects subtle (0.3–0.4 opacity glow)
- Maintain the dreamy ambient background at all times
- Use Jua font for all headings and buttons (Korean-optimized bubbly font)
- Color-code categories consistently (blue=fish, green=insect, orange=bird)
- Use spring physics for interactive animations
- Keep card layouts horizontal for scanability

### ❌ Don't

- Don't use pure white backgrounds — darkest should be `--bg-surface`
- Don't use sharp corners — minimum radius is 12px
- Don't overwhelm with too many glow effects simultaneously
- Don't use generic system fonts for display text
- Don't break the 440px max-width container
- Don't use external image URLs (all assets must be local for GitHub Pages)
- Don't add heavy JavaScript libraries — keep the bundle lean for static hosting
