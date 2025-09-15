    // Currency data and exchange rates (from EUR base)
    const currencies = {
        EUR: { symbol: '€', rate: 1, minAmount: 10, maxAmount: 2000 },
        USD: { symbol: '$', rate: 1.09, minAmount: 11, maxAmount: 2200 },
        NGN: { symbol: '₦', rate: 1700, minAmount: 17000, maxAmount: 3400000 }
    };

    // Withdrawal fees by method (in EUR, will be converted)
    const withdrawalFeesEUR = {
        'Bank Transfer': 0,
        'Debit Card': 1.50,
        'PayPal': 2.00,
        'Bitcoin': 5.00
    };

    let currentCurrency = 'EUR';
    let currentBalance = 10000; // Base balance in EUR
    let isProcessing = false;

    // Get currency data
    function getCurrencyData(currency) {
        return currencies[currency] || currencies.EUR;
    }

    // Format number with proper separators
    function formatAmount(amount, currency) {
        const data = getCurrencyData(currency);
        if (currency === 'NGN') {
            return amount.toLocaleString('en-NG');
        } else if (currency === 'USD') {
            return amount.toLocaleString('en-US');
        } else {
            return amount.toLocaleString('en-DE');
        }
    }

    // Convert amount from EUR to target currency
    function convertFromEUR(amount, targetCurrency) {
        const rate = getCurrencyData(targetCurrency).rate;
        return amount * rate;
    }

    // Convert amount from any currency to EUR
    function convertToEUR(amount, fromCurrency) {
        const rate = getCurrencyData(fromCurrency).rate;
        return amount / rate;
    }

    // Select currency
    function selectCurrency(currency, symbol) {
        currentCurrency = currency;
        
        // Update currency button selection
        document.querySelectorAll('.currency-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');

        // Update currency symbols
        document.getElementById('currentCurrencySymbol').textContent = symbol;
        document.getElementById('inputCurrencySymbol').textContent = symbol;
        document.getElementById('summaryCurrencySymbol').textContent = symbol;
        document.getElementById('summaryFeeCurrencySymbol').textContent = symbol;
        document.getElementById('summaryTotalCurrencySymbol').textContent = symbol;
        document.getElementById('summaryReceiveCurrencySymbol').textContent = symbol;

        // Update balance display
        const convertedBalance = convertFromEUR(currentBalance, currency);
        document.getElementById('currentBalance').textContent = formatAmount(convertedBalance, currency);

        // Update warning message
        const data = getCurrencyData(currency);
        document.getElementById('warningMessage').innerHTML = 
            `⚠️ Withdrawals may take 1–3 business days. Minimum: ${symbol}${formatAmount(data.minAmount, currency)}, Daily maximum: ${symbol}${formatAmount(data.maxAmount, currency)}`;

        // Update quick amount buttons
        updateQuickAmountButtons(currency, symbol);

        // Update withdrawal method fees
        updateWithdrawalFees(currency, symbol);

        // Update input attributes
        const amountInput = document.getElementById('withdrawAmount');
        amountInput.min = data.minAmount;
        amountInput.max = data.maxAmount;
        amountInput.value = '';

        // Update summary and button
        updateSummary();
        updateButton();
    }

    // Update quick amount buttons for current currency
    function updateQuickAmountButtons(currency, symbol) {
        const quickAmounts = document.getElementById('quickAmounts');
        const data = getCurrencyData(currency);
        
        let amounts;
        if (currency === 'USD') {
            amounts = [50, 100, 200, 500, 1000, 2000];
        } else if (currency === 'NGN') {
            amounts = [20000, 50000, 100000, 200000, 500000, 1000000];
        } else {
            amounts = [50, 100, 200, 500, 1000, 2000];
        }

        quickAmounts.innerHTML = '';
        amounts.forEach(amount => {
            const button = document.createElement('button');
            button.className = 'quick-amount-btn';
            button.textContent = `${symbol}${formatAmount(amount, currency)}`;
            button.onclick = () => selectQuickAmount(amount);
            
            const convertedBalance = convertFromEUR(currentBalance, currency);
            if (amount > convertedBalance) {
                button.disabled = true;
            }
            
            quickAmounts.appendChild(button);
        });
    }

    // Update withdrawal method fees
    function updateWithdrawalFees(currency, symbol) {
        const debitCardFee = convertFromEUR(withdrawalFeesEUR['Debit Card'], currency);
        const paypalFee = convertFromEUR(withdrawalFeesEUR['PayPal'], currency);
        const bitcoinFee = convertFromEUR(withdrawalFeesEUR['Bitcoin'], currency);

        document.getElementById('debitCardFee').textContent = `${symbol}${formatAmount(debitCardFee, currency)}`;
        document.getElementById('paypalFee').textContent = `${symbol}${formatAmount(paypalFee, currency)}`;
        document.getElementById('bitcoinFee').textContent = `${symbol}${formatAmount(bitcoinFee, currency)}`;
    }

    // Amount input handling
    const amountInput = document.getElementById('withdrawAmount');
    const withdrawButton = document.getElementById('withdrawButton');
    const buttonText = document.getElementById('buttonText');
    const errorMessage = document.getElementById('errorMessage');

    amountInput.addEventListener('input', function() {
        validateAmount();
        updateSummary();
        updateButton();
    });

    function validateAmount() {
        const amount = parseFloat(amountInput.value) || 0;
        const data = getCurrencyData(currentCurrency);
        const convertedBalance = convertFromEUR(currentBalance, currentCurrency);
        const isValid = amount >= data.minAmount && amount <= data.maxAmount && amount <= convertedBalance;
        
        if (amount > 0 && !isValid) {
            amountInput.classList.add('error');
            errorMessage.style.display = 'block';
            
            if (amount < data.minAmount) {
                errorMessage.textContent = `Minimum amount: ${data.symbol}${formatAmount(data.minAmount, currentCurrency)}`;
            } else if (amount > data.maxAmount) {
                errorMessage.textContent = `Daily maximum: ${data.symbol}${formatAmount(data.maxAmount, currentCurrency)}`;
            } else if (amount > convertedBalance) {
                errorMessage.textContent = 'Insufficient balance';
            }
        } else {
            amountInput.classList.remove('error');
            errorMessage.style.display = 'none';
        }
        
        return isValid;
    }

    function selectQuickAmount(amount) {
        const convertedBalance = convertFromEUR(currentBalance, currentCurrency);
        if (amount > convertedBalance) {
            return;
        }
        
        document.querySelectorAll('.quick-amount-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        amountInput.value = amount;
        validateAmount();
        updateSummary();
        updateButton();
    }

    function selectWithdrawalMethod(element) {
        document.querySelectorAll('.withdrawal-method').forEach(method => {
            method.classList.remove('selected');
        });
        element.classList.add('selected');
        updateSummary();
    }

    function updateSummary() {
        const amount = parseFloat(amountInput.value) || 0;
        const selectedMethod = document.querySelector('.withdrawal-method.selected');
        const methodName = selectedMethod ? selectedMethod.querySelector('.method-name').textContent : 'Bank Transfer';
        
        // Convert fee from EUR to current currency
        const feeEUR = withdrawalFeesEUR[methodName] || 0;
        const fee = convertFromEUR(feeEUR, currentCurrency);
        const total = amount + fee;
        const receive = amount;

        document.getElementById('summaryAmount').textContent = formatAmount(amount, currentCurrency);
        document.getElementById('summaryFee').textContent = formatAmount(fee, currentCurrency);
        document.getElementById('summaryTotal').textContent = formatAmount(total, currentCurrency);
        document.getElementById('summaryReceive').textContent = formatAmount(receive, currentCurrency);
    }

    function updateButton() {
        const amount = parseFloat(amountInput.value) || 0;
        const isValid = validateAmount();
        const symbol = getCurrencyData(currentCurrency).symbol;

        if (amount > 0 && isValid) {
            withdrawButton.disabled = false;
            buttonText.textContent = `Withdraw ${symbol}${formatAmount(amount, currentCurrency)}`;
        } else {
            withdrawButton.disabled = true;
            buttonText.textContent = amount > 0 ? 'Invalid amount' : 'Enter amount';
        }
    }

    function processWithdrawal() {
        if (isProcessing) return;

        const amount = parseFloat(amountInput.value) || 0;
        if (!validateAmount()) return;

        const selectedMethod = document.querySelector('.withdrawal-method.selected');
        const methodName = selectedMethod ? selectedMethod.querySelector('.method-name').textContent : 'Bank Transfer';
        
        // Convert amounts to EUR for processing
        const amountEUR = convertToEUR(amount, currentCurrency);
        const feeEUR = withdrawalFeesEUR[methodName] || 0;
        const totalEUR = amountEUR + feeEUR;

        isProcessing = true;
        withdrawButton.disabled = true;
        buttonText.innerHTML = '<div class="loading"></div> Processing...';

        setTimeout(() => {
            // Deduct from EUR balance
            currentBalance -= totalEUR;
            
            // Update balance display in current currency
            const convertedBalance = convertFromEUR(currentBalance, currentCurrency);
            document.getElementById('currentBalance').textContent = formatAmount(convertedBalance, currentCurrency);

            // Show success message
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.add('show');

            // Reset form
            amountInput.value = '';
            document.querySelectorAll('.quick-amount-btn').forEach(btn => {
                btn.classList.remove('selected');
                const btnText = btn.textContent.replace(/[€$₦,]/g, '');
                const btnAmount = parseFloat(btnText);
                if (btnAmount > convertedBalance) {
                    btn.disabled = true;
                }
            });

            // Reset withdrawal method selection
            document.querySelectorAll('.withdrawal-method').forEach(method => {
                method.classList.remove('selected');
            });
            document.querySelector('.withdrawal-method').classList.add('selected');

            updateSummary();
            updateButton();

            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);

            isProcessing = false;
        }, 3000);
    }

    function goBack() {
        window.location.href = 'dashboard.html';
    }

    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
        // Update quick amount buttons for initial currency
        updateQuickAmountButtons(currentCurrency, '€');
        
        // Disable buttons that exceed balance
        document.querySelectorAll('.quick-amount-btn').forEach(btn => {
            const btnText = btn.textContent.replace(/[€$₦,]/g, '');
            const amount = parseFloat(btnText);
            const convertedBalance = convertFromEUR(currentBalance, currentCurrency);
            if (amount > convertedBalance) {
                btn.disabled = true;
            }
        });

        updateSummary();
        updateButton();
    });