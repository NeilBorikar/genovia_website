// script.js — smooth scroll, arrow button, faq toggle, small nav highlight

document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll for nav and CTAs
  document.querySelectorAll('a[href^="#"], button[data-scroll-target]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      // anchor links: allow normal a[href="#..."] behavior but smooth
      let target = (this.getAttribute('href') || this.dataset.scrollTarget);
      if (!target) return;
      if (target === '#') return;
      e.preventDefault();
      const dest = document.querySelector(target);
      if (dest) dest.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  });

  // arrow scroll -> scroll a bit down to about section
  const arrowBtn = document.getElementById('arrow-scroll');
  if (arrowBtn) {
    arrowBtn.addEventListener('click', function () {
      const about = document.querySelector('#about');
      if (about) about.scrollIntoView({behavior: 'smooth'});
    });
  }

  // FAQ accordion: toggle .answer height
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.parentElement;
      const ans = item.querySelector('.answer');
      const plus = btn.querySelector('.plus');
      if (!ans) return;
      if (ans.style.maxHeight && ans.style.maxHeight !== '0px') {
        ans.style.maxHeight = '0';
        ans.style.paddingTop = '0';
        plus.textContent = '+';
      } else {
       
        if (!ans.innerHTML.trim()) {
          
          ans.innerHTML = '<div style="padding:16px 0;color:#6f6f6f;">(Answer placeholder — paste your answer here.)</div>';
        }
        ans.style.maxHeight = ans.scrollHeight + 24 + 'px';
        ans.style.paddingTop = '14px';
        plus.textContent = '−';
      }
    });
  });

  // Expand any answers that have content on page load
  document.querySelectorAll('.answer').forEach(function (a) {
    if (a.innerHTML.trim()) {
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });

  // tiny: active nav on scroll
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));
  function updateNavActive(){
    let idx = sections.findIndex(sec => sec && (window.scrollY + 120) >= sec.offsetTop);
    navLinks.forEach(l=>l.classList.remove('active'));
    if (idx >= 0) navLinks[idx].classList.add('active');
  }
  window.addEventListener('scroll', updateNavActive);
  updateNavActive();
});
