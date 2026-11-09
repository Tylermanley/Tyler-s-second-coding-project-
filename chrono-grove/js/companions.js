// ============================================================
//  Chrono Grove — companions: Anna & Cedric (support, romance, VN scenes)
// ============================================================

const L = (who, expr, text) => ({ who, expr, text });
const N = text => ({ who: 'narr', text });

const COMPANIONS = {
  anna: {
    name: 'Anna', title: 'Archivist of the Chrono Library', home: '📚 Chrono Library', icon: '📚',
    color: '#3c8c86', bg: 'linear-gradient(160deg,#3b2a4f 0%,#7a5a8c 55%,#e0b98f 100%)',
    loves: ['blossom', 'pumpkin'], likes: ['wheat', 'carrot'],
    perks: [
      { h: 0, text: 'Stores everything that doesn\'t fit in your satchel. Gives live boss hints in battle.' },
      { h: 3, text: 'Anna\'s Remedy: once per battle, heals 30% HP and cleanses ailments.' },
      { h: 4, text: 'Enchanted pockets: satchel holds +5 items.' },
      { h: 6, text: 'Anna\'s Ward: start every turn with +4 Block.' },
      { h: 8, text: 'Ready for a Chrono Locket 💍.' },
      { h: 'partner', text: 'Partner: Remedy heals 50%, +5 satchel space, and a potion every morning.' },
    ],
    meet: [
      N('A bell chimes as you push open the door of the old library at the edge of the village.'),
      L('anna', 'surprised', 'Oh! A visitor? Nobody\'s come in here since… um, sorry. Hello!'),
      L('anna', 'smile', 'I\'m Anna. I look after the Chrono Library. Your great-aunt used to bring me the strangest books… from other centuries.'),
      L('anna', 'happy', 'You have her pocket watch! Then you\'ll be travelling too. Please, let me help!'),
      L('anna', 'smile', 'Your satchel can only hold so much. Anything that doesn\'t fit, I\'ll catalogue and keep safe in the archive. Potions, crops, all of it.'),
      L('anna', 'determined', 'And I\'ve studied every guardian in the old chronicles. Bring me to a battle and I\'ll tell you exactly what they\'re about to do!'),
    ],
    talk: {
      low: [
        ['smile', 'I reorganised the history section today. Egypt is next to Greece now, which feels… correct, somehow.'],
        ['neutral', 'Did you know hieroglyphs can be read in different directions? The figures always face the start of the line.'],
        ['blush', 'Oh! You startled me. I was, um, reading. Not daydreaming. Definitely reading.'],
      ],
      mid: [
        ['happy', 'I saved you a cup of tea! It\'s probably cold now… I made it three hours ago, just in case you stopped by.'],
        ['smile', 'Every time you come back through a rift, I check you for scratches. It\'s the librarian in me. I like things… intact.'],
        ['blush', 'I started a new entry in the archive today. It\'s titled "Remarkable People". There\'s only one name in it so far.'],
      ],
      high: [
        ['blush', 'When you\'re gone through the portal, the library feels so quiet. I never minded quiet before I met you.'],
        ['happy', 'I pressed a petal from your farm into my favourite book. Now it\'s my favourite book for two reasons.'],
        ['smile', 'I used to only read about adventures. Now I get to hear about real ones… from you.'],
      ],
      love: [
        ['blush', 'Sometimes I catch myself writing your name in the margins. I\'m a librarian! Writing in books is a crime!'],
        ['happy', 'Whatever era you\'re lost in, I\'ll be right here. Always.'],
        ['happy', 'I catalogued our future today: "Volume One: Forever." Shelved right next to my heart.'],
      ],
      again: ['smile', 'Back again? Not that I mind! I just… don\'t have anything new to say yet. Come see me tomorrow?'],
    },
    events: {
      2: [
        N('You find Anna on a tall ladder, reaching for a book on the highest shelf.'),
        L('anna', 'surprised', 'Ah—! The ladder—!'),
        N('She wobbles and falls. You catch her just in time.'),
        L('anna', 'blush', 'Th-thank you. I, um… you can put me down now. …Or in a minute. Whichever.'),
        L('anna', 'happy', 'I\'m giving you a lifetime library card! It\'s the highest honour I have!'),
      ],
      4: [
        L('anna', 'smile', 'I\'ve been working on something for you. Hold out your satchel?'),
        L('anna', 'happy', 'I sewed in extra pockets, enchanted with archive magic. Now you can carry five more things!'),
        L('anna', 'blush', 'I also stitched a little heart inside one of them. You don\'t have to look for it. Please don\'t look for it.'),
        N('✨ Satchel capacity +5!'),
      ],
      6: [
        N('Late at night, candlelight glows in the library window. Anna is asleep at her desk, surrounded by notes about the guardians.'),
        L('anna', 'surprised', 'Hm…? Oh! You\'re here! I was researching protective wards. For you.'),
        L('anna', 'determined', 'From now on, when I fight beside you, I\'ll weave a ward around you every turn. Nothing\'s hurting you on my watch.'),
        L('anna', 'blush', 'Because… you matter to me. More than any book ever has.'),
        N('✨ Anna\'s Ward unlocked: +4 Block every turn when she supports you.'),
      ],
      8: [
        L('anna', 'blush', 'Can I tell you something? I\'ve read thousands of love stories.'),
        L('anna', 'smile', 'I always skipped to the last page, just to see if they found each other in the end.'),
        L('anna', 'happy', 'With you… I don\'t want to skip a single page.'),
        N('💗 Anna\'s heart is full. A Chrono Locket from the Market would mean the world to her.'),
      ],
    },
    gift: {
      love: ['happy', 'For me? Oh, it\'s perfect! I\'m going to sketch it before I do anything else!'],
      like: ['smile', 'How thoughtful! Thank you, really.'],
      neutral: ['smile', 'Oh, thank you! I\'ll find a good use for it.'],
      again: ['blush', 'You already gave me something today! Spoil me tomorrow, okay?'],
    },
    propose: [
      N('You hold out the Chrono Locket. Inside, two tiny clock hands point to the same moment.'),
      L('anna', 'surprised', 'Is that… is that for me?'),
      L('anna', 'blush', 'I\'ve read this scene a hundred times. I never imagined I\'d get to be in one.'),
      L('anna', 'happy', 'Yes! Yes, of course, yes! Let\'s write the rest of the story together!'),
      N('💍 You and Anna are now partners! She moves into the homestead, and she gives you the card "Lovers\' Promise".'),
    ],
    morning: 'Good morning, love! I tucked a potion into your things. Be careful out there!',
    battleStart: 'I\'m right here! I\'ll read its every move for you.',
    battleWin: 'You did it! I\'m writing this into the chronicles right now!',
    battleLose: 'It\'s okay… we\'ll study it together and try again.',
  },
  cedric: {
    name: 'Cedric', title: 'Captain of the Gilded Gull', home: '⚓ The Gilded Gull', icon: '⚓',
    color: '#1f2d5a', bg: 'linear-gradient(160deg,#16324f 0%,#2f6f9a 55%,#f3c27c 100%)',
    loves: ['grape', 'melon'], likes: ['wheat', 'pumpkin'],
    perks: [
      { h: 0, text: 'Forges a battle card for every puzzle you solve and sells rare cards. As support, you draw +1 card each turn.' },
      { h: 3, text: 'Broadside: once per battle, the Gull\'s cannons deal 2.5× ATK, ignoring DEF.' },
      { h: 'shop', text: 'More hearts unlock rarer cards in his shop.' },
      { h: 6, text: 'First Mate: +1 CP on your first turn.' },
      { h: 8, text: 'Ready for a Chrono Locket 💍.' },
      { h: 'partner', text: 'Partner: Broadside deals 4× ATK, and +30 coins every morning from his voyages.' },
    ],
    meet: [
      N('At the village dock, a ship with golden sails creaks against the pier. Someone swings down from the rigging and lands beside you.'),
      L('cedric', 'smirk', 'Well now! You must be the new keeper of the grove. Captain Cedric, of the Gilded Gull, at your service.'),
      L('cedric', 'smile', 'I trade in rare goods across every sea… and, between us, across a few centuries too.'),
      L('cedric', 'happy', 'Your great-aunt and I had a deal. She found relics, and I made her these. Battle cards!'),
      L('cedric', 'determined', 'Each card holds the power of a moment in history. Against those guardians, cards are your sword and your shield.'),
      L('cedric', 'smirk', 'Here\'s a starter deck, on the house. Solve puzzles out there and I\'ll forge a new card from everything you discover. Fair winds, partner!'),
    ],
    talk: {
      low: [
        ['smirk', 'The tide\'s good today. So is the company, now that you\'re here.'],
        ['smile', 'Bought a crate of "authentic Roman spoons" yesterday. Turns out they\'re from next Tuesday. Time trading is risky business.'],
        ['neutral', 'A captain\'s first rule: never sail without a full deck. Of cards, I mean. Also crew.'],
      ],
      mid: [
        ['happy', 'You should\'ve seen the Gull\'s figurehead blush when you walked up. Or maybe that was me. Hard to say.'],
        ['smirk', 'I\'ve sailed every sea in seven centuries and I still can\'t predict your next move. I like that.'],
        ['smile', 'I had a card printed with your face on it. Strictly for, ah, inventory purposes.'],
      ],
      high: [
        ['blush', 'I used to chase horizons. Lately I keep finding reasons to drop anchor right here.'],
        ['smile', 'When you\'re out fighting, I keep your spot at the helm warm. Come back to it, alright?'],
        ['happy', 'The crew calls you "the Captain\'s Compass" now. Because apparently I always point toward you. Mutinous lot.'],
      ],
      love: [
        ['blush', 'I\'ve traded gold, gems and lost treasures. Never found anything worth more than you.'],
        ['happy', 'Every voyage I bring you back a souvenir. My cabin\'s running out of room. Worth it.'],
        ['smile', 'Whatever century you sail into, I\'ll find you. That\'s a captain\'s promise.'],
      ],
      again: ['smirk', 'Twice in one day? Careful, people will talk. Come back tomorrow, I\'ll have new stories.'],
    },
    events: {
      2: [
        N('Cedric is on the deck of the Gilded Gull, wrestling with a tangled sail in a gusting wind.'),
        L('cedric', 'surprised', 'Ah, perfect timing! Grab that line, would you?'),
        N('Together you haul the sail into place.'),
        L('cedric', 'happy', 'Ha! A natural sailor. I might have to make you first mate.'),
        L('cedric', 'smirk', 'Benefits include terrible pay, worse food and excellent company. Mine, specifically.'),
      ],
      4: [
        L('cedric', 'smile', 'I\'ve been saving my best stock for my best customer.'),
        L('cedric', 'smirk', 'Freeze Time cards. Pricey, rare and dangerous. I wouldn\'t sell them to just anyone.'),
        L('cedric', 'blush', 'You\'re not just anyone, though. …Forget I said that. Bad for business.'),
        N('✨ Freeze Time is now in Cedric\'s shop.'),
      ],
      6: [
        N('At sunset, Cedric shows you a battered map pinned to the wall of his cabin.'),
        L('cedric', 'neutral', 'My first voyage. I was alone out there for years. Every port felt the same.'),
        L('cedric', 'smile', 'Then I started docking here, and suddenly the port became the best part of the journey.'),
        L('cedric', 'determined', 'Next time we face a guardian, I\'ll be ready from the very first turn. Count on it.'),
        N('✨ First Mate unlocked: +1 CP on your first turn when Cedric supports you.'),
      ],
      8: [
        L('cedric', 'blush', 'I\'m not good with words unless I\'m haggling.'),
        L('cedric', 'smile', 'So I\'ll say it plain. When I look at the horizon now… I\'m hoping you\'re on it.'),
        N('💗 Cedric\'s heart is full. A Chrono Locket from the Market would mean everything to him.'),
      ],
    },
    gift: {
      love: ['happy', 'Now THAT is premium cargo! You know the way to a captain\'s heart.'],
      like: ['smile', 'Fine goods! I\'ll stow them in my personal hold.'],
      neutral: ['smirk', 'A gift from you? I\'d treasure a pebble, honestly. Thank you.'],
      again: ['smirk', 'Another gift? You\'ll sink my ship with kindness. Tomorrow, alright?'],
    },
    propose: [
      N('You hold out the Chrono Locket. Inside, two tiny clock hands point to the same moment.'),
      L('cedric', 'surprised', 'A locket? For… me?'),
      L('cedric', 'blush', 'I\'ve crossed oceans and centuries hunting treasure. Never thought one would come looking for me.'),
      L('cedric', 'happy', 'Aye! A thousand times aye! The Gilded Gull has a new co-captain!'),
      N('💍 You and Cedric are now partners! He drops anchor at the homestead for good, and he gives you the card "Lovers\' Promise".'),
    ],
    morning: 'Morning, love. Sold some cargo at dawn, so the profits are in the coin jar.',
    battleStart: 'Cards ready? Let\'s show this brute how a real crew fights!',
    battleWin: 'Victory! Drinks are on the Gull tonight!',
    battleLose: 'We\'ll regroup, refit the deck and sail back stronger.',
    quips: ['Play it like you mean it!', 'Ha! That\'s my partner.', 'Steady… wait for the right card.', 'I\'ve seen worse odds. Not many, but some.', 'A good captain knows when to raise the shields.', 'Here, an extra card from my sleeve. Don\'t tell anyone.'],
  },
};

