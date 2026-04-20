function getSession(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/nxs_sess=([^;]+)/);
  if (!match) return null;
  try {
    const payload = JSON.parse(Buffer.from(decodeURIComponent(match[1]), 'base64').toString());
    if (!payload.u || !payload.t) return null;
    const age = Date.now() - payload.t;
    if (age > 4 * 60 * 60 * 1000) return null;
    return payload.u;
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const user = getSession(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  return res.status(200).json({ username: user });
};

module.exports.getSession = getSession;
