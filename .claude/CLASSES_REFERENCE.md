# Spotify CSS Classes Reference

This file lists important CSS classes from Spotify that can be customized in the theme.

## Global Navigation

### Top Bar Container
- `.Root` - Main root container
- `.Root__top-container` - Top container wrapper
- `.Root__globalNav` - Global navigation bar
- `.main-globalNav-historyButtonsContainer` - Back/Forward buttons container
- `.main-globalNav-historyButtons` - History buttons wrapper

### Navigation Buttons
- `.main-globalNav-navLink` - Navigation link base class
- `.main-globalNav-navLinkActive` - Active navigation link
- `.main-globalNav-link-icon` - Navigation icon links
- `.custom-navlink` - Custom navigation links
- `.link-subtle` - Subtle link style

## Search Components

### Search Container
- `.main-globalNav-searchSection` - Search section wrapper
- `.main-globalNav-searchContainer` - Main search container
- `.main-globalNav-searchInputSection` - Input section wrapper
- `.main-globalNav-searchInputContainer` - Search input container
- `.spice-glass-topbar` - Custom glass effect class (added by theme.js)

### Search Input
- `.x-searchInput-searchInputInput` - Search input field
- `.x-searchInput-searchInputSearchIcon` - Search icon
- `.x-searchInput-searchInputClearButton` - Clear search button
- `.main-topBar-searchBar` - Top bar search element

### Search Dropdown
- `#search-dropdown` - Search dropdown panel
- `.x-searchHistoryEntries-clearSingleSearchHistory` - Clear history button

### Search Modal
- `.GenericModal__overlay` - Modal overlay
- `.spice-glass-overlay` - Custom glass overlay (added by theme.js)
- `.spice-glass-dialog` - Custom glass dialog (added by theme.js)
- `.spice-glass-inputWrap` - Custom glass input wrapper (added by theme.js)
- `[data-testid="search-modal-input"]` - Search modal input
- `#search-modal-listbox` - Search results list
- `[role="option"]` - Search result option
- `[role="option"][aria-selected="true"]` - Selected search result

## Your Library

### Library Container
- `.main-navBar-mainNav` - Main navigation bar
- `.main-yourLibraryX-entryPoints` - Library entry points
- `.main-yourLibraryX-library` - Library section
- `.main-yourLibraryX-libraryContainer` - Library container
- `.YourLibraryX` - Library component

### Library Header
- `.main-yourLibraryX-header` - Library header
- `.main-yourLibraryX-headerContent` - Header content
- `.main-yourLibraryX-collapseButton` - Collapse/expand button
- `.lsrLTX2g9H3hmP5QCUcr` - Library title

### Library Filter
- `.main-yourLibraryX-filterArea` - Filter area
- `.main-yourLibraryX-libraryFilter` - Library filter container
- `.x-filterBox-filterInputContainer` - Filter input container
- `.x-filterBox-filterInput` - Filter input field
- `.x-filterBox-searchIcon` - Filter search icon
- `.x-filterBox-searchIconContainer` - Search icon container
- `.x-filterBox-overlay` - Filter overlay
- `.x-filterBox-expandButton` - Expand filter button

### Library Items
- `.main-yourLibraryX-libraryItemContainer` - Library items container
- `.main-yourLibraryX-libraryRootlist` - Root list
- `.main-yourLibraryX-listItem` - Library list item
- `.main-rootlist-wrapper` - Root list wrapper

## Buttons

### Button Base Classes
- `.Button-sc-1dqy6lx-0` - Base button class
- `.Button-buttonTertiary-medium-iconOnly` - Tertiary icon button
- `.Button-buttonPrimary` - Primary button
- `.Button-buttonSecondary` - Secondary button

### Button Sizes
- `.e-91000-button--small` - Small button
- `.e-91000-button-tertiary--icon-only` - Icon-only button
- `.e-91000-button-tertiary--condensed` - Condensed button

### Button States
- `-disabled` - Disabled state suffix
- `-isUsingKeyboard` - Keyboard navigation state
- `-useBrowserDefaultFocusStyle` - Browser default focus

### Specific Buttons
- `[data-testid="control-button-playpause"]` - Play/pause button
- `.main-topBar-buddyFeed` - Buddy feed button
- `.main-userWidget-box` - User widget button

## Now Playing Bar

### Container
- `.Root__now-playing-bar` - Now playing bar container
- `.main-nowPlayingBar-container` - Now playing container

### Player Controls
- `.player-controls` - Player controls wrapper
- `[data-encore-id="buttonTertiary"]` - Tertiary control buttons
- `.main-genericButton-button` - Generic button

