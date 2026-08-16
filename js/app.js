// NO.9 Bubble Tea - Main Application

class App {
  constructor() {
    this.menuItems = [];
    this.cart = [];
    this.currentItem = null;
    this.quantity = 1;
    this.selectedSize = 'Regular';
    this.selectedSugar = '0%';
    this.selectedIce = '0%';
    
    this.init();
  }

  async init() {
    await this.loadMenu();
    this.setupEventListeners();
    this.renderMenu('all');
    this.renderSignatures();
    this.setupRevealAnimation();
  }

  async loadMenu() {
    try {
      const response = await fetch('cms/data/menu.csv');
      const csvText = await response.text();
      this.menuItems = this.parseCSV(csvText);
    } catch (error) {
      console.error('Error loading menu:', error);
      this.menuItems = this.getFallbackMenu();
    }
  }

  parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const item = {};
      
      headers.forEach((header, index) => {
        let value = values[index] ? values[index].trim() : '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        item[header] = value;
      });
      
      return item;
    });
  }

  getFallbackMenu() {
    return [
      { id: 'brown-sugar-1', name: 'Brown Sugar Bubble Milk Tea', category: 'brown-sugar', price: '6.50', description: 'Sweet & creamy, tiger-striped with warm brown sugar and loaded with chewy pearls.' },
      { id: 'brown-sugar-2', name: 'Brown Sugar Fresh Milk', category: 'brown-sugar', price: '6.50', description: 'Pure fresh milk with brown sugar pearls, no tea.' },
      { id: 'milk-tea-1', name: 'Classic Bubble Milk Tea', category: 'milk-tea', price: '6.50', description: 'The original favourite — creamy milk tea with chewy pearls.' },
      { id: 'milk-tea-2', name: 'Taro Bubble Milk Tea', category: 'milk-tea', price: '6.50', description: 'Pastel-purple comfort in a cup — smooth, floral, dreamy.' },
      { id: 'milk-tea-3', name: 'Bubble Milk Green Tea', category: 'milk-tea', price: '6.50', description: 'A timeless favourite — rich, creamy & perfectly paired with pearls.' },
      { id: 'fruit-tea-1', name: 'Strawberry Iced Fruit Tea', category: 'fruit-tea', price: '6.50', description: 'Ruby-red, refreshing & packed with real berry slices.' },
      { id: 'fruit-tea-2', name: 'Green Apple Iced Fruit Tea', category: 'fruit-tea', price: '6.50', description: 'Crisp, zingy & ice-cold — the refresh button of teas.' },
      { id: 'slushies-1', name: 'Mango Slushie', category: 'slushies', price: '5.70', description: 'A tropical paradise in a cup! Blended icy & bright.' },
      { id: 'slushies-2', name: 'Strawberry Slushie', category: 'slushies', price: '5.70', description: 'Berry-sweet & icy cool — summer in a cup.' },
      { id: 'waffles-1', name: 'Banana Nutella Bubble Waffle', category: 'waffles', price: '6.50', description: 'Crispy bubbles, soft-serve, banana & Nutella drizzle.' },
      { id: 'waffles-2', name: 'Original Bubble Waffle', category: 'waffles', price: '5.50', description: 'Golden crispy bubbles with your choice of topping.' },
      { id: 'milkshakes-1', name: 'Oreo Milkshake', category: 'milkshakes', price: '6.80', description: 'Cookies & cream, blended thick.' },
      { id: 'milkshakes-2', name: 'Strawberry Milkshake', category: 'milkshakes', price: '6.80', description: 'Berry-sweet, velvety & topped with cream.' },
      { id: 'milkshakes-3', name: 'Maltesers Milkshake', category: 'milkshakes', price: '6.80', description: 'Creamy, rich & crowned with whipped malt crunch.' },
      { id: 'coffee-1', name: 'No.9 Coffee', category: 'coffee', price: '5.80', description: 'Rich & smooth, hot or cold.' },
      { id: 'coffee-2', name: 'Caramel Coffee', category: 'coffee', price: '5.80', description: 'Buttery caramel swirled through smooth coffee.' },
      { id: 'snacks-1', name: 'Gyoza Dumplings (5)', category: 'snacks', price: '6.50', description: 'Chicken & veg dumplings, golden and moreish.' },
      { id: 'snacks-2', name: 'Crispy Chicken Bites (4)', category: 'snacks', price: '6.50', description: 'Crunchy on the outside, juicy in the middle.' },
    ];
  }

  setupEventListeners() {
    // Mobile menu
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Menu tabs
    const menuTabs = document.getElementById('menuTabs');
    if (menuTabs) {
      menuTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (btn) {
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderMenu(btn.dataset.filter);
        }
      });
    }

    // Cart
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartPanel = document.getElementById('cartPanel');

    if (cartBtn && cartSidebar) {
      cartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('hidden');
        setTimeout(() => cartPanel.classList.remove('translate-x-full'), 10);
      });
    }

    if (closeCart && cartSidebar) {
      closeCart.addEventListener('click', () => {
        cartPanel.classList.add('translate-x-full');
        setTimeout(() => cartSidebar.classList.add('hidden'), 300);
      });
    }

    if (cartOverlay && cartSidebar) {
      cartOverlay.addEventListener('click', () => {
        cartPanel.classList.add('translate-x-full');
        setTimeout(() => cartSidebar.classList.add('hidden'), 300);
      });
    }

    // Modal
    const closeModal = document.getElementById('closeModal');
    const itemModal = document.getElementById('itemModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');

    if (closeModal && itemModal) {
      closeModal.addEventListener('click', () => this.closeModal());
    }

    if (modalOverlay && itemModal) {
      modalOverlay.addEventListener('click', () => this.closeModal());
    }

    // Size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => {
          b.classList.remove('active', 'bg-navy', 'text-cream');
          b.classList.add('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
        });
        btn.classList.remove('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
        btn.classList.add('active', 'bg-navy', 'text-cream');
        this.selectedSize = btn.dataset.size;
      });
    });

    // Sugar buttons
    document.querySelectorAll('.sugar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sugar-btn').forEach(b => {
          b.classList.remove('active', 'bg-navy', 'text-cream');
          b.classList.add('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
        });
        btn.classList.remove('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
        btn.classList.add('active', 'bg-navy', 'text-cream');
        this.selectedSugar = btn.dataset.sugar;
      });
    });

    // Ice buttons
    document.querySelectorAll('.ice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ice-btn').forEach(b => {
          b.classList.remove('active', 'bg-navy', 'text-cream');
          b.classList.add('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
        });
        btn.classList.remove('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
        btn.classList.add('active', 'bg-navy', 'text-cream');
        this.selectedIce = btn.dataset.ice;
      });
    });

    // Quantity
    const decreaseQty = document.getElementById('decreaseQty');
    const increaseQty = document.getElementById('increaseQty');
    const quantityDisplay = document.getElementById('quantityDisplay');

    if (decreaseQty) {
      decreaseQty.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          quantityDisplay.textContent = this.quantity;
        }
      });
    }

    if (increaseQty) {
      increaseQty.addEventListener('click', () => {
        this.quantity++;
        quantityDisplay.textContent = this.quantity;
      });
    }

    // Add to cart
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => this.addToCart());
    }

    // Checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        alert('Checkout functionality coming soon! 🧋');
      });
    }

    // Reveal on scroll
    this.setupRevealAnimation();
  }

  renderMenu(filter = 'all') {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    let filteredItems = this.menuItems;
    if (filter !== 'all') {
      filteredItems = this.menuItems.filter(item => item.category === filter);
    }

    menuGrid.innerHTML = filteredItems.map(item => {
      const basePrice = parseFloat(item.price) || 0;
      const displayPrice = basePrice.toFixed(2);
      const imageUrl = `cms/images/${item.id}.png`;
      
      return `
        <article class="menu-card reveal group bg-milk rounded-3xl border-2 border-navy/10 shadow-card overflow-hidden hover:-translate-y-1.5 transition-transform pop">
          <div class="relative aspect-[4/3] overflow-hidden">
            <img loading="lazy" src="${imageUrl}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23F2A3B1%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Fredoka%22 font-size=%2218%22 fill=%22%231E2A4A%22%3E${encodeURIComponent(item.name)}%3C/text%3E%3C/svg%3E'" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-5">
            <div class="flex justify-between gap-3 font-display font-semibold text-lg">
              <span>${item.name}</span>
              <span class="text-caramel-deep">£${displayPrice}</span>
            </div>
            <p class="mt-1.5 text-sm text-navy/65 font-medium">${item.description || ''}</p>
            <button class="open-modal mt-4 w-full font-display font-semibold text-sm bg-blush text-navy-deep py-3 rounded-xl sticker hover:-translate-y-0.5 transition-transform" data-id="${item.id}">
              Add +
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Add event listeners to new buttons
    menuGrid.querySelectorAll('.open-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.id;
        const item = this.menuItems.find(i => i.id === itemId);
        if (item) this.openModal(item);
      });
    });

    // Trigger reveal animation for new items
    setTimeout(() => this.setupRevealAnimation(), 100);
  }

  renderSignatures() {
    const signaturesGrid = document.getElementById('signaturesGrid');
    if (!signaturesGrid) return;

    const signatureIds = ['brown-sugar-1', 'waffles-1', 'slushies-1'];
    const signatures = signatureIds.map(id => this.menuItems.find(i => i.id === id)).filter(Boolean);

    if (signatures.length === 0) {
      // Fallback signatures
      const fallbackSigs = this.menuItems.slice(0, 3);
      signaturesGrid.innerHTML = fallbackSigs.map(item => this.renderSignatureCard(item)).join('');
    } else {
      signaturesGrid.innerHTML = signatures.map(item => this.renderSignatureCard(item)).join('');
    }

    setTimeout(() => this.setupRevealAnimation(), 100);
  }

  renderSignatureCard(item) {
    const basePrice = parseFloat(item.price) || 0;
    const displayPrice = basePrice.toFixed(2);
    const imageUrl = `cms/images/${item.id}.png`;

    return `
      <article class="reveal group bg-milk rounded-[2rem] p-4 pb-7 border-2 border-navy/10 shadow-card hover:-translate-y-2 hover:rotate-1 transition-transform">
        <div class="rounded-[1.6rem] overflow-hidden aspect-square">
          <img loading="lazy" src="${imageUrl}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23C08048%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Fredoka%22 font-size=%2220%22 fill=%22%23FFFBF2%22%3E${encodeURIComponent(item.name)}%3C/text%3E%3C/svg%3E'" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <div class="px-3 pt-5">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-display font-semibold text-xl">${item.name}</h3>
            <span class="font-display font-bold text-caramel-deep text-lg">£${displayPrice}</span>
          </div>
          <p class="mt-2 text-sm text-navy/65 font-medium">${item.description || ''}</p>
        </div>
      </article>
    `;
  }

  openModal(item) {
    this.currentItem = item;
    this.quantity = 1;
    this.selectedSize = 'Regular';
    this.selectedSugar = '0%';
    this.selectedIce = '0%';

    const itemModal = document.getElementById('itemModal');
    const modalContent = document.getElementById('modalContent');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');
    const quantityDisplay = document.getElementById('quantityDisplay');

    if (!itemModal) return;

    const imageUrl = `cms/images/${item.id}.png`;
    modalImage.src = imageUrl;
    modalImage.onerror = function() {
      this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 450%22%3E%3Crect fill=%22%23F2A3B1%22 width=%22800%22 height=%22450%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Fredoka%22 font-size=%2232%22 fill=%22%231E2A4A%22%3E' + encodeURIComponent(item.name) + '%3C/text%3E%3C/svg%3E';
    };

    modalTitle.textContent = item.name;
    modalDescription.textContent = item.description || '';
    const basePrice = parseFloat(item.price) || 0;
    modalPrice.textContent = `£${basePrice.toFixed(2)}`;
    quantityDisplay.textContent = '1';

    // Reset buttons
    document.querySelectorAll('.size-btn, .sugar-btn, .ice-btn').forEach(btn => {
      btn.classList.remove('active', 'bg-navy', 'text-cream');
      btn.classList.add('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
    });

    // Set first button of each type as active
    const firstSize = document.querySelector('.size-btn[data-size="Regular"]');
    const firstSugar = document.querySelector('.sugar-btn[data-sugar="0%"]');
    const firstIce = document.querySelector('.ice-btn[data-ice="0%"]');

    if (firstSize) {
      firstSize.classList.remove('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
      firstSize.classList.add('active', 'bg-navy', 'text-cream');
    }
    if (firstSugar) {
      firstSugar.classList.remove('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
      firstSugar.classList.add('active', 'bg-navy', 'text-cream');
    }
    if (firstIce) {
      firstIce.classList.remove('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
      firstIce.classList.add('active', 'bg-navy', 'text-cream');
    }

    itemModal.classList.remove('hidden');
    setTimeout(() => {
      modalContent.classList.remove('scale-95', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
  }

  closeModal() {
    const itemModal = document.getElementById('itemModal');
    const modalContent = document.getElementById('modalContent');

    if (!itemModal) return;

    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
      itemModal.classList.add('hidden');
    }, 300);
  }

  addToCart() {
    if (!this.currentItem) return;

    const basePrice = parseFloat(this.currentItem.price) || 0;
    let finalPrice = basePrice;

    if (this.selectedSize === 'Large') {
      finalPrice += 0.80;
    }

    const totalItemPrice = finalPrice * this.quantity;

    const cartItem = {
      id: this.currentItem.id + '-' + Date.now(),
      itemId: this.currentItem.id,
      name: this.currentItem.name,
      size: this.selectedSize,
      sugar: this.selectedSugar,
      ice: this.selectedIce,
      quantity: this.quantity,
      unitPrice: finalPrice,
      totalPrice: totalItemPrice,
      image: `cms/images/${this.currentItem.id}.png`
    };

    this.cart.push(cartItem);
    this.updateCartDisplay();
    this.closeModal();

    // Show cart
    const cartSidebar = document.getElementById('cartSidebar');
    const cartPanel = document.getElementById('cartPanel');
    if (cartSidebar && cartPanel) {
      cartSidebar.classList.remove('hidden');
      setTimeout(() => cartPanel.classList.remove('translate-x-full'), 10);
    }
  }

  removeFromCart(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.updateCartDisplay();
  }

  updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartItems) return;

    // Update count
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;

    // Update total
    const total = this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    if (cartTotal) cartTotal.textContent = `£${total.toFixed(2)}`;

    // Enable/disable checkout
    if (checkoutBtn) {
      checkoutBtn.disabled = this.cart.length === 0;
    }

    // Render items
    if (this.cart.length === 0) {
      cartItems.innerHTML = '<p class="text-center text-navy/50 font-medium py-12">Your cart is empty</p>';
    } else {
      cartItems.innerHTML = this.cart.map(item => `
        <div class="flex gap-4 bg-milk rounded-2xl p-4 border-2 border-navy/10">
          <img src="${item.image}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23F2A3B1%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl">
          <div class="flex-1">
            <h4 class="font-display font-semibold text-navy">${item.name}</h4>
            <p class="text-xs text-navy/60 mt-1">${item.size} · ${item.sugar} sugar · ${item.ice}</p>
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-navy/50">×${item.quantity}</span>
              <div class="flex items-center gap-2">
                <span class="font-display font-bold text-caramel-deep">£${item.totalPrice.toFixed(2)}</span>
                <button class="remove-item w-7 h-7 rounded-full bg-blush/20 hover:bg-blush/30 grid place-items-center transition-colors" data-id="${item.id}">
                  <svg class="w-4 h-4 text-navy" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      // Add remove listeners
      cartItems.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
          this.removeFromCart(btn.dataset.id);
        });
      });
    }
  }

  setupRevealAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
