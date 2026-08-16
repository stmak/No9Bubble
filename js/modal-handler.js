// Modal Handler - Handles item modal display and interactions
class ModalHandler {
    constructor(cartSystem) {
        this.cartSystem = cartSystem;
        this.currentItem = null;
        this.selectedSize = 'M';
        this.selectedToppings = [];
        
        this.modal = document.getElementById('itemModal');
        this.modalBody = document.getElementById('modalBody');
        this.closeBtn = document.getElementById('closeModal');
        this.overlay = document.getElementById('overlay');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeModal());
        }
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal(item) {
        this.currentItem = item;
        this.selectedSize = 'M';
        this.selectedToppings = [];
        
        const imageSrc = `cms/images/${item.id}.png`;
        
        let sizeOptions = '';
        if (parseFloat(item.size_m) > 0) {
            sizeOptions += `<button class="option-btn selected" data-size="M">M £${item.size_m}</button>`;
        }
        if (parseFloat(item.size_l) > 0) {
            sizeOptions += `<button class="option-btn" data-size="L">L £${item.size_l}</button>`;
        }

        let toppingsHtml = '';
        const availableToppings = [
            'Boba', 'Jelly', 'Pudding', 'Red Bean', 'Grass Jelly', 
            'Coconut Jelly', 'Aloe Vera', 'Cheese Foam'
        ];
        
        availableToppings.forEach(topping => {
            toppingsHtml += `
                <label class="topping-option">
                    <input type="checkbox" value="${topping}" onchange="window.modalHandler.toggleTopping('${topping}', this.checked)">
                    ${topping}
                </label>
            `;
        });

        this.modalBody.innerHTML = `
            <img src="${imageSrc}" alt="${item.name}" class="modal-item-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2240%22>${item.emoji || '🧋'}</text></svg>'">
            <h3 class="modal-item-name">${item.emoji || ''} ${item.name}</h3>
            <p class="modal-item-description">${item.description || ''}</p>
            
            <div class="modal-options">
                <div class="option-group">
                    <label class="option-label">Select Size:</label>
                    <div class="option-buttons" id="sizeOptions">
                        ${sizeOptions}
                    </div>
                </div>
                
                <div class="option-group">
                    <label class="option-label">Add Toppings:</label>
                    <div id="toppingsList">
                        ${toppingsHtml}
                    </div>
                </div>
            </div>
            
            <button class="modal-add-to-cart" onclick="window.modalHandler.addToCart()">Add to Cart</button>
        `;

        // Setup size button listeners
        const sizeBtns = this.modalBody.querySelectorAll('#sizeOptions .option-btn');
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                sizeBtns.forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.selectedSize = e.target.dataset.size;
            });
        });

        this.modal.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    toggleTopping(topping, checked) {
        if (checked) {
            if (!this.selectedToppings.includes(topping)) {
                this.selectedToppings.push(topping);
            }
        } else {
            this.selectedToppings = this.selectedToppings.filter(t => t !== topping);
        }
    }

    addToCart() {
        if (this.currentItem && this.cartSystem) {
            this.cartSystem.addToCart(
                this.currentItem,
                this.selectedSize,
                [...this.selectedToppings],
                1
            );
            this.closeModal();
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.currentItem = null;
    }
}

// Make available globally
window.ModalHandler = ModalHandler;