### Progress & Volume Bars
- `.playback-bar` - Playback bar container
- `.volume-bar` - Volume bar container
- `[data-testid="progress-bar"]` - Progress bar element
- `[data-testid="progress-bar-background"]` - Progress bar background
- `[data-testid="progress-bar-handle"]` - Progress bar handle

## User Interface Elements

### Icons
- `.e-91000-icon` - Base icon class
- `.e-91000-baseline` - Baseline icon
- `.e-91000-icon--auto-mirror` - Auto-mirroring icon
- `.e-91000-button__icon-wrapper` - Icon wrapper in buttons

### Form Elements
- `.e-91000-form-input` - Form input base
- `.e-91000-form-control` - Form control
- `.e-91000-form-input-icon` - Input with icon
- `.e-91000-form-input-icon--leading` - Leading icon
- `.e-91000-form-input-icon--trailing` - Trailing icon

### Text & Typography
- `.e-91000-text` - Base text class
- `.encore-text-body-medium` - Medium body text
- `.encore-text-body-small` - Small body text
- `.encore-text-body-medium-bold` - Bold medium text
- `.encore-text-body-small-bold` - Bold small text

### Chips (Filter Pills)
- `.LegacyChip__LegacyChipComponent-sc-tzfq94-0` - Legacy chip base
- `.LegacyChipComponent-presentation-chip-sm` - Small chip presentation
- `.LegacyChipInner__ChipInnerComponent-sc-1qguixk-0` - Chip inner component
- `.ChipInnerComponent-sm` - Small chip inner

### Cards & Lists
- `.search-searchCategory-contentArea` - Category content area
- `.search-searchCategory-categoryGrid` - Category grid
- `.search-searchCategory-carousel` - Carousel container
- `.search-searchCategory-carouselButton` - Carousel navigation button

### Carousel Controls
- `.KPBfh__4X_SqsUC4lHmR` - Previous button
- `.eeWh91DcMKFpNmSjIFwV` - Next button

### User Widget
- `.main-userWidget-box` - User widget container
- `.main-userWidget-hasAvatar` - User with avatar
- `.main-avatar-avatar` - Avatar element
- `.main-avatar-image` - Avatar image
- `.main-image-image` - Generic image
- `.main-image-loaded` - Loaded image state

## Sidebar

### Sidebar Container
- `#Desktop_LeftSidebar_Id` - Left sidebar ID
- `.WBFaUw_oOfN2m4aTxggt` - Sidebar wrapper class
- `.PC0XqaPE4XHqzCeFzA2g` - Sidebar positioning

### Drag & Drop
- `.main-useDropTarget-base` - Drop target base
- `.main-useDropTarget-track` - Track drop target
- `.main-useDropTarget-local` - Local drop target
- `.main-useDropTarget-album` - Album drop target
- `.main-useDropTarget-episode` - Episode drop target

## Scrollbars

- `.os-scrollbar` - OverlayScrollbars base
- `.os-scrollbar-horizontal` - Horizontal scrollbar
- `.os-scrollbar-vertical` - Vertical scrollbar
- `.os-theme-spotify` - Spotify theme
- `.os-scrollbar-auto-hide` - Auto-hide scrollbar
- `.os-scrollbar-track` - Scrollbar track
- `.os-scrollbar-handle` - Scrollbar handle

## Utility Classes

### Layout
- `.e-91000-box` - Box component
- `.e-91000-baseline` - Baseline alignment
- `.e-91000-overflow-wrap-anywhere` - Text overflow wrap

### Interaction States
- `.e-91000-box--interactive` - Interactive box
- `.e-91000-box--is-using-keyboard` - Keyboard interaction
- `.e-91000-box--browser-default-focus` - Default focus style

### Color Sets
- `.encore-inverted-dark-set` - Inverted dark colors
- `.encore-inverted-light-set` - Inverted light colors
- `.encore-internal-color-text-base` - Base text color

## Notes

### Custom Classes Added by theme.js
These classes are dynamically added by the theme's JavaScript:
- `.spice-glass-overlay` - Added to modal overlays
- `.spice-glass-dialog` - Added to search dialog
- `.spice-glass-topbar` - Added to topbar search
- `.spice-glass-inputWrap` - Added to search input wrappers

### Important Patterns
1. **State Suffixes**: Many classes use suffixes like `-disabled`, `-active`, `-isUsingKeyboard`
2. **Size Variants**: Button and text classes often have `-small`, `-medium`, `-large` variants
3. **Encore Design System**: Classes prefixed with `encore-` are part of Spotify's design system
4. **e-91000 Prefix**: Internal component library classes
5. **data-testid**: Elements with test IDs are good stable selectors for styling

### Usage Tips
- Use `!important` to override Spotify's inline styles
- Prefer more specific selectors when possible
- Test changes after Spotify updates as class names may change
- Use DevTools to inspect current class names (they can be obfuscated)
