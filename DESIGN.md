<design-context>
# narablyat Design System — Liquid Glass

## 1. Visual Identity

narablyat is a Spicetify theme built around **Frosted Glass** — clean, modern, and tactile like Apple's iOS/macOS. The UI recedes behind glass surfaces so album art and music take center stage. Two modes share the same design language: Frost White (light) and Dark Neutral (dark).

**Key Characteristics:**
- Frosted glass surfaces with `blur(20px) saturate(180%)` — iOS Control Center weight
- Electric mint-green (`#00e676`) as the sole accent — functional only, never decorative
- Very rounded corners (20–28px) — Apple squircle geometry
- No hover states — focus and active states only
- Title Case button labels — Apple convention, not Spotify uppercase
- Album art provides color — the UI itself stays neutral

---

## 2. Color Palette

### Accent
| Token | Value | Use |
|---|---|---|
| Accent | `#00e676` | Play controls, active states, focus rings, CTAs |
| Accent Active | `#00ff87` | Pressed/active state |
| Accent Tint | `rgba(0, 230, 118, 0.20)` | Background tint, selected row |
| Accent Ring | `rgba(0, 230, 118, 0.28)` | Focus ring |

### Light Mode — Frost White
| Token | Value | Role |
|---|---|---|
| Base | `#f5f5f7` | Page background |
| Surface | `#ffffff` | Card, container |
| Glass | `rgba(255, 255, 255, 0.72)` | Frosted panel surface |
| Glass Elevated | `rgba(255, 255, 255, 0.82)` | Modal, dropdown |
| Glass Subtle | `rgba(255, 255, 255, 0.52)` | Topbar, overlay |
| Text | `#1d1d1f` | Primary text |
| Subtext | `#6e6e73` | Secondary text, inactive |
| Border | `rgba(0, 0, 0, 0.08)` | Subtle edge |
| Edge Highlight | `rgba(255, 255, 255, 0.60)` | Inset top border on glass |

### Dark Mode — Dark Neutral
| Token | Value | Role |
|---|---|---|
| Base | `#0a0a0a` | Page background |
| Surface | `#1c1c1e` | Card, container |
| Glass | `rgba(28, 28, 30, 0.72)` | Frosted panel surface |
| Glass Elevated | `rgba(28, 28, 30, 0.82)` | Modal, dropdown |
| Glass Subtle | `rgba(28, 28, 30, 0.52)` | Topbar, overlay |
| Text | `#f5f5f7` | Primary text |
| Subtext | `#8e8e93` | Secondary text, inactive |
| Border | `rgba(255, 255, 255, 0.10)` | Dim edge |
| Edge Highlight | `rgba(255, 255, 255, 0.12)` | Inset top border on glass |

### Semantic
| Token | Value | Use |
|---|---|---|
| Error | `#ff453a` | Destructive, error state |
| Warning | `#ff9f0a` | Warning state |
| Info | `#0a84ff` | Informational state |

---

## 3. Glass Effect System

Every glass element uses three layers:

```
Layer 1 — Backdrop blur
  backdrop-filter: blur(20px) saturate(180%)

Layer 2 — Frosted surface
  background: rgba(255,255,255,0.72)   ← Light
  background: rgba(28,28,30,0.72)      ← Dark

Layer 3 — Edge highlight (via box-shadow inset)
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.60)   ← Light
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12)   ← Dark
```

### Glass Variants

| Variant | Opacity | Use Case |
|---|---|---|
| `glass-base` | 0.72 | Card, sidebar panel, topbar |
| `glass-elevated` | 0.82 | Modal, dialog, dropdown |
| `glass-subtle` | 0.52 | Background overlay, secondary surface |

### Shadow Scale

| Level | Value | Use |
|---|---|---|
| Resting | `0 2px 8px rgba(0,0,0,0.08)` | Cards at rest |
| Elevated | `0 8px 24px rgba(0,0,0,0.12)` | Modal, menu |
| Focus Ring | `0 0 0 3px rgba(0,230,118,0.28)` | Input/button focus |

---

## 4. Corner Radius Scale

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 8px | Badge, tag, chip |
| `--radius-sm` | 12px | Button, input |
| `--radius-md` | 20px | Card, panel |
| `--radius-lg` | 28px | Modal, dialog |
| `--radius-xl` | 32px | Large container |
| `--radius-pill` | 9999px | Search bar, nav pill |
| `--radius-circle` | 50% | Play button, avatar, icon |

---

## 5. Typography

