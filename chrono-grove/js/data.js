// ============================================================
//  Chrono Grove — static game data
// ============================================================

const CROPS = {
  wheat:   { name: 'Time Wheat',      emoji: '🌾', days: 2, cost: 10, sell: 24,  unlock: null },
  carrot:  { name: 'Epoch Carrot',    emoji: '🥕', days: 3, cost: 15, sell: 40,  unlock: null },
  grape:   { name: 'Olympian Grape',  emoji: '🍇', days: 3, cost: 25, sell: 62,  unlock: 'egypt' },
  pumpkin: { name: 'Harvest Pumpkin', emoji: '🎃', days: 4, cost: 40, sell: 105, unlock: 'greece' },
  blossom: { name: 'Sakura Blossom',  emoji: '🌸', days: 4, cost: 55, sell: 140, unlock: 'medieval' },
  melon:   { name: 'Chrono Melon',    emoji: '🍉', days: 6, cost: 80, sell: 240, unlock: 'japan' },
};

// Bonus keys: atk, def, hp, energy (max energy), gold (coins per day), sprinkler (waters 8 neighbours each morning)
const ARTIFACTS = {
  // Ancient Egypt
  scarab:    { name: 'Golden Scarab',        emoji: '🪲', era: 'egypt',       bonus: { def: 1 },              desc: 'A sacred beetle amulet said to ward off misfortune.' },
  papyrus:   { name: 'Papyrus of Thoth',     emoji: '📜', era: 'egypt',       bonus: { energy: 3 },           desc: 'A scroll of hieratic script recording the flooding of the Nile.' },
  canopic:   { name: 'Canopic Urn',          emoji: '⚱️', era: 'egypt',       bonus: { gold: 5 },             desc: 'A carved alabaster vessel from a noble\'s tomb.' },
  sundisk:   { name: 'Sun Disk of Ra',       emoji: '🌞', era: 'egypt',       bonus: { atk: 2, sprinkler: 1 }, desc: 'Relic of the Sphinx. Its warmth coaxes nearby crops to drink the morning dew.', relic: true },
  // Classical Greece
  owl:       { name: 'Owl Drachma',          emoji: '🦉', era: 'greece',      bonus: { gold: 8 },             desc: 'A silver Athenian coin stamped with Athena\'s owl.' },
  helm:      { name: 'Bronze Hoplite Helm',  emoji: '🪖', era: 'greece',      bonus: { def: 2 },              desc: 'Worn by a citizen-soldier in the phalanx.' },
  amphora:   { name: 'Painted Amphora',      emoji: '🏺', era: 'greece',      bonus: { sprinkler: 1 },        desc: 'A black-figure jar that never seems to run dry.' },
  horn:      { name: 'Horn of the Labyrinth', emoji: '📯', era: 'greece',     bonus: { atk: 3, hp: 15 },      desc: 'Relic of the Minotaur. It still echoes with the maze\'s roar.', relic: true },
  // Medieval Europe
  codex:     { name: 'Illuminated Codex',    emoji: '📖', era: 'medieval',    bonus: { energy: 4 },           desc: 'Hand-copied by monks, its margins glitter with gold leaf.' },
  shield:    { name: 'Kite Shield',          emoji: '🛡️', era: 'medieval',    bonus: { def: 3 },              desc: 'A tall Norman shield bearing a faded heraldic lion.' },
  chalice:   { name: 'Royal Chalice',        emoji: '🏆', era: 'medieval',    bonus: { hp: 20 },              desc: 'A jewelled cup from a king\'s coronation feast.' },
  scale:     { name: 'Iron Dragon Scale',    emoji: '🐲', era: 'medieval',    bonus: { atk: 4, def: 2 },      desc: 'Relic of the Iron Dragon. Warm to the touch, harder than steel.', relic: true },
  // Feudal Japan
  tea:       { name: 'Raku Tea Bowl',        emoji: '🍵', era: 'japan',       bonus: { hp: 25 },              desc: 'Hand-shaped for the tea ceremony; beautifully imperfect.' },
  dolls:     { name: 'Hina Dolls',           emoji: '🎎', era: 'japan',       bonus: { gold: 12 },            desc: 'An emperor and empress displayed each spring for good fortune.' },
  katana:    { name: 'Master\'s Katana',     emoji: '🗡️', era: 'japan',       bonus: { atk: 4 },              desc: 'Folded steel with a rippling hamon line.' },
  onimask:   { name: 'Oni Warlord Mask',     emoji: '👺', era: 'japan',       bonus: { atk: 3, hp: 20, sprinkler: 1 }, desc: 'Relic of the Oni Warlord. Rain clouds gather wherever it gazes.', relic: true },
  // Renaissance
  astrolabe: { name: 'Brass Astrolabe',      emoji: '🧭', era: 'renaissance', bonus: { energy: 5 },           desc: 'Used to chart stars and find one\'s way across the sea.' },
  sketch:    { name: 'Inventor\'s Codex',    emoji: '📐', era: 'renaissance', bonus: { sprinkler: 1, def: 1 }, desc: 'Mirror-written sketches of flying machines and water pumps.' },
  portrait:  { name: 'Lost Masterpiece',     emoji: '🖼️', era: 'renaissance', bonus: { gold: 20 },            desc: 'A portrait with an enigmatic smile, thought lost for centuries.' },
  heart:     { name: 'Clockwork Heart',      emoji: '⚙️', era: 'renaissance', bonus: { atk: 5, def: 3, hp: 30 }, desc: 'Relic of the Colossus. It ticks in time with your own pulse.', relic: true },
  // End of Time
  hourglass: { name: 'Hourglass of Eternity', emoji: '⏳', era: 'end',        bonus: { atk: 5, def: 5, hp: 50, energy: 10, gold: 50, sprinkler: 1 }, desc: 'The Devourer\'s core. With it, every moment of history is safe.', relic: true },
};

