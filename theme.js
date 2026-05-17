/* Attach 'liquid glass' classes to Search modal and topbar search */
(function () {
  const applyGlassEnhancements = () => {
    // Modal overlay + dialog
    const overlays = document.querySelectorAll('.ReactModalPortal .GenericModal__overlay');
    overlays.forEach((overlay) => {
      const dialog = overlay.querySelector('[role="dialog"][aria-label="Search"]');
      if (dialog) {
        overlay.classList.add('spice-glass-overlay');
        dialog.classList.add('spice-glass-dialog');

        const input = dialog.querySelector('input[data-testid="search-modal-input"]');
        if (input && input.parentElement && !input.parentElement.classList.contains('spice-glass-inputWrap')) {
          input.parentElement.classList.add('spice-glass-inputWrap');
        }
      }
    });

    // Topbar inline search — try multiple selectors for Spotify version resilience
    const topbarSelectors = [
      '.main-globalNav-searchInputContainer',
      '[data-testid="topbar-search-bar"]',
      'header [role="search"]',
      'header form[role="search"]',
    ];
    topbarSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((form) => {
        if (!form.classList.contains('spice-glass-topbar')) {
          form.classList.add('spice-glass-topbar');
        }
      });
    });
  };

  const mo = new MutationObserver(applyGlassEnhancements);
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  applyGlassEnhancements();
})();

(function () {
  const injectAmbientBlobs = () => {
    if (!document.querySelector('.spice-ambient-blob-1')) {
      const b1 = document.createElement('div');
      b1.className = 'spice-ambient-blob-1';
      document.body.appendChild(b1);
    }
    if (!document.querySelector('.spice-ambient-blob-2')) {
      const b2 = document.createElement('div');
      b2.className = 'spice-ambient-blob-2';
      document.body.appendChild(b2);
    }
  };

  injectAmbientBlobs();
})();
