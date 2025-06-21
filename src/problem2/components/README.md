# Component-Based Architecture

This directory contains modular HTML components that make up the Currency Swap application. The components are designed to be reusable, maintainable, and easy to modify.

## 📁 Component Structure

```
components/
├── README.md                 # This documentation
├── component-loader.js       # Component loading utility
├── loading-screen.html       # Loading screen component
├── swap-header.html         # Application header
├── input-group.html         # Reusable input group template
├── swap-button.html         # Currency swap button
├── exchange-rate.html       # Exchange rate display
├── confirm-button.html      # Confirmation button
└── transaction-status.html  # Transaction status modal

app-init.js                   # Application initialization script
```

## 🔧 Component Loading System

The `component-loader.js` provides a robust system for loading and injecting HTML components:

### Features

- **Async Loading**: Components are loaded asynchronously for better performance
- **Template Processing**: Supports placeholder replacement for reusable components
- **Caching**: Components are cached after first load to improve performance
- **Error Handling**: Graceful error handling with detailed error messages
- **Parallel Loading**: Multiple components can be loaded simultaneously

### Usage Example

```javascript
import ComponentLoader from './components/component-loader.js';

const loader = new ComponentLoader();

// Load a single component
await loader.injectComponent('#target', './components/header.html');

// Load with template data
await loader.injectComponent('#target', './components/input-group.html', {
  INPUT_ID: 'my-input',
  LABEL_TEXT: 'Enter value'
});

// Load multiple components in parallel
await loader.loadComponents([
  { target: '#header', component: './components/header.html' },
  { target: '#form', component: './components/input-group.html', templateData: {...} }
]);
```

## 🎯 Template System

The `input-group.html` component demonstrates the template system using placeholder syntax:

```html
<input id="{{INPUT_ID}}" placeholder="{{PLACEHOLDER}}" />
```

### Available Placeholders

For `input-group.html`:

- `{{INPUT_ID}}` - Input element ID
- `{{LABEL_TEXT}}` - Label text content
- `{{PLACEHOLDER}}` - Input placeholder text
- `{{READONLY_ATTR}}` - Readonly attribute (empty or "readonly")
- `{{TOKEN_SELECTOR_ID}}` - Token selector container ID
- `{{SELECTED_TOKEN_ID}}` - Selected token display ID
- `{{TOKEN_ICON_ID}}` - Token icon image ID
- `{{TOKEN_SYMBOL_ID}}` - Token symbol text ID
- `{{TOKEN_DROPDOWN_ID}}` - Dropdown container ID
- `{{TOKEN_SEARCH_ID}}` - Search input ID
- `{{SEARCH_CLEAR_ID}}` - Clear button ID
- `{{TOKEN_LIST_ID}}` - Token list container ID
- `{{USD_VALUE_ID}}` - USD value display ID
- `{{ERROR_ID}}` - Error message container ID

## 📦 Component Descriptions

### `loading-screen.html`

- **Purpose**: Initial loading state for the application
- **Dependencies**: None
- **Template**: No placeholders

### `swap-header.html`

- **Purpose**: Main application header with title and description
- **Dependencies**: None
- **Template**: No placeholders

### `input-group.html`

- **Purpose**: Reusable input component for token selection and amount entry
- **Dependencies**: None
- **Template**: Highly templated for reuse (see placeholders above)
- **Usage**: Used for both "from" and "to" token inputs

### `swap-button.html`

- **Purpose**: Button to swap between "from" and "to" tokens
- **Dependencies**: None
- **Template**: No placeholders

### `exchange-rate.html`

- **Purpose**: Display current exchange rate with refresh functionality
- **Dependencies**: None
- **Template**: No placeholders

### `confirm-button.html`

- **Purpose**: Main action button to confirm the swap
- **Dependencies**: None
- **Template**: No placeholders

### `transaction-status.html`

- **Purpose**: Modal to show transaction status and results
- **Dependencies**: None
- **Template**: No placeholders

### `../app-init.js`

- **Purpose**: Application initialization and component loading orchestration
- **Dependencies**: `component-loader.js`
- **Features**:
  - Component configuration management
  - Error handling with user-friendly messages
  - Event dispatching for application ready state
  - Modular and maintainable initialization logic

## 🔄 Loading Process

1. **DOM Ready**: Component loading begins when DOM is ready
2. **Parallel Load**: All components are loaded in parallel for performance
3. **Template Processing**: Placeholders are replaced with actual values
4. **Injection**: Components are injected into their target containers
5. **Script Execution**: Main application script runs after components are loaded

## ✨ Benefits

### Maintainability

- Each component is isolated and can be modified independently
- Clear separation of concerns
- Easy to locate and fix issues

### Reusability

- Components like `input-group.html` can be reused with different configurations
- Template system allows for flexible component adaptation

### Performance

- Components are cached after first load
- Parallel loading reduces initial load time
- Lazy loading possible for non-critical components

### Developer Experience

- Clear component structure makes development faster
- Template system reduces code duplication
- Easy to add new components

## 🔧 Adding New Components

1. **Create Component File**: Add new `.html` file in the `components/` directory
2. **Update Configuration**: Add component configuration to the main HTML file
3. **Add Templates**: Use `{{PLACEHOLDER}}` syntax for dynamic content
4. **Test Loading**: Ensure component loads correctly

### Example: Adding a new component

```javascript
// Add to components array in index.html
{
  target: '#my-new-component',
  component: './components/my-component.html',
  replace: true,
  templateData: {
    TITLE: 'My Component Title'
  }
}
```

## 🐛 Troubleshooting

### Component Not Loading

- Check the component path is correct
- Verify the target selector exists in the DOM
- Check browser console for error messages

### Template Not Working

- Ensure placeholder syntax uses double curly braces: `{{PLACEHOLDER}}`
- Verify templateData object contains the required keys
- Check for typos in placeholder names

### Performance Issues

- Components are cached automatically
- Use parallel loading for multiple components
- Consider lazy loading for non-critical components

## 🔮 Future Enhancements

- **Component Versioning**: Version management for component updates
- **Conditional Loading**: Load components based on conditions
- **Component Dependencies**: Automatic dependency resolution
- **Hot Reloading**: Development-time hot reloading for components
- **Component Validation**: Validate component structure and templates
