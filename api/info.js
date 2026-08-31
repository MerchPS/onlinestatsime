export default async function handler(req, res) {
  try {
    const upstream = await fetch(
      "http://main.imeroleplay.com:30120/dynamic.json",
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "IME-RP-Player-Monitor/1.0"
        },
        cache: "no-store"
      }
    );

    const text = await upstream.text();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: `FiveM HTTP ${upstream.status}`
      });
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      return res.status(502).json({
        error: "Response dynamic.json bukan JSON"
      });
    }

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

    res.setHeader(
      "Content-Type",
      "application/json; charset=utf-8"
    );

    return res.status(200).send(JSON.stringify(data));

  } catch (error) {

    return res.status(502).json({
      error: "Vercel tidak dapat menghubungi dynamic.json",
      detail: error?.message || String(error)
    });

  }
}
