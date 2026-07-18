/* ============================================================
   MATRIX TOPUP — main.js
   ============================================================ */

/* ---------------------------------------------------------
   0. CONFIG — edit these before going live
--------------------------------------------------------- */
const BKASH_NUMBER = '01XXXXXXXXX'; // <-- REPLACE with your real bKash "Send Money" personal number

// Telegram bot used to receive new-order notifications.
// TG_CHAT_ID must be the numeric chat id of the person/channel that should
// receive messages (open a chat with your bot, send it any message, then
// check https://api.telegram.org/bot<TOKEN>/getUpdates to find the real
// chat id — it is usually NOT the same number as the token prefix).
const TG_TOKEN   = '8240782031:AAGa7QODb9qKsGB1PRRbp2iUt8bafgn5Mis';
const TG_CHAT_ID = '8240782031';

/* ---------------------------------------------------------
   1. PRODUCT DATA
   Each game defines the packages it sells and which single
   extra identifier field the buyer needs to provide so we can
   deliver the order (Roblox username, Genshin UID, etc).
--------------------------------------------------------- */
const GAMES = [
  {
    id: 'robux',
    name: 'Roblox',
    icon: '🧱',
    desc: 'Get Robux and unlock limitless creativity. Buy accessories, avatar items, game passes and more.',
    fieldLabel: 'Roblox Username',
    fieldPlaceholder: 'e.g. matrix_builder22',
    needsServer: false,
    packages: [
      { amount: '400 Robux',  bonus: '', price: 580,  popular: false },
      { amount: '500 Robux',  bonus: '', price: 600,  popular: true  },
      { amount: '2000 Robux', bonus: '', price: 2300, popular: false },
    ]
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    icon: '⚔️',
    desc: 'Top up Genesis Crystals and grab the Welkin Moon to power through Teyvat faster.',
    fieldLabel: 'Genshin UID',
    fieldPlaceholder: 'e.g. 800123456',
    needsServer: true,
    // Sample pricing — adjust to your real supplier rates.
    packages: [
      { amount: '60 Genesis Crystals',            bonus: '',              price: 85,   popular: false },
      { amount: '300 Genesis Crystals',            bonus: '+30 Bonus',     price: 420,  popular: false },
      { amount: '980 Genesis Crystals',            bonus: '+110 Bonus',    price: 1350, popular: true  },
      { amount: '1980 Genesis Crystals',           bonus: '+260 Bonus',    price: 2650, popular: false },
      { amount: 'Blessing of the Welkin Moon',     bonus: '30 Days',       price: 780,  popular: false },
    ]
  },
  {
    id: 'tgstars',
    name: 'Telegram Stars',
    icon: '⭐',
    desc: 'Buy Telegram Stars to unlock bot features, gifts, and premium content across Telegram.',
    fieldLabel: 'Telegram Username or Phone',
    fieldPlaceholder: '@yourusername or 01XXXXXXXXX',
    needsServer: false,
    // Sample pricing — adjust to your real supplier rates.
    packages: [
      { amount: '50 Stars',   bonus: '', price: 90,   popular: false },
      { amount: '100 Stars',  bonus: '', price: 170,  popular: true  },
      { amount: '500 Stars',  bonus: '', price: 800,  popular: false },
      { amount: '1000 Stars', bonus: '', price: 1550, popular: false },
    ]
  },
  {
    id: 'codm',
    name: 'Call of Duty',
    icon: '🎯',
    desc: 'CP delivery for Warzone & COD Mobile.',
    fieldLabel: 'Player UID / Activision ID',
    fieldPlaceholder: 'e.g. 1234567890',
    needsServer: false,
    packages: [
      { amount: '80+80 CP',     bonus: '+80 Bonus',   price: 120  },
      { amount: '400+400 CP',   bonus: '+400 Bonus',  price: 570  },
      { amount: '800+800 CP',   bonus: '+800 Bonus',  price: 1099 },
      { amount: '2000+2000 CP', bonus: '+2000 Bonus', price: 2700 },
    ]
  },
  {
    id: 'steam',
    name: 'Steam',
    icon: '🎮',
    desc: 'Add funds to your Steam Wallet and purchase any game, DLC, or in-game item from the Steam Store instantly.',
    fieldLabel: 'Steam Account Email / Login (for confirmation)',
    fieldPlaceholder: 'you@email.com',
    needsServer: false,
    packages: [
      { amount: 'Steam Wallet Code 1.35 USD', bonus: '', price: 220 },
      { amount: 'Steam Wallet Code 1.95 USD', bonus: '', price: 299 },
      { amount: 'Steam Wallet Code 3 USD',    bonus: '', price: 480 },
      { amount: 'Steam Wallet Code 5 USD',    bonus: '', price: 720 },
    ]
  },
  {
    id: 'gtav',
    name: 'GTA V',
    icon: '🚗',
    desc: 'Get your official GTA V PC redeem key and dive into the sprawling crime world of Los Santos. One-time activation on Rockstar Games.',
    fieldLabel: 'Contact Email (key delivered here)',
    fieldPlaceholder: 'you@email.com',
    needsServer: false,
    packages: [
      { amount: 'GTA V PC Key', bonus: '🔑 Redeem on Rockstar', price: 1450 },
    ]
  },
  {
    id: 'rdr2',
    name: 'RDR 2',
    icon: '🤠',
    desc: 'Red Dead Redemption 2 PC redeem keys — Standard, Ultimate & Special Edition. One-time activation on Rockstar Games.',
    fieldLabel: 'Contact Email (key delivered here)',
    fieldPlaceholder: 'you@email.com',
    needsServer: false,
    packages: [
      { amount: 'RDR 2 Standard Edition',  bonus: '🔑 Rockstar Key', price: 2300 },
      { amount: 'RDR 2 Ultimate Edition',  bonus: '🔑 Rockstar Key', price: 3000 },
      { amount: 'RDR 2 Special Edition',   bonus: '🔑 Rockstar Key', price: 3200 },
    ]
  },
];

