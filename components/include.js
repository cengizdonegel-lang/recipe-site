(function () {
  async function loadIncludes() {
    const includes = document.querySelectorAll('[data-include]');
    for (const el of includes) {
      const src = el.getAttribute('data-include');
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(res.statusText);
        const html = await res.text();
        el.innerHTML = html;

        // After insertion, run activation for navs inside the included block
        activateNav(el);

        // Initialize any Bootstrap collapse elements added dynamically
        if (window.bootstrap && typeof window.bootstrap.Collapse === 'function') {
          el.querySelectorAll('.collapse').forEach(c => {
            try {
              // eslint-disable-next-line no-new
              new bootstrap.Collapse(c, { toggle: false });
            } catch (e) {}
          });
        }

        // Initialize category button groups inside the include
        initCategoryButtons(el);
      } catch (err) {
        console.error('Include failed:', src, err);
      }
    }
  }

  function activateNav(container) {
    const links = (container || document).querySelectorAll('.nav a, .navbar-nav .nav-link');
    if (!links.length) return;
    const current = (location.pathname || '/').replace(/\/$/, '') || '/';
    links.forEach((a) => {
      try {
        const url = new URL(a.getAttribute('href'), location.origin);
        const path = (url.pathname || '/').replace(/\/$/, '') || '/';
        if (path === current) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        } else {
          a.classList.remove('active');
          a.removeAttribute('aria-current');
        }
      } catch (e) {
        // ignore invalid URLs
      }
    });
  }

  function initCategoryButtons(container) {
    const root = container || document;
    const lists = root.querySelectorAll('.category-list');
    lists.forEach((ul) => {
      const links = ul.querySelectorAll('a');
      if (!links.length) return;
      
      // Set active state based on current page
      const currentPath = window.location.pathname;
      links.forEach((a) => {
        const linkPath = a.getAttribute('href');
        if (linkPath && (currentPath === linkPath || currentPath.endsWith(linkPath))) {
          a.classList.add('active');
          a.setAttribute('aria-pressed', 'true');
        }
      });
      
      // If no link is active, make first one active
      const hasActive = Array.from(links).some(a => a.classList.contains('active'));
      if (!hasActive) {
        links[0].classList.add('active');
        links[0].setAttribute('aria-pressed', 'true');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadIncludes().then(() => {
      activateNav();
      initCategoryButtons();
    });
    // Also rerun activateNav on history navigation
    window.addEventListener('popstate', () => activateNav());
  });
})();
