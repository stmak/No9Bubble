/**
 * Item Modal - Handles the item customization modal
 */

let M = null; // current modal state

// Open item modal
function openModal(ref) {
  const [cid, idx] = ref.split(':');
  const cat = window.findCat(cid);
  if (!cat) return;
  
  const item = cat.items[+idx];
  const sizes = item.s || cat.sizes;
  const opts = cat.opts || {};
  
  M = {
    cat,
    item,
    sizes,
    opts,
    size: 0,
    tops: new Set(),
    sauce: 0,
    oat: false,
    hot: false,
    ice: false,
    qty: 1
  };
  
  document.getElementById('mEmoji').textContent = item.e;
  document.getElementById('mName').textContent = item.n;
  
  let html = '';
  
  // Size selection
  if (sizes.length > 1) {
    html += '<div class="optlabel">Size</div><div class="szrow">' +
      sizes.map((s, i) => 
        `<button class="szchip${i === 0 ? ' on' : ''}" data-size="${i}">${s[0]}<small>£${s[1].toFixed(2)}</small></button>`
      ).join('') + '</div>';
  }
  
  // Sauce selection
  if (opts.sauce) {
    const sauces = window.MenuRenderer.getSauces();
    html += '<div class="optlabel">Choose your sauce (included)</div><div class="szrow">' +
      sauces.map((s, i) => 
        `<button class="szchip${i === 0 ? ' on' : ''}" data-sauce="${i}">${s}</button>`
      ).join('') + '</div>';
  }
  
  // Toppings selection
  if (opts.toppings) {
    const toppings = window.MenuLoader.config.toppings;
    const tp = window.MenuRenderer.getToppingPrice();
    html += `<div class="optlabel">Toppings · +${tp.toFixed(2)}p each</div><div class="tpgrid">' +
      toppings.map((t, i) => `<button class="tp" data-top="${i}">${t}</button>`).join('') + '</div>';
  }
  
  // Special options (oat milk, hot, ice cream)
  html += '<div class="swrow">';
  if (opts.oat) html += '<label><input type="checkbox" data-x="oat"> 🌱 Oat milk +50p</label>';
  if (opts.hot) html += '<label><input type="checkbox" data-x="hot"> 🔥 Go hot +20p</label>';
  if (opts.ice) html += '<label><input type="checkbox" data-x="ice"> 🍦 Add soft serve +£1.50</label>';
  html += '</div>';
  
  document.getElementById('mBody').innerHTML = html;
  document.getElementById('qVal').textContent = 1;
  calcModal();
  document.getElementById('modal').classList.add('show');
}

// Calculate modal total
function unitPrice() {
  if (!M) return 0;
  let p = M.sizes[M.size][1];
  p += M.tops.size * window.MenuRenderer.getToppingPrice();
  if (M.oat) p += 0.5;
  if (M.hot) p += 0.2;
  if (M.ice) p += 1.5;
  return Math.round(p * 100) / 100;
}

function calcModal() {
  const totalEl = document.getElementById('mTotal');
  if (totalEl && M) {
    totalEl.textContent = '£' + (unitPrice() * M.qty).toFixed(2);
  }
}

// Setup modal event listeners
function setupModalListeners() {
  // Body click handlers (size, sauce, toppings)
  document.getElementById('mBody')?.addEventListener('click', e => {
    const sz = e.target.closest('[data-size]');
    const sc = e.target.closest('[data-sauce]');
    const tp = e.target.closest('[data-top]');
    
    if (sz) {
      M.size = +sz.dataset.size;
      sz.parentNode.querySelectorAll('.szchip').forEach(b => 
        b.classList.toggle('on', b === sz)
      );
      calcModal();
    }
    
    if (sc) {
      M.sauce = +sc.dataset.sauce;
      sc.parentNode.querySelectorAll('.szchip').forEach(b => 
        b.classList.toggle('on', b === sc)
      );
    }
    
    if (tp) {
      const i = +tp.dataset.top;
      if (M.tops.has(i)) {
        M.tops.delete(i);
      } else {
        M.tops.add(i);
      }
      tp.classList.toggle('on');
      calcModal();
    }
  });
  
  // Checkbox changes
  document.getElementById('mBody')?.addEventListener('change', e => {
    const x = e.target.dataset.x;
    if (!x) return;
    M[x] = e.target.checked;
    calcModal();
  });
  
  // Quantity buttons
  document.getElementById('qPlus')?.addEventListener('click', () => {
    if (M) {
      M.qty = Math.min(20, M.qty + 1);
      document.getElementById('qVal').textContent = M.qty;
      calcModal();
    }
  });
  
  document.getElementById('qMinus')?.addEventListener('click', () => {
    if (M) {
      M.qty = Math.max(1, M.qty - 1);
      document.getElementById('qVal').textContent = M.qty;
      calcModal();
    }
  });
  
  // Close button
  document.getElementById('mClose')?.addEventListener('click', () => {
    document.getElementById('modal').classList.remove('show');
  });
  
  // Click outside to close
  document.getElementById('modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modal')) {
      document.getElementById('modal').classList.remove('show');
    }
  });
  
  // Add to cart button
  document.getElementById('mAdd')?.addEventListener('click', () => {
    if (!M) return;
    
    const meta = [];
    if (M.sizes.length > 1) meta.push(M.sizes[M.size][0]);
    
    if (M.opts.sauce) {
      const sauces = window.MenuRenderer.getSauces();
      meta.push(sauces[M.sauce] + ' sauce');
    }
    
    const extras = [];
    if (M.oat) extras.push('oat milk');
    if (M.hot) extras.push('served hot');
    if (M.ice) extras.push('+ soft serve');
    
    const toppingsList = [...M.tops].map(i => window.MenuLoader.config.toppings[i]);
    const unit = unitPrice();
    
    const key = [
      M.cat.id,
      M.cat.items.indexOf(M.item),
      M.size,
      M.sauce,
      [...M.tops].sort().join('.'),
      extras.join('.')
    ].join('|');
    
    const lineItem = {
      key,
      name: M.item.n,
      emoji: M.item.e,
      meta: [...meta, ...extras].join(' · '),
      tops: toppingsList,
      unit,
      qty: M.qty
    };
    
    // Always use window.addToCart which is set by cart.js
    if (typeof window.addToCart === 'function') {
      window.addToCart(lineItem);
    } else {
      console.error('addToCart function not available');
    }
    
    document.getElementById('modal').classList.remove('show');
  });
  
  // Add buttons from menu/favourites - use event delegation on document
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) {
      e.preventDefault();
      e.stopPropagation();
      openModal(a.dataset.add);
    }
  }, true);
}

// Initialize modal system
function initModal() {
  setupModalListeners();
}

// Export for use in other scripts
window.ItemModal = {
  init: initModal,
  openModal,
  unitPrice,
  calcModal
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModal);
} else {
  initModal();
}
