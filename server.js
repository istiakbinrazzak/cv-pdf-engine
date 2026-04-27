const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow Hostinger to talk to this API
app.use(cors());

// Increase payload limit for large base64 images (profile photos)
app.use(express.json({ limit: '50mb' }));

app.post('/generate-pdf', async (req, res) => {
    const { html } = req.body;

    if (!html) {
        return res.status(400).send('Missing HTML payload');
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        // Inject HTML and wait for images/fonts to load
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Ensure background colors print
        await page.emulateMediaType('screen');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length
        });
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).send('Error generating PDF');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`PDF Service running on port ${PORT}`);
});
