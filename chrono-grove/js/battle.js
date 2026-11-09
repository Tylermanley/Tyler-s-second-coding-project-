// ============================================================
//  Chrono Grove — turn-based boss battles
// ============================================================

const BOSS_ENERGY = 5;
const MAX_CP = 5;
let B = null;

const SKILLS = {
  strike: { name: 'Temporal Strike', icon: '⚡', cp: 2, desc: '1.8× damage, ignores defence, shatters shields (2× vs shields).' },
  rewind: { name: 'Rewind',          icon: '⏪', cp: 3, desc: 'Heal 35% max HP and cleanse burn & weakness.' },
  freeze: { name: 'Freeze Time',     icon: '❄️', cp: 4, desc: 'The boss loses its next action entirely.' },
};

function openBossIntro(eraId) {
  const era = ERA_BY_ID[eraId];
  const boss = era.boss;
  const st = stats();
  const relic = ARTIFACTS[boss.relic];
  const beaten = S.bosses[era.id];
  openStage(`
    <div class="stage-card intro" style="--era:${era.color}">
      <div class="intro-icon boss-float">${boss.emoji}</div>
      <h2>${boss.name}</h2>
      <p class="muted">${era.name} · ${era.year}</p>
      <p><i>${boss.intro}</i></p>
      <div class="vs-row">
        <div><b>You</b><br>❤️ ${st.maxHp} · ⚔️ ${st.atk} · 🛡️ ${st.def}</div>
        <div class="vs">VS</div>
        <div><b>Boss</b><br>❤️ ${boss.hp} · ⚔️ ${boss.atk} · 🛡️ ${boss.def}</div>
      </div>
      <p class="reward-line">${beaten ? `Rematch reward: 🪙 ${Math.round(boss.coins / 3)} · ✨ ${Math.round(boss.xp / 3)} XP` : `Reward: <b>${relic.emoji} ${relic.name}</b> · 🪙 ${boss.coins} · ✨ ${boss.xp} XP`}</p>
      <p class="muted">Costs ⚡ ${BOSS_ENERGY} energy (you have ${S.energy}). Supplies: 🧪 ${S.items.potion} · 🍶 ${S.items.hipotion} · 🔋 ${S.items.tonic}</p>
      <div class="btn-row">
        <button class="btn ghost" onclick="closeStage()">Not yet</button>
        <button class="btn danger" id="fightBtn" ${S.energy < BOSS_ENERGY ? 'disabled' : ''}>⚔️ Fight!</button>
      </div>
      ${S.energy < BOSS_ENERGY ? '<p class="warn">Not enough energy — end the day on your homestead to rest.</p>' : ''}
    </div>`, era.bg);
  const btn = document.getElementById('fightBtn');
  if (btn) btn.onclick = () => { if (spendEnergy(BOSS_ENERGY)) { saveGame(); renderHeader(); startBattle(eraId); } };
}

function startBattle(eraId) {
  const era = ERA_BY_ID[eraId];
  const st = stats();
  B = {
    era, boss: era.boss,
    hp: era.boss.hp, maxHp: era.boss.hp,
    atkMod: 1, shield: 0, frozen: false, phase: 1, idx: 0, intent: null,
    hero: { hp: st.maxHp, maxHp: st.maxHp, atk: st.atk, def: st.def, cp: 1, defending: false, burn: 0, burnDmg: 0, weak: 0 },
    log: [], busy: false, turn: 1, over: false, menu: null,
  };
  B.intent = nextIntent();
  addLog(`⚔️ ${B.boss.name} appears!`, 'sys');
  renderBattle();
}

function nextIntent() {
  const pat = B.phase === 1 ? B.boss.p1 : B.boss.p2;
  const id = pat[B.idx % pat.length];
  B.idx++;
  return Object.assign({ id }, B.boss.moves[id]);
}

function addLog(msg, cls = '') {
  B.log.push({ msg, cls });
  if (B.log.length > 40) B.log.shift();
}

function intentText(m) {
  switch (m.kind) {
    case 'attack': return `${m.heavy ? '⚠️ ' : '🗡️ '}${m.name}${m.hits > 1 ? ` (${m.hits} hits)` : ''}${m.heavy ? ' — HEAVY! Defend or Freeze!' : ''}`;
    case 'charge': return `⏳ ${m.name} — charging a big attack!`;
    case 'buff':   return `💢 ${m.name} — powering up`;
    case 'shield': return `🔰 ${m.name} — raising a shield`;
    case 'burn':   return `🔥 ${m.name} — attack + burn${m.heavy ? ' — HEAVY!' : ''}`;
    case 'weaken': return `🌀 ${m.name} — attack + weaken`;
    case 'stance': return `🥋 ${m.name} — attacks will be COUNTERED!`;
    case 'heal':   return `💚 ${m.name} — repairing itself`;
  }
  return m.name;
}

