# TradingView MCP

A production-ready [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that connects Claude Code to **TradingView Premium** via Playwright browser automation and real-time WebSocket data feeds.

## What it does

This MCP server exposes 26+ tools across 6 categories, letting Claude Code:

- **Query real-time market data** — quotes, OHLCV candles, technical indicators, screener results
- **Capture chart screenshots** — full TradingView charts with your premium layouts and indicators
- **Manage alerts & watchlists** — create, list, and monitor alerts and watchlists through the web UI
- **Develop Pine Script** — validate, generate templates, write to the Pine Editor, and compile strategies
- **Receive webhook signals** — listen for real-time TradingView strategy alerts and forward them to Claude

## Architecture

```
┌─────────────┐      stdio       ┌──────────────────┐     Playwright      ┌─────────────┐
│ Claude Code │ ◄──────────────► │ TradingView MCP  │ ◄────────────────► │ TradingView │
│  (Client)   │                  │     Server       │   (headless)      │   (Web UI)  │
└─────────────┘                  └──────────────────┘                   └─────────────┘
                                        │
                                        │ WebSocket
                                        ▼
                                 ┌─────────────┐
                                 │ @mathieuc/  │
                                 │ tradingview │
                                 └─────────────┘
                                        │
                                        │ HTTP webhook
                                        ▼
                                 ┌─────────────┐
                                 │  Sapphire   │
                                 │  / External │
                                 └─────────────┘
```

## Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10
- **TradingView Premium account** (optional but recommended for full data access)
- **Playwright browsers** installed (`npx playwright install chromium`)

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/tradingview-mcp.git
cd tradingview-mcp

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Build
npm run build
```

## Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### Required environment variables

| Variable | Description |
|----------|-------------|
| `TRADINGVIEW_SESSION_ID` | Your `sessionid` cookie from tradingview.com |
| `TRADINGVIEW_SESSION_ID_SIGN` | Your `sessionid_sign` cookie from tradingview.com |

### Extracting session cookies

1. Open [TradingView](https://www.tradingview.com) in your browser and log in.
2. Open DevTools → **Application** → **Cookies** → `https://tradingview.com`
3. Copy the values for `sessionid` and `sessionid_sign`.
4. Paste them into your `.env` file.

> **Security note:** Never commit `.env` or log these values. The server reads them at startup and never exposes them in tool outputs.

### Optional environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WEBHOOK_PORT` | `3456` | Port for the webhook listener |
| `WEBHOOK_SECRET` | — | Secret token to validate incoming webhooks |

## Usage

### Claude Desktop

Add the server to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "tradingview": {
      "command": "node",
      "args": ["/absolute/path/to/tradingview-mcp/dist/index.js"],
      "env": {
        "TRADINGVIEW_SESSION_ID": "your_session_id",
        "TRADINGVIEW_SESSION_ID_SIGN": "your_session_id_sign",
        "WEBHOOK_PORT": "3456"
      }
    }
  }
}
```

### Claude Code (CLI)

```bash
TRADINGVIEW_SESSION_ID=xxx TRADINGVIEW_SESSION_ID_SIGN=yyy npx @anthropic-ai/claude-code
# Then /mcp add tradingview node dist/index.js
```

### Available tools

| Tool | Category | Description |
|------|----------|-------------|
| `tv_get_quote` | Market Data | Real-time price for a symbol |
| `tv_get_candles` | Market Data | OHLCV candlestick history |
| `tv_get_indicators` | Market Data | Technical indicator values (RSI, MACD, etc.) |
| `tv_technical_analysis` | Market Data | TradingView TA summary (BUY/SELL/NEUTRAL) |
| `tv_screen` | Market Data | Screener/scan for symbols |
| `tv_search_symbol` | Market Data | Search symbols by ticker or name |
| `tv_capture_chart` | Charts | Screenshot a chart with indicators |
| `tv_read_chart_data` | Charts | Extract visible prices and indicator values |
| `tv_screenshot` | Charts | Screenshot the current page |
| `tv_navigate` | Browser | Navigate to a TradingView path |
| `tv_page_info` | Browser | Get current URL and title |
| `tv_execute_js` | Browser | Execute JavaScript on the page |
| `tv_create_alert` | Alerts | Create a price/indicator alert |
| `tv_list_alerts` | Alerts | List active alerts |
| `tv_get_watchlist` | Watchlists | Get current watchlist contents |
| `tv_add_to_watchlist` | Watchlists | Add a symbol to the watchlist |
| `tv_pine_validate` | Pine Script | Validate Pine Script syntax locally |
| `tv_pine_generate_template` | Pine Script | Generate indicator/strategy/library templates |
| `tv_pine_generate_sapphire_strategy` | Pine Script | Generate a webhook-ready strategy |
| `tv_pine_list_templates` | Pine Script | List available templates |
| `tv_pine_open_editor` | Pine Script | Open the Pine Editor and read current code |
| `tv_pine_write` | Pine Script | Write code to the editor |
| `tv_pine_compile` | Pine Script | Compile and add to chart |
| `tv_webhook_signals` | Webhooks | Get recent webhook signals |
| `tv_webhook_stats` | Webhooks | Signal statistics |
| `tv_status` | System | Server status and registered tools |

## Development

```bash
# Run in dev mode (tsx, no build step)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check
npm run typecheck

# Lint
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format
npm run format

# Check formatting
npm run format:check

# Build for production
npm run build
```

### Test philosophy

- **Pure unit tests only** — no live browsers, no CDP, no network.
- Mock Playwright `Page`/`Context` for browser automation tests.
- Mock Express with `supertest` for HTTP route tests.
- Tests live in `src/**/__tests__/` (module-adjacent) and `tests/` (integration-style).

## Docker

```bash
# Build image
docker build -t tradingview-mcp .

# Run with env vars
docker run -e TRADINGVIEW_SESSION_ID=xxx -e TRADINGVIEW_SESSION_ID_SIGN=yyy -p 3456:3456 tradingview-mcp
```

The Dockerfile uses a multi-stage build:
1. **Builder stage** — installs deps and compiles TypeScript.
2. **Runtime stage** — copies only `dist/` and `node_modules`, installs Playwright system deps, and runs as a non-root user.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `Timeout getting quote for X` | WebSocket connection issue or invalid symbol | Check symbol format (e.g., `BINANCE:BTCUSDT`) and session cookies |
| Chart screenshot is blank | Chart hasn't rendered | The server waits 3s for rendering; increase `waitForTimeout` in `browser-automation.ts` if needed |
| `Invalid secret` on webhook | `WEBHOOK_SECRET` mismatch | Ensure the `x-webhook-secret` header or `?secret=` query matches your `.env` |
| Selectors failing | TradingView UI changed | Verify selectors in a live Playwright session; DOM classes change frequently |
| MCP transport error | Another MCP server conflict | Check Claude Desktop logs for port/stdio conflicts |
| Playwright browser missing | Browsers not installed | Run `npx playwright install chromium` |

## License

MIT
