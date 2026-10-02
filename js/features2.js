import { loadState, getFreezes } from './storage.js';
import { $, toast } from './ui.js';

const safe = (f) => { try { f(); } catch (e) { console.warn('features2 error:', e); } };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---- Streak freeze chip ---- */
function freezeChip() {
  const chip = document.createElement('p'); chip.className = 'bio-chip';
  const show = () => { chip.textContent = `🧊 Streak freezes: ${getFreezes()} / 2 — earn one at every 7-day streak. It saves your streak if you miss a single day.`; };
  show(); $('.stats-bar')?.after(chip);
  document.addEventListener('click', (e) => { if (e.target.closest('.action-card button')) setTimeout(show, 200); });
}

/* ---- Custom habits (profile page) ---- */
function habits() {
  const K = 'bio_custom', get = () => JSON.parse(localStorage.getItem(K) || '[]');
  const sec = document.createElement('section'); sec.className = 'bio-card';
  sec.innerHTML = `<h2>➕ My custom habits</h2><p>Add your own daily action with your own impact. It appears on your Dashboard.</p>
    <div class="bio-form">
      <input id="ch-title" placeholder="Habit name" maxlength="40" /><input id="ch-icon" placeholder="Emoji" maxlength="4" />
      <input id="ch-co2" type="number" min="0" step="0.1" placeholder="kg CO₂ saved" /><input id="ch-water" type="number" min="0" step="1" placeholder="Litres water saved" /><input id="ch-energy" type="number" min="0" step="0.1" placeholder="kWh saved" />
    </div><button class="btn btn-primary btn-sm" id="ch-add">Add habit</button><ul class="bio-list" id="ch-list"></ul>`;
  $('main').appendChild(sec);
  const draw = () => { $('#ch-list').innerHTML = get().map((h) => `<li><span>${h.icon} ${h.title} — ${h.impactText}</span><button class="btn btn-danger btn-sm" data-del="${h.id}">Delete</button></li>`).join('') || '<li>No custom habits yet.</li>'; };
  $('#ch-list').onclick = (e) => {
    const id = e.target.dataset.del; if (!id) return;
    localStorage.setItem(K, JSON.stringify(get().filter((h) => h.id !== id))); draw(); toast('Habit deleted. It leaves the Dashboard after a refresh.', 'info');
  };
  $('#ch-add').onclick = () => {
    const title = $('#ch-title').value.trim(); if (!title) return toast('Give your habit a name', 'info');
    const n = (id) => Math.max(0, +$(id).value || 0), co2 = n('#ch-co2'), water = n('#ch-water'), energy = n('#ch-energy');
    const bits = [co2 && `${co2} kg CO₂`, water && `${water} L water`, energy && `${energy} kWh`].filter(Boolean);
    const l = get(); l.push({ id: 'my-' + Date.now(), title: esc(title), icon: esc($('#ch-icon').value.trim() || '⭐'), desc: 'My own habit',
      impact: { co2, water, energy, plastic: 0, waste: 0 }, impactText: bits.length ? '≈ ' + bits.join(' · ') + ' saved' : 'Every bit counts', category: 'custom' });
    localStorage.setItem(K, JSON.stringify(l)); ['#ch-title', '#ch-icon', '#ch-co2', '#ch-water', '#ch-energy'].forEach((i) => ($(i).value = ''));
    draw(); toast('Habit added! Find it on your Dashboard.');
  };
  draw();
}

