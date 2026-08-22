/**
 * NO.9 Bubble Tea - Main Application
 * 
 * This is the main JavaScript application for the NO.9 Bubble Tea website.
 * It handles all interactive functionality including:
 * - Menu loading from CSV with fallback data
 * - Product filtering by category
 * - Shopping cart management
 * - Product modal with customization options (size, sugar, ice)
 * - WhatsApp checkout integration
 * - Scroll reveal animations
 * 
 * @class App
 */
class App {
  /**
   * Creates an instance of App and initializes the application
   * @constructor
   */
  constructor() {
    // Array to store menu items loaded from CSV
    this.menuItems = [];
    // Array to store cart items
    this.cart = [];
    // Currently selected item for modal display
    this.currentItem = null;
    // Quantity selector value
    this.quantity = 1;
    // Selected size option (Regular/Large)
    this.selectedSize = 'Regular';
    // Selected sugar level (0%, 25%, 50%, 75%, 100%)
    this.selectedSugar = '0%';
    // Selected ice level (0%, 25%, 50%, 75%, 100%)
    this.selectedIce = '0%';
    
    // Cache object to store frequently accessed DOM elements for performance
    this.domCache = {};
    
    // Singleton IntersectionObserver for scroll reveal animations
    this.revealObserver = null;
    
    // Initialize the application
    this.init();
  }

  /**
   * Initialize the application by setting up all components
   * @async
   * @returns {Promise<void>}
   */
  async init() {
    // Cache DOM elements for performance optimization
    this.cacheDOMElements();
    // Load menu data from CSV file
    await this.loadMenu();
    // Set up all event listeners for user interactions
    this.setupEventListeners();
    // Render the full menu grid
    this.renderMenu('all');
    // Render signature/featured items section
    this.renderSignatures();
    // Initialize scroll reveal animations
    this.setupRevealAnimation();
    console.log('App initialized, menu items:', this.menuItems.length);
  }

  /**
   * Cache frequently accessed DOM elements to avoid repeated queries
   * This improves performance by storing references in domCache object
   * @returns {void}
   */
  cacheDOMElements() {
    // List of all element IDs to cache
    const ids = [
      'menuBtn', 'mobileMenu', 'menuTabs', 'cartBtn', 'cartSidebar',
      'closeCart', 'cartOverlay', 'cartPanel', 'closeModal', 'itemModal',
      'modalOverlay', 'modalContent', 'modalImage', 'modalTitle',
      'modalDescription', 'modalPrice', 'quantityDisplay', 'decreaseQty',
      'increaseQty', 'addToCartBtn', 'checkoutBtn', 'menuGrid',
      'signaturesGrid', 'cartItems', 'cartCount', 'cartTotal'
    ];
    
    // Store each element reference in the cache object
    ids.forEach(id => {
      this.domCache[id] = document.getElementById(id);
    });
  }

  /**
   * Load menu data from CSV file with fallback to hardcoded data
   * @async
   * @returns {Promise<void>}
   */
  async loadMenu() {
    try {
      // Fetch menu data from CMS CSV file
      const response = await fetch('cms/data/menu.csv');
      const csvText = await response.text();
      // Parse CSV text into array of menu item objects
      this.menuItems = this.parseCSV(csvText);
      console.log('Menu loaded from CSV:', this.menuItems.length, 'items');
      console.log('First few IDs:', this.menuItems.slice(0, 5).map(i => i.id));
    } catch (error) {
      // If CSV loading fails, use fallback menu data
      console.error('Error loading menu:', error);
      this.menuItems = this.getFallbackMenu();
      console.log('Using fallback menu:', this.menuItems.length, 'items');
    }
  }

  /**
   * Parse CSV text into an array of menu item objects
   * Handles Windows line endings and quoted fields with commas
   * @param {string} csvText - Raw CSV text content
   * @returns {Array<Object>} Array of menu item objects
   */
  parseCSV(csvText) {
    // Handle Windows line endings (CRLF) and old Mac line endings (CR)
    const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.trim().split('\n');
    
    // Parse header line and normalize to lowercase
    const headers = this.parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());

    // Parse each data line into an object using headers as keys
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
      // Generate ID from name if not present in CSV
      if (!item.id) {
        item.id = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }

