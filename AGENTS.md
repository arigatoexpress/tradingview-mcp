# TradingView MCP

## Project Overview
Unified TradingView MCP server for Claude Code — full agentic access to TradingView Premium.

## Tech Stack
- TypeScript / Node.js
- Express server
- Vitest for testing
- Playwright for browser automation

## Development Commands
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Dev mode
npm run dev
```

## Dependencies
- `@anthropic-ai/sdk` — Anthropic API client
- `@modelcontextprotocol/sdk` — MCP SDK
- `@mathieuc/tradingview` — TradingView client
- `playwright` — Browser automation
- `express` — HTTP server
- `zod` — Schema validation

## Testing
Vitest is configured. Run `npm test` to execute the test suite.
