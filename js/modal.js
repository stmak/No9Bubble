// Modal Handler - Handles item modal display and interactions
class ModalHandler {
    constructor(cartSystem) {
        this.cartSystem = cartSystem;
        this.currentItem = null;
        this.selectedSize = 'Regular';
        this.selectedSugar = '50%';
        this.selectedIce = '50%';
        this.quantity = 1;
        
        this.modal = document.getElementById('itemModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalPrice = document.getElementById('modalPrice');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalTotal = document.getElementById('modalTotal');
        this.closeBtn = document.getElementById('closeModal');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.addToCartBtn = document.getElementById('addToCartBtn');
        this.decreaseQty = document.getElementById('decreaseQty');
        this.increaseQty = document.getElementById('increaseQty');
        this.quantityInput = document.getElementById('quantity');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', () => this.closeModal());
        }
        
        if (this.addToCartBtn) {
            this.addToCartBtn.addEventListener('click', () => this.addToCart());
        }
        
        if (this.decreaseQty) {
            this.decreaseQty.addEventListener('click', () => {
                if (this.quantity > 1) {
                    this.quantity--;
                    this.quantityInput.value = this.quantity;
                    this.updateModalTotal();
                }
            });
        }
        
        if (this.increaseQty) {
            this.increaseQty.addEventListener('click', () => {
                this.quantity++;
                this.quantityInput.value = this.quantity;
                this.updateModalTotal();
            });
        }
        
        // Size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active', 'border-navy'));
                e.target.classList.add('active', 'border-navy');
                this.selectedSize = e.target.dataset.size;
                this.updateModalTotal();
            });
        });
        
        // Sugar buttons
        document.querySelectorAll('.sugar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.sugar-btn').forEach(b => b.classList.remove('active', 'border-navy'));
                e.target.classList.add('active', 'border-navy');
                this.selectedSugar = e.target.dataset.sugar;
            });
        });
        
        // Ice buttons
        document.querySelectorAll('.ice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.ice-btn').forEach(b => b.classList.remove('active', 'border-navy'));
                e.target.classList.add('active', 'border-navy');
                this.selectedIce = e.target.dataset.ice;
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal(item) {
        this.currentItem = item;
        this.selectedSize = 'Regular';
        this.selectedSugar = '50%';
        this.selectedIce = '50%';
        this.quantity = 1;
        
        // Reset button states
        document.querySelectorAll('.size-btn, .sugar-btn, .ice-btn').forEach(btn => {
            btn.classList.remove('active', 'border-navy');
        });
        document.querySelector('.size-btn[data-size="Regular"]')?.classList.add('active', 'border-navy');
        document.querySelector('.sugar-btn[data-sugar="50%"]')?.classList.add('active', 'border-navy');
        document.querySelector('.ice-btn[data-ice="50%"]')?.classList.add('active', 'border-navy');
        this.quantityInput.value = 1;
        
        const imageSrc = `cms/images/${item.id}.png`;
        this.modalImage.src = imageSrc;
        this.modalTitle.textContent = item.name;
        this.modalPrice.textContent = '£' + parseFloat(item.price).toFixed(2);
        this.modalDescription.textContent = item.description || '';
        
        this.updateModalTotal();
        
        this.modal.classList.remove('hidden');
        this.modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    updateModalTotal() {
        if (!this.currentItem) return;
        
        const basePrice = parseFloat(this.currentItem.price);
        const sizePrice = this.selectedSize === 'Large' ? 1.00 : 0;
        const total = (basePrice + sizePrice) * this.quantity;
        
        this.modalTotal.textContent = '£' + total.toFixed(2);
    }

    addToCart() {
        if (this.currentItem && this.cartSystem) {
            this.cartSystem.addToCart(
                this.currentItem,
                this.selectedSize,
                this.selectedSugar,
                this.selectedIce,
                this.quantity
            );
            this.closeModal();
        }
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.modalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        this.currentItem = null;
    }
}

// Make available globally
window.ModalHandler = ModalHandler;
