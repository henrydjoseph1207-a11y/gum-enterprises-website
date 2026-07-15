const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReduced.matches) document.documentElement.style.scrollBehavior = 'auto';

function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    let current = 0;
    const duration = 1800;
    const stepTime = Math.max(Math.floor(duration / target), 25);
    const interval = setInterval(() => {
      current += 1;
      counter.textContent = current;
      if (current >= target) clearInterval(interval);
    }, stepTime);
  });
}

function setupScrollAnimations() {
  const sections = document.querySelectorAll('.glass-panel, .brand-card, .product-card, .counter-card, .hero-copy, .hero-visual');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-on-scroll');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15});
  sections.forEach((section) => observer.observe(section));
}

function setupNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const links = document.querySelectorAll('.site-nav a');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.style.display === 'flex';
      nav.style.display = isOpen ? 'none' : 'flex';
    });
  }

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && nav) {
        nav.style.display = 'none';
      }
    });
  });
}

function setupContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
}

function setupAnchors() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.length === 1) return;
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({behavior: prefersReduced.matches ? 'auto' : 'smooth'});
    });
  });
}

function init() {
  setupNavigation();
  setupScrollAnimations();
  setupContactForm();
  setupAnchors();

  const counterSection = document.querySelector('#why');
  if (counterSection) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.3});
    counterObserver.observe(counterSection);
  }
}

window.addEventListener('DOMContentLoaded', init);

