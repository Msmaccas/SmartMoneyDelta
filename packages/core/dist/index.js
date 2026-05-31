"use strict";
// Core types and enums for SmartMoneyDelta
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisState = exports.DataState = void 0;
var DataState;
(function (DataState) {
    DataState["OK"] = "OK";
    DataState["NOT_AVAILABLE"] = "NOT_AVAILABLE";
    DataState["UNKNOWN"] = "UNKNOWN";
    DataState["LOW_CONFIDENCE"] = "LOW_CONFIDENCE";
    DataState["MANUAL_REVIEW"] = "MANUAL_REVIEW";
    DataState["ERROR"] = "ERROR";
})(DataState || (exports.DataState = DataState = {}));
// Analysis states and result structures
var AnalysisState;
(function (AnalysisState) {
    AnalysisState["OK"] = "OK";
    AnalysisState["INSUFFICIENT_DATA"] = "INSUFFICIENT_DATA";
    AnalysisState["ERROR"] = "ERROR";
})(AnalysisState || (exports.AnalysisState = AnalysisState = {}));
//# sourceMappingURL=index.js.map