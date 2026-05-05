export default async function handler(req, res) {
  // CORS — autorise toutes les origines (ta page Vercel incluse)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://n8n.bev-ops.com/webhook-test/bev-ops-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const status = response.status;
    return res.status(200).json({ ok: true, upstream: status });
  } catch (err) {
    console.error("Webhook proxy error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