const HEART_EVENTS = [2, 4, 6, 8];
let compView = 'main';

// ---------- visual-novel dialogue ----------
let DLG = null;

function playScene(lines, onDone) {
  DLG = { lines, i: -1, onDone, timer: null, who: null, full: '' };
  const el = document.getElementById('dialogue');
  el.classList.add('open');
  el.onclick = advanceScene;
  advanceScene();
}

function advanceScene() {
  if (!DLG) return;
  if (DLG.timer) { finishTyping(); return; }
  DLG.i++;
  if (DLG.i >= DLG.lines.length) {
    const done = DLG.onDone;
    DLG = null;
    const el = document.getElementById('dialogue');
    el.classList.remove('open');
    el.innerHTML = '';
    if (done) done();
    return;
  }
  renderLine();
}

function renderLine() {
  const ln = DLG.lines[DLG.i];
  const c = COMPANIONS[ln.who];
  const el = document.getElementById('dialogue');
  if (c) DLG.bg = c.bg;
  const entering = c && DLG.who !== ln.who;
  const lively = ln.expr === 'surprised' || ln.expr === 'happy';
  el.innerHTML = `
    <div class="dlg-bg" style="background:${DLG.bg || 'linear-gradient(160deg,#2f5d3a,#1b3524)'}"></div>
    <div class="dlg-motes"></div>
    ${lively ? '<div class="speedlines"></div>' : ''}
    ${c ? `<div class="dlg-portrait ${entering ? 'enter' : ''} ${lively ? 'hop' : ''}">${portraitSVG(ln.who, ln.expr, { talking: true })}</div>` : ''}
    <div class="dlg-box ${c ? '' : 'narr'}">
      ${c ? `<div class="dlg-name" style="background:${c.color}">${c.name}</div>` : ''}
      <div class="dlg-text" id="dlgText"></div>
      <div class="dlg-next">▼</div>
    </div>
    <button class="dlg-skip" onclick="event.stopPropagation(); skipScene()">Skip ⏩</button>`;
  if (c) DLG.who = ln.who;
  DLG.full = ln.text;
  let n = 0;
  const textEl = document.getElementById('dlgText');
  DLG.timer = setInterval(() => {
    n += 2;
    textEl.textContent = DLG.full.slice(0, n);
    if (n >= DLG.full.length) finishTyping();
  }, 28);
}

