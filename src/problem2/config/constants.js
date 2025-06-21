// Application constants
export const API_CONFIG = {
  PRICES_URL: "https://interview.switcheo.com/prices.json",
  TOKEN_ICONS_BASE_URL:
    "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/",
};

// Default token pairs for auto-selection
export const DEFAULT_TOKENS = {
  FROM_PREFERENCES: ["ETH", "ATOM"],
  TO_PREFERENCES: ["USDC", "USD"],
};

// Mock data for development/fallback
export const MOCK_TOKENS = [
  {
    symbol: "ETH",
    price: 1645.93,
    usdPrice: 1645.93,
    iconUrl:
      "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ETH.svg",
  },
  {
    symbol: "USDC",
    price: 0.989832,
    usdPrice: 0.989832,
    iconUrl:
      "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USDC.svg",
  },
  {
    symbol: "USD",
    price: 1,
    usdPrice: 1,
    iconUrl:
      "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USD.svg",
  },
  {
    symbol: "ATOM",
    price: 7.186657,
    usdPrice: 7.186657,
    iconUrl:
      "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ATOM.svg",
  },
  {
    symbol: "BLUR",
    price: 0.208115,
    usdPrice: 0.208115,
    iconUrl:
      "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/BLUR.svg",
  },
];

// Sample amounts for different tokens
export const SAMPLE_AMOUNTS = {
  ETH: "1",
  ATOM: "10",
  USDC: "100",
  DEFAULT: "1",
};
