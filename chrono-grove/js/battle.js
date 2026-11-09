// ============================================================
//  Chrono Grove — turn-based CARD battles against era guardians
// ============================================================

const BOSS_ENERGY = 5;
const BASE_CP = 3;
const HAND_SIZE = 5;
const MAX_HAND = 10;
let B = null;
let _cardK = 0;

function metCompanions() { return Object.keys(COMPANIONS).filter(w => S.rel[w].met); }

function openBossIntro(eraId) {
  const era = ERA_BY_ID[eraId];
  const boss = era.boss;
  const st = stats();
  const relic = ARTIFACTS[boss.relic];
  const beaten = S.bosses[era.id];
  if (S.support && !S.rel[S.support].met) S.support = null;
  const supports = metCompanions();
  const hint = S.support === 'anna' ? BOSS_HINTS[era.id][0] : null;
  openStage(`
    <div class="stage-card intro wide" style="--era:${era.color}">
      <div class="intro-icon boss-float">${boss.emoji}</div>
      <h2>${boss.name}</h2>
      <p class="muted">${era.name} · ${era.year}</p>
      <p><i>${boss.intro}</i></p>
      <div class="vs-row">
        <div><b>You</b><br>❤️ ${st.maxHp} · ⚔️ ${st.atk} · 🛡️ ${st.def}<br><small>🃏 ${deckSize()} cards · 🎒 🧪${S.items.potion || 0} 🍶${S.items.hipotion || 0} 🔋${S.items.tonic || 0}</small></div>
        <div class="vs">VS</div>
        <div><b>Boss</b><br>❤️ ${boss.hp} · ⚔️ ${boss.atk} · 🛡️ ${boss.def}</div>
      </div>
      ${supports.length ? `
        <div class="support-pick">
          <b>Support companion</b>
          <div class="support-opts">
            ${supports.map(w => `<button class="support-opt ${S.support === w ? 'active' : ''}" onclick="S.support='${w}';saveGame();openBossIntro('${eraId}')">
              <span class="sp-face">${portraitSVG(w, S.support === w ? 'happy' : CHAR_STYLE[w].defaultExpr, { crop: 'head' })}</span>
              <span>${COMPANIONS[w].name} <small>${hearts(w)}♥</small></span></button>`).join('')}
            <button class="support-opt ${!S.support ? 'active' : ''}" onclick="S.support=null;saveGame();openBossIntro('${eraId}')"><span class="sp-face solo">🧭</span><span>Go alone</span></button>
          </div>
        </div>` : ''}
      ${hint ? `<div class="anna-hint">${portraitSVG('anna', 'determined', { crop: 'head', cls: 'mini' })}<p><b>Anna's notes:</b> ${hint}</p></div>` : ''}
      <p class="reward-line">${beaten ? `Rematch reward: 🪙 ${Math.round(boss.coins / 3)} · ✨ ${Math.round(boss.xp / 3)} XP` : `Reward: <b>${relic.emoji} ${relic.name}</b> + card <b>${CARDS[BOSS_CARDS[era.id]].art} ${CARDS[BOSS_CARDS[era.id]].name}</b> · 🪙 ${boss.coins} · ✨ ${boss.xp} XP`}</p>
      <p class="muted">Costs ⚡ ${BOSS_ENERGY} energy (you have ${S.energy}).</p>
      <div class="btn-row">
        <button class="btn ghost" onclick="closeStage()">Not yet</button>
        <button class="btn danger" id="fightBtn" ${S.energy < BOSS_ENERGY ? 'disabled' : ''}>⚔️ Fight!</button>
      </div>
      ${S.energy < BOSS_ENERGY ? '<p class="warn">Not enough energy. End the day on your homestead to rest.</p>' : ''}
    </div>`, era.bg);
  const btn = document.getElementById('fightBtn');
  if (btn) btn.onclick = () => { if (spendEnergy(BOSS_ENERGY)) { saveGame(); renderHeader(); startBattle(eraId); } };
}

function startBattle(eraId) {
  const era = ERA_BY_ID[eraId];
  const st = stats();
  const support = S.support && S.rel[S.support].met ? S.support : null;
  B = {
    era, boss: era.boss,
    hp: era.boss.hp, maxHp: era.boss.hp,
    atkMod: 1, shield: 0, frozen: false, burn: 0, burnDmg: 0, weak: 0, vuln: 0,
    phase: 1, idx: 0, intent: null,
    hero: { hp: st.maxHp, maxHp: st.maxHp, atk: st.atk, def: st.def, cp: 0, block: 0, burn: 0, burnDmg: 0, weak: 0 },
    drawPile: shuffle(deckList()).map(id => ({ id, k: ++_cardK })), hand: [], discard: [], exhausted: [],
    support, supportUsed: false, bubble: support ? COMPANIONS[support].battleStart : '',
    log: [], busy: false, over: false, turn: 1, menu: null, heroExpr: 'determined',
  };
  B.intent = nextIntent();
  addLog(`⚔️ ${B.boss.name} appears!`, 'sys');
  if (support) addLog(`🤝 ${COMPANIONS[support].name} fights by your side.`, 'sys');
  startPlayerTurn();
}

function supportPerk(who, h) { return B.support === who && hearts(who) >= h; }

function nextIntent() {
  const pat = B.phase === 1 ? B.boss.p1 : B.boss.p2;
  const id = pat[B.idx % pat.length];
  B.idx++;
  return Object.assign({ id }, B.boss.moves[id]);
}

function addLog(msg, cls = '') {
  B.log.push({ msg, cls });
  if (B.log.length > 50) B.log.shift();
}

function drawCards(n) {
  for (let i = 0; i < n; i++) {
    if (B.hand.length >= MAX_HAND) return;
    if (!B.drawPile.length) {
      if (!B.discard.length) return;
      B.drawPile = shuffle(B.discard);
      B.discard = [];
      addLog('🔄 You shuffle your discard pile back into your deck.', 'sys');
    }
    B.hand.push(B.drawPile.pop());
  }
}

function startPlayerTurn() {
  const h = B.hero;
  h.block = 0;
  if (supportPerk('anna', 6)) { h.block = 4; }
  h.cp = BASE_CP + (B.turn === 1 && supportPerk('cedric', 6) ? 1 : 0);
  drawCards(HAND_SIZE + (B.support === 'cedric' ? 1 : 0));
  if (B.support === 'anna') B.bubble = annaHint();
  else if (B.support === 'cedric' && B.turn > 1) B.bubble = COMPANIONS.cedric.quips[Math.floor(Math.random() * COMPANIONS.cedric.quips.length)];
  B.heroExpr = h.hp < h.maxHp * 0.3 ? 'sad' : 'determined';
  B.busy = false;
  renderBattle();
}

// ---------- Anna's live tactical hints ----------
function expectedHit(m) {
  const per = Math.max(1, B.boss.atk * B.atkMod * (m.mult || 1) - B.hero.def / 4) * (B.weak > 0 ? 0.75 : 1);
  return Math.round(per) * (m.hits || 1);
}

function annaHint() {
  const m = B.intent;
  let tip;
  if (B.frozen) tip = 'It\'s frozen in time! This is a free turn, so go all out!';
  else switch (m.kind) {
    case 'attack':
      tip = m.heavy
        ? `Danger! ${m.name} will hit for about ${expectedHit(m)}! Play every Block card you can!`
        : `${m.name} is coming, about ${expectedHit(m)} damage. ${expectedHit(m) <= 8 ? 'You can afford to attack.' : 'One Block card would soak most of it.'}`;
      break;
    case 'charge': tip = 'It\'s charging up, so it won\'t attack this turn. Hit it hard now, then defend next turn!'; break;
    case 'stance': tip = 'Counter Stance! Don\'t play attack cards this turn. Block, heal or use skills instead.'; break;
    case 'shield': tip = 'It\'s about to raise a shield. Deal damage now, and use ⚡ shield-breakers afterwards.'; break;
    case 'buff': tip = 'It\'s powering up instead of attacking. Free damage. Burst it down!'; break;
    case 'burn': tip = `Fire attack, about ${expectedHit(m)} damage plus burning. Holy Light, Rewind or my Remedy will cleanse it.`; break;
    case 'weaken': tip = `It will weaken your attacks (about ${expectedHit(m)} damage). Block now and save your big hits.`; break;
    case 'heal': tip = 'It\'s going to repair itself. Pour on the damage, and burn helps too!'; break;
    default: tip = 'It\'s off-balance after that counter. Free hits!';
  }
  if (B.shield) tip += ` (Its shield has ${B.shield}. ⚡ cards break shields twice as fast.)`;
  return tip;
}

// ---------- damage ----------
function heroDamage(mult, pierce) {
  const h = B.hero;
  let dmg = h.atk * mult * rand(0.9, 1.1);
  if (h.weak > 0) dmg *= 0.7;
  const crit = Math.random() < 0.1;
  if (crit) dmg *= 1.5;
  if (!pierce) dmg -= B.boss.def / 2;
  if (B.vuln > 0) dmg *= 1.5;
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

function bossRaw(mult) {
  let dmg = B.boss.atk * B.atkMod * mult * rand(0.9, 1.1) - B.hero.def / 4;
  if (B.weak > 0) dmg *= 0.75;
  return Math.max(1, Math.round(dmg));
}

// Applies Block first; returns damage actually taken
function hitHero(dmg) {
  const h = B.hero;
  const blocked = Math.min(h.block, dmg);
  h.block -= blocked;
  const taken = dmg - blocked;
  h.hp = Math.max(0, h.hp - taken);
  floatNum('heroBox', taken ? `-${taken}` : 'Blocked', taken ? 'dmg' : 'block');
  if (taken) { shake('heroBox'); B.heroExpr = 'surprised'; }
  return { taken, blocked };
}

function healHero(n) {
  const h = B.hero;
  const amt = Math.min(n, h.maxHp - h.hp);
  h.hp += amt;
  floatNum('heroBox', `+${amt}`, 'heal');
  B.heroExpr = 'happy';
  return amt;
}

// ---------- player actions ----------
function playCard(k) {
  if (!B || B.busy || B.over) return;
  const i = B.hand.findIndex(c => c.k === k);
  if (i < 0) return;
  const card = B.hand[i];
  const c = CARDS[card.id];
  const h = B.hero;
  if (h.cp < c.cost) return;
  h.cp -= c.cost;
  B.hand.splice(i, 1);
  B.menu = null;
  if (c.cost >= 3 || c.rarity === 'legendary') cutIn('hero', c.name, c.art);
  B.heroExpr = 'determined';

  if (c.dmg) {
    const hits = c.hits || 1;
    if (B.intent.kind === 'stance' && !B.frozen) {
      let dealt = 0;
      for (let n = 0; n < hits; n++) dealt += hitBoss(Math.max(1, Math.round(heroDamage(c.dmg, c.pierce).dmg / 2)), c.shieldBreak ? 2 : 1).dealt;
      addLog(`${c.art} ${c.name} strikes into the ${B.intent.name}… only ${dealt} damage gets through.`, 'you');
      const r = hitHero(Math.max(1, Math.round(B.boss.atk * B.atkMod * 1.5 * rand(0.9, 1.1) - h.def / 4)));
      addLog(`💥 ${B.boss.name} COUNTERS for ${r.taken} damage${r.blocked ? ` (${r.blocked} blocked)` : ''}!`, 'boss');
      B.intent = { id: 'spent', name: 'Recovering', kind: 'none' };
      if (B.support === 'anna') B.bubble = 'Ow! That\'s why I said no attacks during the stance! It\'s off-balance now, so go for it!';
    } else {
      let dealt = 0, absorbed = 0, crit = false;
      for (let n = 0; n < hits; n++) {
        const d = heroDamage(c.dmg, c.pierce);
        crit = crit || d.crit;
        const r = hitBoss(d.dmg, c.shieldBreak ? 2 : 1);
        dealt += r.dealt; absorbed += r.absorbed;
      }
      addLog(`${c.art} ${crit ? 'Critical! ' : ''}${c.name} deals ${dealt} damage${hits > 1 ? ` in ${hits} hits` : ''}${absorbed ? ` (${absorbed} hit the shield)` : ''}.`, 'you');
    }
  }
  if (c.block) {
    const amt = blockAmount(c, h.def);
    h.block += amt;
    addLog(`${c.art} ${c.name}: +${amt} Block.`, 'you');
  }
  if (c.heal) addLog(`${c.art} ${c.name} heals ${healHero(Math.round(h.maxHp * c.heal))} HP.`, 'you');
  if (c.cleanse && (h.burn || h.weak)) { h.burn = 0; h.weak = 0; addLog('✨ Ailments cleansed.', 'you'); }
  if (c.cp) { h.cp += c.cp; addLog(`${c.art} +${c.cp} CP.`, 'you'); }
  if (c.draw) drawCards(c.draw);
  if (c.burn) { B.burn = Math.max(B.burn, c.burn); B.burnDmg = Math.max(B.burnDmg, Math.round(h.atk * 0.4)); addLog(`🔥 ${B.boss.name} is burning!`, 'you'); }
  if (c.weak) { B.weak = Math.max(B.weak, c.weak); addLog(`🌀 ${B.boss.name} is weakened.`, 'you'); }
  if (c.vuln) { B.vuln = Math.max(B.vuln, c.vuln); addLog(`🎯 ${B.boss.name} is exposed: +50% damage taken!`, 'you'); }
  if (c.freeze) { B.frozen = true; addLog(`❄️ Time freezes around ${B.boss.name}!`, 'you'); if (B.support === 'anna') B.bubble = annaHint(); }
  (c.exhaust ? B.exhausted : B.discard).push(card);
  checkBattleEnd() || renderBattle();
}

function useItem(id) {
  if (!B || B.busy || B.over || !S.items[id]) return;
  S.items[id]--;
  saveGame();
  B.menu = null;
  if (id === 'potion') addLog(`🧪 Potion restores ${healHero(40)} HP.`, 'you');
  if (id === 'hipotion') addLog(`🍶 Royal Elixir restores ${healHero(120)} HP.`, 'you');
  if (id === 'tonic') { B.hero.cp += 3; addLog('🔋 Chrono Tonic: +3 CP.', 'you'); }
  renderBattle();
}

function useSupport() {
  if (!B || B.busy || B.over || B.supportUsed || !B.support || hearts(B.support) < 3) return;
  B.supportUsed = true;
  const h = B.hero;
  if (B.support === 'anna') {
    const pct = S.partner === 'anna' ? 0.5 : 0.3;
    cutIn('anna', 'Anna\'s Remedy!', '💗');
    const amt = healHero(Math.round(h.maxHp * pct));
    h.burn = 0; h.weak = 0;
    addLog(`💗 Anna's Remedy heals ${amt} HP and cleanses your ailments!`, 'ally');
    B.bubble = 'Hold still, I\'ve got you!';
  } else {
    const mult = S.partner === 'cedric' ? 4 : 2.5;
    cutIn('cedric', 'Broadside! FIRE!', '💥');
    const d = heroDamage(mult, true);
    const r = hitBoss(d.dmg, 2);
    addLog(`💥 The Gilded Gull fires a Broadside for ${r.dealt} damage!`, 'ally');
    B.bubble = 'All cannons, FIRE! Ha-ha!';
  }
  checkBattleEnd() || renderBattle();
}