function finishTyping() {
  if (!DLG) return;
  clearInterval(DLG.timer);
  DLG.timer = null;
  const t = document.getElementById('dlgText');
  if (t) t.textContent = DLG.full;
  const p = document.querySelector('.dlg-portrait .portrait');
  if (p) p.classList.remove('talking');
}

function skipScene() {
  if (!DLG) return;
  finishTyping();
  DLG.i = DLG.lines.length;
  advanceScene();
}

// ---------- romance logic ----------
function talkTier(who) {
  const h = hearts(who);
  if (S.partner === who || h >= 9) return 'love';
  if (h >= 6) return 'high';
  if (h >= 3) return 'mid';
  return 'low';
}

function heartPopup(who, gained, pts) {
  floatHearts();
  const h = hearts(who);
  toast(`💗 ${COMPANIONS[who].name} +${pts} affection${gained ? ` — <b>${h} ♥!</b>` : ''}`);
}

function floatHearts() {
  for (let i = 0; i < 7; i++) {
    const f = document.createElement('div');
    f.className = 'heart-float';
    f.textContent = ['💗', '💖', '💕'][i % 3];
    f.style.left = `${40 + Math.random() * 20}%`;
    f.style.animationDelay = `${i * 0.08}s`;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 2000);
  }
}

function meetCompanion(who, onDone) {
  S.rel[who].met = true;
  saveGame();
  playScene(COMPANIONS[who].meet, () => { renderAll(); if (onDone) onDone(); });
}

