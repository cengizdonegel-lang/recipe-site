(function(){
  // Read category from query string and set active state
  function getCategoryFromQuery() {
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'all';
  }

  function setActiveCategory(category) {
    const lists = document.querySelectorAll('.category-list');
    lists.forEach(ul => {
      const links = ul.querySelectorAll('a');
      links.forEach(a => {
        a.classList.remove('active');
        a.removeAttribute('aria-pressed');
        const cat = a.dataset.category || (new URL(a.href, location.origin).searchParams.get('category')) || a.textContent.trim().toLowerCase();
        if (cat === category) {
          a.classList.add('active');
          a.setAttribute('aria-pressed', 'true');
          // dispatch the category:select event to allow consumers to react
          const ev = new CustomEvent('category:select', { detail: { category } });
          ul.dispatchEvent(ev);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const category = getCategoryFromQuery();
    // Wait a tick for includes to be loaded and category links initialized
    setTimeout(() => setActiveCategory(category), 50);

    // Update dashboard title when a category is selected via clicks
    document.addEventListener('category:select', (e) => {
      const title = document.getElementById('dashboardTitle');
      if (title && e.detail && e.detail.category) {
        title.textContent = `Dashboard — ${e.detail.category[0].toUpperCase() + e.detail.category.slice(1)}`;
      }
    });
  });
})();
