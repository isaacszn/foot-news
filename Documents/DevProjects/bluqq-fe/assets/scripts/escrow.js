      // Payment method selection
      function selectPaymentMethod(element) {
        document.querySelectorAll('.payment-method').forEach(method => {
            method.classList.remove('selected');
        });
        element.classList.add('selected');
    }

    // Update summary when amount changes
    document.getElementById('total-amount').addEventListener('input', updateSummary);
    document.getElementById('currency-select').addEventListener('change', updateSummary);

    function updateSummary() {
        const amount = parseFloat(document.getElementById('total-amount').value) || 0;
        const currency = document.getElementById('currency-select').value;
        const fee = amount * 0.025;
        const total = amount + fee;

        const currencySymbol = currency === 'NGN' ? '₦' : '$';
        
        document.getElementById('summary-amount').textContent = currencySymbol + amount.toFixed(2);
        document.getElementById('summary-fee').textContent = currencySymbol + fee.toFixed(2);
        document.getElementById('summary-total').textContent = currencySymbol + total.toFixed(2);
    }

    // Form validation functions
    function validateField(fieldId, errorMessage) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (!field.value.trim()) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            return false;
        } else {
            field.classList.remove('error');
            errorElement.classList.remove('show');
            return true;
        }
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateRadioGroup(groupName, errorMessage) {
        const radioGroup = document.querySelector(`input[name="${groupName}"]`).closest('.radio-group');
        const errorElement = radioGroup.parentElement.querySelector('.error-message');
        const checkedRadio = document.querySelector(`input[name="${groupName}"]:checked`);
        
        if (!checkedRadio) {
            radioGroup.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            return false;
        } else {
            radioGroup.classList.remove('error');
            errorElement.classList.remove('show');
            return true;
        }
    }

    function validateForm() {
        let isValid = true;

        // Validate escrow type
        if (!validateField('escrow-type', 'Please select an escrow type')) {
            isValid = false;
        }

        // Validate transaction title
        if (!validateField('transaction-title', 'Please enter a transaction title')) {
            isValid = false;
        }

        // Validate total amount
        const amount = parseFloat(document.getElementById('total-amount').value);
        if (!amount || amount <= 0) {
            document.getElementById('total-amount').classList.add('error');
            const errorElement = document.getElementById('total-amount').parentElement.parentElement.querySelector('.error-message');
            errorElement.textContent = 'Please enter a valid amount greater than 0';
            errorElement.classList.add('show');
            isValid = false;
        } else {
            document.getElementById('total-amount').classList.remove('error');
            const errorElement = document.getElementById('total-amount').parentElement.parentElement.querySelector('.error-message');
            errorElement.classList.remove('show');
        }

        // Validate role selection
        if (!validateRadioGroup('role', 'Please select your role')) {
            isValid = false;
        }

        // Validate other party email
        const email = document.getElementById('other-party-email').value.trim();
        if (!email || !validateEmail(email)) {
            document.getElementById('other-party-email').classList.add('error');
            const errorElement = document.getElementById('other-party-email').parentElement.querySelector('.error-message');
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.classList.add('show');
            isValid = false;
        } else {
            document.getElementById('other-party-email').classList.remove('error');
            const errorElement = document.getElementById('other-party-email').parentElement.querySelector('.error-message');
            errorElement.classList.remove('show');
        }

        // Validate your phone number
        if (!validateField('your-phone', 'Please enter your phone number')) {
            isValid = false;
        }

        // Validate delivery date
        const deliveryDate = document.getElementById('delivery-date').value;
        if (!deliveryDate) {
            document.getElementById('delivery-date').classList.add('error');
            const errorElement = document.getElementById('delivery-date').parentElement.querySelector('.error-message');
            errorElement.textContent = 'Please select a delivery date';
            errorElement.classList.add('show');
            isValid = false;
        } else {
            const selectedDate = new Date(deliveryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate <= today) {
                document.getElementById('delivery-date').classList.add('error');
                const errorElement = document.getElementById('delivery-date').parentElement.querySelector('.error-message');
                errorElement.textContent = 'Delivery date must be in the future';
                errorElement.classList.add('show');
                isValid = false;
            } else {
                document.getElementById('delivery-date').classList.remove('error');
                const errorElement = document.getElementById('delivery-date').parentElement.querySelector('.error-message');
                errorElement.classList.remove('show');
            }
        }

        return isValid;
    }

    // Create escrow function with validation
    function createEscrow() {
        if (!validateForm()) {
            alert('Please fill in all required fields correctly before proceeding.');
            return;
        }

        const formData = {
            escrowType: document.getElementById('escrow-type').value,
            transactionTitle: document.getElementById('transaction-title').value,
            totalAmount: document.getElementById('total-amount').value,
            currency: document.getElementById('currency-select').value,
            role: document.querySelector('input[name="role"]:checked')?.value,
            otherPartyEmail: document.getElementById('other-party-email').value,
            yourPhone: document.getElementById('your-phone').value,
            otherPartyPhone: document.getElementById('other-party-phone').value,
            otherPartyAccount: document.getElementById('other-party-account').value,
            paymentMethod: document.querySelector('.payment-method.selected .payment-name').textContent,
            deliveryDate: document.getElementById('delivery-date').value,
            autoRelease: document.getElementById('auto-release').value,
            terms: document.getElementById('terms').value,
            batchPayments: document.getElementById('batch-payments').checked
        };

        // Simulate escrow creation and redirect
        const currencySymbol = formData.currency === 'NGN' ? '₦' : '$';
        alert(`Escrow created successfully! Amount: ${currencySymbol}${formData.totalAmount} via ${formData.paymentMethod}. You will receive a confirmation email shortly.`);
        
        // Redirect to next page
        window.location.href = 'ec.html';
    }

    // Save as draft function
    function saveAsDraft() {
        alert('Draft saved successfully!');
    }

    // Clear error styling when user starts typing/selecting
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('form-input') || e.target.classList.contains('form-select')) {
            e.target.classList.remove('error');
            const errorElement = e.target.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        }
    });

    document.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            const radioGroup = e.target.closest('.radio-group');
            if (radioGroup) {
                radioGroup.classList.remove('error');
                const errorElement = radioGroup.parentElement.querySelector('.error-message');
                if (errorElement) {
                    errorElement.classList.remove('show');
                }
            }
        }
    });

    // Initialize with default values
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('delivery-date').value = tomorrow.toISOString().split('T')[0];
    
    // Initialize summary
    updateSummary();