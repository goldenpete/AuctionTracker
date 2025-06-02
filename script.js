document.addEventListener("DOMContentLoaded", function () {
    fetch("auction_data.txt")
        .then(response => response.text())
        .then(data => {
            const auctionContainer = document.getElementById("auction-container");

            // Define keyword-to-image mapping
            const imageMap = {
                "accordion": "inventory/instruments/accordion.png",
                "drum": "inventory/instruments/drum.png",
                "fiddle": "inventory/instruments/fiddle.png",
                "flute": "inventory/instruments/flute.png",
                "guitar": "inventory/instruments/guitar.png",
                "harmonica": "inventory/instruments/harmonica.png",
                "trumpet": "inventory/instruments/trumpet.png",
                "ticket": "inventory/items/ticket.png",
                "axegonne": "inventory/weapons/axegonne.png",
                "guycot carbine": "inventory/weapons/guycot-carbine.png",
                "guycot pistol": "inventory/weapons/guycot-pistol.png",
                "jezail": "inventory/weapons/jezail.png",
                "kukri": "inventory/weapons/kukri.png",
                "lancaster": "inventory/weapons/lancaster.png",
                "paterson": "inventory/weapons/paterson.png",
                "prototype": "inventory/weapons/prototype.png",
                "spitefire": "inventory/weapons/spitefire.png"
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
