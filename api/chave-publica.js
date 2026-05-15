const BASE = 'https://api.pagseguro.com';

export default async function handler(req, res) {
  try {
    const token = process.env.PAGBANK_TOKEN;
    
    // Trava 1: Verifica se a Vercel achou o token
    if (!token) {
      return res.status(500).json({ erro: "O Token não foi encontrado nas variáveis da Vercel." });
    }

    const r = await fetch(`${BASE}/public-keys/card`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Pega a resposta em texto cru primeiro para não quebrar (Trava 2)
    const text = await r.text();

    // Trava 3: Se a API deu erro (401, 403, etc), mostra o erro real
    if (!r.ok) {
      return res.status(r.status).json({ 
        erro: "O PagBank recusou a requisição", 
        status: r.status, 
        corpo: text || "Resposta vazia do PagBank"
      });
    }

    // Se deu sucesso, converte o texto para JSON
    const data = JSON.parse(text);
    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
}