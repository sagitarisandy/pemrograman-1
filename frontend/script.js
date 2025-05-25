document.addEventListener('DOMContentLoaded', function() {
    const amountInput = document.getElementById('amount');
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    const swapBtn = document.getElementById('swap-btn');
    const convertBtn = document.getElementById('convert-btn');
    const resultDiv = document.getElementById('result');
    const conversionResultDiv = document.getElementById('conversion-result');
    const rateInfoDiv = document.getElementById('rate-info');
    const errorDiv = document.getElementById('error');

    // Swap currencies
    swapBtn.addEventListener('click', function() {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
    });

    // Convert currency
    convertBtn.addEventListener('click', async function() {
        const amount = parseFloat(amountInput.value);
        const from = fromSelect.value;
        const to = toSelect.value;

        if (isNaN(amount) || amount <= 0) {
            showError('Please enter a valid amount');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/currency/convert?from=${from}&to=${to}&amount=${amount}`);
            const data = await response.json();

            if (!response.ok) {
                showError(data.error || 'An error occurred during conversion');
                return;
            }

            displayResult(data);
        } catch (error) {
            showError('Failed to connect to the server. Please try again later.');
            console.error('Error:', error);
        }
    });

    function displayResult(data) {
        errorDiv.classList.add('hidden');

        conversionResultDiv.innerHTML = `
            ${data.amount} ${data.from} = <strong>${data.converted.toFixed(2)} ${data.to}</strong>
        `;

        rateInfoDiv.innerHTML = `
            1 ${data.from} = ${data.rate.toFixed(6)} ${data.to}
        `;

        resultDiv.classList.remove('hidden');
    }

    function showError(message) {
        resultDiv.classList.add('hidden');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
});