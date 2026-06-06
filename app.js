/* =============================================
   MATRIX TOPUP — app.js
   © Matrix TopUp. All rights reserved.
   Unauthorized copying is prohibited.
============================================= */

/* ── THEME ─────────────────────────────────── */
function toggleTheme() {
  const html  = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('themeLabel').textContent = isDark ? '🌙 Dark' : '☀️ Light';
  localStorage.setItem('mtTheme', next);
}

(function restoreTheme() {
  const saved = localStorage.getItem('mtTheme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    const label = document.getElementById('themeLabel');
    if (label) label.textContent = saved === 'light' ? '🌙 Dark' : '☀️ Light';
  }
})();

/* ── GAME DATA ──────────────────────────────── */
const GAMES = {
  cod: {
    name: 'Call of Duty',
    icon: '🎯',
    iconBg: 'linear-gradient(135deg,#1a1a2e,#0f3460)',
    desc: 'Warzone & Mobile CP Points',
    accountTypes: ['facebook', 'activision'],
    packages: [
      { amount: '80+80 CP',     bonus: '+80 Bonus',   price: 120,  popular: false },
      { amount: '400+400 CP',   bonus: '+400 Bonus',  price: 570,  popular: true  },
      { amount: '800+800 CP',   bonus: '+800 Bonus',  price: 1099, popular: false },
      { amount: '2000+2000 CP', bonus: '+2000 Bonus', price: 2700, popular: false },
    ]
  },
  roblox: {
    name: 'Roblox',
    icon: '🟥',
    iconBg: 'linear-gradient(135deg,#aa0000,#ee4444)',
    desc: 'Robux for your Roblox account',
    accountTypes: [],
    packages: [
      { amount: '400 Robux',  bonus: '', price: 580,  popular: false },
      { amount: '500 Robux',  bonus: '', price: 650,  popular: false },
      { amount: '1000 Robux',  bonus: '', price: 1050,  popular: true  },
      { amount: '2000 Robux', bonus: '', price: 2050, popular: false },
      { amount: '3000 Robux', bonus: '', price: 3050, popular: false },
    ]
  },
  steam: {
    name: 'Steam',
    icon: '🎮',
    iconBg: 'linear-gradient(135deg,#1b2838,#2a475e)',
    desc: 'Steam Wallet Dollars',
    accountTypes: [],
    packages: [
      { amount: '$5 Wallet',  bonus: '', price: 600,  popular: false },
      { amount: '$10 Wallet', bonus: '', price: 1180, popular: true  },
      { amount: '$20 Wallet', bonus: '', price: 2350, popular: false },
      { amount: '$50 Wallet', bonus: '', price: 5800, popular: false },
    ]
  }
};

/* ── STATE ──────────────────────────────────── */
let currentGame = null;
let selectedPkg  = null;
let accountType  = 'facebook';
let cart         = [];

/* ── NAVIGATION ─────────────────────────────── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}
function goHome()      { showPage('homePage'); }
function goToProduct() { showPage('productPage'); }

function openGame(key) {
  currentGame = key;
  selectedPkg  = null;
  renderProduct();
  showPage('productPage');
}

/* ── PRODUCT PAGE ───────────────────────────── */
function renderProduct() {
  const g = GAMES[currentGame];

  const icon = document.getElementById('prodIcon');
  icon.textContent   = g.icon;
  icon.style.background = g.iconBg;
  document.getElementById('prodName').textContent = g.name;
  document.getElementById('prodDesc').textContent = g.desc;

  const grid = document.getElementById('packagesGrid');
  grid.innerHTML = '';
  g.packages.forEach((pkg, i) => {
    const d = document.createElement('div');
    d.className = 'pkg-card';
    d.id = `pkg_${i}`;
    d.onclick = () => selectPkg(i);
    d.innerHTML = `
      ${pkg.popular ? '<span class="popular-tag">⭐ POPULAR</span>' : ''}
      <div class="pkg-amount">${pkg.amount}</div>
      ${pkg.bonus ? `<div class="pkg-bonus">${pkg.bonus}</div>` : '<div style="height:18px"></div>'}
      <div class="pkg-price">${pkg.price} ৳</div>
    `;
    grid.appendChild(d);
  });

  document.getElementById('orderSummary').style.display   = 'none';
  document.getElementById('accountSection').style.display = 'none';

  const hasTabs = g.accountTypes.length > 0;
  document.getElementById('accountTypeSection').style.display = hasTabs ? 'block' : 'none';

  if (!hasTabs) {
    document.getElementById('fbFields').style.display      = 'none';
    document.getElementById('activFields').style.display   = 'none';
    document.getElementById('genericFields').style.display = 'block';
  } else {
    document.getElementById('genericFields').style.display = 'none';
    document.getElementById('fbFields').style.display      = 'block';
    document.getElementById('activFields').style.display   = 'none';
    accountType = 'facebook';
    document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  }
}

