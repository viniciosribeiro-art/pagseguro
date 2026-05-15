// URL de Produção
const BASE = 'https://api.pagseguro.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  try {
    const { nome, email, cpf, valor, descricao, cartao_token, parcelas } = req.body;
    const ts = Date.now();

    const r = await fetch(`${BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAGBANK_TOKEN}`
      },
      body: JSON.stringify({
        reference_id: `pedido-${ts}`,
        customer: {
          name: nome,
          email: email,
          tax_id: cpf.replace(/\D/g, ''),
          phones: [{ country: "55", area: "11", number: "999999999", type: "MOBILE" }]
        },
        items: [{ name: descricao || 'Produto', quantity: 1, unit_amount: Math.round(valor * 100) }],
        charges: [{
          reference_id: `cobranca-${ts}`,
          description: descricao || 'Produto',
          amount: { value: Math.round(valor * 100), currency: 'BRL' },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: parseInt(parcelas) || 1,
            capture: true,
            card: { encrypted: cartao_token }
          }
        }],
        notification_urls: []
      })
    });

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
}