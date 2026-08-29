// Dollhouse SPA — vanilla JS, hash-routed views rendered into #viewRoot.

const VIBE_OPTIONS = [
  { id: 'minimalist', label: 'Minimalist', emoji: '⚪' },
  { id: 'boho', label: 'Boho', emoji: '🌾' },
  { id: 'glam', label: 'Glam', emoji: '✨' },
  { id: 'cozy', label: 'Cozy', emoji: '☁️' },
  { id: 'modern', label: 'Modern', emoji: '◼️' },
  { id: 'vintage', label: 'Vintage', emoji: '🎀' },
  { id: 'coastal', label: 'Coastal', emoji: '🌊' },
  { id: 'edgy', label: 'Edgy', emoji: '🖤' },
];
const PALETTE_OPTIONS = [
  { id: 'neutral', label: 'Neutral', emoji: '🤍' },
  { id: 'pastel', label: 'Pastel', emoji: '🎨' },
  { id: 'bold', label: 'Bold', emoji: '🔴' },
  { id: 'monochrome', label: 'Monochrome', emoji: '⚫' },
];
const FOCUS_OPTIONS = [
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'home', label: 'Home Decor', emoji: '🏠' },
  { id: 'both', label: 'Both!', emoji: '💖' },
];
const BUDGET_OPTIONS = [
  { id: 'budget', label: 'Budget-friendly', emoji: '💵' },
  { id: 'mid', label: 'Mid-range', emoji: '💳' },
  { id: 'luxury', label: 'Luxury', emoji: '💎' },
];
// Hand-drawn-style pink dollhouse illustration, inline SVG so no image assets are needed.
const DOLLHOUSE_SVG = `
<svg class="dollhouse-svg" viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a pink dollhouse">
  <ellipse cx="160" cy="278" rx="118" ry="14" fill="rgba(201,75,120,0.13)" />
  <rect x="222" y="66" width="20" height="54" rx="2" fill="#c94b78" />
  <rect x="217" y="60" width="30" height="10" rx="2" fill="#a83a63" />
  <polygon points="34,122 160,36 286,122" fill="#f3b8cf" stroke="#c94b78" stroke-width="4" stroke-linejoin="round" />
  <rect x="30" y="116" width="260" height="12" rx="6" fill="#c94b78" />
  <rect x="58" y="126" width="204" height="146" rx="10" fill="#fdf3f6" stroke="#f3b8cf" stroke-width="4" />
  <path d="M160 66 c-9,-11 -26,-4 -24,11 c1,10 15,18 24,26 c9,-8 23,-16 24,-26 c2,-15 -15,-22 -24,-11z" fill="#b9a6e8" />
  <rect x="83" y="160" width="48" height="48" rx="6" fill="#f1ecfb" stroke="#d4af37" stroke-width="3" />
  <line x1="107" y1="160" x2="107" y2="208" stroke="#d4af37" stroke-width="3" />
  <line x1="83" y1="184" x2="131" y2="184" stroke="#d4af37" stroke-width="3" />
  <rect x="189" y="160" width="48" height="48" rx="6" fill="#f1ecfb" stroke="#d4af37" stroke-width="3" />
  <line x1="213" y1="160" x2="213" y2="208" stroke="#d4af37" stroke-width="3" />
  <line x1="189" y1="184" x2="237" y2="184" stroke="#d4af37" stroke-width="3" />
  <rect x="80" y="208" width="54" height="9" rx="4" fill="#e8779f" />
  <rect x="186" y="208" width="54" height="9" rx="4" fill="#e8779f" />
  <path d="M130 198 q30,-24 60,0 z" fill="#d4af37" />
  <rect x="139" y="198" width="42" height="74" rx="19" fill="#e8779f" stroke="#c94b78" stroke-width="3" />
  <circle cx="171" cy="237" r="3" fill="#fff" />
  <g transform="translate(160,36)">
    <circle cx="-9" cy="0" r="9" fill="#c94b78" />
    <circle cx="9" cy="0" r="9" fill="#c94b78" />
    <circle cx="0" cy="0" r="5.5" fill="#fdf3f6" />
  </g>
</svg>`;

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', emoji: '📸', placeholder: 'yourhandle' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵', placeholder: 'yourhandle' },
  { id: 'pinterest', label: 'Pinterest', emoji: '📌', placeholder: 'yourhandle' },
  { id: 'facebook', label: 'Facebook', emoji: '👍', placeholder: 'Your Page Name' },
];

