document.addEventListener("DOMContentLoaded", function () {
    fetch("auction_data.txt")
        .then(response => response.text())
        .then(data => {
            const auctionContainer = document.getElementById("auction-container");

            // Define keyword-to-image mapping
            const imageMap = {
                "accordion": "inventory/instruments/accordion.webp",
                "drum": "inventory/instruments/drum.webp",
                "fiddle": "inventory/instruments/fiddle.webp",
                "flute": "inventory/instruments/flute.webp",
                "guitar": "inventory/instruments/guitar.webp",
                "harmonica": "inventory/instruments/harmonica.webp",
                "trumpet": "inventory/instruments/trumpet.webp",
                "ticket": "inventory/items/ticket.png",
                "axegonne": "inventory/weapons/axegonne.webp",
                "guycot carbine": "inventory/weapons/guycot-carbine.webp",
                "guycot pistol": "inventory/weapons/guycot-pistol.webp",
                "jezail": "inventory/weapons/jezail.png",
                "kukri": "inventory/weapons/kukri.png",
                "lancaster": "inventory/weapons/lancaster.webp",
                "paterson": "inventory/weapons/paterson.webp",
                "prototype": "inventory/weapons/prototype.webp",
                "spitefire": "inventory/weapons/spitefire.webp"
            };

            // Split auctions using "---" separator
            const auctions = data.split("---").filter(line => line.trim() !== "");

            auctionContainer.innerHTML = auctions.map(auction => {
                const auctionLines = auction.split("\n");

                // Extract item title (first line) and convert to lowercase
                const itemTitle = auctionLines[0].toLowerCase();

                // Find matching image
                let imageSrc = "default.png"; // Default image if no match
                Object.keys(imageMap).forEach(keyword => {
                    if (itemTitle.includes(keyword)) {
                        imageSrc = imageMap[keyword];
                    }
                });

                // Display auction details with matching image
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
