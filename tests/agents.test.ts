import path from 'path';
import { getInsiderTransactions, getBuybackAnnouncements, getOwnershipChanges, getPricePoints } from '@smd/data';
import { runFilingsAgent, runOwnershipAgent, runPriceContextAgent, runSynthesisAgent } from '@smd/agents';

describe('agents', () => {
  const fixture = path.resolve(__dirname, '../fixtures/raw/synthetic_cases.json');
  beforeAll(() => {
    process.env.FIXTURE_PATH = fixture;
  });
  test('synthesis agent produces divergence cases', () => {
    const insiders = getInsiderTransactions();
    const buybacks = getBuybackAnnouncements();
    const ownership = getOwnershipChanges();
    const prices = getPricePoints();
    const filingsArt = runFilingsAgent(insiders, buybacks);
    const ownershipArt = runOwnershipAgent(ownership);
    const priceArt = runPriceContextAgent(prices);
    const synthesis = runSynthesisAgent(filingsArt, ownershipArt, priceArt);
    expect(synthesis.details.length).toBeGreaterThan(0);
    // Check ranking order by absolute divergence score
    const [first, second] = synthesis.details;
    expect(Math.abs(first.divergenceScore)).toBeGreaterThanOrEqual(Math.abs(second.divergenceScore));
  });
});