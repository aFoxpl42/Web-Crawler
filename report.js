function printReport(pages) {
    const sortedObject = Object.entries(pages).sort((x, y) => y[1] - x[1]);
    console.log('===========')
    console.log('REPORT')
    console.log('===========')
    for (const sortedObj of sortedObject) {
        const url = sortedObj[0]
        const count = sortedObj[1]
        console.log(`Found ${count} internal link to ${url}`)
    }
}

module.exports = {
    printReport,
}