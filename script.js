document.addEventListener("DOMContentLoaded", function () {
    const auctionContainer = document.getElementById("auction-container");
    const refreshButton = document.getElementById("refresh-button");
    const exportButton = document.getElementById("export-button");
    const addAuctionButton = document.getElementById("add-auction-button");

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
                        <div class.mdl-card__title mdl-card--expand page-content">
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

    function exportAuctionData() {
        fetch("auction_data.txt")
            .then(response => response.text())
            .then(data => {
                const blob = new Blob([data], { type: "text/plain" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "auction_data.txt";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                console.log("Auction data exported successfully!");
            })
            .catch(error => console.error("Error exporting auction data:", error));
    }

    // Initial load
    updateAuctionData();

    // Refresh button triggers manual update
    if (refreshButton) {
        refreshButton.addEventListener("click", () => {
            console.log("Manual auction refresh triggered!");
            updateAuctionData();
        });
    }

    // Export button saves auction data file
    if (exportButton) {
        exportButton.addEventListener("click", () => {
            console.log("Exporting auction data...");
            exportAuctionData();
        });
    }

    // Add Auction button redirects to a chosen website
    if (addAuctionButton) {
        addAuctionButton.addEventListener("click", () => {
            window.location.href = "https://yourwebsite.com"; // Change this to the desired auction site
            console.log("Redirecting to add auction page...");
        });
    }

    // Automatic updates every 10 seconds
    setInterval(updateAuctionData, 10000);
});
