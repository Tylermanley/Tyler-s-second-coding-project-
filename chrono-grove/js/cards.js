// ============================================================
//  Chrono Grove — battle cards (Cedric's deck) and Anna's boss lore
// ============================================================
// Card fields: cost, dmg (×ATK), hits, pierce, shieldBreak, block (+DEF×blockDef), heal (fraction of max HP),
//              cleanse, cp, draw, burn, weak, vuln (turns on boss), freeze, exhaust (once per battle), rarity

const CARDS = {
  // Starter deck
  slash:    { name: 'Slash',            art: '🗡️', cost: 1, dmg: 1.0 },
  guard:    { name: 'Guard',            art: '🛡️', cost: 1, block: 5 },
  strike:   { name: 'Temporal Strike',  art: '⚡', cost: 2, dmg: 1.8, pierce: true, shieldBreak: true, rarity: 'rare' },
  // Puzzle rewards — Ancient Egypt
  swarm:    { name: 'Scarab Swarm',     art: '🪲', cost: 1, dmg: 0.45, hits: 3 },
  sands:    { name: 'Sands of Time',    art: '⏳', cost: 1, block: 6, draw: 1 },
  javelin:  { name: 'Sunfire Javelin',  art: '☀️', cost: 2, dmg: 1.6, burn: 3 },
  // Classical Greece
  owl:      { name: 'Owl\'s Insight',   art: '🦉', cost: 0, draw: 2 },
  phalanx:  { name: 'Phalanx Wall',     art: '🏛️', cost: 2, block: 10, blockDef: 2 },
  thunder:  { name: 'Zeus\'s Thunderbolt', art: '🌩️', cost: 2, dmg: 2.0, vuln: 2, rarity: 'rare' },
  // Medieval Europe
  knight:   { name: 'Knight\'s Charge', art: '🐴', cost: 2, dmg: 1.4, block: 5 },
  holy:     { name: 'Holy Light',       art: '✨', cost: 2, heal: 0.22, cleanse: true, exhaust: true },
  flask:    { name: 'Dragonfire Flask', art: '🔥', cost: 1, dmg: 0.6, burn: 4 },
  // Feudal Japan
  tea:      { name: 'Tea Ceremony',     art: '🍵', cost: 0, cp: 1, draw: 1 },
  lantern:  { name: 'Lantern Ward',     art: '🏮', cost: 1, block: 4, weak: 2 },
  iai:      { name: 'Iaijutsu',         art: '⚔️', cost: 3, dmg: 3.2, pierce: true, rarity: 'rare' },
  // Renaissance
  gambit:   { name: 'Clockwork Gambit', art: '⚙️', cost: 1, dmg: 0.7, hits: 2, draw: 1 },
  glider:   { name: 'Flying Machine',   art: '🪁', cost: 2, dmg: 1.0, block: 8 },
  master:   { name: 'Masterstroke',     art: '🎨', cost: 3, dmg: 2.2, vuln: 2, weak: 2, rarity: 'rare' },
  // Boss trophies
  ra:       { name: 'Wrath of Ra',      art: '🌞', cost: 3, dmg: 3.0, burn: 3, rarity: 'legendary' },
  fury:     { name: 'Minotaur\'s Fury', art: '🐂', cost: 2, dmg: 1.1, hits: 2, vuln: 1, rarity: 'legendary' },
  bulwark:  { name: 'Dragonscale Bulwark', art: '🐲', cost: 2, block: 12, blockDef: 2, rarity: 'legendary' },
  oniwrath: { name: 'Oni\'s Wrath',     art: '👺', cost: 1, dmg: 1.9, exhaust: true, rarity: 'legendary' },
  overclock:{ name: 'Overclock',        art: '🔧', cost: 0, cp: 2, exhaust: true, rarity: 'legendary' },
  eternity: { name: 'Eternal Moment',   art: '⌛', cost: 0, freeze: true, exhaust: true, rarity: 'legendary' },
  glacial:  { name: 'Glacial Lance',    art: '🧊', cost: 2, dmg: 1.5, weak: 2, vuln: 1, rarity: 'legendary' },
  krakenc:  { name: 'Kraken\'s Embrace', art: '🐙', cost: 3, dmg: 2.4, block: 10, rarity: 'legendary' },
  // Cedric's wares
  grog:     { name: 'Captain\'s Grog',  art: '🍺', cost: 1, heal: 0.1, draw: 1 },
  chart:    { name: 'Navigator\'s Chart', art: '🗺️', cost: 0, draw: 2, exhaust: true },
  cannon:   { name: 'Cannon Volley',    art: '💣', cost: 2, dmg: 0.5, hits: 4, shieldBreak: true },
  rewind:   { name: 'Rewind',           art: '⏪', cost: 2, heal: 0.3, cleanse: true, exhaust: true, rarity: 'rare' },
  freeze:   { name: 'Freeze Time',      art: '❄️', cost: 3, freeze: true, exhaust: true, rarity: 'rare' },
  anchor:   { name: 'Anchor Drop',      art: '⚓', cost: 2, dmg: 1.3, block: 6, rarity: 'rare' },
  // Romance
  promise:  { name: 'Lovers\' Promise', art: '💞', cost: 1, heal: 0.15, block: 8, rarity: 'legendary' },
};

