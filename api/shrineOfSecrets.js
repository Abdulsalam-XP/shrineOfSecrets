import axios from "axios";
import * as cheerio from "cheerio";

// Scraping configuration
let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://deadbydaylight.fandom.com/wiki/Shrine_of_Secrets',
    headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'cookie': 'your-cookie-here',
        'priority': 'u=0, i',
        'referer': 'https://www.google.com/',
        'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    }
};

// Vercel handler function
export default async function handler(req, res) {
    try {
        const response = await axios.request(config);
        const $ = cheerio.load(response.data);  // Parse the HTML

        let perks = [];
        const perkCount = 4; // Adjust based on the number of perks you expect

        // Loop through each perk
        for (let i = 1; i <= perkCount; i++) {
            const perkName = $(`#mw-content-text > div > table.sosTable.disableTooltip > tbody > tr:nth-child(2) > td > div > div.sosPerk.sosPerk${i} > div.sosPerkDesc.sosPerkDesc${i} > div.sosPerkDescName`).text().trim();
            const characterName = $(`#mw-content-text > div > table.sosTable.disableTooltip > tbody > tr:nth-child(2) > td > div > div.sosPerk.sosPerk${i} > div.sosPerkDesc.sosPerkDesc${i} > div.sosPerkOwner`).text().trim();
            perks.push({ perkName, characterName });
        }

        // Extract expiration date (if available)
        const expirationDate = $('#mw-content-text > div > table.sosTable.disableTooltip > tbody > tr:nth-child(4) > th').text().trim();

        // Return the scraped data as JSON
        res.status(200).json({ perks, expirationDate });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
}
