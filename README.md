# Biophilia – Eco Habit Tracker & Micro-Pledge Platform

A lightweight, client-side website where users commit to and track small, high-impact daily actions that help the environment.

## Features

- **Daily Action Generator** – 1–3 rotating micro-actions each day (skip meat, unplug devices, short shower, etc.)
- **Interactive Tree Ecosystem** – Grows through 5 stages as you log actions; rests (doesn’t die) if you miss a day
- **Relatable Impact Metrics** – Converts kg CO₂ / liters / kWh into everyday equivalents (miles driven, phone charges, laundry loads…)
- **Streak & Badges** – Gamified progress with 10 unlockable achievements
- **Resource Hub** – Filterable bite-sized articles on energy, water, waste, and seasonal eating
- **Profile & Settings** – Name, dark mode, export data, shareable impact summary
- **Zero-friction onboarding** – Use as guest immediately; save name anytime


Edit the sources in `js/`, then run `sh build.sh` to regenerate `js/ecosphere.js` (the single classic script the pages load, so the site works even when opened by double-click). No other build step. Open `index.html` or deploy the folder as a static site.

## Pages

1. `index.html` – Home / Daily Action Dashboard + live tree
2. `impact.html` – Relatable metrics, raw totals, achievement wall
3. `resources.html` – Filterable tip cards
4. `profile.html` – User card, preferences, share & data tools

## Getting Started

```bash
# Just open in a browser, or serve locally:
npx serve .
# or
python -m http.server 8080
```

Then visit `http://localhost:8080` (or the port shown).

## Project Structure

```
ecosphere/
├── index.html
├── impact.html
├── resources.html
├── profile.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js        # page bootstraps & interactions
│   ├── data.js       # actions, badges, articles, converters
│   ├── storage.js    # localStorage state layer
│   └── ui.js         # DOM helpers, toast, tree SVG
└── README.md
```

## Design Notes

- Earthy palette (sage, terracotta, cream) + dark mode
- Tree never withers on missed days — it enters a “resting” gold-tinted state
- All data stays in the browser; export JSON anytime
- Fully responsive; mobile nav hamburger included

## Future Extensions(self note)

- Connect Supabase / Firebase for multi-device sync & community totals
- PWA + push reminders
- Real-world collective milestones (tree-planting partnerships)
- Location-aware action suggestions

---

Built with 💚 for the planet.
