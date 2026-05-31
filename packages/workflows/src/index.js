"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDivergenceWorkflow = runDivergenceWorkflow;
const providers_1 = require("@smd/providers");
const agents_1 = require("@smd/agents");
async function runDivergenceWorkflow() {
    // Instantiate providers
    const insiderProvider = new providers_1.InsiderProvider();
    const buybackProvider = new providers_1.BuybackProvider();
    const ownershipProvider = new providers_1.OwnershipProvider();
    const priceProvider = new providers_1.PriceProvider();
    // Fetch data
    const insiderResult = insiderProvider.fetch();
    const buybackResult = buybackProvider.fetch();
    const ownershipResult = ownershipProvider.fetch();
    const priceResult = priceProvider.fetch();
    // Run agents
    const filingsArtifact = (0, agents_1.runFilingsAgent)(insiderResult, buybackResult);
    const ownershipArtifact = (0, agents_1.runOwnershipAgent)(ownershipResult);
    const priceArtifact = (0, agents_1.runPriceContextAgent)(priceResult);
    const synthesisArtifact = (0, agents_1.runSynthesisAgent)(filingsArtifact, ownershipArtifact, priceArtifact);
    return synthesisArtifact;
}
//# sourceMappingURL=index.js.map