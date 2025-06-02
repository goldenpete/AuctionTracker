const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    while (true) {
        console.log("Fetching auction data...");

        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        await page.goto("https://discord.com/login");
        console.log("Log in manually...");
        
        // Wait 3 minutes to ensure full page load
        await new Promise(resolve => setTimeout(resolve, 180000));

        await page.goto("https://discord.com/channels/1368432887145431112/1375265203855294535");
        await new Promise(resolve => setTimeout(resolve, 180000)); // Again, wait 3 min to ensure full load

        const auctionData = await page.evaluate(() => {
            return document.querySelector(".message")?.innerText;
        });

        console.log("Auction Data:", auctionData);
        fs.writeFileSync("auction_data.txt", auctionData);

        await browser.close();
        console.log("Next update in 5 minutes...");
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // Wait 5 minutes
    }
})();