function talkTo(who) {
  resetDailyIfNeeded();
  const c = COMPANIONS[who];
  if (!S.rel[who].met) return meetCompanion(who);
  const ev = HEART_EVENTS.find(t => hearts(who) >= t && !S.rel[who].events.includes(t));
  if (ev) {
    S.rel[who].events.push(ev);
    saveGame();
    return playScene(c.events[ev], () => renderAll());
  }
  if (S.daily.talked[who]) {
    const [e, t] = c.talk.again;
    return playScene([L(who, e, t)]);
  }
  const pool = c.talk[talkTier(who)];
  const [e, t] = pool[Math.floor(Math.random() * pool.length)];
  S.daily.talked[who] = true;
  const gained = addAffection(who, 6);
  saveGame();
  playScene([L(who, e, t)], () => { heartPopup(who, gained, 6); renderAll(); });
}

function openGiftPicker(who) {
  resetDailyIfNeeded();
  const c = COMPANIONS[who];
  if (S.daily.gifted[who]) { const [e, t] = c.gift.again; return playScene([L(who, e, t)]); }
  const ids = Object.keys(CROPS).filter(id => totalOf('produce', id) > 0);
  openStage(`
    <div class="stage-card intro" style="--era:${c.color}">
      <div class="gift-head">${portraitSVG(who, 'smile', { crop: 'head' })}</div>
      <h2>🎁 Gift for ${c.name}</h2>
      ${ids.length ? `<div class="gift-grid">${ids.map(id => {
        const pref = c.loves.includes(id) ? '💖 Loves' : c.likes.includes(id) ? '😊 Likes' : '';
        return `<button class="pick" onclick="giveGift('${who}','${id}')">${CROPS[id].emoji} ${CROPS[id].name} <b>×${totalOf('produce', id)}</b><small>${pref || '&nbsp;'}</small></button>`;
      }).join('')}</div>` : '<p class="muted">You have no crops to give. Harvest something from your homestead first!</p>'}
      <p class="muted small">One gift per day. Hint: ${c.name} loves ${c.loves.map(id => CROPS[id].emoji + ' ' + CROPS[id].name).join(' and ')}.</p>
      <div class="btn-row"><button class="btn ghost" onclick="closeStage()">Cancel</button></div>
    </div>`, c.bg);
}

