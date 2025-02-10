const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');

async function crawlPage(baseURL, currentURL, pages, logs, depth, maxPages, pagesCrawled = { count: 0 }) {
    pages = pages || {};
    return await crawlPageWithDepth(baseURL, currentURL, pages, logs, 0, depth, maxPages, pagesCrawled);
}

async function crawlPageWithDepth(baseURL, currentURL, pages, logs, currentDepth, maxDepth, maxPages, pagesCrawled) {
    if (currentDepth > maxDepth) {
        return;
    }

    if (pagesCrawled.count >= maxPages) {
        return;
    }

    const baseUrlObj = new URL(baseURL);
    const currentUrlObj = new URL(currentURL);

    if (baseUrlObj.hostname !== currentUrlObj.hostname) {
        logs.push(`Skipped ${currentURL} (different hostname)`);
        return;
    }

    const normalizedCurrentUrl = normalizeURL(currentURL);

    if (pages[normalizedCurrentUrl]) {
        return;
    }

    pages[normalizedCurrentUrl] = 1;
    pagesCrawled.count++;

    try {
        const res = await fetch(currentURL);

        if (res.status > 399) {
            logs.push(`Error fetching ${currentURL}: Status code ${res.status}`);
            return;
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
            logs.push(`Skipping ${currentURL}: Non-HTML content (${contentType})`);
            return;
        }

        const htmlBody = await res.text();
        const nextUrls = extractURL(htmlBody, baseURL, logs);

        await Promise.all(nextUrls.map(nextUrl =>
            crawlPageWithDepth(baseURL, nextUrl, pages, logs, currentDepth + 1, maxDepth, maxPages, pagesCrawled)
        ));

    } catch (err) {
        logs.push(`Error crawling ${currentURL}: ${err.message}`);
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
