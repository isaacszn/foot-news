// Global variables
let currentBalance = {
    USD: 10000,
    NGN: 4500000 // Approximate equivalent (1 USD = 450 NGN)
};
let currentCurrency = 'USD';
let isProcessing = false;

// Exchange rate (for demo purposes)
const exchangeRates = {
    USD_TO_NGN: 450,
    NGN_TO_USD: 1/450
};

// Currency configurations
const currencyConfig = {
    USD: {
        symbol: '$',
        quickAmounts: [50, 100, 200, 500, 1000, 2000],
        maxAmount: 10000
    },
    NGN: {
        symbol: '₦',
        quickAmounts: [5000, 10000, 25000, 50000, 100000, 250000],
        maxAmount: 1000000
    }
};

// DOM elements
const amountInput = document.getElementById('topupAmount');
const topupButton = document.getElementById('topupButton');
const buttonText = document.getElementById('buttonText');
const quickAmountsContainer = document.getElementById('quickAmounts');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    updateCurrencyDisplay();
    generateQuickAmountButtons();
    updateSummary();
    updateButton();
    
    // Add event listeners
    amountInput.addEventListener('input', function() {
        updateSummary();
        updateButton();
    });
}

function switchCurrency(currency) {
    if (currency === currentCurrency) return;
    
    // Update currency buttons
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (currency === 'USD') {
        document.getElementById('usdBtn').classList.add('active');
    } else {
        document.getElementById('ngnBtn').classList.add('active');
    }
    
    currentCurrency = currency;
    
    // Update display
    updateCurrencyDisplay();
    generateQuickAmountButtons();
    
    // Clear input and reset form
    amountInput.value = '';
    document.querySelectorAll('.quick-amount-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Update max amount for input
    amountInput.max = currencyConfig[currentCurrency].maxAmount;
    
    updateSummary();
    updateButton();
}

function updateCurrencyDisplay() {
    const config = currencyConfig[currentCurrency];
    const balance = currentBalance[currentCurrency];
    
    // Update all currency symbols
    document.getElementById('currencySymbol').textContent = config.symbol;
    document.getElementById('inputCurrencySymbol').textContent = config.symbol;
    document.getElementById('summarySymbol').textContent = config.symbol;
    document.getElementById('feeSymbol').textContent = config.symbol;
    document.getElementById('totalSymbol').textContent = config.symbol;
    
    // Update balance display
    document.getElementById('currentBalance').textContent = balance.toLocaleString();
}

function generateQuickAmountButtons() {
    const config = currencyConfig[currentCurrency];
    quickAmountsContainer.innerHTML = '';
    
    config.quickAmounts.forEach(amount => {
        const button = document.createElement('button');
        button.className = 'quick-amount-btn';
        button.textContent = `${config.symbol}${amount.toLocaleString()}`;
        button.onclick = () => selectQuickAmount(amount);
        quickAmountsContainer.appendChild(button);
    });
}

function selectQuickAmount(amount) {
    // Remove selected class from all quick amount buttons
    document.querySelectorAll('.quick-amount-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    event.target.classList.add('selected');
    
    // Set the amount
    amountInput.value = amount;
    updateSummary();
    updateButton();
}

function selectPaymentMethod(element) {
    // Remove selected class from all payment methods
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });
    
    // Add selected class to clicked method
    element.classList.add('selected');
    
    updateSummary();
}

function updateSummary() {
    const amount = parseFloat(amountInput.value) || 0;
    const fee = amount * 0.02; // 2% processing fee
    const total = amount + fee;
    
    document.getElementById('summaryAmount').textContent = formatCurrency(amount);
    document.getElementById('summaryFee').textContent = formatCurrency(fee);
    document.getElementById('summaryTotal').textContent = formatCurrency(total);
}

function formatCurrency(amount) {
    if (currentCurrency === 'USD') {
        return amount.toFixed(2);
    } else {
        return Math.round(amount).toLocaleString();
    }
}

function updateButton() {
    const amount = parseFloat(amountInput.value) || 0;
    const config = currencyConfig[currentCurrency];
    
    if (amount > 0) {
        topupButton.disabled = false;
        buttonText.textContent = `Top Up ${config.symbol}${formatCurrency(amount)}`;
    } else {
        topupButton.disabled = true;
        buttonText.textContent = 'Enter Amount to Continue';
    }
}

function processTopUp() {
    if (isProcessing) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    if (amount <= 0) return;
    
    isProcessing = true;
    topupButton.disabled = true;
    buttonText.innerHTML = '<span class="loading"></span> Processing...';
    
    // Simulate processing
    setTimeout(() => {
        // Update balance
        currentBalance[currentCurrency] += amount;
        updateCurrencyDisplay();
        
        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.add('show');
        
        // Reset form
        amountInput.value = '';
        document.querySelectorAll('.quick-amount-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        updateSummary();
        updateButton();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
        
        isProcessing = false;
    }, 2000);
}

function goBack() {
    if (confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
        // In a real app, this would navigate back to the dashboard
        window.history.back();
    }
}

// Utility function to convert between currencies (for demo purposes)
function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    
    if (fromCurrency === 'USD' && toCurrency === 'NGN') {
        return amount * exchangeRates.USD_TO_NGN;
    } else if (fromCurrency === 'NGN' && toCurrency === 'USD') {
        return amount * exchangeRates.NGN_TO_USD;
    }
    
    return amount;
}

// Initialize when page loads
initializePage();