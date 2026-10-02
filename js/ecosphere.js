(function(){'use strict';
/* ===== ECOSPHERE – Static Data & Config ===== */

const DAILY_ACTIONS = [
  {
    id: 'skip-meat',
    title: 'Skip meat for one meal',
    icon: '🥗',
    impact: { co2: 2.5, water: 150, energy: 0, plastic: 0, waste: 0 },
    impactText: '≈ 2.5 kg CO₂ & 150 L water saved',
    category: 'food'
  },
  {
    id: 'unplug',
    title: 'Unplug idle electronics',
    icon: '🔌',
    impact: { co2: 0.4, water: 0, energy: 1.5, plastic: 0, waste: 0 },
    impactText: '≈ 1.5 kWh energy saved',
    category: 'energy'
  },
  {
    id: 'short-shower',
    title: 'Take a 5-minute shower',
    icon: '🚿',
    impact: { co2: 0.3, water: 35, energy: 0.8, plastic: 0, waste: 0 },
    impactText: '≈ 35 L water saved',
    category: 'water'
  },
  {
    id: 'reuse-bottle',
    title: 'Use a reusable bottle all day',
    icon: '🧴',
    impact: { co2: 0.1, water: 0, energy: 0, plastic: 1, waste: 0 },
    impactText: '1 plastic bottle avoided',
    category: 'waste'
  },
  {
    id: 'air-dry',
    title: 'Air-dry clothes instead of dryer',
    icon: '👕',
    impact: { co2: 1.2, water: 0, energy: 3.5, plastic: 0, waste: 0 },
    impactText: '≈ 3.5 kWh energy saved',
    category: 'energy'
  },
  {
    id: 'no-food-waste',
    title: 'Finish all food on your plate',
    icon: '🍽️',
    impact: { co2: 0.5, water: 20, energy: 0, plastic: 0, waste: 0.5 },
    impactText: '0.5 kg food waste avoided',
    category: 'food'
  },
  {
    id: 'walk-bike',
    title: 'Walk or bike for a short trip',
    icon: '🚲',
    impact: { co2: 1.8, water: 0, energy: 0, plastic: 0, waste: 0 },
    impactText: '≈ 1.8 kg CO₂ saved',
    category: 'transport'
  },
  {
    id: 'led-lights',
    title: 'Switch off unused lights',
    icon: '💡',
    impact: { co2: 0.2, water: 0, energy: 0.6, plastic: 0, waste: 0 },
    impactText: '≈ 0.6 kWh energy saved',
    category: 'energy'
  },
  {
    id: 'compost',
    title: 'Compost kitchen scraps',
    icon: '🍂',
    impact: { co2: 0.8, water: 0, energy: 0, plastic: 0, waste: 0.4 },
    impactText: '0.4 kg waste diverted',
    category: 'waste'
  },
  {
    id: 'cold-wash',
    title: 'Wash clothes in cold water',
    icon: '🧺',
    impact: { co2: 0.6, water: 0, energy: 1.2, plastic: 0, waste: 0 },
    impactText: '≈ 1.2 kWh energy saved',
    category: 'energy'
  }
];

const TREE_STAGES = [
  { name: 'Seedling', minPoints: 0, maxPoints: 4 },
  { name: 'Sprout', minPoints: 5, maxPoints: 11 },
  { name: 'Young Tree', minPoints: 12, maxPoints: 24 },
  { name: 'Growing Tree', minPoints: 25, maxPoints: 49 },
  { name: 'Flourishing Tree', minPoints: 50, maxPoints: Infinity }
];

const BADGES = [
  {
    id: 'first-step',
    name: 'First Step',
    icon: '🌱',
    desc: 'Log your first action',
    condition: (s) => s.totalActions >= 1
  },
  {
    id: 'streak-3',
    name: 'On a Roll',
    icon: '🔥',
    desc: '3-day streak',
    condition: (s) => s.bestStreak >= 3
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    icon: '⚡',
    desc: '7-day streak',
    condition: (s) => s.bestStreak >= 7
  },
  {
    id: 'streak-30',
    name: 'Eco Champion',
    icon: '🏆',
    desc: '30-day streak',
    condition: (s) => s.bestStreak >= 30
  },
  {
    id: 'water-guardian',
    name: 'Water Guardian',
    icon: '💧',
    desc: 'Save 200 L of water',
    condition: (s) => s.totals.water >= 200
  },
  {
    id: 'watt-saver',
    name: 'Watt Saver',
    icon: '⚡',
    desc: 'Save 20 kWh of energy',
    condition: (s) => s.totals.energy >= 20
  },
  {
    id: 'carbon-cutter',
    name: 'Carbon Cutter',
    icon: '🌍',
    desc: 'Offset 25 kg CO₂',
    condition: (s) => s.totals.co2 >= 25
  },
  {
    id: 'plastic-free',
    name: 'Plastic Fighter',
    icon: '🚫',
    desc: 'Avoid 10 plastic bottles',
    condition: (s) => s.totals.plastic >= 10
  },
  {
    id: 'tree-grower',
    name: 'Tree Grower',
    icon: '🌳',
    desc: 'Reach Flourishing Tree stage',
    condition: (s) => s.growthPoints >= 50
  },
  {
    id: 'action-50',
    name: 'Habit Hero',
    icon: '💪',
    desc: 'Log 50 total actions',
    condition: (s) => s.totalActions >= 50
  }
];

const ARTICLES = [
  {
    id: 'a1',
    title: 'How to Recycle Right in Your City',
    category: 'Waste & Recycling',
    icon: '♻️',
    excerpt: 'Quick guide to what actually goes in the blue bin—and the common mistakes that contaminate loads.',
    time: '2 min',
    tags: ['waste']
  },
  {
    id: 'a2',
    title: 'Seasonal Eating: What\'s Fresh This Month',
    category: 'Seasonal Eating',
    icon: '🥕',
    excerpt: 'Buying produce in season cuts food miles and supports local farmers. Here\'s what\'s in peak now.',
    time: '2 min',
    tags: ['food']
  },
  {
    id: 'a3',
    title: 'Phantom Load: The Hidden Energy Drain',
    category: 'Energy Efficiency',
    icon: '🔌',
    excerpt: 'Devices still draw power when "off". Learn which ones to unplug and how much you\'ll save.',
    time: '2 min',
    tags: ['energy']
  },
  {
    id: 'a4',
    title: '5-Minute Shower Challenge Tips',
    category: 'Water Conservation',
    icon: '🚿',
    excerpt: 'Timer tricks, low-flow heads, and the one habit that cuts shower time without feeling rushed.',
    time: '1 min',
    tags: ['water']
  },
  {
    id: 'a5',
    title: 'Composting for Apartment Dwellers',
    category: 'Waste & Recycling',
    icon: '🍂',
    excerpt: 'No backyard? Countertop bins and community drop-offs make composting doable in small spaces.',
    time: '3 min',
    tags: ['waste']
  },
  {
    id: 'a6',
    title: 'Cold Wash Myths Busted',
    category: 'Energy Efficiency',
    icon: '🧺',
    excerpt: 'Modern detergents work great in cold water. You\'ll save energy and your clothes will last longer.',
    time: '1 min',
    tags: ['energy']
  },
  {
    id: 'a7',
    title: 'Meatless Mondays Made Easy',
    category: 'Seasonal Eating',
    icon: '🥗',
    excerpt: 'Three satisfying plant-based swaps that cut a big chunk of your weekly carbon footprint.',
    time: '2 min',
    tags: ['food']
  },
  {
    id: 'a8',
    title: 'Rainwater Harvesting Basics',
    category: 'Water Conservation',
    icon: '🌧️',
    excerpt: 'A simple barrel setup can water your plants for free and reduce runoff. Here\'s how to start.',
    time: '3 min',
    tags: ['water']
  }
];

const CATEGORIES = [
  'All',
  'Energy Efficiency',
  'Waste & Recycling',
  'Seasonal Eating',
  'Water Conservation'
];

/* Relatable metric converters */
function getRelatableMetrics(totals) {
  const metrics = [];

  // CO2
  if (totals.co2 > 0) {
    const miles = (totals.co2 * 2.5).toFixed(1);
    metrics.push({
      icon: '🚗',
      raw: `${totals.co2.toFixed(1)} kg CO₂ saved`,
      value: `${miles} miles not driven`,
      message: `You saved enough carbon to offset a ${miles}-mile drive!`
    });
    if (totals.co2 >= 5) {
      metrics.push({
        icon: '📱',
        raw: `${totals.co2.toFixed(1)} kg CO₂ saved`,
        value: `${Math.round(totals.co2 * 120)} phone charges`,
        message: `That's equivalent to charging your phone every night for nearly ${Math.round(totals.co2 * 120 / 365)} years!`
      });
    }
    if (totals.co2 >= 20) {
      metrics.push({
        icon: '🌳',
        raw: `${totals.co2.toFixed(1)} kg CO₂ saved`,
        value: `${(totals.co2 / 20).toFixed(1)} tree-years`,
        message: `You just matched the work of ${(totals.co2 / 20).toFixed(1)} full-grown tree(s) for a whole year!`
      });
    }
  }

  // Water
  if (totals.water > 0) {
    const glasses = Math.round(totals.water * 6.57); // ~152 ml glass
    metrics.push({
      icon: '🥤',
      raw: `${totals.water.toFixed(0)} L water saved`,
      value: `${glasses} drinking glasses`,
      message: `You saved enough water to fill ${glasses} drinking glasses!`
    });
    if (totals.water >= 150) {
      const loads = (totals.water / 75).toFixed(1);
      metrics.push({
        icon: '🧺',
        raw: `${totals.water.toFixed(0)} L water saved`,
        value: `${loads} laundry loads`,
        message: `Your choices saved ${loads} full loads of laundry worth of water!`
      });
    }
  }

  // Energy
  if (totals.energy > 0) {
    const tvHours = Math.round(totals.energy / 0.05); // ~50W LED TV
    metrics.push({
      icon: '📺',
      raw: `${totals.energy.toFixed(1)} kWh energy saved`,
      value: `${tvHours} hours of TV`,
      message: `You saved enough power to binge-watch for ${tvHours} hours!`
    });
    if (totals.energy >= 5) {
      metrics.push({
        icon: '🧊',
        raw: `${totals.energy.toFixed(1)} kWh energy saved`,
        value: `${(totals.energy / 1.5).toFixed(1)} fridge-days`,
        message: `You saved enough electricity to power a home refrigerator for ${(totals.energy / 1.5).toFixed(1)} days!`
      });
    }
  }

  // Plastic
  if (totals.plastic > 0) {
    metrics.push({
      icon: '🌊',
      raw: `${totals.plastic} plastic bottle(s) avoided`,
      value: `${totals.plastic * 450} years of decomposition`,
      message: `You kept plastic out of the ocean that would have lasted until the year ${2026 + totals.plastic * 450}!`
    });
  }

  // Waste
  if (totals.waste > 0) {
    const miles = (totals.waste * 2.4).toFixed(1);
    metrics.push({
      icon: '🚯',
      raw: `${totals.waste.toFixed(1)} kg food waste avoided`,
      value: `${miles} miles of methane avoided`,
      message: `Rescuing this food prevented landfill gas equivalent to driving ${miles} miles!`
    });
  }

  return metrics;
}

function getTreeStage(points) {
  for (let i = TREE_STAGES.length - 1; i >= 0; i--) {
    if (points >= TREE_STAGES[i].minPoints) return { ...TREE_STAGES[i], index: i };
  }
  return { ...TREE_STAGES[0], index: 0 };
}

function getProgressToNext(points) {
  const stage = getTreeStage(points);
  if (stage.maxPoints === Infinity) return { percent: 100, current: points, next: points };
  const range = stage.maxPoints - stage.minPoints + 1;
  const progress = points - stage.minPoints;
  return {
    percent: Math.min(100, Math.round((progress / range) * 100)),
    current: points,
    next: stage.maxPoints + 1
  };
}
/* ===== ECOSPHERE – Local Storage Layer ===== */

const STORAGE_KEY = 'ecosphere_v1';

const DEFAULT_STATE = {
  user: {
    name: 'Eco Friend',
    isGuest: true,
    createdAt: null,
    darkMode: false
  },
  streak: {
    current: 0,
    best: 0,
    lastActionDate: null // YYYY-MM-DD
  },
  totals: {
    co2: 0,
    water: 0,
    energy: 0,
    plastic: 0,
    waste: 0
  },
  growthPoints: 0,
  totalActions: 0,
  todayActions: [], // action ids logged today
  history: [], // { date, actionId, impact }
  unlockedBadges: [],
  settings: {
    sound: true,
    reminders: false
  }
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const state = structuredClone(DEFAULT_STATE);
      state.user.createdAt = todayStr();
      return state;
    }
    const state = JSON.parse(raw);
    // Reset today's actions if date changed
    if (state.streak.lastActionDate !== todayStr()) {
      state.todayActions = [];
    }
    // Check streak continuity
    checkStreak(state);
    return state;
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function checkStreak(state) {
  const today = todayStr();
  const last = state.streak.lastActionDate;
  if (!last) return;

  const lastDate = new Date(last + 'T12:00:00');
  const todayDate = new Date(today + 'T12:00:00');
  const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    // Streak paused (not reset to zero – we keep current for display of "resting")
    // Only reset if they want, but per design: pause, don't kill
    // We keep the number but mark as resting via lastActionDate
  }
  // If same day or yesterday, streak is fine
}

function logAction(state, action) {
  const today = todayStr();

  // Already logged today?
  if (state.todayActions.includes(action.id)) {
    return { success: false, message: 'Already logged today!' };
  }

  // Update streak
  const last = state.streak.lastActionDate;
  if (!last) {
    state.streak.current = 1;
  } else {
    const lastDate = new Date(last + 'T12:00:00');
    const todayDate = new Date(today + 'T12:00:00');
    const diff = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
    if (diff === 0) {
      // same day, streak stays
    } else if (diff === 1) {
      state.streak.current += 1;
    } else {
      // missed days – restart streak but keep best
      state.streak.current = 1;
    }
  }
  state.streak.best = Math.max(state.streak.best, state.streak.current);
  state.streak.lastActionDate = today;

  // Add impacts
  state.totals.co2 += action.impact.co2;
  state.totals.water += action.impact.water;
  state.totals.energy += action.impact.energy;
  state.totals.plastic += action.impact.plastic;
  state.totals.waste += action.impact.waste;

  state.growthPoints += 1;
  state.totalActions += 1;
  state.todayActions.push(action.id);

  state.history.push({
    date: today,
    actionId: action.id,
    impact: { ...action.impact }
  });

  // Keep history reasonable
  if (state.history.length > 200) {
    state.history = state.history.slice(-150);
  }

  saveState(state);
  return { success: true, message: 'Action logged! 🌱' };
}

function isResting(state) {
  const today = todayStr();
  const last = state.streak.lastActionDate;
  if (!last) return false;
  if (last === today) return false;
  const lastDate = new Date(last + 'T12:00:00');
  const todayDate = new Date(today + 'T12:00:00');
  const diff = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
  return diff >= 1;
}

function setName(state, name) {
  state.user.name = name.trim() || 'Eco Friend';
  state.user.isGuest = false;
  saveState(state);
}

function toggleDark(state) {
  state.user.darkMode = !state.user.darkMode;
  saveState(state);
  return state.user.darkMode;
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
}

function exportData(state) {
  return JSON.stringify(state, null, 2);
}
/* ===== ECOSPHERE – UI Helpers ===== */

function $(sel, ctx = document) {
  return ctx.querySelector(sel);
}

function $$(sel, ctx = document) {
  return [...ctx.querySelectorAll(sel)];
}

function toast(message, type = 'success') {
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

function confetti() {
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

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.body.classList.toggle('dark', dark);
  document.body.classList.toggle('light', !dark);
  document.dispatchEvent(new CustomEvent('themechange', { detail: dark }));
  const btn = $('.theme-toggle');
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
}

function renderTree(container, stageIndex, resting) {
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

function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}

function initNav() {
  setActiveNav();
}

function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str + 'T12:00:00');
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function beep() {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    const c = new C(), o = c.createOscillator(), g = c.createGain();
    o.frequency.value = 660; g.gain.value = 0.08;
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.12);
  } catch {}
}

