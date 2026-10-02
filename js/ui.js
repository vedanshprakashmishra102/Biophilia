/* ===== BIOPHILIA – UI Helpers ===== */

export function $(sel, ctx = document) {
  return ctx.querySelector(sel);
}

export function $$(sel, ctx = document) {
  return [...ctx.querySelectorAll(sel)];
}

export function toast(message, type = 'success') {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(40px)';
    el.style.transition = '0.3s';
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

export function confetti() {
  const colors = ['#7a9e7e', '#c4785a', '#d4a84b', '#a8c5ab', '#5a7a5e'];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-10px';
    el.style.background = colors[i % colors.length];
    el.style.animationDelay = Math.random() * 0.4 + 's';
    el.style.animationDuration = 1 + Math.random() * 0.8 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

export function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.body.classList.toggle('dark', dark);
  document.body.classList.toggle('light', !dark);
  document.dispatchEvent(new CustomEvent('themechange', { detail: dark }));
  const btn = $('.theme-toggle');
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
}

export function renderTree(container, stageIndex, resting) {
  if (!container) return;
  const stageClass = `stage-${stageIndex}`;
  const restClass = resting ? 'resting' : '';
  container.innerHTML = `
    <svg class="tree-svg ${stageClass} ${restClass}" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <!-- Ground -->
      <ellipse cx="100" cy="220" rx="70" ry="12" fill="#8d6e63" opacity="0.35"/>
      <!-- Trunk -->
      <path class="trunk" d="M92 220 L92 140 Q100 130 108 140 L108 220 Z" />
      <!-- Foliage layers -->
      <ellipse class="foliage" cx="100" cy="110" rx="55" ry="50" />
      <ellipse class="foliage" cx="70" cy="130" rx="35" ry="30" />
      <ellipse class="foliage" cx="130" cy="130" rx="35" ry="30" />
      <ellipse class="foliage" cx="100" cy="85" rx="40" ry="35" />
      <!-- Blooms (stage 4) -->
      <circle class="bloom" cx="75" cy="95" r="5" fill="#e91e63"/>
      <circle class="bloom" cx="120" cy="80" r="4" fill="#f48fb1"/>
      <circle class="bloom" cx="95" cy="70" r="5" fill="#e91e63"/>
      <circle class="bloom" cx="140" cy="115" r="4" fill="#f48fb1"/>
      <circle class="bloom" cx="60" cy="120" r="4" fill="#e91e63"/>
    </svg>
  `;
}

export function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}

export function initNav() {
  setActiveNav();
}

export function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str + 'T12:00:00');
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function beep() {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    const c = new C(), o = c.createOscillator(), g = c.createGain();
    o.frequency.value = 660; g.gain.value = 0.08;
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.12);
  } catch {}
}

export function openDialog({ title, body, confirmText = 'Save', danger = false, onConfirm }) {
  const ov = document.createElement('div');
  ov.className = 'modal-overlay open';
  ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${title}"><h2>${title}</h2><div>${body}</div><div class="modal-actions"><button class="btn btn-secondary" data-x>Cancel</button><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-ok>${confirmText}</button></div></div>`;
  document.body.appendChild(ov);
  const close = () => { ov.remove(); document.removeEventListener('keydown', onKey); };
  const ok = () => { if (onConfirm(ov) !== false) close(); };
  const onKey = (e) => { if (e.key === 'Escape') close(); else if (e.key === 'Enter' && e.target.tagName === 'INPUT') ok(); };
  document.addEventListener('keydown', onKey);
  ov.addEventListener('click', (e) => { if (e.target === ov || e.target.hasAttribute('data-x')) close(); });
  ov.querySelector('[data-ok]').addEventListener('click', ok);
  (ov.querySelector('input') || ov.querySelector('[data-ok]')).focus();
}