// ---------- Local (guest) state ----------
const LocalStore = {
  init() {
    if (!localStorage.getItem('dh_guestId')) {
      localStorage.setItem('dh_guestId', 'guest-' + Math.random().toString(36).slice(2, 9));
    }
    if (!localStorage.getItem('dh_guestName')) {
      localStorage.setItem('dh_guestName', 'Guest');
    }
    if (!localStorage.getItem('dh_cart')) {
      localStorage.setItem('dh_cart', '[]');
    }
  },
  get guestId() { return localStorage.getItem('dh_guestId'); },
  get guestName() { return localStorage.getItem('dh_guestName'); },
  set guestName(name) { localStorage.setItem('dh_guestName', name); },
  get cart() { return JSON.parse(localStorage.getItem('dh_cart') || '[]'); },
  set cart(items) { localStorage.setItem('dh_cart', JSON.stringify(items)); },
  get quizAnswers() { return JSON.parse(localStorage.getItem('dh_quiz') || '{}'); },
  set quizAnswers(a) { localStorage.setItem('dh_quiz', JSON.stringify(a)); },
  addToCart(productId, qty = 1) {
    const cart = this.cart;
    const line = cart.find((c) => c.productId === productId);
    if (line) line.qty += qty;
    else cart.push({ productId, qty });
    this.cart = cart;
  },
  setQty(productId, qty) {
    let cart = this.cart;
    if (qty <= 0) cart = cart.filter((c) => c.productId !== productId);
    else {
      const line = cart.find((c) => c.productId === productId);
      if (line) line.qty = qty;
    }
    this.cart = cart;
  },
  clearCart() { this.cart = []; },
  cartCount() { return this.cart.reduce((s, c) => s + c.qty, 0); },
};

LocalStore.init();

// ---------- Small helpers ----------
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function toast(message) {
  const node = document.getElementById('toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => node.classList.remove('show'), 2400);
}

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function stars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function updateCartBadge() {
  document.getElementById('cartCount').textContent = LocalStore.cartCount();
}

function setActiveNav(view) {
  document.querySelectorAll('#mainNav button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.nav === view);
  });
}

// ---------- Router ----------
const routes = {
  pitch: renderPitch,
  quiz: renderQuiz,
  marketplace: renderMarketplace,
  boards: renderBoards,
  designers: renderDesigners,
  vip: renderVip,
  dashboard: renderDashboard,
  cart: renderCart,
  profile: renderProfile,
};

function navigate(view) {
  window.location.hash = `#/${view}`;
}

async function router() {
  const hash = window.location.hash.replace('#/', '') || 'pitch';
  const [view, param] = hash.split('/');
  const renderFn = routes[view] || renderPitch;
  setActiveNav(view);
  const root = document.getElementById('viewRoot');
  root.innerHTML = '<div class="empty-state">Loading…</div>';
  try {
    await renderFn(root, param);
  } catch (err) {
    root.innerHTML = `<div class="empty-state">⚠️ ${err.message}</div>`;
  }
}

window.addEventListener('hashchange', router);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-nav]').forEach((node) => {
    node.addEventListener('click', () => navigate(node.dataset.nav));
  });
  document.getElementById('profileName').textContent = LocalStore.guestName;
  updateCartBadge();
  router();
});

