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
        
        // Wait 30 seconds to ensure full page load
        await new Promise(resolve => setTimeout(resolve, 30000));

        await page.goto("https://discord.com/channels/YOUR_SERVER_ID/YOUR_CHANNEL_ID");

        // Wait 30 seconds to ensure auction messages are fully loaded
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Extract auction data using the correct query selector
        const auctionData = await page.evaluate(() => {
            return document.querySelector(".embedWrapper .embedFull")?.innerText;
        });

        if (auctionData) {
            console.log("Auction Data Found:", auctionData);
            fs.writeFileSync("auction_data.txt", auctionData);
        } else {
            console.log("No auction data found. Retrying in 30 seconds...");
        }

        await browser.close();
        console.log("Next update in 5 minutes...");
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // Wait 5 minutes
    }
})();
