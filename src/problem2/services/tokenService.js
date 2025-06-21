// Token data service for handling all token-related data operations
import {
  API_CONFIG,
  DEFAULT_TOKENS,
  MOCK_TOKENS,
  SAMPLE_AMOUNTS,
} from "../config/constants.js";

/**
 * Fetch token data from the API
 * @returns {Promise<Array>} Raw token data from API
 */
export async function fetchTokenData() {
  const response = await fetch(API_CONFIG.PRICES_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Process raw token data into a structured format
 * @param {Array} rawData - Raw token data from API
 * @returns {Array} Processed token data
 */
export function processTokenData(rawData) {
  const tokenMap = new Map();

  rawData.forEach((item) => {
    const { currency, price, date } = item;

    if (
      !tokenMap.has(currency) ||
      new Date(date) > new Date(tokenMap.get(currency).date)
    ) {
      tokenMap.set(currency, {
        symbol: currency,
        price: price,
        date: date,
        iconUrl: `${API_CONFIG.TOKEN_ICONS_BASE_URL}${currency}.svg`,
        usdPrice: price,
      });
    }
  });

  return Array.from(tokenMap.values()).filter((token) => token.price > 0);
}

/**
 * Get mock token data for development/fallback
 * @returns {Array} Mock token data
 */
export function getMockTokens() {
  return MOCK_TOKENS;
}

/**
 * Load and process token data with fallback to mock data
 * @returns {Promise<Array>} Processed token data
 */
export async function loadTokenData() {
  try {
    const rawData = await fetchTokenData();
    const processed = processTokenData(rawData);
    return processed.sort((a, b) => a.symbol.localeCompare(b.symbol));
  } catch (error) {
    console.error("Error loading token data:", error);
    // Fallback to mock data
    return getMockTokens();
  }
}

/**
 * Select default tokens based on preferences
 * @param {Array} tokens - Available tokens
 * @returns {Object} Object containing fromToken and toToken
 */
export function selectDefaultTokens(tokens) {
  // Use configured default tokens
  const fromToken =
    DEFAULT_TOKENS.FROM_PREFERENCES.reduce((found, symbol) => {
      return found || tokens.find((t) => t.symbol === symbol);
    }, null) || tokens[0];

  const toToken =
    DEFAULT_TOKENS.TO_PREFERENCES.reduce((found, symbol) => {
      return found || tokens.find((t) => t.symbol === symbol);
    }, null) ||
    tokens.find((t) => t.symbol !== fromToken?.symbol) ||
    tokens[1];

  return { fromToken, toToken };
}

/**
 * Get sample amount for a given token
 * @param {Object} token - Token object
 * @returns {string} Sample amount
 */
export function getSampleAmount(token) {
  if (!token) return SAMPLE_AMOUNTS.DEFAULT;
  return SAMPLE_AMOUNTS[token.symbol] || SAMPLE_AMOUNTS.DEFAULT;
}

/**
 * Filter tokens based on search query
 * @param {Array} tokens - Array of tokens to filter
 * @param {string} query - Search query
 * @returns {Array} Filtered tokens
 */
export function filterTokens(tokens, query) {
  if (!query) return tokens;
  const lowerQuery = query.toLowerCase();
  return tokens.filter((token) =>
    token.symbol.toLowerCase().includes(lowerQuery)
  );
}
