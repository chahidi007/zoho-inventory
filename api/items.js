// api/items.js — proxies Zoho Books items API to avoid CORS
export default async function handler(req, res) {
  const { org_id } = req.query;
  const token = req.headers['x-zoho-token'];

  if (!org_id || !token) {
    return res.status(400).json({ error: 'Missing org_id or token' });
  }

  try {
    const zohoRes = await fetch(
      `https://www.zohoapis.eu/books/v3/items?organization_id=${org_id}`,
      { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
    );
    const data = await zohoRes.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
