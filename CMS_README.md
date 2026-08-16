# NO.9 Bubble Tea - CMS Menu System

## Overview

This refactored codebase implements a CMS (Content Management System) for managing menu items dynamically from a CSV file. The menu is generated on-the-fly, and images are loaded based on menu item IDs.

## Folder Structure

```
/workspace/
├── index.html          # Main HTML file (refactored, loads JS modules)
├── index.html.backup   # Original monolithic HTML file (for reference)
├── README.md           # This file
│
├── cms/                # Content Management System folder
│   ├── data/
│   │   └── menu.csv    # Menu data in CSV format
│   └── images/         # Menu item images (JPG files named by ID)
│       ├── logo.jpg    # Logo image
│       ├── brown-sugar_0.jpg  # First item in Brown Sugar category
│       ├── brown-sugar_1.jpg  # Second item in Brown Sugar category
│       └── ...
│
├── css/
│   └── styles.css      # All CSS styles extracted from original HTML
│
└── js/
    ├── menu-loader.js      # Loads and parses CSV menu data
    ├── menu-renderer.js    # Renders menu UI from loaded data
    ├── cart.js             # Shopping cart functionality
    ├── modal.js            # Item customization modal
    └── favourites.js       # Favourites section renderer
```

## How to Use the CMS

### 1. Edit Menu Items (CSV)

Edit `cms/data/menu.csv` to modify menu items. Each row represents one menu item with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| id | Category ID (groups items) | `brown-sugar` |
| category | Category name (displayed) | `Brown Sugar Series` |
| emoji | Emoji icon for the item | `✨` |
| name | Item name | `Brown Sugar Bubble Milk Tea` |
| description | Item description | `Tiger-striped, sweet & creamy...` |
| size_m | Medium size price | `5.80` |
| size_l | Large size price | `6.80` |
| toppings_included | Include topping option (0/1) | `1` |
| oat_option | Oat milk option (0/1) | `1` |
| hot_option | Hot drink option (0/1) | `1` |
| ice_option | Ice cream option (0/1) | `0` |

### 2. Add Menu Item Images

Place JPG images in `cms/images/` folder with the naming convention:
```
{category_id}_{item_index}.jpg
```

For example:
- `brown-sugar_0.jpg` - First item in Brown Sugar category
- `brown-sugar_1.jpg` - Second item in Brown Sugar category
- `waffle_0.jpg` - First waffle item
- `logo.jpg` - Logo image

The system automatically looks for images based on the menu item's position in its category.

### 3. Configure Favourites

Edit `js/favourites.js` to change which items appear in the favourites section:

```javascript
const FAVOURITES = [
  { cat: 'brown-sugar', idx: 0, tag: '★ No.1 seller' },
  { cat: 'waffle', idx: 1, tag: '🍌 Loaded' },
  { cat: 'soft-serve', idx: 0, tag: '🍦 Swirled' }
];
```

### 4. Configure Toppings & Sauces

Edit `js/menu-loader.js` to change available toppings and sauces:

```javascript
const MENU_CONFIG = {
  toppings: ['Strawberry', 'Banana', 'Sprinkles', ...],
  sauces: ['Chocolate', 'Strawberry', 'Lotus Biscoff']
};
```

## Benefits of This Refactoring

1. **Easy Menu Updates**: Edit the CSV file instead of hunting through HTML/JS code
2. **Image Management**: Simply add/rename JPG files in the images folder
3. **Modular Code**: Separate concerns (loading, rendering, cart, modal)
4. **Maintainable**: Each feature has its own file
5. **Scalable**: Easy to add new categories or menu items

## Adding a New Menu Category

1. Add rows to `menu.csv` with a new category ID
2. Add corresponding images to `cms/images/`
3. Update the category note in `js/menu-loader.js` if needed

Example CSV entries for a new "Smoothies" category:
```csv
smoothies,Smoothies,🥤,Mango Smoothie,"Fresh mango blended with yogurt",6.50,7.50,0,0,0,0
smoothies,Smoothies,🥤,Berry Smoothie,"Mixed berries with banana",6.50,7.50,0,0,0,0
```

Then add images:
- `smoothies_0.jpg`
- `smoothies_1.jpg`

## Testing Locally

Open `index.html` in a web browser. Note that due to CORS policies when loading CSV files via fetch(), you may need to:

1. Run a local web server:
   ```bash
   python3 -m http.server 8000
   ```
2. Or use a browser extension that disables CORS for local files
3. Or deploy to a web server

## Technical Details

- **CSV Parser**: Custom parser handles quoted fields with commas
- **Dynamic Rendering**: Menu sections, pills, and favourites rendered from data
- **LocalStorage**: Cart persists across page reloads
- **WhatsApp Integration**: Orders sent via WhatsApp Web API
- **Responsive Design**: Mobile-first CSS with breakpoints

## Migration Notes

The original `index.html` has been backed up as `index.html.backup`. All styles have been extracted to `css/styles.css` and JavaScript functionality has been modularized into the `js/` folder.
