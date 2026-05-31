# SmartMoneyDelta

SmartMoneyDelta is a research-oriented divergence engine that continuously ingests insider transactions, share buyback announcements or execution clues, ownership changes, and price context to surface cases where the ownership story and the market tape pull in different directions.  
The app provides a ranked dashboard of divergence cases, detailed case pages explaining the signals and potential reasons, and a simple API/CLI for integration into your workflow.  
It is designed for discretionary equity traders, family offices, small funds and niche research providers who want a private, evidence‑first ownership intelligence layer.

## Features

- **Multi‑provider ingestion** – Reads insider transactions, buyback announcements, ownership changes and price histories from fixture data or other providers.  
- **Multi‑agent analysis** – Dedicated agents summarise filings, ownership concentration, price context and synthesise them into divergence signals and scores.  
- **Evidence ledger** – Each divergence case includes the underlying evidence used to compute the score and a transparent explanation.  
- **Web dashboard & API** – Browse ranked divergence cases in a simple React dashboard or query them over an HTTP API.  
- **CLI/Worker & Reports** – Generate Markdown reports for the entire board or individual cases and schedule workflows via the worker package.  
- **Tests & smoke scripts** – Includes unit tests for the core logic and a smoke script to verify that the app runs end‑to‑end from a clean checkout.

## Quick start

SmartMoneyDelta is a TypeScript monorepo managed with npm workspaces.  
From a clean checkout, run the following commands:

```bash
# install dependencies
npm ci

# compile all packages
npm run build

# run tests
npm test

# run a smoke path that computes the divergence board and writes a report
npm run smoke

# start the API server (serves on http://localhost:3000)
npm start

# run the development web app (serves on http://localhost:5173)
npm run web --workspace apps/web
```

These commands must succeed from a clean checkout with no extra global dependencies.  
The smoke path seeds synthetic insider and ownership cases from `fixtures/raw/synthetic_cases.json`, computes a ranked divergence board, and generates a Markdown report in the `reports/` directory.

## Project structure

```
smart-money-delta/
├─ packages/
│  ├─ core/        # Domain types and generic result wrappers
│  ├─ data/        # Fixture loading and normalisation logic
│  ├─ providers/   # Provider classes wrapping data sources
│  ├─ agents/      # Filings, ownership, price context and synthesis agents
│  ├─ workflows/   # Orchestrates providers and agents into a workflow
│  ├─ reports/     # Generates Markdown reports
│  ├─ server/      # Express API exposing the divergence board and case details
│  └─ worker/      # CLI/worker that runs workflows and writes reports
├─ apps/
│  └─ web/         # React dashboard served by Vite
├─ fixtures/       # Synthetic and hostile datasets used in tests and demos
├─ tests/          # Jest unit tests
├─ scripts/        # Smoke script for end‑to‑end verification
├─ reports/        # Generated reports (ignored in git)
└─ docs/           # Product and agent descriptions
```

## Interpretation guide

- **Divergence score** – A simple numeric score computed by the synthesis agent.  
  Positive values indicate that insider buying, aggressive buybacks or ownership concentration are stronger than recent price performance, suggesting potential undervaluation or positive catalysts.  
  Negative values mean that ownership signals are weak or negative relative to price gains, warranting caution.  
  Scores near zero indicate that ownership and price are in sync.
- **Signals** – Each case records the raw signal contributions: net insider value, buyback amount, ownership change and price delta.  
- **Recommendation** – A lightweight suggestion; never taken as investment advice.  
- **Evidence** – Machine‑readable JSON containing the intermediate metrics used to compute the case.

## Limitations

SmartMoneyDelta is a demonstrator and is **not a predictive trading model**.  
It does not guarantee correctness of underlying filings, does not forecast future prices, and should not be used as the sole basis for investment decisions.  
Data in the fixtures may be delayed or incomplete.  
Extending the system to consume live filings, broker data or alternative datasets will require writing new providers that conform to the `ProviderResult<T>` interface and updating tests accordingly.

## Roadmap

* Plug in live SEC filing and ownership providers.  
* Add a scheduler for continuous ingestion and a database for persistent storage.  
* Implement a memory layer that revisits prior cases after several weeks to record outcomes.  
* Introduce more granular scoring rules and disconfirming evidence handling.  
* Provide authentication and multi‑user support in the web dashboard.  
* Add support for exporting reports to PDF and sending email notifications.