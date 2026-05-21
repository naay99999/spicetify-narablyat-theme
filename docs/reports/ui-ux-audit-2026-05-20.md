# UI/UX Audit — narablyat Theme
**Date:** 2026-05-20  
**Scheme audited:** suudLorLight  
**Screenshots:** Search results view + Home view

---

## 1. Design Style Alignment

### Overall

The theme's Liquid Glass identity is landing in the key structural areas. The floating now-playing bar and the topbar search pill are the two most visible signatures of the design — both render correctly as rounded-pill glass containers with blur. Everything else is in various states of partial implementation.

| Area | Target | Actual | Status |
|---|---|---|---|
| Now-playing bar | Floating pill, `blur(30px)`, shimmer streak | Floating pill with green play button, visible separation from content | ✅ |
| Topbar search pill | Rounded pill, `blur(24px)`, green accent blob | Pill shape rendered, clear+home buttons visible | ✅ |
| Filter chips (Home) | Glass pill, green selected state | "All" selected shows darker treatment; unselected look mostly flat | ⚠️ |
| Filter chips (Search) | Same glass pill pattern | Render as flat grey pills — glass/border effect is not visible | ⚠️ |
| Sidebar (left) | Glass surface, `blur(12px)` | Rendered white/opaque — blur not discernible over ambient background | ⚠️ |
| Cards (home quick-access) | `blur(16px)`, rounded corners | Rounded corners present, square cards have flat fill — no glass depth | ⚠️ |
| Right panel | `blur(18px)`, glass tint | Album art dominates; glass border barely visible on left edge | ⚠️ |
| Search result rows | Flat list rows (by design) | Flat — consistent with design intent | ✅ |
| Ambient background gradient | Soft lavender→green gradient behind all surfaces | Faintly visible through glass panels; very subtle | ⚠️ |

---

## 2. Glass Effect Quality

### Now-playing Bar
The strongest glass implementation. The pill floats correctly with breathing room at the bottom edges. The shimmer streak (`::before` diagonal gradient) contributes subtle dimension. The noise texture is not visible at this scale but that is expected.

### Topbar Search Pill
Renders as a clean pill. At rest the background reads as near-white translucent — the glass surface is present. The green accent blob (`::after` radial gradient) is not visible in the inactive state screenshot; it should become visible on focus, which couldn't be verified statically.

### Sidebar
The left sidebar (`Root__nav-bar`) has `blur(12px) saturate(140%)` applied, but over the soft `#fafafa` ambient background the blur has almost nothing to work with — both surface and background are near-white. The visual result is indistinguishable from a flat panel. The glass effect here depends entirely on the ambient blobs providing color variation in the background.

