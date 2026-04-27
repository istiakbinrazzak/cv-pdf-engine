const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// A simple route to check if the server is awake
app.get('/', (req, res) => {
    res.send('PDF Engine is awake and ready!');
});

app.post('/generate-pdf', async (req, res) => {
    const { html } = req.body;

    if (!html) {
        return res.status(400).send('Missing HTML payload');
    }

    let browser;
    try {
        // Ultra-lightweight Chrome settings for 512MB RAM limits
        browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
            headless: 'new',
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage', // Fixes Docker shared memory issues
                '--disable-gpu',
                '--no-zygote',
                '--single-process', // Forces Chrome to use less RAM
                '--disable-accelerated-2d-canvas'
            ]
        });

        const page = await browser.newPage();

        // Block unnecessary resources (like Javascript) from loading in the PDF to save memory
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'script') {
                req.abort();
            } else {
                req.continue();
            }
        });

        // networkidle2 is more forgiving and prevents timeout crashes
        await page.setContent(html, { waitUntil: 'networkidle2', timeout: 60000 });
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
        res.status(500).send(`Server crashed during generation: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`PDF Service running on port ${PORT}`);
});