/* ---------------------------------------------------------
   2. MATRIX RAIN BACKGROUND
--------------------------------------------------------- */
(function matrixRain(){
  const canvas = document.getElementById('matrixRain');
  const ctx = canvas.getContext('2d');
  const chars = 'アイウエオカキクケコサシスセソ0123456789<>/{}[]#$';
  let cols, drops;

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 18);
    drops = new Array(cols).fill(1);
  }
  window.addEventListener('resize', resize);
  resize();

  function draw(){
    ctx.fillStyle = 'rgba(5,7,10,0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#39ff88';
    ctx.font = '15px monospace';
    for(let i=0;i<drops.length;i++){
      const text = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillText(text, i*18, drops[i]*18);
      if(drops[i]*18 > canvas.height && Math.random() > 0.975){
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  setInterval(draw, 50);
})();

/* ---------------------------------------------------------
   3. HERO TYPED LINE
--------------------------------------------------------- */
(function typedLine(){
  const el = document.getElementById('typedLine');
  const full = 'Robux, Genshin, Telegram Stars, COD CP, Steam & Rockstar keys — paid with bKash, delivered fast.';
  let i = 0;
  function tick(){
    if(i <= full.length){
      el.textContent = full.slice(0, i);
      i++;
      setTimeout(tick, 22);
    }
  }
  tick();
})();

/* ---------------------------------------------------------
   4. RENDER GAME GRID
--------------------------------------------------------- */
const gameGrid = document.getElementById('gameGrid');

function renderGameGrid(){
  gameGrid.innerHTML = GAMES.map(g => `
    <div class="game-card" data-game="${g.id}">
      <div class="game-icon">${g.icon}</div>
      <h3>${g.name}</h3>
      <p>${g.desc}</p>
      <span class="card-cta">View packages →</span>
    </div>
  `).join('');

  gameGrid.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => openPackages(card.dataset.game));
  });
}
renderGameGrid();

/* ---------------------------------------------------------
   5. PACKAGES VIEW
--------------------------------------------------------- */
const gamesSection = document.getElementById('games');
const packagesSection = document.getElementById('packagesSection');
const packagesGrid = document.getElementById('packagesGrid');
const packagesGameName = document.getElementById('packagesGameName');
const packagesGameDesc = document.getElementById('packagesGameDesc');
const packagesGameIcon = document.getElementById('packagesGameIcon');

