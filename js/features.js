import { loadState } from './storage.js';
import { DAILY_ACTIONS } from './data.js';
import { $, toast } from './ui.js';

const today = () => new Date().toISOString().slice(0, 10);
const safe = (f) => { try { f(); } catch (e) { console.warn('Biophilia feature error:', e); } };
const fab = (txt, label, bottom) => {
  const b = document.createElement('button');
  b.className = 'bio-fab'; b.textContent = txt; b.style.bottom = bottom;
  b.setAttribute('aria-label', label); b.title = label;
  document.body.appendChild(b); return b;
};

/* ---- Daily history (feeds charts + heatmap) ---- */
function track() {
  const s = loadState(), cur = { n: s.totalActions, co2: s.totals.co2, water: s.totals.water, energy: s.totals.energy };
  const snap = JSON.parse(localStorage.getItem('bio_snap') || 'null'), log = JSON.parse(localStorage.getItem('bio_log') || '{}');
  if (snap && cur.n >= snap.n) {
    const t = (log[today()] = log[today()] || { n: 0, co2: 0, water: 0, energy: 0 });
    for (const k in cur) t[k] += cur[k] - snap[k];
  }
  localStorage.setItem('bio_log', JSON.stringify(log));
  localStorage.setItem('bio_snap', JSON.stringify(cur));
}

/* ---- Installable app ---- */
function pwa() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW failed', e));
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) return; // already installed
  let deferred = null;
  const b = fab('⬇️', 'Add Biophilia to your home screen', '9rem');
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  b.onclick = async () => {
    if (deferred) { deferred.prompt(); await deferred.userChoice; deferred = null; return; }
    toast(ios ? 'On iPhone: tap the Share button, then “Add to Home Screen”.'
      : 'Open the browser menu (⋮) and tap “Install app” or “Add to Home screen”.', 'info');
  };
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; });
  window.addEventListener('appinstalled', () => { b.hidden = true; toast('Installed! Open Biophilia from your home screen 🌿'); });
}


/* ---- Nature soundscapes (synthesized, no audio files) ---- */
function sounds() {
  let ctx, src, lfo, timer, mode = -1;
  const M = [['🌧️', 'Rain'], ['🌲', 'Forest'], ['🌊', 'Ocean']];
  const b = fab('🎧', 'Nature soundscape', '1rem');
  const stop = () => { try { src && src.stop(); lfo && lfo.stop(); } catch {} clearInterval(timer); src = lfo = null; };
  const chirp = () => {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime, f = 2000 + Math.random() * 1500;
    o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.4, t + 0.12);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.25);
  };
  const play = (m) => {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); ctx.resume();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = m === 0 ? 'bandpass' : 'lowpass'; f.frequency.value = [3200, 500, 380][m]; g.gain.value = [0.22, 0.08, 0.3][m];
    src.connect(f); f.connect(g); g.connect(ctx.destination); src.start();
    if (m === 2) { lfo = ctx.createOscillator(); const lg = ctx.createGain(); lfo.frequency.value = 0.12; lg.gain.value = 0.2; lfo.connect(lg); lg.connect(g.gain); lfo.start(); }
    if (m === 1) timer = setInterval(chirp, 2500);
  };
  b.onclick = () => {
    stop(); mode = mode >= 2 ? -1 : mode + 1; b.textContent = mode < 0 ? '🎧' : M[mode][0];
    if (mode < 0) return toast('Soundscape off', 'info');
    play(mode); toast(M[mode][1] + ' soundscape on', 'info');
  };
}

