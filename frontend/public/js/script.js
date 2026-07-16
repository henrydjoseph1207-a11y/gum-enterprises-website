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

  const isMobile = () => window.matchMedia('(max-width: 720px)').matches;

  if (toggle && nav) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      nav.style.display = isOpen ? 'flex' : '';
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (!isMobile() || !nav.classList.contains('is-open')) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('is-open');
        nav.style.display = '';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (isMobile() && nav) {
        nav.classList.remove('is-open');
        nav.style.display = '';
        toggle && toggle.setAttribute('aria-expanded', 'false');
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
  const waIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  grid.innerHTML = products.map((p) => {
    const img = p.image
      ? `<button type="button" class="cat-media-btn" data-lightbox-src="${escapeHtml(p.image)}" data-lightbox-alt="${escapeHtml(p.title)}" aria-label="View larger image of ${escapeHtml(p.title)}"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy"><span class="cat-media-zoom" aria-hidden="true">Click to view</span></button>`
      : `<div class="cat-card-placeholder" aria-hidden="true"></div>`;
    const badge = p.badge ? `<span class="cat-badge cat-badge--${escapeHtml(p.badge).toLowerCase()}">${escapeHtml(p.badge)}</span>` : '';
    const cta = p.order_link
      ? `<a class="cat-cta" href="${escapeHtml(p.order_link)}" target="_blank" rel="noopener">${waIcon}<span>Place Order Now</span></a>`
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

/* ---- Lightbox: click a product image to zoom it in an overlay ---- */
function ensureLightbox() {
  let lb = document.getElementById('cat-lightbox');
  if (lb) return lb;
  lb = document.createElement('div');
  lb.id = 'cat-lightbox';
  lb.className = 'cat-lightbox';
  lb.setAttribute('aria-hidden', 'true');
  lb.setAttribute('role', 'dialog');
  lb.innerHTML = `
    <button type="button" class="cat-lightbox__close" aria-label="Close">&times;</button>
    <img class="cat-lightbox__img" alt="">
  `;
  document.body.appendChild(lb);

  const close = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('cat-lightbox__close')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
  });
  return lb;
}

function openLightbox(src, alt) {
  const lb = ensureLightbox();
  const img = lb.querySelector('.cat-lightbox__img');
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function setupLightboxDelegation() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-media-btn');
    if (!btn) return;
    e.preventDefault();
    openLightbox(btn.dataset.lightboxSrc, btn.dataset.lightboxAlt);
  });
}

async function loadCatalogue() {
  setupCatalogueTabs();
  setupLightboxDelegation();
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

