   document.addEventListener('DOMContentLoaded', () => {
    // Piece of code to pop pin setup modal
    setTimeout(() => {
        pinModal.classList.remove('hide');
        pinModal.classList.add('modal');
    }, 4000)

    // A constant for your API base URL to make future updates easier.
    const API_BASE_URL = 'https://bluqq-backend.vercel.app/api/';

    // /**
    //  * This is the main function that runs when the dashboard loads.
    //  * It checks for a login token and a temporary flag to show the PIN modal.
    //  */

    // ---- API CALL TO CREATE THE PIN (UNCHANGED) ----
    
    /**
     * Sends the new PIN to the live backend API.
     * @param {string} pin The 4-digit PIN to be set.
     * @returns {Promise<object>} The JSON response from the server.
     */
        async function createPinAPI(pin) {
            const apiUrl = `${API_BASE_URL}/create-pin/`;
            const requestData = { transaction_pin: pin };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                credentials: 'include'   // allow cookies to be sent + stored
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.detail || errorData?.message || `Request failed with status: ${response.status}`;
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log(data);
            return data;
        }



    // ---- EXISTING UI AND MODAL LOGIC (UNCHANGED) ----

    const currencyBtns = document.querySelectorAll('.currency-btn');
    const usdAccountDetails = document.querySelector('#usd-account-number').parentElement;
    const ngnAccountDetails = document.querySelector('#ngn-account-number').parentElement;
    const mainBalanceEl = document.querySelector('#main-balance');
    const copyIcons = document.querySelectorAll('.copy-icon');
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

    const balances = { USD: 12456.78, NGN: 1868517.00 };

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
            }).catch(err => console.error('Failed to copy: ', err));
        });
    });

    const handlePinInput = (inputs) => {
        inputs.forEach((input, index) => {
            input.addEventListener('keyup', (e) => {
                if (e.key >= 0 && e.key <= 9 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else if (e.key === 'Backspace' && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    };
    handlePinInput(setupPinInputs);
    handlePinInput(confirmPinInputs);

    const validatePin = (inputs) => {
        const pin = Array.from(inputs).map(input => input.value).join('');
        return (pin.length === 4 && /^\d{4}$/.test(pin)) ? { isValid: true, pin } : { isValid: false, pin: null };
    };

    setupPinBtn.addEventListener('click', () => {
        const { isValid, pin } = validatePin(setupPinInputs);
        if (!isValid) { setupPinError.textContent = 'Please enter a valid 4-digit PIN.'; return; }
        setupPinError.textContent = '';
        setupPinValue = pin;
        setupPinPage.style.display = 'none';
        confirmPinPage.style.display = 'block';
        confirmPinInputs[0].focus();
    });

    confirmPinBtn.addEventListener('click', async () => {
        const { isValid, pin: confirmPinValue } = validatePin(confirmPinInputs);
        if (!isValid) { confirmPinError.textContent = 'Please confirm with a valid 4-digit PIN.'; return; }
        if (setupPinValue !== confirmPinValue) { confirmPinError.textContent = 'PINs do not match.'; return; }
        
        confirmPinError.textContent = '';
        confirmPinBtn.textContent = 'Setting up...';
        confirmPinBtn.disabled = true;

        try {
            // const authToken = localStorage.getItem('userAuthToken');
            // if (!authToken) throw new Error('Authentication token not found. Please log in again.');
            
            await createPinAPI(setupPinValue);
            alert('PIN created successfully!');
            pinModal.style.display = 'none';
        } catch (error) {
            console.error('PIN Setup Failed:', error);
            confirmPinError.textContent = error.message;
        } finally {
            confirmPinBtn.textContent = 'Confirm';
            confirmPinBtn.disabled = false;
        }
    });

});         