function openDialog({ title, body, confirmText = 'Save', danger = false, onConfirm }) {
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
/* ===== ECOSPHERE – Main Application ===== */

let state = loadState();

/* ---------- Shared init ---------- */
function initShared() {
  applyTheme(state.user.darkMode);
  initNav();
  initMenu();
  startReminders();

  const themeBtn = $('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const dark = toggleDark(state);
      applyTheme(dark);
    });
  }
}

/* ---------- Shared helpers ---------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function flipTheme() { applyTheme(toggleDark(state)); }

async function shareSummary() {
  const text = `I've logged ${state.totalActions} eco-actions and saved ${state.totals.co2.toFixed(1)} kg CO₂ with Ecosphere! 🌱 Current streak: ${state.streak.current} days.`;
  try {
    if (navigator.share) await navigator.share({ title: 'My Ecosphere Impact', text });
    else { await navigator.clipboard.writeText(text); toast('Impact summary copied to clipboard!'); }
  } catch (e) { if (e.name !== 'AbortError') toast('Could not share — try again.', 'info'); }
}

function downloadData() {
  const url = URL.createObjectURL(new Blob([exportData(state)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'ecosphere-data.json'; a.click();
  URL.revokeObjectURL(url);
  toast('Data exported!');
}

function initMenu() {
  const btn = $('.menu-btn');
  if (!btn) return;
  const menu = document.createElement('div');
  menu.className = 'more-menu'; menu.id = 'more-menu'; menu.setAttribute('role', 'menu');
  const pages = [['index.html', '🏠 Dashboard'], ['impact.html', '📊 Impact'], ['resources.html', '📚 Resources'], ['profile.html', '👤 Profile']];
  menu.innerHTML = pages.map(([h, l]) => `<a role="menuitem" href="${h}">${l}</a>`).join('') +
    '<hr><button role="menuitem" data-act="theme">🌗 Switch light / dark</button>' +
    '<button role="menuitem" data-act="copy">📋 Copy impact summary</button>' +
    '<button role="menuitem" data-act="export">⬇️ Export my data</button>';
  btn.parentElement.appendChild(menu);
  btn.setAttribute('aria-controls', 'more-menu');
  const set = (o) => { menu.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); set(!menu.classList.contains('open')); });
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  menu.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    set(false);
    ({ theme: flipTheme, copy: shareSummary, export: downloadData })[b.dataset.act]();
  });
}

function startReminders() {
  setInterval(() => {
    if (!state.settings.reminders || !('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date(), hm = now.toTimeString().slice(0, 5), day = now.toISOString().slice(0, 10);
    if (hm === (state.settings.reminderTime || '09:00') && localStorage.getItem('ecosphere_last_reminder') !== day) {
      localStorage.setItem('ecosphere_last_reminder', day);
      new Notification('Ecosphere 🌿', { body: 'Time for today’s micro-actions!' });
    }
  }, 30000);
}

/* ---------- Daily action picker (deterministic by date) ---------- */
function getTodaysActions() {
  const seed = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let n = parseInt(seed, 10);
  const shuffled = [...DAILY_ACTIONS];
  // simple seeded shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    n = (n * 1103515245 + 12345) & 0x7fffffff;
    const j = n % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
}

