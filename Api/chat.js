// Bu dosya SUNUCUDA çalışır, tarayıcıya hiç gönderilmez.
// API anahtarı Vercel "Environment Variables" kısmında saklanacak.

export default async function handler(req, res) {
  // Sadece POST isteklerine izin ver
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST isteği kabul edilir." });
  }

  const { systemTalimat, kullaniciMesaji } = req.body;

  if (!kullaniciMesaji) {
    return res.status(400).json({ error: "Mesaj boş olamaz." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Sunucu yapılandırma hatası: API anahtarı bulunamadı." });
  }

  try {
    const prompt = `Senin rolün/kişiliğin şu: ${systemTalimat}\n\nKullanıcı sana şunu söyledi: ${kullaniciMesaji}\n\nLütfen bu role sadık kalarak, samimi ve Türkçe bir yanıt ver.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API hatası:", data);
      return res.status(response.status).json({ error: data.error?.message || "Gemini API hatası" });
    }

    const cevapMetni = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!cevapMetni) {
      return res.status(200).json({ text: "Yapay zeka boş bir yanıt döndürdü." });
    }

    return res.status(200).json({ text: cevapMetni });
  } catch (error) {
    console.error("Sunucu hatası:", error);
    return res.status(500).json({ error: "Sunucu hatası: " + error.message });
  }
}
