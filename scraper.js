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

        const cookiesPath = "cookies.json";
        let cookies = [];

        // Load saved cookies if available
        if (fs.existsSync(cookiesPath)) {
            try {
                const fileData = fs.readFileSync(cookiesPath, "utf8").trim();
                cookies = fileData ? JSON.parse(fileData) : [];
                await page.setCookie(...cookies);
                console.log("Loaded saved login session.");
            } catch (error) {
                console.error("Error reading cookies.json, resetting file...");
                fs.writeFileSync(cookiesPath, JSON.stringify([]));
            }
        }

        await page.goto("https://discord.com/login");

        // Wait for Discord to fully load
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Save cookies after logging in
        const savedCookies = await page.cookies();
        fs.writeFileSync(cookiesPath, JSON.stringify(savedCookies));
        console.log("Cookies saved. You won't have to log in again.");

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