/* ========== INDEX (Dashboard) ========== */
function initDashboard() {
  initShared();

  const greeting = $('#greeting');
  if (greeting) {
    const hour = new Date().getHours();
    const part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    greeting.innerHTML = `${part}, <span>${esc(state.user.name)}</span> 🌿`;
  }

  // Guest banner
  const guestBanner = $('#guest-banner');
  if (guestBanner && state.user.isGuest) {
    guestBanner.style.display = 'flex';
    $('#save-name-btn')?.addEventListener('click', () => {
      const input = $('#guest-name');
      if (input?.value.trim()) {
        setName(state, input.value);
        guestBanner.style.display = 'none';
        if (greeting) greeting.querySelector('span').textContent = state.user.name;
        toast('Welcome aboard, ' + state.user.name + '!');
      }
    });
  }

  // Stats
  updateStats();

  // Tree
  updateTree();

  // Actions
  const actions = getTodaysActions();
  const grid = $('#actions-grid');
  if (grid) {
    grid.innerHTML = actions.map(a => {
      const done = state.todayActions.includes(a.id);
      return `
        <div class="action-card ${done ? 'completed' : ''}" data-id="${a.id}">
          <div class="action-icon">${a.icon}</div>
          <div class="action-info">
            <div class="action-title">${a.title}</div>
            <div class="action-impact">${a.impactText}</div>
          </div>
          <button class="btn ${done ? 'btn-secondary' : 'btn-primary'} btn-sm" ${done ? 'disabled' : ''}>
            ${done ? '✓ Done' : 'Log it'}
          </button>
        </div>
      `;
    }).join('');

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.disabled) return;
      const card = btn.closest('.action-card');
      const id = card.dataset.id;
      const action = DAILY_ACTIONS.find(a => a.id === id);
      if (!action) return;

      const result = logAction(state, action);
      if (result.success) {
        card.classList.add('completed');
        btn.textContent = '✓ Done';
        btn.disabled = true;
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
        updateStats();
        updateTree();
        toast(result.message);
        confetti();
        if (state.settings.sound) beep();
        checkNewBadges();
      } else {
        toast(result.message, 'info');
      }
    });
  }
}

