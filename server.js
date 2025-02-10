const { crawlPage } = require('./crawl.js');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api', async (req, res) => {
    try {
        const { validUrls, depth, maxPages } = validateRequest(req, res);
        if (!validUrls) return;

        const results = await crawlSeedUrls(validUrls, depth, maxPages);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function crawlSeedUrls(seedUrls, depth, maxPages) {
    const results = {};

    for (const seedUrl of seedUrls) {
        results[seedUrl] = { pages: {}, logs: [] };
        await crawlPage(seedUrl, seedUrl, results[seedUrl].pages, results[seedUrl].logs, depth, maxPages);
    }

    return results;
}

function validateRequest(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).send('Request body is required');
        return undefined;
    }

    if (!req.body.urls || !Array.isArray(req.body.urls)) {
        res.status(400).send('Request body must contain a "urls" array');
        return undefined;
    }

    const seedUrls = req.body.urls;
    if (seedUrls.length > 3 || seedUrls.length < 1) {
        res.status(400).send('Seed URLs must be between 1 and 3');
        return undefined;
    }

    const depth = req.body.depth ?? 3; // Default depth is 3
    const maxPages = req.body.maxPages ?? 50; // Default max pages is 50

    if (typeof depth !== 'number' || depth < 1) {
        res.status(400).send('Depth must be a positive integer');
        return undefined;
    }

    if (typeof maxPages !== 'number' || maxPages < 1) {
        res.status(400).send('Max pages must be a positive integer');
        return undefined;
    }

    const validUrls = [];
    const invalidUrls = [];
    for (const url of seedUrls) {
        try {
            new URL(url);
            validUrls.push(url);
        } catch (err) {
            invalidUrls.push(url);
        }
    }

    if (validUrls.length === 0) {
        res.status(400).json({ error: 'All seed URLs are invalid', invalidUrls });
        return undefined;
    }

    if (invalidUrls.length > 0) {
        res.status(400).json({ error: 'Some URLs are invalid', invalidUrls });
        return undefined;
    }

    return { validUrls, depth, maxPages };
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
