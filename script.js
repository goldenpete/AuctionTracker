document.addEventListener("DOMContentLoaded", function () {
    fetch("auction_data.txt")
        .then(response => response.text())
        .then(data => {
            const auctionContainer = document.getElementById("auction-container");

            const lines = data.split("\n").slice(1); // Remove title
            auctionContainer.innerHTML = lines.map(line => {
                const match = line.match(/(.+?) (.+?) #(\d+)\nCurrent Bid: \$(\d+)\nCurrent Bidder: (.+)\nEnds: (.+)/);
                if (!match) return "";

                return `
                <div class="mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title mdl-card--expand page-content">
                        <h2 class="mdl-card__title-text">${match[2]}</h2>
                    </div>
                    <div class="mdl-card__supporting-text page-content">Current Bid: $${match[4]}</div>
                    <div class="mdl-card__supporting-text page-content">Serial: #${match[3]}</div>
                    <div class="mdl-card__supporting-text page-content">Time left: ${match[6]}</div>
                </div>
                `;
            }).join("");
        })
        .catch(error => console.error("Error loading auction data:", error));
});
