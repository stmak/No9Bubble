// Menu Renderer - Renders menu items grouped by category with Tailwind styling
class MenuRenderer {
    constructor(dataLoader, modalHandler) {
        this.dataLoader = dataLoader;
        this.modalHandler = modalHandler;
        this.menuGrid = document.getElementById('menuGrid');
        this.signaturesGrid = document.getElementById('signaturesGrid');
        this.setupFilterButtons();
    }

    setupFilterButtons() {
        const tabs = document.querySelectorAll('#menuTabs .tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.closest('.tab-btn').classList.add('active');
                const filter = e.target.closest('.tab-btn').dataset.filter;
                this.renderMenu(filter);
            });
        });
    }

    renderMenu(filter = 'all') {
        const items = this.dataLoader.getMenuData();
        
        if (!this.menuGrid) return;
        
        let filteredItems = items;
        if (filter !== 'all') {
            filteredItems = items.filter(item => item.category === filter);
        }
        
        if (filteredItems.length === 0) {
            this.menuGrid.innerHTML = '<p class="text-center text-navy/60 font-medium col-span-full">No items in this category</p>';
            return;
        }
        
        let html = '';
        filteredItems.forEach(item => {
            const imageSrc = `cms/images/${item.id}.png`;
            html += `
                <article class="menu-card reveal group bg-milk rounded-3xl border-2 border-navy/10 shadow-card overflow-hidden pop">
                    <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blush/20 to-caramel/20">
                        <img loading="lazy" src="${imageSrc}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23F2A3B1%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Fredoka%22 font-size=%2264%22 fill=%22%231E2A4A%22%3E🧋%3C/text%3E%3C/svg%3E'">
                    </div>
                    <div class="p-5">
                        <div class="flex justify-between gap-3 font-display font-semibold text-lg">
                            <span>${item.name}</span>
                            <span class="text-caramel-deep">£${parseFloat(item.price).toFixed(2)}</span>
                        </div>
                        <p class="mt-1.5 text-sm text-navy/65 font-medium">${item.description || ''}</p>
                        <button onclick="window.openItemModal('${item.id}')" class="mt-4 w-full font-display font-semibold text-sm bg-navy text-cream py-3 rounded-full hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2">
                            Add + 
                        </button>
                    </div>
                </article>
            `;
        });
        
        this.menuGrid.innerHTML = html;
        
        // Trigger reveal animation for new items
        setTimeout(() => {
            const reveals = this.menuGrid.querySelectorAll('.reveal');
            reveals.forEach(reveal => reveal.classList.add('visible'));
        }, 50);
    }

    renderSignatures() {
        const items = this.dataLoader.getMenuData();
        const signatureIds = ['brown-sugar-1', 'milk-tea-1', 'mango-slushie-1'];
        const signatures = signatureIds.map(id => items.find(item => item.id === id)).filter(Boolean);
        
        if (!this.signaturesGrid || signatures.length === 0) return;
        
        let html = '';
        signatures.forEach(item => {
            const imageSrc = `cms/images/${item.id}.png`;
            html += `
                <article class="reveal group bg-milk rounded-[2rem] p-4 pb-7 border-2 border-navy/10 shadow-card hover:-translate-y-2 hover:rotate-1 transition-transform">
                    <div class="rounded-[1.6rem] overflow-hidden aspect-square">
                        <img loading="lazy" src="${imageSrc}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23F2A3B1%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Fredoka%22 font-size=%2296%22 fill=%22%231E2A4A%22%3E🧋%3C/text%3E%3C/svg%3E'">
                    </div>
                    <div class="px-3 pt-5">
                        <div class="flex items-center justify-between gap-2">
                            <h3 class="font-display font-semibold text-xl">${item.name}</h3>
                            <span class="font-display font-bold text-caramel-deep text-lg">£${parseFloat(item.price).toFixed(2)}</span>
                        </div>
                        <p class="mt-2 text-sm text-navy/65 font-medium">${item.description || ''}</p>
                    </div>
                </article>
            `;
        });
        
        this.signaturesGrid.innerHTML = html;
    }
}

// Make available globally
window.MenuRenderer = MenuRenderer;
