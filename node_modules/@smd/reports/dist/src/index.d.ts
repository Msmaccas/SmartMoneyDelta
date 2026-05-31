import { DivergenceCase } from '@smd/core';
/** Generate a Markdown table summarising divergence cases. */
export declare function generateBoardReport(cases: DivergenceCase[]): string;
/** Generate a detailed Markdown report for a single case. */
export declare function generateCaseReport(c: DivergenceCase): string;
/** Write a report to the reports directory. Returns the path. */
export declare function writeReport(fileName: string, content: string): string;
