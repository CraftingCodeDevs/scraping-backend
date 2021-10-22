const scraping = require("../../utils/scraping");

async function scrapingIgss(dataToFind) {
    try {
        const data = await scraping(dataToFind);
        return data;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    scrapingIgss,
};
