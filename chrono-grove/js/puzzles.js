// ============================================================
//  Chrono Grove — puzzles (hidden object, memory, slider, rune lock)
// ============================================================

const PUZZLE_ENERGY = 3;
let P = null; // active puzzle session

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function rand(min, max) { return min + Math.random() * (max - min); }

function stopPuzzleTimers() {
  if (!P) return;
  if (P.timer) clearInterval(P.timer);
  (P.timeouts || []).forEach(clearTimeout);
  P.timer = null;
  P.timeouts = [];
}

function puzzleTimeout(fn, ms) {
  const id = setTimeout(fn, ms);
  if (P) P.timeouts.push(id);
  return id;
}

// ---------- entry point ----------
function openPuzzle(eraId, puzzleId) {
  const era = ERA_BY_ID[eraId];
  const puzzle = era.puzzles.find(p => p.id === puzzleId);
  const info = PUZZLE_INFO[puzzle.type];
  const art = ARTIFACTS[puzzle.artifact];
  const cleared = S.puzzles[puzzle.id];
  openStage(`
    <div class="stage-card intro" style="--era:${era.color}">
      <div class="intro-icon">${info.icon}</div>
      <h2>${puzzle.name}</h2>
      <p class="muted">${era.name} · ${info.title}</p>
      <p>${info.rules}</p>
      <div class="reward-line">
        ${cleared
          ? `<span>Replay reward: 🪙 ${replayCoins(era)} · ✨ ${replayXp(era)} XP</span>`
          : `<span>Reward: <b>${art.emoji} ${art.name}</b> + Cedric's card <b>${CARDS[PUZZLE_CARDS[puzzle.id]].art} ${CARDS[PUZZLE_CARDS[puzzle.id]].name}</b> · 🪙 ${firstCoins(era)} · ✨ ${firstXp(era)} XP</span>`}
      </div>
      <p class="muted">Costs ⚡ ${PUZZLE_ENERGY} energy (you have ${S.energy}).</p>
      <div class="btn-row">
        <button class="btn ghost" onclick="closeStage()">Back</button>
        <button class="btn primary" id="beginPuzzle" ${S.energy < PUZZLE_ENERGY ? 'disabled' : ''}>Travel &amp; Begin</button>
      </div>
      ${S.energy < PUZZLE_ENERGY ? '<p class="warn">Not enough energy — end the day on your homestead to rest.</p>' : ''}
    </div>`, era.bg);
  const btn = document.getElementById('beginPuzzle');
  if (btn) btn.onclick = () => {
    if (!spendEnergy(PUZZLE_ENERGY)) return;
    saveGame();
    renderHeader();
    P = { era, puzzle, timer: null, timeouts: [], diff: eraIndex(era.id) };
    const runners = { hidden: runHidden, memory: runMemory, slider: runSlider, sequence: runSequence };
    runners[puzzle.type]();
  };
}

const firstCoins = era => 25 + 15 * eraIndex(era.id);
const firstXp = era => 25 + 10 * eraIndex(era.id);
const replayCoins = era => 12 + 8 * eraIndex(era.id);
const replayXp = era => 12 + 6 * eraIndex(era.id);

function finishPuzzle(success, detail) {
  stopPuzzleTimers();
  const { era, puzzle } = P;
  let body;
  if (success) {
    const first = !S.puzzles[puzzle.id];
    S.puzzles[puzzle.id] = (S.puzzles[puzzle.id] || 0) + 1;
    const coins = first ? firstCoins(era) : replayCoins(era);
    const xp = first ? firstXp(era) : replayXp(era);
    S.coins += coins;
    const levels = grantXp(xp);
    let artLine = '';
    if (first) {
      grantArtifact(puzzle.artifact);
      const a = ARTIFACTS[puzzle.artifact];
      artLine = `<div class="artifact-reveal"><div class="big-emoji">${a.emoji}</div><h3>${a.name}</h3><p>${a.desc}</p><p class="bonus">${bonusText(a.bonus)}</p><p class="muted">Display it on your homestead to activate its power!</p></div>`;
      const cardId = PUZZLE_CARDS[puzzle.id];
      if (cardId) {
        grantCard(cardId);
        artLine += `<div class="card-gift">${portraitSVG('cedric', 'happy', { crop: 'head', cls: 'mini' })}<div><p><b>Cedric:</b> "What a find! I've forged you a new battle card from it."</p>${cardHTML(cardId)}</div></div>`;
      }
    }
    const bossNow = first && bossUnlocked(era) && !era.final;
    body = `
      <h2>✨ Puzzle Complete!</h2>
      ${detail ? `<p class="muted">${detail}</p>` : ''}
      ${artLine}
      <p class="reward-line">🪙 +${coins} &nbsp; ✨ +${xp} XP ${levels ? `&nbsp; <b>⬆️ Level ${S.hero.level}!</b>` : ''}</p>
      ${bossNow && !S.bosses[era.id] ? `<p class="warn">⚔️ ${era.boss.name} has awakened in ${era.name}!</p>` : ''}`;
  } else {
    body = `<h2>⌛ Time Slipped Away</h2><p>${detail || 'The rift closed before you could finish.'}</p><p class="muted">Try again whenever you like.</p>`;
  }
  saveGame();
  openStage(`
    <div class="stage-card intro" style="--era:${era.color}">
      ${body}
      <div class="btn-row">
        <button class="btn ghost" onclick="closeStage(); showTab('portal')">Return to Portal</button>
        <button class="btn primary" onclick="openPuzzle('${era.id}','${puzzle.id}')">Play Again</button>
      </div>
    </div>`, era.bg);
  P = null;
  renderAll();
}

function abandonPuzzle() {
  if (!P) return;
  finishPuzzle(false, 'You stepped back through the rift.');
}

function puzzleShell(title, extraHud, inner) {
  return `
    <div class="puzzle" style="--era:${P.era.color}">
      <div class="puzzle-hud">
        <div><b>${title}</b><span class="muted"> · ${P.era.name}</span></div>
        <div class="hud-right">${extraHud}<button class="btn small ghost" onclick="abandonPuzzle()">Give up</button></div>
      </div>
      ${inner}
    </div>`;
}

function startCountdown(seconds, onTick, onEnd) {
  P.timeLeft = seconds;
  onTick(P.timeLeft);
  P.timer = setInterval(() => {
    P.timeLeft -= 1;
    if (P.timeLeft <= 0) { P.timeLeft = 0; onTick(0); clearInterval(P.timer); P.timer = null; onEnd(); return; }
    onTick(P.timeLeft);
  }, 1000);
}

function fmtTime(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

// ============================================================
//  1. Hidden object
// ============================================================
function runHidden() {
  const d = P.diff;
  const nTargets = Math.min(4 + d, 8);
  const nDecoys = 26 + d * 5;
  const time = 80 - d * 5;
  const targets = shuffle(P.era.pool).slice(0, nTargets);
  const decoyPool = P.era.pool.filter(e => !targets.includes(e)).concat(DECOYS);
  const items = targets.map(e => ({ e, target: true }));
  for (let i = 0; i < nDecoys; i++) items.push({ e: decoyPool[Math.floor(Math.random() * decoyPool.length)], target: false });

  // Scatter with light overlap avoidance (percent coordinates)
  const placed = [];
  shuffle(items).forEach(it => {
    let best = null, bestDist = -1;
    for (let tries = 0; tries < 40; tries++) {
      const x = rand(4, 92), y = rand(6, 88);
      const dist = placed.reduce((m, p) => Math.min(m, Math.hypot((p.x - x) * 1.6, p.y - y)), 999);
      if (dist > bestDist) { best = { x, y }; bestDist = dist; }
      if (dist > 11) break;
    }
    placed.push(Object.assign(it, best, { size: rand(1.5, 2.6), rot: rand(-30, 30) }));
  });

  P.found = new Set();
  P.hintUsed = false;
  openStage(puzzleShell(P.puzzle.name,
    `<span class="timer" id="pTimer"></span><button class="btn small" id="hintBtn">💡 Hint (−10s)</button>`,
    `<div class="find-list" id="findList">${targets.map((e, i) => `<span class="find-item" data-i="${i}">${e}</span>`).join('')}</div>
     <div class="scene" id="scene" style="background:${P.era.bg}">
       ${placed.map((it, k) => `<button class="scene-obj" data-k="${k}" style="left:${it.x}%;top:${it.y}%;font-size:${it.size}rem;transform:translate(-50%,-50%) rotate(${it.rot}deg)">${it.e}</button>`).join('')}
     </div>`), P.era.bg);

  const timerEl = document.getElementById('pTimer');
  startCountdown(time, t => { timerEl.textContent = '⏱ ' + fmtTime(t); timerEl.classList.toggle('low', t <= 10); },
    () => finishPuzzle(false, `You found ${P.found.size} of ${targets.length} objects.`));

  document.querySelectorAll('.scene-obj').forEach(btn => {
    btn.onclick = () => {
      if (!P) return;
      const it = placed[+btn.dataset.k];
      const ti = targets.indexOf(it.e);
      if (it.target && !P.found.has(ti)) {
        P.found.add(ti);
        btn.classList.add('found');
        btn.disabled = true;
        document.querySelector(`.find-item[data-i="${ti}"]`).classList.add('done');
        if (P.found.size === targets.length) {
          puzzleTimeout(() => finishPuzzle(true, `Found everything with ${P.timeLeft}s to spare.`), 500);
        }
      } else if (!it.target) {
        P.timeLeft = Math.max(1, P.timeLeft - 3);
        timerEl.textContent = '⏱ ' + fmtTime(P.timeLeft);
        btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
      }
    };
  });

  document.getElementById('hintBtn').onclick = (ev) => {
    if (!P || P.hintUsed) return;
    const remaining = targets.map((e, i) => i).filter(i => !P.found.has(i));
    if (!remaining.length) return;
    P.hintUsed = true;
    ev.target.disabled = true;
    P.timeLeft = Math.max(1, P.timeLeft - 10);
    const k = placed.findIndex(it => it.target && it.e === targets[remaining[0]]);
    document.querySelector(`.scene-obj[data-k="${k}"]`).classList.add('hint');
  };
}

// ============================================================
//  2. Memory pairs
// ============================================================
function runMemory() {
  const d = P.diff;
  const pairs = Math.min(6 + d, 10);
  const symbols = shuffle(P.era.pool).slice(0, pairs);
  const deck = shuffle(symbols.concat(symbols));
  const time = 55 + pairs * 7 - d * 3;
  P.flipped = [];
  P.matched = 0;
  P.lock = false;
  P.moves = 0;
  const cols = deck.length <= 12 ? 4 : deck.length <= 16 ? 4 : 5;
  openStage(puzzleShell(P.puzzle.name,
    `<span class="muted" id="pMoves">Moves: 0</span><span class="timer" id="pTimer"></span>`,
    `<div class="memory-grid" style="grid-template-columns:repeat(${cols},1fr)">
      ${deck.map((e, i) => `<button class="mem-card" data-i="${i}"><span class="back">${P.era.icon}</span><span class="front">${e}</span></button>`).join('')}
    </div>`), P.era.bg);

  const timerEl = document.getElementById('pTimer');
  startCountdown(time, t => { timerEl.textContent = '⏱ ' + fmtTime(t); timerEl.classList.toggle('low', t <= 10); },
    () => finishPuzzle(false, `You matched ${P.matched} of ${pairs} pairs.`));

  document.querySelectorAll('.mem-card').forEach(card => {
    card.onclick = () => {
      if (!P || P.lock || card.classList.contains('up')) return;
      card.classList.add('up');
      P.flipped.push(card);
      if (P.flipped.length < 2) return;
      P.moves++;
      document.getElementById('pMoves').textContent = 'Moves: ' + P.moves;
      const [a, b] = P.flipped;
      if (deck[+a.dataset.i] === deck[+b.dataset.i]) {
        a.classList.add('matched'); b.classList.add('matched');
        P.flipped = [];
        P.matched++;
        if (P.matched === pairs) puzzleTimeout(() => finishPuzzle(true, `All pairs matched in ${P.moves} moves.`), 500);
      } else {
        P.lock = true;
        puzzleTimeout(() => { a.classList.remove('up'); b.classList.remove('up'); P.flipped = []; P.lock = false; }, 750);
      }
    };
  });
}

// ============================================================
//  3. Sliding tile — reassemble the artifact picture
// ============================================================
function runSlider() {
  const d = P.diff;
  const N = 3;
  const art = ARTIFACTS[P.puzzle.artifact];
  // board[pos] = tile id (0..7), 8 = empty
  let board = [...Array(N * N).keys()];
  let empty = N * N - 1;
  const neighbors = p => {
    const r = Math.floor(p / N), c = p % N, out = [];
    if (r > 0) out.push(p - N); if (r < N - 1) out.push(p + N);
    if (c > 0) out.push(p - 1); if (c < N - 1) out.push(p + 1);
    return out;
  };
  // Shuffle with legal moves so the puzzle is always solvable
  let prev = -1;
  const steps = 40 + d * 25;
  for (let i = 0; i < steps; i++) {
    const opts = neighbors(empty).filter(n => n !== prev);
    const pick = opts[Math.floor(Math.random() * opts.length)];
    [board[empty], board[pick]] = [board[pick], board[empty]];
    prev = empty; empty = pick;
  }
  if (board.every((t, i) => t === i)) { // extremely unlikely, but never start solved
    const pick = neighbors(empty)[0];
    [board[empty], board[pick]] = [board[pick], board[empty]];
    empty = pick;
  }
  P.moves = 0;
  const tile = Math.floor(Math.min(110, (Math.min(window.innerWidth, 520) - 64) / N));

  openStage(puzzleShell(P.puzzle.name,
    `<span class="muted" id="pMoves">Moves: 0</span><button class="btn small" id="peekBtn">👁 Peek</button>`,
    `<div class="slider-wrap">
       <div class="slider" id="slider" style="width:${tile * N}px;height:${tile * N}px"></div>
       <p class="muted">Reassemble the <b>${art.name}</b>.</p>
     </div>`), P.era.bg);

  const el = document.getElementById('slider');
  const draw = () => {
    el.innerHTML = board.map((t, pos) => {
      if (t === N * N - 1) return '';
      const r = Math.floor(pos / N), c = pos % N, tr = Math.floor(t / N), tc = t % N;
      return `<button class="slide-tile" data-pos="${pos}" style="width:${tile - 4}px;height:${tile - 4}px;left:${c * tile + 2}px;top:${r * tile + 2}px">
        <span class="slice" style="width:${tile * N}px;height:${tile * N}px;left:${-tc * tile - 2}px;top:${-tr * tile - 2}px;font-size:${tile * N * 0.78}px">${art.emoji}</span>
        <span class="tile-num">${t + 1}</span></button>`;
    }).join('');
    el.querySelectorAll('.slide-tile').forEach(b => {
      b.onclick = () => {
        if (!P) return;
        const pos = +b.dataset.pos;
        if (!neighbors(empty).includes(pos)) return;
        [board[empty], board[pos]] = [board[pos], board[empty]];
        empty = pos;
        P.moves++;
        document.getElementById('pMoves').textContent = 'Moves: ' + P.moves;
        draw();
        if (board.every((t, i) => t === i)) {
          el.classList.add('solved');
          el.innerHTML += `<div class="slider-done" style="font-size:${tile * N * 0.78}px">${art.emoji}</div>`;
          puzzleTimeout(() => finishPuzzle(true, `Restored in ${P.moves} moves.`), 900);
        }
      };
    });
  };
  draw();

  const peek = document.getElementById('peekBtn');
  const showPeek = on => el.classList.toggle('peek', on);
  peek.onmousedown = peek.ontouchstart = () => showPeek(true);
  peek.onmouseup = peek.onmouseleave = peek.ontouchend = () => showPeek(false);
  el.dataset.emoji = art.emoji;
  el.style.setProperty('--peek-size', `${tile * N * 0.78}px`);
}

// ============================================================
//  4. Rune lock — repeat the sequence
// ============================================================
function runSequence() {
  const d = P.diff;
  const runes = shuffle(P.era.pool).slice(0, 4);
  const rounds = 4 + Math.floor(d / 2);
  const startLen = 3;
  const speed = Math.max(380, 650 - d * 60);
  const colors = ['#e85d5d', '#4fa3e8', '#e8c84f', '#5dc98a'];
  P.seq = [];
  for (let i = 0; i < startLen + rounds - 1; i++) P.seq.push(Math.floor(Math.random() * 4));
  P.round = 0;
  P.lives = 3;
  P.input = [];
  P.accepting = false;

  openStage(puzzleShell(P.puzzle.name,
    `<span id="pLives">❤️❤️❤️</span><span class="muted" id="pRound"></span>`,
    `<div class="rune-wrap">
       <p class="rune-status" id="runeStatus">Watch closely...</p>
       <div class="rune-grid">
         ${runes.map((r, i) => `<button class="rune" data-i="${i}" style="--c:${colors[i]}">${r}</button>`).join('')}
       </div>
     </div>`), P.era.bg);

  const status = document.getElementById('runeStatus');
  const pads = [...document.querySelectorAll('.rune')];
  const flash = (i, ms) => { pads[i].classList.add('lit'); puzzleTimeout(() => pads[i].classList.remove('lit'), ms); };

  const playRound = () => {
    P.accepting = false;
    P.input = [];
    const len = startLen + P.round;
    document.getElementById('pRound').textContent = `Round ${P.round + 1}/${rounds}`;
    status.textContent = 'Watch closely...';
    pads.forEach(p => p.disabled = true);
    for (let k = 0; k < len; k++) puzzleTimeout(() => flash(P.seq[k], speed * 0.7), 600 + k * speed);
    puzzleTimeout(() => {
      P.accepting = true;
      pads.forEach(p => p.disabled = false);
      status.textContent = 'Your turn — repeat the runes!';
    }, 600 + len * speed);
  };

  pads.forEach(pad => {
    pad.onclick = () => {
      if (!P || !P.accepting) return;
      const i = +pad.dataset.i;
      flash(i, 220);
      P.input.push(i);
      const k = P.input.length - 1;
      if (P.seq[k] !== i) {
        P.lives--;
        document.getElementById('pLives').textContent = '❤️'.repeat(P.lives) + '🖤'.repeat(3 - P.lives);
        P.accepting = false;
        if (P.lives <= 0) { puzzleTimeout(() => finishPuzzle(false, `The lock sealed shut on round ${P.round + 1}.`), 500); return; }
        status.textContent = '✖ Wrong rune! Watch again...';
        puzzleTimeout(playRound, 1100);
        return;
      }
      if (P.input.length === startLen + P.round) {
        P.accepting = false;
        P.round++;
        if (P.round >= rounds) { status.textContent = '✔ The lock clicks open!'; puzzleTimeout(() => finishPuzzle(true, `Unlocked with ${P.lives} chance${P.lives === 1 ? '' : 's'} left.`), 700); return; }
        status.textContent = '✔ Correct!';
        puzzleTimeout(playRound, 900);
      }
    };
  });
  playRound();
}
