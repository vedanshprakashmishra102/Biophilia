/* ===== BIOPHILIA – Main Application ===== */
import { DAILY_ACTIONS, BADGES, ARTICLES, CATEGORIES, getRelatableMetrics, getTreeStage, getProgressToNext } from './data.js';
import { loadState, saveState, logAction, isResting, setName, toggleDark, resetData, exportData } from './storage.js';
import { $, $$, toast, confetti, applyTheme, renderTree, initNav, formatDate, openDialog, beep } from './ui.js';

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
  const text = `I've logged ${state.totalActions} eco-actions and saved ${state.totals.co2.toFixed(1)} kg CO₂ with Biophilia! 🌱 Current streak: ${state.streak.current} days.`;
  try {
    if (navigator.share) await navigator.share({ title: 'My Biophilia Impact', text });
    else { await navigator.clipboard.writeText(text); toast('Impact summary copied to clipboard!'); }
  } catch (e) { if (e.name !== 'AbortError') toast('Could not share — try again.', 'info'); }
}

function downloadData() {
  const url = URL.createObjectURL(new Blob([exportData(state)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url; a.download = `biophilia-report-${new Date().toISOString().slice(0, 10)}.json`; a.click();
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
      new Notification('Biophilia 🌿', { body: 'Time for today’s micro-actions!' });
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
  return shuffled;
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
    } catch { toast('That file is not a valid Biophilical export.', 'info'); }
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
import('./features.js').catch((e) => console.warn('features.js failed', e));
