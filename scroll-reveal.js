(function () {
  // ── Header shadow on scroll ──
  var header = document.querySelector('header');
  function updateHeaderShadow() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) return;

  // ── Fade-up reveal for major content blocks ──
  var revealTargets = document.querySelectorAll(
    '.cs-section, .hello-section, .cs-sample, .remix-item, .cv-section'
  );
  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
  });

  // ── Staggered entrance for grid/list groups ──
  var staggerTargets = document.querySelectorAll(
    '.case-grid, .cv-skills, .hello-logos-row'
  );
  staggerTargets.forEach(function (group) {
    group.classList.add('reveal-stagger');
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--i', i);
    });
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealTargets.forEach(function (el) {
    observer.observe(el);
  });
  staggerTargets.forEach(function (el) {
    observer.observe(el);
  });
})();
