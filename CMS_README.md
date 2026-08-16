# CMS System for NO.9 Bubble Tea Menu

## Overview
The menu is now dynamically generated from a CSV file, making it easy to update without touching the code.

## Folder Structure
```
cms/
├── data/
│   └── menu.csv          # Menu items data (51 unique items)
└── images/               # Product images folder
    ├── brown-sugar-1.png
    ├── brown-sugar-2.png
    ├── milk-tea-1.png
    └── ... (all 51 items)
```

## Menu Item IDs
Each of the 51 menu items has a **unique ID** following the pattern: `{category}-{number}`

### ID List by Category:
- **Brown Sugar Series**: `brown-sugar-1` through `brown-sugar-5` (5 items)
- **Milk Bubble Tea**: `milk-tea-1` through `milk-tea-7` (7 items)
- **Iced Fruit Tea**: `fruit-tea-1` through `fruit-tea-11` (11 items)
- **Slushies**: `slushies-1` through `slushies-5` (5 items)
- **Milk Shakes**: `milk-shakes-1` through `milk-shakes-8` (8 items)
- **Bubble Waffle**: `waffle-1` through `waffle-7` (7 items)
- **Soft Serve**: `soft-serve-1` (1 item)
- **Coffee & Hot Drinks**: `coffee-1` through `coffee-7` (7 items)

## Image Naming Convention
Images must be named exactly as the menu item ID with `.png` extension:
- `brown-sugar-1.png` → Brown Sugar Bubble Milk Tea
- `brown-sugar-2.png` → Brown Sugar Bubble Milk
- `milk-tea-1.png` → Strawberry Milk Bubble Tea
- `fruit-tea-5.png` → Watermelon Iced Fruit Tea
- `waffle-3.png` → Lotus Biscoff Bubble Waffle
- `coffee-1.png` → No.9 Coffee

**Total: 51 unique PNG files needed**

## CSV File Format
Location: `cms/data/menu.csv`

### Columns:
| Column | Description | Example |
|--------|-------------|---------|
| `id` | Unique identifier (used for image filename) | `brown-sugar-1` |
| `category` | Category name for grouping | `Brown Sugar Series` |
| `emoji` | Emoji icon for the item | `✨` |
| `name` | Display name | `Brown Sugar Bubble Milk Tea` |
| `description` | Item description (optional) | `Tiger-striped, sweet & creamy` |
| `size_m` | Medium/Regular price | `5.80` |
| `size_l` | Large price (0 if not applicable) | `6.80` |
| `toppings_included` | 1=yes, 0=no | `1` |
| `oat_option` | 1=yes, 0=no | `1` |
| `hot_option` | 1=yes, 0=no | `1` |
| `ice_option` | 1=yes, 0=no | `0` |

## How to Update the Menu

### 1. Add/Edit Menu Items
Edit `cms/data/menu.csv`:
- Add a new row for each new item
- Ensure the `id` is unique across ALL items
- Use the format `{category-prefix}-{number}`

### 2. Add Images
Place PNG images in `cms/images/` folder:
- Name each file exactly as the item's `id` + `.png`
- Example: For item with id `milk-tea-3`, name the file `milk-tea-3.png`

### 3. Test Locally
```bash
cd /workspace
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## JavaScript Files
- `js/menu-loader.js` - Loads and parses CSV, generates menu structure
- `js/menu-renderer.js` - Renders the menu UI from loaded data
- `js/cart.js` - Shopping cart functionality
- `js/modal.js` - Product detail modal
- `js/favourites.js` - Favourites system

## Key Features
✅ Menu generated dynamically from CSV  
✅ Unique IDs for all 51 items  
✅ Images loaded automatically based on ID (`{id}.png`)  
✅ Easy to add/edit/remove items  
✅ Modular, maintainable code structure  
✅ Categories grouped automatically  

## Troubleshooting
- **Image not showing?** Check that the filename matches the ID exactly (case-sensitive)
- **Menu not loading?** Verify CSV format and ensure no syntax errors
- **Wrong category grouping?** Each unique ID creates its own entry; items with same category name are grouped together