// ---------- damage helpers ----------
function heroDamage(mult, pierce) {
  const h = B.hero;
  let dmg = h.atk * mult * rand(0.9, 1.1);
  if (h.weak > 0) dmg *= 0.7;
  const crit = Math.random() < 0.12;
  if (crit) dmg *= 1.6;
  if (!pierce) dmg -= B.boss.def / 2;
  return { dmg: Math.max(1, Math.round(dmg)), crit };
}

function hitBoss(dmg, shieldMult = 1) {
  let absorbed = 0;
  if (B.shield > 0) {
    const eff = dmg * shieldMult;
    if (eff <= B.shield) { B.shield -= eff; absorbed = dmg; dmg = 0; }
    else { const left = (eff - B.shield) / shieldMult; absorbed = dmg - left; B.shield = 0; dmg = Math.round(left); }
    B.shield = Math.round(B.shield);
  }
  B.hp = Math.max(0, B.hp - dmg);
  floatNum('bossBox', dmg > 0 ? `-${dmg}` : 'Blocked', dmg > 0 ? 'dmg' : 'block');
  shake('bossBox');
  return { dealt: dmg, absorbed: Math.round(absorbed) };
}

function bossDamage(mult) {
  const h = B.hero;
  let dmg = B.boss.atk * B.atkMod * mult * rand(0.9, 1.1) - h.def / 2;
  dmg = Math.max(1, dmg);
  if (h.defending) dmg *= 0.4;
  return Math.max(1, Math.round(dmg));
}

function hitHero(dmg) {
  B.hero.hp = Math.max(0, B.hero.hp - dmg);
  floatNum('heroBox', `-${dmg}`, 'dmg');
  shake('heroBox');
}

function healHero(n) {
  const h = B.hero;
  const amt = Math.min(n, h.maxHp - h.hp);
  h.hp += amt;
  floatNum('heroBox', `+${amt}`, 'heal');
  return amt;
}

// ---------- player actions ----------
function battleAction(kind, arg) {
  if (!B || B.busy || B.over) return;
  const h = B.hero;
  const stance = B.intent.kind === 'stance';
  B.menu = null;

  if (kind === 'skill') {
    const sk = SKILLS[arg];
    if (h.cp < sk.cp) return;
    h.cp -= sk.cp;
  }
  if (kind === 'item') {
    if (!S.items[arg]) return;
    S.items[arg]--;
    saveGame();
  }

  B.busy = true;
  h.defending = false;

  const attackLike = kind === 'attack' || (kind === 'skill' && arg === 'strike');
  if (attackLike && stance) {
    const { dmg } = heroDamage(kind === 'attack' ? 1 : 1.8, kind !== 'attack');
    const half = Math.max(1, Math.round(dmg / 2));
    const r = hitBoss(half, kind === 'attack' ? 1 : 2);
    addLog(`You strike into the ${B.intent.name}... only ${r.dealt} damage gets through.`, 'you');
    const counter = Math.max(1, Math.round(B.boss.atk * B.atkMod * 1.5 * rand(0.9, 1.1) - h.def / 2));
    renderBattle();
    setTimeout(() => {
      hitHero(counter);
      addLog(`💥 ${B.boss.name} COUNTERS for ${counter} damage!`, 'boss');
      B.intent = { id: 'spent', name: 'Recovering', kind: 'none' };
      afterPlayer();
    }, 450);
    return;
  }

  if (kind === 'attack') {
    const { dmg, crit } = heroDamage(1, false);
    const r = hitBoss(dmg);
    addLog(`${crit ? '💥 Critical! ' : ''}You attack for ${r.dealt} damage${r.absorbed ? ` (${r.absorbed} absorbed by shield)` : ''}.`, 'you');
  } else if (kind === 'defend') {
    h.defending = true;
    h.cp = Math.min(MAX_CP, h.cp + 1);
    addLog('🛡️ You brace yourself (+1 CP, −60% damage this turn).', 'you');
  } else if (kind === 'skill') {
    if (arg === 'strike') {
      const { dmg, crit } = heroDamage(1.8, true);
      const r = hitBoss(dmg, 2);
      addLog(`⚡ ${crit ? 'Critical ' : ''}Temporal Strike deals ${r.dealt} damage${r.absorbed ? ` and shatters ${r.absorbed * 2} shield` : ''}!`, 'you');
    } else if (arg === 'rewind') {
      const amt = healHero(Math.round(h.maxHp * 0.35));
      h.burn = 0; h.weak = 0;
      addLog(`⏪ You rewind your wounds, healing ${amt} HP and cleansing ailments.`, 'you');
    } else if (arg === 'freeze') {
      B.frozen = true;
      addLog(`❄️ Time freezes around ${B.boss.name}!`, 'you');
    }
  } else if (kind === 'item') {
    if (arg === 'potion') addLog(`🧪 Potion restores ${healHero(40)} HP.`, 'you');
    if (arg === 'hipotion') addLog(`🍶 Royal Elixir restores ${healHero(120)} HP.`, 'you');
    if (arg === 'tonic') { h.cp = Math.min(MAX_CP, h.cp + 3); addLog('🔋 Chrono Tonic surges through you (+3 CP).', 'you'); }
  }
  renderBattle();
  setTimeout(afterPlayer, 500);
}

