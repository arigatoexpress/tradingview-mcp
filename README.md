# tradingview-mcp

Unified TradingView MCP server for Claude Code — full agentic access to
TradingView Premium using TypeScript and Playwright.

## Testing

Unit tests are scoped to **pure utilities only** (no browser, no CDP, no
network). They run with [Vitest](https://vitest.dev) directly against the
TypeScript sources — no separate build step is required.

```bash
npm install
npm test
```

Tests live under `src/**/__tests__/` and are picked up automatically by
`vitest.config.ts`. To add a new test, create a sibling `__tests__/` folder
next to the module under test and add a `*.test.ts` file.

CI runs the same `npm install && npm test` on Node 20 for every push and pull
request to `master` (see `.github/workflows/ci.yml`).