// ============================================================
// PITCH VIEW
// ============================================================
function renderPitch(root) {
  root.innerHTML = `
    <section class="hero">
      <span class="hero-sparkle s1">✨</span>
      <span class="hero-sparkle s2">💕</span>
      <span class="hero-sparkle s3">🎀</span>
      <span class="hero-sparkle s4">⭐</span>
      <div class="hero-inner">
        <div class="hero-copy">
          <h1>Dollhouse 🏠💗</h1>
          <p class="tagline">The Ultimate AI-Powered Fashion &amp; Home Design Platform for Women.
          AI curates your wardrobe and home decor seamlessly — delivered straight to your door.</p>
          <div class="hero-cta">
            <button class="btn btn-primary" data-nav="quiz">✨ Take the Style Quiz</button>
            <button class="btn btn-secondary" data-nav="marketplace">🛍️ Browse the Marketplace</button>
          </div>
        </div>
        <div class="hero-visual">${DOLLHOUSE_SVG}</div>
      </div>
    </section>

    <section class="section">
      <h2>💡 Problem &amp; Market Opportunity</h2>
      <p class="subtitle">Women spend billions annually on fashion and home decor, yet face key challenges.</p>
      <ul class="problem-list">
        <li><span class="emoji">🔹</span><span><b>Overwhelming choices</b> — Too many options, not enough time.</span></li>
        <li><span class="emoji">🔹</span><span><b>Lack of personalization</b> — Most platforms offer generic suggestions.</span></li>
        <li><span class="emoji">🔹</span><span><b>Disconnected shopping experiences</b> — Fashion and home design rarely integrate.</span></li>
        <li><span class="emoji">🔹</span><span><b>Delivery gaps</b> — Users want curated, high-quality pieces delivered effortlessly.</span></li>
      </ul>
    </section>

    <section class="section">
      <h2>✨ The Dollhouse Solution</h2>
      <ul class="solution-list">
        <li><span class="emoji">🛍️</span><span><b>AI-Powered Personalization</b> — Smart recommendations for fashion and interior design based on user preferences.</span></li>
        <li><span class="emoji">🎨</span><span><b>Inspiration Meets Shopping</b> — Users create boards, save items, and buy directly from their curated collections.</span></li>
        <li><span class="emoji">🚚</span><span><b>Seamless Product Delivery</b> — Every purchase is delivered directly to users, hassle-free.</span></li>
        <li><span class="emoji">💖</span><span><b>Marketplace for Independent Designers</b> — Supporting small brands with AI-driven exposure.</span></li>
        <li><span class="emoji">📌</span><span><b>Social &amp; Community Features</b> — Share, like, and comment on fashion and home decor inspirations.</span></li>
      </ul>
    </section>

    <section class="section">
      <h2>📈 Why Now?</h2>
      <div class="grid-4">
        <div class="card stat-box"><div class="num">$4.4B</div><div class="label">AI fashion market by 2027</div></div>
        <div class="card stat-box"><div class="num">$939B</div><div class="label">Global home decor by 2030</div></div>
        <div class="card stat-box"><div class="num">85%</div><div class="label">Consumer purchases driven by women</div></div>
        <div class="card stat-box"><div class="num">📦</div><div class="label">AI-curated delivery demand rising fast</div></div>
      </div>
    </section>

    <section class="section">
      <h2>💰 Business Model</h2>
      <p class="subtitle">Multiple revenue streams to drive profitability.</p>
      <div class="model-grid">
        <div class="model-card"><h4>AI Subscription Model</h4><p>Premium styling recommendations for paying users.</p></div>
        <div class="model-card"><h4>Marketplace Commission</h4><p>Dollhouse takes a percentage of each sale from independent brands.</p></div>
        <div class="model-card"><h4>Sponsored Products &amp; Ads</h4><p>Brands can pay for premium placement in AI recommendations.</p></div>
        <div class="model-card"><h4>Exclusive VIP Boxes</h4><p>Personalized fashion &amp; decor subscription boxes delivered monthly.</p></div>
      </div>
    </section>

    <section class="section">
      <h2>🚀 Go-To-Market Strategy</h2>
      <div class="gtm-grid">
        <div class="model-card"><h4>🎯 Influencer &amp; Social Marketing</h4><p>Partner with fashion &amp; home influencers.</p></div>
        <div class="model-card"><h4>📱 AI Recs, Mobile &amp; Web</h4><p>Seamless cross-platform experience.</p></div>
        <div class="model-card"><h4>🏆 Referral &amp; Loyalty Programs</h4><p>Incentives for purchases and social engagement.</p></div>
      </div>
    </section>

    <section class="section">
      <h2>🔑 Why Invest in Dollhouse?</h2>
      <ul class="why-invest">
        <li>✔️ <span><b>Untapped Market</b> — no major competitor combines AI, fashion, home decor, and direct delivery like we do.</span></li>
        <li>✔️ <span><b>Tech-Driven Growth</b> — AI personalization increases conversions and retention.</span></li>
        <li>✔️ <span><b>Scalable &amp; Global</b> — expansion into beauty, wellness, and lifestyle on the horizon.</span></li>
        <li>✔️ <span><b>Effortless Shopping</b> — users find what they love and receive it at their doorstep.</span></li>
      </ul>
    </section>

    <section class="section cta-banner">
      <h2>📢 Join Us</h2>
      <p>We're seeking funding to scale our AI, expand vendor partnerships, and optimize our AI-to-delivery shopping model.
      Let's build the future of fashion &amp; home design — delivered.</p>
      <button class="btn btn-primary" data-nav="dashboard">📊 See Live Investor Dashboard</button>
    </section>
  `;
  root.querySelectorAll('[data-nav]').forEach((n) => n.addEventListener('click', () => navigate(n.dataset.nav)));
}

// ============================================================
// STYLE QUIZ VIEW
// ============================================================
function renderQuiz(root) {
  const steps = [
    { key: 'vibe', title: "What's your vibe?", options: VIBE_OPTIONS },
    { key: 'palette', title: 'Pick a color palette', options: PALETTE_OPTIONS },
    { key: 'focus', title: 'What are you shopping for?', options: FOCUS_OPTIONS },
    { key: 'budget', title: "What's your budget?", options: BUDGET_OPTIONS },
  ];
  let stepIdx = 0;
  const answers = { ...LocalStore.quizAnswers };

  function renderStep() {
    const step = steps[stepIdx];
    root.innerHTML = `
      <div class="card quiz-card">
        <div class="progress-dots">
          ${steps.map((_, i) => `<span class="${i === stepIdx ? 'active' : ''}"></span>`).join('')}
        </div>
        <div class="quiz-step">
          <h3>${step.title}</h3>
          <div class="option-grid">
            ${step.options
              .map(
                (opt) => `
              <button class="option-btn ${answers[step.key] === opt.id ? 'selected' : ''}" data-val="${opt.id}">
                <span class="opt-emoji">${opt.emoji}</span>${opt.label}
              </button>`
              )
              .join('')}
          </div>
          <div class="quiz-nav">
            <button class="btn btn-ghost" id="quizBack" ${stepIdx === 0 ? 'disabled' : ''}>← Back</button>
            <button class="btn btn-primary" id="quizNext" ${answers[step.key] ? '' : 'disabled'}>
              ${stepIdx === steps.length - 1 ? 'See My Picks ✨' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    `;

    root.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        answers[step.key] = btn.dataset.val;
        LocalStore.quizAnswers = answers;
        renderStep();
      });
    });
    root.querySelector('#quizBack').addEventListener('click', () => {
      stepIdx = Math.max(0, stepIdx - 1);
      renderStep();
    });
    root.querySelector('#quizNext').addEventListener('click', async () => {
      if (stepIdx < steps.length - 1) {
        stepIdx += 1;
        renderStep();
      } else {
        await showResults();
      }
    });
  }

  async function showResults() {
    root.innerHTML = '<div class="empty-state">✨ Curating your picks…</div>';
    const { picks } = await Api.getRecommendations(answers);
    root.innerHTML = `
      <div class="section">
        <h2>Your AI-Curated Picks ✨</h2>
        <p class="subtitle">Based on: ${['vibe', 'palette', 'focus', 'budget']
          .filter((k) => answers[k])
          .map((k) => `<span class="tag-pill">${answers[k]}</span>`)
          .join(' ')}</p>
        <div style="margin-bottom:16px;"><button class="btn btn-ghost btn-sm" id="retakeQuiz">🔄 Retake Quiz</button></div>
        <div class="grid-4" id="picksGrid"></div>
      </div>
    `;
    const grid = root.querySelector('#picksGrid');
    picks.forEach((p) => grid.appendChild(renderProductCard(p, { showMatch: true })));
    root.querySelector('#retakeQuiz').addEventListener('click', () => {
      stepIdx = 0;
      renderStep();
    });
  }

  renderStep();
}

