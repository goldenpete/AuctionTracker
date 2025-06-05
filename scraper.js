const puppeteer = require("puppeteer"); // Import Puppeteer for browser automation
const fs = require("fs"); // Import Node.js file system module

(async () => { // Start an async IIFE (Immediately Invoked Function Expression)
    console.log("Starting browser..."); // Log browser startup

    // Launch a new browser instance with custom options
    const browser = await puppeteer.launch({
        headless: false, // Run browser in visible mode for manual login
        userDataDir: "./puppeteer-profile", // Use persistent user profile directory
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // Security-related launch arguments
    });

    const page = await browser.newPage(); // Open a new tab in the browser

    await page.goto("https://discord.com/login"); // Navigate to Discord login page

    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds for manual login

    while (true) { // Infinite loop to fetch auction data repeatedly
        console.log("Fetching auction data..."); // Log fetch attempt

        await page.goto("https://discord.com/channels/1368432887145431112/1375265203855294535"); // Go to Discord auction channel

        await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds for page to load

        // Extract auction data from the page
        const auctionData = await page.evaluate(() => {
            // Select all auction item elements inside Discord embeds
            const auctionElements = document.querySelectorAll("article.embedWrapper_b7e1cb div.embedField__623de");
            // Convert NodeList to array, extract text, and join with separator
            return Array.from(auctionElements)
                .map((el) => el.innerText)
                .join("\n---\n");
        });

        if (auctionData) { // If auction data was found
            console.log("Auction Data Found:"); // Log data found
            console.log(auctionData); // Print auction data to console
            fs.appendFileSync("past_auction_data.txt", auctionData + "\n---\n"); // Append to past data file
            fs.writeFileSync("auction_data.txt", auctionData); // Overwrite current data file
        } else { // If no auction data was found
            console.log("No auction data found. Retrying in 1 minute..."); // Log retry message
        }

        console.log("Next update in 1 minutes..."); // Log next update time
        await new Promise((resolve) => setTimeout(resolve, 60 * 1000)); // Wait 1 minute before next fetch
    }
})();
