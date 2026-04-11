// api/adjust.js — proxies Zoho Books inventory adjustments to avoid CORS
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { org_id } = req.query;
  const token = req.headers['x-zoho-token'];

  if (!org_id || !token) {
    return res.status(400).json({ error: 'Missing org_id or token' });
  }

  try {
    const zohoRes = await fetch(
      `https://www.zohoapis.eu/books/v3/inventoryadjustments?organization_id=${org_id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );
    const data = await zohoRes.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
