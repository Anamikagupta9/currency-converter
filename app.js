document.addEventListener("DOMContentLoaded", function () {
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");
    const amountInput = document.getElementById("amount");
    const convertButton = document.querySelector("button");
    const exchangeRateDisplay = document.querySelector(".exchange-rate p");

    // Function to create an option element with flag and currency code
    function createCurrencyOption(code, country) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = code;
        option.dataset.country = country; // Store the country code as a data attribute
        return option;
    }

    // Populate the dropdowns with currency options
    for (let [code, country] of Object.entries(countryList)) {
        const optionFrom = createCurrencyOption(code, country);
        const optionTo = createCurrencyOption(code, country);

        fromCurrencySelect.appendChild(optionFrom);
        toCurrencySelect.appendChild(optionTo);
    }

    // Function to update the flag image based on selected currency
    function updateFlag(selectElement, flagElement) {
        const selectedCurrency = selectElement.value;
        const countryCode = countryList[selectedCurrency];
        flagElement.src = `https://flagsapi.com/${countryCode}/flat/32.png`;
    }

    // Update the flags when the selection changes
    fromCurrencySelect.addEventListener("change", function () {
        const fromFlag = document.querySelector("#from-currency ~ img.flag-img");
        updateFlag(fromCurrencySelect, fromFlag);
    });

    toCurrencySelect.addEventListener("change", function () {
        const toFlag = document.querySelector("#to-currency ~ img.flag-img");
        updateFlag(toCurrencySelect, toFlag);
    });

    // Initialize the flags
    updateFlag(fromCurrencySelect, document.querySelector("#from-currency ~ img.flag-img"));
    updateFlag(toCurrencySelect, document.querySelector("#to-currency ~ img.flag-img"));

    // Function to fetch conversion rates from the new API
    async function fetchConversionRate(fromCurrency, toCurrency, amount) {
        var myHeaders = new Headers();
        myHeaders.append("apikey", "LhlcBbfwN9OAsyQIGcrbBbyhe69T4zaO");

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        const url = `https://api.apilayer.com/fixer/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`;

        try {
            console.log("Fetching conversion rate...");
            console.log("URL:", url);

            const response = await fetch(url, requestOptions);
            console.log("Response status:", response.status);

            if (!response.ok) {
                console.error("Network response was not ok.");
                return null;
            }

            const result = await response.json();
            console.log("API Response:", result);

            if (result && result.result) {
                console.log(`Conversion result: ${result.result}`);
                return result.result;
            } else {
                console.error("Conversion result not found in API response.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching conversion rate:", error);
            return null;
        }
    }

    // Handle conversion on button click
    convertButton.addEventListener("click", async function () {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        let amount = parseFloat(amountInput.value);

        // Ensure the amount is positive
        if (isNaN(amount) || amount <= 0) {
            amount = 1;
            amountInput.value = 1;
        }

        // Fetch conversion rate from the new API
        const conversionResult = await fetchConversionRate(fromCurrency, toCurrency, amount);

        if (conversionResult !== null) {
            exchangeRateDisplay.textContent = `${amount} ${fromCurrency.toUpperCase()} = ${conversionResult.toFixed(2)} ${toCurrency.toUpperCase()}`;
        } else {
            exchangeRateDisplay.textContent = "Error fetching conversion rate.";
        }
    });
});
