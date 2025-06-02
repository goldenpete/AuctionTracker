document.addEventListener("DOMContentLoaded", function () {
    fetch("auction_data.txt")
        .then(response => response.text())
        .then(data => {
            const auctionContainer = document.getElementById("auction-container");

            // Define keyword-to-image mapping
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
                "kukri": "inventory/kukri.png",
                "lancaster": "inventory/lancaster.png",
                "paterson": "inventory/paterson.png",
                "prototype": "inventory/prototype.png",
                "spitefire": "inventory/spitefire.png"
            };

            // Split auctions using "---" separator
            const auctions = data.split("---").filter(line => line.trim() !== "");

            auctionContainer.innerHTML = auctions.map(auction => {
                const auctionLines = auction.split("\n");

                // Ensure itemTitle is properly declared before use
                let itemTitle = auctionLines.length > 0 ? auctionLines[0].toLowerCase() : "";

                // Debugging: Log item title
                console.log(`Checking item: ${itemTitle}`);

                // Find the first matching image and stop checking after a match
                let imageSrc = "default.png"; // Default image if no match
                for (const keyword of Object.keys(imageMap)) {
                    if (itemTitle.includes(keyword)) {
                        imageSrc = imageMap[keyword]; 
                        console.log(`Match found: ${keyword} → ${imageSrc}`); // Log matched keyword and image
                        break; // Stops checking after first match
                    }
                }

                // Debugging: Log final assigned image
                console.log(`Final assigned image for '${itemTitle}': ${imageSrc}`);

                // Display auction details with matched image
                return `
                    <div class="mdl-card mdl-shadow--2dp">
                        <div class="mdl-card__title mdl-card--expand page-content">
                            <img src="${imageSrc}" alt="${itemTitle}" style="max-width: 100px; float: right; padding: 5px;">
                            ${auctionLines.join("<br>")}
                        </div>
                    </div>
                `;
            }).join("");
        })
        .catch(error => console.error("Error loading auction data:", error));
});