/* ---- Monthly report (impact page → print → Save as PDF) ---- */
function report() {
  const sec = document.createElement('section'); sec.className = 'bio-card';
  sec.innerHTML = '<h2>📄 Monthly Biological Report</h2><p>A one-page summary you can save as a PDF.</p><button class="btn btn-primary" id="bio-rep">Create report</button>';
  $('main').appendChild(sec);
  $('#bio-rep').onclick = () => {
    const s = loadState(), log = JSON.parse(localStorage.getItem('bio_log') || '{}'), ym = new Date().toISOString().slice(0, 7), m = { n: 0, co2: 0, water: 0, energy: 0 };
    Object.entries(log).forEach(([d, v]) => { if (d.startsWith(ym)) for (const k in m) m[k] += v[k] || 0; });
    const month = new Date().toLocaleString('en', { month: 'long', year: 'numeric' });
    const row = (a, b, c) => `<tr><th>${a}</th><td>${b}</td><td>${c}</td></tr>`;
    let r = $('#bio-report'); if (!r) { r = document.createElement('div'); r.id = 'bio-report'; document.body.appendChild(r); }
    r.innerHTML = `<div class="rep-head"><h1>🌿 Biophilia</h1><p>Monthly Biological Report · ${month}</p></div><h2>${esc(s.user.name)}</h2>
      <table><thead><tr><th></th><th>This month</th><th>All time</th></tr></thead><tbody>
      ${row('Actions logged', m.n, s.totalActions)}${row('CO₂ saved (kg)', m.co2.toFixed(1), s.totals.co2.toFixed(1))}${row('Water saved (L)', m.water.toFixed(0), s.totals.water.toFixed(0))}${row('Energy saved (kWh)', m.energy.toFixed(1), s.totals.energy.toFixed(1))}</tbody></table>
      <p>Current streak: <b>${s.streak.current}</b> days · Best streak: <b>${s.streak.best}</b> days · Badges unlocked: <b>${s.unlockedBadges.length}</b></p>
      <p class="rep-foot">Made by Vedansh Prakash Mishra</p>`;
    window.print();
  };
}

/* ---- Shareable impact card (profile page) ---- */
function card() {
  const b = document.createElement('button'); b.className = 'btn btn-secondary'; b.textContent = '🖼️ Make impact card';
  b.style.cssText = 'background:white;color:#1E3A2B;margin-left:.5rem'; $('#share-btn')?.after(b);
  b.onclick = async () => {
    const s = loadState();
    try { await document.fonts.load('700 80px "Playfair Display"'); } catch {}
    const c = document.createElement('canvas'); c.width = c.height = 1080; const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 1080, 1080); g.addColorStop(0, '#1E3A2B'); g.addColorStop(1, '#4A6B53');
    x.fillStyle = g; x.fillRect(0, 0, 1080, 1080);
    x.fillStyle = 'rgba(255,255,255,0.06)'; x.beginPath(); x.arc(900, 180, 320, 0, 7); x.fill(); x.beginPath(); x.arc(120, 980, 260, 0, 7); x.fill();
    x.textAlign = 'center'; x.fillStyle = '#F7F1E3';
    x.font = '700 96px "Playfair Display", Georgia, serif'; x.fillText('🌿 Biophilia', 540, 220);
    x.font = '500 44px "Plus Jakarta Sans", sans-serif'; x.fillText(s.user.name + '’s impact', 540, 310);
    [[s.streak.current, 'day streak'], [s.totalActions, 'actions'], [s.totals.co2.toFixed(1), 'kg CO₂ saved']].forEach(([v, l], i) => {
      const cx = 200 + i * 340;
      x.fillStyle = 'rgba(255,255,255,0.12)'; x.beginPath(); (x.roundRect || x.rect).call(x, cx - 150, 430, 300, 300, 40); x.fill();
      x.fillStyle = '#FFD98A'; x.font = '700 110px "Playfair Display", Georgia, serif'; x.fillText(v, cx, 610);
      x.fillStyle = '#F7F1E3'; x.font = '500 34px "Plus Jakarta Sans", sans-serif'; x.fillText(l, cx, 680);
    });
    x.font = 'italic 40px "Plus Jakarta Sans", sans-serif'; x.fillText('Small actions, real impact.', 540, 880);
    x.fillStyle = '#C9D9CB'; x.font = '500 30px "Plus Jakarta Sans", sans-serif'; x.fillText('Made by Vedansh Prakash Mishra', 540, 1000);
    c.toBlob(async (blob) => {
      const f = new File([blob], 'biophilia-impact.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: 'My Biophilia impact' }); } catch {} }
      else { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'biophilia-impact.png'; a.click(); toast('Impact card saved to your downloads'); }
    });
  };
}

