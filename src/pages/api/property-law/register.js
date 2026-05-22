export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const backendBase =
    process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_LOCALHOST_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!backendBase) {
    console.error("Property Law proxy: backend base URL not configured");
    return res.status(500).json({ message: "Backend base URL not configured" });
  }

  const clientKey = process.env.PROPERTY_LAW_CLIENT_KEY || process.env.NEXT_PUBLIC_CLIENT_KEY || "vls_law";

  const backendUrl = `${backendBase.replace(/\/$/, "")}/property-law/register`;

  try {
    const payload = { ...(req.body || {}) };
    // ensure client_key is present in body as a fallback for helpers that can't set headers
    if (!payload.client_key) payload.client_key = clientKey;
    
    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Key": clientKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await backendRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    return res.status(backendRes.status).json(data);
  } catch (err) {
    console.error("Property Law proxy error:", err);
    return res.status(500).json({ message: "Internal error" });
  }
}
