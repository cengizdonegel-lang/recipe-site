(function(){
  function attachFallbacks(root=document){
    const imgs = root.querySelectorAll('.carousel img[data-fallback-src]');
    imgs.forEach(img => {
      // Ensure dimensions are set for layout stability
      if (!img.getAttribute('width')) img.setAttribute('width', '1200');
      if (!img.getAttribute('height')) img.setAttribute('height', '420');
      // Lazy loading where supported
      img.setAttribute('loading', 'lazy');

      img.addEventListener('error', () => {
        if (img.dataset.fallbackApplied) return;
        const fallback = img.dataset.fallbackSrc;
        if (fallback) {
          img.dataset.fallbackApplied = 'true';
          img.src = fallback;
        }
      });
    });
  }

  // Run on DOMContentLoaded and also after includes are loaded (in case carousels are injected)
  document.addEventListener('DOMContentLoaded', () => attachFallbacks());
  // Also expose for manual init
  window.carouselFallbacks = attachFallbacks;
})();