function updateStats() {
  const el = (id, val) => { const n = $(id); if (n) n.textContent = val; };
  el('#stat-streak', state.streak.current);
  el('#stat-actions', state.totalActions);

  // Top relatable metric
  const metrics = getRelatableMetrics(state.totals);
  const top = metrics[0];
  el('#stat-impact', top ? top.value.split(' ')[0] : '0');
  const label = $('#stat-impact-label');
  if (label) label.textContent = top ? top.value.replace(/^\S+\s/, '') : 'impact so far';
}

function updateTree() {
  const stage = getTreeStage(state.growthPoints);
  const progress = getProgressToNext(state.growthPoints);
  const resting = isResting(state);

  const nameEl = $('#tree-stage-name');
  if (nameEl) nameEl.textContent = resting ? stage.name + ' (Resting)' : stage.name;

  const canvas = $('#tree-canvas');
  renderTree(canvas, stage.index, resting);

  const put = (id, v) => { const n = $(id); if (n) n.textContent = v; };
  put('#tree-status', resting ? 'Resting 🌙 — log an action to wake it' : 'Thriving 🌱');
  put('#eco-streak', state.streak.current + ' days');
  put('#eco-actions', state.totalActions);

  const fill = $('#tree-progress-fill');
  if (fill) fill.style.width = progress.percent + '%';

  const text = $('#tree-progress-text');
  if (text) {
    if (stage.maxPoints === Infinity) {
      text.textContent = `${state.growthPoints} growth points – fully flourishing!`;
    } else {
      text.textContent = `${state.growthPoints} / ${progress.next} points to next stage`;
    }
  }
}

