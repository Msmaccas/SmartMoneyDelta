import { DivergenceCase, AnalysisArtifact } from '@smd/core';
import { InsiderProvider, BuybackProvider, OwnershipProvider, PriceProvider } from '@smd/providers';
import {
  runFilingsAgent,
  runOwnershipAgent,
  runPriceContextAgent,
  runSynthesisAgent
} from '@smd/agents';

export async function runDivergenceWorkflow(): Promise<AnalysisArtifact<DivergenceCase[]>> {
  // Instantiate providers
  const insiderProvider = new InsiderProvider();
  const buybackProvider = new BuybackProvider();
  const ownershipProvider = new OwnershipProvider();
  const priceProvider = new PriceProvider();
  // Fetch data
  const insiderResult = insiderProvider.fetch();
  const buybackResult = buybackProvider.fetch();
  const ownershipResult = ownershipProvider.fetch();
  const priceResult = priceProvider.fetch();
  // Run agents
  const filingsArtifact = runFilingsAgent(insiderResult, buybackResult);
  const ownershipArtifact = runOwnershipAgent(ownershipResult);
  const priceArtifact = runPriceContextAgent(priceResult);
  const synthesisArtifact = runSynthesisAgent(filingsArtifact, ownershipArtifact, priceArtifact);
  return synthesisArtifact;
}