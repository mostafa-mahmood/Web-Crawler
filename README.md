# Web Crawler

A web crawler that maps internal links on websites. This tool crawls a specified website and generates a report showing how many times each page is linked to internally.

## Features

- Crawls all pages within a specified domain
- Counts internal links to each page
- Handles both relative and absolute URLs
- Provides a formatted report of findings
- Respects same-origin policy (won't crawl external domains)
- Parallel crawling for better performance
- Error handling for invalid URLs and non-HTML responses

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```
git clone <your-repository-url>
cd Web-Crawler
```

2. Install dependencies:
```
npm install
```

## Usage

Run the crawler with a base URL:
```
npm start https://example.com
```

### Command Line Arguments

- Requires exactly one argument (the base URL)
- Will exit with an error if no URL is provided or if too many arguments are given

## Output

The crawler will:
1. Show progress as it crawls each page
2. Generate a report showing internal links found
3. Sort pages by number of internal links (descending order)

Example output:
```
=================================
============REPORT===============
=================================
Found 12 internal links to example.com/
Found 8 internal links to example.com/about
Found 6 internal links to example.com/contact
=================================
==========END REPORT=============
=================================
```
## Limitations

- Only crawls pages within the same domain
- Only processes HTML content
- Requires a valid starting URL
