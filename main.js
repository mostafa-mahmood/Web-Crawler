const {crawlPage} = require("./crawl.js");
const {printReport} = require("./report.js");

async function main() {
          if (process.argv.length < 3) {
              console.error("No URL was provided");
              process.exit(1);
          } else if (process.argv.length > 3) {
              console.error("Too many arguments");
              process.exit(1);
          }
      
          const baseURL = process.argv[2];
          try {
              const pages = await crawlPage(baseURL, baseURL, {});
              printReport(pages);
              
          } catch (err) {
              console.error("Error in main:", err.message);
              process.exit(1);
          }
}

main();