function afterPlayer() {
  if (B.hp <= 0) return endBattle(true);
  if (B.hero.hp <= 0) return endBattle(false);
  setTimeout(bossTurn, 350);
}

function bossTurn() {
  const h = B.hero;
  const m = B.intent;
  const name = B.boss.name;

  if (B.frozen) {
    B.frozen = false;
    addLog(`❄️ ${name} is frozen in time and cannot act!`, 'sys');
  } else {
    switch (m.kind) {
      case 'attack': {
        const hits = m.hits || 1;
        let total = 0;
        for (let i = 0; i < hits; i++) { const d = bossDamage(m.mult); total += d; }
        hitHero(total);
        addLog(`${m.heavy ? '💥 ' : ''}${name} uses ${m.name}${hits > 1 ? ` (${hits} hits)` : ''} for ${total} damage${h.defending ? ' (defended)' : ''}.`, 'boss');
        break;
      }
      case 'burn': {
        const d = bossDamage(m.mult);
        hitHero(d);
        h.burn = m.turns;
        h.burnDmg = Math.max(2, Math.round(B.boss.atk * B.atkMod * 0.35));
        addLog(`🔥 ${name} uses ${m.name} for ${d} damage — you are burning!`, 'boss');
        break;
      }
      case 'weaken': {
        const d = bossDamage(m.mult);
        hitHero(d);
        h.weak = m.turns;
        addLog(`🌀 ${name} uses ${m.name} for ${d} damage — your attacks are weakened!`, 'boss');
        break;
      }
      case 'charge':
        addLog(`⏳ ${name} ${m.text}`, 'warn');
        break;
      case 'buff':
        B.atkMod += m.atkUp;
        addLog(`💢 ${name} uses ${m.name}! Attack rises.`, 'boss');
        break;
      case 'shield': {
        const amt = Math.round(B.maxHp * m.pct);
        B.shield += amt;
        addLog(`🔰 ${name} raises a ${amt}-point shield. Temporal Strike shatters shields!`, 'boss');
        break;
      }
      case 'heal': {
        const amt = Math.min(B.maxHp - B.hp, Math.round(B.maxHp * m.pct));
        B.hp += amt;
        floatNum('bossBox', `+${amt}`, 'heal');
        addLog(`💚 ${name} uses ${m.name} and recovers ${amt} HP.`, 'boss');
        break;
      }
      case 'stance':
        addLog(`${name} lowers its guard, finding no opening.`, 'sys');
        break;
      default:
        addLog(`${name} recovers its footing.`, 'sys');
    }
  }

  // End of round: status effects
  if (h.burn > 0 && h.hp > 0) {
    hitHero(h.burnDmg);
    addLog(`🔥 Burn deals ${h.burnDmg} damage.`, 'boss');
    h.burn--;
  }
  if (h.weak > 0) h.weak--;
  h.defending = false;

  if (h.hp <= 0) { renderBattle(); return setTimeout(() => endBattle(false), 500); }

  // Phase change
  if (B.phase === 1 && B.hp <= B.maxHp / 2) {
    B.phase = 2;
    B.idx = 0;
    addLog(`⚠️ ${B.boss.phaseText}`, 'warn');
    flashScreen();
  }

  h.cp = Math.min(MAX_CP, h.cp + 1);
  B.turn++;
  B.intent = nextIntent();
  B.busy = false;
  renderBattle();
}