// ============================================================
// PRODUCT CARD (shared by marketplace + quiz results + designer page)
// ============================================================
function renderProductCard(product, { showMatch = false } = {}) {
  const card = el(`
    <div class="product-card">
      <div class="product-swatch" style="background:${product.gradient}">
        ${product.designer.independent ? '<span class="badge">Indie ✦</span>' : ''}
        ${product.sponsored ? '<span class="badge sponsored">Sponsored</span>' : ''}
        <span>${product.emoji}</span>
      </div>
      <div class="product-body">
        ${showMatch ? `<span class="match-badge">${product.matchScore}% match</span>` : ''}
        <div class="product-name">${product.name}</div>
        <div class="product-meta">
          <span>${product.designer.name}</span>
          <span class="rating">${stars(product.rating)}</span>
        </div>
        <div class="product-price">${money(product.price)}</div>
        ${showMatch ? `<div class="reco-reason">Because it ${product.reasons[0]}</div>` : ''}
        <div class="product-actions">
          <button class="btn btn-secondary btn-sm" data-action="board">📌 Save</button>
          <button class="btn btn-primary btn-sm" data-action="cart">🛍️ Add</button>
        </div>
      </div>
    </div>
  `);

  card.querySelector('[data-action="cart"]').addEventListener('click', () => {
    LocalStore.addToCart(product.id);
    updateCartBadge();
    toast(`Added "${product.name}" to your cart 🛍️`);
  });
  card.querySelector('[data-action="board"]').addEventListener('click', async () => {
    await openSaveToBoardModal(product);
  });

  return card;
}

async function openSaveToBoardModal(product) {
  const { boards } = await Api.getBoards({ ownerId: LocalStore.guestId });
  const boardName = boards.length
    ? prompt(
        `Save "${product.name}" to which board? Type an existing name (${boards.map((b) => b.title).join(', ')}) or a new one:`,
        boards[0].title
      )
    : prompt(`Name a new board to save "${product.name}" to:`, 'My Favorites');

  if (!boardName || !boardName.trim()) return;
  let board = boards.find((b) => b.title.toLowerCase() === boardName.trim().toLowerCase());
  if (!board) {
    const res = await Api.createBoard({ title: boardName.trim(), ownerId: LocalStore.guestId, ownerName: LocalStore.guestName });
    board = res.board;
  }
  await Api.addBoardItem(board.id, product.id);
  toast(`Saved to "${board.title}" 📌`);
}

