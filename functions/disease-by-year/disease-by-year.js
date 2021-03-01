const fetch = require('node-fetch')
const jsdom = require('jsdom');

/* Parse a string of html text returned by a PubMed search query and extract the
 * aggregated publication counts grouped by year from the table used to
 * render the histogram on the search results page.
 *
 * This page was the only place I could find this data already aggregated. It
 * stops us having make a separate API call for every year that we are
 * interested in to get the publication count.
 **/
const getPubMedCounts = (htmlText) => {
  const htmlDoc = new jsdom.JSDOM(htmlText).window.document
  const table = htmlDoc.getElementById('timeline-table')

  const countByYear = []
  const rowsWithoutHeader = Array.from(table.rows).slice(1)
  rowsWithoutHeader.forEach(row => {
    const [year, count] = [
      row.children[0].innerHTML.trim(),
      parseInt(row.children[1].innerHTML)
    ]
    countByYear.push({year, count})
  })
  return countByYear
}

const handler = async function (event, context) {
  try {
    const disease = event.queryStringParameters.term;
    const url = `https://pubmed.ncbi.nlm.nih.gov/?term=${disease}`;
    console.log(`Sending PubMed search request as ${url}`)
    const response = await fetch(url, {
      headers: { Accept: 'text/html' },
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.text()

    return {
      statusCode: 200,
      body: JSON.stringify({ disease, counts: getPubMedCounts(data) }),
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
