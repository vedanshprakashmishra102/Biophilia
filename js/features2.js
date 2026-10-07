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
  'Log biodiversity': 'जैव विविधता दर्ज करें', 'Store food properly': 'खाना सही तरीके से रखें', 'Buy local or seasonal': 'स्थानीय या मौसमी चीज़ें खरीदें',   // ===== PASTE THESE INSIDE `const HI = { ... }` (add a comma after your last existing entry) =====
  // Keys containing {n}, {date}, {name} etc. are templates: replace the placeholder with the real value in code.

  // --- Profile header ---
  'Joined {date} · {n} actions logged': '{date} को जुड़े · {n} क्रियाएँ दर्ज की गईं',
  'Make impact card': 'प्रभाव कार्ड बनाएँ',

  // --- Custom habits ---
  'My custom habits': 'मेरी अपनी आदतें',
  'Add your own daily action with your own impact. It appears on your Dashboard.': 'अपनी खुद की दैनिक क्रिया और उसका प्रभाव जोड़ें। यह आपके डैशबोर्ड पर दिखाई देगी।',
  'Habit name': 'आदत का नाम', 'Emoji': 'इमोजी', 'kg CO₂ saved': 'बचाई गई किग्रा CO₂', 'Litres water saved': 'बचाए गए लीटर पानी', 'kWh saved': 'बचाई गई kWh',
  'Add habit': 'आदत जोड़ें', 'Delete': 'हटाएँ',
  '{name} — ≈ {co2} kg CO₂ · {water} L water · {kwh} kWh saved': '{name} — ≈ {co2} किग्रा CO₂ · {water} लीटर पानी · {kwh} kWh की बचत',

  // --- Streak freeze / dashboard ---
  'Streak freezes: {a} / {b} — earn one at every 7-day streak. It saves your streak if you miss a single day.': 'स्ट्रीक फ़्रीज़: {a} / {b} — हर 7-दिन की स्ट्रीक पर एक कमाएँ। अगर आप एक दिन चूक जाएँ तो यह आपकी स्ट्रीक बचा लेता है।',
  'Your Living Biome': 'आपका जीवंत बायोम',
  'Next visitor {emoji} arrives at {n} growth points (you have {m}).': 'अगला मेहमान {emoji} {n} विकास अंक पर आएगा (आपके पास {m} हैं)।',
  'Weather-smart tip': 'मौसम के अनुसार सुझाव', 'Get a tip that fits today’s weather.': 'आज के मौसम के अनुकूल सुझाव पाएँ।', 'Use my location': 'मेरा स्थान उपयोग करें',
  'miles not driven': 'मील नहीं चले',
  'Air-dry clothes instead of dryer': 'ड्रायर की जगह कपड़े हवा में सुखाएँ', '≈ {n} kWh energy saved': '≈ {n} kWh ऊर्जा की बचत',
  'Walk or bike for a short trip': 'छोटी दूरी के लिए पैदल चलें या साइकिल चलाएँ', '≈ {n} kg CO₂ saved': '≈ {n} किग्रा CO₂ की बचत',

  // --- Profile details table ---
  'Display name': 'प्रदर्शित नाम', 'Account type': 'खाते का प्रकार', 'Saved profile': 'सहेजी गई प्रोफ़ाइल', 'Joined': 'जुड़ने की तिथि', 'Level': 'स्तर',
  'CO₂ saved': 'बचाई गई CO₂', 'Water saved': 'बचाया गया पानी', 'Energy saved': 'बचाई गई ऊर्जा', 'Badges unlocked': 'अनलॉक किए गए बैज',
  '{n} kg': '{n} किग्रा', '{n} L': '{n} लीटर',
  'Reach Flourishing Tree stage': 'फलता-फूलता वृक्ष चरण तक पहुँचें',

  // --- Relatable metrics (Impact page) ---
  '{n} kg CO₂ saved': '{n} किग्रा CO₂ बचाई', '{n} L water saved': '{n} लीटर पानी बचाया', '{n} kWh energy saved': '{n} kWh ऊर्जा बचाई',
  '{n} plastic bottle(s) avoided': '{n} प्लास्टिक बोतल से बचाव', '{n} kg food waste avoided': '{n} किग्रा खाद्य अपशिष्ट से बचाव',
  '{n} miles not driven': '{n} मील नहीं चले', 'You saved enough carbon to offset a {n}-mile drive!': 'आपने इतना कार्बन बचाया जो {n} मील की ड्राइव की भरपाई कर दे!',
  '{n} phone charges': '{n} फ़ोन चार्ज', 'That’s equivalent to charging your phone every night for nearly {n} years!': 'यह रोज़ रात अपना फ़ोन चार्ज करने के लगभग {n} साल के बराबर है!',
  '{n} tree-years': '{n} वृक्ष-वर्ष', 'You just matched the work of {n} full-grown tree(s) for a whole year!': 'आपने पूरे एक साल तक {n} पूर्ण विकसित पेड़ों के बराबर काम किया!',
  '{n} drinking glasses': '{n} पीने के गिलास', 'You saved enough water to fill {n} drinking glasses!': 'आपने इतना पानी बचाया जिससे {n} गिलास भरे जा सकें!',
  '{n} laundry loads': '{n} लॉन्ड्री लोड', 'Your choices saved {n} full loads of laundry worth of water!': 'आपके चुनावों ने {n} पूरे लॉन्ड्री लोड के बराबर पानी बचाया!',
  '{n} hours of TV': '{n} घंटे टीवी', 'You saved enough power to binge-watch for {n} hours!': 'आपने इतनी बिजली बचाई कि लगातार {n} घंटे टीवी देखा जा सके!',
  '{n} fridge-days': '{n} फ्रिज-दिन', 'You saved enough electricity to power a home refrigerator for {n} days!': 'आपने इतनी बिजली बचाई कि घर का फ्रिज {n} दिन चल सके!',
  '{n} years of decomposition': '{n} साल का अपघटन', 'You kept plastic out of the ocean that would have lasted until the year {year}!': 'आपने समुद्र को उस प्लास्टिक से बचाया जो साल {year} तक बना रहता!',
  '{n} miles of methane avoided': '{n} मील के बराबर मीथेन से बचाव', 'Rescuing this food prevented landfill gas equivalent to driving {n} miles!': 'इस भोजन को बचाने से लैंडफिल गैस उत्सर्जन रुका, जो {n} मील गाड़ी चलाने के बराबर है!',

  // --- Resource cards: read time ---
  '{n} min read': '{n} मिनट में पढ़ें',
  '1 min read': '1 मिनट में पढ़ें', '2 min read': '2 मिनट में पढ़ें', '3 min read': '3 मिनट में पढ़ें', '5 min read': '5 मिनट में पढ़ें',

  // --- Resource cards: titles & descriptions ---
  'How to Recycle Right in Your City': 'अपने शहर में सही तरीके से रीसाइक्लिंग कैसे करें',
  'Quick guide to what actually goes in the blue bin—and the common mistakes that contaminate loads.': 'नीले डिब्बे में असल में क्या डाला जाता है और वे आम गलतियाँ जो पूरी खेप को दूषित कर देती हैं, इसकी त्वरित गाइड।',

  'Seasonal Eating: What’s Fresh This Month': 'मौसमी भोजन: इस महीने क्या ताज़ा है',
  'Buying produce in season cuts food miles and supports local farmers. Here’s what’s in peak now.': 'मौसम की उपज खरीदने से भोजन की ढुलाई की दूरी घटती है और स्थानीय किसानों को सहारा मिलता है। देखिए अभी क्या सबसे बढ़िया है।',

  'Phantom Load: The Hidden Energy Drain': 'फैंटम लोड: छिपी हुई ऊर्जा की खपत',
  'Devices still draw power when "off". Learn which ones to unplug and how much you’ll save.': 'उपकरण "बंद" होने पर भी बिजली खींचते रहते हैं। जानें कौन-से अनप्लग करने हैं और कितनी बचत होगी।',

  '5-Minute Shower Challenge Tips': '5 मिनट शावर चैलेंज के सुझाव',
  'Timer tricks, low-flow heads, and the one habit that cuts shower time without feeling rushed.': 'टाइमर की तरकीबें, कम बहाव वाले शावरहेड, और वह एक आदत जो जल्दबाज़ी महसूस किए बिना नहाने का समय घटाती है।',

  'Composting for Apartment Dwellers': 'अपार्टमेंट में रहने वालों के लिए खाद बनाना',
  'No backyard? Countertop bins and community drop-offs make composting doable in small spaces.': 'पिछवाड़ा नहीं है? काउंटरटॉप डिब्बे और सामुदायिक संग्रह केंद्र छोटी जगह में भी खाद बनाना संभव बनाते हैं।',

  'Cold Wash Myths Busted': 'ठंडे पानी से धुलाई के मिथक टूटे',
  'Modern detergents work great in cold water. You’ll save energy and your clothes will last longer.': 'आधुनिक डिटर्जेंट ठंडे पानी में भी बढ़िया काम करते हैं। आप ऊर्जा बचाएँगे और आपके कपड़े ज़्यादा चलेंगे।',

  'Meatless Mondays Made Easy': 'मीट-रहित सोमवार, अब आसान',
  'Three satisfying plant-based swaps that cut a big chunk of your weekly carbon footprint.': 'तीन संतोषजनक पौध-आधारित विकल्प जो आपके साप्ताहिक कार्बन फुटप्रिंट का बड़ा हिस्सा घटाते हैं।',

  'Rainwater Harvesting Basics': 'वर्षा जल संचयन की बुनियादी बातें',
  'A simple barrel setup can water your plants for free and reduce runoff. Here’s how to start.': 'एक साधारण ड्रम सेटअप से आपके पौधों को मुफ़्त पानी मिल सकता है और बहाव कम होता है। शुरुआत ऐसे करें।',

  'Fix household leaks': 'घर के रिसाव ठीक करें',
  'A single dripping tap can waste hundreds of liters of water each month.': 'अकेला टपकता नल हर महीने सैकड़ों लीटर पानी बर्बाद कर सकता है।',

  'Turn off the tap while brushing': 'ब्रश करते समय नल बंद रखें',
  'Keep the water running only when actively rinsing to save around 6 liters per minute.': 'पानी तभी चलाएँ जब कुल्ला कर रहे हों — इससे लगभग 6 लीटर प्रति मिनट बचते हैं।',

  'Reuse kitchen water': 'रसोई का पानी दोबारा इस्तेमाल करें',
  'Save the water used to wash fruits and vegetables and use it to water household plants.': 'फल और सब्ज़ियाँ धोने में इस्तेमाल हुआ पानी बचाएँ और उससे घर के पौधों को सींचें।',

  'Take shorter showers': 'कम समय नहाएँ',
  'Aim for 4 to 5-minute showers, or switch to a water-saving showerhead.': '4 से 5 मिनट में नहाने का लक्ष्य रखें, या पानी बचाने वाला शावरहेड लगाएँ।',

  'Buy at local farmers’ markets': 'स्थानीय किसान बाज़ारों से खरीदें',
  'Produce harvested at peak seasonality requires less artificial greenhouse heating and long-distance transportation.': 'मौसम के चरम पर काटी गई उपज को कम कृत्रिम ग्रीनहाउस गर्मी और लंबी दूरी की ढुलाई की ज़रूरत पड़ती है।',

  'Preserve seasonal abundance': 'मौसमी भरपूरता को सहेजें',
  'Freeze, pickle, or dry excess fruits and vegetables when they are plentiful to enjoy during off-seasons.': 'जब फल और सब्ज़ियाँ भरपूर हों तो अतिरिक्त को फ्रीज़ करें, अचार बनाएँ या सुखाएँ, ताकि बेमौसम में उनका आनंद ले सकें।',

  'Plan meals around local crops': 'स्थानीय फसलों के आधार पर भोजन की योजना बनाएँ',
  'Check a seasonal produce guide for your region before grocery shopping to choose food grown nearby.': 'किराने की खरीदारी से पहले अपने क्षेत्र की मौसमी उपज की गाइड देखें, ताकि आस-पास उगा भोजन चुन सकें।',

  'Store produce properly': 'फल-सब्ज़ियाँ सही तरीके से रखें',
  'Keep veggies like leafy greens crisp in airtight containers to extend their shelf life and prevent food rot.': 'पत्तेदार साग जैसी सब्ज़ियों को वायुरोधी डिब्बों में रखें ताकि वे कुरकुरी रहें, ज़्यादा दिन चलें और सड़ें नहीं।',

  'Unplug "vampire" loads': '"वैम्पायर" लोड अनप्लग करें',
  'Disconnect chargers, microwave clocks, and entertainment devices when not in use to eliminate phantom power consumption.': 'चार्जर, माइक्रोवेव की घड़ी और मनोरंजन उपकरण इस्तेमाल में न हों तो उन्हें डिस्कनेक्ट करें, ताकि फैंटम बिजली खपत खत्म हो।',

  'Wash clothes in cold water': 'कपड़े ठंडे पानी में धोएँ',
  'Heating water accounts for about 90% of the energy used by a washing machine.': 'वॉशिंग मशीन में इस्तेमाल होने वाली लगभग 90% ऊर्जा पानी गर्म करने में खर्च होती है।',

  'Switch to LED bulbs': 'LED बल्ब अपनाएँ',
  'Replace traditional incandescent bulbs with LEDs, which use up to 75% less energy and last much longer.': 'पारंपरिक गरम तार वाले बल्बों की जगह LED लगाएँ, जो 75% तक कम ऊर्जा लेते हैं और बहुत ज़्यादा चलते हैं।',

  'Optimize home temperature': 'घर का तापमान संतुलित रखें',
  'Lower your thermostat by 1–2°C in winter or raise it by 1–2°C in summer to cut HVAC energy demands.': 'सर्दियों में थर्मोस्टैट 1–2°C कम करें या गर्मियों में 1–2°C बढ़ाएँ, ताकि हीटिंग-कूलिंग की ऊर्जा माँग घटे।',

  'Follow the "4 Rs"': '"4 R" नियम अपनाएँ',
  'Prioritize Refuse, Reduce, and Reuse before relying on Recycling.': 'रीसाइक्लिंग पर निर्भर होने से पहले मना करने, कम करने और दोबारा इस्तेमाल करने को प्राथमिकता दें।',

  'Set up a kitchen compost bin': 'रसोई में कम्पोस्ट डिब्बा लगाएँ',
  'Separate food scraps, coffee grounds, and paper products from general waste to reduce landfill methane emissions.': 'खाने के बचे टुकड़े, कॉफ़ी के अवशेष और कागज़ी उत्पाद सामान्य कचरे से अलग रखें, ताकि लैंडफिल में मीथेन उत्सर्जन घटे।',

  'Carry a zero-waste kit': 'ज़ीरो-वेस्ट किट साथ रखें',
  'Keep reusable bags, a stainless steel water bottle, and compact cutlery in your everyday bag.': 'अपने रोज़ के बैग में दोबारा इस्तेमाल होने वाले थैले, स्टेनलेस स्टील की बोतल और छोटे आकार के बर्तन-कटलरी रखें।',

  'Rinse recyclables': 'रीसाइकल होने वाली चीज़ें धोएँ',
  'Briefly rinse plastic, glass, and metal containers before placing them in recycling bins to avoid contaminating entire loads.': 'प्लास्टिक, काँच और धातु के डिब्बों को रीसाइक्लिंग बिन में डालने से पहले हल्का धो लें, ताकि पूरी खेप दूषित न हो।',
  
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