// ============================================================
// MARKETPLACE VIEW
// ============================================================
function renderMarketplace(root) {
  const state = { category: 'all', vibe: '', palette: '', budget: '', search: '' };

  root.innerHTML = `
    <div class="section">
      <h2>🛍️ Marketplace</h2>
      <p class="subtitle">AI-curated fashion &amp; home decor from independent designers and trusted brands.</p>
      <div class="room-picker">
        <button class="room-card room-closet" data-room="fashion">
          <span class="room-icon">🚪👗</span>
          <span class="room-name">The Closet</span>
          <span class="room-sub">Fashion</span>
        </button>
        <button class="room-card room-living" data-room="home">
          <span class="room-icon">🛋️🏠</span>
          <span class="room-name">The Living Room</span>
          <span class="room-sub">Home Decor</span>
        </button>
        <button class="room-card room-all" data-room="all">
          <span class="room-icon">🏠✨</span>
          <span class="room-name">Whole House</span>
          <span class="room-sub">Everything</span>
        </button>
      </div>
      <div class="filters-bar">
        <input type="text" id="searchInput" placeholder="Search products, designers…" />
        <select id="categorySelect">
          <option value="all">All Categories</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home Decor</option>
        </select>
        <select id="vibeSelect"><option value="">Any Vibe</option>${VIBE_OPTIONS.map((v) => `<option value="${v.id}">${v.label}</option>`).join('')}</select>
        <select id="paletteSelect"><option value="">Any Palette</option>${PALETTE_OPTIONS.map((v) => `<option value="${v.id}">${v.label}</option>`).join('')}</select>
        <select id="budgetSelect"><option value="">Any Budget</option>${BUDGET_OPTIONS.map((v) => `<option value="${v.id}">${v.label}</option>`).join('')}</select>
      </div>
      <div class="grid-4" id="productGrid"></div>
    </div>
  `;

  const grid = root.querySelector('#productGrid');

  async function refresh() {
    grid.innerHTML = '<div class="empty-state">Loading…</div>';
    const { products } = await Api.getProducts(state);
    grid.innerHTML = '';
    if (!products.length) {
      grid.innerHTML = '<div class="empty-state">No products match those filters yet. Try widening your search 💫</div>';
      return;
    }
    products.forEach((p) => grid.appendChild(renderProductCard(p)));
  }

  root.querySelector('#searchInput').addEventListener('input', (e) => {
    state.search = e.target.value;
    clearTimeout(refresh._t);
    refresh._t = setTimeout(refresh, 250);
  });
  root.querySelector('#categorySelect').addEventListener('change', (e) => { state.category = e.target.value; syncRoomActive(); refresh(); });
  root.querySelector('#vibeSelect').addEventListener('change', (e) => { state.vibe = e.target.value; refresh(); });
  root.querySelector('#paletteSelect').addEventListener('change', (e) => { state.palette = e.target.value; refresh(); });
  root.querySelector('#budgetSelect').addEventListener('change', (e) => { state.budget = e.target.value; refresh(); });

  function syncRoomActive() {
    root.querySelectorAll('.room-card').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.room === state.category);
    });
  }

  root.querySelectorAll('.room-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.room;
      root.querySelector('#categorySelect').value = btn.dataset.room;
      syncRoomActive();
      refresh();
    });
  });

  syncRoomActive();
  refresh();
}

// ============================================================
// BOARDS VIEW (inspiration + social)
// ============================================================
async function renderBoards(root, boardId) {
  root.innerHTML = `
    <div class="section">
      <h2>🎨 Boards</h2>
      <p class="subtitle">Save inspiration, mix fashion + home finds, and share with the community.</p>
      <div style="margin-bottom:18px;"><button class="btn btn-primary" id="newBoardBtn">+ New Board</button></div>
      <div class="grid-3" id="boardsGrid"></div>
    </div>
  `;

  root.querySelector('#newBoardBtn').addEventListener('click', async () => {
    const title = prompt('Name your new board:');
    if (!title || !title.trim()) return;
    await Api.createBoard({ title: title.trim(), ownerId: LocalStore.guestId, ownerName: LocalStore.guestName });
    toast(`Board "${title.trim()}" created 🎉`);
    load();
  });

  async function load() {
    const grid = root.querySelector('#boardsGrid');
    grid.innerHTML = '<div class="empty-state">Loading…</div>';
    const { boards } = await Api.getBoards({ public: 'true' });
    grid.innerHTML = '';
    if (!boards.length) {
      grid.innerHTML = '<div class="empty-state">No boards yet — start one! 📌</div>';
      return;
    }
    boards.forEach((board) => grid.appendChild(renderBoardCard(board, load)));
  }

  await load();
  if (boardId) openBoardDetail(boardId, load); // supports shareable links like #/boards/b-seed-1
}

function renderBoardCard(board, onChange) {
  const liked = board.likes.includes(LocalStore.guestId);
  const card = el(`
    <div class="card board-card">
      <div class="board-swatches">
        ${board.products.slice(0, 4).map((p) => `<div class="sw" style="background:${p.gradient}">${p.emoji}</div>`).join('') || '<div class="sw" style="background:var(--pink-100)">🤍</div>'}
      </div>
      <div class="board-title">${board.title}</div>
      <div class="board-owner">by ${board.ownerName} · ${board.products.length} items</div>
      <div class="board-actions">
        <span class="like-btn ${liked ? 'liked' : ''}" data-action="like">${liked ? '❤️' : '🤍'} ${board.likeCount}</span>
        <span>💬 ${board.comments.length}</span>
        <button class="btn btn-ghost btn-sm" data-action="view">View</button>
      </div>
    </div>
  `);

  card.querySelector('[data-action="like"]').addEventListener('click', async () => {
    await Api.likeBoard(board.id, LocalStore.guestId);
    onChange();
  });
  card.querySelector('[data-action="view"]').addEventListener('click', () => openBoardDetail(board.id, onChange));

  return card;
}

function boardShareUrl(board) {
  return `${window.location.origin}${window.location.pathname}#/boards/${board.id}`;
}

function renderShareBar(board) {
  const shareUrl = boardShareUrl(board);
  const text = `Check out my "${board.title}" board on Dollhouse 🏠💕`;
  const links = {
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
  };
  return `
    <div class="share-bar">
      <span class="share-label">Share:</span>
      <a class="share-btn pinterest" href="${links.pinterest}" target="_blank" rel="noopener">📌 Pinterest</a>
      <a class="share-btn facebook" href="${links.facebook}" target="_blank" rel="noopener">👍 Facebook</a>
      <a class="share-btn twitter" href="${links.twitter}" target="_blank" rel="noopener">🐦 X</a>
      <button class="share-btn copy" data-action="copy-link" type="button">🔗 Copy Link</button>
    </div>
  `;
}

