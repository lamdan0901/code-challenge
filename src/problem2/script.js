import {
  getSampleAmount,
  loadTokenData,
  selectDefaultTokens,
} from "./services/tokenService.js";
import { createBigNumber, isValidAmount } from "./utils/bignumber.js";
import { DOMManager } from "./utils/domManager.js";
import { formatAmount, formatPrice } from "./utils/formatting.js";
import { EventHandlers } from "./utils/eventHandlers.js";

class CurrencySwapApp {
  constructor() {
    this.tokens = [];
    this.selectedFromToken = null;
    this.selectedToToken = null;
    this.fromAmount = "";
    this.toAmount = "";
    this.exchangeRate = 0;
    this.isLoading = false;

    this.dom = new DOMManager();
    this.elements = this.dom.getElements();
    this.eventHandlers = new EventHandlers(this);

    this.initialize();
  }

  async initialize() {
    try {
      this.dom.showLoading(true);
      await this.loadTokenData();
      this.eventHandlers.setupEventListeners();
      this.dom.showLoading(false);
      this.dom.focusInput();
    } catch (error) {
      console.error("Failed to initialize app:", error);
      this.dom.showGlobalError(
        "Failed to load application. Please refresh the page."
      );
    }
  }

  async loadTokenData() {
    try {
      this.tokens = await loadTokenData();
      this.populateTokenLists();
      this.autoSelectTokens();
    } catch (error) {
      console.error("Error loading token data:", error);
      this.showError("Failed to load token data. Please refresh the page.");
    }
  }

  autoSelectTokens() {
    const { fromToken, toToken } = selectDefaultTokens(this.tokens);

    if (fromToken) this.selectToken("from", fromToken);
    if (toToken) this.selectToken("to", toToken);

    // Set a sample amount to make the interface more intuitive
    this.setSampleAmount();
  }

  setSampleAmount() {
    if (this.selectedFromToken) {
      const sampleAmount = getSampleAmount(this.selectedFromToken);

      this.fromAmount = sampleAmount;
      // Set the sample amount directly without comma formatting
      this.dom.setInputAmount(sampleAmount);
      this.calculateToAmount();
      this.updateButtonState();
    }
  }

  populateTokenLists() {
    this.renderTokenList("from", this.tokens);
    this.renderTokenList("to", this.tokens);
  }

  renderTokenList(type, tokens) {
    const selectedToken =
      type === "from" ? this.selectedFromToken : this.selectedToToken;

    this.dom.renderTokenList(type, tokens, selectedToken, (type, token) => {
      this.selectToken(type, token);
      this.dom.closeTokenDropdown(type);
    });
  }

  calculateToAmount() {
    if (
      !this.selectedFromToken ||
      !this.selectedToToken ||
      !this.fromAmount ||
      !isValidAmount(this.fromAmount)
    ) {
      this.toAmount = "";
      this.dom.setFormValues(this.fromAmount, "");
      this.updateUsdValues();
      return;
    }

    try {
      // Use BigNumber for precise calculations
      const fromValue = createBigNumber(this.fromAmount);
      const fromPrice = createBigNumber(this.selectedFromToken.price);
      const toPrice = createBigNumber(this.selectedToToken.price);

      // Calculate exchange rate with high precision and store it as a BigNumber
      const rate = fromPrice.dividedBy(toPrice);
      this.exchangeRate = rate; // Keep as BigNumber for precision

      const toValue = fromValue.multipliedBy(rate);
      this.toAmount = toValue.toString();

      this.dom.setFormValues(this.fromAmount, formatAmount(toValue));
      this.updateUsdValues();
      this.updateExchangeRate();
    } catch (error) {
      console.error("Calculation error:", error);
      this.toAmount = "";
      this.dom.setFormValues(this.fromAmount, "");
      this.updateUsdValues();
    }
  }

