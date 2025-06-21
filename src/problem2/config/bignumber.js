import BigNumber from "bignumber.js";

// Configure BigNumber for optimal precision in financial calculations
BigNumber.config({
  DECIMAL_PLACES: 30,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  EXPONENTIAL_AT: [-18, 20],
  RANGE: [-1e9, 1e9],
  CRYPTO: false,
});

export { BigNumber };
