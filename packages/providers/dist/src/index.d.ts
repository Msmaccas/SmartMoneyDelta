import { ProviderResult, InsiderTransaction, BuybackAnnouncement, OwnershipChange, PricePoint } from '@smd/core';
export interface Provider<T> {
    fetch(): ProviderResult<T>;
}
export declare class InsiderProvider implements Provider<InsiderTransaction[]> {
    fetch(): ProviderResult<InsiderTransaction[]>;
}
export declare class BuybackProvider implements Provider<BuybackAnnouncement[]> {
    fetch(): ProviderResult<BuybackAnnouncement[]>;
}
export declare class OwnershipProvider implements Provider<OwnershipChange[]> {
    fetch(): ProviderResult<OwnershipChange[]>;
}
export declare class PriceProvider implements Provider<PricePoint[]> {
    fetch(): ProviderResult<PricePoint[]>;
}