      return item;
    });
  }

  /**
   * Parse a single CSV line handling quoted fields with commas
   * Uses state machine approach to track quote context
   * @param {string} line - Single line of CSV text
   * @returns {string[]} Array of field values
   */
  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    // Iterate through each character to properly handle quoted fields
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        // Toggle quote state
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // Only split on comma if not inside quotes
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    // Push the last field
    values.push(current.trim());
    
    return values;
  }

  /**
   * Return fallback menu data when CSV loading fails
   * Contains popular items across all categories
   * @returns {Array<Object>} Array of hardcoded menu item objects
   */
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

  /**
   * Set up all event listeners for user interactions
   * Uses event delegation and cached DOM references for performance
   * @returns {void}
   */
  setupEventListeners() {
    // Destructure cached DOM elements for easier access
    const { menuBtn, mobileMenu, menuTabs, cartBtn, cartSidebar, closeCart, cartOverlay, cartPanel, 
            closeModal, itemModal, modalOverlay, decreaseQty, increaseQty, addToCartBtn, checkoutBtn } = this.domCache;
    
    // Mobile menu toggle button handler
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      }, { passive: true });
    }

    // Menu category tabs with event delegation
    if (menuTabs) {
      menuTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (btn) {
          // Remove active state from current tab
          const activeTab = menuTabs.querySelector('.tab-btn.active');
          if (activeTab) activeTab.classList.remove('active');
          // Set new active tab and render filtered menu
          btn.classList.add('active');
          this.renderMenu(btn.dataset.filter);
        }
      }, { passive: true });
    }

    // Open cart sidebar when cart button is clicked
    if (cartBtn && cartSidebar) {
      cartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('hidden');
        // Use double requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => cartPanel.classList.remove('translate-x-full'));
        });
      }, { passive: true });
    }

    // Close cart handlers
    if (closeCart && cartSidebar) {
      closeCart.addEventListener('click', () => this.closeCart(), { passive: true });
    }

    if (cartOverlay && cartSidebar) {
      cartOverlay.addEventListener('click', () => this.closeCart(), { passive: true });
    }

    // Modal close handlers
    if (closeModal && itemModal) {
      closeModal.addEventListener('click', () => this.closeModal(), { passive: true });
    }

    if (modalOverlay && itemModal) {
      modalOverlay.addEventListener('click', () => this.closeModal(), { passive: true });
    }

    /**
     * Helper function to handle button group toggling (size, sugar, ice options)
     * @param {string} selector - CSS selector for button elements
     * @param {string} activeClass - Classes to apply when active
     * @param {string} inactiveClass - Classes to apply when inactive
     * @param {string} property - Instance property to update
     */
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

    // Initialize size option buttons (Regular/Large)
    toggleButtonGroup('.size-btn', 'active bg-navy text-cream', 'bg-milk border-2 border-navy/15 text-navy', 'selectedSize');

    // Initialize sugar level buttons (0%, 25%, 50%, 75%, 100%)
    toggleButtonGroup('.sugar-btn', 'active bg-navy text-cream', 'bg-milk border-2 border-navy/15 text-navy', 'selectedSugar');

    // Initialize ice level buttons (0%, 25%, 50%, 75%, 100%)
    toggleButtonGroup('.ice-btn', 'active bg-navy text-cream', 'bg-milk border-2 border-navy/15 text-navy', 'selectedIce');

    // Quantity decrease button handler
    if (decreaseQty) {
      decreaseQty.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          quantityDisplay.textContent = this.quantity;
        }
      }, { passive: true });
    }

    // Quantity increase button handler
    if (increaseQty) {
      increaseQty.addEventListener('click', () => {
        this.quantity++;
        quantityDisplay.textContent = this.quantity;
      }, { passive: true });
    }

    // Add to cart button handler
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => this.addToCart(), { passive: true });
    }

    // Checkout button handler - sends order via WhatsApp
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkoutViaWhatsApp(), { passive: true });
    }

    // Reveal on scroll animation
    this.setupRevealAnimation();
  }

  /**
   * Render the menu grid with optional category filtering
   * @param {string} [filter='all'] - Category filter to apply
   * @returns {void}
   */
  renderMenu(filter = 'all') {
    const menuGrid = this.domCache.menuGrid;
    if (!menuGrid) return;
    
    // Map filter values to CSV category names for matching
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
      // Show all menu items
      filteredItems = this.menuItems;
    } else if (filter === 'snacks') {
      // Snacks not in CSV, show empty array
      filteredItems = [];
    } else {
      // Filter by category using mapped search term
      const searchTerm = categoryMap[filter] || filter;
      filteredItems = this.menuItems.filter(item => 
        item.category && item.category.includes(searchTerm)
      );
    }
    
    // Generate HTML for all filtered items efficiently
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
            <div class="flex justify-between gap-3 font-display font-semibold text-lg text-navy">
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

    // Set up event delegation for modal open buttons
    menuGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.open-modal');
      if (btn && btn.dataset.id) {
        const item = this.menuItems.find(i => i.id === btn.dataset.id);
        if (item) this.openModal(item);
      }
    }, { passive: true });

    // Initialize reveal animations for newly rendered items
    requestAnimationFrame(() => this.setupRevealAnimation());
  }

  /**
   * Render the signature/featured items section with top 3 products
   * Uses multiple fallback strategies to ensure content is displayed
   * @returns {void}
   */
  renderSignatures() {
    const signaturesGrid = this.domCache.signaturesGrid;
    const signaturesSection = document.getElementById('signatures');
    
    if (!signaturesGrid) {
      console.error('signaturesGrid element not found in DOM');
      return;
    }

    // Primary: Get featured items by specific IDs (matching CSV/fallback data)
    const signatureIds = ['brown-sugar-1', 'waffle-1', 'slushies-1'];
    let signatures = signatureIds.map(id => this.menuItems.find(i => i.id === id)).filter(Boolean);

    // First fallback: If specific IDs not found, get first item from key categories
    if (signatures.length < 3) {
      const brownSugar = this.menuItems.find(i => i.id && i.id.startsWith('brown-sugar'));
      const waffle = this.menuItems.find(i => i.id && i.id.startsWith('waffle'));
      const slushie = this.menuItems.find(i => i.id && i.id.startsWith('slushies'));
      
      if (brownSugar && !signatures.find(s => s.id === brownSugar.id)) signatures.push(brownSugar);
      if (waffle && !signatures.find(s => s.id === waffle.id)) signatures.push(waffle);
      if (slushie && !signatures.find(s => s.id === slushie.id)) signatures.push(slushie);
    }
    
    // Second fallback: use first 3 items if still not enough
    if (signatures.length < 3) {
      signatures = this.menuItems.slice(0, 3);
    }

    // Ensure exactly 3 items maximum
    signatures = signatures.slice(0, 3);
    
    // Handle empty state - hide section if no signatures available
    if (signatures.length === 0) {
      if (signaturesSection) {
        signaturesSection.style.display = 'none';
      }
      return;
    }
    
    // Show section and render signature cards
    if (signaturesSection) {
      signaturesSection.style.display = 'block';
    }
    
    // Render the cards
    const html = signatures.map(item => this.renderSignatureCard(item)).join('');
    console.log('Generated HTML length:', html.length);
    console.log('First 200 chars of HTML:', html.substring(0, 200));
    
    signaturesGrid.innerHTML = html;
    console.log('Rendered', signatures.length, 'signature cards');
    console.log('signaturesGrid innerHTML length:', signaturesGrid.innerHTML.length);
    
    // Re-setup reveal animation for newly added elements
    requestAnimationFrame(() => this.setupRevealAnimation());
  }

  /**
   * Generate HTML for a single signature card
   * @param {Object} item - Menu item object
   * @returns {string} HTML string for the signature card
   */
  renderSignatureCard(item) {
    const basePrice = parseFloat(item.price) || 0;
    const displayPrice = basePrice.toFixed(2);
    const imageUrl = `images/${item.id}.png`;

    return `
      <article class="reveal group bg-milk rounded-[2rem] p-4 pb-7 border-2 border-navy/10 shadow-card hover:-translate-y-2 hover:rotate-1 transition-transform">
        <div class="rounded-[1.6rem] overflow-hidden aspect-square">
          <img loading="lazy" src="${imageUrl}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23C08048%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Fredoka%22 font-size=%2220%22 fill=%22%23FFFBF2%22%3E${encodeURIComponent(item.name)}%3C/text%3E%3C/svg%3E'" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <div class="px-3 pt-5">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-display font-semibold text-xl text-navy">${item.name}</h3>
            <span class="font-display font-bold text-caramel-deep text-lg">£${displayPrice}</span>
          </div>
          <p class="mt-2 text-sm text-navy/65 font-medium">${item.description || ''}</p>
        </div>
      </article>
    `;
  }

  /**
   * Open the product detail modal with customization options
   * @param {Object} item - Menu item object to display
   * @returns {void}
   */
  openModal(item) {
    // Reset modal state to defaults
    this.currentItem = item;
    this.quantity = 1;
    this.selectedSize = 'Regular';
    this.selectedSugar = '0%';
    this.selectedIce = '0%';

    // Get cached modal DOM elements
    const { itemModal, modalContent, modalImage, modalTitle, modalDescription, modalPrice, quantityDisplay } = this.domCache;

    if (!itemModal) return;

    // Set product image with fallback SVG placeholder
    const imageUrl = `cms/images/${item.id}.png`;
    modalImage.src = imageUrl;
    modalImage.onerror = function() {
      this.onerror = null; // Prevent infinite error loop
      this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 450%22%3E%3Crect fill=%22%23F2A3B1%22 width=%22800%22 height=%22450%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Fredoka%22 font-size=%2232%22 fill=%22%231E2A4A%22%3E' + encodeURIComponent(item.name) + '%3C/text%3E%3C/svg%3E';
    };

    // Populate modal content
    modalTitle.textContent = item.name;
    modalDescription.textContent = item.description || '';
    const basePrice = parseFloat(item.price) || 0;
    modalPrice.textContent = `£${basePrice.toFixed(2)}`;
    quantityDisplay.textContent = '1';

    // Reset all option buttons to inactive state
    const allOptionBtns = document.querySelectorAll('.size-btn, .sugar-btn, .ice-btn');
    allOptionBtns.forEach(btn => {
      btn.classList.remove('active', 'bg-navy', 'text-cream');
      btn.classList.add('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
    });

    // Set default selections (first button of each type)
    const firstSize = document.querySelector('.size-btn[data-size="Regular"]');
    const firstSugar = document.querySelector('.sugar-btn[data-sugar="0%"]');
    const firstIce = document.querySelector('.ice-btn[data-ice="0%"]');

    [firstSize, firstSugar, firstIce].forEach(btn => {
      if (btn) {
        btn.classList.remove('bg-milk', 'border-2', 'border-navy/15', 'text-navy');
        btn.classList.add('active', 'bg-navy', 'text-cream');
      }
    });

    // Show modal with smooth animation
    itemModal.classList.remove('hidden');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
        // Enable pointer events when modal is visible
        modalContent.style.pointerEvents = 'auto';
      });
    });
  }

  /**
   * Close the product detail modal with smooth animation
   * @returns {void}
   */
  closeModal() {
    const { itemModal, modalContent } = this.domCache;

    if (!itemModal) return;

    // Animate out
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    // Disable pointer events during animation
    modalContent.style.pointerEvents = 'none';

    setTimeout(() => {
      itemModal.classList.add('hidden');
    }, 300);
  }

  /**
   * Close the shopping cart sidebar with smooth animation
   * @returns {void}
   */
  closeCart() {
    const { cartPanel, cartSidebar } = this.domCache;
    if (!cartPanel || !cartSidebar) return;
    
    // Slide out animation
    cartPanel.classList.add('translate-x-full');
    setTimeout(() => cartSidebar.classList.add('hidden'), 300);
  }

  /**
   * Add current item to cart with selected customizations
   * Calculates price including size upcharge (£0.80 for Large)
   * @returns {void}
   */
  addToCart() {
    if (!this.currentItem) return;

    const basePrice = parseFloat(this.currentItem.price) || 0;
    let finalPrice = basePrice;

    // Add size upcharge for Large
    if (this.selectedSize === 'Large') {
      finalPrice += 0.80;
    }

    const totalItemPrice = finalPrice * this.quantity;

    // Create cart item object with all customizations
    const cartItem = {
      id: this.currentItem.id + '-' + Date.now(), // Unique ID with timestamp
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

    // Add to cart array and update display
    this.cart.push(cartItem);
    this.updateCartDisplay();
    this.closeModal();

    // Auto-open cart to show added item
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
    let message = '*NEW ORDER - NO.9 BUBBLE TEA!*\n\n';

    this.cart.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n`;
      message += `   Size: ${item.size} | Sugar: ${item.sugar} | Ice: ${item.ice}\n`;
      message += `   Qty: ${item.quantity} x £${item.unitPrice.toFixed(2)} = £${item.totalPrice.toFixed(2)}\n\n`;
    });

    // Calculate total
    const total = this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    message += `*TOTAL: £${total.toFixed(2)}*\n\n`;
    message += `*ORDER HEADS-UP!* Please wait for our WhatsApp confirmation before heading to the shop.\n\nAlso, let us know if you have any allergies when placing your order - we've got you!`;
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

    // Observe all elements with 'reveal' class
    document.querySelectorAll('.reveal').forEach(el => {
      this.revealObserver.observe(el);
    });
  }
}

// Initialize the application when DOM is ready
// Uses passive event listener option for better scroll performance
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
}, { passive: true });
