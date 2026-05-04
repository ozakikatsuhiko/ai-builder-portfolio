/* Katsu Ozaki Portfolio — main.js */
(function () {
  'use strict';

  // === Mobile nav toggle ===
  // Depends on: .nav__toggle, .nav__menu (with id="nav-menu")
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');
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

  // === Modal lightbox ===
  // Depends on: #modal, #m-img, #m-title, #m-desc, #m-close
  const modal = document.getElementById('modal');
  const mImg = document.getElementById('m-img');
  const mTitle = document.getElementById('m-title');
  const mDesc = document.getElementById('m-desc');
  const mClose = document.getElementById('m-close');

  // Track the element that triggered the modal for focus restoration
  let openerEl = null;

  function openModal(src, title, desc, alt) {
    openerEl = document.activeElement;
    mImg.src = src;
    mImg.alt = alt || title;
    mTitle.textContent = title;
    mDesc.textContent = desc || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (mClose) mClose.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (openerEl) {
      openerEl.focus();
      openerEl = null;
    }
  }

  // Card click and keyboard handler
  // Depends on: .card[data-img][data-title][data-desc]
  document.querySelectorAll('.card').forEach(card => {
    // Mouse click
    card.addEventListener('click', () => {
      openModal(
        card.dataset.img,
        card.dataset.title,
        card.dataset.desc,
        card.dataset.title
      );
    });

    // Keyboard: Enter or Space opens modal (accessibility)
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(
          card.dataset.img,
          card.dataset.title,
          card.dataset.desc,
          card.dataset.title
        );
      }
    });
  });

  if (mClose) mClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // === Reveal on scroll ===
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