/* ---- Living Biome ---- */
let lastW = null;
function biome(host, s, w) {
  const p = s.growthPoints, n = s.totalActions, rain = w && w.rain;
  const r = (i) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  const A = [[10, '🦋'], [30, '🐦'], [60, '🐇'], [100, '🦌'], [150, '🦉']], F = ['🌸', '🌼', '🌷', '🌻'];
  let o = `<svg class="biome" viewBox="0 0 320 180" role="img" aria-label="Your living garden"><defs><linearGradient id="bsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${rain ? '#9DB0A8' : '#BFE3F2'}"/><stop offset="1" stop-color="${rain ? '#C9D6CF' : '#F4F7F4'}"/></linearGradient></defs><rect width="320" height="180" fill="url(#bsk)"/><text x="262" y="42" font-size="30">${rain ? '☁️' : '☀️'}</text><ellipse cx="160" cy="195" rx="250" ry="72" fill="#6FA37C"/><ellipse cx="50" cy="200" rx="150" ry="55" fill="#4A6B53"/>`;
  for (let i = 0; i < Math.min(1 + Math.floor(p / 20), 6); i++) o += `<text x="${25 + r(i + 1) * 250}" y="${118 + r(i + 7) * 10}" font-size="${34 + r(i + 3) * 10}">🌳</text>`;
  for (let i = 0; i < Math.min(n, 30); i++) o += `<text x="${10 + r(i + 20) * 290}" y="${142 + r(i + 40) * 32}" font-size="14">${F[i % 4]}</text>`;
  A.forEach(([need, e], i) => { if (p >= need) o += `<text class="fly" style="animation-delay:${i * 0.7}s" x="${40 + i * 55}" y="${i < 2 ? 70 + i * 12 : 152}" font-size="20">${e}</text>`; });
  if (rain) for (let i = 0; i < 26; i++) { const x = r(i + 60) * 320, y = r(i + 90) * 150; o += `<line x1="${x}" y1="${y}" x2="${x - 3}" y2="${y + 11}" stroke="#5B7C99" stroke-width="1.5"/>`; }
  const nx = A.find(([need]) => p < need);
  host.innerHTML = o + '</svg><p style="margin-top:.6rem">' + (nx ? `Next visitor ${nx[1]} arrives at ${nx[0]} growth points (you have ${p}).` : 'Your garden is fully alive! 🌿') + '</p>';
}
function biomeInit() {
  const sec = document.createElement('section'); sec.className = 'bio-card';
  sec.innerHTML = '<h2>🌿 Your Living Biome</h2><div id="bio-biome"></div>';
  ($('.eco-table-wrap')?.closest('section') || $('main')).after(sec);
  const draw = () => biome($('#bio-biome'), loadState(), lastW);
  draw();
  document.addEventListener('bio-weather', (e) => { lastW = e.detail; draw(); });
  document.addEventListener('click', (e) => { if (e.target.closest('.action-card button')) setTimeout(draw, 100); });
}