function giveGift(who, cropId) {
  const c = COMPANIONS[who];
  if (!takeFrom('produce', cropId)) return;
  const level = c.loves.includes(cropId) ? 'love' : c.likes.includes(cropId) ? 'like' : 'neutral';
  const pts = { love: 30, like: 18, neutral: 10 }[level];
  S.daily.gifted[who] = true;
  const gained = addAffection(who, pts);
  saveGame();
  closeStage();
  const [e, t] = c.gift[level];
  playScene([N(`You give ${c.name} a ${CROPS[cropId].emoji} ${CROPS[cropId].name}.`), L(who, e, t)], () => { heartPopup(who, gained, pts); renderAll(); });
}

function canPropose(who) { return !S.partner && hearts(who) >= 8 && S.locket > 0; }

function proposeTo(who) {
  if (!canPropose(who)) return;
  S.locket--;
  S.partner = who;
  addAffection(who, 20);
  grantCard('promise');
  saveGame();
  playScene(COMPANIONS[who].propose, () => { floatHearts(); renderAll(); });
}

function setSupport(who) {
  S.support = S.support === who ? null : who;
  saveGame();
  renderAll();
}

function perkUnlocked(who, p) {
  if (p.h === 'partner') return S.partner === who;
  if (p.h === 'shop') return true;
  return hearts(who) >= p.h;
}

