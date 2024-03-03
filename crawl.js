function normalizeURL(urlString){
    const myURL = new URL(urlString)
    const hostPath = `${myURL.host}${myURL.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, -1)
    }
    return hostPath
}

function getURLSFromHtml(htmlBody, baseURL){
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const dom = new JSDOM(htmlBody, {
        url: baseURL,
    });
    console.log(dom.window.document.querySelectorAll('a'));
}

module.exports = {
    normalizeURL,
    getURLSFromHtml
}

getURLSFromHtml(`<body>

<p><a href="https://www.w3schools.com">W3Schools.com</a></p>
<p><a href="https://www.w3schools.com/html/">HTML Tutorial</a></p>

</body>`, `https://blog.boot.dev`)
