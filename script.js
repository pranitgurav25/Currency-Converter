

const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');
const swapBtn = document.getElementById('swap-btn');


const apiBase = 'https://api.frankfurter.dev/v1';


async function fetchCurrencies() {
    try {
        const response = await fetch(`${apiBase}/currencies`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        const currencies = Object.entries(data);
        

        fromCurrency.innerHTML = '';
        toCurrency.innerHTML = '';

        for (let i = 0; i < currencies.length; i++) {
            const optionCode = currencies[i][0];
            const optionName = currencies[i][1];
            
            const option1 = document.createElement('option');
            option1.value = optionCode;
            option1.innerText = `${optionCode} - ${optionName}`;
            
            const option2 = document.createElement('option');
            option2.value = optionCode;
            option2.innerText = `${optionCode} - ${optionName}`;
            
            fromCurrency.appendChild(option1);
            toCurrency.appendChild(option2);
        }

        fromCurrency.value = "USD";
        toCurrency.value = "EUR";
        

        resultDiv.innerText = "1 USD = --- EUR";
        
    } catch (error) {
        resultDiv.innerText = "Error loading currencies.";
        console.error("Error fetching currencies:", error);
    }
}


async function convertCurrency() {
    let amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (amount === "" || amount < 0) {
        amountInput.value = "1";
        amount = 1;
    }

    if (from === to) {
        resultDiv.innerText = `${amount} ${from} = ${amount} ${to}`;
        return;
    }

    resultDiv.innerText = "Converting...";

    try {

        const response = await fetch(`${apiBase}/latest?base=${from}&symbols=${to}`);
        if (!response.ok) throw new Error("Failed to fetch exchange rate");
        
        const data = await response.json();
        

        const rate = data.rates[to];
        const convertedAmount = (amount * rate).toFixed(2);
        
        resultDiv.innerText = `${amount} ${from} = ${convertedAmount} ${to}`;
    } catch (error) {
        resultDiv.innerText = "Something went wrong.";
        console.error("Error converting:", error);
    }
}


swapBtn.addEventListener('click', () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    convertCurrency(); 
});


convertBtn.addEventListener('click', convertCurrency);


fetchCurrencies();