/* Attach styling-hook classes to Search modal and topbar search.
   The spice-glass-* names are legacy hooks kept from the glass era; user.css
   still targets them, so renaming is tracked as a separate follow-up. */
(function () {
  const applyGlassEnhancements = () => {
    // Modal overlay + dialog. Anchored on the modal's input testid: 1.3.6
    // dropped .GenericModal__overlay and the dialog's aria-label is localized.
    document.querySelectorAll('input[data-testid="search-modal-input"]').forEach((input) => {
      const dialog = input.closest('[role="dialog"]');
      if (!dialog || dialog.classList.contains('spice-glass-dialog')) return;
      dialog.classList.add('spice-glass-dialog');
      const overlay = dialog.closest('.ReactModal__Overlay') || dialog.parentElement;
      if (overlay) overlay.classList.add('spice-glass-overlay');
      if (input.parentElement) input.parentElement.classList.add('spice-glass-inputWrap');
    });

    // Topbar inline search — try multiple selectors for Spotify version resilience
    const topbarSelectors = [
      '.main-globalNav-searchInputContainer',
      '[data-testid="topbar-search-bar"]',
      '#global-nav-bar form[role="search"]',
      'header [role="search"]',
      'header form[role="search"]',
    ];
    topbarSelectors.forEach((sel) => {
      document.querySelectorAll(`${sel}:not(.spice-glass-topbar)`).forEach((form) => {
        form.classList.add('spice-glass-topbar');
      });
    });
  };

  // MutationObserver can fire many times per frame during route changes;
  // coalesce into a single pass via rAF instead of running on every callback.
  let rafPending = false;
  const scheduleGlassEnhancements = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      applyGlassEnhancements();
    });
  };

  const mo = new MutationObserver(scheduleGlassEnhancements);
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  applyGlassEnhancements();
})();

/* Scheme detection (D6): CSS can't know which color_scheme is active, so
   stamp data-scheme on <html> from the relative luminance of --spice-main. */
(function () {
  const relativeLuminance = (colorStr) => {
    // Let the browser normalize any valid CSS color (hex, rgb(), named) via
    // a detached probe element instead of hand-parsing every format.
    const probe = document.createElement('div');
    probe.style.color = colorStr;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color;
    document.body.removeChild(probe);

    const channels = resolved.match(/[\d.]+/g);
    if (!channels || channels.length < 3) return null;

    const linearize = (value) => {
      const s = value / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    const [r, g, b] = channels.slice(0, 3).map(Number);
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
  };

  // Style-attribute mutations on <html> can fire for reasons unrelated to
  // --spice-main; skip the luminance probe entirely when its value hasn't changed.
  let lastMain = null;
  const applySchemeAttribute = () => {
    const main = getComputedStyle(document.documentElement).getPropertyValue('--spice-main').trim();
    if (!main || main === lastMain) return;
    lastMain = main;

    const luminance = relativeLuminance(main);
    if (luminance === null) return;

    const scheme = luminance < 0.5 ? 'dark' : 'light';
    if (document.documentElement.dataset.scheme !== scheme) {
      document.documentElement.dataset.scheme = scheme;
    }
  };

  const mo = new MutationObserver(applySchemeAttribute);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  applySchemeAttribute();
})();
