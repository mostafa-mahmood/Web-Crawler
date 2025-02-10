const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');

async function crawlPage(baseURL, currentURL, pages, logs = []) {
    pages = pages || {};
    return await crawlPageWithDepth(baseURL, currentURL, pages, logs, 0);
}

async function crawlPageWithDepth(baseURL, currentURL, pages, logs, depth = 0) {
    if (depth > 3) {
        logs.push(`Max depth reached for ${currentURL}`);
        return { pages, logs };
    }

    const baseUrlObj = new URL(baseURL);
    const currentUrlObj = new URL(currentURL);

    if (baseUrlObj.hostname !== currentUrlObj.hostname) {
        logs.push(`Skipped ${currentURL} (different hostname)`);
        return { pages, logs };
    }

    const normalizedCurrentUrl = normalizeURL(currentURL);

    if (pages[normalizedCurrentUrl]) {
        return { pages, logs };
    }

    pages[normalizedCurrentUrl] = 1;

    try {
        const res = await fetch(currentURL);

        if (res.status > 399) {
            logs.push(`Error fetching ${currentURL}: Status code ${res.status}`);
            return { pages, logs };
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
            logs.push(`Skipping ${currentURL}: Non-HTML content (${contentType})`);
            return { pages, logs };
        }

        const htmlBody = await res.text();
        const nextUrls = extractURL(htmlBody, baseURL, logs);

        await Promise.all(nextUrls.map(nextUrl => crawlPageWithDepth(baseURL, nextUrl, pages, logs, depth + 1)));

        return { pages, logs };
    } catch (err) {
        logs.push(`Error crawling ${currentURL}: ${err.message}`);
        return { pages, logs };
    }
}

function extractURL(htmlBody, baseUrl, logs = []) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    const baseUrlObj = new URL(baseUrl);

    for (const linkElement of linkElements) {
        try {
            let href = linkElement.href;

            if (!href.startsWith('http')) {
                href = new URL(href, baseUrl).href;
            }

            const urlObj = new URL(href);
            if (urlObj.hostname === baseUrlObj.hostname) {
                urls.push(href);
            }
        } catch (err) {
            logs.push(`Error handling URL: ${err.message}`);
        }
    }

    return urls;
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`.replace(/\/$/, '');
}

module.exports = {
    crawlPage,
    normalizeURL,
    extractURL,
};