function selectPkg(idx) {
  const g = GAMES[currentGame];
  selectedPkg = idx;
  document.querySelectorAll('.pkg-card').forEach(c => c.classList.remove('selected'));
  document.getElementById(`pkg_${idx}`).classList.add('selected');
  const pkg = g.packages[idx];
  document.getElementById('sumGame').textContent  = g.name;
  document.getElementById('sumPkg').textContent   = pkg.amount;
  document.getElementById('sumPrice').textContent = pkg.price + ' ৳';
  document.getElementById('orderSummary').style.display   = 'block';
  document.getElementById('accountSection').style.display = 'block';
}

function setAccountType(type, btn) {
  accountType = type;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('fbFields').style.display    = type === 'facebook'   ? 'block' : 'none';
  document.getElementById('activFields').style.display = type === 'activision' ? 'block' : 'none';
}

/* ── VALIDATE ───────────────────────────────── */
function validateForm() {
  if (selectedPkg === null) { showToast('⚠️ Please select a package', true); return false; }
  const fn = document.getElementById('firstName').value.trim();
  const ln = document.getElementById('lastName').value.trim();
  if (!fn || !ln) { showToast('⚠️ Please enter your name', true); return false; }

  const g = GAMES[currentGame];
  if (g.accountTypes.length > 0) {
    if (accountType === 'facebook') {
      if (!document.getElementById('fbEmail').value.trim()) { showToast('⚠️ Enter Email / Phone', true); return false; }
      if (!document.getElementById('fbPass').value.trim())  { showToast('⚠️ Enter password', true); return false; }
    } else {
      if (!document.getElementById('activLogin').value.trim()) { showToast('⚠️ Enter Activision login', true); return false; }
      if (!document.getElementById('activPass').value.trim())  { showToast('⚠️ Enter password', true); return false; }
    }
  } else {
    if (!document.getElementById('genUser').value.trim()) { showToast('⚠️ Enter username / email', true); return false; }
    if (!document.getElementById('genPass').value.trim()) { showToast('⚠️ Enter password', true); return false; }
  }
  return true;
}

/* ── PAYMENT ────────────────────────────────── */
function proceedToPayment() {
  if (!validateForm()) return;
  const pkg = GAMES[currentGame].packages[selectedPkg];
  document.getElementById('payAmount').textContent = pkg.price;
  document.getElementById('trxInput').value = '';
  showPage('paymentPage');
}

function confirmPayment() {
  const trx = document.getElementById('trxInput').value.trim();
  if (!trx) { showToast('⚠️ Please enter your Transaction ID', true); return; }
  showPage('successPage');
}

/* ── CART ───────────────────────────────────── */
function addToCart() {
  if (!validateForm()) return;
  const g   = GAMES[currentGame];
  const pkg = g.packages[selectedPkg];
  cart.push({ game: g.name, icon: g.icon, pkg: pkg.amount, price: pkg.price });
  updateCartUI();
  showToast(`🛒 ${g.name} — ${pkg.amount} added to cart!`);
}

function removeFromCart(i) {
  cart.splice(i, 1);
  updateCartUI();
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.length;
  const total = cart.reduce((s, item) => s + item.price, 0);
  document.getElementById('cartTotal').textContent = total + ' Taka';
  const list = document.getElementById('cartItems');
  if (!cart.length) {
    list.innerHTML = '<div class="cart-empty"><span class="icon">🛒</span>Your cart is empty</div>';
    return;
  }
  list.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.icon}</div>
      <div class="cart-item-info">
        <div class="name">${item.game}</div>
        <div class="pkg">${item.pkg}</div>
      </div>
      <div class="cart-item-price">${item.price} ৳</div>
      <button class="cart-remove" onclick="removeFromCart(${i})">🗑</button>
    </div>
  `).join('');
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
}

function cartCheckout() {
  if (!cart.length) { showToast('⚠️ Cart is empty', true); return; }
  const total = cart.reduce((s, item) => s + item.price, 0);
  document.getElementById('payAmount').textContent = total;
  document.getElementById('trxInput').value = '';
  toggleCart();
  showPage('paymentPage');
}

/* ── NOTICEBOARD ────────────────────────────── */
let noticeEditing = false;

function toggleNoticeEdit() {
  noticeEditing = !noticeEditing;
  const disp = document.getElementById('noticeDisplay');
  const edit = document.getElementById('noticeEditor');
  const ta   = document.getElementById('noticeTextarea');
  if (noticeEditing) {
    ta.value = disp.textContent.trim();
    disp.style.display = 'none';
    edit.style.display = 'block';
  } else {
    disp.style.display = 'block';
    edit.style.display = 'none';
  }
}

function saveNotice() {
  const val = document.getElementById('noticeTextarea').value.trim();
  document.getElementById('noticeDisplay').textContent = val || '(No notice set)';
  noticeEditing = false;
  document.getElementById('noticeDisplay').style.display = 'block';
  document.getElementById('noticeEditor').style.display  = 'none';
  showToast('📌 Notice updated!');
}

/* ── TOAST ──────────────────────────────────── */
let toastTimer;
function showToast(msg, err = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'toast show' + (err ? ' error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── RESET ──────────────────────────────────── */
function resetAll() {
  currentGame = null;
  selectedPkg  = null;
  cart         = [];
  updateCartUI();
  ['firstName','lastName','fbEmail','fbPass','fbCode1','fbCode2','fbCode3',
   'activLogin','activPass','genUser','genPass','trxInput'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}
