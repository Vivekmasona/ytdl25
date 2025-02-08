const express = require("express");
const ytdl = require("ytdl-core");

const app = express();

app.get("/stream_audio", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing 'url' parameter" });

    try {
        // Get YouTube video info
        const info = await ytdl.getInfo(url);

        // Choose best audio format
        const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });

        if (!format || !format.url) {
            return res.status(404).json({ error: "No audio stream found" });
        }

        // Send JSON response with stream URL
        res.json({ stream_url: format.url });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Export for Vercel
module.exports = app;
