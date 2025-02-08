const express = require("express");
const ytdl = require("ytdl-core");

const app = express();

app.get("/stream_audio", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing 'url' parameter" });

    try {
        // Get video info
        const info = await ytdl.getInfo(url);

        // Get best audio format (Opus/M4A)
        const format = ytdl.chooseFormat(info.formats, { filter: "audioonly" });

        if (!format) {
            return res.status(404).json({ error: "No audio format available" });
        }

        // Set headers for streaming
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Cache-Control", "no-cache");

        // Stream audio
        const stream = ytdl(url, { format });
        stream.pipe(res);

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Export for Vercel
module.exports = app;
