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

    // Topbar inline search
    document.querySelectorAll('.main-globalNav-searchInputContainer').forEach((form) => {
      form.classList.add('spice-glass-topbar');
    });
  };

  const mo = new MutationObserver(applyGlassEnhancements);
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  applyGlassEnhancements();
})();