function endBattle(won) {
  B.over = true;
  B.busy = true;
  const era = B.era, boss = B.boss;
  let body;
  if (won) {
    const first = !S.bosses[era.id];
    S.bosses[era.id] = true;
    const coins = first ? boss.coins : Math.round(boss.coins / 3);
    const xp = first ? boss.xp : Math.round(boss.xp / 3);
    S.coins += coins;
    const levels = grantXp(xp);
    let relicHtml = '';
    if (first) {
      grantArtifact(boss.relic);
      const a = ARTIFACTS[boss.relic];
      relicHtml = `<div class="artifact-reveal relic"><div class="big-emoji">${a.emoji}</div><h3>${a.name}</h3><p>${a.desc}</p><p class="bonus">${bonusText(a.bonus)}</p></div>`;
    }
    const nextEra = ERAS[eraIndex(era.id) + 1];
    const unlocks = [];
    if (first && nextEra && eraUnlocked(nextEra)) unlocks.push(`🌀 New era unlocked: <b>${nextEra.name}</b>`);
    if (first) Object.entries(CROPS).forEach(([id, c]) => { if (c.unlock === era.id) unlocks.push(`🌱 New seeds in the Market: <b>${c.emoji} ${c.name}</b>`); });
    if (era.final && first) S.won = true;
    body = `
      <h2>🏆 Victory!</h2>
      <p>${boss.name} has been defeated in ${B.turn} turns.</p>
      ${relicHtml}
      <p class="reward-line">🪙 +${coins} &nbsp; ✨ +${xp} XP ${levels ? `&nbsp; <b>⬆️ Level ${S.hero.level}!</b>` : ''}</p>
      ${unlocks.map(u => `<p>${u}</p>`).join('')}
      ${era.final && first ? '<p class="warn">⏳ You have saved all of history! Your grove is now a living museum of the ages. Keep farming and collecting as long as you like.</p>' : ''}`;
  } else {
    body = `
      <h2>💫 Defeated...</h2>
      <p>${boss.name} hurls you back through the rift to your homestead.</p>
      <p class="muted">Tips: Defend against ⚠️ heavy attacks, use Freeze Time on charged moves, display more artifacts, level up via puzzles, and upgrade at the Forge.</p>`;
  }
  saveGame();
  setTimeout(() => {
    openStage(`
      <div class="stage-card intro" style="--era:${era.color}">
        ${body}
        <div class="btn-row">
          <button class="btn primary" onclick="closeStage(); showTab('${won ? 'farm' : 'portal'}')">${won ? 'Return to Homestead' : 'Back to Portal'}</button>
        </div>
      </div>`, era.bg);
    B = null;
    renderAll();
  }, 700);
}

function retreatBattle() {
  if (!B || B.over) return;
  if (!confirm('Retreat? The energy spent on this trip will be lost.')) return;
  B = null;
  closeStage();
  showTab('portal');
}

// ---------- rendering ----------
function bar(cur, max, cls) {
  const pct = Math.max(0, Math.min(100, (cur / max) * 100));
  return `<div class="bar ${cls}"><div class="fill" style="width:${pct}%"></div><span>${Math.ceil(cur)} / ${max}</span></div>`;
}

