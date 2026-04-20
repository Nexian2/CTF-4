const sections = ['overview', 'orders', 'products', 'logs'];
const titles = { overview: 'Overview', orders: 'Orders', products: 'Products', logs: 'Log Analysis' };

function showSection(name) {
  sections.forEach(s => {
    document.getElementById('sec-' + s).style.display = s === name ? '' : 'none';
  });
  document.getElementById('pageTitle').textContent = titles[name];
  document.querySelectorAll('.sidebar-link').forEach((el, i) => {
    el.classList.toggle('active', ['overview','orders','products','logs'][i] === name);
  });
}

async function checkSession() {
  document.body.style.visibility = 'hidden';
  try {
    const res = await fetch('/api/me', { credentials: 'include' });
    if (!res.ok) { window.location.replace('/login.html'); return; }
    const data = await res.json();
    if (!data.username) { window.location.replace('/login.html'); return; }
    document.body.style.visibility = '';
  } catch {
    window.location.replace('/login.html');
  }
}

async function doLogout() {
  await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  window.location.replace('/login.html');
}

async function queryLogs() {
  const filter = document.getElementById('logFilter').value;
  const tbody = document.getElementById('logsBody');
  tbody.innerHTML = '<tr><td colspan="5" class="loading-row">Querying...</td></tr>';
  try {
    const res = await fetch('/api/logs?filter=' + encodeURIComponent(filter), { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      tbody.innerHTML = '<tr><td colspan="5" class="loading-row" style="color:var(--red);">Error: ' + (data.error || 'Query failed') + '</td></tr>';
      return;
    }
    if (!data.rows || data.rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="loading-row">No results found.</td></tr>';
      return;
    }
    tbody.innerHTML = data.rows.map(r => `
      <tr>
        <td class="tbl-mono">${r.id}</td>
        <td class="tbl-mono">${r.ts}</td>
        <td>${r.username}</td>
        <td>${r.action}</td>
        <td class="tbl-mono">${r.ip}</td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="5" class="loading-row" style="color:var(--red);">Network error.</td></tr>';
  }
}

async function loadAllLogs() {
  document.getElementById('logFilter').value = '';
  await queryLogs();
}

function checkFlag() {
  const val = document.getElementById('flagInput').value.trim();
  const res = document.getElementById('flagResult');
  if (val === 'BakaCTF{A1d3nP1erc3?}') {
    res.innerHTML = '<div class="alert alert-success">Correct! Flag accepted. Challenge complete.</div>';
  } else if (!val) {
    res.innerHTML = '<div class="alert alert-error">Please enter a flag.</div>';
  } else {
    res.innerHTML = '<div class="alert alert-error">Incorrect flag. Keep digging.</div>';
  }
}

checkSession();
