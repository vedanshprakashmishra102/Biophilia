/* ===== Project file browser =====
   1) fills the "Project files" list in the footer of EVERY page
   2) powers the viewer on files.html (click a file -> see its code)
   The list comes from files.txt (auto-made by build.sh) or, if that is
   missing, from the FILES list below. Add new files to FILES as a backup. */
const FILES = [
  ['index.html', 'Home / daily dashboard'],
  ['impact.html', 'Impact metrics and badges'],
  ['resources.html', 'Eco tips library'],
  ['profile.html', 'Profile and settings'],
  ['files.html', 'This file browser'],
  ['css/styles.css', 'Main styles'],
  ['css/upgrade.css', 'Extra feature styles'],
  ['js/app.js', 'Page logic'],
  ['js/data.js', 'Actions, badges, articles'],
  ['js/storage.js', 'Saved progress (localStorage)'],
  ['js/ui.js', 'UI helpers'],
  ['js/features.js', 'Install, voice, sounds, biome, weather, charts'],
  ['js/features2.js', 'Streak freeze, custom habits, report, Hindi'],
  ['js/ecosphere.js', 'Bundled build output'],
  ['js/files.js', 'This file list'],
  ['manifest.json', 'App install settings'],
  ['sw.js', 'Service worker (offline support)'],
  ['icon.svg', 'App icon (vector)'],
  ['icon-192.png', 'Install icon 192px'],
  ['icon-512.png', 'Install icon 512px'],
  ['icon-maskable-512.png', 'Android adaptive icon'],
  ['apple-touch-icon.png', 'iPhone home-screen icon'],
  ['README.md', 'Project notes'],
  ['build.sh', 'Build script']
];
const notes = new Map(FILES);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => '&#' + c.charCodeAt(0) + ';');

async function getList() {
  try {
    const r = await fetch('files.txt', { cache: 'no-cache' });
    const t = r.ok ? await r.text() : '';
    if (t && !/[<>]/.test(t)) { // ignore a fake 200 page from hosts that redirect everything to index.html
      const order = [...notes.keys()];
      const paths = t.split('\n').map((x) => x.trim()).filter(Boolean)
        .sort((a, b) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999) || a.localeCompare(b));
      if (paths.length) return paths.map((p) => [p, notes.get(p) || '']);
    }
  } catch {}
  return FILES;
}

function footer(list) {
  const ul = document.querySelector('.footer-col a[href="css/styles.css"]')?.closest('ul');
  if (!ul) return;
  ul.style.cssText = 'max-height:15rem;overflow:auto';
  ul.innerHTML = list.map(([p]) => `<li><a href="files.html#${encodeURI(p)}">${esc(p)}</a></li>`).join('');
}

function browser(list) {
  const nav = document.getElementById('file-list');
  if (!nav) return;
  const code = document.getElementById('file-code'), title = document.getElementById('file-title'),
    note = document.getElementById('file-note'), img = document.getElementById('file-img');
  nav.innerHTML = list.map(([p]) => `<li><button type="button" data-p="${esc(p)}">${esc(p)}</button></li>`).join('');
  const open = async (p) => {
    nav.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.p === p));
    title.textContent = p; note.textContent = notes.get(p) || ''; img.hidden = true; code.textContent = 'Loading…';
    if (/\.(png|jpe?g|gif|webp)$/i.test(p)) { img.src = p; img.hidden = false; code.textContent = ''; return; }
    try {
      const r = await fetch(p, { cache: 'no-cache' });
      if (!r.ok) throw new Error(r.status);
      code.textContent = await r.text();
    } catch { code.textContent = 'Could not load ' + p + '. Make sure this file is uploaded to your site.'; }
  };
  nav.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    history.replaceState(null, '', '#' + encodeURI(b.dataset.p)); open(b.dataset.p);
  };
  let want = ''; try { want = decodeURI(location.hash.slice(1)); } catch {}
  open(list.some(([p]) => p === want) ? want : list[0][0]);
}

getList().then((list) => { footer(list); browser(list); });
       