function renderBattle() {
  if (!B) return;
  const h = B.hero;
  const boss = B.boss;
  const statusBits = [];
  if (h.burn) statusBits.push(`<span class="chip burn">🔥 Burn ${h.burn}</span>`);
  if (h.weak) statusBits.push(`<span class="chip weak">🌀 Weak ${h.weak}</span>`);
  if (h.defending) statusBits.push('<span class="chip">🛡️ Guard</span>');
  const bossBits = [];
  if (B.shield) bossBits.push(`<span class="chip shield">🔰 Shield ${B.shield}</span>`);
  if (B.atkMod > 1) bossBits.push(`<span class="chip burn">💢 ATK ×${B.atkMod.toFixed(2)}</span>`);
  if (B.frozen) bossBits.push('<span class="chip weak">❄️ Frozen</span>');
  if (B.phase === 2) bossBits.push('<span class="chip burn">Phase 2</span>');
  const dis = B.busy || B.over;
  const intent = B.frozen ? '❄️ Frozen — will lose this action' : intentText(B.intent);
  const heavy = !B.frozen && (B.intent.heavy || B.intent.kind === 'stance' || B.intent.kind === 'charge');

  let menu = '';
  if (B.menu === 'skills') {
    menu = `<div class="sub-menu">${Object.entries(SKILLS).map(([id, s]) =>
      `<button class="btn skill" ${dis || h.cp < s.cp ? 'disabled' : ''} onclick="battleAction('skill','${id}')"><b>${s.icon} ${s.name}</b> <span class="cp-cost">${s.cp} CP</span><small>${s.desc}</small></button>`).join('')}
      <button class="btn small ghost" onclick="B.menu=null;renderBattle()">Cancel</button></div>`;
  } else if (B.menu === 'items') {
    menu = `<div class="sub-menu">${Object.entries(SHOP_ITEMS).map(([id, it]) =>
      `<button class="btn skill" ${dis || !S.items[id] ? 'disabled' : ''} onclick="battleAction('item','${id}')"><b>${it.emoji} ${it.name}</b> <span class="cp-cost">×${S.items[id] || 0}</span><small>${it.desc}</small></button>`).join('')}
      <button class="btn small ghost" onclick="B.menu=null;renderBattle()">Cancel</button></div>`;
  }

  openStage(`
    <div class="battle" style="--era:${B.era.color}">
      <div class="battle-top">
        <span class="muted">${B.era.name} · Turn ${B.turn}</span>
        <button class="btn small ghost" onclick="retreatBattle()">🏃 Retreat</button>
      </div>
      <div class="combatant boss ${shakeCls('bossBox')}" id="bossBox">
        <div class="boss-emoji ${B.frozen ? 'frozen' : ''} ${B.phase === 2 ? 'enraged' : ''}">${boss.emoji}</div>
        <div class="combatant-info">
          <h3>${boss.name}</h3>
          ${bar(B.hp, B.maxHp, 'hp boss-hp')}
          ${B.shield ? bar(B.shield, Math.max(B.shield, Math.round(B.maxHp * 0.2)), 'shield-bar') : ''}
          <div class="chips">${bossBits.join('')}</div>
          <div class="intent ${heavy ? 'danger' : ''}"><small>Next move</small>${intent}</div>
        </div>
      </div>
      <div class="battle-log" id="battleLog">${B.log.slice(-7).map(l => `<div class="log ${l.cls}">${l.msg}</div>`).join('')}</div>
      <div class="combatant hero ${shakeCls('heroBox')}" id="heroBox">
        <div class="boss-emoji hero-emoji">🧭</div>
        <div class="combatant-info">
          <h3>Chrononaut <span class="muted">Lv ${S.hero.level} · ⚔️ ${h.atk} · 🛡️ ${h.def}</span></h3>
          ${bar(h.hp, h.maxHp, 'hp')}
          <div class="cp-row">CP ${[...Array(MAX_CP)].map((_, i) => `<span class="pip ${i < h.cp ? 'on' : ''}"></span>`).join('')}</div>
          <div class="chips">${statusBits.join('')}</div>
        </div>
      </div>
      ${menu || `
      <div class="actions">
        <button class="btn action" ${dis ? 'disabled' : ''} onclick="battleAction('attack')">🗡️ Attack</button>
        <button class="btn action" ${dis ? 'disabled' : ''} onclick="battleAction('defend')">🛡️ Defend</button>
        <button class="btn action" ${dis ? 'disabled' : ''} onclick="B.menu='skills';renderBattle()">✨ Chrono Skills</button>
        <button class="btn action" ${dis ? 'disabled' : ''} onclick="B.menu='items';renderBattle()">🎒 Items</button>
      </div>`}
    </div>`, B.era.bg);
  B.shakes = {};
  const log = document.getElementById('battleLog');
  if (log) log.scrollTop = log.scrollHeight;
}

function shakeCls(id) { return B && B.shakes && B.shakes[id] ? 'shake' : ''; }

function floatNum(targetId, text, cls) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = `float-num ${cls}`;
  f.textContent = text;
  f.style.left = `${rect.left + rect.width * rand(0.15, 0.35)}px`;
  f.style.top = `${rect.top + rect.height * 0.3}px`;
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1100);
}

function shake(id) {
  if (B) { B.shakes = B.shakes || {}; B.shakes[id] = true; }
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
}

function flashScreen() {
  const f = document.createElement('div');
  f.className = 'screen-flash';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 700);
}