function openPackages(gameId){
  const game = GAMES.find(g => g.id === gameId);
  if(!game) return;

  packagesGameIcon.textContent = game.icon;
  packagesGameName.textContent = game.name;
  packagesGameDesc.textContent = game.desc;

  packagesGrid.innerHTML = game.packages.map((pkg, idx) => `
    <div class="package-card ${pkg.popular ? 'popular' : ''}">
      ${pkg.popular ? '<span class="popular-badge">MOST POPULAR</span>' : ''}
      <div class="package-amount">${pkg.amount}</div>
      ${pkg.bonus ? `<div class="package-bonus">${pkg.bonus}</div>` : ''}
      <div class="package-price">${pkg.price} <small>Taka</small></div>
      <button class="buy-btn" data-game="${game.id}" data-idx="${idx}">Buy Now</button>
    </div>
  `).join('');

  packagesGrid.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = GAMES.find(x => x.id === btn.dataset.game);
      const pkg = g.packages[Number(btn.dataset.idx)];
      openCheckout(g, pkg);
    });
  });

  gamesSection.classList.add('hidden');
  packagesSection.classList.remove('hidden');
  packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('backToGames').addEventListener('click', () => {
  packagesSection.classList.add('hidden');
  gamesSection.classList.remove('hidden');
  gamesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ---------------------------------------------------------
   6. CHECKOUT MODAL
--------------------------------------------------------- */
const checkoutModal    = document.getElementById('checkoutModal');
const modalStepDetails = document.getElementById('modalStepDetails');
const modalStepPayment = document.getElementById('modalStepPayment');
const modalStepSuccess = document.getElementById('modalStepSuccess');
const modalPkgTitle    = document.getElementById('modalPkgTitle');
const modalOrderSummary= document.getElementById('modalOrderSummary');
const dynamicFieldLabel= document.getElementById('dynamicFieldLabel');
const dynamicFieldInput= document.getElementById('dynamicFieldInput');
const serverFieldLabel = document.getElementById('serverFieldLabel');
const detailsForm      = document.getElementById('detailsForm');
const paymentForm      = document.getElementById('paymentForm');
const bkashNumberDisplay = document.getElementById('bkashNumberDisplay');
const bkashAmountDisplay = document.getElementById('bkashAmountDisplay');
const orderNumberDisplay = document.getElementById('orderNumberDisplay');

let currentOrder = {};

function openCheckout(game, pkg){
  currentOrder = {
    game: game.name,
    pkg: pkg.amount + (pkg.bonus ? ` (${pkg.bonus})` : ''),
    price: pkg.price,
  };

  modalPkgTitle.textContent = `${game.name} — ${pkg.amount}`;
  modalOrderSummary.innerHTML = `
    <div>Package: <strong>${pkg.amount}${pkg.bonus ? ' ' + pkg.bonus : ''}</strong></div>
    <div>Price: <strong>${pkg.price} Taka</strong></div>
  `;

  dynamicFieldLabel.firstChild.textContent = game.fieldLabel + ' ';
  dynamicFieldInput.placeholder = game.fieldPlaceholder;
  dynamicFieldInput.value = '';

  serverFieldLabel.classList.toggle('hidden', !game.needsServer);

  bkashNumberDisplay.textContent = BKASH_NUMBER;
  bkashAmountDisplay.textContent = pkg.price + ' ৳';

  showStep('details');
  checkoutModal.classList.remove('hidden');
}

function showStep(step){
  modalStepDetails.classList.toggle('hidden', step !== 'details');
  modalStepPayment.classList.toggle('hidden', step !== 'payment');
  modalStepSuccess.classList.toggle('hidden', step !== 'success');
}

function closeCheckout(){
  checkoutModal.classList.add('hidden');
  detailsForm.reset();
  paymentForm.reset();
}

document.getElementById('modalClose').addEventListener('click', closeCheckout);
checkoutModal.addEventListener('click', (e) => { if(e.target === checkoutModal) closeCheckout(); });

detailsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(detailsForm);
  currentOrder.firstName   = data.get('firstName').trim();
  currentOrder.lastName    = data.get('lastName').trim();
  currentOrder.email       = data.get('email').trim();
  currentOrder.genUser     = data.get('dynamicField').trim();
  currentOrder.accountType = data.get('accountType') || '';
  showStep('payment');
});

document.getElementById('backToDetails').addEventListener('click', () => showStep('details'));

document.getElementById('copyBkashBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(BKASH_NUMBER).then(() => {
    const btn = document.getElementById('copyBkashBtn');
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
});

paymentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(paymentForm);
  currentOrder.trxId = data.get('trxId').trim();

  const orderNumber = generateOrderNumber();
  currentOrder.orderNumber = orderNumber;

  saveOrderLocally(orderNumber, currentOrder);
  sendToTelegram(currentOrder);

  orderNumberDisplay.textContent = orderNumber;
  showStep('success');
});

document.getElementById('closeSuccessBtn').addEventListener('click', closeCheckout);

