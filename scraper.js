const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    while (true) {
        console.log("Fetching auction data...");

        const browser = await puppeteer.launch({ headless: false }); // UI Mode
        const page = await browser.newPage();
        
        await page.goto("https://discord.com/login");
        console.log("Log in manually...");
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for login

        await page.goto("https://discord.com/channels/YOUR_SERVER_ID/YOUR_CHANNEL_ID");
        await page.waitForTimeout(5000);

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
