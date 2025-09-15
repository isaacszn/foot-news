document.addEventListener('DOMContentLoaded', () => {
    // ---- CURRENCY AND ACCOUNT COPYING ----
    const currencyBtns = document.querySelectorAll('.currency-btn');
    const usdAccountDetails = document.querySelector('#usd-account-number').parentElement;
    const ngnAccountDetails = document.querySelector('#ngn-account-number').parentElement;
    const mainBalanceEl = document.querySelector('#main-balance');
    const copyIcons = document.querySelectorAll('.copy-icon');

    // Mock balances
    const balances = {
        USD: 12456.78,
        NGN: 1868517.00
    };

    currencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currencyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const currency = btn.dataset.currency;

            if (currency === 'USD') {
                mainBalanceEl.textContent = `$${balances.USD.toLocaleString()}`;
                usdAccountDetails.style.display = 'flex';
                ngnAccountDetails.style.display = 'none';
            } else {
                mainBalanceEl.textContent = `₦${balances.NGN.toLocaleString()}`;
                usdAccountDetails.style.display = 'none';
                ngnAccountDetails.style.display = 'flex';
            }
        });
    });

    copyIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const accountNumberEl = document.getElementById(icon.dataset.account);
            navigator.clipboard.writeText(accountNumberEl.textContent).then(() => {
                alert('Account number copied!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy account number.');
            });
        });
    });

    // ---- PIN SETUP MODAL ----
    const pinModal = document.getElementById('pin-modal');
    const setupPinPage = document.getElementById('setup-pin-page');
    const confirmPinPage = document.getElementById('confirm-pin-page');

    const setupPinInputs = setupPinPage.querySelectorAll('.pin-input');
    const confirmPinInputs = confirmPinPage.querySelectorAll('.pin-input');

    const setupPinBtn = document.getElementById('setup-pin-btn');
    const confirmPinBtn = document.getElementById('confirm-pin-btn');

    const setupPinError = document.getElementById('setup-pin-error');
    const confirmPinError = document.getElementById('confirm-pin-error');

    let setupPinValue = '';

    // Function to handle PIN input focus
    const handlePinInput = (inputs) => {
        inputs.forEach((input, index) => {
            input.addEventListener('keyup', (e) => {
                if (e.key >= 0 && e.key <= 9) {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                } else if (e.key === 'Backspace') {
                    if (index > 0) {
                        inputs[index - 1].focus();
                    }
                }
            });
        });
    };

    handlePinInput(setupPinInputs);
    handlePinInput(confirmPinInputs);

    // Frontend validation for 4-digit PIN
    const validatePin = (inputs) => {
        let pin = '';
        inputs.forEach(input => pin += input.value);
        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            return { isValid: false, pin: null };
        }
        return { isValid: true, pin };
    };


    setupPinBtn.addEventListener('click', () => {
        const { isValid, pin } = validatePin(setupPinInputs);
        if (!isValid) {
            setupPinError.textContent = 'Please enter a valid 4-digit PIN.';
            return;
        }
        setupPinError.textContent = '';
        setupPinValue = pin;
        setupPinPage.style.display = 'none';
        confirmPinPage.style.display = 'block';
    });

    confirmPinBtn.addEventListener('click', async () => {
        const { isValid, pin: confirmPinValue } = validatePin(confirmPinInputs);

        // Frontend Error
        if (!isValid) {
            confirmPinError.textContent = 'Please enter a valid 4-digit PIN.';
            return;
        }
        if (setupPinValue !== confirmPinValue) {
            confirmPinError.textContent = 'PINs do not match.';
            return;
        }

        confirmPinError.textContent = '';

        // API Compatible: Mock API call
        try {
            const response = await mockSetPinAPI(setupPinValue);
            if (response.success) {
                alert('PIN set successfully!');
                pinModal.style.display = 'none';
            } else {
                 // Backend Error
                throw new Error(response.message || 'An unknown error occurred.');
            }
        } catch (error) {
            confirmPinError.textContent = `Error from backend: ${error.message}`;
        }
    });

    // Mock API function for setting PIN
    async function mockSetPinAPI(pin) {
        console.log(`Sending PIN to backend...`);
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate a potential backend error
                if (pin === "0000") {
                    resolve({ success: false, message: 'PIN cannot be all zeros.' });
                } else {
                    resolve({ success: true, message: 'PIN set successfully' });
                }
                // To simulate a network/server failure, uncomment the next line:
                // reject(new Error('Network error. Please try again.'));
            }, 1000);
        });
    }
});