Font stack inherits from Spicetify (SpotifyMixUI/CircularSp family).

| Role | Size | Weight | Notes |
|---|---|---|---|
| Title | 22px | 700 | Section header |
| Heading | 16px | 600 | Card title |
| Body | 14px | 400 | Track name, description |
| Caption | 12px | 400 | Artist, metadata |
| Label | 12px | 600 | Button text, chip |
| Micro | 10px | 500 | Badge, count |

**Principles:**
- Title Case on all buttons and labels — no uppercase
- Normal letter-spacing — no wide tracking
- Line-height 1.4 for body, 1.2 for title
- Bold/regular binary: 700 or 400 for most text, 600 sparingly

---

## 6. Component Patterns

### Buttons

| Type | Background | Border | Radius | Use |
|---|---|---|---|---|
| Primary | `#00e676` | none | pill | Play, primary CTA |
| Glass | `glass-base` | `rgba(255,255,255,0.40)` | `--radius-sm` | Secondary action |
| Ghost | transparent | `rgba(0,0,0,0.12)` / `rgba(255,255,255,0.15)` | pill | Follow, minor action |
| Circle | `#00e676` | none | 50% | Play/pause control |

Active state: `transform: scale(0.97)`. No hover states.

### Cards & Containers
- Background: `glass-base`
- Radius: `--radius-md` (20px)
- Shadow: resting level
- Border: 1px subtle edge color
- Active: `transform: scale(0.98)`. No hover.

### Search / Input
- Shape: pill (`--radius-pill`)
- Background: `glass-subtle`
- Border: `rgba(0,0,0,0.08)` / `rgba(255,255,255,0.10)`
- Focus: accent border + focus ring shadow

### Modal / Dialog
- Background: `glass-elevated`
- Radius: `--radius-lg` (28px)
- Backdrop: `rgba(0,0,0,0.30)` behind
- `::before` — white highlight streak at top edge
- `::after` — optional accent blob (animated)

### Progress & Volume Bars
- Rail: subtext color, height 4px, pill ends
- Fill: `#00e676`
- Handle: 12px circle, `#00e676`

---

## 7. Do's and Don'ts

### Do
- Apply `backdrop-filter: blur(20px) saturate(180%)` on every glass element
- Use `#00e676` only for play controls, active states, and focus rings
- Use `--radius-md` (20px) or larger on cards and modals — Apple squircle feel
- Use edge highlight `inset 0 1px 0 rgba(255,255,255,X)` on every glass surface
- Use focus and active states — skip hover entirely
- Target elements via `data-testid`, `aria-label`, `main-*`, `x-*` selectors

### Don't
- Don't use solid backgrounds where glass belongs
- Don't use `#00e676` decoratively or on large background areas
- Don't use heavy Spotify-style shadows (`rgba(0,0,0,0.5)`) — too dark for this theme
- Don't use uppercase + wide letter-spacing on buttons
- Don't use square or subtly rounded corners — always follow the radius scale
- Don't add hover states — this is a deliberate design decision

---

## 8. Agent Prompt Guide

### Quick Reference
- Light base: `#f5f5f7` / Dark base: `#0a0a0a`
- Glass light: `rgba(255,255,255,0.72)` / Glass dark: `rgba(28,28,30,0.72)`
- Text light: `#1d1d1f` / Text dark: `#f5f5f7`
- Subtext light: `#6e6e73` / Subtext dark: `#8e8e93`
- Accent: `#00e676` (both modes)

### Glass Component Checklist
1. `backdrop-filter: blur(20px) saturate(180%)`
2. Semi-transparent background (0.72 base / 0.82 elevated / 0.52 subtle)
3. `box-shadow: inset 0 1px 0 <edge-highlight>`
4. Border: 1px subtle edge color
5. Radius: `--radius-md` minimum for cards, `--radius-lg` for modals

### Example Prompts
- "Frosted card: `rgba(255,255,255,0.72)` bg, `blur(20px) saturate(180%)`, 20px radius, inset 0 1px 0 rgba(255,255,255,0.6), resting shadow."
- "Glass modal: `rgba(255,255,255,0.82)` bg, 28px radius, elevated shadow, accent blob ::after."
- "Primary button: `#00e676` bg, pill shape, 14px SpotifyMixUI weight 600, Title Case."
- "Search pill: `rgba(255,255,255,0.52)` bg, pill radius, focus ring rgba(0,230,118,0.28)."

</design-context>

Use the design system above for all UI you generate.