function heartRow(who) {
  const h = hearts(who);
  const frac = (S.rel[who].pts % 10) / 10;
  return `<div class="hearts" title="${S.rel[who].pts}/100 affection">${[...Array(10)].map((_, i) =>
    `<span class="heart ${i < h ? 'on' : ''}">${i < h ? '♥' : '♡'}</span>`).join('')}
    ${h < 10 ? `<span class="heart-progress"><span style="width:${frac * 100}%"></span></span>` : ''}</div>`;
}

// ---------- companions tab ----------
function renderCompanions() {
  const view = document.getElementById('view-town');
  if (compView === 'library') return renderLibrary(view);
  if (compView === 'ship') return renderShip(view);
  resetDailyIfNeeded();
  view.innerHTML = `
    <h2 class="view-title">💞 Companions</h2>
    <p class="muted center">Bring one companion into each boss battle as support. Talk every day, give gifts, and fight side by side to grow closer.</p>
    <div class="comp-list">
      ${Object.entries(COMPANIONS).map(([who, c]) => {
        const met = S.rel[who].met;
        const expr = S.partner === who ? 'blush' : hearts(who) >= 6 ? 'happy' : CHAR_STYLE[who].defaultExpr;
        return `
        <div class="comp-card" style="--c:${c.color}">
          <div class="comp-scene" style="background:${c.bg}">
            <div class="comp-portrait ${met ? '' : 'silhouette'}">${portraitSVG(who, expr)}</div>
            ${S.support === who ? '<span class="comp-badge">🤝 Support</span>' : ''}
            ${S.partner === who ? '<span class="comp-badge partner">💍 Partner</span>' : ''}
          </div>
          <div class="comp-info">
            <h3>${met ? c.name : '???'} <small class="muted">${c.title}</small></h3>
            ${met ? heartRow(who) : `<p class="muted">Visit the ${c.home.slice(2)} to meet them.</p>`}
            ${met ? `<ul class="perks">${c.perks.map(p => `<li class="${perkUnlocked(who, p) ? 'on' : ''}">${perkUnlocked(who, p) ? '✔' : (p.h === 'partner' ? '💍' : `${p.h}♥`)} ${p.text}</li>`).join('')}</ul>` : ''}
            <div class="comp-actions">
              ${met ? `
                <button class="btn small" onclick="talkTo('${who}')">💬 Talk${S.daily.talked[who] ? ' ✓' : ''}</button>
                <button class="btn small" onclick="openGiftPicker('${who}')">🎁 Gift${S.daily.gifted[who] ? ' ✓' : ''}</button>
                <button class="btn small primary" onclick="compView='${who === 'anna' ? 'library' : 'ship'}';renderAll()">${who === 'anna' ? '📚 Visit Library' : '⚓ Board the Gull'}</button>
                <button class="btn small ${S.support === who ? 'danger' : ''}" onclick="setSupport('${who}')">${S.support === who ? 'Remove support' : '🤝 Set as support'}</button>
                ${canPropose(who) ? `<button class="btn small love" onclick="proposeTo('${who}')">💍 Give Chrono Locket</button>` : ''}
              ` : `<button class="btn primary" onclick="meetCompanion('${who}')">${c.icon} Meet ${c.name}</button>`}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function backBar(who, line) {
  const c = COMPANIONS[who];
  return `
    <div class="place-head" style="background:${c.bg}">
      <button class="btn small ghost" onclick="compView='main';renderAll()">← Back</button>
      <div class="place-portrait">${portraitSVG(who, CHAR_STYLE[who].defaultExpr, { crop: 'bust' })}</div>
      <div class="bubble"><b>${c.name}:</b> ${line}</div>
    </div>`;
}

function renderLibrary(view) {
  const rows = [];
  Object.entries(SHOP_ITEMS).forEach(([id, it]) => { if (totalOf('items', id)) rows.push({ kind: 'items', id, label: `${it.emoji} ${it.name}` }); });
  Object.entries(CROPS).forEach(([id, c]) => { if (totalOf('produce', id)) rows.push({ kind: 'produce', id, label: `${c.emoji} ${c.name}` }); });
  const vault = unplacedArtifacts();
  const full = satchelCount() >= satchelCap();
  view.innerHTML = `
    ${backBar('anna', S.partner === 'anna' ? 'Welcome home, love! Everything\'s catalogued just the way you like it.' : 'Welcome to the archive! Your belongings are safe with me.')}
    <div class="market-grid">
      <section class="panel">
        <h3>🎒 Satchel <span class="muted">${satchelCount()} / ${satchelCap()}</span></h3>
        <div class="progress small-bar"><div style="width:${Math.min(100, satchelCount() / satchelCap() * 100)}%"></div></div>
        <p class="muted small">Only items in your satchel can be used in battle. Anything that won't fit comes straight here to the archive.</p>
        ${rows.length ? `<table class="store-table"><tr><th>Item</th><th>Satchel</th><th>Archive</th><th></th></tr>
          ${rows.map(r => `<tr><td>${r.label}</td><td>${S[r.kind][r.id] || 0}</td><td>${S.library[r.kind][r.id] || 0}</td>
            <td><button class="btn small" ${(S[r.kind][r.id] || 0) ? '' : 'disabled'} onclick="moveStore('${r.kind}','${r.id}','in')">Store ➜</button>
                <button class="btn small" ${(S.library[r.kind][r.id] || 0) && !full ? '' : 'disabled'} onclick="moveStore('${r.kind}','${r.id}','out')">⬅ Take</button></td></tr>`).join('')}
        </table>
        <div class="btn-row"><button class="btn small" onclick="storeAllProduce()">Store all crops</button></div>` : '<p class="muted">Nothing stored yet.</p>'}
      </section>
      <section class="panel">
        <h3>📜 Anna's Guardian Notes</h3>
        <p class="muted small">Anna's research on every guardian you've found so far.</p>
        ${ERAS.filter(e => eraUnlocked(e)).map(e => `
          <details class="hint-box" ${S.bosses[e.id] ? '' : 'open'}>
            <summary>${e.boss.emoji} ${e.boss.name} ${S.bosses[e.id] ? '✅' : ''}</summary>
            <ul>${BOSS_HINTS[e.id].map(h => `<li>${h}</li>`).join('')}</ul>
          </details>`).join('')}
      </section>
      <section class="panel">
        <h3>🏺 Artifacts in Storage</h3>
        ${vault.length ? `<ul class="sell-list">${vault.map(id => `<li>${ARTIFACTS[id].emoji} ${ARTIFACTS[id].name} <small class="muted">${bonusText(ARTIFACTS[id].bonus)}</small></li>`).join('')}</ul>
          <p class="muted small">Display these on your homestead to activate them.</p>` : '<p class="muted">No artifacts in storage. Everything you\'ve found is on display!</p>'}
      </section>
    </div>`;
}

function moveStore(kind, id, dir) {
  if (dir === 'in') {
    if (!S[kind][id]) return;
    S[kind][id]--;
    S.library[kind][id] = (S.library[kind][id] || 0) + 1;
  } else {
    if (!S.library[kind][id] || satchelCount() >= satchelCap()) return;
    S.library[kind][id]--;
    S[kind][id] = (S[kind][id] || 0) + 1;
  }
  saveGame(); renderAll();
}

function storeAllProduce() {
  for (const id in S.produce) {
    S.library.produce[id] = (S.library.produce[id] || 0) + S.produce[id];
    S.produce[id] = 0;
  }
  saveGame(); renderAll();
}

function renderShip(view) {
  const h = hearts('cedric');
  const st = stats();
  const owned = Object.keys(CARDS).filter(id => S.cards[id]);
  view.innerHTML = `
    ${backBar('cedric', S.partner === 'cedric' ? 'Welcome aboard, co-captain. Take whatever you need.' : 'Welcome aboard the Gilded Gull! Finest cards in seven centuries.')}
    <section class="panel">
      <h3>🃏 Cedric's Card Shop <span class="muted">🪙 ${S.coins}</span></h3>
      <div class="card-row">
        ${SHOP_CARDS.map(sc => {
          const locked = h < sc.hearts;
          return `<div class="shop-card ${locked ? 'locked' : ''}">
            ${cardHTML(sc.id, { st })}
            ${locked ? `<button class="btn small" disabled>🔒 ${sc.hearts}♥</button>`
              : `<button class="btn small primary" ${S.coins < sc.price ? 'disabled' : ''} onclick="buyCard('${sc.id}',${sc.price})">🪙 ${sc.price}</button>`}
          </div>`;
        }).join('')}
      </div>
    </section>
    <section class="panel deck-panel">
      <h3>📦 Your Deck <span class="muted">${deckSize()} cards (min ${DECK_MIN}, max ${DECK_MAX})</span></h3>
      <p class="muted small">Each turn in battle you draw 5 cards and get 3 Chrono Points (CP) to play them. Solve new puzzles to have Cedric forge more cards for you.</p>
      <div class="card-row">
        ${owned.map(id => `<div class="deck-card">
          ${cardHTML(id, { st, count: S.cards[id] })}
          <div class="deck-ctrl">
            <button class="btn small" ${(S.deck[id] || 0) <= 0 || deckSize() <= DECK_MIN ? 'disabled' : ''} onclick="deckAdjust('${id}',-1)">−</button>
            <span>In deck: <b>${S.deck[id] || 0}</b></span>
            <button class="btn small" ${(S.deck[id] || 0) >= S.cards[id] || deckSize() >= DECK_MAX ? 'disabled' : ''} onclick="deckAdjust('${id}',1)">+</button>
          </div></div>`).join('')}
      </div>
    </section>`;
}

function buyCard(id, price) {
  if (S.coins < price) return;
  S.coins -= price;
  grantCard(id);
  toast(`🃏 Cedric hands you <b>${CARDS[id].name}</b>. "Pleasure doing business!"`);
  saveGame(); renderAll();
}

function deckAdjust(id, d) {
  const cur = S.deck[id] || 0;
  if (d > 0 && (cur >= S.cards[id] || deckSize() >= DECK_MAX)) return;
  if (d < 0 && (cur <= 0 || deckSize() <= DECK_MIN)) return;
  S.deck[id] = cur + d;
  saveGame(); renderAll();
}