/* ---- Hindi / English ---- */
const HI = {
  'Dashboard': 'डैशबोर्ड', 'Impact': 'प्रभाव', 'Resources': 'संसाधन', 'Profile': 'प्रोफ़ाइल',
  'Good morning,': 'सुप्रभात,', 'Good afternoon,': 'नमस्कार,', 'Good evening,': 'शुभ संध्या,', 'Eco Friend': 'पर्यावरण मित्र',
  'Try it as a guest — enter a name to save your streak!': 'अतिथि के रूप में आज़माएँ — अपनी स्ट्रीक सहेजने के लिए नाम लिखें!', 'Save': 'सहेजें',
  'Today’s micro-actions. One click to log — every bit counts.': 'आज की छोटी-छोटी पहलें। दर्ज करने के लिए एक क्लिक — हर कदम मायने रखता है।',
  'Log it': 'दर्ज करें', '✓ Done': '✓ हो गया', 'Your Ecosystem': 'आपका पारिस्थितिकी तंत्र', 'Tree': 'पेड़', 'Stage': 'चरण', 'Status': 'स्थिति', 'Thriving': 'स्वस्थ',
  'Progress': 'प्रगति', 'Current streak': 'वर्तमान स्ट्रीक', 'Best streak': 'सर्वश्रेष्ठ स्ट्रीक', 'Actions logged': 'दर्ज की गई क्रियाएँ', 'Growth points': 'विकास अंक',
  'Seedling': 'नन्हा पौधा', 'Sprout': 'अंकुर', 'Young Tree': 'युवा वृक्ष', 'Growing Tree': 'बढ़ता वृक्ष', 'Flourishing Tree': 'फलता-फूलता वृक्ष',
  'Day streak': 'दिन की स्ट्रीक', 'impact so far': 'अब तक का प्रभाव', 'Actions': 'क्रियाएँ', 'Small actions, real impact.': 'छोटे कदम, असली असर।', 'Pages': 'पृष्ठ', 'Project files': 'प्रोजेक्ट फ़ाइलें',
  'Your Impact': 'आपका प्रभाव', 'Raw Totals': 'कुल आँकड़े', 'Relatable Metrics': 'समझने योग्य माप', 'Achievements': 'उपलब्धियाँ',
  'Abstract numbers made tangible — what your savings actually feel like.': 'अमूर्त संख्याएँ, मूर्त रूप में — आपकी बचत असल में कैसी लगती है।',
  'kg CO₂': 'किग्रा CO₂', 'Liters water': 'लीटर पानी', 'kWh energy': 'kWh ऊर्जा', 'Plastic avoided': 'बचा प्लास्टिक',
  'First Step': 'पहला कदम', 'On a Roll': 'लगातार जारी', 'Week Warrior': 'सप्ताह योद्धा', 'Eco Champion': 'पर्यावरण चैंपियन', 'Water Guardian': 'जल रक्षक',
  'Watt Saver': 'बिजली बचतकर्ता', 'Carbon Cutter': 'कार्बन कटौतीकर्ता', 'Plastic Fighter': 'प्लास्टिक विरोधी', 'Tree Grower': 'वृक्ष उगाने वाला', 'Habit Hero': 'आदत नायक',
  'Edit name': 'नाम बदलें', 'Overview': 'सारांश', 'Preferences': 'पसंद', 'Data': 'डेटा', 'Profile details': 'प्रोफ़ाइल विवरण', 'Share your impact': 'अपना प्रभाव साझा करें',
  'Show the world your eco streak': 'दुनिया को अपनी इको स्ट्रीक दिखाएँ', 'Share / Copy summary': 'साझा करें / सारांश कॉपी करें', 'Sound effects': 'ध्वनि प्रभाव', 'Dark mode': 'डार्क मोड',
  'Daily reminders (while Biophilia is open)': 'दैनिक रिमाइंडर (Biophilia खुला होने पर)', 'Reminder time': 'रिमाइंडर का समय', 'Export my data': 'मेरा डेटा निर्यात करें',
  'Download JSON': 'JSON डाउनलोड करें', 'Import data': 'डेटा आयात करें', 'Choose JSON file': 'JSON फ़ाइल चुनें', 'Reset all progress': 'सारी प्रगति रीसेट करें', 'Reset': 'रीसेट',
  'Resource Hub': 'संसाधन केंद्र', 'Short, practical tips you can read in under 3 minutes.': 'छोटे, व्यावहारिक सुझाव जिन्हें आप 3 मिनट से कम में पढ़ सकते हैं।',
  'Tap any card (or press Enter on it) to read the full tip.': 'पूरा सुझाव पढ़ने के लिए किसी भी कार्ड पर टैप करें।', 'Got it': 'समझ गया',
  'All': 'सभी', 'Energy Efficiency': 'ऊर्जा दक्षता', 'Waste & Recycling': 'कचरा और रीसाइक्लिंग', 'Seasonal Eating': 'मौसमी भोजन', 'Water Conservation': 'जल संरक्षण',
  'Kindly visit these websites': 'कृपया इन वेबसाइटों पर जाएँ', 'I do not own these.': 'ये मेरी नहीं हैं।',
  'Eat one plant-based meal': 'एक पौध-आधारित भोजन करें', 'Unplug idle electronics': 'बेकार पड़े इलेक्ट्रॉनिक उपकरण अनप्लग करें', 'Take a 5-minute shower': '5 मिनट में नहाएँ',
  'Use a reusable bottle all day': 'पूरे दिन दोबारा भरने वाली बोतल इस्तेमाल करें', 'Air-dry laundry': 'कपड़े हवा में सुखाएँ', 'Finish all food on your plate': 'थाली का सारा खाना खत्म करें',
  'Leave the car at home': 'गाड़ी घर पर छोड़ें', 'Switch off unused lights': 'इस्तेमाल न हो रही लाइटें बंद करें', 'Compost kitchen scraps': 'रसोई के कचरे से खाद बनाएँ',
  'Switch to cold water': 'ठंडे पानी का उपयोग करें', 'Carry a reusable kit': 'दोबारा इस्तेमाल होने वाला किट साथ रखें', 'Conduct a bin audit': 'कूड़ेदान की जाँच करें',
  'Declutter & donate': 'अनावश्यक सामान छाँटें और दान करें', 'Swap paper for cloth': 'कागज़ की जगह कपड़ा इस्तेमाल करें', 'Lower your thermostat': 'थर्मोस्टैट का तापमान कम करें',
  'Fix a leak': 'रिसाव ठीक करें', 'Pick up 5 pieces of trash': '5 कचरे के टुकड़े उठाएँ', 'Plant a native seed or flower': 'कोई देसी बीज या फूल लगाएँ',
  'Log biodiversity': 'जैव विविधता दर्ज करें', 'Store food properly': 'खाना सही तरीके से रखें', 'Buy local or seasonal': 'स्थानीय या मौसमी चीज़ें खरीदें'
};
const RX = [[/^(\d+) days$/, '$1 दिन'], [/^(\d+) growth points$/, '$1 विकास अंक'], [/^(\d+) \/ (\d+) points to next stage$/, '$1 / $2 अंक अगले चरण तक']];