function generateOrderNumber(){
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MTX-${rand}`;
}

function saveOrderLocally(orderNumber, order){
  try{
    const all = JSON.parse(localStorage.getItem('matrixTopupOrders') || '{}');
    all[orderNumber] = { ...order, savedAt: new Date().toISOString() };
    localStorage.setItem('matrixTopupOrders', JSON.stringify(all));
  }catch(err){
    console.error('Could not save order locally:', err);
  }
}

/* ---------------------------------------------------------
   7. TELEGRAM ORDER NOTIFICATION
--------------------------------------------------------- */
async function sendToTelegram(order) {
  const line = (label, val) => `<b>${label}:</b> ${val}`;
  const msg = [
    '🟢 <b>NEW ORDER — Matrix TopUp</b>',
    '─────────────────────',
    line('🎮 Game',    order.game),
    line('📦 Package', order.pkg),
    line('💰 Amount',  order.price + ' Taka'),
    '─────────────────────',
    line('👤 Name',    order.firstName + ' ' + order.lastName),
    order.accountType ? line('🌍 Server', order.accountType) : '',
    order.email    ? line('📧 Contact',    order.email)    : '',
    order.genUser  ? line('🆔 Game ID',    order.genUser)  : '',
    '─────────────────────',
    line('🔖 Order #', order.orderNumber),
    line('💳 TrxID',   order.trxId),
    '─────────────────────',
    '⏰ ' + new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' }),
  ].filter(Boolean).join('\n');

  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    TG_CHAT_ID,
        text:       msg,
        parse_mode: 'HTML'
      })
    });
  } catch (e) {
    console.error('Telegram send failed:', e);
  }
}

/* ---------------------------------------------------------
   8. TRACK ORDER
--------------------------------------------------------- */
const trackModal  = document.getElementById('trackModal');
const trackForm   = document.getElementById('trackForm');
const trackResult = document.getElementById('trackResult');

function openTrackModal(){
  trackResult.innerHTML = '';
  trackForm.reset();
  trackModal.classList.remove('hidden');
}
document.getElementById('trackOrderBtn').addEventListener('click', openTrackModal);
document.getElementById('footerTrackOrder').addEventListener('click', (e) => { e.preventDefault(); openTrackModal(); });
document.getElementById('trackModalClose').addEventListener('click', () => trackModal.classList.add('hidden'));
trackModal.addEventListener('click', (e) => { if(e.target === trackModal) trackModal.classList.add('hidden'); });

trackForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const orderNumber = new FormData(trackForm).get('orderNumber').trim().toUpperCase();
  const all = JSON.parse(localStorage.getItem('matrixTopupOrders') || '{}');
  const order = all[orderNumber];

  if(!order){
    trackResult.innerHTML = `<p>No order found on this device for <strong>${orderNumber}</strong>. Orders are only saved on the device/browser they were placed from.</p>`;
    return;
  }

  trackResult.innerHTML = `
    <div class="track-hit">
      <div>Order: <strong>${orderNumber}</strong></div>
      <div>Game: ${order.game}</div>
      <div>Package: ${order.pkg}</div>
      <div>Amount: ${order.price} Taka</div>
      <div>TrxID: ${order.trxId}</div>
      <div>Placed: ${new Date(order.savedAt).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}</div>
    </div>
  `;
});

/* ---------------------------------------------------------
   9. VOUCHVAULT FEED
--------------------------------------------------------- */
async function loadVouchVault(){
  const container = document.getElementById('vvCards');

  // NOTE: VouchVault does not currently expose a public read API for
  // client-side fetching. Replace VOUCHVAULT_API_URL below with the real
  // endpoint once you have one (check VouchVault's dashboard/docs for an
  // embed or API option), or manually curate the fallback list below.
  const VOUCHVAULT_API_URL = null;

  const fallbackVouches = [
    { name: 'Rakib H.',  stars: 5, text: 'Robux delivered in under 10 minutes, smooth bKash payment. Trusted seller!' },
    { name: 'Farzana A.', stars: 5, text: 'Ordered COD CP twice now, both times fast and exactly as described.' },
    { name: 'Tanvir S.', stars: 5, text: 'Got my RDR2 key instantly after payment confirmation. Recommended.' },
  ];

  try{
    if(!VOUCHVAULT_API_URL) throw new Error('No VouchVault API configured yet');
    const res = await fetch(VOUCHVAULT_API_URL);
    if(!res.ok) throw new Error('VouchVault fetch failed');
    const data = await res.json();
    renderVouches(container, data);
  }catch(err){
    // Fall back to curated vouches until a live API is wired up.
    renderVouches(container, fallbackVouches);
  }
}

function renderVouches(container, vouches){
  if(!vouches || !vouches.length){
    container.innerHTML = `<p class="vouch-loading">No vouches to show yet.</p>`;
    return;
  }
  container.innerHTML = vouches.map(v => `
    <div class="vouch-card">
      <div class="vouch-name">${v.name}</div>
      <div class="vouch-stars">${'⭐'.repeat(v.stars || 5)}</div>
      <p class="vouch-text">${v.text}</p>
    </div>
  `).join('');
}
loadVouchVault();

/* ---------------------------------------------------------
   10. MISC
--------------------------------------------------------- */
document.getElementById('year').textContent = new Date().getFullYear();
