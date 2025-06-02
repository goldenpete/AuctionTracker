const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    while (true) {
        console.log("Fetching auction data...");

        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: "./puppeteer-profile", // Saves session data (cookies, login state)
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        await page.goto("https://discord.com/login");

        // Wait for Discord to fully load before proceeding
        await new Promise(resolve => setTimeout(resolve, 30000));

        await page.goto("https://discord.com/channels/1368432887145431112/1375265203855294535");

        await new Promise(resolve => setTimeout(resolve, 30000));

        // Extract multiple auction items and format them correctly
        const auctionData = await page.evaluate(() => {
            const auctionElements = document.querySelectorAll("article.embedWrapper_b7e1cb div.embedField__623de");
            return Array.from(auctionElements).map(el => el.innerText).join("\n---\n");
        });

        if (auctionData) {
            console.log("Auction Data Found:");
            console.log(auctionData);
            fs.writeFileSync("auction_data.txt", auctionData);
        } else {
            console.log("No auction data found. Retrying in 30 seconds...");
        }

        await browser.close();
        console.log("Next update in 5 minutes...");
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
    }
})();
