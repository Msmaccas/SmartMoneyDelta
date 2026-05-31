// Use ts-node to execute TypeScript sources directly
require('ts-node/register');
const { runDivergenceWorkflow } = require('../packages/workflows/src/index.ts');
const { generateBoardReport, writeReport } = require('../packages/reports/src/index.ts');

async function run() {
  console.log('Running SmartMoneyDelta smoke test...');
  const result = await runDivergenceWorkflow();
  const board = result.details;
  console.log('Cases:', board.length);
  board.forEach((c, idx) => {
    console.log(`${idx + 1}. ${c.companyName} divergenceScore=${c.divergenceScore.toFixed(2)} reason=${c.explanation}`);
  });
  const report = generateBoardReport(board);
  const path = writeReport(`smoke-board-${Date.now()}.md`, report);
  console.log(`Smoke report written to ${path}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});