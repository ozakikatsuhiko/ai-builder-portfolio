/* Katsu Ozaki Portfolio — main.js
 * ----------------------------------------------------------
 * Vanilla ES2020. No bundler.
 *
 * Sections:
 *   1) safety  — URL/asset path whitelist
 *   2) nav     — mobile menu toggle
 *   3) modal   — lightbox open/close + a11y
 *   4) reveal  — IntersectionObserver-based fade-in
 *
 * Each section is independent; their only coupling is the
 * SEL contract below (DOM ids/classes).
 * ---------------------------------------------------------- */
(function () {
  'use strict';

  /** Centralised DOM contract — change here, not in 8 places. */
  const SEL = Object.freeze({
    navToggle:  '.nav__toggle',
    navMenu:    '.nav__menu',
    modal:      '#modal',
    modalImg:   '#m-img',
    modalTitle: '#m-title',
    modalDesc:  '#m-desc',
    modalClose: '#m-close',
    cards:      '.card',
  });

  /* ========================================================
   * 1) safety — URL/asset path whitelist
   * ========================================================
   * Why: data-img attributes originate from authored HTML, but
   * a future CMS or AI-generated page could leak `javascript:`,
   * `data:text/html`, or `..` traversal. Validate every src
   * before assignment so a misuse never reaches the DOM. */
  function isSafeAssetPath(p) {
    if (typeof p !== 'string' || p.length === 0 || p.length > 256) return false;
    if (/[\s<>"'`]/.test(p)) return false;
    if (/[\x00-\x1f]/.test(p)) return false;
    if (p.includes('..')) return false;
    if (/^[a-z]+:/i.test(p)) return false;
    if (p.startsWith('//') || p.startsWith('/')) return false;
    return /^assets\/[A-Za-z0-9._\-/]+$/.test(p);
  }

  /* ========================================================
   * 2) nav — mobile menu toggle
   * ========================================================
   * Depends on SEL.navToggle, SEL.navMenu. */
  const toggle = document.querySelector(SEL.navToggle);
  const menu   = document.querySelector(SEL.navMenu);
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ========================================================
   * 3) modal — lightbox open/close + a11y
   * ========================================================
   * Depends on SEL.modal, SEL.modalImg, SEL.modalTitle,
   * SEL.modalDesc, SEL.modalClose. */
  const modal  = document.querySelector(SEL.modal);
  const mImg   = document.querySelector(SEL.modalImg);
  const mTitle = document.querySelector(SEL.modalTitle);
  const mDesc  = document.querySelector(SEL.modalDesc);
  const mClose = document.querySelector(SEL.modalClose);

  // Restore focus to the element that opened the modal.
  let openerEl = null;

  function openModal(src, title, desc, alt) {
    if (!modal || !mImg || !mTitle || !mClose) return;
    if (!isSafeAssetPath(src)) {
      console.warn('[portfolio] refused unsafe image src:', src);
      return;
    }
    openerEl = document.activeElement;
    // Set perf hints on every open (cheap, idempotent).
    mImg.loading = 'lazy';
    mImg.decoding = 'async';
    mImg.src = src;
    mImg.alt = alt || title;
    mTitle.textContent = title;
    if (mDesc) mDesc.textContent = desc || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    mClose.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Free image memory so a long session does not retain N screenshots.
    if (mImg) mImg.removeAttribute('src');
    if (openerEl) {
      openerEl.focus();
      openerEl = null;
    }
  }

  // Card click + keyboard binding. Depends on SEL.cards
  // with data-img / data-title / data-desc.
  document.querySelectorAll(SEL.cards).forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.dataset.img, card.dataset.title, card.dataset.desc, card.dataset.title);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.img, card.dataset.title, card.dataset.desc, card.dataset.title);
      }
    });
  });

  if (mClose) mClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  /* ========================================================
   * 4) reveal — IntersectionObserver-based fade-in
   * ========================================================
   * Falls back to immediate visibility on browsers without IO. */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.card').forEach((el, i) => {
      el.style.transitionDelay = (i * 80) + 'ms';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.card').forEach(el => el.classList.add('is-visible'));
  }
})();
