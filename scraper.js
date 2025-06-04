const puppeteer = require("puppeteer"); // Import the Puppeteer library for browser automation
const fs = require("fs"); // Import the Node.js file system module

(async () => { // Start an asynchronous immediately-invoked function expression (IIFE)
    console.log("Starting browser..."); // Log that the browser is starting
    const browser = await puppeteer.launch({ // Launch a new browser instance with options
        headless: false, // Run browser in non-headless mode (visible)
        userDataDir: "./puppeteer-profile", // Use a persistent user profile directory
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // Additional launch arguments for security
    });

    const page = await browser.newPage(); // Open a new page/tab in the browser

    // Navigate to Discord login first
    await page.goto("https://discord.com/login"); // Go to the Discord login page

    // Wait for Discord to fully load before proceeding
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds for manual login

    while (true) { // Start an infinite loop to repeatedly fetch auction data
        console.log("Fetching auction data..."); // Log fetching status
        await page.goto("https://discord.com/channels/1368432887145431112/1375265203855294535"); // Go to the Discord auction channel

        await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds for the page to load

        // Extract multiple auction items
        const auctionData = await page.evaluate(() => { // Run code in the page context to extract data
            const auctionElements = document.querySelectorAll("article.embedWrapper_b7e1cb div.embedField__623de"); // Select all auction item elements
            return Array.from(auctionElements) // Convert NodeList to array
                .map((el) => el.innerText) // Extract inner text from each element
                .join("\n---\n"); // Join auction items with separator
        });

        if (auctionData) { // If auction data was found
            console.log("Auction Data Found:"); // Log that data was found
            console.log(auctionData); // Print the auction data to the console
            fs.appendFileSync("past_auction_data.txt", auctionData + "\n---\n"); // Append to past data file
            fs.writeFileSync("auction_data.txt", auctionData); // Keep current data updated
        } else { // If no auction data was found
            console.log("No auction data found. Retrying in 1 minute..."); // Log retry message
        }

        console.log("Next update in 1 minutes..."); // Log next update timing
        await new Promise((resolve) => setTimeout(resolve, 60 * 1000)); // Wait 1 minute before next fetch
    }
})();
