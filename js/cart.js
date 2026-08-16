/**
 * Cart System - Handles shopping cart functionality
 */

const WHATSAPP_NUMBER = '447766628285';

let cart = [];

// Load cart from localStorage
function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem('no9cart') || '[]');
  } catch (e) {
    cart = [];
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('no9cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(line) {
  const ex = cart.find(l => l.key === line.key);
  if (ex) {
    ex.qty += line.qty;
  } else {
    cart.push(line);
  }
  saveCart();
  renderCart();
  bumpCartCount();
  showToast(line.name + ' added 🧋');
}

// Remove or decrease item from cart
function removeFromCart(index, qty = 1) {
  if (!cart[index]) return;
  
  cart[index].qty -= qty;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

// Clear cart
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

// Get cart total
function getCartTotal() {
  return cart.reduce((a, l) => a + l.unit * l.qty, 0);
}

// Get cart item count
function getCartCount() {
  return cart.reduce((a, l) => a + l.qty, 0);
}

// Render cart UI
function renderCart() {
  const body = document.getElementById('cartBody');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  const waSendBtn = document.getElementById('waSend');
  
  if (!body) return;
  
  const count = getCartCount();
  if (countEl) countEl.textContent = count;
  
  if (!cart.length) {
    body.innerHTML = `
      <div class="empty">
        <div class="big">🧋</div>
        <b>Your basket is empty</b>
        <br>
        <small>The boba is waiting…</small>
      </div>`;
  } else {
    body.innerHTML = cart.map((l, i) => `
      <div class="line">
        <div class="tile" style="width:42px;height:42px;border-radius:12px;background:#fff;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:1.2rem">${l.emoji}</div>
        <div class="info">
          <b>${l.name}</b>
          ${l.meta ? '<small>' + l.meta + '</small>' : ''}
          ${l.tops && l.tops.length ? '<small>+ ' + l.tops.join(', ') + '</small>' : ''}
          <span class="lp">£${(l.unit * l.qty).toFixed(2)}</span>
        </div>
        <div class="qty">
          <button data-q="-1" data-i="${i}" aria-label="Decrease">−</button>
          <span>${l.qty}</span>
          <button data-q="1" data-i="${i}" aria-label="Increase">+</button>
        </div>
      </div>`).join('');
  }
  
  const total = getCartTotal();
  if (totalEl) totalEl.textContent = '£' + total.toFixed(2);
  if (waSendBtn) waSendBtn.disabled = !cart.length;
}

// Bump animation for cart count
function bumpCartCount() {
  const c = document.getElementById('cartCount');
  if (!c) return;
  c.classList.remove('bump');
  void c.offsetWidth; // Force reflow
  c.classList.add('bump');
}

// Show toast notification
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2200);
}

// Open cart drawer
function openCart() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');
  if (drawer) drawer.classList.add('show');
  if (overlay) overlay.classList.add('show');
}

// Close cart drawer
function closeCart() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');
  if (drawer) drawer.classList.remove('show');
  if (overlay) overlay.classList.remove('show');
}

// Send order via WhatsApp
function sendOrderViaWhatsApp() {
  if (!cart.length) return;
  
  const name = document.getElementById('cName')?.value.trim() || '';
  const time = document.getElementById('cTime')?.value.trim() || '';
  const notes = document.getElementById('cNotes')?.value.trim() || '';
  const total = getCartTotal();
  
  let msg = '🧋 *NO.9 BUBBLE TEA — COLLECTION ORDER*\n';
  msg += '────────────────\n';
  if (name) msg += '👤 Name: ' + name + '\n';
  msg += '🕚 Pickup: ' + (time || 'ASAP') + '\n';
  msg += '────────────────\n';
  
  cart.forEach(l => {
    msg += '▪️ ' + l.qty + '× ' + l.name + (l.meta ? ' — ' + l.meta : '') + '\n';
    if (l.tops && l.tops.length) msg += '   Toppings: ' + l.tops.join(', ') + '\n';
    msg += '   £' + (l.unit * l.qty).toFixed(2) + '\n';
  });
  
  msg += '────────────────\n';
  msg += '💰 *TOTAL: £' + total.toFixed(2) + '*\n';
  if (notes) msg += '📝 Notes: ' + notes + '\n';
  msg += '\nSent from the NO.9 website 🐻';
  
  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
  showToast('Opening WhatsApp… 💬');
}

// Setup cart event listeners
function setupCartListeners() {
  // Cart body click handlers (qty buttons)
  document.getElementById('cartBody')?.addEventListener('click', e => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    const i = +b.dataset.i;
    const q = +b.dataset.q;
    removeFromCart(i, Math.abs(q));
  });
  
  // Cart open/close buttons
  document.getElementById('cartOpen')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('overlay')?.addEventListener('click', () => {
    closeCart();
    document.getElementById('modal')?.classList.remove('show');
  });
  
  // Escape key closes modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCart();
      document.getElementById('modal')?.classList.remove('show');
    }
  });
  
  // WhatsApp send button
  document.getElementById('waSend')?.addEventListener('click', sendOrderViaWhatsApp);
}

// Initialize cart system
function initCart() {
  loadCart();
  renderCart();
  setupCartListeners();
}

// Export for use in other scripts
window.CartSystem = {
  init: initCart,
  addToCart,
  removeFromCart,
  clearCart,
  getCartTotal,
  getCartCount,
  openCart,
  closeCart,
  sendOrderViaWhatsApp,
  renderCart
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCart);
} else {
  initCart();
}