/* ---- Weather-smart tips (Open-Meteo, no key) ---- */
function weatherInit() {
  const sec = document.createElement('section'); sec.className = 'bio-card';
  sec.innerHTML = '<h2>🌦️ Weather-smart tip</h2><p id="bio-tip">Get a tip that fits today’s weather.</p><button class="btn btn-primary btn-sm" id="bio-wx">Use my location</button>';
  $('#bio-biome').closest('section').after(sec);
  $('#bio-wx').onclick = async () => {
    try {
      const pos = await new Promise((ok, no) => navigator.geolocation.getCurrentPosition(ok, no, { timeout: 10000 }));
      const { latitude, longitude } = pos.coords;
      const j = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`)).json();
      const t = j.current.temperature_2m, c = j.current.weather_code, rain = (c >= 51 && c <= 67) || (c >= 80 && c <= 99);
      $('#bio-tip').textContent = Math.round(t) + '°C — ' + (rain ? '🌧️ Rainy day: put a bucket or barrel outside and harvest rainwater for your plants.'
        : t >= 32 ? '🥵 Hot day: set the AC to 24–26 °C, keep showers short, and carry your reusable bottle.'
        : t <= 12 ? '🧣 Chilly day: lower the thermostat 1–2 °C and wear a layer instead.'
        : '🌤️ Lovely day: walk or bike short trips and air-dry your laundry.');
      document.dispatchEvent(new CustomEvent('bio-weather', { detail: { rain, t } }));
    } catch { toast('Could not get your weather. Allow location and try again.', 'info'); }
  };
}

/* ---- Voice logging ---- */
function voice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const EXTRA = {
    'skip-meat': 'vegetarian vegan veggie salad lunch dinner',
    'unplug': 'plug unplugged charger chargers devices socket',
    'short-shower': 'bath bathing quick',
    'reuse-bottle': 'flask refill refilled',
    'air-dry': 'dry dried laundry line sun hung',
    'no-food-waste': 'finished leftovers wasted',
    'walk-bike': 'walked biked cycle cycled work school office',
    'led-lights': 'light lamp lamps bulb bulbs',
    'compost': 'composted peels peel garden',
    'cold-wash': 'washed washing laundry machine'
  };
  const STOP = new Set(['the', 'and', 'for', 'with', 'you', 'your', 'all', 'one', 'off', 'use', 'used', 'take', 'took', 'did', 'have', 'had', 'was', 'are', 'this', 'that', 'from', 'some', 'today', 'just', 'instead', 'water', 'short']);
  const stem = (t) => String(t || '').toLowerCase().split(/[^\p{L}\p{M}\p{N}]+/u)
    .filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.slice(0, 4));
  const score = (said, card) => {
    const t = new Set(stem(card.title)), k = new Set(stem(EXTRA[card.id]));
    let s = 0; new Set(stem(said)).forEach((w) => { s += t.has(w) ? 3 : k.has(w) ? 2 : 0; });
    return s;
  };
  const ERR = {
    'not-allowed': 'Microphone is blocked. Allow it in your browser’s site settings and use an https:// link.',
    'service-not-allowed': 'Microphone is blocked. Allow it in your browser’s site settings and use an https:// link.',
    'no-speech': 'I did not hear anything. Tap 🎤 and speak right away.',
    'audio-capture': 'No microphone was found on this device.',
    'network': 'Voice needs internet (the browser sends audio to Google). Brave blocks this.',
    'language-not-supported': 'This browser cannot listen in that language.'
  };
  let rec = null;
  const b = fab('🎤', 'Log an action by voice', '5rem');
  b.onclick = () => {
    if (rec) { try { rec.stop(); } catch {} return; }
    if (!SR) return toast('Voice is not supported in this browser. Please use Chrome or Edge.', 'info');
    if (!window.isSecureContext) return toast('Voice only works on an https:// page, not http:// or a double-clicked file.', 'info');
    const cards = Array.from(document.querySelectorAll('.action-card[data-id]')).map((c) => ({
      c, id: c.dataset.id, title: (c.querySelector('.action-title') || c).textContent.trim()
    }));
    if (!cards.length) return toast('Open the Dashboard to log actions by voice.', 'info');
    rec = new SR();
    rec.lang = localStorage.getItem('bio_lang') === 'hi' ? 'hi-IN' : 'en-IN';
    rec.maxAlternatives = 3; rec.interimResults = false; rec.continuous = false;
    rec.onstart = () => { b.textContent = '🔴'; toast('Listening… say “I walked to work”', 'info'); };
    rec.onresult = (e) => {
      const alts = Array.from(e.results[0]).map((a) => a.transcript);
      const ranked = cards.map((card, i) => [Math.max(...alts.map((t) => score(t, card))), i]).sort((x, y) => y[0] - x[0]);
      const [top, i] = ranked[0], next = ranked[1] ? ranked[1][0] : 0;
      if (top < 3) return toast('I heard “' + alts[0] + '” but could not match it to an action.', 'info');
      if (top === next) return toast('I heard “' + alts[0] + '”. Say a little more so I can tell which action.', 'info');
      const btn = cards[i].c.querySelector('button');
      if (!btn || btn.disabled) return toast(cards[i].title + ' is already logged today ✓', 'info');
      btn.click();
    };
    rec.onerror = (e) => { if (e.error !== 'aborted') toast(ERR[e.error] || 'Voice error: ' + e.error, 'info'); };
    rec.onend = () => { rec = null; b.textContent = '🎤'; };
    try { rec.start(); } catch { rec = null; toast('Could not start the microphone. Reload the page and try again.', 'info'); }
  };
}

/* ---- Impact page: charts + heatmap ---- */
function impactCharts() {
  const sec = document.createElement('section'); sec.className = 'bio-card';
  sec.innerHTML = '<h2>📈 Progress</h2><div class="bio-controls"><select id="bio-metric"><option value="co2">CO₂ (kg)</option><option value="water">Water (L)</option><option value="energy">Energy (kWh)</option></select><select id="bio-range"><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select></div><div id="bio-chart"></div><h2 style="margin-top:1.5rem">🔥 Streak heatmap</h2><div id="bio-heat" class="heatmap"></div>';
  $('main').appendChild(sec);
  const day = (i) => new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
  const draw = () => {
    const log = JSON.parse(localStorage.getItem('bio_log') || '{}'), m = $('#bio-metric').value, days = +$('#bio-range').value;
    const v = []; for (let i = days - 1; i >= 0; i--) v.push([day(i), (log[day(i)] || {})[m] || 0]);
    const max = Math.max(...v.map((x) => x[1]), 1), w = 300 / days;
    $('#bio-chart').innerHTML = `<svg class="bars" viewBox="0 0 300 110"><text x="0" y="8">${max.toFixed(1)}</text>` + v.map(([d, y], i) => `<rect x="${i * w + 1}" y="${100 - (y / max) * 90}" width="${w - 2}" height="${(y / max) * 90}" rx="3"><title>${d}: ${y.toFixed(1)}</title></rect>`).join('') + '</svg>';
    let h = ''; for (let i = 83; i >= 0; i--) { const n = (log[day(i)] || {}).n || 0; h += `<i class="hm l${Math.min(n, 4)}" title="${day(i)}: ${n} action(s)"></i>`; }
    $('#bio-heat').innerHTML = h;
  };
  $('#bio-metric').onchange = draw; $('#bio-range').onchange = draw; draw();
}

/* ---- Boot ---- */
const page = document.body.dataset.page;
safe(pwa); safe(sounds);
safe(() => { track(); document.addEventListener('click', (e) => { if (e.target.closest('.action-card button')) setTimeout(track, 100); }); });
if (page === 'dashboard') { safe(biomeInit); safe(weatherInit); safe(voice); }
if (page === 'impact') safe(impactCharts);
