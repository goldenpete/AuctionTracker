document.addEventListener("DOMContentLoaded", function () {
    fetch("auction_data.txt")
        .then(response => response.text())
        .then(data => {
            const auctionContainer = document.getElementById("auction-container");

            const imageMap = {
                "accordion": "inventory/accordion.png",
                "drum": "inventory/drum.png",
                "fiddle": "inventory/fiddle.png",
                "flute": "inventory/flute.png",
                "guitar": "inventory/guitar.png",
                "harmonica": "inventory/harmonica.png",
                "trumpet": "inventory/trumpet.png",
                "ticket": "inventory/ticket.png",
                "axegonne": "inventory/axegonne.png",
                "guycot carbine": "inventory/guycot-carbine.png",
                "guycot pistol": "inventory/guycot-pistol.png",
                "jezail": "inventory/jezail.png",
                "kukri": "inventory/kukri.png", // Ensure this path is correct if it works
                "lancaster": "inventory/lancaster.png",
                "paterson": "inventory/paterson.png",
                "prototype": "inventory/prototype.png",
                "spitefire": "inventory/spitefire.png"
            };

            // Sort keywords by length (descending) to prioritize more specific matches
            const sortedKeywords = Object.keys(imageMap).sort((a, b) => b.length - a.length);

            const auctions = data.split("---").filter(block => block.trim() !== "");

            auctionContainer.innerHTML = auctions.map(auction => {
                const auctionLines = auction.split("\n");

                // --- MODIFICATION START ---
                // Find the first non-empty line to use as the item title
                let itemTitle = "";
                for (const line of auctionLines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine !== "") {
                        itemTitle = trimmedLine.toLowerCase();
                        break; // Found the first non-empty line, use it as title
                    }
                }
                // If all lines in the block were empty, itemTitle will remain ""
                // --- MODIFICATION END ---

                console.log(`Checking item: ${itemTitle}`);

                let imageSrc = "default.png"; // Default image if no match

                // Only attempt to find a keyword if itemTitle is not empty
                if (itemTitle) {
                    for (const keyword of sortedKeywords) {
                        if (itemTitle.includes(keyword)) {
                            imageSrc = imageMap[keyword];
                            console.log(`Match found for '${itemTitle}': ${keyword} → ${imageSrc}`);
                            break;
                        }
                    }
                }

                console.log(`Final assigned image for '${itemTitle}': ${imageSrc}`);

                // Construct the rest of the auction item's display content
                // by joining all original lines, or filter out empty leading lines if desired.
                // For simplicity, joining all lines as before:
                const displayContent = auctionLines.join("<br>");

                return `
                    <div class="mdl-card mdl-shadow--2dp">
                        <div class.mdl-card__title mdl-card--expand page-content">
                            <img src="${imageSrc}" alt="${itemTitle || 'Auction Item'}" style="max-width: 100px; float: right; padding: 5px;">
                            ${displayContent}
                        </div>
                    </div>
                `;
            }).join("");
        })
        .catch(error => console.error("Error loading auction data:", error));
});
