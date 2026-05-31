export declare enum DataState {
    OK = "OK",
    NOT_AVAILABLE = "NOT_AVAILABLE",
    UNKNOWN = "UNKNOWN",
    LOW_CONFIDENCE = "LOW_CONFIDENCE",
    MANUAL_REVIEW = "MANUAL_REVIEW",
    ERROR = "ERROR"
}
/** Generic provider result wrapper. Each provider should wrap its output in this structure
 * to include metadata about provenance, timestamps, confidence levels and potential issues.
 */
export interface ProviderResult<T> {
    /** Identifier of the upstream data source (e.g. 'fixture', 'api', 'manual'). */
    source: string;
    /** Timestamp (ISO string) representing when the provider pulled the data from its upstream. */
    providerTimestamp?: string;
    /** Timestamp (ISO string) representing when this result was produced. */
    receivedTimestamp: string;
    /** Schema version for the payload structure. */
    schemaVersion: string;
    /** Data itself (may be an array or single entity). */
    data: T;
    /** Quality state of the data. */
    state: DataState;
    /** Numerical confidence estimate between 0 and 1. */
    confidence: number;
    /** Optional human-readable warnings about the data. */
    warnings?: string[];
    /** Reason why data is missing or downgraded, if applicable. */
    missingReason?: string;
}
export interface InsiderTransaction {
    id: string;
    companyName: string;
    insiderName: string;
    transactionDate: string;
    transactionType: 'BUY' | 'SELL';
    shares: number;
    price: number;
    totalValue: number;
}
export interface BuybackAnnouncement {
    id: string;
    companyName: string;
    announcementDate: string;
    amount: number;
    description?: string;
    authorised: boolean;
    executed?: boolean;
}
export interface OwnershipChange {
    id: string;
    companyName: string;
    changeDate: string;
    previousOwnership: number;
    newOwnership: number;
    reason?: string;
}
export interface PricePoint {
    id: string;
    companyName: string;
    date: string;
    price: number;
}
export declare enum AnalysisState {
    OK = "OK",
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA",
    ERROR = "ERROR"
}
/** Base structure for an analysis artifact produced by an agent. */
export interface AnalysisArtifact<T> {
    state: AnalysisState;
    confidence: number;
    summary: string;
    details: T;
    warnings?: string[];
    nextAction?: string;
}
export interface DivergenceSignal {
    /** Score contribution from insider transactions (positive for net buying, negative for net selling). */
    insiderScore: number;
    /** Score contribution from buyback announcements/execution (positive for more aggressive buybacks). */
    buybackScore: number;
    /** Score contribution from ownership concentration changes (positive for increasing ownership by insiders or strategic holders). */
    ownershipScore: number;
    /** Price change indicator (positive for price increasing). */
    priceDelta: number;
}
export interface DivergenceCase {
    id: string;
    companyName: string;
    fromDate: string;
    toDate: string;
    signals: DivergenceSignal;
    /** Overall divergence score computed by the synthesis agent. Higher absolute magnitude means a stronger mismatch between ownership signals and price. */
    divergenceScore: number;
    /** Human-readable explanation of why this case was highlighted. */
    explanation: string;
    /** Additional evidence collected by various agents. */
    evidence: Record<string, unknown>;
    recommendation?: string;
    createdAt: string;
}
