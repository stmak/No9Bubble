/**
 * Menu Renderer - Renders menu UI from loaded menu data
 */

const TP = 0.90; // topping price
const SAUCES = ['Chocolate', 'Strawberry', 'Lotus Biscoff'];

let MENU = [];

// Initialize the menu system
async function initMenu() {
  try {
    MENU = await window.MenuLoader.loadMenu();
    
    if (MENU.length === 0) {
      console.warn('No menu items loaded');
      return;
    }
    
    renderTicker();
    renderPills();
    renderMenuSections();
    renderToppings();
    setupPillScrolling();
    setupIntersectionObserver();
  } catch (error) {
    console.error('Failed to initialize menu:', error);
  }
}

// Render the ticker animation
function renderTicker() {
  const tickerEl = document.getElementById('ticker');
  if (!tickerEl) return;
  
  const items = MENU.map(c => c.cat + ' <i>' + c.emoji + '</i>').join('<span>✦</span>');
  tickerEl.innerHTML = '<span>' + items + '</span><span>✦</span><span>' + items + '</span><span>✦</span>';
}

// Render category pills
function renderPills() {
  const pillsEl = document.getElementById('pills');
  if (!pillsEl) return;
  
  pillsEl.innerHTML = MENU.map(c => 
    `<button class="pill" data-go="${c.id}">${c.emoji} ${c.cat}</button>`
  ).join('');
}

// Render all menu sections
function renderMenuSections() {
  const menuRoot = document.getElementById('menuRoot');
  if (!menuRoot) return;
  
  menuRoot.innerHTML = MENU.map((c, ci) => {
    const itemsHtml = c.items.map((it, ii) => {
      const sz = it.s || c.sizes;
      const priceTxt = sz.length > 1 
        ? sz.map(x => x[0] + ' £' + x[1].toFixed(2)).join(' · ') 
        : '£' + sz[0][1].toFixed(2);
      
      return `
        <article class="mcard">
          <div class="img-wrap">
            <img src="${it.image}" alt="${it.n}" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(it.n)}';">
          </div>
          <div class="top">
            <div class="tile">${it.e}</div>
            <h4>${it.n}</h4>
          </div>
          ${it.d ? '<p>' + it.d + '</p>' : '<p>&nbsp;</p>'}
          <div class="row">
            <span class="price">${priceTxt}</span>
            <button class="plusbtn" data-add="${c.id}:${ii}" aria-label="Add ${it.n}">+</button>
          </div>
        </article>`;
    }).join('');
    
    return `
      <div class="msec" id="${c.id}">
        <div class="mhead">
          <span class="emo">${c.emoji}</span>
          <h3>${c.cat}</h3>
          <small>${c.note}</small>
        </div>
        <div class="mgrid">
          ${itemsHtml}
        </div>
      </div>`;
  }).join('');
}

// Render toppings chips
function renderToppings() {
  const topChipsEl = document.getElementById('topChips');
  if (!topChipsEl) return;
  
  const toppings = window.MenuLoader.config.toppings;
  topChipsEl.innerHTML = toppings.map(t => 
    `<span class="tchip">${t} <b>+90p</b></span>`
  ).join('');
}

// Setup pill click handlers for scrolling
function setupPillScrolling() {
  document.addEventListener('click', e => {
    const p = e.target.closest('.pill');
    if (p) {
      const targetId = p.dataset.go;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// Setup intersection observer for active pill highlighting
function setupIntersectionObserver() {
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.pill').forEach(p => {
          p.classList.toggle('on', p.dataset.go === entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  
  MENU.forEach(c => {
    const el = document.getElementById(c.id);
    if (el) secObs.observe(el);
  });
}

// Helper function to find category by ID
window.findCat = function(id) {
  return MENU.find(c => c.id === id);
};

// Format price as GBP
window.gbp = function(n) {
  return '£' + n.toFixed(2);
};

// Export for use in other scripts
window.MenuRenderer = {
  init: initMenu,
  getMenu: () => MENU,
  getToppingPrice: () => TP,
  getSauces: () => SAUCES
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMenu);
} else {
  initMenu();
}
