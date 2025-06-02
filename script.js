document.addEventListener("DOMContentLoaded", function () {
    fetch("auction_data.txt")
        .then(response => response.text())
        .then(data => {
            const auctionContainer = document.getElementById("auction-container");

            // Split auctions using "---" separator
            const auctions = data.split("---").filter(line => line.trim() !== "");

            auctionContainer.innerHTML = auctions.map(auction => `
                <div class="mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title mdl-card--expand page-content">
                        <h2 class="mdl-card__title-text">${auction}</h2>
                    </div>
                </div>
            `).join("");
        })
        .catch(error => console.error("Error loading auction data:", error));
});
