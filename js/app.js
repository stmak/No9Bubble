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
        this.menuRenderer.renderMenu('all');
        this.menuRenderer.renderSignatures();

        // Expose global function for opening item modal
        window.openItemModal = (itemId) => {
            const item = this.dataLoader.getItemById(itemId);
            if (item) {
                this.modalHandler.openModal(item);
            }
        };

        console.log('NO.9 Bubble Tea app initialized successfully!');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});
