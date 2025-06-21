# Currency Swap Application 🔄

A modern, professional currency swap interface built with **Vite** and vanilla JavaScript. Features real-time price data, token search, swap functionality, and beautiful animations with a modular, scalable architecture.

![Currency Swap Demo](https://img.shields.io/badge/Status-Production%20Ready-green)

## ✨ Features

### Core Functionality

- **Real-time Price Data** - Fetches live token prices from Switcheo API
- **Token Selection** - Searchable dropdown with token icons
- **Amount Validation** - Input validation with error messages using BigNumber.js
- **Swap Functionality** - Animated token position swapping
- **Exchange Rate Display** - Real-time rate calculations with high precision
- **Transaction Simulation** - Mock backend interactions with loading states

### UI/UX Excellence

- **Modern Design** - Dark theme with gradient accents
- **Responsive Layout** - Mobile-first responsive design
- **Smooth Animations** - CSS transitions and loading states
- **Professional Icons** - Token icons from Switcheo repository
- **Accessibility** - Keyboard navigation and screen reader support
- **Error Handling** - User-friendly error messages
- **Component-based UI** - Dynamic HTML component loading

### Technical Features

- **Vite Build System** - Lightning-fast development and builds
- **ES6 Modules** - Modern JavaScript architecture
- **Modular Architecture** - Organized into services, utilities, and components
- **BigNumber.js Integration** - Precise decimal calculations for financial operations
- **Debounced Inputs** - Optimized performance
- **State Management** - Clean application state handling
- **API Integration** - Robust data fetching with fallbacks
- **Component System** - Reusable HTML components with templating

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/problem2/
├── index.html              # Main HTML entry point
├── script.js               # Main application class and orchestration
├── app-init.js             # Application initialization and component loading
├── style.css               # Styling and animations
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
│
├── components/             # HTML Components
│   ├── component-loader.js # Component loading utility
│   ├── confirm-button.html # Confirm transaction button
│   ├── exchange-rate.html  # Exchange rate display
│   ├── input-group.html    # Token input with dropdown
│   ├── loading-screen.html # Loading overlay
│   ├── swap-button.html    # Token swap button
│   ├── swap-header.html    # Application header
│   └── transaction-status.html # Transaction status modal
│
├── config/                 # Configuration files
│   ├── bignumber.js        # BigNumber.js configuration
│   └── constants.js        # Application constants and API endpoints
│
├── services/              # Business logic layer
│   └── tokenService.js    # Token data fetching and processing
│
├── utils/                 # Utility functions
│   ├── bignumber.js       # BigNumber utilities and validation
│   ├── dom.js             # DOM utility functions
│   ├── domManager.js      # DOM state management
│   ├── eventHandlers.js   # Event handling logic
│   └── formatting.js      # Number and price formatting
│
└── dist/                  # Production build output
```

## 🎯 Architecture Overview

### Modular Design

The application follows a **modular architecture** with clear separation of concerns:

#### **Core Application Layer** (`script.js`)

- **CurrencySwapApp** - Main application class orchestrating all functionality
- State management for tokens, amounts, and exchange rates
- Business logic coordination between services and UI

#### **Initialization Layer** (`app-init.js`)

- Dynamic component loading and templating
- Application bootstrap and error handling
- Component dependency management

#### **Service Layer** (`services/`)

- **TokenService** - API integration, data processing, and business logic
- Token data fetching from Switcheo API
- Default token selection and filtering logic
- Mock data fallback for offline scenarios

#### **Utility Layer** (`utils/`)

- **DOMManager** - Complete DOM manipulation and UI state management
- **EventHandlers** - Centralized event handling with debouncing
- **BigNumber Utils** - High-precision mathematical operations
- **Formatting** - Consistent number and currency formatting
- **DOM Utils** - Common DOM operations and helpers

#### **Component Layer** (`components/`)

- **HTML Components** - Reusable UI components with templating
- **Component Loader** - Dynamic component loading with caching
- Template processing with placeholder replacement

#### **Configuration Layer** (`config/`)

- **Constants** - API endpoints, default tokens, and configuration
- **BigNumber Config** - Precision settings for financial calculations

### Data Flow

```
User Input → EventHandlers → CurrencySwapApp → TokenService → DOMManager → UI Update
     ↑                                                                        ↓
     └──────────────────── User Feedback ←──────────────────────────────────┘
```

## 🚀 Deployment

### Build Process

```bash
npm run build
```

Generates optimized production files in `dist/`:

- Minified JavaScript and CSS
- Optimized assets with cache-busting hashes
- Source maps for debugging
- Component files and dependencies

### Hosting Options

- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop deployment
- **GitHub Pages**: Static hosting
- **Any CDN**: Standard static files

## 🔄 Future Enhancements

### Phase 2 Features

- [ ] Wallet integration (MetaMask, WalletConnect)
- [ ] Transaction history with local storage
- [ ] Price charts and analytics
- [ ] Multiple DEX integration
- [ ] Slippage tolerance settings
- [ ] Multi-language support

### Technical Improvements

- [ ] TypeScript migration
- [ ] Unit test coverage with Jest/Vitest
- [ ] Progressive Web App (PWA)
- [ ] Service worker caching
- [ ] GraphQL integration
- [ ] Component testing framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across components
5. Submit a pull request

### Development Guidelines

- Follow the modular architecture patterns
- Add new utilities to appropriate `utils/` files
- Create reusable components in `components/`
- Update configuration in `config/` files
- Maintain service separation in `services/`

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Technical Decisions

### Why Modular Architecture?

- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features and components
- **Testability**: Isolated modules for better testing
- **Reusability**: Components and utilities can be reused
- **Developer Experience**: Easier onboarding and debugging

### Why BigNumber.js?

- **Precision**: Avoids JavaScript floating-point errors
- **Financial Accuracy**: Essential for cryptocurrency calculations
- **Large Number Support**: Handles very large token amounts
- **Decimal Safety**: Precise decimal arithmetic

### Why Component System?

- **Modularity**: Reusable UI components
- **Performance**: Lazy loading and caching
- **Maintainability**: Separate HTML from JavaScript
- **Flexibility**: Easy templating and customization

### Architecture Choices

- **Class-based App**: Clear state management and method organization
- **Service Layer**: Business logic separation from UI
- **Event-driven**: Responsive user interactions with debouncing
- **DOM Manager**: Centralized DOM manipulation
- **Configuration Driven**: Easy customization and environment management

## 🎉 Conclusion

This currency swap application demonstrates modern web development best practices with a **modular, scalable architecture**. Built with performance, maintainability, and user experience in mind, it provides a professional foundation for production applications.

The modular design makes it easy to extend, test, and maintain while ensuring precise financial calculations and smooth user interactions.

**Ready to swap some tokens? Let's go! 🚀**
