(function () {
  const stored = localStorage.getItem('ea-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  const ICONS = {
    dark:  '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    light: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  };

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('ea-theme', t);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.innerHTML = ICONS[t] || ICONS.dark;
  }

  window.addEventListener('DOMContentLoaded', function () {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const icon = document.getElementById('themeIcon');
    if (icon) icon.innerHTML = ICONS[current] || ICONS.dark;

    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    }
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('ea-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();
