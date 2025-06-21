import { formatAmount, formatPrice } from "./formatting.js";
import { showGlobalError } from "./dom.js";

/**
 * DOM Management Module
 * Handles all DOM operations and UI state management
 */
export class DOMManager {
  constructor() {
    this.elements = {};
    this.initializeElements();
  }

  initializeElements() {
    const requiredElements = {
      loadingScreen: "loading-screen",
      mainContainer: ".main-container",
      inputAmount: "input-amount",
      outputAmount: "output-amount",
      fromTokenSelector: "from-token-selector",
      fromSelectedToken: "from-selected-token",
      fromTokenIcon: "from-token-icon",
      fromTokenSymbol: "from-token-symbol",
      fromTokenDropdown: "from-token-dropdown",
      fromTokenSearch: "from-token-search",
      fromTokenList: "from-token-list",
      fromSearchClear: "from-search-clear",
      toTokenSelector: "to-token-selector",
      toSelectedToken: "to-selected-token",
      toTokenIcon: "to-token-icon",
      toTokenSymbol: "to-token-symbol",
      toTokenDropdown: "to-token-dropdown",
      toTokenSearch: "to-token-search",
      toTokenList: "to-token-list",
      toSearchClear: "to-search-clear",
      fromUsdValue: "from-usd-value",
      toUsdValue: "to-usd-value",
      fromError: "from-error",
      toError: "to-error",
      swapButton: "swap-button",
      confirmButton: "confirm-button",
      buttonText: ".button-text",
      buttonLoading: ".button-loading",
      exchangeRate: "exchange-rate",
      rateText: "rate-text",
      rateRefresh: "rate-refresh",
      transactionStatus: "transaction-status",
      statusIcon: "status-icon",
      statusTitle: "status-title",
      statusMessage: "status-message",
      statusButton: "status-button",
    };

    this.elements = {};
    const missingElements = [];

    for (const [key, selector] of Object.entries(requiredElements)) {
      const element = selector.startsWith(".")
        ? document.querySelector(selector)
        : document.getElementById(selector);

      this.elements[key] = element;

      if (!element) {
        missingElements.push(selector);
      }
    }

    if (missingElements.length > 0) {
      console.warn("Missing DOM elements:", missingElements);
      throw new Error(
        `Required DOM elements not found: ${missingElements.join(
          ", "
        )}. Please ensure components are loaded.`
      );
    }
  }

  getElements() {
    return this.elements;
  }

  renderTokenList(type, tokens, selectedToken, onTokenSelect) {
    const listElement =
      type === "from" ? this.elements.fromTokenList : this.elements.toTokenList;

    if (tokens.length === 0) {
      // Show no results message
      listElement.innerHTML = `
        <div class="no-results-message">
          <svg viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <h4>No tokens found</h4>
          <p>Try adjusting your search terms</p>
        </div>
      `;
      return;
    }

    listElement.innerHTML = tokens
      .map((token) => {
        const isSelected =
          selectedToken && selectedToken.symbol === token.symbol;
        return `
      <div class="token-item ${isSelected ? "selected" : ""}" data-symbol="${
          token.symbol
        }" data-type="${type}">
        <img 
          src="${token.iconUrl}" 
          alt="${token.symbol}" 
          class="token-icon"
          onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHA+JDwvcD4KPC9zdmc+Cjwvc3ZnPgo='"
          onload="this.classList.add('loaded')"
        >
        <div class="token-info">
          <div class="symbol">${token.symbol}</div>
          <div class="price">$${formatPrice(token.usdPrice)}</div>
        </div>
      </div>
    `;
      })
      .join("");

    // Add click handlers
    listElement.querySelectorAll(".token-item").forEach((item) => {
      item.addEventListener("click", () => {
        const symbol = item.dataset.symbol;
        const token = tokens.find((t) => t.symbol === symbol);
        if (token && onTokenSelect) {
          onTokenSelect(type, token);
        }
      });
    });

    // Scroll to selected token if it exists
    if (selectedToken) {
      setTimeout(() => {
        const selectedItem = listElement.querySelector(".token-item.selected");
        if (selectedItem) {
          selectedItem.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          selectedItem.focus();
        }
      }, 100);
    }
  }

  updateTokenDisplay(type, token) {
    const iconElement =
      type === "from" ? this.elements.fromTokenIcon : this.elements.toTokenIcon;
    const symbolElement =
      type === "from"
        ? this.elements.fromTokenSymbol
        : this.elements.toTokenSymbol;

    iconElement.src = token.iconUrl;
    iconElement.alt = token.symbol;
    iconElement.style.display = "block";
    iconElement.onload = () => iconElement.classList.add("loaded");
    iconElement.onerror = () => {
      iconElement.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHA+JDwvcD4KPC9zdmc+Cjwvc3ZnPgo=";
    };

    symbolElement.textContent = token.symbol;
  }

