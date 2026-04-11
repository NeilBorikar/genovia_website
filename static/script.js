// script.js — smooth scroll, arrow button, faq toggle, small nav highlight

document.addEventListener('DOMContentLoaded', function () {
  // Dark Mode Toggle
  const darkModeBtn = document.getElementById('dark-mode-btn');

  function updateLogo() {
    const logo = document.getElementById('site-logo');
    if (!logo) return;
    const isDark = document.body.classList.contains('dark-mode');
    const fromData = isDark ? logo.dataset.logoDark : logo.dataset.logoLight;
    if (fromData) {
      logo.setAttribute('src', fromData);
      return;
    }
    try {
      const u = new URL(logo.getAttribute('src') || '', window.location.href);
      if (isDark) {
        u.pathname = u.pathname.replace(/logo-light\.png$/i, 'logo-dark.png');
      } else {
        u.pathname = u.pathname.replace(/logo-dark\.png$/i, 'logo-light.png');
      }
      logo.src = u.href;
    } catch (e) {
      logo.src = isDark ? '/static/assets/logo-dark.png' : '/static/assets/logo-light.png';
    }
  }

  function syncDarkModeToggle() {
    if (!darkModeBtn) return;
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
      darkModeBtn.classList.remove('light');
      darkModeBtn.classList.add('dark');
      darkModeBtn.textContent = '☀️';
    } else {
      darkModeBtn.classList.remove('dark');
      darkModeBtn.classList.add('light');
      darkModeBtn.textContent = '🌙';
    }
  }

  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
  syncDarkModeToggle();
  updateLogo();

  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark);
      syncDarkModeToggle();
      updateLogo();
    });
  }
  
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileMenuBtn.classList.toggle('active');
      mainNav.classList.toggle('active');
    });
    
    // Close menu when a nav link is clicked
    const navLinks = mainNav.querySelectorAll('.nav-link, .dropdown-item');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        mobileMenuBtn.classList.remove('active');
        mainNav.classList.remove('active');
      });
    });
  }
  
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

  // Active nav on scroll (hash targets only — avoids invalid querySelector for paths like /about)
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks).map((a) => {
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.charAt(0) !== '#') return null;
    try {
      return document.querySelector(href);
    } catch (e) {
      return null;
    }
  });
  function updateNavActive() {
    const idx = sections.findIndex((sec) => sec && window.scrollY + 120 >= sec.offsetTop);
    navLinks.forEach((l) => l.classList.remove('active'));
    if (idx >= 0) navLinks[idx].classList.add('active');
  }
  if (sections.some(Boolean)) {
    window.addEventListener('scroll', updateNavActive);
    updateNavActive();
  }
});
