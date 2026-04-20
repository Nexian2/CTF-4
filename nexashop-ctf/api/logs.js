const getDb = require('./_db');
const { getSession } = require('./me');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = getSession(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const filter = (req.query && req.query.filter != null) ? String(req.query.filter) : '';

  try {
    const db = await getDb();
    let query;

    if (filter.trim() !== '') {
      // INTENTIONALLY VULNERABLE: raw string concat for CTF SQLi challenge
      query = `SELECT id, ts, username, action, ip FROM logs WHERE username = '${filter}' ORDER BY id DESC`;
    } else {
      query = `SELECT id, ts, username, action, ip FROM logs ORDER BY id DESC`;
    }

    const result = db.exec(query);
    if (!result.length) return res.status(200).json({ rows: [] });

    const cols = result[0].columns;
    const rows = result[0].values.map(row => {
      const obj = {};
      cols.forEach((c, i) => { obj[c] = row[i]; });
      return obj;
    });

    return res.status(200).json({ rows });
  } catch (e) {
    return res.status(500).json({ error: 'Query failed: ' + e.message });
  }
};
