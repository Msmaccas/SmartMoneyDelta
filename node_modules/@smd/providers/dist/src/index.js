"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceProvider = exports.OwnershipProvider = exports.BuybackProvider = exports.InsiderProvider = void 0;
const data_1 = require("@smd/data");
class InsiderProvider {
    fetch() {
        return (0, data_1.getInsiderTransactions)();
    }
}
exports.InsiderProvider = InsiderProvider;
class BuybackProvider {
    fetch() {
        return (0, data_1.getBuybackAnnouncements)();
    }
}
exports.BuybackProvider = BuybackProvider;
class OwnershipProvider {
    fetch() {
        return (0, data_1.getOwnershipChanges)();
    }
}
exports.OwnershipProvider = OwnershipProvider;
class PriceProvider {
    fetch() {
        return (0, data_1.getPricePoints)();
    }
}
exports.PriceProvider = PriceProvider;
//# sourceMappingURL=index.js.map