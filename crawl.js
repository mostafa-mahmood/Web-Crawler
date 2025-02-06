const { JSDOM } = require('jsdom');

async function crawlPage(baseURL, currentURL, pages) {
    const baseUrlObj = new URL(baseURL);
    const currentUrlObj = new URL(currentURL);

    if (baseUrlObj.hostname !== currentUrlObj.hostname) {
        return pages;
    }

    const normalizedCurrentUrl = normalizeURL(currentURL);
    if (pages[normalizedCurrentUrl] > 0) {
        pages[normalizedCurrentUrl]++;
        return pages;
    }
    
    pages[normalizedCurrentUrl] = 1;
    console.log(`Crawling ${currentURL} ...`);

    try {
        const res = await fetch(currentURL);

        if (res.status > 399) {
            console.error(`Error fetching from URL: ${currentURL} \nstatus code: ${res.status}`);
            return pages;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType.includes('text/html')) {
            console.error(`Non HTML response on page: ${currentURL}\ncontent-type: ${contentType}`);
            return pages;
        }

        const htmlBody = await res.text();
        const nextUrls = extractURL(htmlBody, baseURL);
        
        const crawlPromises = nextUrls.map(nextUrl => crawlPage(baseURL, nextUrl, pages));
        await Promise.all(crawlPromises);
        
        return pages;
    } catch (err) {
        console.error(`Error crawling ${currentURL}: ${err.message}`);
        return pages;
    }
}

function extractURL(htmlBody, baseUrl) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');

    for (const linkElement of linkElements) {
        if (linkElement.href.charAt(0) === '/') {
            try {
                const urlObj = new URL(`${baseUrl}${linkElement.href}`);
                urls.push(urlObj.href);
            } catch (err) {
                console.log("Error handling relative URL:", err.message);
            }
        } else {
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            } catch (err) {
                console.log("Error handling absolute URL:", err.message);
            }
        }      
    }
    return urls;
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    let url = `${urlObj.hostname}${urlObj.pathname}`;
    if (url.length > 0 && url.slice(-1) === '/') {
        url = url.slice(0, -1);
    }
    return url;
}

module.exports = {
          crawlPage,
          normalizeURL,
          extractURL
};