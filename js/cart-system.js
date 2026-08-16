// Cart System - Handles shopping cart functionality
class CartSystem {
    constructor() {
        this.cart = [];
        this.loadFromStorage();
        this.updateCartDisplay();
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

    addToCart(item, size, toppings, quantity = 1) {
        const cartItem = {
            id: item.id + '-' + size + '-' + Date.now(),
            itemId: item.id,
            name: item.name,
            size: size,
            toppings: toppings,
            quantity: quantity,
            price: size === 'L' ? parseFloat(item.size_l) : parseFloat(item.size_m),
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
                cartItemsEl.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">Your cart is empty</p>';
            } else {
                cartItemsEl.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-details">Size: ${item.size} | Toppings: ${item.toppings.join(', ') || 'None'}</div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="window.cartSystem.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="window.cartSystem.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                        <div class="cart-item-price">£${(item.price * item.quantity).toFixed(2)}</div>
                        <button class="remove-item" onclick="window.cartSystem.removeFromCart('${item.id}')">Remove</button>
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
