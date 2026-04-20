const getDb = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const db = await getDb();
    const result = db.exec(`SELECT * FROM products ORDER BY id`);
    if (!result.length) return res.status(200).json({ products: [] });
    const cols = result[0].columns;
    const products = result[0].values.map(row => {
      const obj = {};
      cols.forEach((c, i) => { obj[c] = row[i]; });
      return obj;
    });
    return res.status(200).json({ products });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
};
