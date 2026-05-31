import { ProviderResult, InsiderTransaction, BuybackAnnouncement, OwnershipChange, PricePoint, AnalysisArtifact, DivergenceCase } from '@smd/core';
/** Run filings agent: summarises insider and buyback activity. */
export declare function runFilingsAgent(insiders: ProviderResult<InsiderTransaction[]>, buybacks: ProviderResult<BuybackAnnouncement[]>): AnalysisArtifact<Record<string, {
    insiderScore: number;
    buybackScore: number;
}>>;
/** Run ownership agent: summarises ownership concentration changes. */
export declare function runOwnershipAgent(ownership: ProviderResult<OwnershipChange[]>): AnalysisArtifact<Record<string, {
    ownershipScore: number;
}>>;
/** Run price context agent: summarises price changes per company. */
export declare function runPriceContextAgent(prices: ProviderResult<PricePoint[]>): AnalysisArtifact<Record<string, {
    priceDelta: number;
}>>;
/** Run synthesis agent: produce divergence cases from other artifacts. */
export declare function runSynthesisAgent(filingsArtifact: AnalysisArtifact<Record<string, {
    insiderScore: number;
    buybackScore: number;
}>>, ownershipArtifact: AnalysisArtifact<Record<string, {
    ownershipScore: number;
}>>, priceArtifact: AnalysisArtifact<Record<string, {
    priceDelta: number;
}>>): AnalysisArtifact<DivergenceCase[]>;