function lang() {
  let hi = localStorage.getItem('bio_lang') === 'hi';
  const orig = new WeakMap();
  const tr = (s) => {
    const t = s.trim(); if (!t) return s;
    let out = HI[t];
    if (!out) for (const [r, v] of RX) if (r.test(t)) { out = t.replace(r, v); break; }
    if (!out) { const m = t.match(/^([^\p{L}\d]*)(.*?)([^\p{L}\d]*)$/u); if (m && HI[m[2]]) out = m[1] + HI[m[2]] + m[3]; }
    return out ? s.replace(t, () => out) : s;
  };
  const one = (n) => {
    const o = orig.get(n);
    if (hi) { if (o && n.data === o.hi) return; const t = tr(n.data); if (t !== n.data) { orig.set(n, { en: n.data, hi: t }); n.data = t; } }
    else if (o && n.data === o.hi) { n.data = o.en; orig.delete(n); }
  };
  const all = (root) => {
    if (root.nodeType === 3) return one(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), a = []; while (w.nextNode()) a.push(w.currentNode); a.forEach(one);
  };
  const b = document.createElement('button'); b.className = 'theme-toggle'; b.setAttribute('aria-label', 'Switch language');
  const label = () => { b.textContent = hi ? 'EN' : 'हिं'; document.documentElement.lang = hi ? 'hi' : 'en'; };
  label(); $('.nav-actions')?.prepend(b);
  b.onclick = () => { hi = !hi; localStorage.setItem('bio_lang', hi ? 'hi' : 'en'); label(); all(document.body); };
  new MutationObserver((ms) => { if (hi) ms.forEach((m) => { m.addedNodes.forEach(all); if (m.type === 'characterData') one(m.target); }); })
    .observe(document.body, { childList: true, subtree: true, characterData: true });
  if (hi) all(document.body);
}

/* ---- Boot ---- */
const page = document.body.dataset.page;
if (page === 'dashboard' || page === 'impact') safe(freezeChip);
if (page === 'impact') safe(report);
if (page === 'profile') { safe(habits); safe(card); }
safe(lang);
