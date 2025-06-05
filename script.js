document.addEventListener("DOMContentLoaded", function () { // Wait for the DOM to be fully loaded before running the script
    const auctionContainer = document.getElementById("auction-container"); // Container for auction cards
    const refreshButton = document.getElementById("refresh-button"); // Button to manually refresh auctions
    const exportButton = document.getElementById("export-button"); // Button to export auction data
    const addAuctionButton = document.getElementById("add-auction-button"); // Button to add a new auction

    // Map of keywords to image file paths
    const imageMap = {
        accordion: "inventory/accordion.webp",
        drum: "inventory/drum.webp",
        fiddle: "inventory/fiddle.webp",
        flute: "inventory/flute.webp",
        guitar: "inventory/guitar.webp",
        harmonica: "inventory/harmonica.webp",
        trumpet: "inventory/trumpet.webp",
        ticket: "inventory/ticket.webp",
        axegonne: "inventory/axegonne.webp",
        "guycot carbine": "inventory/guycot-carbine.webp",
        "guycot pistol": "inventory/guycot-pistol.webp",
        jezail: "inventory/jezail.webp",
        kukri: "inventory/kukri.webp",
        lancaster: "inventory/lancaster.webp",
        paterson: "inventory/paterson.webp",
        prototype: "inventory/prototype.webp",
        spitefire: "inventory/spitefire.webp",
    };

    // Map of keywords to wiki links
    const linkMap = {
        accordion: "https://thewild-west.fandom.com/wiki/Accordion",
        drum: "https://thewild-west.fandom.com/wiki/Drum",
        fiddle: "https://thewild-west.fandom.com/wiki/Fiddle",
        flute: "https://thewild-west.fandom.com/wiki/Flute",
        guitar: "https://thewild-west.fandom.com/wiki/Guitar",
        harmonica: "https://thewild-west.fandom.com/wiki/Harmonica",
        trumpet: "https://thewild-west.fandom.com/wiki/Trumpet",
        ticket: "https://thewild-west.fandom.com/wiki/Trade_Ticket",
        axegonne: "https://thewild-west.fandom.com/wiki/Admiral%27s_Axegonne",
        "guycot carbine": "https://thewild-west.fandom.com/wiki/Guycot_Chain_Carbine",
        "guycot pistol": "https://thewild-west.fandom.com/wiki/Guycot_Chain_Pistol",
        jezail: "https://thewild-west.fandom.com/wiki/Jezail_Musket",
        kukri: "https://thewild-west.fandom.com/wiki/Kukri_Machete",
        lancaster: "https://thewild-west.fandom.com/wiki/Lancaster_Pistol",
        paterson: "https://thewild-west.fandom.com/wiki/Paterson_Navy",
        prototype: "https://thewild-west.fandom.com/wiki/Schwarzlose_Prototype_Pistol",
        spitefire: "https://thewild-west.fandom.com/wiki/Spitfire_Revolving_Sniper",
    };

    // List of weapon keywords
    const weaponList = [
        "axegonne",
        "guycot carbine",
        "guycot pistol",
        "jezail",
        "kukri",
        "lancaster",
        "paterson",
        "prototype",
        "spitefire"
    ];

    // Sorted keywords for best match (longest first)
    const sortedKeywords = Object.keys(imageMap).sort((a, b) => b.length - a.length);

    // Map of keywords to card background colors
    const colorMap = {
        accordion: "#ffb300",      // Amber
        drum: "#e57373",           // Red
        fiddle: "#81c784",         // Green
        flute: "#64b5f6",          // Blue
        guitar: "#f06292",         // Pink
        harmonica: "#ba68c8",      // Purple
        trumpet: "#ffd54f",        // Yellow
        ticket: "#90a4ae",         // Grey
        axegonne: "#8d6e63",       // Brown
        "guycot carbine": "#4fc3f7", // Light Blue
        "guycot pistol": "#a1887f",  // Taupe
        jezail: "#dce775",         // Lime
        kukri: "#ff8a65",          // Orange
        lancaster: "#a5d6a7",      // Light Green
        paterson: "#ce93d8",       // Lavender
        prototype: "#b0bec5",      // Blue Grey
        spitefire: "#f44336",      // Bright Red
    };

    // Keep track of which keywords have already been notified for the current auction data
    let notifiedKeywords = new Set();

    // Fetch and update auction data
    async function updateAuctionData() {
        try {
            const response = await fetch("auction_data.txt"); // Fetch auction data file
            const data = await response.text(); // Read as text
            const auctions = data.split("---").filter((block) => block.trim() !== ""); // Split into auction blocks

            // --- Notification logic start ---
            // Load user keywords from localStorage
            let userKeywords = [];
            try {
                userKeywords = JSON.parse(localStorage.getItem('auction_keywords') || '[]')
                    .map(k => k.trim().toLowerCase())
                    .filter(k => k.length > 0);
            } catch (e) {
                userKeywords = [];
            }
            // --- Notification logic end ---

            // Build HTML for each auction card
            auctionContainer.innerHTML = auctions
                .map((auction) => {
                    const auctionLines = auction.split("\n"); // Split block into lines

                    let itemTitle = ""; // Store the item title
                    let matchedKeyword = null; // Store matched keyword
                    let titleIndex = -1; // Index of the title line

                    // Find the first non-empty line as the title
                    for (let i = 0; i < auctionLines.length; i++) {
                        const trimmedLine = auctionLines[i].trim();
                        if (trimmedLine !== "") {
                            itemTitle = trimmedLine.toLowerCase();
                            titleIndex = i;
                            break;
                        }
                    }

                    // --- Notification logic: check for keyword match ---
                    if (itemTitle && userKeywords.length > 0 && window.Notification) {
                        for (const keyword of userKeywords) {
                            if (
                                itemTitle.includes(keyword) &&
                                Notification.permission === "granted" &&
                                !notifiedKeywords.has(keyword)
                            ) {
                                new Notification("Auction Match!", {
                                    body: `An auction for "${keyword}" is now available!`
                                });
                                notifiedKeywords.add(keyword);
                            }
                        }
                    } // <-- THIS BRACE WAS MISSING OR MISPLACED
                    // --- End notification logic ---

                    // Find image and keyword match
                    let imageSrc = "default.png"; // Default image
                    if (itemTitle) {
                        for (const keyword of sortedKeywords) {
                            if (itemTitle.includes(keyword)) {
                                imageSrc = imageMap[keyword];
                                matchedKeyword = keyword;
                                break;
                            }
                        }
                    }

                    let cardColor = colorMap[matchedKeyword] || "#313f92"; // Card color

                    // Build image tag, possibly wrapped in a link
                    let imageTag = `<img src="${imageSrc}" alt="${itemTitle || "Auction Item"}" style="max-width: 100px; float: right; padding: 5px;">`;
                    if (matchedKeyword && linkMap[matchedKeyword]) {
                        imageTag = `<a href="${linkMap[matchedKeyword]}" target="_blank" class="auction-image-link">${imageTag}</a>`;
                    }

                    // Extract and remove the title line for separate placement
                    let titleHtml = "";
                    if (titleIndex !== -1) {
                        // Split the title into text and serial (assume serial is last word starting with #)
                        const rawTitle = auctionLines[titleIndex].trim();
                        const serialMatch = rawTitle.match(/(.*?)(\s+#\S+)$/);
                        if (serialMatch) {
                            // serialMatch[1]: title text, serialMatch[2]: serial (with #)
                            titleHtml = `${serialMatch[1]} <b><span style="font-size:1.3em;">${serialMatch[2].trim()}</span></b><hr style="margin:6px 0;">`;
                        } else {
                            // fallback: no serial found, just use as normal
                            titleHtml = `${rawTitle}<hr style="margin:6px 0;">`;
                        }
                        auctionLines.splice(titleIndex, 1); // Remove the title line from auctionLines
                    }

                    // --- Detect user keywords in this auction for chips ---
                    let detectedKeywords = [];
                    if (itemTitle && userKeywords.length > 0) {
                        detectedKeywords = userKeywords.filter(kw => itemTitle.includes(kw));
                    }

                    // Only make the info part (numbers/values) larger
                    const infoRegex = /(:\s*)([\d\w\$\.,#\- ]+)/g; // Regex to match info after colon
                    const displayContent = auctionLines
                        .map(line =>
                            line.replace(infoRegex, (match, p1, p2) => `${p1}<span style="font-size:1.3em;">${p2}</span>`)
                        )
                        .join("<br>"); // Join lines for display

                    // Build chips HTML
                    let chipsHtml = "";
                    if (detectedKeywords.length > 0) {
                        chipsHtml = detectedKeywords.map(keyword => `
                            <span class="mdl-chip mdl-chip--deletable" style="margin: 0 4px 0 0;">
                                <span class="mdl-chip__text">${keyword}</span>
                                <button type="button" class="mdl-chip__action" data-keyword="${keyword}">
                                    <i class="material-icons">cancel</i>
                                </button>
                            </span>
                        `).join("");
                    }

                    // Clipboard button for this card
                    const clipboardBtn = `
                        <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored auction-card-copy-btn"
                                title="Copy Auction"
                                data-auction="${auction.replace(/"/g, '&quot;').replace(/'/g, '&#39;')}">
                            <i class="material-icons">content_copy</i>
                        </button>
                    `;

                    // Info button for this card (top left)
                    const infoBtn = `
                        <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored auction-card-info-btn"
                                title="Info"
                                style="position:absolute;top:8px;left:8px;z-index:2;">
                            <i class="material-icons">info</i>
                        </button>
                    `;

                    // Return the HTML for this auction card
                    return `
                        <div class="mdl-card mdl-shadow--2dp" style="background-color: ${cardColor}; position:relative;">
                            ${infoBtn}
                            <div class="mdl-card__title mdl-card--expand page-content" style="background: transparent; display: flex; flex-direction: column; min-height: 220px;">
                                <div style="position:absolute;top:8px;right:8px;z-index:2;">
                                    ${clipboardBtn}
                                </div>
                                ${titleHtml}
                                <div style="flex:1 0 auto;">
                                    ${imageTag}
                                </div>
                                <div style="margin-top: 10px; text-align: center;">
                                    <div style="display: inline-block; vertical-align: top; text-align: center;">
                                        ${displayContent}
                                    </div>
                                </div>
                            </div>
                            <!-- Chips section at the bottom -->
                            <div class="auction-chips" style="
                                width: 100%;
                                background: rgba(255,255,255,0.18);
                                border-top: 2px solid #fff3;
                                padding: 8px 12px 8px 12px;
                                display: flex;
                                flex-wrap: wrap;
                                justify-content: flex-start;
                                align-items: center;
                                min-height: 40px;
                                box-sizing: border-box;
                                border-radius: 0 0 4px 4px;
                                ">
                                ${chipsHtml}
                            </div>
                        </div>
                    `;
                })
                .join(""); // Join all auction cards

            // Add chip delete handlers
            document.querySelectorAll('.mdl-chip__action[data-keyword]').forEach(btn => {
                btn.addEventListener('click', function() {
                    const keyword = this.getAttribute('data-keyword');
                    let keywords = JSON.parse(localStorage.getItem('auction_keywords') || '[]');
                    keywords = keywords.filter(k => k.trim().toLowerCase() !== keyword);
                    localStorage.setItem('auction_keywords', JSON.stringify(keywords));
                    // Optionally show snackbar if available
                    if (typeof showSnackbar === 'function') showSnackbar('Keyword removed: ' + keyword);
                    updateAuctionData();
                });
            });

            // Clipboard copy handlers for each card
            document.querySelectorAll('.auction-card-copy-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const data = this.getAttribute('data-auction');
                    if (data) {
                        navigator.clipboard.writeText(data)
                            .then(() => typeof showSnackbar === 'function' && showSnackbar("Auction copied to clipboard!"))
                            .catch(() => typeof showSnackbar === 'function' && showSnackbar("Failed to copy auction."));
                    }
                });
            });

            // Snackbar on info button click
            document.querySelectorAll('.auction-card-info-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    if (typeof showSnackbar === 'function') showSnackbar("Coming Soon!");
                });
            });

            // Snackbar on image link click
            document.querySelectorAll('.auction-image-link').forEach(link => {
                link.addEventListener('click', function () {
                    if (typeof showSnackbar === 'function') showSnackbar("Wiki page opened!");
                });
            });

            // Reset notifiedKeywords if auctions have changed (optional: can be improved)
            // This ensures notifications can be sent again if auctions are refreshed/changed
            notifiedKeywords = new Set();

            console.log("Auction data updated dynamically!"); // Log update
        } catch (error) {
            console.error("Error loading auction data:", error); // Log errors
        }
    }

    // Export auction data as a file
    function exportAuctionData() {
        fetch("auction_data.txt") // Fetch auction data file
            .then((response) => response.text()) // Read as text
            .then((data) => {
                const blob = new Blob([data], { type: "text/plain" }); // Create a Blob
                const a = document.createElement("a"); // Create anchor
                a.href = URL.createObjectURL(blob); // Set href to Blob URL
                a.download = "auction_data.txt"; // Set download filename
                document.body.appendChild(a); // Add anchor to document
                a.click(); // Trigger download
                document.body.removeChild(a); // Remove anchor
                console.log("Auction data exported successfully!"); // Log export
            })
            .catch((error) => console.error("Error exporting auction data:", error)); // Log errors
    }

    updateAuctionData(); // Initial load of auction data

    // Refresh button triggers manual update
    if (refreshButton) {
        refreshButton.addEventListener("click", () => {
            console.log("Manual auction refresh triggered!"); // Log refresh
            updateAuctionData(); // Update auction data
            if (typeof showSnackbar === 'function') showSnackbar("Auction refreshed!");
        });
    }

    // Export button saves auction data file
    if (exportButton) {
        exportButton.addEventListener("click", () => {
            console.log("Exporting auction data..."); // Log export
            exportAuctionData(); // Export auction data
        });
    }

    // Add Auction button redirects to a chosen website
    if (addAuctionButton) {
        addAuctionButton.addEventListener("click", () => {
            window.location.href = "http://127.0.0.1:3000/past.html"; // Redirect to add auction page
            console.log("Redirecting to add auction page..."); // Log redirect
        });
    }

    // --- Discord menu item logic ---
    getHelpMenuItemByText('Discord').addEventListener('click', () => {
        window.open('https://discord.gg/ynwTEHrmdx', '_blank');
        if (typeof showSnackbar === 'function') showSnackbar("Discord link opened!");
    });

    setInterval(updateAuctionData, 10000); // Automatic updates every 10 seconds
});
