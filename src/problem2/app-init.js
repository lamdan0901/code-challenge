/**
 * Application Initialization
 * Handles component loading and app startup
 */

import ComponentLoader from "./components/component-loader.js";

const loader = new ComponentLoader();

const components = [
  {
    target: "#loading-container",
    component: "./components/loading-screen.html",
    replace: true,
  },
  {
    target: "#header-container",
    component: "./components/swap-header.html",
    replace: true,
  },
  {
    target: "#from-input-container",
    component: "./components/input-group.html",
    replace: true,
    templateData: {
      INPUT_ID: "input-amount",
      LABEL_TEXT: "You send",
      PLACEHOLDER: "Enter amount",
      READONLY_ATTR: "",
      TOKEN_SELECTOR_ID: "from-token-selector",
      SELECTED_TOKEN_ID: "from-selected-token",
      TOKEN_ICON_ID: "from-token-icon",
      TOKEN_SYMBOL_ID: "from-token-symbol",
      TOKEN_DROPDOWN_ID: "from-token-dropdown",
      TOKEN_SEARCH_ID: "from-token-search",
      SEARCH_CLEAR_ID: "from-search-clear",
      TOKEN_LIST_ID: "from-token-list",
      USD_VALUE_ID: "from-usd-value",
      ERROR_ID: "from-error",
    },
  },
  {
    target: "#swap-button-container",
    component: "./components/swap-button.html",
    replace: true,
  },
  {
    target: "#to-input-container",
    component: "./components/input-group.html",
    replace: true,
    templateData: {
      INPUT_ID: "output-amount",
      LABEL_TEXT: "You receive",
      PLACEHOLDER: "Output amount",
      READONLY_ATTR: "readonly",
      TOKEN_SELECTOR_ID: "to-token-selector",
      SELECTED_TOKEN_ID: "to-selected-token",
      TOKEN_ICON_ID: "to-token-icon",
      TOKEN_SYMBOL_ID: "to-token-symbol",
      TOKEN_DROPDOWN_ID: "to-token-dropdown",
      TOKEN_SEARCH_ID: "to-token-search",
      SEARCH_CLEAR_ID: "to-search-clear",
      TOKEN_LIST_ID: "to-token-list",
      USD_VALUE_ID: "to-usd-value",
      ERROR_ID: "to-error",
    },
  },
  {
    target: "#exchange-rate-container",
    component: "./components/exchange-rate.html",
    replace: true,
  },
  {
    target: "#swap-form",
    component: "./components/confirm-button.html",
    replace: false,
  },
  {
    target: "#transaction-status-container",
    component: "./components/transaction-status.html",
    replace: true,
  },
];

/**
 * Initialize the application
 * Loads all components and signals when ready
 */
async function initializeApp() {
  try {
    console.log("Loading application components...");
    await loader.loadComponents(components);
    console.log("All components loaded successfully");

    // Dispatch custom event to signal components are ready
    window.dispatchEvent(new CustomEvent("componentsLoaded"));
  } catch (error) {
    console.error("Failed to load components:", error);

    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff4444;
      color: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    errorDiv.innerHTML = `
      <h3>Failed to load application</h3>
      <p>Please refresh the page to try again</p>
      <button onclick="location.reload()" style="
        background: white;
        color: #ff4444;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        margin-top: 1rem;
        cursor: pointer;
      ">Refresh Page</button>
    `;
    document.body.appendChild(errorDiv);
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);

export { initializeApp, components, loader };