  updateUsdValues() {
    let fromValue = "$0.00";
    let toValue = "$0.00";

    try {
      if (
        this.selectedFromToken &&
        this.fromAmount &&
        isValidAmount(this.fromAmount)
      ) {
        const amount = createBigNumber(this.fromAmount);
        const price = createBigNumber(this.selectedFromToken.usdPrice);
        const usdValue = amount.multipliedBy(price);
        fromValue = `$${formatPrice(usdValue)}`;
      }

      if (
        this.selectedToToken &&
        this.toAmount &&
        isValidAmount(this.toAmount)
      ) {
        const amount = createBigNumber(this.toAmount);
        const price = createBigNumber(this.selectedToToken.usdPrice);
        const usdValue = amount.multipliedBy(price);
        toValue = `$${formatPrice(usdValue)}`;
      }
    } catch (error) {
      console.error("USD value calculation error:", error);
    }

    this.dom.updateUsdValues(fromValue, toValue);
  }

  updateExchangeRate() {
    if (this.selectedFromToken && this.selectedToToken && this.exchangeRate) {
      try {
        const rate = createBigNumber(this.exchangeRate);
        this.dom.updateExchangeRate(
          this.selectedFromToken.symbol,
          this.selectedToToken.symbol,
          rate
        );
      } catch (error) {
        console.error("Exchange rate display error:", error);
        this.dom.updateExchangeRate(null, null, null);
      }
    } else {
      this.dom.updateExchangeRate(null, null, null);
    }
  }

  selectToken(type, token) {
    if (type === "from") {
      this.selectedFromToken = token;
      this.dom.updateTokenDisplay("from", token);
    } else {
      this.selectedToToken = token;
      this.dom.updateTokenDisplay("to", token);
    }

    // Re-render token lists to update selected state
    this.populateTokenLists();

    this.calculateToAmount();
    this.updateButtonState();
  }

  toggleTokenDropdown(type) {
    this.dom.toggleTokenDropdown(type);
  }

  async simulateSwapTransaction() {
    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 1000)
    );

    // Simulate occasional failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Transaction failed");
    }
  }

  canConfirmSwap() {
    try {
      if (
        !this.selectedFromToken ||
        !this.selectedToToken ||
        !this.fromAmount ||
        this.isLoading
      ) {
        return false;
      }

      if (!isValidAmount(this.fromAmount)) {
        return false;
      }

      const amount = createBigNumber(this.fromAmount);
      return amount.isGreaterThan(0);
    } catch (error) {
      return false;
    }
  }

  updateButtonState() {
    const canConfirm = this.canConfirmSwap();
    let buttonText;

    if (canConfirm) {
      buttonText = "Confirm Swap";
    } else if (!this.selectedFromToken || !this.selectedToToken) {
      buttonText = "Select tokens to continue";
    } else if (!this.fromAmount || !isValidAmount(this.fromAmount)) {
      buttonText = "Enter amount";
    } else {
      try {
        const amount = createBigNumber(this.fromAmount);
        if (amount.isLessThanOrEqualTo(0)) {
          buttonText = "Enter amount greater than 0";
        } else {
          buttonText = "Enter valid amount";
        }
      } catch (error) {
        buttonText = "Enter valid amount";
      }
    }

    this.dom.updateButtonState(canConfirm, buttonText);
  }

  resetForm() {
    this.fromAmount = "";
    this.toAmount = "";
    this.dom.resetForm();
    this.updateUsdValues();
    this.updateButtonState();
  }
}

// Initialize the application when components are loaded
window.addEventListener("componentsLoaded", () => {
  window.swapApp = new CurrencySwapApp();
});

// Fallback: Initialize after DOM is loaded if components are already ready
document.addEventListener("DOMContentLoaded", () => {
  // Small delay to allow component loader to run first
  setTimeout(() => {
    if (!window.swapApp && document.getElementById("loading-screen")) {
      window.swapApp = new CurrencySwapApp();
    }
  }, 100);
});

// Export for potential module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = CurrencySwapApp;
}
