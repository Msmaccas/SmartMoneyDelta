"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRawData = loadRawData;
exports.getInsiderTransactions = getInsiderTransactions;
exports.getBuybackAnnouncements = getBuybackAnnouncements;
exports.getOwnershipChanges = getOwnershipChanges;
exports.getPricePoints = getPricePoints;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const core_1 = require("@smd/core");
/**
 * Reads a JSON file from disk. Throws if file is missing or cannot be parsed.
 */
function readJsonFile(filePath) {
    const content = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}
/** Resolve the fixture data file path from environment or default. */
function resolveFixturePath() {
    const envPath = process.env.FIXTURE_PATH;
    if (envPath && fs_1.default.existsSync(envPath))
        return envPath;
    const defaultPath = path_1.default.resolve(__dirname, '../../..', 'fixtures', 'raw', 'synthetic_cases.json');
    if (!fs_1.default.existsSync(defaultPath)) {
        throw new Error(`Default fixture file not found at ${defaultPath}`);
    }
    return defaultPath;
}
/** Load all raw fixture data. */
function loadRawData() {
    const file = resolveFixturePath();
    const data = readJsonFile(file);
    return data;
}
/**
 * Normalize raw insider transactions into typed objects. Removes entries with missing critical fields.
 */
function normalizeInsiders(raw) {
    const result = [];
    const warnings = [];
    for (const entry of raw || []) {
        if (!entry)
            continue;
        const { id, companyName, insiderName, transactionDate, transactionType, shares, price, totalValue } = entry;
        if (!id || !companyName || !insiderName || !transactionDate || !transactionType) {
            warnings.push(`Skipping invalid insider entry: ${JSON.stringify(entry)}`);
            continue;
        }
        result.push({
            id: String(id),
            companyName: String(companyName),
            insiderName: String(insiderName),
            transactionDate: String(transactionDate),
            transactionType: transactionType === 'SELL' ? 'SELL' : 'BUY',
            shares: Number(shares) || 0,
            price: Number(price) || 0,
            totalValue: Number(totalValue) || Number(shares) * Number(price) || 0
        });
    }
    return { data: result, warnings };
}
function normalizeBuybacks(raw) {
    const result = [];
    const warnings = [];
    for (const entry of raw || []) {
        const { id, companyName, announcementDate, amount, description, authorised, executed } = entry;
        if (!id || !companyName || !announcementDate) {
            warnings.push(`Skipping invalid buyback entry: ${JSON.stringify(entry)}`);
            continue;
        }
        result.push({
            id: String(id),
            companyName: String(companyName),
            announcementDate: String(announcementDate),
            amount: Number(amount) || 0,
            description: description ? String(description) : undefined,
            authorised: authorised === true,
            executed: executed === true
        });
    }
    return { data: result, warnings };
}
function normalizeOwnership(raw) {
    const result = [];
    const warnings = [];
    for (const entry of raw || []) {
        const { id, companyName, changeDate, previousOwnership, newOwnership, reason } = entry;
        if (!id || !companyName || !changeDate || previousOwnership === undefined || newOwnership === undefined) {
            warnings.push(`Skipping invalid ownership entry: ${JSON.stringify(entry)}`);
            continue;
        }
        result.push({
            id: String(id),
            companyName: String(companyName),
            changeDate: String(changeDate),
            previousOwnership: Number(previousOwnership),
            newOwnership: Number(newOwnership),
            reason: reason ? String(reason) : undefined
        });
    }
    return { data: result, warnings };
}
function normalizePrices(raw) {
    const result = [];
    const warnings = [];
    for (const entry of raw || []) {
        const { id, companyName, date, price } = entry;
        if (!id || !companyName || !date) {
            warnings.push(`Skipping invalid price entry: ${JSON.stringify(entry)}`);
            continue;
        }
        result.push({
            id: String(id),
            companyName: String(companyName),
            date: String(date),
            price: Number(price) || 0
        });
    }
    return { data: result, warnings };
}
/** Public functions returning ProviderResult wrappers */
function getInsiderTransactions() {
    const raw = loadRawData();
    const { data, warnings } = normalizeInsiders(raw.insiders || []);
    const now = new Date().toISOString();
    return {
        source: 'fixture',
        providerTimestamp: now,
        receivedTimestamp: now,
        schemaVersion: '1.0',
        data,
        state: warnings.length > 0 ? core_1.DataState.LOW_CONFIDENCE : core_1.DataState.OK,
        confidence: warnings.length > 0 ? 0.7 : 0.95,
        warnings,
        missingReason: undefined
    };
}
function getBuybackAnnouncements() {
    const raw = loadRawData();
    const { data, warnings } = normalizeBuybacks(raw.buybacks || []);
    const now = new Date().toISOString();
    return {
        source: 'fixture',
        providerTimestamp: now,
        receivedTimestamp: now,
        schemaVersion: '1.0',
        data,
        state: warnings.length > 0 ? core_1.DataState.LOW_CONFIDENCE : core_1.DataState.OK,
        confidence: warnings.length > 0 ? 0.7 : 0.95,
        warnings,
        missingReason: undefined
    };
}
function getOwnershipChanges() {
    const raw = loadRawData();
    const { data, warnings } = normalizeOwnership(raw.ownership || []);
    const now = new Date().toISOString();
    return {
        source: 'fixture',
        providerTimestamp: now,
        receivedTimestamp: now,
        schemaVersion: '1.0',
        data,
        state: warnings.length > 0 ? core_1.DataState.LOW_CONFIDENCE : core_1.DataState.OK,
        confidence: warnings.length > 0 ? 0.7 : 0.95,
        warnings,
        missingReason: undefined
    };
}
function getPricePoints() {
    const raw = loadRawData();
    const { data, warnings } = normalizePrices(raw.prices || []);
    const now = new Date().toISOString();
    return {
        source: 'fixture',
        providerTimestamp: now,
        receivedTimestamp: now,
        schemaVersion: '1.0',
        data,
        state: warnings.length > 0 ? core_1.DataState.LOW_CONFIDENCE : core_1.DataState.OK,
        confidence: warnings.length > 0 ? 0.7 : 0.95,
        warnings,
        missingReason: undefined
    };
}
//# sourceMappingURL=index.js.map