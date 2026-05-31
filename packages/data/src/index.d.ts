import { ProviderResult, InsiderTransaction, BuybackAnnouncement, OwnershipChange, PricePoint } from '@smd/core';
interface RawSyntheticData {
    insiders?: any[];
    buybacks?: any[];
    ownership?: any[];
    prices?: any[];
}
/** Load all raw fixture data. */
export declare function loadRawData(): RawSyntheticData;
/** Public functions returning ProviderResult wrappers */
export declare function getInsiderTransactions(): ProviderResult<InsiderTransaction[]>;
export declare function getBuybackAnnouncements(): ProviderResult<BuybackAnnouncement[]>;
export declare function getOwnershipChanges(): ProviderResult<OwnershipChange[]>;
export declare function getPricePoints(): ProviderResult<PricePoint[]>;
export {};