function checkNewBadges() {
  const newly = [];
  BADGES.forEach(b => {
    if (!state.unlockedBadges.includes(b.id) && b.condition({
      totalActions: state.totalActions,
      bestStreak: state.streak.best,
      totals: state.totals,
      growthPoints: state.growthPoints
    })) {
      state.unlockedBadges.push(b.id);
      newly.push(b);
    }
  });
  if (newly.length) {
    saveState(state);
    newly.forEach(b => toast(`Badge unlocked: ${b.icon} ${b.name}!`));
  }
}

/* ========== IMPACT PAGE ========== */
function initImpact() {
  initShared();

  // Relatable metrics
  const metrics = getRelatableMetrics(state.totals);
  const grid = $('#metrics-grid');
  if (grid) {
    if (metrics.length === 0) {
      grid.innerHTML = `<p style="color:var(--text-muted)">Log your first action to see impact metrics!</p>`;
    } else {
      grid.innerHTML = metrics.map(m => `
        <div class="metric-card">
          <div class="metric-icon">${m.icon}</div>
          <div class="metric-raw">${m.raw}</div>
          <div class="metric-value">${m.value}</div>
          <div class="metric-message">${m.message}</div>
        </div>
      `).join('');
    }
  }

  // Raw totals summary
  const raw = $('#raw-totals');
  if (raw) {
    raw.innerHTML = `
      <div class="stat-item"><div class="stat-value">${state.totals.co2.toFixed(1)}</div><div class="stat-label">kg CO₂</div></div>
      <div class="stat-item"><div class="stat-value">${state.totals.water.toFixed(0)}</div><div class="stat-label">Liters water</div></div>
      <div class="stat-item"><div class="stat-value">${state.totals.energy.toFixed(1)}</div><div class="stat-label">kWh energy</div></div>
      <div class="stat-item"><div class="stat-value">${state.totals.plastic}</div><div class="stat-label">Plastic avoided</div></div>
    `;
  }

  // Badges
  const badgesEl = $('#badges-grid');
  if (badgesEl) {
    badgesEl.innerHTML = BADGES.map(b => {
      const unlocked = state.unlockedBadges.includes(b.id);
      // simple progress estimate for locked
      let progressHtml = '';
      if (!unlocked) {
        let pct = 0;
        if (b.id === 'first-step') pct = Math.min(100, state.totalActions * 100);
        else if (b.id.startsWith('streak-')) {
          const target = parseInt(b.id.split('-')[1]);
          pct = Math.min(100, (state.streak.best / target) * 100);
        } else if (b.id === 'water-guardian') pct = Math.min(100, (state.totals.water / 200) * 100);
        else if (b.id === 'watt-saver') pct = Math.min(100, (state.totals.energy / 20) * 100);
        else if (b.id === 'carbon-cutter') pct = Math.min(100, (state.totals.co2 / 25) * 100);
        else if (b.id === 'plastic-free') pct = Math.min(100, (state.totals.plastic / 10) * 100);
        else if (b.id === 'tree-grower') pct = Math.min(100, (state.growthPoints / 50) * 100);
        else if (b.id === 'action-50') pct = Math.min(100, (state.totalActions / 50) * 100);
        progressHtml = `<div class="badge-progress"><div class="badge-progress-fill" style="width:${pct}%"></div></div>`;
      }
      return `
        <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}">
          <div class="badge-icon">${b.icon}</div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.desc}</div>
          ${progressHtml}
        </div>
      `;
    }).join('');
  }

  // Streak display
  const streakEl = $('#streak-display');
  if (streakEl) {
    streakEl.innerHTML = `
      <div class="stat-item"><div class="stat-value">${state.streak.current}</div><div class="stat-label">Current streak</div></div>
      <div class="stat-item"><div class="stat-value">${state.streak.best}</div><div class="stat-label">Best streak</div></div>
      <div class="stat-item"><div class="stat-value">${state.growthPoints}</div><div class="stat-label">Growth points</div></div>
    `;
  }
}

