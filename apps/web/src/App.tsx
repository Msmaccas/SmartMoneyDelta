import React, { useState } from 'react';
import BoardPage from './pages/Board';
import CaseDetailPage from './pages/CaseDetail';

export default function App() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h1>SmartMoneyDelta</h1>
      {selectedCaseId ? (
        <CaseDetailPage caseId={selectedCaseId} onBack={() => setSelectedCaseId(null)} />
      ) : (
        <BoardPage onSelectCase={(id) => setSelectedCaseId(id)} />
      )}
    </div>
  );
}