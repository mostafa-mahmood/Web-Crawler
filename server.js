const { crawlPage } = require('./crawl.js');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api', async (req, res) => {
    try {
        const validUrls = validateRequest(req, res);
        if (!validUrls) return;

        const results = await crawlSeedUrls(validUrls);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function crawlSeedUrls(seedUrls) {
          const results = {};
      
          for (const seedUrl of seedUrls) {
              results[seedUrl] = { pages: {}, logs: [] };
              await crawlPage(seedUrl, seedUrl, results[seedUrl].pages, results[seedUrl].logs);
          }
      
          return results;
}

function validateRequest(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).send('Request body is required');
        return undefined;
    }

    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
        res.status(400).send('Request body must be JSON');
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

    return validUrls;
}

const PORT = 3000;
const DOMAIN = 'http://localhost:';
app.listen(PORT, () => {
    console.log(`Server running on: ${DOMAIN}${PORT}`);
});
