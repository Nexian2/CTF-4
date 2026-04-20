const fs = require('fs');
const path = require('path');
const { getSession } = require('./me');

module.exports = async (req, res) => {
  const user = getSession(req);

  if (!user) {
    const next = encodeURIComponent('/admin.html');
    res.setHeader('Location', '/login.html?next=' + next);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(302).end();
  }

  const filePath = path.join(process.cwd(), 'admin.html');

  try {
    const html = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(html);
  } catch {
    return res.status(404).send('Not found');
  }
};
