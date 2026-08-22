# No9Bubble Tea CMS

A dynamic bubble tea shop website with a Content Management System (CMS) for managing menu items.

## 📁 Project Structure

```
/workspace/
├── index.html              # Main HTML file - contains the UI structure
├── README.md               # This file - project documentation
├── CMS_README.md           # Detailed CMS documentation and setup guide
├── js/
│   └── app.js              # Main application logic (class-based JavaScript)
├── cms/
│   ├── data/
│   │   └── menu.csv        # Menu database with 51 items (name, price, category, image)
│   └── images/             # Product images in PNG format
```

## 🚀 Features

- **Dynamic Menu Loading** - Menu items are loaded from `cms/data/menu.csv`
- **Shopping Cart** - Add items with customizations (size M/L, toppings), stored in localStorage
- **Modal System** - Interactive modals for item customization (sugar level, ice level, size)
- **Category Grouping** - 8 menu categories:
  - Brown Sugar
  - Milk Tea
  - Fruit Tea
  - Slushies
  - Milk Shakes
  - Waffles
  - Soft Serve
  - Coffee & Hot Drinks
- **WhatsApp Checkout** - Orders are sent via WhatsApp
- **Scroll Reveal Animations** - Smooth animations as users scroll

## 🛠️ How It Works

1. **Page Load**: The app fetches `menu.csv` and parses it into menu items
2. **Menu Rendering**: Items are grouped by category and displayed dynamically
3. **User Interaction**: 
   - Click item → Modal opens for customization
   - Select options → Add to cart
   - Cart persists in browser localStorage
4. **Checkout**: Cart contents are formatted and sent to WhatsApp

## 📝 Notes

- All product images should be placed in `cms/images/` folder
- Menu data is managed via the CSV file (easy to update without code changes)
- The main logic is in `js/app.js` as a single class-based application

## 🔧 Future Improvements

Consider refactoring `app.js` into separate modules:
- `data-loader.js` - CSV fetching and parsing
- `cart-system.js` - Cart management and localStorage
- `modal-handler.js` - Modal open/close and form handling
- `menu-renderer.js` - DOM rendering for menu items