const SHOP_ITEMS = {
  potion:   { name: 'Herbal Potion', emoji: '🧪', cost: 30, desc: 'Restores 40 HP in battle.' },
  hipotion: { name: 'Royal Elixir',  emoji: '🍶', cost: 85, desc: 'Restores 120 HP in battle.' },
  tonic:    { name: 'Chrono Tonic',  emoji: '🔋', cost: 60, desc: 'Grants +3 Chrono Points in battle.' },
};

// ---------- Boss move kinds ----------
// attack: {mult, hits}   charge: telegraph   buff: {atkUp}   shield: {pct}
// burn: {mult, turns}    weaken: {mult, turns}   stance: counter if attacked   heal: {pct}

const ERAS = [
  {
    id: 'egypt', name: 'Ancient Egypt', year: 'c. 1300 BCE', icon: '🐪',
    color: '#d9a441', bg: 'linear-gradient(160deg,#f7d98b 0%,#e0a84e 55%,#9c6427 100%)',
    blurb: 'Golden sands, towering monuments and tombs sealed for millennia.',
    pool: ['🐪','🌴','☀️','🐍','🪲','🏺','📜','👁️','🐊','🦅','🐈','⚱️','🪶','💎','🌾','🦂','🐫','🌙'],
    puzzles: [
      { id: 'egypt-1', name: 'The Scribe\'s Study',    type: 'hidden',  artifact: 'scarab' },
      { id: 'egypt-2', name: 'Tomb of Echoes',         type: 'memory',  artifact: 'papyrus' },
      { id: 'egypt-3', name: 'Shattered Cartouche',    type: 'slider',  artifact: 'canopic' },
    ],
    boss: {
      name: 'The Sandstone Sphinx', emoji: '🦁', hp: 110, atk: 8, def: 1, xp: 80, coins: 120, relic: 'sundisk',
      intro: 'The Sphinx rises from the dunes. "Answer my riddle... or be buried with the kings."',
      phaseText: 'The Sphinx\'s eyes blaze! A sandstorm begins to howl!',
      moves: {
        claw:      { name: 'Stone Claw',     kind: 'attack', mult: 1.0 },
        riddle:    { name: 'Riddle of Ages', kind: 'charge', text: 'poses an ancient riddle... the air grows scorching!' },
        sunbeam:   { name: 'Sunbeam',        kind: 'attack', mult: 2.5, heavy: true },
        sandstorm: { name: 'Sandstorm',      kind: 'weaken', mult: 0.6, turns: 2 },
      },
      p1: ['claw', 'claw', 'riddle', 'sunbeam'],
      p2: ['sandstorm', 'claw', 'riddle', 'sunbeam', 'claw'],
    },
  },
  {
    id: 'greece', name: 'Classical Greece', year: 'c. 450 BCE', icon: '🏛️',
    color: '#5b8fd9', bg: 'linear-gradient(160deg,#e6f0ff 0%,#9cc0f0 50%,#3d6db5 100%)',
    blurb: 'Marble temples, philosophers in the agora and a maze beneath Crete.',
    pool: ['🏛️','🦉','🍇','🫒','⚱️','🏺','🪖','🛡️','🐂','🌿','🎭','📯','🐬','⚡','🏹','🐚','🪕','🍷'],
    puzzles: [
      { id: 'greece-1', name: 'Agora Marketplace',     type: 'hidden',   artifact: 'owl' },
      { id: 'greece-2', name: 'Oracle\'s Chant',       type: 'sequence', artifact: 'helm' },
      { id: 'greece-3', name: 'Theatre of Masks',      type: 'memory',   artifact: 'amphora' },
    ],
    boss: {
      name: 'The Labyrinth Minotaur', emoji: '🐂', hp: 170, atk: 11, def: 3, xp: 130, coins: 200, relic: 'horn',
      intro: 'Hooves thunder through the dark corridors. The Minotaur has found you.',
      phaseText: 'The Minotaur bellows in fury — it is ENRAGED!',
      moves: {
        gore:    { name: 'Gore',            kind: 'attack', mult: 1.0 },
        stomp:   { name: 'Double Stomp',    kind: 'attack', mult: 0.7, hits: 2 },
        horns:   { name: 'Lower Horns',     kind: 'charge', text: 'paws the ground and lowers its horns...' },
        charge:  { name: 'Labyrinth Charge', kind: 'attack', mult: 3.0, heavy: true },
        enrage:  { name: 'Blood Rage',      kind: 'buff',   atkUp: 0.4 },
      },
      p1: ['gore', 'stomp', 'horns', 'charge'],
      p2: ['enrage', 'gore', 'stomp', 'horns', 'charge'],
    },
  },
  {
    id: 'medieval', name: 'Medieval Europe', year: 'c. 1190 CE', icon: '🏰',
    color: '#7d5ba6', bg: 'linear-gradient(160deg,#d9cbe9 0%,#8f73b5 50%,#3e2c5c 100%)',
    blurb: 'Stone castles, candlelit scriptoriums and a dragon hoarding a kingdom\'s gold.',
    pool: ['🏰','🛡️','⚔️','🐉','👑','🏆','📖','🕯️','🗝️','🐴','🍺','🧙','🦄','🪓','🍗','🎻','🔔','📜'],
    puzzles: [
      { id: 'medieval-1', name: 'Broken Stained Glass', type: 'slider',   artifact: 'codex' },
      { id: 'medieval-2', name: 'The Great Hall',       type: 'hidden',   artifact: 'shield' },
      { id: 'medieval-3', name: 'Bells of the Abbey',   type: 'sequence', artifact: 'chalice' },
    ],
    boss: {
      name: 'The Iron Dragon', emoji: '🐉', hp: 240, atk: 13, def: 4, xp: 190, coins: 300, relic: 'scale',
      intro: 'Smoke pours from the mountain keep. The Iron Dragon unfurls its wings.',
      phaseText: 'The Dragon\'s scales glow white-hot!',
      moves: {
        bite:    { name: 'Iron Bite',       kind: 'attack', mult: 1.1 },
        breath:  { name: 'Fire Breath',     kind: 'burn',   mult: 0.7, turns: 3 },
        tail:    { name: 'Tail Sweep',      kind: 'attack', mult: 0.6, hits: 2 },
        inhale:  { name: 'Deep Inhale',     kind: 'charge', text: 'draws in a vast breath — embers swirl in its throat!' },
        inferno: { name: 'Inferno',         kind: 'burn',   mult: 2.4, turns: 3, heavy: true },
        harden:  { name: 'Scale Harden',    kind: 'shield', pct: 0.15 },
      },
      p1: ['bite', 'breath', 'tail', 'bite'],
      p2: ['harden', 'inhale', 'inferno', 'bite', 'tail'],
    },
  },
  {
    id: 'japan', name: 'Feudal Japan', year: 'c. 1600 CE', icon: '⛩️',
    color: '#d9455f', bg: 'linear-gradient(160deg,#ffe3ea 0%,#f08aa0 50%,#8c1f37 100%)',
    blurb: 'Cherry blossoms, quiet tea houses and an Oni warlord besieging the castle.',
    pool: ['⛩️','🗡️','🍵','🎎','🏯','🌸','🎐','🐉','🍙','🎏','🦊','🪷','🎋','🥢','🏮','🐟','🗻','🎴'],
    puzzles: [
      { id: 'japan-1', name: 'Koi Pond Pairs',         type: 'memory', artifact: 'tea' },
      { id: 'japan-2', name: 'Lantern Festival',       type: 'hidden', artifact: 'dolls' },
      { id: 'japan-3', name: 'Folding Screen',         type: 'slider', artifact: 'katana' },
    ],
    boss: {
      name: 'The Oni Warlord', emoji: '👹', hp: 300, atk: 15, def: 5, xp: 260, coins: 420, relic: 'onimask',
      intro: 'A horned giant in lacquered armour draws an enormous blade. "Strike me, if you dare."',
      phaseText: 'The Oni\'s aura turns crimson. Its stance grows deadlier!',
      moves: {
        slash:   { name: 'Cleave',          kind: 'attack', mult: 1.0 },
        stance:  { name: 'Counter Stance',  kind: 'stance' },
        warcry:  { name: 'War Cry',         kind: 'buff',   atkUp: 0.25 },
        double:  { name: 'Twin Cut',        kind: 'attack', mult: 0.8, hits: 2 },
        focus:   { name: 'Blade Focus',     kind: 'charge', text: 'raises its blade high, perfectly still...' },
        execute: { name: 'Executioner\'s Arc', kind: 'attack', mult: 2.8, heavy: true },
      },
      p1: ['slash', 'stance', 'slash', 'warcry'],
      p2: ['stance', 'double', 'focus', 'execute', 'stance', 'slash'],
    },
  },
  {
    id: 'renaissance', name: 'Renaissance Italy', year: 'c. 1505 CE', icon: '🎨',
    color: '#3f8f6b', bg: 'linear-gradient(160deg,#e3f5ea 0%,#8fcfac 50%,#1f5c42 100%)',
    blurb: 'Workshops of genius, star charts and a clockwork giant gone haywire.',
    pool: ['🎨','🖼️','🧭','📐','⚙️','🔭','🪶','📚','🎻','🕰️','🗺️','⛵','🍷','🧪','💡','🪞','🎭','⚖️'],
    puzzles: [
      { id: 'renaissance-1', name: 'The Inventor\'s Lock', type: 'sequence', artifact: 'astrolabe' },
      { id: 'renaissance-2', name: 'Cluttered Workshop',  type: 'hidden',   artifact: 'sketch' },
      { id: 'renaissance-3', name: 'Gallery of Pairs',    type: 'memory',   artifact: 'portrait' },
    ],
    boss: {
      name: 'The Clockwork Colossus', emoji: '🤖', hp: 380, atk: 17, def: 7, xp: 340, coins: 560, relic: 'heart',
      intro: 'Gears grind. Steam hisses. A towering automaton turns its lens toward you.',
      phaseText: 'WARNING: OVERCLOCK PROTOCOL ENGAGED. The Colossus glows red!',
      moves: {
        punch:   { name: 'Gear Punch',      kind: 'attack', mult: 1.0 },
        barrier: { name: 'Deploy Barrier',  kind: 'shield', pct: 0.16 },
        steam:   { name: 'Steam Vent',      kind: 'burn',   mult: 0.6, turns: 2 },
        overclock: { name: 'Overclock',     kind: 'buff',   atkUp: 0.3 },
        lens:    { name: 'Focus Lens',      kind: 'charge', text: 'focuses its great lens — a beam of light intensifies!' },
        laser:   { name: 'Solar Lance',     kind: 'attack', mult: 2.8, heavy: true },
        repair:  { name: 'Repair Protocol', kind: 'heal',   pct: 0.08 },
      },
      p1: ['punch', 'barrier', 'steam', 'punch'],
      p2: ['overclock', 'lens', 'laser', 'repair', 'barrier', 'punch'],
    },
  },
  {
    id: 'end', name: 'The End of Time', year: '∞', icon: '🌀', final: true,
    color: '#6a4bc4', bg: 'linear-gradient(160deg,#2b1e4f 0%,#4b2f8a 50%,#0d0a1f 100%)',
    blurb: 'Where all eras unravel. Something ancient is devouring history itself.',
    pool: ['⏳','⌛','🌀','🕰️','⭐','🌙','☄️','🔮','💫','🪐','⚙️','🌌'],
    puzzles: [],
    boss: {
      name: 'The Time Devourer', emoji: '🌀', hp: 600, atk: 24, def: 9, xp: 600, coins: 1500, relic: 'hourglass',
      intro: 'A vortex with a thousand eyes opens. "Every moment you saved... I will consume."',
      phaseText: 'The Devourer splits time itself! Its attacks echo across the ages!',
      moves: {
        rend:    { name: 'Temporal Rend',   kind: 'attack', mult: 1.0 },
        stance:  { name: 'Paradox Guard',   kind: 'stance' },
        drain:   { name: 'Age Drain',       kind: 'weaken', mult: 0.8, turns: 2 },
        barrier: { name: 'Event Horizon',   kind: 'shield', pct: 0.1 },
        gather:  { name: 'Gather Eons',     kind: 'charge', text: 'pulls centuries into its core...' },
        collapse:{ name: 'Epoch Collapse',  kind: 'attack', mult: 2.6, heavy: true },
        echo:    { name: 'Echo Strike',     kind: 'attack', mult: 0.6, hits: 3 },
        flare:   { name: 'Solar Flare',     kind: 'burn',   mult: 0.8, turns: 3 },
        feast:   { name: 'Feast on Seconds', kind: 'heal',  pct: 0.06 },
      },
      p1: ['rend', 'drain', 'gather', 'collapse', 'barrier', 'flare'],
      p2: ['stance', 'echo', 'feast', 'gather', 'collapse', 'stance', 'flare', 'barrier'],
    },
  },
];

const ERA_BY_ID = Object.fromEntries(ERAS.map(e => [e.id, e]));

const DECOYS = ['🍂','🪨','🪵','🍃','🔑','🪙','🧱','🦴','🍄','🌵','🧵','🪺','🥀','🌰','🧶','🕸️'];

const PUZZLE_INFO = {
  hidden:   { title: 'Hidden Relics',  icon: '🔍', rules: 'Find every object shown in the list before time runs out. Wrong clicks cost 3 seconds.' },
  memory:   { title: 'Memory Pairs',   icon: '🃏', rules: 'Flip cards two at a time to match every pair before time runs out.' },
  slider:   { title: 'Restore the Relic', icon: '🧩', rules: 'Slide the tiles into place to reassemble the artifact. Tiles next to the gap can move.' },
  sequence: { title: 'Rune Lock',      icon: '🔮', rules: 'Watch the runes light up, then repeat the sequence. You have 3 chances.' },
};
