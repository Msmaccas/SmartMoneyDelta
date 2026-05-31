import React, { useEffect, useState } from 'react';
import { fetchBoard } from '../api';
import { DivergenceCase } from '@smd/core';

interface Props {
  onSelectCase: (id: string) => void;
}

export default function BoardPage({ onSelectCase }: Props) {
  const [cases, setCases] = useState<DivergenceCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchBoard();
        setCases(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load board');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  if (loading) return <div>Loading board...</div>;
  if (error) return <div>Error: {error}</div>;
  if (cases.length === 0) return <div>No cases found.</div>;
  return (
    <table border={1} cellPadding={6} style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Company</th>
          <th>Divergence Score</th>
          <th>Explanation</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((c, idx) => (
          <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => onSelectCase(c.id)}>
            <td>{idx + 1}</td>
            <td>{c.companyName}</td>
            <td>{c.divergenceScore.toFixed(2)}</td>
            <td>{c.explanation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}