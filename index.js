const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const COOKIES_PATH = path.join(__dirname, 'cookies.txt'); // Cookies file path

app.get('/stream_audio', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing 'url' parameter" });

    try {
        // Read cookies.txt content if exists
        let cookies = '';
        if (fs.existsSync(COOKIES_PATH)) {
            cookies = fs.readFileSync(COOKIES_PATH, 'utf8');
        }

        // Get audio stream URL with cookies support
        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: { 'Cookie': cookies }
            }
        });

        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        if (!format || !format.url) {
            return res.status(404).json({ error: "Audio URL not found" });
        }

        // Redirect to direct audio stream URL
        res.redirect(302, format.url);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