async function openBoardDetail(boardId, onChange) {
  const { board } = await Api.getBoard(boardId);
  const overlay = el(`
    <div style="position:fixed;inset:0;background:rgba(42,34,48,0.5);z-index:50;display:flex;align-items:center;justify-content:center;padding:20px;">
      <div class="card" style="max-width:560px;width:100%;max-height:85vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3 style="margin:0;">${board.title}</h3>
          <button class="btn btn-ghost btn-sm" id="closeModal">✕</button>
        </div>
        <p class="board-owner">by ${board.ownerName}</p>
        ${renderShareBar(board)}
        <div class="grid-3" id="modalProducts" style="margin:14px 0;"></div>
        <h4>Comments</h4>
        <div class="comment-list" id="modalComments">
          ${board.comments.map((c) => `<div class="comment-item"><b>${c.authorName}:</b> ${c.text}</div>`).join('') || '<div class="empty-state" style="padding:10px;">No comments yet.</div>'}
        </div>
        <div class="comment-form">
          <input type="text" id="commentInput" placeholder="Add a comment…" />
          <button class="btn btn-primary btn-sm" id="commentSubmit">Post</button>
        </div>
      </div>
    </div>
  `);
  document.body.appendChild(overlay);

  const productsWrap = overlay.querySelector('#modalProducts');
  if (!board.products.length) {
    productsWrap.innerHTML = '<div class="empty-state">No items saved yet.</div>';
  } else {
    board.products.forEach((p) => productsWrap.appendChild(renderProductCard(p)));
  }

  overlay.querySelector('#closeModal').addEventListener('click', () => {
    overlay.remove();
    if (onChange) onChange();
  });
  overlay.querySelector('[data-action="copy-link"]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(boardShareUrl(board));
      toast('Board link copied! 🔗');
    } catch {
      toast(boardShareUrl(board));
    }
  });
  overlay.querySelector('#commentSubmit').addEventListener('click', async () => {
    const input = overlay.querySelector('#commentInput');
    if (!input.value.trim()) return;
    await Api.commentBoard(board.id, LocalStore.guestName, input.value.trim());
    overlay.remove();
    openBoardDetail(boardId, onChange);
  });
}

// ============================================================
// DESIGNERS VIEW
// ============================================================
async function renderDesigners(root) {
  root.innerHTML = `
    <div class="section">
      <h2>💖 Marketplace for Independent Designers</h2>
      <p class="subtitle">Small brands get AI-driven exposure and a direct line to shoppers who love their aesthetic.</p>
      <div class="grid-3" id="designerGrid"></div>
      <div class="card" style="margin-top:32px;max-width:520px;">
        <h3>Apply to sell on Dollhouse</h3>
        <form id="applyForm" style="display:grid;gap:10px;">
          <input required name="brandName" placeholder="Brand name" style="padding:10px;border-radius:9px;border:1px solid var(--border);" />
          <input required name="contactEmail" type="email" placeholder="Contact email" style="padding:10px;border-radius:9px;border:1px solid var(--border);" />
          <select name="category" style="padding:10px;border-radius:9px;border:1px solid var(--border);">
            <option value="fashion">Fashion</option>
            <option value="home">Home Decor</option>
          </select>
          <textarea name="story" placeholder="Tell us about your brand…" rows="3" style="padding:10px;border-radius:9px;border:1px solid var(--border);"></textarea>
          <button class="btn btn-primary" type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  `;

  const { designers } = await Api.getDesigners();
  const grid = root.querySelector('#designerGrid');
  designers.forEach((d) => {
    grid.appendChild(el(`
      <div class="card designer-card">
        ${d.independent ? '<span class="independent-tag">Independent</span>' : '<span class="independent-tag" style="background:var(--lavender-100);color:#5b3fa0;">Brand Partner</span>'}
        <div class="designer-name">${d.name}</div>
        <p style="margin:0;color:var(--ink-600);font-size:13px;">${d.bio}</p>
        <div class="product-meta"><span>${d.productCount} products</span><span class="rating">${d.avgRating ? stars(d.avgRating) : ''}</span></div>
      </div>
    `));
  });

  root.querySelector('#applyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await Api.applyDesigner(payload);
      toast('Application submitted! 💌');
      e.target.reset();
      alert(res.message);
    } catch (err) {
      toast(err.message);
    }
  });
}

