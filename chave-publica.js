// URL de Produção
const BASE = 'https://api.pagseguro.com';

export default async function handler(req, res) {
  try {
    const r = await fetch(`${BASE}/public-keys/card`, {
      headers: { 'Authorization': `Bearer ${process.env.PAGBANK_TOKEN}` }
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
}