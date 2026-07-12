# Refactor Plan — Design System Hardening (2026-07)

**Spec:** [`design-spec.md`](./design-spec.md) is the source of truth; this plan is the execution order.
**Audit basis:** full review of `user.css`, `theme.js`, `color.ini`, and all docs on 2026-07-12.

Four phases, each independently shippable as one or more Conventional Commits. Apply and manually verify (both schemes) at the end of every phase. Rollback at any point: `git checkout` + `spicetify restore backup apply`.

**Out of scope:** redesigning the `color.ini` palette, adding new components/surfaces, touching Spotify behavior beyond styling.

---

## Phase 1 — Tokenize & Clean House

*Goal: no behavior change visible to the eye (except two bug fixes), but every value becomes a token. Unlocks everything after.*

1. **Consolidate `:root`.** Merge the five scattered `:root` blocks (`user.css:1, 28, 42, 422, 683`) into one TOKENS section per spec §10, in spec §4 layer order. Keep the Spotify-internal variable overrides (`--essential-bright-accent`, `--shadow-*`, etc.) but move them to the QUARANTINE section with comments.
2. **Accent ramp.** Add `--accent`, `--accent-ink`, `--accent-a08/-a12/-a28/-a40/-a75` (spec §4.1). Replace all ~20 `rgba(22, 163, 74, …)` literals, consolidating alphas per the mapping in §4.1. Also replace the raw `#16a34a` in the chip color-inversion fix and `--search-*` tokens.
3. **Elevation tokens.** Add `--glass-blur-1..5` / `--glass-sat-1..5`; replace every `backdrop-filter` literal. Right sidebar and lyrics move 18px → level 2 (16px) per spec §4.4.
4. **Surface tokens.** Add `--surface-input/chip/modal/panel/popover/solid/nav` (spec §4.2); replace the corresponding `color-mix(... var(--spice-card) ...)` literals.
5. **Radius.** Add `--radius-full: 9999px`; replace raw `9999px`. Player bar 24px → `--radius-lg` (D5).
6. **Fix: topbar double-styling.** `theme.js` adds `.spice-glass-topbar` to the same element `.main-globalNav-searchInputContainer` styles (user.css:64 vs 259 — conflicting blur/shadow). Keep `.spice-glass-topbar` as the single container-level block (it's the resilient, multi-selector path); reduce the `.main-globalNav-searchInputContainer` rules to internals only (input text, placeholder, icons, clear button). Delete the now-dead `--search-bg-hover` and `--search-border-hover`.
7. **Fix: global modal scrim (D7).** Delete the bare `.GenericModal__overlay { background: transparent }` (user.css:59); keep only the `.spice-glass-overlay`-scoped rule so non-search modals regain their dim backdrop.
8. **Delete dead/broken code:** all empty `/* Hover removed */` comments, the `/* TODO: */` header, `--spice-rgb-selected-row: #ffffff` (invalid — `-rgb-` vars take `r,g,b` triplets), the stray empty-comment block at user.css:355-360.
9. **Restructure file** into the five sections of spec §10.

**Acceptance:** side-by-side before/after in light scheme shows no visual difference except (6) topbar renders one consistent glass and (7) non-search modals have scrims again. `grep -cE 'rgba\(22, ?163, ?74|9999px|#16a34a' user.css` returns 0 outside the TOKENS/QUARANTINE sections.

Commit: `refactor(css): consolidate design tokens and file structure` (+ `fix(glass): restore modal scrim and dedupe topbar styling` if split).

## Phase 2 — Dark Scheme Parity

*Goal: `suudLorDark` actually works.*

1. **Scheme stamp (D6).** In `theme.js`, add a small IIFE: read computed `--spice-main`, compute relative luminance, set `document.documentElement.dataset.scheme = 'dark' | 'light'`. Re-run on a lightweight interval-free signal (e.g. observe `<html>` style/attribute changes) so `spicetify config color_scheme … apply` is picked up on reload.
2. **Dark token block.** Add the single `html[data-scheme="dark"]` block overriding: `--glass-border`, `--glass-highlight`, `--glass-shadow`, `--edge-border`, `--ambient-gradient`, `--ambient-lavender-tint`, `--ambient-blob-lavender`, `--ambient-blob-green` (starting values in spec §4.3 / §6 — tune visually and write the final values back into the spec).
3. **De-hardcode light-only literals** so they use the new tokens: body gradient, blob gradients, nav-bar lavender mix, card lavender mix, `--glass-border`/`--glass-highlight` consumers, list-row hover `#f3f3f3` → `--row-hover`, `kbd` colors → mixes over `--spice-text`.
4. **Lyrics (D3).** Replace the red-tinted mix with the neutral formula in spec §6.
5. **Sweep:** `grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' user.css` — every hit must be inside TOKENS or QUARANTINE.

**Acceptance:** full manual checklist passes in `suudLorDark` — dark ambient background with dark-tuned blobs, no white-glow borders, readable list rows and hover, kbd chips legible, lyrics neutral. Light scheme unchanged.

Commit: `feat(theme): scheme-aware tokens and working dark mode`.

## Phase 3 — States & Accessibility

1. **Hover policy (D1).** Keep row hover on nav/rootlist via `--row-hover`; *add* it to context-menu items and search-modal result options (currently focus/selected only). Confirm nothing else has hover.
2. **Non-color cues.** Selected list rows get the inset accent bar pattern where `aria-current` already has it; verify chips' selected border (`--accent-a40`) reads at 3:1 against the chip surface.
3. **Contrast pass.** Measure and fix: right-sidebar `--text-subdued` 58% mix, placeholder at 0.8 opacity, `--search-subtext` on `--surface-input`, accent-on-white usages. Record results in the spec §7 if any target changes.
4. **Reduced motion.** Wrap `glassBlob` (and any future decorative animation) in `@media (prefers-reduced-motion: no-preference)`.
5. **theme.js hygiene.** Debounce the MutationObserver callback (coalesce via `requestAnimationFrame`), early-exit when classes are already applied.

**Acceptance:** keyboard-only walkthrough of search modal, context menu, chips, and player controls shows a visible focus ring everywhere; contrast numbers recorded; CPU profile of idle Spotify shows no continuous observer churn.

Commit: `fix(a11y): state matrix, contrast, and reduced-motion support`.

## Phase 4 — Documentation Sync

1. **README.md:** accent `#00e676` → `#16a34a` and prose "electric mint" → "forest green"; single `blur(20px)` claim → elevation scale reference; stale `color.ini` sample values (`f5f5f7`/`1d1d1f`) → current; customization sections point at the token names from spec §4 instead of line numbers (which will all have moved).
2. **AGENTS.md:** fix the dangling `DESIGN.md` reference → `docs/design-spec.md`; align blur/accent claims with the spec; remove duplicated numbers in favor of references.
3. **CLAUDE.md:** update the Glass Effect Pattern section (2-level hierarchy → spec §4.4 five-level scale, hover exception per D1), add a pointer to `docs/design-spec.md` as the design source of truth.
4. **`docs/ui-fix-guidelines.md`:** mark as historical research (superseded by the spec for normative rules) — keep for the XPUI notes.

**Acceptance:** `grep -rn '00e676\|DESIGN.md\|blur(20px)' README.md AGENTS.md CLAUDE.md` → only intentional hits (none expected). No numeric design value stated in more than one doc.

Commit: `docs: sync all docs to design-spec as single source of truth`.

---

## Verification (every phase)

```bash
spicetify apply
spicetify config color_scheme suudLorDark && spicetify apply
spicetify config color_scheme suudLorLight && spicetify apply
```

Manual checklist (from CLAUDE.md, both schemes): search modal (Cmd+K), topbar search, now-playing bar (neutral vs accent icons), progress/volume, sidebar + cards, context menus + chips, lyrics route.

## Risks

- **Spotify updates** can shift selectors mid-refactor — quarantined hashed selectors are the first casualties; re-verify against the local XPUI bundle.
- **Dark ambient values** in spec §6 are estimates; expect a visual tuning loop in Phase 2 before locking them into the spec.
- **Luminance-based scheme detection** (D6) misclassifies exotic third-party schemes; acceptable — this theme ships two schemes and the heuristic is correct for both.
