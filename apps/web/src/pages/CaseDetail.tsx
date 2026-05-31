import React, { useEffect, useState } from 'react';
import { fetchCase } from '../api';
import { DivergenceCase } from '@smd/core';

interface Props {
  caseId: string;
  onBack: () => void;
}

export default function CaseDetailPage({ caseId, onBack }: Props) {
  const [data, setData] = useState<DivergenceCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function load() {
      try {
        const d = await fetchCase(caseId);
        setData(d);
      } catch (err: any) {
        setError(err.message || 'Failed to load case');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [caseId]);
  return (
    <div>
      <button onClick={onBack}>Back</button>
      {loading && <div>Loading case...</div>}
      {error && <div>Error: {error}</div>}
      {data && (
        <div>
          <h2>{data.companyName}</h2>
          <p><strong>Divergence Score:</strong> {data.divergenceScore.toFixed(2)}</p>
          <p><strong>Explanation:</strong> {data.explanation}</p>
          {data.recommendation && <p><strong>Recommendation:</strong> {data.recommendation}</p>}
          <h3>Signals</h3>
          <ul>
            <li>Insider Score: {data.signals.insiderScore.toFixed(2)}</li>
            <li>Buyback Score: {data.signals.buybackScore.toFixed(2)}</li>
            <li>Ownership Score: {data.signals.ownershipScore.toFixed(2)}</li>
            <li>Price Delta: {data.signals.priceDelta.toFixed(2)}</li>
          </ul>
          <h3>Evidence</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data.evidence, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}