const STARTER_DECK = { slash: 4, guard: 4, strike: 1 };
const DECK_MIN = 8, DECK_MAX = 20;

const PUZZLE_CARDS = {
  'egypt-1': 'swarm', 'egypt-2': 'sands', 'egypt-3': 'javelin',
  'greece-1': 'owl', 'greece-2': 'phalanx', 'greece-3': 'thunder',
  'medieval-1': 'knight', 'medieval-2': 'holy', 'medieval-3': 'flask',
  'japan-1': 'tea', 'japan-2': 'lantern', 'japan-3': 'iai',
  'renaissance-1': 'gambit', 'renaissance-2': 'glider', 'renaissance-3': 'master',
};
const BOSS_CARDS = { egypt: 'ra', greece: 'fury', medieval: 'bulwark', japan: 'oniwrath', renaissance: 'overclock', end: 'eternity', winters: 'glacial', jane: 'krakenc' };

// Cedric's shop: price and the hearts needed before he'll sell it
const SHOP_CARDS = [
  { id: 'slash', price: 35, hearts: 0 },
  { id: 'guard', price: 35, hearts: 0 },
  { id: 'grog', price: 80, hearts: 0 },
  { id: 'chart', price: 90, hearts: 1 },
  { id: 'cannon', price: 120, hearts: 2 },
  { id: 'rewind', price: 150, hearts: 3 },
  { id: 'freeze', price: 200, hearts: 4 },
  { id: 'anchor', price: 170, hearts: 5 },
];

// Anna's research notes on each guardian
const BOSS_HINTS = {
  egypt: [
    'The Sphinx always poses its riddle the turn before Sunbeam. When you see "Riddle of Ages", attack freely, then stack Guard cards the next turn.',
    'Below half health it casts Sandstorm, which weakens your attacks. Spend weakened turns blocking rather than striking.',
    'Sunfire Javelin\'s burn keeps ticking while you defend. It\'s perfect for this fight.',
  ],
  greece: [
    'The Minotaur lowers its horns before Labyrinth Charge, which is triple damage! Phalanx Wall was practically made for that moment.',
    'At half health it flies into a Blood Rage that boosts its attack for good. Save your strongest cards to finish it quickly after that.',
    'Zeus\'s Thunderbolt exposes it so it takes 50% more damage. Play it before your big hits.',
  ],
  medieval: [
    'The Iron Dragon\'s fire breath burns you for several turns. Holy Light, Rewind or my Remedy will cleanse it.',
    'In its second phase it hardens its scales into a shield. Temporal Strike and Cannon Volley break shields twice as fast.',
    'Watch for "Deep Inhale". Inferno follows immediately, so block heavily!',
  ],
  japan: [
    'Never attack the Oni while it holds Counter Stance! Attack cards get countered for heavy damage. Block, heal, or play skills instead.',
    'Its War Cry raises its attack permanently. Lantern Ward weakens it to blunt the extra power.',
    'In phase two it focuses before Executioner\'s Arc. That is the moment for Freeze Time.',
  ],
  renaissance: [
    'The Colossus deploys barriers often. Shield-breaking cards are essential, so bring Temporal Strike and Cannon Volley.',
    'It can repair itself. Burst damage with Exposed and burn will out-pace its repairs.',
    'After "Focus Lens" comes Solar Lance, its strongest attack. Freeze it or stack every Block card you have.',
  ],
  end: [
    'The Devourer uses every trick we\'ve seen: shields, counters, charges, burns, healing. Build a balanced deck.',
    'Its Paradox Guard counters attacks just like the Oni. Patience wins this fight.',
    'Eternal Moment and Freeze Time can erase an Epoch Collapse entirely. Please… come back to me safely.',
  ],
  winters: [
    'Peter\'s Pickpocket steals a card from your deck for the rest of the fight. Play your strongest cards early, before he can swipe them!',
    'His Smug Riposte counters attack cards, just like the Oni. Block, heal or play skills while he poses.',
    'When he starts to Lecture, Glacial Lance comes next. Freeze him mid-sentence. He would absolutely hate that.',
  ],
  jane: [
    'Lady Jane\'s Plunder steals ALL of your Block and turns it into her own shield! When she\'s about to plunder, attack instead of blocking.',
    'She calls the Kraken before her strongest attack. That\'s the turn to stack Block or play Freeze Time.',
    'She swigs grog to heal and raises the Black Flag at half health. Burn and Expose will help you out-pace her. Cedric says she hates being out-smarted.',
  ],
};

