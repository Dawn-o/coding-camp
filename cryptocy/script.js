// Format functions
function formatPrice(num) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

function formatLargeNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toFixed(2);
}

function formatPercentage(num) {
    return num.toFixed(2) + '%';
}

function updateGlobalStats() {
    const globalElements = {
        marketCap: document.getElementById('global-mcap'),
        marketCapChange: document.getElementById('global-mcap-change'),
        volume: document.getElementById('global-volume'),
        btcDominance: document.getElementById('btc-dominance')
    };

    const settings = {
        async: true,
        crossDomain: true,
        url: "https://api.coingecko.com/api/v3/global",
        method: "GET",
        headers: {}
    };

    // Set loading state
    Object.values(globalElements).forEach(el => {
        if (el) el.innerHTML = "Loading...";
    });

    $.ajax(settings)
        .done(function (response) {
            const data = response.data;

            if (globalElements.marketCap) {
                globalElements.marketCap.innerHTML = '$' + formatLargeNumber(data.total_market_cap.usd);
            }
            if (globalElements.marketCapChange) {
                const change = formatPercentage(data.market_cap_change_percentage_24h_usd);
                globalElements.marketCapChange.innerHTML = change;
                globalElements.marketCapChange.classList.remove('positive', 'negative');
                globalElements.marketCapChange.classList.add(data.market_cap_change_percentage_24h_usd > 0 ? 'positive' : 'negative');
            }
            if (globalElements.volume) {
                globalElements.volume.innerHTML = '$' + formatLargeNumber(data.total_volume.usd);
            }
            if (globalElements.btcDominance) {
                globalElements.btcDominance.innerHTML = formatPercentage(data.market_cap_percentage.btc);
            }
        })
        .fail(function (error) {
            console.error("Failed to fetch global stats:", error);
            Object.values(globalElements).forEach(el => {
                if (el) el.innerHTML = "Error";
            });
        });
}

function updatePrices() {
    const coinElements = {
        bitcoin: {
            price: document.querySelectorAll('[id^="bitcoin"]'),
            change: document.querySelector('[data-coin="bitcoin-change"]'),
            mcap: document.querySelector('[data-coin="bitcoin-mcap"]')
        },
        ethereum: {
            price: document.querySelectorAll('[id^="ethereum"]'),
            change: document.querySelector('[data-coin="ethereum-change"]'),
            mcap: document.querySelector('[data-coin="ethereum-mcap"]')
        },
        dogecoin: {
            price: document.querySelectorAll('[id^="dogecoin"]'),
            change: document.querySelector('[data-coin="dogecoin-change"]'),
            mcap: document.querySelector('[data-coin="dogecoin-mcap"]')
        }
    };

    const settings = {
        async: true,
        crossDomain: true,
        url: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cdogecoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true",
        method: "GET",
        headers: {}
    };

    // Set loading state
    Object.values(coinElements).forEach(elements => {
        elements.price.forEach(el => el.innerHTML = "Loading...");
        if (elements.change) elements.change.innerHTML = "Loading...";
        if (elements.mcap) elements.mcap.innerHTML = "Loading...";
    });

    $.ajax(settings)
        .done(function (response) {
            Object.entries(coinElements).forEach(([coin, elements]) => {
                const data = response[coin];
                const price = formatPrice(data.usd);
                const change = formatPercentage(data.usd_24h_change);
                const mcap = formatLargeNumber(data.usd_market_cap);

                // Update price
                elements.price.forEach(el => el.innerHTML = price);

                // Update 24h change
                if (elements.change) {
                    elements.change.innerHTML = change;
                    elements.change.classList.remove('positive', 'negative');
                    elements.change.classList.add(data.usd_24h_change > 0 ? 'positive' : 'negative');
                }

                // Update market cap
                if (elements.mcap) {
                    elements.mcap.innerHTML = mcap;
                }
            });
        })
        .fail(function (error) {
            console.error("Failed to fetch prices:", error);
            Object.values(coinElements).forEach(elements => {
                elements.price.forEach(el => el.innerHTML = "Error");
                if (elements.change) elements.change.innerHTML = "Error";
                if (elements.mcap) elements.mcap.innerHTML = "Error";
            });
        });
}

updatePrices();
updateGlobalStats();

// CODE FOR MOBILE NAVIGATION
document.querySelector('.hamburger').addEventListener('click', function () {
    this.classList.toggle('active');
    document.querySelector('.mobile-nav').classList.toggle('active');
    document.querySelector('.overlay').classList.toggle('active');
});

document.querySelector('.overlay').addEventListener('click', function () {
    document.querySelector('.hamburger').classList.remove('active');
    document.querySelector('.mobile-nav').classList.remove('active');
    this.classList.remove('active');
});

window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        document.querySelector('.hamburger').classList.remove('active');
        document.querySelector('.mobile-nav').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
    }
});

// CODE FOR MOBILE NAVIGATION LINKS TO CLOSE NAVIGATION ON CLICK
document.querySelectorAll('.mobile-nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.hamburger').classList.remove('active');
        document.querySelector('.mobile-nav').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
    });
});

document.querySelectorAll('.mobile-nav h2 a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.hamburger').classList.remove('active');
        document.querySelector('.mobile-nav').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
    });
});