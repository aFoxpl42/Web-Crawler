const { JSDOM } = require('jsdom')

async function crawlPage(baseURl, currentURl, pages) {
    // if this is an offsite URL, bail immediately
    baseUrlObj = new URL(baseURl)
    currentUrlObj = new URL(currentURl)
    if (baseUrlObj.hostname !== currentUrlObj.hostname) {
        return pages
    }

    const normalizedURL = normalizeURL(currentURl)

    // if we've already visited this page
    // just increase the cound and don't repeat
    // the http request
    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++
        return pages
    }

    pages[normalizedURL] = 1

    // fetch and parse the html of the currentURl
    console.log(`crawling ${currentURl}`)
    let htmlBody = ''
    try {
        const resp = await fetch(currentURl)
        if (resp.status > 399) {
            console.log(`Got HTTP error, status code: ${resp.status}`)
            return pages
        }
        const contentType = resp.headers.get('content-type')
        if (!contentType.includes('text/html')) {
            console.log(`Got non-html response: ${contentType}`)
            return pages
        }
        htmlBody = await resp.text()
    } catch (err) {
        console.log(err.message)
    }

    const nextURLs = getURLSFromHtml(htmlBody, baseURl)
    for (const nextURL of nextURLs){
        pages = await crawlPage(baseURl, nextURL, pages)
        
    }
    return pages
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


