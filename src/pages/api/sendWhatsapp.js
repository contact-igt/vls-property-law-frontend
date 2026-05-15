// pages/api/sendWhatsapp.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, name, amount, programm_name, schedule, platform, link_date } =
    req.body;

  if (
    !phone ||
    !amount ||
    !programm_name ||
    !schedule ||
    !platform ||
    !link_date
  ) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const apiUrl = `https://backend.askeva.io/v1/message/send-message?token=${process.env.REACT_APP_ASKEVA_API_KEY}`;

  try {
    const response = await fetch(
      apiUrl,

      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: phone,
          type: "template",
          template: {
            name: "event_remainder",
            language: {
              policy: "deterministic",
              code: "en",
            },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: name },
                  { type: "text", text: String(amount) },
                  { type: "text", text: programm_name },
                  { type: "text", text: schedule },
                  { type: "text", text: platform },
                  { type: "text", text: link_date },
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true, result: data });
  } catch (err) {
    console.error("Error sending WhatsApp:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
