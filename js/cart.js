// Cart System - Handles shopping cart functionality
class CartSystem {
    constructor() {
        this.cart = [];
        this.loadFromStorage();
        this.updateCartDisplay();
        this.setupCartSidebar();
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('no9cart');
        if (saved) {
            try {
                this.cart = JSON.parse(saved);
            } catch (e) {
                this.cart = [];
            }
        }
    }

    saveToStorage() {
        localStorage.setItem('no9cart', JSON.stringify(this.cart));
    }

    addToCart(item, size, sugarLevel, iceLevel, quantity = 1) {
        const basePrice = parseFloat(item.price);
        const sizePrice = size === 'Large' ? 1.00 : 0;
        const finalPrice = basePrice + sizePrice;
        
        const cartItem = {
            id: item.id + '-' + size + '-' + Date.now(),
            itemId: item.id,
            name: item.name,
            size: size,
            sugarLevel: sugarLevel,
            iceLevel: iceLevel,
            quantity: quantity,
            price: finalPrice,
            image: `cms/images/${item.id}.png`
        };

        this.cart.push(cartItem);
        this.saveToStorage();
        this.updateCartDisplay();
        return cartItem;
    }

    removeFromCart(cartItemId) {
        this.cart = this.cart.filter(item => item.id !== cartItemId);
        this.saveToStorage();
        this.updateCartDisplay();
    }

    updateQuantity(cartItemId, newQuantity) {
        const item = this.cart.find(i => i.id === cartItemId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveToStorage();
            this.updateCartDisplay();
        }
    }

    getCartItems() {
        return this.cart;
    }

    getTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveToStorage();
        this.updateCartDisplay();
    }

    setupCartSidebar() {
        const cartBtn = document.getElementById('cartBtn');
        const closeCart = document.getElementById('closeCart');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartPanel = document.getElementById('cartPanel');
        const cartOverlay = document.getElementById('cartOverlay');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartSidebar.classList.remove('hidden');
                setTimeout(() => {
                    cartPanel.classList.remove('translate-x-full');
                }, 10);
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartPanel.classList.add('translate-x-full');
                setTimeout(() => {
                    cartSidebar.classList.add('hidden');
                    document.body.style.overflow = '';
                }, 300);
            });
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                cartPanel.classList.add('translate-x-full');
                setTimeout(() => {
                    cartSidebar.classList.add('hidden');
                    document.body.style.overflow = '';
                }, 300);
            });
        }
    }

    updateCartDisplay() {
        // Update cart count
        const countEl = document.getElementById('cartCount');
        if (countEl) {
            const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            countEl.textContent = totalCount;
        }

        // Update cart items display
        const cartItemsEl = document.getElementById('cartItems');
        if (cartItemsEl) {
            if (this.cart.length === 0) {
                cartItemsEl.innerHTML = '<p class="text-center text-navy/60 font-medium mt-8">Your cart is empty 🧋</p>';
            } else {
                cartItemsEl.innerHTML = this.cart.map(item => `
                    <div class="flex gap-4 p-4 bg-milk rounded-2xl border-2 border-navy/10">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Crect fill=%22%23F2A3B1%22 width=%2280%22 height=%2280%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Fredoka%22 font-size=%2232%22 fill=%22%231E2A4A%22%3E🧋%3C/text%3E%3C/svg%3E'">
                        <div class="flex-1">
                            <h4 class="font-display font-semibold text-navy">${item.name}</h4>
                            <p class="text-sm text-navy/65 mt-1">Size: ${item.size} | Sugar: ${item.sugarLevel} | Ice: ${item.iceLevel}</p>
                            <div class="flex items-center justify-between mt-2">
                                <div class="flex items-center gap-2">
                                    <button onclick="window.cartSystem.updateQuantity('${item.id}', ${item.quantity - 1})" class="w-7 h-7 rounded-full bg-navy/10 hover:bg-navy/20 font-bold text-sm">−</button>
                                    <span class="font-display font-semibold w-6 text-center">${item.quantity}</span>
                                    <button onclick="window.cartSystem.updateQuantity('${item.id}', ${item.quantity + 1})" class="w-7 h-7 rounded-full bg-navy/10 hover:bg-navy/20 font-bold text-sm">+</button>
                                </div>
                                <span class="font-display font-bold text-caramel-deep">£${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                        <button onclick="window.cartSystem.removeFromCart('${item.id}')" class="self-start text-navy/40 hover:text-blush-deep transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                `).join('');
            }
        }

        // Update total
        const totalEl = document.getElementById('cartTotal');
        if (totalEl) {
            totalEl.textContent = '£' + this.getTotal().toFixed(2);
        }
    }
}

// Make available globally
window.CartSystem = CartSystem;
