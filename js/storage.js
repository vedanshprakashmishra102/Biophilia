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

export function loadState() {
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

export function saveState(state) {
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

export function logAction(state, action) {
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

export function isResting(state) {
  const today = todayStr();
  const last = state.streak.lastActionDate;
  if (!last) return false;
  if (last === today) return false;
  const lastDate = new Date(last + 'T12:00:00');
  const todayDate = new Date(today + 'T12:00:00');
  const diff = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
  return diff >= 1;
}

export function setName(state, name) {
  state.user.name = name.trim() || 'Eco Friend';
  state.user.isGuest = false;
  saveState(state);
}

export function toggleDark(state) {
  state.user.darkMode = !state.user.darkMode;
  saveState(state);
  return state.user.darkMode;
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportData(state) {
  return JSON.stringify(state, null, 2);
    }
