"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBoardReport = generateBoardReport;
exports.generateCaseReport = generateCaseReport;
exports.writeReport = writeReport;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/** Generate a Markdown table summarising divergence cases. */
function generateBoardReport(cases) {
    const lines = [];
    lines.push(`# SmartMoneyDelta Divergence Board`);
    lines.push('');
    lines.push(`Generated at ${new Date().toISOString()}`);
    lines.push('');
    if (!cases.length) {
        lines.push('No divergence cases were generated.');
        return lines.join('\n');
    }
    // Table header
    lines.push('| Rank | Company | Divergence Score | Explanation | Recommendation |');
    lines.push('|---|---|---|---|---|');
    cases.forEach((c, index) => {
        lines.push(`| ${index + 1} | ${c.companyName} | ${c.divergenceScore.toFixed(2)} | ${c.explanation.replace(/\|/g, '\\|')} | ${c.recommendation || ''} |`);
    });
    return lines.join('\n');
}
/** Generate a detailed Markdown report for a single case. */
function generateCaseReport(c) {
    const lines = [];
    lines.push(`# Divergence Case: ${c.companyName}`);
    lines.push('');
    lines.push(`Generated at ${new Date().toISOString()}`);
    lines.push('');
    lines.push(`**Divergence Score:** ${c.divergenceScore.toFixed(2)}`);
    lines.push('');
    lines.push(`**Explanation:** ${c.explanation}`);
    lines.push('');
    if (c.recommendation) {
        lines.push(`**Recommendation:** ${c.recommendation}`);
        lines.push('');
    }
    lines.push('## Signals');
    lines.push('');
    lines.push(`- Insider Score: ${c.signals.insiderScore.toFixed(2)}`);
    lines.push(`- Buyback Score: ${c.signals.buybackScore.toFixed(2)}`);
    lines.push(`- Ownership Score: ${c.signals.ownershipScore.toFixed(2)}`);
    lines.push(`- Price Delta: ${c.signals.priceDelta.toFixed(2)}`);
    lines.push('');
    lines.push('## Evidence');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(c.evidence, null, 2));
    lines.push('```');
    return lines.join('\n');
}
/** Write a report to the reports directory. Returns the path. */
function writeReport(fileName, content) {
    const reportsDir = path_1.default.resolve(process.cwd(), 'reports');
    if (!fs_1.default.existsSync(reportsDir)) {
        fs_1.default.mkdirSync(reportsDir, { recursive: true });
    }
    const filePath = path_1.default.join(reportsDir, fileName);
    fs_1.default.writeFileSync(filePath, content, 'utf-8');
    return filePath;
}
//# sourceMappingURL=index.js.map