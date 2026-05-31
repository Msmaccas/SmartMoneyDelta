import { runDivergenceWorkflow } from '@smd/workflows';
import { generateBoardReport, generateCaseReport, writeReport } from '@smd/reports';

async function main() {
  const result = await runDivergenceWorkflow();
  const board = result.details;
  // Write board report
  const boardMd = generateBoardReport(board);
  const boardPath = writeReport(`divergence-board-${Date.now()}.md`, boardMd);
  console.log(`Board report written to ${boardPath}`);
  // Also generate report for top ranked case
  if (board.length > 0) {
    const top = board[0];
    const caseMd = generateCaseReport(top);
    const casePath = writeReport(`case-${top.id.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`, caseMd);
    console.log(`Top case report written to ${casePath}`);
  }
}

main().catch((err) => {
  console.error(err);
});