# 🌿 Biophilia — Eco Habit Tracker

**Small actions, real impact.** Biophilia is a free, lightweight website (and installable app) where you log tiny daily eco-friendly actions, grow a living tree and garden, keep a streak, and see your savings turned into everyday comparisons like *miles not driven* and *loads of laundry*.

There is no sign-up, no server and no tracking. Everything is stored privately in your own browser.

Made by **Vedansh Prakash Mishra**.

---

## 📑 Table of contents

1. [Quick start](#-quick-start)
2. [Install it on your device](#-install-it-on-your-device)
3. [Pages at a glance](#-pages-at-a-glance)
4. [Features in detail](#-features-in-detail)
5. [Browser and device support](#-browser-and-device-support)
6. [Permissions and privacy](#-permissions-and-privacy)
7. [Project files](#-project-files)
8. [How it works](#-how-it-works)
9. [Customize it](#-customize-it)
10. [Run and deploy](#-run-and-deploy)
11. [Troubleshooting](#-troubleshooting)
12. [Known limitations](#-known-limitations)
13. [Roadmap](#-roadmap)
14. [Credits and license](#-credits-and-license)

---

## ⚡ Quick start

**Just want to use it?** Open the website's address in Chrome, Edge or Safari. You can use it immediately as a guest.

1. On the **Dashboard**, tap **Log it** on anything you did today.
2. Watch your tree and streak grow.
3. Type your name in the guest banner at the top to save your profile name.
4. Visit **Impact** to see what your actions add up to.

**Want to run the files yourself?** Do not double-click `index.html`. The pages use JavaScript modules, which browsers block on `file://` addresses. Use a local server instead (see [Run and deploy](#-run-and-deploy)).

---

## 📲 Install it on your device

Biophilia is a Progressive Web App (PWA). Installing it puts an icon on your home screen or desktop and opens it full-screen like a normal app.

> **The site must be served over `https://`** (or `localhost`) for installing, the microphone, location and notifications to work. Hosts like GitHub Pages and Netlify provide HTTPS automatically.

A round **⬇️ button** appears at the bottom-right of every page (until the app is installed). Tap it to install, or follow the steps for your device below. On browsers that cannot show an install pop-up it simply tells you which menu to use.

### 🤖 Android

**Chrome (recommended)**
1. Open the site.
2. Tap the **⬇️** button, then **Install**.
   *Or:* tap **⋮** → **Install app** (or **Add to Home screen**) → **Install**.
3. Open **Biophilia** from your home screen or app drawer.

**Samsung Internet / Edge:** open the browser menu and choose **Add page to → Home screen** (Samsung Internet) or **Add to phone** (Edge). Exact wording varies by version.

**Microphone:** Chrome asks the first time you tap 🎤. If you tapped *Block*, tap the 🔒 icon in the address bar → **Permissions** → **Microphone** → **Allow**.

**Uninstall:** long-press the icon → **Uninstall** or **Remove**.

### 🍎 iPhone and iPad

1. Open the site in **Safari**.
2. Tap the **Share** button (square with an arrow).
3. Scroll down and tap **Add to Home Screen** → **Add**.

Notes for iOS:
- iOS never shows an install pop-up, so the **⬇️** button only shows these instructions.
- Voice logging works best inside a normal Safari or Chrome tab. Speech recognition is unreliable inside home-screen apps on iOS.
- Microphone permission: **Settings → Safari → Microphone** (or the website settings for Safari).

**Uninstall:** long-press the icon → **Remove App**.

### 🪟 Windows

**Chrome or Edge**
1. Open the site.
2. Click the **install icon** on the right side of the address bar, or tap the **⬇️** button.
3. Click **Install**.

Edge also offers **⋯ → Apps → Install this site as an app**.

**Uninstall:** open the installed app, click **⋮** (or **⋯**) in its title bar → **Uninstall**.

### 🍏 macOS

- **Chrome / Edge:** click the install icon in the address bar, or the **⬇️** button, then **Install**.
- **Safari 17 or newer:** **File → Add to Dock**.
- **Firefox:** does not install web apps on desktop. You can still use the site normally in a tab.

### 🐧 Linux and ChromeOS

Use Chrome, Chromium or Edge and follow the Windows steps above.

### ✅ Check that installation is set up correctly (for site owners)

In desktop Chrome press **F12 → Application → Manifest**. It lists the app name, icons and any problem blocking installation.

---

## 🧭 Pages at a glance

| Page | File | What it does |
|------|------|--------------|
| 🏠 Dashboard | `index.html` | Today's actions, your tree, stats, living garden, weather tip, voice logging |
| 🌍 Impact | `impact.html` | Totals, relatable metrics, badges, progress chart, streak heatmap, monthly report |
| 📚 Resources | `resources.html` | 24 bite-sized eco tips with category filters |
| 👤 Profile | `profile.html` | Name, level, preferences, data tools, share card, custom habits |
| 📁 Project files | `files.html` | Browse and read every file in the project |

Every page has the same top bar: logo, page links, a 🌙 theme button, a **हिं / EN** language button, and a **⋮** menu.

---

## 🌟 Features in detail

### 1. Daily micro-actions

Ten built-in actions appear on the Dashboard. Their order is shuffled once per day (the same order for everyone on the same date). Each action can be logged **once per day**. Logging gives you confetti, a toast message, a sound (if enabled) and 1 growth point.

| | Action | Impact it records |
|---|--------|-------------------|
| 🥗 | Skip meat for one meal | 2.5 kg CO₂ and 150 L water |
| 🔌 | Unplug idle electronics | 1.5 kWh energy (0.4 kg CO₂) |
| 🚿 | Take a 5-minute shower | 35 L water (0.8 kWh, 0.3 kg CO₂) |
| 🧴 | Use a reusable bottle all day | 1 plastic bottle avoided (0.1 kg CO₂) |
| 👕 | Air-dry clothes instead of dryer | 3.5 kWh energy (1.2 kg CO₂) |
| 🍽️ | Finish all food on your plate | 0.5 kg food waste avoided (0.5 kg CO₂, 20 L water) |
| 🚲 | Walk or bike for a short trip | 1.8 kg CO₂ |
| 💡 | Switch off unused lights | 0.6 kWh energy (0.2 kg CO₂) |
| 🍂 | Compost kitchen scraps | 0.4 kg waste diverted (0.8 kg CO₂) |
| 🧺 | Wash clothes in cold water | 1.2 kWh energy (0.6 kg CO₂) |

You can add your own actions too (see [Custom habits](#12-custom-habits)).

> The numbers are rough, motivating estimates. They are not scientific measurements.

### 2. Interactive tree ecosystem

Your tree grows through five stages. You earn **1 growth point per action logged**.

| Stage | Growth points |
|-------|---------------|
| 🌱 Seedling | 0 – 4 |
| 🌿 Sprout | 5 – 11 |
| 🌳 Young Tree | 12 – 24 |
| 🌳 Growing Tree | 25 – 49 |
| 🌲 Flourishing Tree | 50 and above |

A progress bar shows how far you are from the next stage. **Your tree never dies.** If you miss a day it enters a gold-tinted **Resting** state with the message *"log an action to wake it"*.

### 3. Streaks and streak freezes

- **Streak:** the number of days in a row you logged at least one action. Your **current** and **best** streaks are both tracked. Days roll over at UTC midnight (see [How it works](#-how-it-works)).
- **Missing a day:** the tree rests, and your next logged action starts a new streak at 1 unless you have a freeze.
- **🧊 Streak freeze:** you earn one every time your streak reaches a multiple of 7 days (7, 14, 21…). You can hold up to **2**. A freeze automatically covers **one** missed day so your streak continues. The Dashboard and Impact page show *"Streak freezes: n / 2"*.

### 4. Achievements (10 badges)

Locked badges show a progress bar. A toast announces each unlock.

| Badge | How to unlock |
|-------|---------------|
| 🌱 First Step | Log your first action |
| 🔥 On a Roll | Reach a 3-day streak |
| ⚡ Week Warrior | Reach a 7-day streak |
| 🏆 Eco Champion | Reach a 30-day streak |
| 💧 Water Guardian | Save 200 L of water |
| ⚡ Watt Saver | Save 20 kWh of energy |
| 🌍 Carbon Cutter | Offset 25 kg of CO₂ |
| 🚫 Plastic Fighter | Avoid 10 plastic bottles |
| 🌳 Tree Grower | Reach the Flourishing Tree stage (50 points) |
| 💪 Habit Hero | Log 50 total actions |

Badges use your **best** streak, so a missed day never takes a badge away.

### 5. Relatable impact metrics

The Impact page turns raw numbers into everyday comparisons. Extra cards appear as you pass each threshold.

| You saved | It becomes | Appears when |
|-----------|-----------|--------------|
| CO₂ | miles not driven (kg × 2.5) | any CO₂ saved |
| CO₂ | phone charges (kg × 120) | 5 kg or more |
| CO₂ | tree-years (kg ÷ 20) | 20 kg or more |
| Water | drinking glasses (L × 6.57) | any water saved |
| Water | laundry loads (L ÷ 75) | 150 L or more |
| Energy | hours of TV (kWh ÷ 0.05) | any energy saved |
| Energy | days of running a fridge (kWh ÷ 1.5) | 5 kWh or more |
| Plastic | years of decomposition avoided (bottles × 450) | any bottle avoided |
| Food waste | miles of methane avoided (kg × 2.4) | any waste avoided |

Above them, **Raw totals** show kg CO₂, litres of water, kWh of energy and plastic avoided.

### 6. Progress chart and streak heatmap (Impact page)

- **Bar chart** of CO₂, water or energy per day. Choose the metric and **last 7 or 30 days**. Hover over a bar to see its exact value.
- **Heatmap** of the last 84 days. Darker squares mean more actions that day.
- The daily history starts being recorded the first time this feature runs on your device. Earlier actions are not back-filled.

### 7. Monthly report (Impact page)

Tap **Create report** to open a clean one-page summary for the current month: actions, CO₂, water and energy for **this month vs all time**, plus current streak, best streak and badges unlocked. Your browser's print dialog opens. Choose **Save as PDF** (or print it).

### 8. Resource hub

- **24 short tips** across four categories (6 each): ⚡ Energy Efficiency, ♻️ Waste & Recycling, 🥕 Seasonal Eating, 💧 Water Conservation.
- Filter buttons: **All** plus each category.
- Tap (or press Enter on) any card to read it in a pop-up. Press **Esc** or tap outside to close.

### 9. Profile and settings

- **Header:** avatar initial, name, join date, current level badge, and an **Edit name** button.
- **Overview tab:** a profile table (name, account type, joined, level, current and best streak, actions, growth points, CO₂, water, energy, badges unlocked) and the share card.
- **Preferences tab:** 🔊 sound effects, 🌙 dark mode, ⏰ daily reminders, and reminder time (default 09:00).
- **Data tab:** **Download JSON** (export), **Choose JSON file** (import), and **Reset** (asks for confirmation first).

### 10. Sharing

- **Share / Copy summary:** opens your phone's share sheet. On devices without one, it copies a short text summary to the clipboard. The same option is in the **⋮** menu.
- **Make impact card:** creates a 1080×1080 PNG with your streak, actions and CO₂ saved. On phones it opens the share sheet with the image. Elsewhere it downloads `biophilia-impact.png`.

### 11. Living Biome (Dashboard)

A little illustrated garden that grows with you:

- Up to 6 trees (a new one every 20 growth points) and up to 30 flowers (one per action).
- Animals arrive as you progress: 🦋 at 10 points, 🐦 at 30, 🐇 at 60, 🦌 at 100, 🦉 at 150.
- The sky turns grey and it rains when your weather tip says it is raining.
- A line underneath tells you which visitor is arriving next.

### 12. Custom habits

On the **Profile** page, add your own daily action: a name, an emoji, and optionally kg CO₂, litres of water and kWh saved. It appears on your Dashboard alongside the built-in actions. Deleting a habit removes it from your list, and it leaves the Dashboard after you refresh.

### 13. Weather-smart tips (Dashboard)

Tap **Use my location** to get one tip that fits today's weather: rainy, hot (32 °C or above), chilly (12 °C or below) or pleasant. Weather comes from the free Open-Meteo service. Your coordinates are used only for that one request and are not saved.

### 14. Voice logging 🎤 (Dashboard)

Tap the 🎤 button, then say what you did. Biophilia matches your sentence to an action card and logs it.

Try saying:
- "I walked to work"
- "I air dried my laundry"
- "I switched off the lights"
- "I composted kitchen scraps"
- "I used my water bottle"
- "I washed my clothes in cold water"

How it behaves:
- The button turns 🔴 while it listens.
- If your words could mean two actions, it asks you to say a little more.
- If the action is already logged today, it tells you so.
- If something goes wrong, the message explains why (blocked microphone, no speech heard, no internet, and so on).
- It listens in English (India) by default and switches to Hindi when the app is set to **हिं**. Hindi listening is experimental.

### 15. Nature soundscapes 🎧

Tap the 🎧 button to cycle **Rain → Forest → Ocean → off**. All sounds are generated live in your browser, so there are no audio files to download.

### 16. Hindi and English

Tap **हिं / EN** in the top bar to switch. About 100 interface phrases are translated, and your choice is remembered.

### 17. Dark mode and the ⋮ menu

- Tap 🌙 to switch between light and dark themes. The choice is remembered.
- The **⋮ menu** lists the four pages plus **Switch light / dark**, **Copy impact summary** and **Export my data**.

### 18. Daily reminders ⏰

Turn them on under **Profile → Preferences**. Your browser asks for notification permission. While Biophilia is open in a tab, you get a reminder once a day at your chosen time. See [Known limitations](#-known-limitations) for phone caveats.

### 19. Installable app and offline use

A web manifest, home-screen icons and a service worker make the site installable. Pages you have already visited keep working offline (web fonts fall back to your system fonts). When you are online, the app always fetches the newest version first.

### 20. Project file browser

`files.html` lists every file in the project. Tap a file to read its code (images are shown as pictures). Each page's footer also has a scrollable **Project files** list that links into it.

---

## 🌐 Browser and device support

| Feature | Chrome / Edge (Android + desktop) | Safari (iPhone, iPad, Mac) | Firefox | Brave |
|---------|:--:|:--:|:--:|:--:|
| Core app (log, tree, streaks, charts) | ✅ | ✅ | ✅ | ✅ |
| Install to home screen / desktop | ✅ | ✅ manual (Share menu) | ⚠️ varies | ✅ |
| Voice logging 🎤 | ✅ | ⚠️ browser tab only | ❌ | ❌ |
| Weather tip (location) | ✅ | ✅ | ✅ | ✅ |
| Soundscapes 🎧 | ✅ | ✅ | ✅ | ✅ |
| Reminders ⏰ | ✅ desktop · ⚠️ phone | ⚠️ | ✅ desktop | ✅ desktop |

✅ works  ·  ⚠️ partial or unreliable  ·  ❌ not supported

Not every browser and phone combination has been tested on real hardware. If something fails on your device, see [Troubleshooting](#-troubleshooting).

---

## 🔐 Permissions and privacy

**Your data stays on your device.** Biophilia has no accounts, no database and no tracking or analytics code of its own.

| Permission | When it is asked | What it is for |
|-----------|------------------|----------------|
| 🎤 Microphone | First time you tap 🎤 | Voice logging. In Chrome, the browser sends the audio to Google's speech service to turn it into text. |
| 📍 Location | When you tap **Use my location** | One weather request. Not stored. |
| 🔔 Notifications | When you switch reminders on | Daily reminder |

**Network requests the site makes:** Google Fonts (to load the typefaces), Open-Meteo (only when you ask for a weather tip), and your browser's own speech service (only when you use voice).

### What is saved in your browser

| Key | What it holds |
|-----|---------------|
| `ecosphere_v1` | Main progress: name, streak, totals, growth points, badges, history, settings |
| `bio_freeze` | Streak freezes you currently hold |
| `bio_log`, `bio_snap` | Daily history used by the chart, heatmap and monthly report |
| `bio_custom` | Your custom habits |
| `bio_lang` | Language choice (English or Hindi) |
| `ecosphere_last_reminder` | The last date a reminder was shown |

**Moving to a new device:** **Profile → Data → Download JSON** saves your main progress (`ecosphere_v1`). Chart history, freezes, custom habits and language are not included in that file.

**Reset** removes only the main progress record. The other keys above stay until you clear the site's data in your browser settings.

**Clearing browser data erases your progress.** Export a backup first if you care about your streak.

---

## 🗂️ Project files

```
biophilia/
├── index.html               Dashboard
├── impact.html              Impact page
├── resources.html           Resource hub
├── profile.html             Profile and settings
├── files.html               Project file browser
├── manifest.json            App install settings
├── sw.js                    Service worker (offline support)
├── icon.svg                 Vector app icon
├── icon-192.png             Install icon, 192 px
├── icon-512.png             Install icon, 512 px
├── icon-maskable-512.png    Android adaptive icon
├── apple-touch-icon.png     iPhone home-screen icon
├── build.sh                 Build script (bundle + optional file list)
├── files.txt                Auto-generated file list (optional)
├── README.md                This file
├── css/
│   ├── styles.css           Main design: layout, colors, components, dark theme
│   └── upgrade.css          Styles for the extra features, plus print styles
└── js/
    ├── app.js               Starts each page and runs its logic
    ├── data.js              Actions, tree stages, badges, tips, metric converters
    ├── storage.js           Saves and loads progress (streaks, freezes, totals)
    ├── ui.js                Shared helpers: toast, confetti, tree drawing, dialogs
    ├── features.js          Install, soundscapes, biome, weather, voice, charts
    ├── features2.js         Streak chip, custom habits, report, impact card, Hindi
    ├── files.js             Footer file list and file browser
    └── ecosphere.js         Generated bundle (see below)
```

### What each file does

| File | Details |
|------|---------|
| `index.html`, `impact.html`, `resources.html`, `profile.html` | The four main pages. Each loads the styles, the manifest and `js/app.js` as a module, and has `data-page` on `<body>` so the script knows which page it is on. |
| `files.html` | A viewer for the project's own files, with its own small inline style block. |
| `manifest.json` | Name, colors, start page and icons used when installing the app. |
| `sw.js` | Service worker. Tries the network first and falls back to cached copies when offline. |
| `icon*.png`, `apple-touch-icon.png`, `icon.svg` | Icons for browsers, Android, iPhone and desktop. |
| `css/styles.css` | Design tokens as CSS variables (including `[data-theme="dark"]`), layout, navbar, cards, tree, badges, modal, toasts, responsive rules at 900 px and 700 px. |
| `css/upgrade.css` | Floating buttons, Biome, charts, heatmap, forms, larger text on big screens, reduced-motion support and the print layout for the monthly report. |
| `js/app.js` | Boots the right page (`initDashboard`, `initImpact`, `initResources`, `initProfile`), handles the ⋮ menu, reminders, share and export, and then loads the feature files. |
| `js/data.js` | `DAILY_ACTIONS`, `TREE_STAGES`, `BADGES`, `ARTICLES`, `CATEGORIES`, `getRelatableMetrics()`, `getTreeStage()`, `getProgressToNext()`. Also adds your saved custom habits to the action list. |
| `js/storage.js` | `loadState`, `saveState`, `logAction`, `isResting`, `setName`, `toggleDark`, `resetData`, `exportData`, `getFreezes`, plus the streak and freeze rules. |
| `js/ui.js` | `$`, `$$`, `toast`, `confetti`, `applyTheme`, `renderTree`, `setActiveNav`, `initNav`, `formatDate`, `beep`, `openDialog`. |
| `js/features.js` | Records daily history, install button and service worker, soundscapes, Living Biome, weather tip, voice logging and the Impact charts. |
| `js/features2.js` | Streak-freeze chip, custom habits, monthly report, impact card and the Hindi/English switch (with its translation dictionary). |
| `js/files.js` | Fills the footer "Project files" list on every page and powers `files.html`. Reads `files.txt` if present, otherwise uses its built-in list. |
| `js/ecosphere.js` | A single-script bundle of `data`, `storage`, `ui` and `app` produced by `build.sh`. The pages do **not** load it today and it does not contain the newer feature files, so it can be ignored or regenerated. |
| `build.sh` | Needs Node.js. Rebuilds `js/ecosphere.js` and checks its syntax. Optionally also writes `files.txt`. |
| `files.txt` | One file path per line, so the file browser always shows every file. |

> **A note on names:** Biophilia was originally called EcoSphere, so a few internal names (`ecosphere_v1`, `ecosphere.js`) keep the old name. **Do not rename the `ecosphere_v1` key**, or existing users will lose their saved progress.

---

## 🧩 How it works

- **No framework.** Plain HTML, CSS and JavaScript (ES modules). There is nothing to install and no build step is required to run the site.
- **Loading order:** each page loads `js/app.js` as a module. That file imports `data.js`, `storage.js` and `ui.js`, starts the page, and then loads `features.js`, `features2.js` and `files.js` in the background. If a feature file fails, the core app still works.
- **State:** one JavaScript object saved as JSON in `localStorage`. Pages read it, change it through `storage.js`, and save it back.
- **Dates:** days are counted by their **UTC** date (`YYYY-MM-DD`). That means your "new day" starts at UTC midnight, which is a different local time depending on where you live (for example 5:30 am in India, or the evening before in the Americas). Daily actions reset and streaks roll over at that moment.
- **Streak check:** when you log an action, the gap since your last one decides what happens: same day (no change), 1 day (streak +1, maybe earn a freeze), 2 days (a freeze can bridge the gap), more (reset to 1).
- **Sounds and the garden** are generated in code (Web Audio and SVG), so there are no media files.

---

## 🛠️ Customize it

### Add a new daily action
Open `js/data.js` and add an object to `DAILY_ACTIONS`:

```js
{
  id: 'meatless-snack',            // unique, no spaces
  title: 'Choose a plant-based snack',
  icon: '🥕',
  impact: { co2: 0.5, water: 20, energy: 0, plastic: 0, waste: 0 },
  impactText: '≈ 0.5 kg CO₂ saved',
  category: 'food'
}
```

To let voice logging recognize extra words for it, add a line for its `id` in the `EXTRA` list inside `voice()` in `js/features.js`.

### Add a resource tip
Add an object to `ARTICLES` in `js/data.js` with `id`, `title`, `category` (must match one of the names in `CATEGORIES`), `icon`, `excerpt` and `time`.

### Add or change a badge
Edit `BADGES` in `js/data.js`. Each badge has an `id`, `name`, `icon`, `desc` and a `condition` function. The locked-badge progress bar for new ids is set in `initImpact()` in `js/app.js`.

### Change tree stages
Edit `TREE_STAGES` in `js/data.js`. The tree artwork is styled per stage number (`stage-0` to `stage-4`), so keep five stages unless you also update the tree drawing in `js/ui.js` and `css/styles.css`.

### Change colors and fonts
Edit the CSS variables at the top of `css/styles.css` (`:root` for light, `[data-theme="dark"]` for dark). Fonts are loaded in the `<head>` of each page.

### Add a Hindi translation
Add `'English text': 'हिन्दी पाठ'` to the `HI` dictionary in `js/features2.js`. The text must match the on-screen English exactly.

### Add a new file to the project browser
Run `sh build.sh` (with the optional file-list line) and upload `files.txt`. Or add one line to the `FILES` list in `js/files.js`.

### Rebuild the bundle
```bash
sh build.sh
```
Requires Node.js. Windows users should run it from Git Bash or WSL.

---

## 🚀 Run and deploy

### Run on your own computer

Open a terminal in the project folder, then run **one** of these:

| System | Command |
|--------|---------|
| Mac / Linux | `python3 -m http.server 8080` |
| Windows | `py -m http.server 8080` |
| Any (with Node.js) | `npx serve .` |
| VS Code | Install the **Live Server** extension, right-click `index.html` → **Open with Live Server** |

Then open **http://localhost:8080**. `localhost` counts as secure, so install, voice and location work there too.

### Test on your phone while developing
1. Put your phone and computer on the same Wi-Fi.
2. Start the server as above.
3. Find your computer's local IP address (for example `192.168.1.20`).
4. Open `http://192.168.1.20:8080` on the phone.

Browsers treat plain `http://` addresses like this as **not secure**, so the microphone and install button will not work there. Test those on your deployed `https://` site.

### Deploy for free (all give you HTTPS)

**GitHub Pages**
1. Create a repository and upload all files, keeping the `css` and `js` folders.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
4. After a minute your site is live at `https://YOUR-NAME.github.io/REPO-NAME/`.

**Netlify (fastest):** open **app.netlify.com/drop** and drag the whole project folder onto the page.

**Vercel or Cloudflare Pages:** import the repository and leave the build command and output folder empty (it is a static site).

**After every change:** upload the changed files and refresh the page. If an old version keeps showing, see [Troubleshooting](#-troubleshooting).

---

## 🩺 Troubleshooting

| Problem | What to do |
|---------|-----------|
| Page is blank or buttons do nothing when opened by double-click | Use a local server or the deployed site. Modules do not load from `file://`. |
| 🎤 says the microphone is blocked | Allow the microphone in the site's permissions and make sure the address starts with `https://`. |
| 🎤 says voice is not supported | Use Chrome or Edge. Firefox and Brave do not support it. |
| 🎤 says "I did not hear anything" | Tap 🎤 and start speaking right away, closer to the microphone. |
| 🎤 says it needs internet | Voice sends audio to a speech service, so check your connection. |
| 🎤 hears you but nothing logs | The message shows what it heard. Say a fuller sentence such as "I walked to work", or tap **Log it** by hand. |
| No ⬇️ install prompt | Check you are on `https://`. Open DevTools → **Application → Manifest** and read the listed problem. On iPhone use Share → Add to Home Screen. |
| Home-screen icon is the old one | Remove the shortcut and add it again. |
| Changes do not show after uploading | Hard refresh (Ctrl/Cmd + Shift + R). If it persists: DevTools → **Application → Service Workers → Unregister**, then reload. On a phone, clear the site's data in browser settings. |
| File browser is missing a file | Re-run `sh build.sh` and upload `files.txt`, or add the file to `FILES` in `js/files.js`. |
| Weather tip fails | Allow location access and check your internet connection. |
| Progress disappeared | Browser data was cleared, or you are on a different browser or device. Restore from an exported JSON file. |

---

## ⚠️ Known limitations

- **Reminders** are checked by a timer inside the open page, so they only fire while the site is open. Android Chrome and iOS handle web notifications differently from desktop, so reminders may not appear on phones.
- **Charts and heatmap** start recording from the first day the feature runs. Older actions are not back-filled.
- **Export** covers main progress only (see [Permissions and privacy](#-permissions-and-privacy)).
- **Resource tips** are short summaries. Each pop-up says that full guides may come later.
- **No cloud sync.** Progress lives in one browser on one device.
- **Deleted custom habits** disappear from the Dashboard only after a refresh.
- **Impact numbers** are simple estimates meant to motivate, not measure.
- **Voice** needs a supported browser, an internet connection and an `https://` page.

---

## 🗺️ Roadmap

Ideas for the future:

- Cloud sync across devices (for example Supabase or Firebase)
- Real push notification reminders that work when the site is closed
- Community totals and real-world tree-planting milestones
- Location-aware action suggestions
- Full-length guides for the Resource hub

---

## 🙏 Credits and license

- **Created by:** Vedansh Prakash Mishra
- **Fonts:** Playfair Display and Plus Jakarta Sans (Google Fonts)
- **Weather data:** [Open-Meteo](https://open-meteo.com/) (free, no key needed)
- **License:** MIT License
Built with 💚 for the planet.
