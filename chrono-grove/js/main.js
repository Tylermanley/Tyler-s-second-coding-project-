// ============================================================
//  Chrono Grove — UI shell: header, tabs, portal, museum, market
// ============================================================

let currentTab = 'farm';

function bonusText(b) {
  const labels = { atk: '⚔️ ATK', def: '🛡️ DEF', hp: '❤️ HP', energy: '⚡ Energy', gold: '🪙/day', sprinkler: '💦 Sprinkler' };
  return Object.entries(b).map(([k, v]) => k === 'sprinkler' ? labels[k] : `${labels[k]} +${v}`).join(' · ');
}

function toast(msg, ms = 2600) {
  const box = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = msg;
  box.appendChild(t);
  while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => t.classList.add('out'), ms);
  setTimeout(() => t.remove(), ms + 400);
}

function openStage(html, bg) {
  const st = document.getElementById('stage');
  st.style.background = bg || '';
  document.getElementById('stageInner').innerHTML = html;
  st.classList.add('open');
  document.body.classList.add('staged');
}

function closeStage() {
  stopPuzzleTimers();
  P = null;
  document.getElementById('stage').classList.remove('open');
  document.body.classList.remove('staged');
  renderAll();
}

// ---------- header ----------
function renderHeader() {
  const st = stats();
  const weather = { sunny: '☀️', rain: '🌧️', cloudy: '☁️' }[S.weather];
  document.getElementById('hud').innerHTML = `
    <div class="hud-item">📅 Day <b>${S.day}</b> ${weather}</div>
    <div class="hud-item">🪙 <b>${S.coins}</b></div>
    <div class="hud-item energy" title="Energy">⚡ <div class="mini-bar"><div style="width:${(S.energy / st.maxEnergy) * 100}%"></div></div><b>${S.energy}/${st.maxEnergy}</b></div>
    <div class="hud-item" title="XP ${S.hero.xp}/${xpToNext()}">⭐ Lv <b>${S.hero.level}</b> <div class="mini-bar xp"><div style="width:${(S.hero.xp / xpToNext()) * 100}%"></div></div></div>
    <div class="hud-item stats">❤️ ${st.maxHp} ⚔️ ${st.atk} 🛡️ ${st.def}</div>`;
}

function showTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + tab));
  renderAll();
}

function renderAll() {
  renderHeader();
  if (currentTab === 'farm') renderFarm();
  if (currentTab === 'portal') renderPortal();
  if (currentTab === 'museum') renderMuseum();
  if (currentTab === 'market') renderMarket();
  if (currentTab === 'help') renderHelp();
}

