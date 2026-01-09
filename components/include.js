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
      } catch (err) {
        console.error('Include failed:', src, err);
      }
    }
  }

  function activateNav(container) {
    const links = (container || document).querySelectorAll('.nav a');
    if (!links.length) return;
    const current = (location.pathname || '/').replace(/\/$/, '') || '/';
    links.forEach((a) => {
      try {
        // Resolve href relative to current origin
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

  document.addEventListener('DOMContentLoaded', () => {
    loadIncludes().then(() => activateNav());
    // Also rerun activateNav on history navigation
    window.addEventListener('popstate', () => activateNav());
  });
})();
