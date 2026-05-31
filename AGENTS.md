# Agents

SmartMoneyDelta uses specialised agents to turn messy ownership and capital‑allocation data into a disciplined, evidence‑bounded divergence map. Each agent adheres to explicit inputs and outputs, downgrades its confidence when data is missing, and never makes ungrounded assertions. The agent pipeline is orchestrated by the workflow package.

## Agent roles

| Agent | Purpose | Input | Output |
|---|---|---|---|
| **Filings & Disclosures Agent** | Normalises insider transactions and buyback announcements into aggregate signals. | `ProviderResult<InsiderTransaction[]>` and `ProviderResult<BuybackAnnouncement[]>` | `AnalysisArtifact<Record<company, { insiderScore, buybackScore }>>` |
| **Ownership Analyst** | Computes net changes in ownership concentration per company. | `ProviderResult<OwnershipChange[]>` | `AnalysisArtifact<Record<company, { ownershipScore }>>` |
| **Price Context Analyst** | Calculates simple price deltas over the dataset to understand the tape. | `ProviderResult<PricePoint[]>` | `AnalysisArtifact<Record<company, { priceDelta }>>` |
| **Synthesis Lead** | Combines the signals from the previous agents, computes a divergence score and provides a recommendation. | Filings, ownership and price artifacts | `AnalysisArtifact<DivergenceCase[]>` |

## Operational rules

- Each agent **must return structured artifacts** with a `state`, `confidence`, `summary` and typed `details`.  
- If critical input data is missing or malformed, the agent should downgrade its confidence and set the state to `INSUFFICIENT_DATA` or `ERROR` instead of throwing.  
- Agents must not hard‑code file paths or environment variables; all data access goes through injected providers.  
- The synthesis agent must record the rationale for each divergence case in the `explanation` field and include the intermediate evidence.  
- Agents must not claim that insiders “know” or that buybacks are inherently bullish; they simply compute signals and highlight mismatches.  
- All weighting, thresholds and scoring functions must be explicitly coded and versioned for auditability.

## Run/build/verify/done criteria

- **Run**: The agent is executed via the workflow orchestrator (`runDivergenceWorkflow`) or directly in tests.  
- **Build**: Each agent package compiles via `npm run build` with no TypeScript errors in strict mode.  
- **Verify**: Unit tests confirm that the agent returns the expected structure for synthetic and hostile datasets, handles missing data gracefully, and produces a consistent ordering of cases.  
- **Done**: The agent is considered complete when it produces interpretable artifacts with explicit states and confidence scores, passes all unit and smoke tests, and is documented here.