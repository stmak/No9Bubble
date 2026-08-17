// NO.9 Bubble Tea - Main Application (Optimized)

class App {
  constructor() {
    this.menuItems = [];
    this.cart = [];
    this.currentItem = null;
    this.quantity = 1;
    this.selectedSize = 'Regular';
    this.selectedSugar = '0%';
    this.selectedIce = '0%';
    
    // Cache DOM elements
    this.domCache = {};
    
    // IntersectionObserver singleton
    this.revealObserver = null;
    
    this.init();
  }

  async init() {
    this.cacheDOMElements();
    await this.loadMenu();
    this.setupEventListeners();
    this.renderMenu('all');
    this.renderSignatures();
    this.setupRevealAnimation();
    console.log('App initialized, menu items:', this.menuItems.length);
  }

  cacheDOMElements() {
    const ids = [
      'menuBtn', 'mobileMenu', 'menuTabs', 'cartBtn', 'cartSidebar',
      'closeCart', 'cartOverlay', 'cartPanel', 'closeModal', 'itemModal',
      'modalOverlay', 'modalContent', 'modalImage', 'modalTitle',
      'modalDescription', 'modalPrice', 'quantityDisplay', 'decreaseQty',
      'increaseQty', 'addToCartBtn', 'checkoutBtn', 'menuGrid',
      'signaturesGrid', 'cartItems', 'cartCount', 'cartTotal'
    ];
    
    ids.forEach(id => {
      this.domCache[id] = document.getElementById(id);
    });
  }

  async loadMenu() {
    try {
      const response = await fetch('cms/data/menu.csv');
      const csvText = await response.text();
      this.menuItems = this.parseCSV(csvText);
      console.log('Menu loaded from CSV:', this.menuItems.length, 'items');
      console.log('First few IDs:', this.menuItems.slice(0, 5).map(i => i.id));
    } catch (error) {
      console.error('Error loading menu:', error);
      this.menuItems = this.getFallbackMenu();
      console.log('Using fallback menu:', this.menuItems.length, 'items');
    }
  }

  parseCSV(csvText) {
    // Handle Windows line endings (CRLF)
    const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.trim().split('\n');
    
    // Parse header line
    const headers = this.parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());

