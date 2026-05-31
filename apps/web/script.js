document.addEventListener('DOMContentLoaded', () => {
  loadBoard();
});

async function loadBoard() {
  const boardContainer = document.getElementById('board-container');
  const detail = document.getElementById('case-detail');
  detail.style.display = 'none';
  boardContainer.innerHTML = '<p>Loading...</p>';
  try {
    const res = await fetch('/api/board');
    if (!res.ok) throw new Error('Failed to load board');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      boardContainer.innerHTML = '<p>No cases found.</p>';
      return;
    }
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Rank</th><th>Company</th><th>Divergence Score</th><th>Explanation</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    data.forEach((c, idx) => {
      const tr = document.createElement('tr');
      tr.dataset.caseId = c.id;
      tr.innerHTML = `<td>${idx + 1}</td><td>${c.companyName}</td><td>${c.divergenceScore.toFixed(2)}</td><td>${c.explanation}</td>`;
      tr.addEventListener('click', () => loadCase(c.id));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    boardContainer.innerHTML = '';
    boardContainer.appendChild(table);
  } catch (err) {
    boardContainer.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

async function loadCase(id) {
  const boardContainer = document.getElementById('board-container');
  const detail = document.getElementById('case-detail');
  boardContainer.innerHTML = '';
  detail.innerHTML = '<p>Loading...</p>';
  detail.style.display = 'block';
  try {
    const res = await fetch(`/api/case/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to load case');
    const c = await res.json();
    const lines = [];
    lines.push(`<button id="back-btn">Back</button>`);
    lines.push(`<h2>${c.companyName}</h2>`);
    lines.push(`<p><strong>Divergence Score:</strong> ${c.divergenceScore.toFixed(2)}</p>`);
    lines.push(`<p><strong>Explanation:</strong> ${c.explanation}</p>`);
    if (c.recommendation) {
      lines.push(`<p><strong>Recommendation:</strong> ${c.recommendation}</p>`);
    }
    lines.push('<h3>Signals</h3>');
    lines.push('<ul>');
    lines.push(`<li>Insider Score: ${c.signals.insiderScore.toFixed(2)}</li>`);
    lines.push(`<li>Buyback Score: ${c.signals.buybackScore.toFixed(2)}</li>`);
    lines.push(`<li>Ownership Score: ${c.signals.ownershipScore.toFixed(2)}</li>`);
    lines.push(`<li>Price Delta: ${c.signals.priceDelta.toFixed(2)}</li>`);
    lines.push('</ul>');
    lines.push('<h3>Evidence</h3>');
    lines.push(`<pre>${JSON.stringify(c.evidence, null, 2)}</pre>`);
    detail.innerHTML = lines.join('\n');
    document.getElementById('back-btn').addEventListener('click', loadBoard);
  } catch (err) {
    detail.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}