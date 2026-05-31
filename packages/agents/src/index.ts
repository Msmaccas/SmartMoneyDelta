import {
  ProviderResult,
  InsiderTransaction,
  BuybackAnnouncement,
  OwnershipChange,
  PricePoint,
  AnalysisArtifact,
  AnalysisState,
  DivergenceCase,
  DivergenceSignal
} from '@smd/core';

/** Helper to group transactions by company. */
function groupBy<T extends { companyName: string }>(items: T[]): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    acc[item.companyName] = acc[item.companyName] || [];
    acc[item.companyName].push(item);
    return acc;
  }, {});
}

/** Run filings agent: summarises insider and buyback activity. */
export function runFilingsAgent(
  insiders: ProviderResult<InsiderTransaction[]>,
  buybacks: ProviderResult<BuybackAnnouncement[]>
): AnalysisArtifact<Record<string, { insiderScore: number; buybackScore: number }>> {
  const insiderGroups = groupBy(insiders.data);
  const buybackGroups = groupBy(buybacks.data);
  const companies = new Set([...Object.keys(insiderGroups), ...Object.keys(buybackGroups)]);
  const details: Record<string, { insiderScore: number; buybackScore: number }> = {};
  for (const company of companies) {
    const ins = insiderGroups[company] || [];
    const bbs = buybackGroups[company] || [];
    // Insider score: sum of transaction values; buys positive, sells negative
    let insiderScore = 0;
    for (const tx of ins) {
      const value = tx.totalValue || tx.shares * tx.price;
      insiderScore += tx.transactionType === 'BUY' ? value : -value;
    }
    // Buyback score: sum of authorised amounts; executed weigh double
    let buybackScore = 0;
    for (const bb of bbs) {
      if (!bb.authorised) continue;
      const base = bb.amount || 0;
      buybackScore += base * (bb.executed ? 2 : 1);
    }
    details[company] = { insiderScore, buybackScore };
  }
  const summary = `Processed filings for ${companies.size} companies.`;
  return {
    state: AnalysisState.OK,
    confidence: 0.9,
    summary,
    details
  };
}

/** Run ownership agent: summarises ownership concentration changes. */
export function runOwnershipAgent(
  ownership: ProviderResult<OwnershipChange[]>
): AnalysisArtifact<Record<string, { ownershipScore: number }>> {
  const groups = groupBy(ownership.data);
  const details: Record<string, { ownershipScore: number }> = {};
  for (const company of Object.keys(groups)) {
    const changes = groups[company];
    let score = 0;
    for (const ch of changes) {
      score += (ch.newOwnership - ch.previousOwnership);
    }
    details[company] = { ownershipScore: score };
  }
  const summary = `Processed ownership changes for ${Object.keys(groups).length} companies.`;
  return {
    state: AnalysisState.OK,
    confidence: 0.9,
    summary,
    details
  };
}

/** Run price context agent: summarises price changes per company. */
export function runPriceContextAgent(
  prices: ProviderResult<PricePoint[]>
): AnalysisArtifact<Record<string, { priceDelta: number }>> {
  const groups = groupBy(prices.data);
  const details: Record<string, { priceDelta: number }> = {};
  for (const company of Object.keys(groups)) {
    const pts = groups[company].sort((a, b) => a.date.localeCompare(b.date));
    if (pts.length < 2) {
      details[company] = { priceDelta: 0 };
      continue;
    }
    const first = pts[0];
    const last = pts[pts.length - 1];
    const delta = last.price - first.price;
    details[company] = { priceDelta: delta };
  }
  const summary = `Computed price deltas for ${Object.keys(details).length} companies.`;
  return {
    state: AnalysisState.OK,
    confidence: 0.9,
    summary,
    details
  };
}

/** Run synthesis agent: produce divergence cases from other artifacts. */
export function runSynthesisAgent(
  filingsArtifact: AnalysisArtifact<Record<string, { insiderScore: number; buybackScore: number }>>,
  ownershipArtifact: AnalysisArtifact<Record<string, { ownershipScore: number }>>,
  priceArtifact: AnalysisArtifact<Record<string, { priceDelta: number }>>
): AnalysisArtifact<DivergenceCase[]> {
  const companies = new Set([
    ...Object.keys(filingsArtifact.details),
    ...Object.keys(ownershipArtifact.details),
    ...Object.keys(priceArtifact.details)
  ]);
  const cases: DivergenceCase[] = [];
  const now = new Date().toISOString();
  for (const company of companies) {
    const filing = filingsArtifact.details[company] || { insiderScore: 0, buybackScore: 0 };
    const ownership = ownershipArtifact.details[company] || { ownershipScore: 0 };
    const price = priceArtifact.details[company] || { priceDelta: 0 };
    const signals: DivergenceSignal = {
      insiderScore: filing.insiderScore,
      buybackScore: filing.buybackScore,
      ownershipScore: ownership.ownershipScore,
      priceDelta: price.priceDelta
    };
    // Compute divergence score: magnitude of ownership-related signals minus price delta.
    const positiveSignal = filing.insiderScore + filing.buybackScore + ownership.ownershipScore;
    const divergenceScore = positiveSignal - price.priceDelta;
    // Create explanation
    let explanation = '';
    if (Math.abs(divergenceScore) < 1e-6) {
      explanation = `Signals and price appear to be in sync for ${company}.`;
    } else if (divergenceScore > 0) {
      explanation = `${company}: Positive insider/ownership signals are not yet reflected in the price.`;
    } else {
      explanation = `${company}: Negative or weak signals contrast with a rising price.`;
    }
    // Determine recommendation: simple heuristics
    const recommendation = divergenceScore > 0 ? 'Investigate for potential undervaluation' : divergenceScore < 0 ? 'Be cautious; ownership signals weakening' : undefined;
    cases.push({
      id: `${company}-${now}`,
      companyName: company,
      fromDate: now,
      toDate: now,
      signals,
      divergenceScore,
      explanation,
      evidence: {
        filing,
        ownership,
        price
      },
      recommendation,
      createdAt: now
    });
  }
  // Sort by absolute divergence score descending
  cases.sort((a, b) => Math.abs(b.divergenceScore) - Math.abs(a.divergenceScore));
  const summary = `Generated ${cases.length} divergence cases.`;
  return {
    state: AnalysisState.OK,
    confidence: 0.9,
    summary,
    details: cases
  };
}