  toggleTokenDropdown(type) {
    const selector =
      type === "from"
        ? this.elements.fromTokenSelector
        : this.elements.toTokenSelector;
    const isActive = selector.classList.contains("active");

    this.elements.fromTokenSelector.classList.remove("active");
    this.elements.toTokenSelector.classList.remove("active");

    if (!isActive) {
      selector.classList.add("active");
      const searchInput =
        type === "from"
          ? this.elements.fromTokenSearch
          : this.elements.toTokenSearch;

      setTimeout(() => {
        searchInput.focus();
        this.focusSelectedToken(type);
      }, 100);
    }
  }

  focusSelectedToken(type) {
    const listElement =
      type === "from" ? this.elements.fromTokenList : this.elements.toTokenList;
    const selectedItem = listElement.querySelector(".token-item.selected");

    if (selectedItem) {
      selectedItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      selectedItem.classList.add("focused");

      setTimeout(() => {
        selectedItem.classList.remove("focused");
      }, 2000);
    }
  }

  closeTokenDropdown(type) {
    const selector =
      type === "from"
        ? this.elements.fromTokenSelector
        : this.elements.toTokenSelector;
    selector.classList.remove("active");
  }

  closeAllDropdowns() {
    this.elements.fromTokenSelector.classList.remove("active");
    this.elements.toTokenSelector.classList.remove("active");
  }

  updateUsdValues(fromValue, toValue) {
    this.elements.fromUsdValue.textContent = fromValue || "$0.00";
    this.elements.toUsdValue.textContent = toValue || "$0.00";
  }

  updateExchangeRate(fromSymbol, toSymbol, rate) {
    if (fromSymbol && toSymbol && rate) {
      this.elements.rateText.textContent = `1 ${fromSymbol} = ${formatAmount(
        rate
      )} ${toSymbol}`;
      this.elements.exchangeRate.style.display = "block";
    } else {
      this.elements.exchangeRate.style.display = "none";
    }
  }

  updateButtonState(canConfirm, buttonText) {
    this.elements.confirmButton.disabled = !canConfirm;
    this.elements.buttonText.textContent = buttonText;
  }

  setLoadingState(loading, canConfirm = false) {
    this.elements.buttonText.style.display = loading ? "none" : "block";
    this.elements.buttonLoading.style.display = loading ? "flex" : "none";
    this.elements.confirmButton.disabled = loading || !canConfirm;
  }

  showTransactionStatus(type, title, message) {
    this.elements.statusIcon.className = `status-icon ${type}`;
    this.elements.statusIcon.textContent = type === "success" ? "✓" : "✗";
    this.elements.statusTitle.textContent = title;
    this.elements.statusMessage.textContent = message;
    this.elements.transactionStatus.style.display = "flex";
  }

  hideTransactionStatus() {
    this.elements.transactionStatus.style.display = "none";

    // Auto focus on the input field after closing the modal
    setTimeout(() => {
      this.elements.inputAmount.focus();
      this.elements.inputAmount.select();
    }, 100);
  }

  resetForm() {
    this.elements.inputAmount.value = "";
    this.elements.outputAmount.value = "";
  }

  setFormValues(fromAmount, toAmount) {
    this.elements.inputAmount.value = fromAmount || "";
    this.elements.outputAmount.value = toAmount || "";
  }

  handleRateRefresh() {
    this.elements.rateRefresh.style.transform = "rotate(360deg)";
    setTimeout(() => {
      this.elements.rateRefresh.style.transform = "";
    }, 500);
  }

  showLoading(show) {
    if (show) {
      this.elements.loadingScreen.style.display = "flex";
      this.elements.loadingScreen.classList.remove("hidden");
      this.elements.mainContainer.style.display = "none";
      this.elements.mainContainer.classList.remove("visible");
    } else {
      this.elements.loadingScreen.classList.add("hidden");
      this.elements.mainContainer.style.display = "flex";

      setTimeout(() => {
        this.elements.mainContainer.classList.add("visible");
      }, 50);

      setTimeout(() => {
        this.elements.loadingScreen.style.display = "none";
      }, 350);
    }
  }

  showError(type, message) {
    const errorElement =
      type === "from" ? this.elements.fromError : this.elements.toError;
    errorElement.textContent = message;
  }

  clearError(type) {
    const errorElement =
      type === "from" ? this.elements.fromError : this.elements.toError;
    errorElement.textContent = "";
  }

  showGlobalError(message) {
    showGlobalError(message);
  }

  focusInput() {
    setTimeout(() => {
      this.elements.inputAmount.focus();
      this.elements.inputAmount.select();
    }, 100);
  }

  setInputAmount(value) {
    this.elements.inputAmount.value = value;
  }
}
