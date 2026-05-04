/* Katsu Ozaki Portfolio — main.js */
(function () {
  'use strict';

  // === Mobile nav toggle ===
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => menu.classList.remove('open'))
    );
  }

  // === Modal lightbox ===
  const modal = document.getElementById('modal');
  const mImg = document.getElementById('m-img');
  const mTitle = document.getElementById('m-title');
  const mDesc = document.getElementById('m-desc');
  const mClose = document.getElementById('m-close');

  function openModal(src, title, desc, alt) {
    mImg.src = src;
    mImg.alt = alt || title;
    mTitle.textContent = title;
    mDesc.textContent = desc || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      openModal(
        card.dataset.img,
        card.dataset.title,
        card.dataset.desc,
        card.dataset.title
      );
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
