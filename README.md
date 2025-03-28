# Web Crawler API

A web crawling API that maps internal links on websites. This tool crawls a given set of seed URLs and returns a structured JSON report showing how many times each page is linked to internally.

## Features

- Accepts multiple seed URLs
- Crawls all pages within a specified domain
- Counts internal links to each page
- Respects same-origin policy (won't crawl external domains)
- Supports depth-based crawling
- Parallel crawling for better performance

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```
git clone https://github.com/mostafa-mahmood/Web-Crawler.git
cd Web-Crawler
```

2. Install dependencies:
```
npm install
```

## Usage

### Running the API

Start the server:
```
npm start
```

### API Endpoints

#### **POST /api**

**Description:** Accepts a JSON payload with seed URLs, max depth and max pages and returns a structured report.

**Request Body:**
```json
{
  "urls": [
    "https://books.toscrape.com",
    "https://quotes.toscrape.com"
  ],
  "depth": 5,
  "maxPages": 100
}
```

**Response:**
```json
{
  "https://books.toscrape.com": {
    "pages": {
      "https://books.toscrape.com": 1,
      "https://books.toscrape.com/catalogue/page-1.html": 1
    },
    "logs": [
      "Skipping https://external.com (different hostname)",
      "Error fetching https://books.toscrape.com/404: Status code 404"
    ]
  },
  "https://quotes.toscrape.com": {
    "pages": {
      "https://quotes.toscrape.com": 1
    },
    "logs": []
  }
}
```

### Query Parameters

- **Depth:** Controls how deep the crawler should explore from the seed URL.
- **Max Pages:** Limits the number of pages to be crawled per domain.

## Output

- The API returns a JSON report with:
  - The number of times each internal page is linked to
  - Logs containing errors, skipped pages, and non-HTML responses
  - Separate results for each seed URL

## Limitations

- Only crawls pages within the same domain
- Only processes HTML content
- Requires valid URLs in the request
- High depth values may increase response time significantly

## Future Enhancements

- Implement caching to avoid redundant requests
- Add support for sitemap crawling
- Allow rate-limiting to control server load