/* ========== RESOURCES PAGE ========== */
function initResources() {
  initShared();

  let activeCat = 'All';
  const filterBar = $('#filter-bar');
  const articlesGrid = $('#articles-grid');

  function renderFilters() {
    if (!filterBar) return;
    filterBar.innerHTML = CATEGORIES.map(c => `
      <button class="filter-btn ${c === activeCat ? 'active' : ''}" data-cat="${c}">${c}</button>
    `).join('');
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      activeCat = btn.dataset.cat;
      $$('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === activeCat));
      renderArticles();
    });
  }

  function renderArticles() {
    if (!articlesGrid) return;
    const filtered = activeCat === 'All'
      ? ARTICLES
      : ARTICLES.filter(a => a.category === activeCat);
    articlesGrid.innerHTML = filtered.map(a => `
      <article class="article-card" data-id="${a.id}" tabindex="0" role="button" aria-label="Read: ${a.title}">
        <div class="article-thumb">${a.icon}</div>
        <div class="article-body">
          <div class="article-cat">${a.category}</div>
          <div class="article-title">${a.title}</div>
          <div class="article-excerpt">${a.excerpt}</div>
          <div class="article-time">⏱ ${a.time} read</div>
        </div>
      </article>
    `).join('');

  }

  function showArticleModal(art) {
    let overlay = $('.modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div class="modal">
        <h2>${art.icon} ${art.title}</h2>
        <p style="font-size:0.8rem;color:var(--sage-dark);margin-bottom:0.5rem">${art.category} · ${art.time} read</p>
        <p>${art.excerpt}</p>
        <p style="margin-top:1rem">This is a bite-sized tip. In a full version, this would expand into a short article with practical steps you can take today. Keep logging micro-actions and check back for more guides!</p>
        <div class="modal-actions">
          <button class="btn btn-primary" id="close-modal">Got it</button>
        </div>
      </div>
    `;
    overlay.classList.add('open');
    const closeIt = () => { overlay.classList.remove('open'); document.removeEventListener('keydown', onEsc); };
    const onEsc = (e) => { if (e.key === 'Escape') closeIt(); };
    document.addEventListener('keydown', onEsc);
    $('#close-modal').addEventListener('click', closeIt);
    $('#close-modal').focus();
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  }

  renderFilters();
  renderArticles();
  const open = (e) => {
    const card = e.target.closest('.article-card');
    const art = card && ARTICLES.find(x => x.id === card.dataset.id);
    if (art) showArticleModal(art);
  };
  articlesGrid?.addEventListener('click', open);
  articlesGrid?.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(e); } });
}

/* ========== PROFILE PAGE ========== */
function initProfile() {
  initShared();

  function refresh() {
    const stage = getTreeStage(state.growthPoints);
    $('#profile-name').textContent = state.user.name;
    $('#avatar').textContent = state.user.name.charAt(0).toUpperCase();
    $('#profile-meta').textContent = `Joined ${formatDate(state.user.createdAt)} · ${state.totalActions} actions logged`;
    $('#level-badge').textContent = `🌳 ${stage.name}`;
    const rows = [
      ['Display name', esc(state.user.name)], ['Account type', state.user.isGuest ? 'Guest' : 'Saved profile'],
      ['Joined', formatDate(state.user.createdAt)], ['Level', '🌳 ' + stage.name],
      ['Current streak', state.streak.current + ' days'], ['Best streak', state.streak.best + ' days'],
      ['Actions logged', state.totalActions], ['Growth points', state.growthPoints],
      ['CO₂ saved', state.totals.co2.toFixed(1) + ' kg'], ['Water saved', state.totals.water.toFixed(0) + ' L'],
      ['Energy saved', state.totals.energy.toFixed(1) + ' kWh'], ['Badges unlocked', `${state.unlockedBadges.length} / ${BADGES.length}`]
    ];
    $('#profile-rows').innerHTML = rows.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('');
    $('#share-stats').innerHTML = `
      <div><div class="share-stat-value">${state.streak.current}</div><div class="share-stat-label">Day streak</div></div>
      <div><div class="share-stat-value">${state.totalActions}</div><div class="share-stat-label">Actions</div></div>
      <div><div class="share-stat-value">${state.totals.co2.toFixed(1)}</div><div class="share-stat-label">kg CO₂</div></div>`;
  }
  refresh();

  // Tabs (click + arrow keys)
  const tabs = $$('.tab-btn');
  const select = (t) => tabs.forEach(b => {
    const on = b === t;
    b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
    $('#' + b.dataset.panel).hidden = !on;
  });
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(n); n.focus();
    });
  });

  // Edit name dialog
  $('#edit-name-btn').addEventListener('click', () => openDialog({
    title: 'Edit display name',
    body: `<input id="dlg-name" type="text" maxlength="24" aria-label="Display name" value="${esc(state.user.name)}" style="width:100%;margin:0.5rem 0 1rem" />`,
    onConfirm(root) {
      const v = $('#dlg-name', root).value.trim();
      if (!v) { toast('Please enter a name', 'info'); return false; }
      setName(state, v); refresh(); toast('Name updated!');
    }
  }));

  // Preferences
  const sound = $('#toggle-sound'), dark = $('#toggle-dark'), remind = $('#toggle-reminders'), time = $('#reminder-time');
  sound.checked = state.settings.sound;
  sound.addEventListener('change', () => { state.settings.sound = sound.checked; saveState(state); if (sound.checked) beep(); });
  dark.checked = state.user.darkMode;
  dark.addEventListener('change', flipTheme);
  document.addEventListener('themechange', (e) => { dark.checked = e.detail; });
  remind.checked = state.settings.reminders;
  time.value = state.settings.reminderTime || '09:00';
  time.addEventListener('change', () => { state.settings.reminderTime = time.value; saveState(state); toast('Reminder set for ' + time.value); });
  remind.addEventListener('change', async () => {
    if (remind.checked) {
      if (!('Notification' in window)) { toast('Notifications are not supported here', 'info'); remind.checked = false; return; }
      const perm = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
      if (perm !== 'granted') { toast('Allow notifications in your browser to enable reminders', 'info'); remind.checked = false; return; }
    }
    state.settings.reminders = remind.checked; saveState(state);
    toast(remind.checked ? `Reminders on (${time.value})` : 'Reminders off');
  });

  // Share / export / import / reset
  $('#share-btn').addEventListener('click', shareSummary);
  $('#export-btn').addEventListener('click', downloadData);
  const file = $('#import-file');
  $('#import-btn').addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    try {
      const data = JSON.parse(await file.files[0].text());
      if (!data.user || !data.totals || !data.streak) throw new Error('bad');
      saveState(data); toast('Data imported. Refreshing…'); setTimeout(() => location.reload(), 800);
    } catch { toast('That file is not a valid Ecosphere export.', 'info'); }
    file.value = '';
  });
  $('#reset-btn').addEventListener('click', () => openDialog({
    title: 'Reset all progress?', body: '<p>This permanently deletes your streak, totals and badges.</p>', confirmText: 'Yes, reset', danger: true,
    onConfirm() { resetData(); toast('Progress reset. Refreshing…'); setTimeout(() => location.reload(), 800); }
  }));
}

/* ---------- Boot ---------- */
const page = document.body.dataset.page;
if (page === 'dashboard') initDashboard();
else if (page === 'impact') initImpact();
else if (page === 'resources') initResources();
else if (page === 'profile') initProfile();
else initShared();
})();
