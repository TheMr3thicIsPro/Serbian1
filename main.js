/* Стоматолошка ординација Жугић — main.js */

(function () {
  'use strict';

  /* ── Sticky header ─────────────────────────────────────── */
  const header = document.getElementById('site-header');

  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ── Mobile nav toggle ─────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger.addEventListener('click', function () {
    const isOpen = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.classList.toggle('open', !isOpen);
    mobileNav.setAttribute('aria-hidden', String(isOpen));
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });

  /* ── Smooth scroll for anchor links ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Scroll reveal ─────────────────────────────────────── */
  const revealEls = [];

  function addReveal(selectors) {
    document.querySelectorAll(selectors).forEach(function (el) {
      el.classList.add('reveal');
      revealEls.push(el);
    });
  }

  addReveal(
    '.hero-content, .hero-card, ' +
    '.about-text, .about-pillars, ' +
    '.pillar, ' +
    '.service-card, ' +
    '.why-text, .why-stats, .stat, ' +
    '.contact-info, .contact-form-wrap'
  );

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) { io.observe(el); });

  /* Stagger children of grid/list containers */
  document.querySelectorAll('.services-grid, .why-stats, .about-pillars').forEach(function (parent) {
    Array.from(parent.children).forEach(function (child, i) {
      child.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  /* ── Contact form ──────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Slanje…';

      /* Simulate async send (replace with real endpoint) */
      setTimeout(function () {
        form.hidden = true;
        successMsg.hidden = false;
      }, 900);
    });
  }

  /* ── Active nav link on scroll ─────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  function setActiveLink() {
    const scrollY = window.scrollY + header.offsetHeight + 24;
    let current = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollY) {
        current = '#' + section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

})();
