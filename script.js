/* ═══════════════════════════════════════════════════════════
   PRANAY RAJ PARISHA — Portfolio Script
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Scroll Progress Bar ──────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

/* ── Scroll Reveal (IntersectionObserver) ─────────────── */
(function initScrollReveal() {
  const contents = document.querySelectorAll('.section__content');
  if (!contents.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  contents.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ── Mobile Menu Toggle ───────────────────────────────── */
(function initMobileMenu() {
  const btn  = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  menu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ── Active Nav Link on Scroll ────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  function setActive() {
    const scrollY = window.scrollY + 80;
    let current = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollY) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

/* ── Writing Filter Pills ─────────────────────────────── */
(function initWritingFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const rows  = document.querySelectorAll('.writing-row');
  if (!pills.length || !rows.length) return;

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      // Update active pill
      pills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      rows.forEach(function (row) {
        if (filter === 'all') {
          row.style.display = '';
        } else {
          const tags = (row.getAttribute('data-tags') || '').split(' ');
          row.style.display = tags.includes(filter) ? '' : 'none';
        }
      });
    });
  });
})();

/* ── Resume Accordion ─────────────────────────────────── */
function toggleResume(header) {
  const points = header.nextElementSibling;
  const toggle = header.querySelector('.resume-item__toggle');
  if (!points) return;

  const isOpen = points.style.display === 'flex';

  if (isOpen) {
    points.style.display = 'none';
    toggle.textContent = '+';
    toggle.classList.remove('open');
  } else {
    points.style.display = 'flex';
    toggle.textContent = '×';
    toggle.classList.add('open');
  }
}

/* ── Smooth Scroll for anchor links ───────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── Ticker pause on hover ────────────────────────────── */
(function initTickerPause() {
  const ticker = document.querySelector('.ticker__inner');
  if (!ticker) return;

  ticker.addEventListener('mouseenter', function () {
    ticker.style.animationPlayState = 'paused';
  });
  ticker.addEventListener('mouseleave', function () {
    ticker.style.animationPlayState = 'running';
  });
})();

/* ── Keyboard accessibility for resume items ──────────── */
(function initResumeKeyboard() {
  document.querySelectorAll('.resume-item__header').forEach(function (header) {
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleResume(header);
      }
    });
  });
})();

/* ── Nav active link style ────────────────────────────── */
(function addNavActiveStyle() {
  const style = document.createElement('style');
  style.textContent = '.nav__link.active { color: var(--ink); }';
  document.head.appendChild(style);
})();

/* ── Contact Widget ───────────────────────────────────── */
(function initContactWidget() {
  const chips    = document.querySelectorAll('.contact-chip');
  const response = document.getElementById('contactResponse');
  const msgEl    = document.getElementById('contactMsg');
  const ctaEl    = document.getElementById('contactCta');
  if (!chips.length || !response) return;

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      // Deselect all chips
      chips.forEach(function (c) { c.classList.remove('selected'); });
      chip.classList.add('selected');

      const msg  = chip.getAttribute('data-msg');
      const cta  = chip.getAttribute('data-cta');
      const href = chip.getAttribute('data-href');

      msgEl.textContent  = msg;
      ctaEl.textContent  = cta + ' →';
      ctaEl.href         = href;

      // Reset animation by removing and re-adding class
      response.classList.remove('visible');
      void response.offsetWidth; // force reflow
      response.classList.add('visible');
    });
  });
})();