function checkBattleEnd() {
  if (B.hp <= 0) { B.busy = true; renderBattle(); setTimeout(() => endBattle(true), 600); return true; }
  if (B.hero.hp <= 0) { B.busy = true; renderBattle(); setTimeout(() => endBattle(false), 600); return true; }
  return false;
}

function endTurn() {
  if (!B || B.busy || B.over) return;
  B.busy = true;
  B.menu = null;
  B.discard.push(...B.hand);
  B.hand = [];
  renderBattle();
  setTimeout(bossTurn, 500);
}

function bossTurn() {
  if (!B) return;
  const h = B.hero;
  const m = B.intent;
  const name = B.boss.name;

  if (B.burn > 0) {
    B.hp = Math.max(0, B.hp - B.burnDmg);
    floatNum('bossBox', `-${B.burnDmg}`, 'dmg');
    addLog(`🔥 Burn scorches ${name} for ${B.burnDmg}.`, 'you');
    B.burn--;
    if (checkBattleEnd()) return;
  }

  if (B.frozen) {
    B.frozen = false;
    addLog(`❄️ ${name} is frozen in time and cannot act!`, 'sys');
  } else {
    switch (m.kind) {
      case 'attack': {
        const hits = m.hits || 1;
        let taken = 0, blocked = 0;
        for (let i = 0; i < hits; i++) { const r = hitHero(bossRaw(m.mult)); taken += r.taken; blocked += r.blocked; }
        addLog(`${m.heavy ? '💥 ' : ''}${name} uses ${m.name}${hits > 1 ? ` (${hits} hits)` : ''}: ${taken} damage${blocked ? `, ${blocked} blocked` : ''}.`, 'boss');
        if (m.heavy) impactFlash();
        break;
      }
      case 'burn': {
        const r = hitHero(bossRaw(m.mult));
        h.burn = m.turns;
        h.burnDmg = Math.max(2, Math.round(B.boss.atk * B.atkMod * 0.35));
        addLog(`🔥 ${name} uses ${m.name}: ${r.taken} damage${r.blocked ? ` (${r.blocked} blocked)` : ''}, and you are burning!`, 'boss');
        if (m.heavy) impactFlash();
        break;
      }
      case 'weaken': {
        const r = hitHero(bossRaw(m.mult));
        h.weak = m.turns;
        addLog(`🌀 ${name} uses ${m.name}: ${r.taken} damage, and your attacks are weakened!`, 'boss');
        break;
      }
      case 'charge': addLog(`⏳ ${name} ${m.text}`, 'warn'); break;
      case 'buff': B.atkMod += m.atkUp; addLog(`💢 ${name} uses ${m.name}! Its attack rises.`, 'boss'); break;
      case 'shield': {
        const amt = Math.round(B.maxHp * m.pct);
        B.shield += amt;
        addLog(`🔰 ${name} raises a ${amt}-point shield.`, 'boss');
        break;
      }
      case 'heal': {
        const amt = Math.min(B.maxHp - B.hp, Math.round(B.maxHp * m.pct));
        B.hp += amt;
        floatNum('bossBox', `+${amt}`, 'heal');
        addLog(`💚 ${name} uses ${m.name} and recovers ${amt} HP.`, 'boss');
        break;
      }
      case 'stance': addLog(`${name} lowers its guard, finding no opening.`, 'sys'); break;
      default: addLog(`${name} recovers its footing.`, 'sys');
    }
  }

  if (h.burn > 0 && h.hp > 0) {
    h.hp = Math.max(0, h.hp - h.burnDmg);
    floatNum('heroBox', `-${h.burnDmg}`, 'dmg');
    addLog(`🔥 Burn deals ${h.burnDmg} damage to you.`, 'boss');
    h.burn--;
  }
  if (h.weak > 0) h.weak--;
  if (B.weak > 0) B.weak--;
  if (B.vuln > 0) B.vuln--;
  if (checkBattleEnd()) return;

  if (B.phase === 1 && B.hp <= B.maxHp / 2) {
    B.phase = 2;
    B.idx = 0;
    addLog(`⚠️ ${B.boss.phaseText}`, 'warn');
    flashScreen();
  }
  B.turn++;
  B.intent = nextIntent();
  startPlayerTurn();
}

