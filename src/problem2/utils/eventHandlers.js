import { debounce } from "./dom.js";
import { isValidAmount } from "./bignumber.js";
import { filterTokens } from "../services/tokenService.js";
import { formatAmount } from "./formatting.js";

export class EventHandlers {
  constructor(app) {
    this.app = app;
    this.boundHandlers = this.createBoundHandlers();
  }

  createBoundHandlers() {
    return {
      handleAmountInput: this.handleAmountInput.bind(this),
      handleSwapTokens: this.handleSwapTokens.bind(this),
      handleConfirmSwap: this.handleConfirmSwap.bind(this),
      handleTokenSearch: this.handleTokenSearch.bind(this),
      handleDocumentClick: this.handleDocumentClick.bind(this),
      handleRateRefresh: this.handleRateRefresh.bind(this),
    };
  }

  setupEventListeners() {
    this.app.elements.inputAmount.addEventListener(
      "input",
      debounce(this.boundHandlers.handleAmountInput, 300)
    );

    // Prevent invalid characters at keyboard level
    this.app.elements.inputAmount.addEventListener("keydown", (e) => {
      // Allow: backspace, delete, tab, escape, enter, home, end, left, right
      if (
        [8, 9, 27, 13, 46, 35, 36, 37, 39].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        (e.keyCode === 90 && e.ctrlKey === true)
      ) {
        return;
      }

      // Allow numbers (0-9)
      if (e.keyCode >= 48 && e.keyCode <= 57) {
        return;
      }

      // Allow numpad numbers (0-9)
      if (e.keyCode >= 96 && e.keyCode <= 105) {
        return;
      }

      // Allow decimal point only if there isn't one already
      if (
        (e.keyCode === 190 || e.keyCode === 110) &&
        e.target.value.indexOf(".") === -1
      ) {
        return;
      }

      // Prevent all other keys including commas, letters, etc.
      e.preventDefault();
    });

    this.setupTokenSelector("from");
    this.setupTokenSelector("to");

    this.setupSearchHandler("from");
    this.setupSearchHandler("to");

    this.app.elements.swapButton.addEventListener(
      "click",
      this.boundHandlers.handleSwapTokens
    );

    this.app.elements.confirmButton.addEventListener(
      "click",
      this.boundHandlers.handleConfirmSwap
    );

    this.app.elements.rateRefresh.addEventListener(
      "click",
      this.boundHandlers.handleRateRefresh
    );

    // Global click handler for closing dropdowns
    document.addEventListener("click", this.boundHandlers.handleDocumentClick);

    this.app.elements.statusButton.addEventListener("click", () =>
      this.app.dom.hideTransactionStatus()
    );

    // Form submit prevention
    document.getElementById("swap-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.boundHandlers.handleConfirmSwap();
    });
  }

  setupTokenSelector(type) {
    this.app.elements[`${type}SelectedToken`].addEventListener("click", () =>
      this.app.toggleTokenDropdown(type)
    );
  }

  // Generic search handler setup with debouncing and clear functionality
  setupSearchHandler(type) {
    const searchElement = this.app.elements[`${type}TokenSearch`];
    const clearElement = this.app.elements[`${type}SearchClear`];

    searchElement.addEventListener("input", (e) => {
      const query = e.target.value;

      clearElement.style.display = query ? "flex" : "none";

      // No delay when clearing, delay when typing
      if (query === "") {
        this.boundHandlers.handleTokenSearch(e, type);
      } else {
        debounce((e) => this.boundHandlers.handleTokenSearch(e, type), 500)(e);
      }
    });

    clearElement.addEventListener("click", () => {
      searchElement.value = "";
      clearElement.style.display = "none";
      this.app.renderTokenList(type, this.app.tokens);
      searchElement.focus();
    });
  }

  handleAmountInput(event) {
    let value = event.target.value;

    // Remove all non-numeric characters except decimal point for validation
    let cleanValue = value.replace(/[^\d.]/g, "");

    // Ensure only one decimal point is allowed
    const parts = cleanValue.split(".");
    if (parts.length > 2) {
      // Keep only the first decimal point
      cleanValue = parts[0] + "." + parts.slice(1).join("");
    }

    // Update input value if it was cleaned
    if (value !== cleanValue) {
      event.target.value = cleanValue;
    }

    // Store the clean numeric value for calculations
    this.app.fromAmount = cleanValue;

    this.app.dom.clearError("from");

    if (cleanValue && !isValidAmount(cleanValue)) {
      this.app.dom.showError("from", "Please enter a valid number");
      return;
    }

    this.app.calculateToAmount();
    this.app.updateButtonState();
  }

  handleTokenSearch(event, type) {
    const query = event.target.value;
    const filteredTokens = filterTokens(this.app.tokens, query);
    this.app.renderTokenList(type, filteredTokens);
  }

  handleDocumentClick(event) {
    if (!event.target.closest(".token-selector")) {
      this.app.dom.closeAllDropdowns();
    }
  }

  handleSwapTokens() {
    if (!this.app.selectedFromToken || !this.app.selectedToToken) return;

    const tempToken = this.app.selectedFromToken;
    this.app.selectedFromToken = this.app.selectedToToken;
    this.app.selectedToToken = tempToken;

    this.app.dom.updateTokenDisplay("from", this.app.selectedFromToken);
    this.app.dom.updateTokenDisplay("to", this.app.selectedToToken);

    // Swap amounts if there's input - use formatted amount to avoid precision issues
    if (this.app.fromAmount && this.app.toAmount) {
      // Get the current formatted display value instead of the raw BigNumber string
      const currentOutputValue = this.app.elements.outputAmount.value;

      // Clean the formatted value for calculation (remove commas but keep decimals)
      const cleanOutputValue = currentOutputValue.replace(/,/g, "");

      this.app.fromAmount = cleanOutputValue;
      this.app.dom.setInputAmount(cleanOutputValue);
    }

    this.app.calculateToAmount();
  }

  async handleConfirmSwap() {
    if (!this.app.canConfirmSwap()) return;

    this.app.dom.setLoadingState(true, false);

    try {
      await this.app.simulateSwapTransaction();
      this.app.dom.showTransactionStatus(
        "success",
        "Swap Successful!",
        `Successfully swapped ${formatAmount(this.app.fromAmount)} ${
          this.app.selectedFromToken.symbol
        } for ${formatAmount(this.app.toAmount)} ${
          this.app.selectedToToken.symbol
        }`
      );
      this.app.resetForm();
    } catch (error) {
      console.error("Swap failed:", error);
      this.app.dom.showTransactionStatus(
        "error",
        "Swap Failed",
        "Transaction failed. Please try again."
      );
    } finally {
      this.app.dom.setLoadingState(false, this.app.canConfirmSwap());
    }
  }

  handleRateRefresh() {
    this.app.dom.handleRateRefresh();
    this.app.calculateToAmount();
  }
}
