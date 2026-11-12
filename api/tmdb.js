// Vercel serverless function: proxies requests to TMDB so the API key
// never reaches the browser. Usage from the front end:
//   /api/tmdb?path=/movie/popular&page=1
// The key is read from the TMDB_API_KEY environment variable.

const ALLOWED_PATH = /^\/(movie|genre|search|discover|trending)(\/[A-Za-z0-9_]+)*$/;

module.exports = async function handler(req, res) {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: "TMDB_API_KEY is not set on the server." });
        return;
    }

    const { path, ...rest } = req.query || {};
    if (typeof path !== "string" || !ALLOWED_PATH.test(path)) {
        res.status(400).json({ error: "Invalid or missing TMDB path." });
        return;
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(rest)) {
        if (key === "api_key") continue;
        params.append(key, Array.isArray(value) ? value[0] : String(value));
    }
    params.set("api_key", apiKey);

    try {
        const upstream = await fetch(`https://api.themoviedb.org/3${path}?${params}`);
        const data = await upstream.json();
        // Cache at Vercel's edge for 1 hour to stay well within TMDB rate limits.
        res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
        res.status(upstream.status).json(data);
    } catch (error) {
        res.status(502).json({ error: "Could not reach TMDB." });
    }
};
