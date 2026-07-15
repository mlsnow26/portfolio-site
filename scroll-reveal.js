(function () {
  // ── Header shadow on scroll ──
  var header = document.querySelector('header');
  function updateHeaderShadow() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });

  // ── Randomize hero blob starting position on each load ──
  // Sets a random base offset (--rx/--ry) that the existing drift
  // animation's transform builds on top of, so blobs still glide
  // smoothly but start from a different spot every time.
  var blobRange = 70; // max px offset from the blob's default spot
  document.querySelectorAll('.blob').forEach(function (el) {
    var rx = Math.random() * blobRange * 2 - blobRange;
    var ry = Math.random() * blobRange * 2 - blobRange;
    el.style.setProperty('--rx', rx + 'px');
    el.style.setProperty('--ry', ry + 'px');
  });

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) return;

  // ── Reveal the homepage "hey" section immediately on mobile ──
  // On small viewports it sits close enough to the fold that waiting on a
  // scroll-triggered intersection makes the page look empty below the hero.
  if (window.matchMedia('(max-width: 700px)').matches) {
    var mobileHelloSection = document.querySelector('.hello-section');
    if (mobileHelloSection) {
      mobileHelloSection.classList.add('reveal', 'is-visible');
    }
  }

  // ── Fade-up reveal for major content blocks ──
  // .cs-hero is excluded: it sits above the fold, so a scroll-triggered
  // reveal fires instantly on load and is imperceptible. It gets its own
  // CSS on-load animation instead (see .cs-hero in style.css).
  var revealTargets = document.querySelectorAll(
    '.cs-section, .hello-section, .cs-sample, .remix-item, .cv-section'
  );
  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
  });

  // ── Staggered entrance for grid/list groups ──
  var staggerTargets = document.querySelectorAll(
    '.case-grid, .cv-skills'
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
