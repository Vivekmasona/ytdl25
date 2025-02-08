const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const COOKIES_PATH = path.join(__dirname, 'cookies.txt'); // Cookies file path

app.get('/stream_audio', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing 'url' parameter" });

    try {
        // Read cookies.txt content (Fix for Vercel)
        let cookies = '';
        if (fs.existsSync(COOKIES_PATH)) {
            try {
                cookies = fs.readFileSync(COOKIES_PATH, 'utf8');
            } catch (err) {
                console.warn("Cookies file read error:", err.message);
            }
        }

        // Get YouTube audio stream URL
        const info = await ytdl.getInfo(url, {
            requestOptions: { headers: { 'Cookie': cookies } }
        });

        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        if (!format || !format.url) {
            return res.status(404).json({ error: "Audio URL not found" });
        }

        // Instead of redirect, return JSON (Fix for Vercel crashing issue)
        res.json({ stream_url: format.url });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Required for Vercel
