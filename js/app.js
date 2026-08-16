// Main Application - Initializes all components
class App {
    constructor() {
        this.dataLoader = null;
        this.cartSystem = null;
        this.modalHandler = null;
        this.menuRenderer = null;
    }

    async init() {
        // Initialize data loader
        this.dataLoader = new DataLoader();
        await this.dataLoader.loadMenuData();

        // Initialize cart system
        this.cartSystem = new CartSystem();
        window.cartSystem = this.cartSystem;

        // Initialize modal handler
        this.modalHandler = new ModalHandler(this.cartSystem);
        window.modalHandler = this.modalHandler;

        // Initialize menu renderer
        this.menuRenderer = new MenuRenderer(this.dataLoader, this.modalHandler);
        this.menuRenderer.render();

        // Setup cart sidebar toggle
        this.setupCartSidebar();

        // Expose global function for opening item modal
        window.openItemModal = (itemId) => {
            const item = this.dataLoader.getItemById(itemId);
            if (item) {
                this.modalHandler.openModal(item);
            }
        };

        console.log('NO.9 Bubble Tea app initialized successfully!');
    }

    setupCartSidebar() {
        const cartBtn = document.getElementById('cartBtn');
        const closeCart = document.getElementById('closeCart');
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartSidebar.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                document.getElementById('itemModal').classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});
