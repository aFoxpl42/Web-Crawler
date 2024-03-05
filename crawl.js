async function crawlPage(baseURL, currentURL, pages) {
    console.log(`crawling ${currentURL}`)
    try {
        const resp = await fetch(currentURL)
        if (resp.status > 399){
            console.log(`Get HTTP error, status code: ${resp.status}`)
            return
        }
        const contentType = resp.headers.get('content-type')
        if (!contentType.includes('text/html')){
            console.log(`Got non-html response: ${contentType}`)
            return
        }
        console.log(await resp.text())
    } catch (err) {
        console.log(err.message)
    }
}


function normalizeURL(urlString){
    const myURL = new URL(urlString)
    const hostPath = `${myURL.host}${myURL.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, -1)
    }
    return hostPath
}

function getURLSFromHtml(htmlBody, baseURL){
    const urls = []
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const dom = new JSDOM(htmlBody, {
        url: baseURL,
    });
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements) {
        urls.push(linkElement.href)
    }
    return urls
}

module.exports = {
    normalizeURL,
    getURLSFromHtml,
    crawlPage,
}


