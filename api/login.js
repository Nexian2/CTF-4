const getDb = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  if (typeof username !== 'string' || typeof password !== 'string')
    return res.status(400).json({ error: 'Invalid input' });

  if (username.length > 64 || password.length > 128)
    return res.status(400).json({ error: 'Input too long' });

  try {
    const db = await getDb();
    const result = db.exec(
      `SELECT id, username FROM users WHERE username = ? AND password = ?`,
      [username, password]
    );

    if (result.length && result[0].values.length) {
      const token = Buffer.from(
        JSON.stringify({ u: result[0].values[0][1], t: Date.now() })
      ).toString('base64');
      res.setHeader(
        'Set-Cookie',
        `nxs_sess=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=14400`
      );
      return res.status(200).json({ success: true });
    }

    await new Promise(r => setTimeout(r, 300));
    return res.status(401).json({ error: 'Invalid username or password.' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error.' });
  }
};
