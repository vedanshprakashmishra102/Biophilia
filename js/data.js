/* =====  BIOPHILIA – Static Data & Config ===== */

export const DAILY_ACTIONS = [
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

export const TREE_STAGES = [
  { name: 'Seedling', minPoints: 0, maxPoints: 4 },
  { name: 'Sprout', minPoints: 5, maxPoints: 11 },
  { name: 'Young Tree', minPoints: 12, maxPoints: 24 },
  { name: 'Growing Tree', minPoints: 25, maxPoints: 49 },
  { name: 'Flourishing Tree', minPoints: 50, maxPoints: Infinity }
];

export const BADGES = [
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

export const ARTICLES = [
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
  },
  /* ---------- Water Conservation ---------- */
  { id: 'a9', title: 'Fix household leaks', category: 'Water Conservation', icon: '💧',
    excerpt: 'A single dripping tap can waste hundreds of liters of water each month.', time: '1 min', tags: ['water'] },
  { id: 'a10', title: 'Turn off the tap while brushing', category: 'Water Conservation', icon: '🪥',
    excerpt: 'Keep the water running only when actively rinsing to save around 6 liters per minute.', time: '1 min', tags: ['water'] },
  { id: 'a11', title: 'Reuse kitchen water', category: 'Water Conservation', icon: '🪴',
    excerpt: 'Save the water used to wash fruits and vegetables and use it to water household plants.', time: '1 min', tags: ['water'] },
  { id: 'a12', title: 'Take shorter showers', category: 'Water Conservation', icon: '🚿',
    excerpt: 'Aim for 4 to 5-minute showers, or switch to a water-saving showerhead.', time: '1 min', tags: ['water'] },

  /* ---------- Seasonal & Local Eating ---------- */
  { id: 'a13', title: 'Buy at local farmers\' markets', category: 'Seasonal Eating', icon: '🥕',
    excerpt: 'Produce harvested at peak seasonality requires less artificial greenhouse heating and long-distance transportation.', time: '1 min', tags: ['food'] },
  { id: 'a14', title: 'Preserve seasonal abundance', category: 'Seasonal Eating', icon: '🫙',
    excerpt: 'Freeze, pick, or dry excess fruits and vegetables when they are plentiful to enjoy during off-seasons.', time: '1 min', tags: ['food'] },
  { id: 'a15', title: 'Plan meals around local crops', category: 'Seasonal Eating', icon: '🗓️',
    excerpt: 'Check a seasonal produce guide for your region before grocery shopping to choose food grown nearby.', time: '1 min', tags: ['food'] },
  { id: 'a16', title: 'Store produce properly', category: 'Seasonal Eating', icon: '🥬',
    excerpt: 'Keep veggies like leafy greens crisp in airtight containers to extend their shelf life and prevent food rot.', time: '1 min', tags: ['food'] },

  /* ---------- Energy Saving ---------- */
  { id: 'a17', title: 'Unplug "vampire" loads', category: 'Energy Efficiency', icon: '🔌',
    excerpt: 'Disconnect chargers, microwave clocks, and entertainment devices when not in use to eliminate phantom power consumption.', time: '1 min', tags: ['energy'] },
  { id: 'a18', title: 'Wash clothes in cold water', category: 'Energy Efficiency', icon: '👕',
    excerpt: 'Heating water accounts for about 90% of the energy used by a washing machine.', time: '1 min', tags: ['energy'] },
  { id: 'a19', title: 'Switch to LED bulbs', category: 'Energy Efficiency', icon: '💡',
    excerpt: 'Replace traditional incandescent bulbs with LEDs, which use up to 75% less energy and last much longer.', time: '1 min', tags: ['energy'] },
  { id: 'a20', title: 'Optimize home temperature', category: 'Energy Efficiency', icon: '🌡️',
    excerpt: 'Lower your thermostat by 1–2°C in winter or raise it by 1–2°C in summer to cut HVAC energy demands.', time: '1 min', tags: ['energy'] },

  /* ---------- Waste Management ---------- */
  { id: 'a21', title: 'Follow the "4 Rs"', category: 'Waste & Recycling', icon: '♻️',
    excerpt: 'Prioritize Refuse, Reduce, and Reuse before relying on Recycling.', time: '1 min', tags: ['waste'] },
  { id: 'a22', title: 'Set up a kitchen compost bin', category: 'Waste & Recycling', icon: '🍂',
    excerpt: 'Separate food scraps, coffee grounds, and paper products from general waste to reduce landfill methane emissions.', time: '1 min', tags: ['waste'] },
  { id: 'a23', title: 'Carry a zero-waste kit', category: 'Waste & Recycling', icon: '👜',
    excerpt: 'Keep reusable bags, a stainless steel water bottle, and compact cutlery in your everyday bag.', time: '1 min', tags: ['waste'] },
  { id: 'a24', title: 'Rinse recyclables', category: 'Waste & Recycling', icon: '🧴',
    excerpt: 'Briefly rinse plastic, glass, and metal containers before placing them in recycling bins to avoid contaminating entire loads.', time: '1 min', tags: ['waste'] } 
];
  
export const CATEGORIES = [
  'All',
  'Energy Efficiency',
  'Waste & Recycling',
  'Seasonal Eating',
  'Water Conservation'
];

/* Relatable metric converters */
export function getRelatableMetrics(totals) {
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

export function getTreeStage(points) {
  for (let i = TREE_STAGES.length - 1; i >= 0; i--) {
    if (points >= TREE_STAGES[i].minPoints) return { ...TREE_STAGES[i], index: i };
  }
  return { ...TREE_STAGES[0], index: 0 };
}

export function getProgressToNext(points) {
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
