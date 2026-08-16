/**
 * Menu Loader - Loads menu data from CSV and generates menu structure
 * Images are loaded from cms/images/{id}.png where id is the menu item ID
 */

const MENU_CONFIG = {
  csvPath: 'cms/data/menu.csv',
  imagePath: 'cms/images/',
  imageExtension: '.png',
  toppingPrice: 0.90,
  toppings: [
    'Strawberry', 'Banana', 'Sprinkles', 'Smarties', 'Oreo Crumble',
    'Lotus Biscoff Crumble', 'Kinder Bueno', 'Chocolate Wafer Roll',
    'Fresh Cream', 'Mini Marshmallows', 'Popping Boba', 'Brown Sugar Tapioca'
  ],
  sauces: ['Chocolate', 'Strawberry', 'Lotus Biscoff']
};

// Parse CSV text into array of objects
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Handle quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
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
    
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    result.push(obj);
  }
  
  return result;
}

// Group menu items by category
function groupByCategory(items) {
  const categories = {};
  
  items.forEach(item => {
    // Extract category base from ID (e.g., "brown-sugar" from "brown-sugar-1")
    const catIdMatch = item.id.match(/^([a-z]+-[a-z]+)-\d+$/);
    const catId = catIdMatch ? catIdMatch[1] : item.category.toLowerCase().replace(/\s+/g, '-');
    const categoryName = item.category;
    const emoji = item.emoji;
    
    if (!categories[catId]) {
      categories[catId] = {
        id: catId,
        cat: categoryName,
        emoji: emoji,
        note: getCategoryNote(categoryName),
        sizes: [['M', parseFloat(item.size_m)], ['L', parseFloat(item.size_l)]].filter(s => s[1] > 0),
        opts: {
          toppings: parseInt(item.toppings_included) || 0,
          oat: parseInt(item.oat_option) || 0,
          hot: parseInt(item.hot_option) || 0,
          ice: parseInt(item.ice_option) || 0
        },
        items: []
      };
    }
    
    const menuItem = {
      n: item.name,
      e: item.emoji,
      d: item.description || '',
      image: `${MENU_CONFIG.imagePath}${item.id}${MENU_CONFIG.imageExtension}`
    };
    
    // Custom sizes for specific items (waffles, soft serve, etc.)
    if (categoryName === 'Bubble Waffle' || categoryName === 'Soft Serve') {
      menuItem.s = [['Regular', parseFloat(item.size_m)]];
    } else if (categoryName === 'Coffee & Hot Drinks') {
      menuItem.s = [['Hot', parseFloat(item.size_m)], ['Iced', parseFloat(item.size_l)]];
    } else if (categoryName === 'Milk Shakes') {
      menuItem.s = [['M', parseFloat(item.size_m)], ['L', parseFloat(item.size_l)]];
    }
    
    categories[catId].items.push(menuItem);
  });
  
  return Object.values(categories);
}

function getCategoryNote(categoryName) {
  const notes = {
    'Brown Sugar Series': 'Includes tapioca boba · extra topping +90p',
    'Milk Bubble Tea': 'Includes 1 topping · extra topping +90p · oat milk +50p',
    'Iced Fruit Tea': 'Includes popping boba · extra topping +90p · fresh fruit slices added',
    'Slushies': 'Fresh fruit blended with ice — no tea base',
    'Milk Shakes': 'Hand-spun, thick & loaded',
    'Bubble Waffle': 'Crispy & golden · add vanilla ice cream +£1.50',
    'Soft Serve': 'Cup or cone · includes 1 sauce · toppings +90p',
    'Coffee & Hot Drinks': 'Oat milk +50p 🌱'
  };
  return notes[categoryName] || '';
}

// Load menu from CSV file
async function loadMenu() {
  try {
    const response = await fetch(MENU_CONFIG.csvPath);
    if (!response.ok) {
      throw new Error(`Failed to load menu CSV: ${response.status}`);
    }
    const csvText = await response.text();
    const items = parseCSV(csvText);
    return groupByCategory(items);
  } catch (error) {
    console.error('Error loading menu:', error);
    // Fallback to empty menu or show error
    return [];
  }
}

// Export for use in other scripts
window.MenuLoader = {
  loadMenu,
  parseCSV,
  groupByCategory,
  config: MENU_CONFIG
};