### Right Panel
The right sidebar panel shows blur on the album art itself (Spotify's native artwork blur), but the glass panel surface (`blur(18px) saturate(155%)`) isn't creating a distinct frosted boundary. The `border-left: 1px solid var(--glass-border)` is effectively invisible against the near-white content.

### Cards
Quick-access playlist cards (Home view, grid section) appear flat with clean rounded corners. The `blur(16px)` on `.main-card-card` should create a frosted look, but white cards over a near-white background produce no visible depth. The ambient blobs are the key prerequisite here — if blob visibility is low, card glass disappears.

---

## 3. Contrast Analysis

### Background & Text

| Pair | Foreground | Background | Ratio | WCAG AA (4.5:1) | WCAG AA Large (3:1) |
|---|---|---|---|---|---|
| Body text | `#111111` | `#fafafa` | ~18.1:1 | ✅ Pass | ✅ Pass |
| Subtext | `#5f5f5f` | `#fafafa` | ~5.9:1 | ✅ Pass | ✅ Pass |
| Subtext on card | `#5f5f5f` | `#ffffff` | ~7.0:1 | ✅ Pass | ✅ Pass |
| Placeholder text | `#5f5f5f` at 80% opacity | `#fafafa` | ~4.7:1 | ⚠️ Marginal | ✅ Pass |

### Accent Color (`#1ed760`)

This is the most significant contrast issue in the theme.

| Pair | Ratio | WCAG AA (3:1 icons/large) | WCAG AA (4.5:1 text) |
|---|---|---|---|
| `#1ed760` on `#ffffff` | **~1.85:1** | ❌ Fail | ❌ Fail |
| `#1ed760` on `#fafafa` | **~1.82:1** | ❌ Fail | ❌ Fail |
| `#ffffff` on `#1ed760` | **~1.85:1** | ❌ Fail | ❌ Fail |

The accent is used primarily as:
- Play/pause button fill (white icon on green background) — fails WCAG
- Active filter chip tint at `rgba(30, 215, 96, 0.14)` — only decorative, not text
- Sidebar active item indicator
- Progress bar fill

**Implication:** The play/pause button (white icon on `#1ed760`) fails WCAG AA icon contrast (3:1 minimum). In practice, the large circle and bold icon are perceptually legible, but it is a technical accessibility failure. This is Spotify's original accent color applied to the button, so it's a known upstream trade-off.

The accent tints used for selected states (`rgba(30, 215, 96, 0.08–0.14)`) are purely decorative backgrounds and don't affect text legibility — those are fine.

### Glass Surface Text

The modal input text (inside `.spice-glass-dialog`) uses `color: #ffffff` against `--glass-ink` which is `rgba(28, 28, 30, 0.72)` — effective dark background.

| Pair | Ratio | WCAG AA |
|---|---|---|
| `#ffffff` on `rgba(28,28,30,0.72)` over white | ~7.8:1 effective | ✅ Pass |

Good. The search modal input text reads clearly.

---

## 4. Per-Component Findings

### 4.1 Filter Chips — Search Page (Screenshot 1)
The chips (`All`, `Songs`, `Artists`, `Albums`, `Playlists`, etc.) appear as flat light-grey pills. The glass border and backdrop blur are either not rendering or are invisible because the main content area background is opaque white. The selected state (`All`) shows a darker background, which is Spotify's native active state rather than the custom green tint.

**Root cause:** `.main-home-filterChipsSection` targets home filter chips. Search-page tab chips may use a different selector — they likely aren't being caught by the current CSS rules.

### 4.2 Filter Chips — Home Page (Screenshot 2)
The three chips (`All`, `Music`, `Podcasts`) look reasonable. The selected `All` chip has a visible active treatment. The unselected ones still appear flat without visible glass borders.

### 4.3 Ambient Blobs
The lavender-to-green ambient gradient is faintly detectable through glass panels, most visible in the now-playing bar area. The blobs themselves (`spice-ambient-blob-1/2`) aren't distinct because their `blur(80px)` and `blur(60px)` spreads are large enough to become very diffuse — good for subtlety, but it means glass surfaces have very little color variation to blur against, weakening the overall effect.

### 4.4 Now-playing Bar
This is the strongest area. The bar floats correctly, uses green accent for the play button and progress fill, and is visually separated from the content area. The album art thumbnail is round which adds a nice contrast to the pill bar shape. The trailing icons (add, queue, fullscreen) are small but consistent.

### 4.5 Right Panel
The panel shows artist/album artwork prominently. The glass treatment creates a subtle frosted boundary on the left edge. "Switch to video" button and "Related music videos" section text are readable. The frosted effect works best when there's colorful content behind it — the cover art here provides that background, so the blur is more effective than on the flat-background panels.

### 4.6 Sidebar
Renders essentially as a flat white panel. The "Your Library" text, playlist names, and icons are all correctly styled and readable. Glass depth is missing but usability is unaffected.

---

## 5. Summary of Issues

| Priority | Issue | Component | Notes |
|---|---|---|---|
| P1 | Play button fails WCAG contrast (1.85:1) | Now-playing bar | `#fff` icon on `#1ed760`; Spotify upstream trade-off |
| P2 | Filter chips on search page not getting glass treatment | Search results | Selector mismatch — may need additional tab/chip targeting |
| P2 | Ambient blobs too diffuse to provide meaningful background variation | Global | Glass effect depends on color contrast behind surfaces |
| P3 | Sidebar glass effect invisible | Left nav-bar | Same-luminance surface + background eliminates perceptible blur |
| P3 | Cards glass effect invisible on light backgrounds | Main content cards | Need darker/colored ambient to show frosted effect |
| P3 | Right panel glass border barely visible | Right sidebar | `rgba(255,255,255,0.40)` border merges with white background |
| Info | Green tint active states (low-opacity backgrounds) are decorative-only | All chips/rows | Correct pattern; no contrast concern for decorative use |

---

## 6. Recommendations

1. **Filter chip selectors (search page):** Inspect the search tab bar with DevTools to identify the actual class or `data-testid` for search category chips. They likely use a different DOM structure than the home filter chips.

2. **Ambient blob intensity:** Consider increasing `spice-ambient-blob-1` opacity from `0.55` to `0.70–0.80` and `spice-ambient-blob-2` from `0.40` to `0.55`. Richer background color gives glass surfaces more to blur against, making the frosted effect visible without changing the overall palette.

3. **Sidebar differentiation:** Add a very subtle background tint to `Root__nav-bar` (e.g., `rgba(240, 237, 248, 0.85)`) to separate it visually from the content area even when the blur has nothing to work with.

4. **Right panel border:** Increase `--glass-border` opacity for the right panel specifically, or add a small box-shadow on the left edge to create a visible depth boundary.

5. **Play button contrast:** The green-on-white/white-on-green contrast cannot be fixed without changing Spotify's accent color. If accessibility is a priority, consider a slightly darker green variant for the button specifically (e.g., `#18b950`) which would improve the ratio to ~2.3:1 — still below WCAG AA but noticeably better.