// ---------- Time Portal ----------
function renderPortal() {
  const view = document.getElementById('view-portal');
  view.innerHTML = `
    <h2 class="view-title">🌀 The Time Portal</h2>
    <p class="muted center">Solve puzzles to recover artifacts. Recover all three in an era to awaken its boss. Defeat the boss to open the next era.</p>
    <div class="era-list">
      ${ERAS.map(era => {
        const open = eraUnlocked(era);
        const done = S.bosses[era.id];
        if (!open) {
          return `<div class="era-card locked"><div class="era-icon">🔒</div><div><h3>${era.final ? '???' : era.name}</h3><p class="muted">${era.final ? 'Defeat every boss to reveal this rift.' : `Defeat ${ERAS[eraIndex(era.id) - 1].boss.name} to unlock.`}</p></div></div>`;
        }
        const bossOpen = bossUnlocked(era);
        return `
          <div class="era-card" style="--era:${era.color};background:${era.bg}">
            <div class="era-head">
              <div class="era-icon">${era.icon}</div>
              <div><h3>${era.name} ${done ? '✅' : ''}</h3><p class="era-year">${era.year} — ${era.blurb}</p></div>
            </div>
            <div class="era-puzzles">
              ${era.puzzles.map(p => {
                const a = ARTIFACTS[p.artifact];
                const cleared = S.puzzles[p.id];
                return `<button class="puzzle-btn ${cleared ? 'cleared' : ''}" onclick="openPuzzle('${era.id}','${p.id}')">
                  <span class="p-icon">${PUZZLE_INFO[p.type].icon}</span>
                  <span class="p-text"><b>${p.name}</b><small>${PUZZLE_INFO[p.type].title} · ⚡${PUZZLE_ENERGY}</small></span>
                  <span class="p-art">${cleared ? a.emoji : '❔'}</span>
                </button>`;
              }).join('')}
              <button class="puzzle-btn boss-btn ${bossOpen ? '' : 'locked'} ${done ? 'cleared' : ''}" ${bossOpen ? `onclick="openBossIntro('${era.id}')"` : 'disabled'}>
                <span class="p-icon">${bossOpen ? era.boss.emoji : '🔒'}</span>
                <span class="p-text"><b>${bossOpen ? era.boss.name : 'Boss sealed'}</b><small>${bossOpen ? `Boss battle · ⚡${BOSS_ENERGY}` : `Recover all ${era.puzzles.length} artifacts first`}</small></span>
                <span class="p-art">${done ? ARTIFACTS[era.boss.relic].emoji : '⚔️'}</span>
              </button>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// ---------- Museum ----------
function renderMuseum() {
  const view = document.getElementById('view-museum');
  const total = Object.keys(ARTIFACTS).length;
  const placed = new Set(placedArtifacts());
  view.innerHTML = `
    <h2 class="view-title">🏛️ Museum of the Ages</h2>
    <p class="muted center">Collected <b>${S.artifacts.length}</b> of <b>${total}</b> artifacts.</p>
    <div class="progress"><div style="width:${(S.artifacts.length / total) * 100}%"></div></div>
    ${ERAS.map(era => {
      const ids = Object.keys(ARTIFACTS).filter(id => ARTIFACTS[id].era === era.id);
      return `<section class="museum-era"><h3>${eraUnlocked(era) ? era.icon : '🔒'} ${eraUnlocked(era) || !era.final ? era.name : '???'}</h3>
        <div class="museum-grid">
          ${ids.map(id => {
            const a = ARTIFACTS[id];
            const own = S.artifacts.includes(id);
            return `<div class="museum-card ${own ? '' : 'missing'} ${a.relic ? 'relic' : ''}">
              <div class="m-emoji">${own ? a.emoji : '❔'}</div>
              <b>${own ? a.name : 'Undiscovered'}</b>
              <small>${own ? a.desc : (a.relic ? 'Defeat this era\'s boss.' : 'Solve a puzzle in this era.')}</small>
              ${own ? `<span class="bonus">${bonusText(a.bonus)}</span><span class="tag ${placed.has(id) ? 'on' : ''}">${placed.has(id) ? 'On display' : 'In vault'}</span>` : ''}
            </div>`;
          }).join('')}
        </div></section>`;
    }).join('')}`;
}

// ---------- Market ----------
function forgeCost(kind) {
  const n = kind === 'atk' ? S.hero.forgeAtk : S.hero.forgeDef;
  return 80 + n * 70;
}

function renderMarket() {
  const view = document.getElementById('view-market');
  const produceIds = Object.keys(S.produce).filter(id => S.produce[id] > 0);
  const produceValue = produceIds.reduce((s, id) => s + S.produce[id] * CROPS[id].sell, 0);
  view.innerHTML = `
    <h2 class="view-title">🛒 Village Market</h2>
    <div class="market-grid">
      <section class="panel">
        <h3>📦 Sell Produce</h3>
        ${produceIds.length ? `
          <ul class="sell-list">${produceIds.map(id => `<li>${CROPS[id].emoji} ${CROPS[id].name} ×${S.produce[id]} <span>🪙 ${S.produce[id] * CROPS[id].sell}</span></li>`).join('')}</ul>
          <button class="btn primary" onclick="sellAll()">Sell everything for 🪙 ${produceValue}</button>`
          : '<p class="muted">Nothing to sell. Harvest crops on your homestead!</p>'}
      </section>
      <section class="panel">
        <h3>🌱 Seeds</h3>
        ${Object.entries(CROPS).map(([id, c]) => {
          const ok = cropUnlocked(id);
          return `<div class="shop-row ${ok ? '' : 'locked'}">
            <span>${c.emoji} <b>${c.name}</b><small>${ok ? `${c.days} days · sells 🪙${c.sell} · own ×${S.seeds[id] || 0}` : `Unlocks after defeating the ${ERA_BY_ID[c.unlock].name} boss`}</small></span>
            ${ok ? `<span class="buy-btns"><button class="btn small" ${S.coins < c.cost ? 'disabled' : ''} onclick="buySeed('${id}',1)">🪙${c.cost}</button><button class="btn small" ${S.coins < c.cost * 5 ? 'disabled' : ''} onclick="buySeed('${id}',5)">×5</button></span>` : '<span>🔒</span>'}
          </div>`;
        }).join('')}
      </section>
      <section class="panel">
        <h3>🎒 Adventuring Supplies</h3>
        ${Object.entries(SHOP_ITEMS).map(([id, it]) => `
          <div class="shop-row"><span>${it.emoji} <b>${it.name}</b><small>${it.desc} · own ×${S.items[id] || 0}</small></span>
          <button class="btn small" ${S.coins < it.cost ? 'disabled' : ''} onclick="buyItem('${id}')">🪙${it.cost}</button></div>`).join('')}
      </section>
      <section class="panel">
        <h3>⚒️ Blacksmith's Forge</h3>
        <div class="shop-row"><span>🗡️ <b>Hone Chrono Blade</b><small>Permanent +2 ATK · level ${S.hero.forgeAtk}</small></span>
          <button class="btn small" ${S.coins < forgeCost('atk') ? 'disabled' : ''} onclick="forge('atk')">🪙${forgeCost('atk')}</button></div>
        <div class="shop-row"><span>🧥 <b>Reinforce Traveler's Coat</b><small>Permanent +1 DEF · level ${S.hero.forgeDef}</small></span>
          <button class="btn small" ${S.coins < forgeCost('def') ? 'disabled' : ''} onclick="forge('def')">🪙${forgeCost('def')}</button></div>
      </section>
    </div>`;
}

function sellAll() {
  let total = 0;
  for (const id in S.produce) { total += S.produce[id] * CROPS[id].sell; S.produce[id] = 0; }
  S.coins += total;
  toast(`Sold produce for 🪙 ${total}!`);
  saveGame(); renderAll();
}

function buySeed(id, n) {
  const cost = CROPS[id].cost * n;
  if (S.coins < cost || !cropUnlocked(id)) return;
  S.coins -= cost;
  S.seeds[id] = (S.seeds[id] || 0) + n;
  saveGame(); renderAll();
}

function buyItem(id) {
  const it = SHOP_ITEMS[id];
  if (S.coins < it.cost) return;
  S.coins -= it.cost;
  S.items[id] = (S.items[id] || 0) + 1;
  toast(`Bought ${it.emoji} ${it.name}.`);
  saveGame(); renderAll();
}

function forge(kind) {
  const cost = forgeCost(kind);
  if (S.coins < cost) return;
  S.coins -= cost;
  if (kind === 'atk') S.hero.forgeAtk++; else S.hero.forgeDef++;
  toast(kind === 'atk' ? '🗡️ Your blade gleams sharper! +2 ATK' : '🧥 Your coat feels sturdier! +1 DEF');
  saveGame(); renderAll();
}

// ---------- Help ----------
function renderHelp() {
  document.getElementById('view-help').innerHTML = `
    <h2 class="view-title">❔ How to Play</h2>
    <div class="help panel">
      <h3>🌱 Your Homestead</h3>
      <p>Use the <b>Hoe</b> to till grass and clear rocks, <b>Plant</b> seeds, and <b>Water</b> them. Watered crops grow one day each time you press <b>End Day</b>. Click a fully grown crop to harvest it, then sell it at the Market. Rainy days water everything for free.</p>
      <h3>🏺 Artifacts</h3>
      <p>Artifacts are recovered from puzzles and bosses. <b>Display</b> them on your land to activate their powers: more attack, defence, HP, energy, daily coins, or sprinkler effects that water the 8 tiles around them every morning.</p>
      <h3>🌀 Time Portal &amp; Puzzles</h3>
      <p>Each era has three puzzles — 🔍 hidden objects, 🃏 memory pairs, 🧩 sliding tiles and 🔮 rune sequences. Each costs ⚡${PUZZLE_ENERGY}. The first clear grants an artifact; replays give coins and XP.</p>
      <h3>⚔️ Turn-Based Boss Battles</h3>
      <p>Every turn the boss shows its <b>Next move</b>. Plan around it:</p>
      <ul>
        <li><b>Attack</b> — basic damage. <b>Defend</b> — take 60% less damage and gain an extra Chrono Point (CP).</li>
        <li>You gain 1 CP per turn (max ${MAX_CP}). Spend it on <b>⚡ Temporal Strike</b>, <b>⏪ Rewind</b> or <b>❄️ Freeze Time</b>.</li>
        <li>⚠️ <b>Heavy</b> attacks follow a charge-up turn — Defend or Freeze!</li>
        <li>🥋 <b>Counter Stance</b> punishes attacks — Defend, heal or Freeze instead.</li>
        <li>🔰 <b>Shields</b> soak up damage — Temporal Strike breaks them twice as fast.</li>
        <li>Bosses enter a deadlier <b>Phase 2</b> at half health.</li>
      </ul>
      <h3>💡 Tips</h3>
      <p>Level up by replaying puzzles, upgrade at the Forge, buy potions before boss fights, and place sprinkler artifacts in the middle of your fields.</p>
      <div class="btn-row"><button class="btn danger small" onclick="confirmReset()">Reset save</button></div>
    </div>`;
}

function confirmReset() {
  if (!confirm('Erase all progress and start a new homestead?')) return;
  resetGame();
  farmUI = { tool: 'hoe', seed: 'wheat', artifact: null };
  showTab('farm');
  showIntro();
}

function showIntro() {
  openStage(`
    <div class="stage-card intro">
      <div class="intro-icon">⏳</div>
      <h2>Welcome to Chrono Grove</h2>
      <p>Your great-aunt, a famous time-travelling archaeologist, has left you her overgrown homestead — and her pocket watch, the <b>Chrono Compass</b>.</p>
      <p>Rifts to the past have torn open. Priceless artifacts are scattered across history, guarded by ancient bosses... and something is devouring time itself.</p>
      <p>Farm your land, solve puzzles in five eras, defeat their guardians in turn-based battles, and display your recovered treasures in the grove.</p>
      <div class="btn-row"><button class="btn primary" onclick="S.introSeen=true;saveGame();closeStage()">Begin your journey</button></div>
    </div>`, 'linear-gradient(160deg,#2f5d3a,#1b3524)');
}

// ---------- boot ----------
window.addEventListener('DOMContentLoaded', () => {
  S = loadGame();
  if (S.day === 1 && !S.introSeen) applyMorningWater();
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => showTab(t.dataset.tab));
  showTab('farm');
  if (!S.introSeen) showIntro();
});