    return lines.slice(1).map(line => {
      const values = this.parseCSVLine(line);
      
      const item = {};
      headers.forEach((header, index) => {
        item[header] = values[index] || '';
      });

      // Normalize price based on CSV structure - size_m contains the price
      if (item.size_m) {
        item.price = item.size_m;
      }
      if (!item.id) {
        item.id = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }

      return item;
    });
  }

  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    return values;
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
    // Mobile menu - using cached DOM elements
    const { menuBtn, mobileMenu, menuTabs, cartBtn, cartSidebar, closeCart, cartOverlay, cartPanel, 
            closeModal, itemModal, modalOverlay, decreaseQty, increaseQty, addToCartBtn, checkoutBtn } = this.domCache;
    
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      }, { passive: true });
    }

    // Menu tabs - optimized with event delegation
    if (menuTabs) {
      menuTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (btn) {
          const activeTab = menuTabs.querySelector('.tab-btn.active');
          if (activeTab) activeTab.classList.remove('active');
          btn.classList.add('active');
          this.renderMenu(btn.dataset.filter);
        }
      }, { passive: true });
    }

    // Cart - using cached references

    if (cartBtn && cartSidebar) {
      cartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('hidden');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => cartPanel.classList.remove('translate-x-full'));
        });
      }, { passive: true });
    }

    if (closeCart && cartSidebar) {
      closeCart.addEventListener('click', () => this.closeCart(), { passive: true });
    }

    if (cartOverlay && cartSidebar) {
      cartOverlay.addEventListener('click', () => this.closeCart(), { passive: true });
    }

    // Modal - using cached references (already destructured above)
    if (closeModal && itemModal) {
      closeModal.addEventListener('click', () => this.closeModal(), { passive: true });
    }

    if (modalOverlay && itemModal) {
      modalOverlay.addEventListener('click', () => this.closeModal(), { passive: true });
    }

    // Button toggle helper - optimized to avoid repeated queries
    const toggleButtonGroup = (selector, activeClass, inactiveClass, property) => {
      document.querySelectorAll(selector).forEach(btn => {
        btn.addEventListener('click', () => {
          const group = btn.parentElement.querySelectorAll(selector);
          group.forEach(b => {
            b.classList.remove(...activeClass.split(' '));
            b.classList.add(...inactiveClass.split(' '));
          });
          btn.classList.remove(...inactiveClass.split(' '));
          btn.classList.add(...activeClass.split(' '));
          this[property] = btn.dataset[property.toLowerCase()];
        }, { passive: true });
      });
    };

    // Size buttons - optimized with class list operations
    toggleButtonGroup('.size-btn', 'active bg-navy text-cream', 'bg-milk border-2 border-navy/15 text-navy', 'selectedSize');

    // Sugar buttons
    toggleButtonGroup('.sugar-btn', 'active bg-navy text-cream', 'bg-milk border-2 border-navy/15 text-navy', 'selectedSugar');

    // Ice buttons
    toggleButtonGroup('.ice-btn', 'active bg-navy text-cream', 'bg-milk border-2 border-navy/15 text-navy', 'selectedIce');

    // Quantity - using cached references (already destructured above)
    if (decreaseQty) {
      decreaseQty.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          quantityDisplay.textContent = this.quantity;
        }
      }, { passive: true });
    }

    if (increaseQty) {
      increaseQty.addEventListener('click', () => {
        this.quantity++;
        quantityDisplay.textContent = this.quantity;
      }, { passive: true });
    }

    // Add to cart
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => this.addToCart(), { passive: true });
    }

    // Checkout
    // Checkout - WhatsApp integration
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkoutViaWhatsApp(), { passive: true });
    }

    // Reveal on scroll
    this.setupRevealAnimation();
  }

  renderMenu(filter = 'all') {
    const menuGrid = this.domCache.menuGrid;
    if (!menuGrid) return;
    // Normalize filter to match CSV category names
    const categoryMap = {
      'all': 'all',
      'brown-sugar': 'Brown Sugar',
      'milk-tea': 'Milk',
      'fruit-tea': 'Fruit',
      'slushies': 'Slushie',
      'waffles': 'Waffle',
      'milkshakes': 'Shake',
      'coffee': 'Coffee',
      'snacks': ''
    };

    let filteredItems;
    if (filter === 'all') {
      filteredItems = this.menuItems;
    } else if (filter === 'snacks') {
      // Snacks not in CSV, show empty or fallback
      filteredItems = [];
    } else {
      const searchTerm = categoryMap[filter] || filter;
      filteredItems = this.menuItems.filter(item => 
        item.category && item.category.includes(searchTerm)
      );
    }
    // Use DocumentFragment for better performance when inserting multiple elements
    const fragment = document.createDocumentFragment();
    const tempContainer = document.createElement('div');
    
    tempContainer.innerHTML = filteredItems.map(item => {
      const basePrice = parseFloat(item.price) || 0;
      const displayPrice = basePrice.toFixed(2);
      const imageUrl = `cms/images/${item.id}.png`;
      
      return `
        <article class="menu-card reveal group bg-milk rounded-3xl border-2 border-navy/10 shadow-card overflow-hidden hover:-translate-y-1.5 transition-transform pop">
          <div class="relative aspect-[4/3] overflow-hidden">
            <img loading="lazy" src="${imageUrl}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23F2A3B1%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Fredoka%22 font-size=%2218%22 fill=%22%231E2A4A%22%3E${encodeURIComponent(item.name)}%3C/text%3E%3C/svg%3E'" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
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

    menuGrid.innerHTML = tempContainer.innerHTML;

    // Use event delegation for modal buttons - more efficient than adding listeners to each button
    menuGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.open-modal');
      if (btn && btn.dataset.id) {
        const item = this.menuItems.find(i => i.id === btn.dataset.id);
        if (item) this.openModal(item);
      }
    }, { passive: true });

    // Trigger reveal animation using requestAnimationFrame instead of setTimeout
    requestAnimationFrame(() => this.setupRevealAnimation());
  }

  renderSignatures() {
    const signaturesGrid = this.domCache.signaturesGrid;
    if (!signaturesGrid) {
      console.error('signaturesGrid element not found in DOM');
      return;
    }

    // Debug: log all menu item IDs
    console.log('All menu item IDs:', this.menuItems.map(i => i.id));
    console.log('Total menu items loaded:', this.menuItems.length);

    // Get popular items by ID first
    const signatureIds = ['brown-sugar-1', 'waffle-1', 'slushies-1'];
    let signatures = signatureIds.map(id => this.menuItems.find(i => i.id === id)).filter(Boolean);

    console.log('Signatures found by ID:', signatures.length, signatures.map(s => `${s.id}: ${s.name}`));

    // If specific IDs not found, get top items by different criteria
    if (signatures.length < 3) {
      // Get first item from Brown Sugar, Waffles, and Slushies categories
      const brownSugar = this.menuItems.find(i => i.category && (i.category.includes('Brown Sugar') || i.category.includes('brown-sugar')));
      const waffle = this.menuItems.find(i => i.category && (i.category.includes('Waffle') || i.category.includes('waffle')));
      const slushie = this.menuItems.find(i => i.category && (i.category.includes('Slushie') || i.category.includes('Slushies') || i.category.includes('slushie') || i.category.includes('slushies')));
      
      console.log('Fallback - Brown Sugar:', brownSugar ? `${brownSugar.id}: ${brownSugar.name}` : 'NOT FOUND');
      console.log('Fallback - Waffle:', waffle ? `${waffle.id}: ${waffle.name}` : 'NOT FOUND');
      console.log('Fallback - Slushie:', slushie ? `${slushie.id}: ${slushie.name}` : 'NOT FOUND');
      
      signatures = [brownSugar, waffle, slushie].filter(Boolean);
    }
    
    // Fallback to first 3 items if still not enough
    if (signatures.length < 3) {
      console.log('Using first 3 menu items as fallback');
      signatures = this.menuItems.slice(0, 3);
    }

    console.log('Final signatures to render:', signatures.length, signatures.map(s => s.name));
    
    if (signatures.length === 0) {
      console.error('No signatures available to render!');
      signaturesGrid.innerHTML = '<p class="text-center col-span-full">Loading menu items...</p>';
      return;
    }
    
    signaturesGrid.innerHTML = signatures.map(item => this.renderSignatureCard(item)).join('');
    requestAnimationFrame(() => this.setupRevealAnimation());
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

    const { itemModal, modalContent, modalImage, modalTitle, modalDescription, modalPrice, quantityDisplay } = this.domCache;

    if (!itemModal) return;

    const imageUrl = `cms/images/${item.id}.png`;
    modalImage.src = imageUrl;
    modalImage.onerror = function() {
      this.onerror = null; // Prevent infinite loop
      this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 450%22%3E%3Crect fill=%22%23F2A3B1%22 width=%22800%22 height=%22450%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Fredoka%22 font-size=%2232%22 fill=%22%231E2A4A%22%3E' + encodeURIComponent(item.name) + '%3C/text%3E%3C/svg%3E';
    };

    modalTitle.textContent = item.name;
    modalDescription.textContent = item.description || '';
    const basePrice = parseFloat(item.price) || 0;
    modalPrice.textContent = `£${basePrice.toFixed(2)}`;
    quantityDisplay.textContent = '1';

    // Reset buttons - optimized with single querySelectorAll call
    const allOptionBtns = document.querySelectorAll('.size-btn, .sugar-btn, .ice-btn');
    allOptionBtns.forEach(btn => {
      btn.classList.remove('active', 'bg-navy', 'text-cream');
      btn.classList.add('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
    });

    // Set first button of each type as active - using cached queries
    const firstSize = document.querySelector('.size-btn[data-size="Regular"]');
    const firstSugar = document.querySelector('.sugar-btn[data-sugar="0%"]');
    const firstIce = document.querySelector('.ice-btn[data-ice="0%"]');

    [firstSize, firstSugar, firstIce].forEach(btn => {
      if (btn) {
        btn.classList.remove('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
        btn.classList.add('active', 'bg-navy', 'text-cream');
      }
    });

    itemModal.classList.remove('hidden');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
        // Ensure pointer events are enabled when modal opens
        modalContent.style.pointerEvents = 'auto';
      });
    });
  }

  closeModal() {
    const { itemModal, modalContent } = this.domCache;

    if (!itemModal) return;

    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    // Enable pointer events during animation
    modalContent.style.pointerEvents = 'none';

    setTimeout(() => {
      itemModal.classList.add('hidden');
    }, 300);
  }

  closeCart() {
    const { cartPanel, cartSidebar } = this.domCache;
    if (!cartPanel || !cartSidebar) return;
    
    cartPanel.classList.add('translate-x-full');
    setTimeout(() => cartSidebar.classList.add('hidden'), 300);
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

    // Show cart - using cached references and requestAnimationFrame
    const { cartSidebar, cartPanel } = this.domCache;
    if (cartSidebar && cartPanel) {
      cartSidebar.classList.remove('hidden');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => cartPanel.classList.remove('translate-x-full'));
      });
    }
  }

  removeFromCart(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.updateCartDisplay();
  }

  updateCartDisplay() {
    const { cartItems, cartCount, cartTotal, checkoutBtn } = this.domCache;

    if (!cartItems) return;

    // Update count - single reduce pass
    let totalItems = 0;
    let total = 0;
    for (const item of this.cart) {
      totalItems += item.quantity;
      total += item.totalPrice;
    }
    
    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = `£${total.toFixed(2)}`;

    // Enable/disable checkout
    if (checkoutBtn) {
      checkoutBtn.disabled = this.cart.length === 0;
    }

    // Render items
    if (this.cart.length === 0) {
      cartItems.innerHTML = '<p class="text-center text-navy/50 font-medium py-12">Your cart is empty</p>';
    } else {
      // Use event delegation for remove buttons
      cartItems.innerHTML = this.cart.map(item => `
        <div class="flex gap-4 bg-milk rounded-2xl p-4 border-2 border-navy/10">
          <img src="${item.image}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23F2A3B1%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl">
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

      // Use event delegation for remove buttons
      cartItems.addEventListener('click', (e) => {
        const btn = e.target.closest('.remove-item');
        if (btn && btn.dataset.id) {
          this.removeFromCart(btn.dataset.id);
        }
      }, { passive: true });
    }
  }

  checkoutViaWhatsApp() {
    if (this.cart.length === 0) return;

    // Build order message
    let message = 'New Order - NO.9 Bubble Tea\n\n';
    
    this.cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Size: ${item.size} | Sugar: ${item.sugar} | Ice: ${item.ice}\n`;
      message += `   Qty: ${item.quantity} × £${item.unitPrice.toFixed(2)} = £${item.totalPrice.toFixed(2)}\n\n`;
    });

    // Calculate total
    const total = this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    message += `*Total: £${total.toFixed(2)}*\n\n`;
    message += 'Order heads-up! Please wait for our WhatsApp confirmation before heading to the shop\n\nAlso, let us know if you have any allergies when placing your order — we\'ve got you!';

    // Encode for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    const whatsappNumber = '447766628285';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Optionally clear cart after checkout
    // this.cart = [];
    // this.updateCartDisplay();
    // this.closeCart();
  }

  setupRevealAnimation() {
    // Reuse existing observer instead of creating new ones
    if (this.revealObserver) return;
    
    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    document.querySelectorAll('.reveal').forEach(el => {
      this.revealObserver.observe(el);
    });
  }
}

// Initialize app with passive event listener support
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
}, { passive: true });
