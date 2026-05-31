"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workflows_1 = require("@smd/workflows");
const reports_1 = require("@smd/reports");
async function main() {
    const result = await (0, workflows_1.runDivergenceWorkflow)();
    const board = result.details;
    // Write board report
    const boardMd = (0, reports_1.generateBoardReport)(board);
    const boardPath = (0, reports_1.writeReport)(`divergence-board-${Date.now()}.md`, boardMd);
    console.log(`Board report written to ${boardPath}`);
    // Also generate report for top ranked case
    if (board.length > 0) {
        const top = board[0];
        const caseMd = (0, reports_1.generateCaseReport)(top);
        const casePath = (0, reports_1.writeReport)(`case-${top.id.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`, caseMd);
        console.log(`Top case report written to ${casePath}`);
    }
}
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map