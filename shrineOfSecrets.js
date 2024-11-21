import axios from "axios";
import * as cheerio from "cheerio";

let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://deadbydaylight.fandom.com/wiki/Shrine_of_Secrets',
    headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'cookie': 'wikia_beacon_id=J-5Arw7FQi; _b2=D4re7WeZF1.1730109822380; exp_bucket=76; exp_bucket_2=v2-97; Geo={%22region%22:%22SH%22%2C%22city%22:%22al mamzar%22%2C%22country_name%22:%22united arab emirates%22%2C%22country%22:%22AE%22%2C%22continent%22:%22AS%22}; Geo=OK; fan_visited_wikis=2294132; fandom_mwuser-sessionId=3ab71142426aa8b9879c; eb=48; sessionId=2ec678d2-312a-484e-af20-47f6bfa25348; wikia_session_id=se-4oSdAHk; pvNumber=1; pvNumberGlobal=1; tracking_session_id=2ec678d2-312a-484e-af20-47f6bfa25348; pv_number_global=1; pv_number=1; AMP_MKTG_6765a55f49=JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy5nb29nbGUuY29tJTJGJTIyJTJDJTIycmVmZXJyaW5nX2RvbWFpbiUyMiUzQSUyMnd3dy5nb29nbGUuY29tJTIyJTdE; AMP_6765a55f49=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjJjZThiZWM0My0yMDI3LTRlNGMtYmY1ZS0yNDQxOTU3ODQ4MjIlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzMwMTA5ODI1MTQ5JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTczMDEwOTgyNTE4OSUyQyUyMmxhc3RFdmVudElkJTIyJTNBMyUyQyUyMnBhZ2VDb3VudGVyJTIyJTNBMCU3RA==; active_cms_notification=446',
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

(async () => {
    try {
        const response = await axios.request(config);
        const $ = cheerio.load(response.data);

        let perks = [];

        // Generalized perk extraction
        const perkCount = 4; //Adjust this based on the number of perks

        for (let i = 1; i <= perkCount; i++) {
            const perkName = $(`#mw-content-text > div > table.sosTable.disableTooltip > tbody > tr:nth-child(2) > td > div > div.sosPerk.sosPerk${i} > div.sosPerkDesc.sosPerkDesc${i} > div.sosPerkDescName`).text().trim();
            const characterName = $(`#mw-content-text > div > table.sosTable.disableTooltip > tbody > tr:nth-child(2) > td > div > div.sosPerk.sosPerk${i} > div.sosPerkDesc.sosPerkDesc${i} > div.sosPerkOwner`).text().trim(); // Adjusted for perk owner
            
            perks.push({ perkName, characterName });
        }

        //Extract expiration date if available
        const expirationDate = $('#mw-content-text > div > table.sosTable.disableTooltip > tbody > tr:nth-child(4) > th').text().trim(); // Adjust as necessary

        console.log('Weekly Perks:');
        perks.forEach(perk => {
            console.log(`- { \x1b[34mPerk:\x1b[0m "\x1b[32m${perk.perkName}\x1b[0m", \x1b[34mCharacter:\x1b[0m "\x1b[32m${perk.characterName}\x1b[0m" }`);
        });
        console.log('Expiration Date:', expirationDate);
    } catch (error) {
        console.error('Error occurred:', error);
    }
})();