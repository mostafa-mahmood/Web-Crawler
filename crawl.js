const {JSDOM} = require('jsdom');


function extractURL(htmlBody, baseUrl){
          const urls = [];

          const dom = new JSDOM(htmlBody);
          const linkElements = dom.window.document.querySelectorAll('a');

          for(linkElement of linkElements){
                    if(linkElement.href.charAt(0) === '/'){
                              try{
                                        const urlObj = new URL(`${baseUrl}${linkElement.href}`);
                                        urls.push(urlObj.href);
                              } catch(err){
                                        console.log("error handling relative URL");
                              }
                    } else {
                              try{
                                        const urlObj = new URL(linkElement.href);
                                        urls.push(urlObj.href);
                              } catch(err){
                                        console.log("error handling absloute URL");
                              }
                    }      
          }

          return urls;
}

//multible URLs might refer to the same page
//what this function does it normalize all these url strings to be the same
function normalizeURL(urlString){
          const urlObj = new URL(urlString);

          let url =  `${urlObj.hostname}${urlObj.pathname}`;

          if(url.length > 0 && url.slice(-1) === '/'){
                    url = url.slice(0, -1);
          }

          return url;
}



module.exports = {
          normalizeURL,
          extractURL
}