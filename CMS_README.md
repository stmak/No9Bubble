# NO.9 Bubble Tea - CMS System

A fully refactored content management system for the NO.9 Bubble Tea website. The menu is now dynamically generated from a CSV file, making it easy to update without touching any code.

## Folder Structure

```
/workspace/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styling
├── js/
│   ├── data-loader.js      # Loads and parses CSV data
│   ├── cart-system.js      # Shopping cart functionality
│   ├── modal-handler.js    # Item modal and customization
│   ├── menu-renderer.js    # Renders menu grouped by category
│   └── app.js              # Main application initializer
├── cms/
│   ├── data/
│   │   └── menu.csv        # Menu items database
│   └── images/             # Product images (PNG format)
│       ├── brown-sugar-1.png
│       ├── brown-sugar-2.png
│       ├── milk-tea-1.png
│       └── ... (51 total images)
└── CMS_README.md           # This file
```

## Features

### 1. Dynamic Menu Loading
- Menu items are loaded from `cms/data/menu.csv`
- Items are automatically grouped by category
- Each item has a unique ID for image mapping

### 2. Image System
- Images are stored in `cms/images/` folder
- File naming convention: `{id}.png` (e.g., `brown-sugar-1.png`)
- If an image is missing, a fallback emoji placeholder is shown
- PNG format for better quality and transparency support

### 3. Shopping Cart
- Fully functional cart with add/remove/update quantity
- Cart persists in localStorage
- Size selection (M/L) with different pricing
- Multiple topping options available
- Real-time total calculation

### 4. Modal System
- Click any menu item or "Add +" button to open modal
- Select size (M or L)
- Choose from 8 topping options
- Add to cart with customizations

### 5. Category Grouping
- Items are grouped by their category from CSV
- Each category displays as a separate section
- Category title includes emoji from first item

## How to Update Menu

### Adding/Editing Menu Items

1. Open `cms/data/menu.csv`
2. Edit the CSV file with your preferred editor
3. CSV columns:
   - `id`: Unique identifier (used for image filename)
   - `category`: Category name (items with same category are grouped)
   - `emoji`: Emoji icon for the item
   - `name`: Item name
   - `description`: Item description
   - `size_m`: Price for medium size
   - `size_l`: Price for large size
   - `toppings_included`: Whether toppings are included (1/0)
   - `oat_option`: Oat milk option available (1/0)
   - `hot_option`: Hot option available (1/0)
   - `ice_option`: Ice option available (1/0)

### Adding Images

1. Create PNG images for each menu item
2. Name each image exactly as the item's ID: `{id}.png`
3. Place images in `cms/images/` folder
4. Recommended size: 400x400px or higher

Example:
- Item ID: `brown-sugar-1` → Image: `cms/images/brown-sugar-1.png`
- Item ID: `milk-tea-3` → Image: `cms/images/milk-tea-3.png`

## Running Locally

```bash
cd /workspace
python3 -m http.server 8000
```

Then open: http://localhost:8000

## Current Menu Categories

1. Brown Sugar Series (5 items)
2. Milk Bubble Tea (7 items)
3. Iced Fruit Tea (11 items)
4. Slushies (5 items)
5. Milk Shakes (8 items)
6. Bubble Waffle (7 items)
7. Soft Serve (1 item)
8. Coffee & Hot Drinks (7 items)

**Total: 51 unique menu items**

## Technical Details

### Data Flow
1. `data-loader.js` fetches and parses CSV
2. Data is organized by category in a Map
3. `menu-renderer.js` generates HTML for each category group
4. `cart-system.js` manages cart state and localStorage
5. `modal-handler.js` handles item customization
6. `app.js` initializes all components

### Global Functions
- `window.openItemModal(itemId)` - Opens modal for specific item
- `window.cartSystem` - Access cart system methods
- `window.modalHandler` - Access modal handler methods

### Browser Storage
Cart data is persisted in `localStorage` under key `no9cart`

## Customization

### Changing Colors
Edit CSS variables in `css/styles.css`:
- `#FF6B9D` - Primary pink
- `#4ECDC4` - Secondary teal
- `#FFE66D` - Accent yellow

### Adding New Toppings
Edit the `availableToppings` array in `js/modal-handler.js`

### Modifying Categories
Simply update the `category` field in `menu.csv` - categories are auto-generated

## Troubleshooting

### Images not showing
- Check image filename matches item ID exactly
- Ensure images are in `cms/images/` folder
- Verify PNG format
- Check browser console for 404 errors

### Cart not working
- Clear browser cache and localStorage
- Check browser console for JavaScript errors
- Ensure all JS files are loading correctly

### Menu not loading
- Verify `menu.csv` exists at `cms/data/menu.csv`
- Check CSV format (comma-separated, proper headers)
- Ensure HTTP server is running (fetch requires server)

## License

Proprietary - NO.9 Bubble Tea
