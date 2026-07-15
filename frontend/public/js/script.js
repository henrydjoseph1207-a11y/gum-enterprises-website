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

/* ============================================================
   CATALOGUE — data-driven renderer.
   Fetches /catalogue.json and renders Products / Videos / Recipes.
   Adding new items only requires editing catalogue.json.
   ============================================================ */

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
  ));
}

function renderProducts(products) {
  const grid = document.getElementById('catalogue-products');
  if (!grid) return;
  if (!products || !products.length) {
    grid.innerHTML = '<p class="catalogue-empty">No products yet — add one to /catalogue.json.</p>';
    return;
  }
  grid.innerHTML = products.map((p) => {
    const img = p.image
      ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy">`
      : `<div class="cat-card-placeholder" aria-hidden="true"></div>`;
    const badge = p.badge ? `<span class="cat-badge cat-badge--${escapeHtml(p.badge).toLowerCase()}">${escapeHtml(p.badge)}</span>` : '';
    const cta = p.order_link
      ? `<a class="cat-cta" href="${escapeHtml(p.order_link)}" target="_blank" rel="noopener">Order on WhatsApp</a>`
      : `<span class="cat-cta cat-cta--muted">Coming soon</span>`;
    return `
      <article class="cat-card cat-card--product">
        <div class="cat-media">${img}${badge}</div>
        <div class="cat-body">
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.description)}</p>
          ${cta}
        </div>
      </article>
    `;
  }).join('');
}

function renderVideos(videos) {
  const grid = document.getElementById('catalogue-videos');
  if (!grid) return;
  if (!videos || !videos.length) {
    grid.innerHTML = '<p class="catalogue-empty">No videos yet — add one to /catalogue.json.</p>';
    return;
  }
  grid.innerHTML = videos.map((v) => {
    let player = '';
    if (v.type === 'youtube' && v.src) {
      player = `<iframe class="cat-video" src="${escapeHtml(v.src)}" title="${escapeHtml(v.title)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    } else if (v.type === 'mp4' && v.src) {
      const poster = v.poster ? ` poster="${escapeHtml(v.poster)}"` : '';
      player = `<video class="cat-video" controls preload="metadata"${poster}><source src="${escapeHtml(v.src)}" type="video/mp4">Your browser does not support video.</video>`;
    } else {
      const poster = v.poster
        ? `<img src="${escapeHtml(v.poster)}" alt="${escapeHtml(v.title)}" loading="lazy">`
        : `<div class="cat-card-placeholder" aria-hidden="true"></div>`;
      player = `<div class="cat-video-empty">${poster}<div class="cat-video-empty__label">Add a video URL in <code>catalogue.json</code></div></div>`;
    }
    return `
      <article class="cat-card cat-card--video">
        <div class="cat-media cat-media--video">${player}</div>
        <div class="cat-body">
          <h3>${escapeHtml(v.title)}</h3>
          <p>${escapeHtml(v.description)}</p>
        </div>
      </article>
    `;
  }).join('');
}

function renderRecipes(recipes) {
  const grid = document.getElementById('catalogue-recipes');
  if (!grid) return;
  if (!recipes || !recipes.length) {
    grid.innerHTML = '<p class="catalogue-empty">No recipes yet — add one to /catalogue.json.</p>';
    return;
  }
  grid.innerHTML = recipes.map((r) => {
    const img = r.image
      ? `<img src="${escapeHtml(r.image)}" alt="${escapeHtml(r.title)}" loading="lazy">`
      : `<div class="cat-card-placeholder" aria-hidden="true"></div>`;
    const time = r.time ? `<span class="cat-badge cat-badge--time">${escapeHtml(r.time)}</span>` : '';
    const steps = Array.isArray(r.steps) && r.steps.length
      ? `<ol class="cat-steps">${r.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>`
      : '';
    return `
      <article class="cat-card cat-card--recipe">
        <div class="cat-media">${img}${time}</div>
        <div class="cat-body">
          <h3>${escapeHtml(r.title)}</h3>
          <p>${escapeHtml(r.description)}</p>
          ${steps}
        </div>
      </article>
    `;
  }).join('');
}

function setupCatalogueTabs() {
  const tabs = document.querySelectorAll('.catalogue-tab');
  const panels = document.querySelectorAll('.catalogue-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach((p) => {
        p.classList.toggle('is-active', p.dataset.panel === target);
      });
    });
  });
}

async function loadCatalogue() {
  setupCatalogueTabs();
  try {
    // cache-bust so newly-edited JSON shows up immediately
    const res = await fetch(`/catalogue.json?v=${Date.now()}`, {cache: 'no-cache'});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderProducts(data.products || []);
    renderVideos(data.videos || []);
    renderRecipes(data.recipes || []);
  } catch (err) {
    console.error('Catalogue load failed:', err);
    const grid = document.getElementById('catalogue-products');
    if (grid) grid.innerHTML = '<p class="catalogue-empty">Could not load catalogue.json.</p>';
  }
}

window.addEventListener('DOMContentLoaded', loadCatalogue);

