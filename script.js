document.addEventListener("DOMContentLoaded", function () { // Wait for the DOM to be fully loaded before running the script
    const auctionContainer = document.getElementById("auction-container"); // Get the container element for auctions
    const refreshButton = document.getElementById("refresh-button"); // Get the refresh button element
    const exportButton = document.getElementById("export-button"); // Get the export button element
    const addAuctionButton = document.getElementById("add-auction-button"); // Get the add auction button element

    const imageMap = { // Map of keywords to image file paths
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

    // Map of keywords to links (customize as needed)
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

    const sortedKeywords = Object.keys(imageMap).sort((a, b) => b.length - a.length); // Sort keywords by length (longest first) for matching

    async function updateAuctionData() { // Function to fetch and update auction data
        try {
            const response = await fetch("auction_data.txt"); // Fetch the auction data file
            const data = await response.text(); // Read the response as text
            const auctions = data.split("---").filter((block) => block.trim() !== ""); // Split data into auction blocks

            auctionContainer.innerHTML = auctions // Set the inner HTML of the auction container
                .map((auction) => { // For each auction block
                    const auctionLines = auction.split("\n"); // Split auction block into lines

                    let itemTitle = ""; // Initialize item title
                    let matchedKeyword = null;
                    for (const line of auctionLines) { // Loop through lines to find the first non-empty line
                        const trimmedLine = line.trim(); // Trim whitespace from the line
                        if (trimmedLine !== "") { // If the line is not empty
                            itemTitle = trimmedLine.toLowerCase(); // Set item title to the lowercased line
                            break; // Stop after finding the first non-empty line
                        }
                    }

                    let imageSrc = "default.png"; // Default image if no match is found

                    if (itemTitle) { // If an item title was found
                        for (const keyword of sortedKeywords) { // Loop through sorted keywords
                            if (itemTitle.includes(keyword)) { // If the item title contains the keyword
                                imageSrc = imageMap[keyword]; // Set the image source to the mapped image
                                matchedKeyword = keyword;
                                break; // Stop after the first match
                            }
                        }
                    }

                    let imageTag = `<img src="${imageSrc}" alt="${itemTitle || "Auction Item"}" style="max-width: 100px; float: right; padding: 5px;">`;
                    // If a link exists for this keyword, wrap the image in an anchor
                    if (matchedKeyword && linkMap[matchedKeyword]) {
                        imageTag = `<a href="${linkMap[matchedKeyword]}" target="_blank">${imageTag}</a>`;
                    }

                    const displayContent = auctionLines.join("<br>"); // Join auction lines with line breaks for display

                    return `
                    <div class="mdl-card mdl-shadow--2dp">
                        <div class.mdl-card__title mdl-card--expand page-content">
                            ${imageTag}
                            ${displayContent}
                        </div>
                    </div>
                `; // Return the HTML for this auction block
                })
                .join(""); // Join all auction HTML blocks into a single string

            console.log("Auction data updated dynamically!"); // Log successful update
        } catch (error) {
            console.error("Error loading auction data:", error); // Log any errors
        }
    }

    function exportAuctionData() { // Function to export auction data as a file
        fetch("auction_data.txt") // Fetch the auction data file
            .then((response) => response.text()) // Read the response as text
            .then((data) => { // When data is received
                const blob = new Blob([data], { type: "text/plain" }); // Create a Blob from the data
                const a = document.createElement("a"); // Create a temporary anchor element
                a.href = URL.createObjectURL(blob); // Set the href to the Blob URL
                a.download = "auction_data.txt"; // Set the download filename
                document.body.appendChild(a); // Add the anchor to the document
                a.click(); // Trigger the download
                document.body.removeChild(a); // Remove the anchor from the document
                console.log("Auction data exported successfully!"); // Log successful export
            })
            .catch((error) => console.error("Error exporting auction data:", error)); // Log any errors
    }

    // Initial load
    updateAuctionData(); // Load auction data when the page loads

    // Refresh button triggers manual update
    if (refreshButton) { // If the refresh button exists
        refreshButton.addEventListener("click", () => { // Add click event listener
            console.log("Manual auction refresh triggered!"); // Log refresh
            updateAuctionData(); // Update auction data
        });
    }

    // Export button saves auction data file
    if (exportButton) { // If the export button exists
        exportButton.addEventListener("click", () => { // Add click event listener
            console.log("Exporting auction data..."); // Log export
            exportAuctionData(); // Export auction data
        });
    }

    // Add Auction button redirects to a chosen website
    if (addAuctionButton) { // If the add auction button exists
        addAuctionButton.addEventListener("click", () => { // Add click event listener
            window.location.href = "http://127.0.0.1:3000/past.html"; // Change this to the desired auction site
            console.log("Redirecting to add auction page..."); // Log redirect
        });
    }

    // Automatic updates every 10 seconds
    setInterval(updateAuctionData, 10000); // Set interval to update auction data every 10 seconds
});
