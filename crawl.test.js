const {normalizeURL, extractURL} = require('./crawl.js');
const {test, expect} = require('@jest/globals')

test('normalizeURL strip protocol', () => {
          const input = "https://www.google.com/path";
          const actual = normalizeURL(input);
          const expected = "www.google.com/path";

          expect(actual).toEqual(expected);
});


test('normalizeURL trim leading /', () => {
          const input = "https://www.google.com/path/";
          const actual = normalizeURL(input);
          const expected = "www.google.com/path";

          expect(actual).toEqual(expected);
});

test ('normalizeURL capitals', () => {
          const input = "http://www.Google.com/path/";
          const actual = normalizeURL(input);
          const expected = "www.google.com/path";

          expect(actual).toEqual(expected);
});

test('extractURL', () =>{
          const htmlBody = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
          </head>
          <body>
                    <a href = "/path"> google</a>
                    <a href = "https://www.linkedin.com"> linkedin</a>
                    <a href = "invalidURL"> chatgpt</a>   
          </body>
          </html>`;
          const baseUrl = "https://www.google.com";
          const actual = extractURL(htmlBody, baseUrl);
          const expected = ["https://www.google.com/path", "https://www.linkedin.com/"];

          expect(actual).toEqual(expected);
})