function endBattle(won) {
  if (!B || B.over) return;
  B.over = true;
  B.busy = true;
  const era = B.era, boss = B.boss, support = B.support;
  let body;
  let heartsGained = 0;
  if (support) heartsGained = addAffection(support, won ? 15 : 5);
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
      grantCard(BOSS_CARDS[era.id]);
      const a = ARTIFACTS[boss.relic];
      relicHtml = `<div class="artifact-reveal relic"><div class="big-emoji">${a.emoji}</div><h3>${a.name}</h3><p>${a.desc}</p><p class="bonus">${bonusText(a.bonus)}</p></div>
        <div class="card-gift">${portraitSVG('cedric', 'happy', { crop: 'head', cls: 'mini' })}<div><p><b>Cedric:</b> "I forged a trophy card from that beast's power!"</p>${cardHTML(BOSS_CARDS[era.id])}</div></div>`;
    }
    const nextEra = ERAS[eraIndex(era.id) + 1];
    const unlocks = [];
    if (first && nextEra && eraUnlocked(nextEra)) unlocks.push(`🌀 New era unlocked: <b>${nextEra.name}</b>`);
    if (first) Object.entries(CROPS).forEach(([id, c]) => { if (c.unlock === era.id) unlocks.push(`🌱 New seeds in the Market: <b>${c.emoji} ${c.name}</b>`); });
    if (era.final && first) S.won = true;
    body = `
      <h2>🏆 Victory!</h2>
      <p>${boss.name} has been defeated in ${B.turn} turns.</p>
      ${support ? `<div class="anna-hint">${portraitSVG(support, 'happy', { crop: 'head', cls: 'mini' })}<p><b>${COMPANIONS[support].name}:</b> ${COMPANIONS[support].battleWin} <span class="love-txt">💗 +15${heartsGained ? ` (${hearts(support)}♥!)` : ''}</span></p></div>` : ''}
      ${relicHtml}
      <p class="reward-line">🪙 +${coins} &nbsp; ✨ +${xp} XP ${levels ? `&nbsp; <b>⬆️ Level ${S.hero.level}!</b>` : ''}</p>
      ${unlocks.map(u => `<p>${u}</p>`).join('')}
      ${era.final && first ? '<p class="warn">⏳ You have saved all of history! Your grove is now a living museum of the ages. Keep farming, collecting and spending time with the people you love.</p>' : ''}`;
  } else {
    body = `
      <h2>💫 Defeated…</h2>
      <p>${boss.name} hurls you back through the rift to your homestead.</p>
      ${support ? `<div class="anna-hint">${portraitSVG(support, 'sad', { crop: 'head', cls: 'mini' })}<p><b>${COMPANIONS[support].name}:</b> ${COMPANIONS[support].battleLose}</p></div>` : ''}
      <p class="muted">Tips: read Anna's Guardian Notes, buy stronger cards from Cedric, add more Block to your deck, display more artifacts, and level up through puzzles.</p>`;
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

function intentText(m) {
  switch (m.kind) {
    case 'attack': return `${m.heavy ? '⚠️ ' : '🗡️ '}${m.name}${m.hits > 1 ? ` (${m.hits} hits)` : ''}${m.heavy ? ' — HEAVY!' : ''}`;
    case 'charge': return `⏳ ${m.name} — charging a big attack!`;
    case 'buff':   return `💢 ${m.name} — powering up`;
    case 'shield': return `🔰 ${m.name} — raising a shield`;
    case 'burn':   return `🔥 ${m.name} — attack + burn${m.heavy ? ' — HEAVY!' : ''}`;
    case 'weaken': return `🌀 ${m.name} — attack + weaken`;
    case 'stance': return `🥋 ${m.name} — attack cards get COUNTERED!`;
    case 'heal':   return `💚 ${m.name} — repairing itself`;
  }
  return m.name;
}

function renderBattle() {
  if (!B) return;
  const h = B.hero;
  const boss = B.boss;
  const st = { atk: h.atk * (h.weak > 0 ? 0.7 : 1), def: h.def };
  const heroChips = [];
  if (h.block) heroChips.push(`<span class="chip shield">🛡️ Block ${h.block}</span>`);
  if (h.burn) heroChips.push(`<span class="chip burn">🔥 Burn ${h.burn}</span>`);
  if (h.weak) heroChips.push(`<span class="chip weak">🌀 Weak ${h.weak}</span>`);
  const bossChips = [];
  if (B.shield) bossChips.push(`<span class="chip shield">🔰 Shield ${B.shield}</span>`);
  if (B.atkMod > 1) bossChips.push(`<span class="chip burn">💢 ATK ×${B.atkMod.toFixed(2)}</span>`);
  if (B.burn) bossChips.push(`<span class="chip burn">🔥 Burn ${B.burn}</span>`);
  if (B.weak) bossChips.push(`<span class="chip weak">🌀 Weak ${B.weak}</span>`);
  if (B.vuln) bossChips.push(`<span class="chip vuln">🎯 Exposed ${B.vuln}</span>`);
  if (B.frozen) bossChips.push('<span class="chip weak">❄️ Frozen</span>');
  if (B.phase === 2) bossChips.push('<span class="chip burn">Phase 2</span>');
  const dis = B.busy || B.over;
  const intent = B.frozen ? '❄️ Frozen — it will lose this action' : intentText(B.intent);
  const danger = !B.frozen && (B.intent.heavy || B.intent.kind === 'stance' || B.intent.kind === 'charge');
  const sup = B.support ? COMPANIONS[B.support] : null;
  const canAbility = sup && hearts(B.support) >= 3;
  const abilityName = B.support === 'anna' ? '💗 Remedy' : '💥 Broadside';
  const supExpr = B.support === 'anna' ? (danger ? 'surprised' : B.hero.hp < B.hero.maxHp * 0.35 ? 'sad' : 'determined') : (danger ? 'determined' : 'smirk');
  const fan = B.hand.length;

  openStage(`
    <div class="battle" style="--era:${B.era.color}">
      <div class="battle-top">
        <span class="muted">${B.era.name} · Turn ${B.turn}</span>
        <button class="btn small ghost" onclick="retreatBattle()">🏃 Retreat</button>
      </div>
      <div class="battle-field">
        <div class="combatant boss ${shakeCls('bossBox')}" id="bossBox">
          <div class="boss-emoji ${B.frozen ? 'frozen' : ''} ${B.phase === 2 ? 'enraged' : ''}">${boss.emoji}</div>
          <div class="combatant-info">
            <h3>${boss.name}</h3>
            ${bar(B.hp, B.maxHp, 'hp boss-hp')}
            ${B.shield ? bar(B.shield, Math.max(B.shield, Math.round(B.maxHp * 0.2)), 'shield-bar') : ''}
            <div class="chips">${bossChips.join('')}</div>
            <div class="intent ${danger ? 'danger' : ''}"><small>Next move</small>${intent}</div>
          </div>
        </div>
        ${sup ? `
        <div class="ally-box">
          <div class="ally-portrait">${portraitSVG(B.support, supExpr, { crop: 'bust', talking: false })}</div>
          <div class="ally-bubble"><b>${sup.name}</b><span>${B.bubble}</span></div>
          ${canAbility ? `<button class="btn small ally-btn" ${dis || B.supportUsed ? 'disabled' : ''} onclick="useSupport()">${B.supportUsed ? 'Used' : abilityName}</button>` : `<small class="muted">Reach 3♥ to unlock ${abilityName}</small>`}
        </div>` : ''}
      </div>
      <div class="battle-log" id="battleLog">${B.log.slice(-6).map(l => `<div class="log ${l.cls}">${l.msg}</div>`).join('')}</div>
      <div class="combatant hero ${shakeCls('heroBox')}" id="heroBox">
        <div class="hero-face">${portraitSVG('hero', B.heroExpr, { crop: 'head' })}</div>
        <div class="combatant-info">
          <h3>Chrononaut <span class="muted">Lv ${S.hero.level} · ⚔️ ${h.atk} · 🛡️ ${h.def}</span></h3>
          ${bar(h.hp, h.maxHp, 'hp')}
          <div class="cp-row">CP ${[...Array(Math.max(BASE_CP, h.cp))].map((_, i) => `<span class="pip ${i < h.cp ? 'on' : ''}"></span>`).join('')}
            <span class="pile">🂠 ${B.drawPile.length} · ♻️ ${B.discard.length}</span></div>
          <div class="chips">${heroChips.join('')}</div>
        </div>
      </div>
      ${B.menu === 'items' ? `
        <div class="sub-menu">${Object.entries(SHOP_ITEMS).map(([id, it]) =>
          `<button class="btn skill" ${dis || !S.items[id] ? 'disabled' : ''} onclick="useItem('${id}')"><b>${it.emoji} ${it.name}</b> <span class="cp-cost">×${S.items[id] || 0}</span><small>${it.desc} Free action.</small></button>`).join('')}
          <button class="btn small ghost" onclick="B.menu=null;renderBattle()">Cancel</button></div>` : `
        <div class="hand" style="--n:${fan}">
          ${B.hand.map((card, i) => {
            const c = CARDS[card.id];
            const off = i - (fan - 1) / 2;
            const counterWarn = c.dmg && B.intent.kind === 'stance' && !B.frozen;
            return cardHTML(card.id, { st, k: card.k, button: true, disabled: dis || h.cp < c.cost, cls: `in-hand ${counterWarn ? 'warn-card' : ''}`, style: `--r:${off * 4}deg;--y:${Math.abs(off) * 6}px;animation-delay:${i * 0.05}s` });
          }).join('') || '<p class="muted">No cards in hand.</p>'}
        </div>
        <div class="turn-bar">
          <button class="btn" ${dis ? 'disabled' : ''} onclick="B.menu='items';renderBattle()">🎒 Items</button>
          <button class="btn primary end-turn" ${dis ? 'disabled' : ''} onclick="endTurn()">End Turn ⏭</button>
        </div>`}
    </div>`, B.era.bg);
  document.querySelectorAll('.hand .card').forEach(el => el.onclick = () => playCard(+el.dataset.k));
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
  f.style.left = `${rect.left + rect.width * rand(0.15, 0.4)}px`;
  f.style.top = `${rect.top + rect.height * 0.3}px`;
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1100);
}

function shake(id) {
  if (B) { B.shakes = B.shakes || {}; B.shakes[id] = true; }
}

function flashScreen() {
  const f = document.createElement('div');
  f.className = 'screen-flash';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 700);
}

function impactFlash() {
  const f = document.createElement('div');
  f.className = 'impact-flash';
  f.innerHTML = '<span>BOOM!!</span>';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 650);
}

// Anime-style special move cut-in
function cutIn(who, text, icon) {
  const f = document.createElement('div');
  f.className = `cutin cutin-${who}`;
  f.innerHTML = `<div class="cutin-band"><div class="cutin-lines"></div>
    <div class="cutin-face">${portraitSVG(who, who === 'hero' ? 'determined' : 'happy', { crop: 'head' })}</div>
    <div class="cutin-text"><span class="cutin-icon">${icon || ''}</span>${text}</div></div>`;
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1150);
}
