// ============================================================
//  Chrono Grove — game state, saving and derived stats
// ============================================================

const SAVE_KEY = 'chronoGrove.save.v1';
const PLOT_W = 8, PLOT_H = 6;
let S = null;

function newState() {
  const plot = [];
  for (let i = 0; i < PLOT_W * PLOT_H; i++) plot.push({ t: 'grass' });
  const starter = [19, 20, 27, 28];
  let placed = 0;
  while (placed < 14) {
    const k = Math.floor(Math.random() * plot.length);
    if (starter.includes(k) || plot[k].t !== 'grass') continue;
    plot[k] = { t: 'rock', kind: Math.random() < 0.55 ? '🪨' : '🪵' };
    placed++;
  }
  starter.forEach(k => { plot[k] = { t: 'soil', wet: false, crop: null }; });
  return {
    version: 1,
    day: 1,
    weather: 'sunny',
    coins: 60,
    energy: 20,
    seeds: { wheat: 6, carrot: 2 },
    produce: {},
    items: { potion: 2, hipotion: 0, tonic: 0 },
    artifacts: [],            // owned artifact ids
    hero: { level: 1, xp: 0, forgeAtk: 0, forgeDef: 0 },
    puzzles: {},              // puzzleId -> times cleared
    bosses: {},               // eraId -> true
    plot,
    introSeen: false,
    won: false,
  };
}

function saveGame() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.version === 1 && Array.isArray(data.plot)) return Object.assign(newState(), data);
    }
  } catch (e) { /* ignore corrupt save */ }
  return newState();
}

function resetGame() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
  S = newState();
}

// ---------- derived values ----------
function placedArtifacts() {
  return S.plot.filter(t => t.t === 'artifact').map(t => t.id);
}

function unplacedArtifacts() {
  const placed = new Set(placedArtifacts());
  return S.artifacts.filter(id => !placed.has(id));
}

function bonuses() {
  const b = { atk: 0, def: 0, hp: 0, energy: 0, gold: 0, sprinkler: 0 };
  placedArtifacts().forEach(id => {
    const a = ARTIFACTS[id];
    if (!a) return;
    for (const k in a.bonus) b[k] += a.bonus[k];
  });
  return b;
}

function stats() {
  const b = bonuses();
  const L = S.hero.level - 1;
  return {
    maxHp: 50 + L * 12 + b.hp,
    atk: 9 + L * 2 + S.hero.forgeAtk * 2 + b.atk,
    def: 2 + L + S.hero.forgeDef + b.def,
    maxEnergy: 20 + b.energy,
    gold: b.gold,
  };
}

function xpToNext() { return 50 * S.hero.level; }

function grantXp(n) {
  S.hero.xp += n;
  let gained = 0;
  while (S.hero.xp >= xpToNext()) {
    S.hero.xp -= xpToNext();
    S.hero.level++;
    gained++;
  }
  return gained;
}

function grantArtifact(id) {
  if (!S.artifacts.includes(id)) { S.artifacts.push(id); return true; }
  return false;
}

function eraIndex(eraId) { return ERAS.findIndex(e => e.id === eraId); }

function eraUnlocked(era) {
  const i = eraIndex(era.id);
  if (i === 0) return true;
  if (era.final) return ERAS.filter(e => !e.final).every(e => S.bosses[e.id]);
  return !!S.bosses[ERAS[i - 1].id];
}

function bossUnlocked(era) {
  return era.puzzles.every(p => S.puzzles[p.id]);
}

function cropUnlocked(id) {
  const c = CROPS[id];
  return !c.unlock || !!S.bosses[c.unlock];
}

function spendEnergy(n) {
  if (S.energy < n) return false;
  S.energy -= n;
  return true;
}
