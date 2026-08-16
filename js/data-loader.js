// Data Loader - Loads menu data from CSV
class DataLoader {
    constructor() {
        this.menuData = [];
        this.categories = new Map();
    }

    async loadMenuData() {
        try {
            const response = await fetch('cms/data/menu.csv');
            if (!response.ok) {
                throw new Error('Failed to load menu data');
            }
            const csvText = await response.text();
            this.parseCSV(csvText);
            return this.menuData;
        } catch (error) {
            console.error('Error loading menu data:', error);
            return [];
        }
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const item = {};
                headers.forEach((header, index) => {
                    item[header] = values[index];
                });
                this.menuData.push(item);
                
                // Group by category
                const category = item.category;
                if (!this.categories.has(category)) {
                    this.categories.set(category, []);
                }
                this.categories.get(category).push(item);
            }
        }
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

    getMenuData() {
        return this.menuData;
    }

    getCategories() {
        return this.categories;
    }

    getItemById(id) {
        return this.menuData.find(item => item.id === id);
    }
}

// Make available globally
window.DataLoader = DataLoader;