// ---------- helpers ----------
function cardType(c) {
  if (c.dmg) return 'attack';
  if (c.block && !c.heal) return 'defend';
  return 'skill';
}

function blockAmount(c, def) { return c.block + Math.round(def * (c.blockDef || 1)); }

function cardDesc(c, st) {
  const parts = [];
  if (c.dmg) {
    const n = Math.max(1, Math.round(st.atk * c.dmg));
    parts.push(`Deal <b>${n}</b>${c.hits > 1 ? `×${c.hits}` : ''} damage${c.pierce ? ', ignores DEF' : ''}.`);
  }
  if (c.shieldBreak) parts.push('2× vs shields.');
  if (c.block) parts.push(`Gain <b>${blockAmount(c, st.def)}</b> Block.`);
  if (c.heal) parts.push(`Heal <b>${Math.round(c.heal * 100)}%</b> HP.`);
  if (c.cleanse) parts.push('Cleanse ailments.');
  if (c.cp) parts.push(`Gain <b>${c.cp}</b> CP.`);
  if (c.draw) parts.push(`Draw <b>${c.draw}</b>.`);
  if (c.burn) parts.push(`Burn <b>${c.burn}</b> turns.`);
  if (c.weak) parts.push(`Weaken <b>${c.weak}</b>.`);
  if (c.vuln) parts.push(`Expose <b>${c.vuln}</b>.`);
  if (c.freeze) parts.push('Boss loses its next action.');
  if (c.exhaust) parts.push('<i>Once per battle.</i>');
  return parts.join(' ');
}

// ---------- Lady Alice's Masterclass upgrades ----------
function upgradeLevel(id) { return (S && S.upgrades && S.upgrades[id]) || 0; }
function canUpgrade(id) { const c = CARDS[id]; return !!(c.dmg || c.block || c.heal); }
function effCard(id) {
  const base = CARDS[id];
  const lv = upgradeLevel(id);
  if (!lv) return base;
  const m = 1 + 0.25 * lv;
  const c = Object.assign({}, base, { name: base.name + '+'.repeat(lv) });
  if (c.dmg) c.dmg = base.dmg * m;
  if (c.block) c.block = Math.round(base.block * m);
  if (c.heal) c.heal = base.heal * m;
  return c;
}

function cardHTML(id, opts = {}) {
  const c = effCard(id);
  const st = opts.st || stats();
  const type = cardType(c);
  const attrs = opts.k !== undefined ? `data-k="${opts.k}"` : `data-card="${id}"`;
  const tag = opts.button ? 'button' : 'div';
  return `<${tag} class="card ${type} ${c.rarity || 'common'} ${upgradeLevel(id) ? 'upgraded' : ''} ${opts.cls || ''}" ${attrs} ${opts.disabled ? 'disabled' : ''} ${opts.style ? `style="${opts.style}"` : ''}>
    <span class="card-cost">${c.cost}</span>
    ${opts.count !== undefined ? `<span class="card-count">×${opts.count}</span>` : ''}
    <span class="card-art">${c.art}</span>
    <span class="card-name">${c.name}</span>
    <span class="card-desc">${cardDesc(c, st)}</span>
  </${tag}>`;
}
