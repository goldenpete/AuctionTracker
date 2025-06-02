document.addEventListener("DOMContentLoaded", function () {
    const auctionContainer = document.getElementById("auction-container");

    const imageMap = {
        "accordion": "inventory/accordion.webp",
        "drum": "inventory/drum.webp",
        "fiddle": "inventory/fiddle.webp",
        "flute": "inventory/flute.webp",
        "guitar": "inventory/guitar.webp",
        "harmonica": "inventory/harmonica.webp",
        "trumpet": "inventory/trumpet.webp",
        "ticket": "inventory/ticket.webp",
        "axegonne": "inventory/axegonne.webp",
        "guycot carbine": "inventory/guycot-carbine.webp",
        "guycot pistol": "inventory/guycot-pistol.webp",
        "jezail": "inventory/jezail.webp",
        "kukri": "inventory/kukri.webp",
        "lancaster": "inventory/lancaster.webp",
        "paterson": "inventory/paterson.webp",
        "prototype": "inventory/prototype.webp",
        "spitefire": "inventory/spitefire.webp"
    };

    const sortedKeywords = Object.keys(imageMap).sort((a, b) => b.length - a.length);

    async function updateAuctionData() {
        try {
            const response = await fetch("auction_data.txt");
            const data = await response.text();
            const auctions = data.split("---").filter(block => block.trim() !== "");

            auctionContainer.innerHTML = auctions.map(auction => {
                const auctionLines = auction.split("\n");

                let itemTitle = "";
                for (const line of auctionLines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine !== "") {
                        itemTitle = trimmedLine.toLowerCase();
                        break;
                    }
                }

                let imageSrc = "default.png";

                if (itemTitle) {
                    for (const keyword of sortedKeywords) {
                        if (itemTitle.includes(keyword)) {
                            imageSrc = imageMap[keyword];
                            break;
                        }
                    }
                }

                const displayContent = auctionLines.join("<br>");

                return `
                    <div class="mdl-card mdl-shadow--2dp">
                        <div class="mdl-card__title mdl-card--expand page-content">
                            <img src="${imageSrc}" alt="${itemTitle || 'Auction Item'}" style="max-width: 100px; float: right; padding: 5px;">
                            ${displayContent}
                        </div>
                    </div>
                `;
            }).join("");

            console.log("Auction data updated dynamically!");
        } catch (error) {
            console.error("Error loading auction data:", error);
        }
    }

    // Initial load
    updateAuctionData();

    // **Update auction data every 10 seconds (10,000 ms)**
    setInterval(updateAuctionData, 10000);
});