// ============================================================
// VIP BOX VIEW
// ============================================================
async function renderVip(root) {
  const [{ tiers }, { subscription }] = await Promise.all([
    Api.getVipTiers(),
    Api.getVipSubscription(LocalStore.guestId),
  ]);

  root.innerHTML = `
    <div class="section">
      <h2>💎 Exclusive VIP Boxes</h2>
      <p class="subtitle">Personalized fashion &amp; decor subscription boxes, delivered monthly.</p>
      ${subscription ? `<div class="card" style="margin-bottom:20px;background:var(--pink-50);"><b>You're subscribed to ${subscription.tierName}</b> — next box ships ${new Date(subscription.nextBoxDate).toLocaleDateString()}. <button class="btn btn-ghost btn-sm" id="cancelVip" style="margin-left:10px;">Cancel</button></div>` : ''}
      <div class="grid-3" id="vipGrid"></div>
    </div>
  `;

  const grid = root.querySelector('#vipGrid');
  tiers.forEach((tier) => {
    const isCurrent = subscription && subscription.tierId === tier.id;
    const card = el(`
      <div class="card vip-card ${isCurrent ? 'current' : ''}">
        <h3>${tier.name}</h3>
        <div class="price">${money(tier.price)}<span style="font-size:13px;color:var(--ink-600);">/mo</span></div>
        <p style="color:var(--ink-600);font-size:13px;">${tier.description}</p>
        <button class="btn ${isCurrent ? 'btn-ghost' : 'btn-primary'}" ${isCurrent ? 'disabled' : ''} data-tier="${tier.id}">
          ${isCurrent ? 'Current Plan' : 'Subscribe'}
        </button>
      </div>
    `);
    if (!isCurrent) {
      card.querySelector('button').addEventListener('click', async () => {
        await Api.subscribeVip({ userId: LocalStore.guestId, userName: LocalStore.guestName, tierId: tier.id });
        toast(`Subscribed to ${tier.name} 💎`);
        renderVip(root);
      });
    }
    grid.appendChild(card);
  });

  const cancelBtn = root.querySelector('#cancelVip');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', async () => {
      await Api.cancelVip(LocalStore.guestId);
      toast('Subscription cancelled.');
      renderVip(root);
    });
  }
}

// ============================================================
// INVESTOR DASHBOARD VIEW
// ============================================================
async function renderDashboard(root) {
  const { live, market, businessModel } = await Api.getStats();
  root.innerHTML = `
    <div class="section">
      <h2>📊 Investor Dashboard</h2>
      <p class="subtitle">Live demo metrics alongside the market opportunity behind Dollhouse.</p>
      <h3>Live Platform Activity</h3>
      <div class="grid-4">
        <div class="card stat-box"><div class="num">${live.totalProducts}</div><div class="label">Products listed</div></div>
        <div class="card stat-box"><div class="num">${live.independentDesigners}/${live.totalDesigners}</div><div class="label">Independent designers</div></div>
        <div class="card stat-box"><div class="num">${live.boardsCreated}</div><div class="label">Boards created</div></div>
        <div class="card stat-box"><div class="num">${live.totalLikes}</div><div class="label">Board likes</div></div>
        <div class="card stat-box"><div class="num">${live.totalComments}</div><div class="label">Comments</div></div>
        <div class="card stat-box"><div class="num">${live.ordersPlaced}</div><div class="label">Orders placed</div></div>
        <div class="card stat-box"><div class="num">${live.activeSubscriptions}</div><div class="label">Active VIP subscriptions</div></div>
        <div class="card stat-box"><div class="num">${live.connectedSocialAccounts}</div><div class="label">Social accounts connected</div></div>
      </div>
      <h3 style="margin-top:32px;">Market Opportunity</h3>
      <div class="grid-3">
        <div class="card stat-box"><div class="num">$${market.aiFashionMarket2027B}B</div><div class="label">AI fashion market by 2027</div></div>
        <div class="card stat-box"><div class="num">$${market.homeDecorMarket2030B}B</div><div class="label">Home decor market by 2030</div></div>
        <div class="card stat-box"><div class="num">${Math.round(market.womenPurchaseShare * 100)}%</div><div class="label">Consumer spend driven by women</div></div>
      </div>
      <h3 style="margin-top:32px;">Revenue Streams</h3>
      <div class="model-grid">
        ${businessModel.map((b) => `<div class="model-card"><h4>${b.stream}</h4><p>${b.description}</p></div>`).join('')}
      </div>
    </div>
  `;
}

// ============================================================
// CART / CHECKOUT VIEW
// ============================================================
async function renderCart(root) {
  const cart = LocalStore.cart;
  if (!cart.length) {
    root.innerHTML = `
      <div class="section">
        <h2>🛍️ Your Cart</h2>
        <div class="empty-state">Your cart is empty. <button class="btn btn-primary btn-sm" data-nav="marketplace">Browse the Marketplace</button></div>
      </div>`;
    root.querySelector('[data-nav]').addEventListener('click', (e) => navigate(e.target.dataset.nav));
    return;
  }

  const products = await Promise.all(cart.map((c) => Api.getProduct(c.productId).then((r) => r.product)));
  const lines = cart.map((c, i) => ({ ...c, product: products[i] })).filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = subtotal >= 75 ? 0 : 6.99;
  const tax = subtotal * 0.0825;
  const total = subtotal + shipping + tax;

  root.innerHTML = `
    <div class="section">
      <h2>🛍️ Your Cart</h2>
      <div class="grid-2">
        <div class="card" id="cartLines"></div>
        <div class="card">
          <h3>Order Summary</h3>
          <div class="cart-summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
          <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : money(shipping)}</span></div>
          <div class="cart-summary-row"><span>Tax</span><span>${money(tax)}</span></div>
          <div class="cart-summary-row total"><span>Total</span><span>${money(total)}</span></div>
          <p style="font-size:12px;color:var(--ink-600);">🚚 Delivered straight to your door in 3–7 days.</p>
          <button class="btn btn-primary" id="checkoutBtn" style="width:100%;margin-top:8px;">Checkout</button>
        </div>
      </div>
    </div>
  `;

  const linesWrap = root.querySelector('#cartLines');
  lines.forEach((l) => {
    const line = el(`
      <div class="cart-line">
        <div class="swatch-sm" style="background:${l.product.gradient}">${l.product.emoji}</div>
        <div class="info">
          <div class="product-name">${l.product.name}</div>
          <div class="product-meta"><span>${money(l.product.price)}</span></div>
        </div>
        <div class="qty-controls">
          <button class="btn btn-ghost btn-sm" data-action="dec">−</button>
          <span>${l.qty}</span>
          <button class="btn btn-ghost btn-sm" data-action="inc">+</button>
        </div>
      </div>
    `);
    line.querySelector('[data-action="dec"]').addEventListener('click', () => {
      LocalStore.setQty(l.product.id, l.qty - 1);
      updateCartBadge();
      renderCart(root);
    });
    line.querySelector('[data-action="inc"]').addEventListener('click', () => {
      LocalStore.setQty(l.product.id, l.qty + 1);
      updateCartBadge();
      renderCart(root);
    });
    linesWrap.appendChild(line);
  });

  root.querySelector('#checkoutBtn').addEventListener('click', async () => {
    const { order } = await Api.checkout({
      userId: LocalStore.guestId,
      userName: LocalStore.guestName,
      items: lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
    });
    LocalStore.clearCart();
    updateCartBadge();
    root.innerHTML = `
      <div class="card order-confirmation">
        <h2>🎉 Order Confirmed!</h2>
        <p>Thanks, ${order.userName}! Your Dollhouse pieces are on their way.</p>
        <p><b>Order #${order.id}</b> · Total ${money(order.total)}</p>
        <p>📦 Estimated delivery: <b>${new Date(order.estimatedDelivery).toLocaleDateString()}</b></p>
        <button class="btn btn-primary" data-nav="marketplace">Keep Shopping</button>
      </div>
    `;
    root.querySelector('[data-nav]').addEventListener('click', (e) => navigate(e.target.dataset.nav));
  });
}

// ============================================================
// PROFILE VIEW (display name + connect social accounts)
// ============================================================
async function renderProfile(root) {
  const { profile } = await Api.getProfile(LocalStore.guestId);

  root.innerHTML = `
    <div class="section">
      <h2>👤 Your Profile</h2>
      <p class="subtitle">Manage your display name and connect your social accounts to share boards and get influencer-style recs.</p>

      <div class="card" style="max-width:420px;margin-bottom:24px;">
        <h3 style="margin-top:0;">Display Name</h3>
        <div style="display:flex;gap:8px;">
          <input type="text" id="displayNameInput" value="${profile.displayName}" style="flex:1;padding:10px 12px;border-radius:9px;border:1px solid var(--border);" />
          <button class="btn btn-primary btn-sm" id="saveNameBtn">Save</button>
        </div>
      </div>

      <h3>Connect Your Social Accounts</h3>
      <p class="subtitle" style="margin-top:-8px;">Demo connections — link a handle so your boards can cross-post and friends can find you. No real account access is requested.</p>
      <div class="grid-4" id="socialGrid"></div>
    </div>
  `;

  root.querySelector('#saveNameBtn').addEventListener('click', async () => {
    const val = root.querySelector('#displayNameInput').value.trim();
    if (!val) return;
    await Api.updateProfile(LocalStore.guestId, val);
    LocalStore.guestName = val;
    document.getElementById('profileName').textContent = val;
    toast(`Saved! Hi, ${val} 💖`);
  });

  const grid = root.querySelector('#socialGrid');
  SOCIAL_PLATFORMS.forEach((platform) => {
    const account = profile.social[platform.id] || { connected: false, handle: '' };
    const card = el(`
      <div class="card social-card ${account.connected ? 'connected' : ''}">
        <div class="social-emoji">${platform.emoji}</div>
        <div class="social-label">${platform.label}</div>
        ${
          account.connected
            ? `<div class="social-handle">@${account.handle}</div>
               <span class="social-status">✅ Connected</span>
               <button class="btn btn-ghost btn-sm" data-action="disconnect">Disconnect</button>`
            : `<input type="text" class="social-input" placeholder="${platform.placeholder}" />
               <button class="btn btn-secondary btn-sm" data-action="connect">Connect</button>`
        }
      </div>
    `);

    if (account.connected) {
      card.querySelector('[data-action="disconnect"]').addEventListener('click', async () => {
        await Api.disconnectSocial(LocalStore.guestId, platform.id);
        toast(`Disconnected ${platform.label}`);
        renderProfile(root);
      });
    } else {
      const submit = async () => {
        const input = card.querySelector('.social-input');
        if (!input.value.trim()) {
          input.focus();
          return;
        }
        await Api.connectSocial(LocalStore.guestId, platform.id, input.value.trim());
        toast(`Connected ${platform.label} 🎉`);
        renderProfile(root);
      };
      card.querySelector('[data-action="connect"]').addEventListener('click', submit);
      card.querySelector('.social-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submit();
      });
    }

    grid.appendChild(card);
  });
}
