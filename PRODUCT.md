# Product overview

SmartMoneyDelta is a continuous divergence engine for discretionary equity investors. It sits between raw data feeds (insider transactions, share buybacks, ownership changes, price histories) and your investment decisions.  
Where many platforms stop at simply collecting data or summarising it, SmartMoneyDelta focuses on the **mismatch** between what insiders and owners are doing and what the market price seems to believe.

## Value proposition

- **Evidence first** – Transparent signals and evidence rather than opaque “buy”/“sell” calls.  
- **Continuous monitoring** – Designed to ingest new filings and ownership updates as they arrive.  
- **Actionable ranking** – Surfaces the most interesting mismatches, whether that means silent accumulation during weakness or exuberance with deteriorating ownership.  
- **Flexible deployment** – Run on your laptop with synthetic fixtures, integrate into your research workflow via the API/CLI, or deploy to a private server for team access.  
- **Customisable providers** – Extend the provider interfaces to plug in live SEC filings, broker feeds or internal datasets.

## Target audience

- Discretionary equity traders seeking additional context around insider behaviour and capital allocation.  
- Small funds and family offices without a large data science team but with a desire for private tools.  
- Niche research providers looking to augment their reports with structured ownership intelligence.  
- Educators and students exploring how AI agents and financial data can be combined to build decision tools.

## Capabilities matrix

| Capability | Core version | Pro version (future) |
|---|---|---|
| Multi‑agent divergence pipeline | ✓ | ✓ |
| Synthetic fixture data | ✓ | ✓ |
| Express API & CLI | ✓ | ✓ |
| React dashboard | ✓ | ✓ |
| Evidence ledger & reports | ✓ | ✓ |
| Live SEC filing ingestion |  | ✓ |
| Database persistence |  | ✓ |
| Scheduler & memory layer |  | ✓ |
| User authentication & roles |  | ✓ |
| Custom scoring rules via config |  | ✓ |

## Upgrade paths

The current open‑source version is intended as a **base layer**.  
If you need live data ingestion, persistence, custom rules, multi‑user access or enhanced support, the Pro version (not included in this repository) will provide:

- Managed connectors to public and private data sources (e.g. SEC EDGAR, brokerage feeds).  
- A scheduler and storage layer to maintain historical runs and revisit cases.  
- A configurable scoring engine with rule weights and calibration.  
- Authentication and fine‑grained access control.  
- Dedicated support and onboarding assistance.

To discuss licensing or commercial support, please contact the maintainers.