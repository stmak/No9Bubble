// Menu Renderer - Renders menu items grouped by category
class MenuRenderer {
    constructor(dataLoader, modalHandler) {
        this.dataLoader = dataLoader;
        this.modalHandler = modalHandler;
        this.container = document.getElementById('menuContainer');
    }

    render() {
        const categories = this.dataLoader.getCategories();
        
        if (categories.size === 0) {
            this.container.innerHTML = '<p style="text-align:center;color:#666;">Loading menu...</p>';
            return;
        }

        let html = '';
        
        categories.forEach((items, categoryName) => {
            const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const firstItem = items[0];
            const categoryEmoji = firstItem ? firstItem.emoji : '🧋';
            
            html += `
                <div class="category-group" id="${categorySlug}">
                    <h3 class="category-title">${categoryEmoji} ${categoryName}</h3>
                    <div class="menu-grid">
            `;
            
            items.forEach(item => {
                const price = parseFloat(item.size_m) > 0 ? item.size_m : item.size_l;
                const imageSrc = `cms/images/${item.id}.png`;
                
                html += `
                    <div class="menu-item" onclick="window.openItemModal('${item.id}')">
                        <img src="${imageSrc}" alt="${item.name}" class="menu-item-image" 
                             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2240%22>${item.emoji || '🧋'}</text></svg>'">
                        <div class="menu-item-info">
                            <h4 class="menu-item-name">${item.emoji || ''} ${item.name}</h4>
                            <p class="menu-item-description">${item.description || ''}</p>
                            <div class="menu-item-price">
                                <span class="price-tag">£${price}</span>
                                <button class="add-btn" onclick="event.stopPropagation(); window.openItemModal('${item.id}')">Add +</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        this.container.innerHTML = html;
    }
}

// Make available globally
window.MenuRenderer = MenuRenderer;
