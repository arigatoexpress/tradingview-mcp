import { defineConfig } from "vitest/config";

/**
 * Minimal Vitest config for tradingview-mcp.
 *
 * Goals:
 *  - Pure unit tests only (no DOM, no live browser, no CDP)
 *  - tsconfig-aware via Vitest's built-in TS support (no extra build step)
 *  - Tests live alongside source under src/__tests__/
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
    globals: false,
    reporters: ["default"],
    passWithNoTests: false,
  },
});
