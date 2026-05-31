import { getInsiderTransactions, getBuybackAnnouncements, getOwnershipChanges, getPricePoints } from '@smd/data';
import { ProviderResult, InsiderTransaction, BuybackAnnouncement, OwnershipChange, PricePoint } from '@smd/core';

export interface Provider<T> {
  fetch(): ProviderResult<T>;
}

export class InsiderProvider implements Provider<InsiderTransaction[]> {
  fetch(): ProviderResult<InsiderTransaction[]> {
    return getInsiderTransactions();
  }
}

export class BuybackProvider implements Provider<BuybackAnnouncement[]> {
  fetch(): ProviderResult<BuybackAnnouncement[]> {
    return getBuybackAnnouncements();
  }
}

export class OwnershipProvider implements Provider<OwnershipChange[]> {
  fetch(): ProviderResult<OwnershipChange[]> {
    return getOwnershipChanges();
  }
}

export class PriceProvider implements Provider<PricePoint[]> {
  fetch(): ProviderResult<PricePoint[]> {
    return getPricePoints();
  }
}