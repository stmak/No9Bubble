/**
 * Favourites Renderer - Renders the favourites section from menu data
 */

// Favourite items configuration (category:id index)
const FAVOURITES = [
  { cat: 'brown-sugar', idx: 0, tag: '★ No.1 seller' },
  { cat: 'waffle', idx: 1, tag: '🍌 Loaded' },
  { cat: 'soft-serve', idx: 0, tag: '🍦 Swirled' }
];

// Render favourites section
function renderFavourites() {
  const favGridEl = document.getElementById('favGrid');
  if (!favGridEl) return;
  
  const MENU = window.MenuRenderer.getMenu();
  if (!MENU || MENU.length === 0) {
    favGridEl.innerHTML = '<p>Loading favourites...</p>';
    return;
  }
  
  const favouritesHtml = FAVOURITES.map(fav => {
    const category = MENU.find(c => c.id === fav.cat);
    if (!category) return '';
    
    const item = category.items[fav.idx];
    if (!item) return '';
    
    const sizes = item.s || category.sizes;
    const priceTxt = sizes.length > 1 
      ? sizes.map(x => x[0] + ' £' + x[1].toFixed(2)).join(' · ') 
      : '£' + sizes[0][1].toFixed(2);
    
    // Use image if available, otherwise use placeholder
    const imageUrl = item.image || `cms/images/${category.id}-${fav.idx + 1}.png`;
    
    return `
      <article class="fav">
        <div class="ph">
          <span class="tag">${fav.tag}</span>
          <img src="${imageUrl}" alt="${item.n}" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(item.n)}';">
        </div>
        <div class="bd">
          <h3>${item.n}</h3>
          <p>${item.d || ''}</p>
          <div class="row">
            <span class="price">${priceTxt}</span>
            <button class="addbtn" data-add="${fav.cat}:${fav.idx}">Add +</button>
          </div>
        </div>
      </article>`;
  }).join('');
  
  favGridEl.innerHTML = favouritesHtml;
}

// Initialize favourites
function initFavourites() {
  // Wait for menu to be loaded
  const checkMenu = setInterval(() => {
    if (window.MenuRenderer && window.MenuRenderer.getMenu().length > 0) {
      clearInterval(checkMenu);
      renderFavourites();
    }
  }, 100);
  
  // Timeout after 5 seconds
  setTimeout(() => clearInterval(checkMenu), 5000);
}

// Export for use in other scripts
window.FavouritesRenderer = {
  init: initFavourites,
  render: renderFavourites
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFavourites);
} else {
  initFavourites();
}
