# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spicetify theme for Spotify called "narablyat" featuring a liquid glass design aesthetic with a platinum/light color palette and smooth animations.

## Architecture

The theme consists of three main components that work together:

### 1. **user.css** - Visual Styling
The main stylesheet implementing the liquid glass aesthetic. Key design patterns:

- **CSS Custom Properties System**: All colors, transitions, and spacing defined as CSS variables at `:root` level for consistency
- **Liquid Glass Effect**: Achieved through layered pseudo-elements (::before/::after) with backdrop-filter blur, radial gradients, and semi-transparent backgrounds
- **Component-Specific Scoping**: Styles are tightly scoped using Spotify's class names (e.g., `.main-globalNav-searchInputContainer`, `.spice-glass-topbar`)
- **State-Driven Styling**: Different states (default, hover, focus-within, active) with smooth transitions

Key sections in user.css:
- Lines 1-22: Core color palette and design tokens
- Lines 24-36: Search bar specific variables
- Lines 38-49: Liquid glass modal variables
- Lines 51-241: Search modal liquid glass implementation
- Lines 243-362: Topbar search styling
- Lines 369-465: Playing bar and controls

### 2. **theme.js** - Dynamic Class Application
Uses MutationObserver to dynamically add glass effect classes to DOM elements as Spotify's SPA renders them. The script:
- Watches for Search modal overlay and dialog elements
- Applies `.spice-glass-overlay`, `.spice-glass-dialog`, `.spice-glass-inputWrap` classes
- Targets topbar search with `.spice-glass-topbar` class
- Runs continuously to handle dynamic content

### 3. **color.ini** - Spicetify Color Scheme
Defines all Spicetify color variables using the `[suudLor]` scheme name. Maps to Spotify's internal theming system for components not styled via user.css.

## Development Commands

**Apply theme changes:**
```bash
spicetify apply
```
This command must be run after ANY changes to user.css, theme.js, or color.ini to see updates in Spotify.

**Restart Spotify with theme:**
```bash
spicetify restore backup apply
```
Use this if `spicetify apply` doesn't fully refresh the theme or if Spotify becomes unstable.

**Watch for changes (if you set up file watching):**
Spicetify doesn't have built-in watch mode. You must manually run `spicetify apply` after each change.

## Key Technical Details

### CSS Specificity Strategy
The theme uses highly specific selectors and `!important` declarations extensively because:
- Spotify's built-in styles are deeply nested and dynamically generated
- The theme must override Spotify's default styles reliably
- Spotify uses CSS-in-JS which generates high-specificity selectors

### Backdrop Filter Implementation
The liquid glass effect relies on `backdrop-filter: blur()` which requires:
- Semi-transparent backgrounds (`rgba()` with alpha < 1)
- Proper stacking context (elements with `position: relative` or `absolute`)
- Hardware acceleration support (works in modern browsers)

### Color System Mapping
- CSS variables in user.css (e.g., `--color-accent`) reference Spicetify variables when available (`--spice-accent`)
- Fallback chain: `var(--spice-accent, var(--color-accent))` ensures compatibility
- color.ini provides the Spicetify variable values

### Search Modal Architecture
The search modal uses two distinct style sets:
1. **Topbar search** (`.spice-glass-topbar`): Light glass with blur, for the inline search bar
2. **Modal dialog** (`.spice-glass-dialog`): Darker glass overlay with accent blob animations, for the full-screen search

Both share the liquid glass aesthetic but have different background opacities and text colors.

## Making Changes

### Modifying Colors
1. Update CSS variables in user.css `:root` (lines 1-49)
2. Update corresponding values in color.ini
3. Run `spicetify apply`

### Adding New Glass Effects
1. Identify target Spotify element using browser DevTools (Spotify uses obfuscated class names)
2. Add class via theme.js MutationObserver if element is dynamically rendered
3. Style using backdrop-filter pattern: semi-transparent background + blur + pseudo-element highlights
4. Test across different Spotify views (Home, Search, Library, Now Playing)

### Adjusting Animations
- Transition speeds: Modify CSS variables `--transition-fast`, `--transition-medium`, `--transition-slow`
- Glass blob animation: Edit `@keyframes glassBlob` (lines 194-197)
- Transform animations: Adjust `transform` properties in hover/focus states

## Common Pitfalls

- Spotify's DOM structure changes frequently; class names may break with updates
- Always test in actual Spotify client, not just browser - some features behave differently
- The MutationObserver in theme.js runs continuously; avoid expensive operations
- Backdrop blur can cause performance issues on older hardware - test performance after changes
- Some Spotify elements are in shadow DOM and cannot be styled directly
