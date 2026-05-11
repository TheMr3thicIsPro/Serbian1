(function () {
  'use strict';

  /* ── Header scroll state ─────────────────────────────── */
  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger.addEventListener('click', function () {
    const open = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!open));
    mobileNav.classList.toggle('open', !open);
    mobileNav.setAttribute('aria-hidden', String(open));
  });

  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });

  /* ── Smooth anchor scroll ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 4;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Contact form ────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Slanje…';
      setTimeout(function () { form.hidden = true; success.hidden = false; }, 900);
    });
  }

  /* ── GSAP animations ─────────────────────────────────── */
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* Hero entrance — staggered on load */
  const heroTl = gsap.timeline({ delay: 0.1 });
  heroTl
    .from('.hero-eyebrow',  { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' })
    .from('.hero-title',    { opacity: 0, y: 32, duration: 0.85, ease: 'power3.out' }, '-=0.4')
    .from('.hero-desc',     { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .from('.hero-actions',  { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('.hero-chips',    { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' }, '-=0.35')
    .from('.tooth-stage',   { opacity: 0, scale: 0.82, duration: 1.1, ease: 'elastic.out(1, 0.75)' }, '-=0.9')
    .from('.tooth-badge',   { opacity: 0, scale: 0.75, stagger: 0.18, duration: 0.55, ease: 'back.out(1.8)' }, '-=0.6')
    .from('.scroll-hint',   { opacity: 0, duration: 0.6 }, '-=0.2');

  /* Trust bar */
  gsap.from('.trust-item', {
    scrollTrigger: { trigger: '.trust-bar', start: 'top 90%' },
    opacity: 0, y: 18, stagger: 0.1, duration: 0.55, ease: 'power2.out'
  });

  /* Generic fade-up elements */
  gsap.utils.toArray('.fade-up').forEach(function (el) {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
      opacity: 1, y: 0, duration: 0.75, ease: 'power2.out'
    });
  });

  /* Staggered grids */
  gsap.utils.toArray('.stagger-grid').forEach(function (grid) {
    gsap.to(Array.from(grid.children), {
      scrollTrigger: { trigger: grid, start: 'top 82%' },
      opacity: 1, y: 0,
      stagger: { amount: 0.5, from: 'start' },
      duration: 0.65, ease: 'power2.out'
    });
  });

  /* Staggered fade (pillars etc.) */
  gsap.utils.toArray('.stagger-fade').forEach(function (wrap) {
    gsap.to(Array.from(wrap.children), {
      scrollTrigger: { trigger: wrap, start: 'top 82%' },
      opacity: 1, y: 0, stagger: 0.15, duration: 0.65, ease: 'power2.out'
    });
  });

  /* ── Number counter ──────────────────────────────────── */
  document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const obj    = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power1.inOut',
          onUpdate: function () {
            el.textContent = Math.round(obj.val) + suffix;
          }
        });
      }
    });
  });

  /* ── Pillar hover line (reinforcement) ───────────────── */
  document.querySelectorAll('.pillar').forEach(function (p) {
    p.addEventListener('mouseenter', function () {
      gsap.to(this, { paddingLeft: '2.2rem', duration: 0.25, ease: 'power1.out' });
    });
    p.addEventListener('mouseleave', function () {
      gsap.to(this, { paddingLeft: '1.8rem', duration: 0.25, ease: 'power1.out' });
    });
  });

  /* ── Service card tilt micro-interaction ─────────────── */
  document.querySelectorAll('.service-card:not(.service-card--cta)').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const r   = card.getBoundingClientRect();
      const x   = (e.clientX - r.left) / r.width  - 0.5;
      const y   = (e.clientY - r.top)  / r.height - 0.5;
      gsap.to(card, { rotateY: x * 5, rotateX: -y * 5, duration: 0.3, ease: 'power1.out', transformPerspective: 600 });
    });
    card.addEventListener('mouseleave', function () {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
    });
  });

})();
