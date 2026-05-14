# narablyat Liquid Glass — Design System Spec

**Date:** 2026-05-14
**Status:** Approved
**Scope:** Full design system for narablyat Spicetify theme — replaces Spotify default reference

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Accent color | `#00e676` electric mint-green | More vivid/fresh than Spotify's `#1db954` |
| Light mode base | Frost white (`#f5f5f7`) | Apple iOS/macOS aesthetic |
| Dark mode base | Dark neutral (`#0a0a0a`) | Clean black, lets green accent stand out |
| Glass style | Frosted (iOS Control Center) | blur 20px, opacity 0.72 — solid and readable |
| Corner radius | Very rounded (20-28px) | Apple squircle feel |
| Hover states | None | Design decision — focus + active only |
| Button labels | Title Case | Apple convention, not Spotify uppercase |

---

## Approaches Considered

- **A (chosen):** Clean slate — rewrite DESIGN.md entirely to reflect narablyat identity
- **B:** Extend existing — override Spotify sections (leftover content would cause confusion)
- **C:** Dual reference — keep Spotify as base layer (too complex, unnecessary)

---

## Implementation Notes

- Glass effect requires 3 layers: backdrop-filter + semi-transparent bg + inset highlight
- `#00e676` is functional only — never decorative, never on backgrounds
- Both schemes share the same accent green and glass pattern, differing only in base surfaces
- Targeting strategy: prefer `data-testid`, `aria-label`, `main-*`, `x-*` over hashed classes
