// Simple test runner using Node's assert module
const assert = require('assert');
const path = require('path');

// Load modules compiled from TypeScript. When running tests we compile on the fly using ts-node.
require('ts-node/register');
const core = require('../packages/core/src/index');
const data = require('../packages/data/src/index');
const agents = require('../packages/agents/src/index');
const workflows = require('../packages/workflows/src/index');

async function runTests() {
  console.log('Running tests...');
  // Test core enums
  assert.strictEqual(core.DataState.OK, 'OK');
  assert.ok(Object.keys(core.DataState).length > 0);
  // Test providers with synthetic data
  process.env.FIXTURE_PATH = path.resolve(__dirname, '../fixtures/raw/synthetic_cases.json');
  const insiders = data.getInsiderTransactions();
  const buybacks = data.getBuybackAnnouncements();
  const ownership = data.getOwnershipChanges();
  const prices = data.getPricePoints();
  assert.ok(insiders.data.length > 0, 'insiders empty');
  assert.ok(buybacks.data.length > 0, 'buybacks empty');
  assert.strictEqual(ownership.data.length, 2, 'ownership length mismatch');
  assert.strictEqual(prices.data.length, 4, 'prices length mismatch');
  // Test agents
  const filingsArt = agents.runFilingsAgent(insiders, buybacks);
  const ownershipArt = agents.runOwnershipAgent(ownership);
  const priceArt = agents.runPriceContextAgent(prices);
  const synthesis = agents.runSynthesisAgent(filingsArt, ownershipArt, priceArt);
  assert.ok(Array.isArray(synthesis.details) && synthesis.details.length > 0, 'synthesis produced no cases');
  // Ensure cases are sorted by absolute divergence score
  for (let i = 1; i < synthesis.details.length; i++) {
    assert.ok(Math.abs(synthesis.details[i - 1].divergenceScore) >= Math.abs(synthesis.details[i].divergenceScore), 'cases not sorted');
  }
  // Test workflow
  const wfResult = await workflows.runDivergenceWorkflow();
  assert.ok(wfResult.details.length === synthesis.details.length, 'workflow cases count mismatch');
  // Hostile data test
  process.env.FIXTURE_PATH = path.resolve(__dirname, '../fixtures/hostile/invalid_cases.json');
  const hostileInsiders = data.getInsiderTransactions();
  assert.strictEqual(hostileInsiders.state, core.DataState.LOW_CONFIDENCE, 'hostile state should be LOW_CONFIDENCE');
  assert.ok((hostileInsiders.warnings || []).length > 0, 'hostile warnings missing');
  console.log('All tests passed');
}

runTests().catch((err) => {
  console.error('Test failure:', err);
  process.exit(1);
});