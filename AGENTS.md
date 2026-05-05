# TradingView MCP — Agent Guidelines

## Project Overview
TypeScript/Node MCP server connecting Claude Code to TradingView via Playwright browser automation and WebSocket data feeds.

## Tech Stack
- TypeScript 5.7+ (ESNext, strict mode)
- Node.js 20+
- Vitest for testing
- Playwright for browser automation
- Express for webhooks
- MCP SDK for stdio transport

## Coding Conventions
- Use **double quotes** for strings (Prettier-enforced).
- Use **2-space indentation**.
- Target **ES2022**.
- Prefer `const`/`let` over `var`.
- Always handle Promise rejections; use `try/catch` for async operations.
- Prefer explicit return types on public methods.
- Avoid `any` — use `unknown` with type guards when types are uncertain.
- Do not commit `dist/`, `.env`, or log files.

## Testing Requirements
- **Pure unit tests only** — no live browsers, no CDP, no network calls.
- Mock Playwright `Page`/`BrowserContext` for browser automation tests.
- Mock Express with `supertest` for HTTP route tests.
- Tests live in `src/**/__tests__/` (module-adjacent) or `tests/` (integration-style).
- All tests must pass before committing.

## Safety Boundaries
1. **Never change TradingView DOM selectors** without verifying them in a live Playwright session. Selectors are brittle and break silently.
2. **Never log session cookies** (`sessionid`, `sessionid_sign`) or the `WEBHOOK_SECRET`. These are secrets.
3. **Never commit `.env` files** — use `.env.example` for documentation only.
4. Browser automation methods should use `page.evaluate()` sparingly; prefer explicit Playwright actions where possible.
5. The webhook server listens on `127.0.0.1` by default — do not expose to `0.0.0.0` in production without authentication.

## Dependency Policy
- Do not add runtime dependencies without justification.
- `@anthropic-ai/sdk` was removed because it is unused — do not re-add without a concrete use case.
- Keep `playwright` as a standard (non-dev) dependency because the server launches browsers at runtime.

## Scripts Reference
| Script | Purpose |
|--------|---------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run dev` | Run via `tsx` (no build step) |
| `npm test` | Run Vitest suite |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (CI) |
| `npm run typecheck` | `tsc --noEmit` |
