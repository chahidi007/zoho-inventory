// api/transactions.js — fetches recent transactions for discrepant items
export default async function handler(req, res) {
  const { org_id, item_id } = req.query;
  const token = req.headers['x-zoho-token'];

  if (!org_id || !token) {
    return res.status(400).json({ error: 'Missing org_id or token' });
  }

  try {
    // Fetch inventory history / transactions for the item
    const [salesRes, purchasesRes, adjustRes] = await Promise.all([
      fetch(`https://www.zohoapis.eu/books/v3/invoices?organization_id=${org_id}&item_id=${item_id}&per_page=10&sort_column=date&sort_order=D`, {
        headers: { Authorization: `Zoho-oauthtoken ${token}` }
      }),
      fetch(`https://www.zohoapis.eu/books/v3/purchaseorders?organization_id=${org_id}&item_id=${item_id}&per_page=10&sort_column=date&sort_order=D`, {
        headers: { Authorization: `Zoho-oauthtoken ${token}` }
      }),
      fetch(`https://www.zohoapis.eu/books/v3/inventoryadjustments?organization_id=${org_id}&per_page=20&sort_column=date&sort_order=D`, {
        headers: { Authorization: `Zoho-oauthtoken ${token}` }
      }),
    ]);

    const [sales, purchases, adjustments] = await Promise.all([
      salesRes.json(),
      purchasesRes.json(),
      adjustRes.json(),
    ]);

    res.status(200).json({
      sales:       sales.invoices       || [],
      purchases:   purchases.purchaseorders || [],
      adjustments: adjustments.inventory_adjustments || [],
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
