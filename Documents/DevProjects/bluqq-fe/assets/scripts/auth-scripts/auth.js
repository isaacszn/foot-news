function switchForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    // Hide all forms
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    
    // Remove active class from all toggle buttons
    toggleBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected form and activate button
    if (formType === 'login') {
        loginForm.classList.add('active');
        toggleBtns[0].classList.add('active');
    } else {
        registerForm.classList.add('active');
        toggleBtns[1].classList.add('active');
    }
    
    // Clear any error messages
    clearMessages();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
    }
}

function toggleCheckbox(checkbox) {
    if (checkbox) {
        checkbox.classList.toggle('checked');
    }
}

function showMessage(type, message, formType) {
    const messageElement = document.getElementById(`${formType}-${type}`);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            if (messageElement) {
                messageElement.style.display = 'none';
            }
        }, 5000);
    }
}

function clearMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => {
        if (msg) {
            msg.style.display = 'none';
        }
    });
}

// Simple debug function that doesn't trigger logging libraries
function debugLog(message) {
    // Use document.title to debug without console
    // document.title = message;
    // Or create a hidden div for debugging
    const debugDiv = document.getElementById('debug') || document.createElement('div');
    if (!document.getElementById('debug')) {
        debugDiv.id = 'debug';
        debugDiv.style.display = 'none';
        document.body.appendChild(debugDiv);
    }
    debugDiv.textContent = message;
}

function handleLogin(event) {
    // Prevent all default behavior
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    clearMessages();
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const btn = document.getElementById('login-btn');
    
    if (!emailInput || !passwordInput || !btn) {
        showMessage('error', 'Form elements not found', 'login');
        return false;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    debugLog(`Login attempt: ${email}`);
    
    // Simple validation
    if (!email || !password) {
        showMessage('error', 'Please fill in all fields', 'login');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('error', 'Please enter a valid email address', 'login');
        return false;
    }
    
    // Prevent double submission
    if (btn.disabled) {
        return false;
    }
    
    // Set loading state
    btn.disabled = true;
    //btn.classList.add('loading');
    const originalText = btn.textContent;
    btn.textContent = 'Signing In...';

    
    // Create the request
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    };
    
    // Make API call
       fetch("https://bluqq-backend.vercel.app/api/login/", requestOptions)
        .then((response) => {
            debugLog(`Response status: ${response.status}`);

            if (!response.ok) {
            return response.json().then((err) => {
                let msg;

                if (response.status === 404) {
                msg = "API endpoint not found";
                } else if (response.status === 400) {
                msg =
                    err?.error ||
                    "Invalid credentials. Try again with correct password and email";
                } else if (response.status === 500) {
                msg = "Server error occurred";
                } else if (response.status === 401) {
                msg = "Invalid credentials!";
                } else {
                msg = `Server returned ${response.status}`;
                }

                showMessage("error", msg, "login");
                throw new Error(msg); // throw after showing message
            });
            }

            return response.json();
        })
        .then((data) => {
            debugLog("Login successful:", data);

            if (data && data.success !== false) {
            showMessage("success", "Login successful! Redirecting to dashboard...", "login");

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = "/pages/dashboard.html";
            }, 3000);
            } else {
            const errorMsg =
                data?.message || data?.error || "Login failed. Please check your credentials.";
            showMessage("error", errorMsg, "login");
            }
        })
        .catch((error) => {
            debugLog(`Error: ${error.message}`);

            let errorMessage = "Type in correct credentials. Please try again.";

            if (error.message.toLowerCase().includes("fetch")) {
            errorMessage = "Cannot connect to server. Please check your internet connection.";
            } else if (error.message.toLowerCase().includes("credentials")) {
            errorMessage = "Invalid email or password.";
            } else if (error.message.toLowerCase().includes("not found")) {
            errorMessage = "Login service temporarily unavailable.";
            } else if (error.message.toLowerCase().includes("server error")) {
            errorMessage = "Server error. Please try again later.";
            }

            showMessage("error", errorMessage, "login");
        })
        .finally(() => {
            // Always reset button state
            if (btn) {
            btn.disabled = false;
            btn.classList.remove("loading");
            btn.textContent = originalText;
            }
        });

    
    return false;
}

function handleRegister(event) {
    // Prevent all default behavior
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    clearMessages();
    
    const firstnameInput = document.getElementById('register-firstname');
    const lastnameInput = document.getElementById('register-lastname');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    const termsCheckbox = document.querySelector('#register-form .checkbox');
    const btn = document.getElementById('register-btn');
    
    if (!firstnameInput || !lastnameInput || !emailInput || !passwordInput || !confirmPasswordInput || !btn) {
        showMessage('error', 'Form elements not found', 'register');
        return false;
    }
    
    const firstname = firstnameInput.value.trim();
    const lastname = lastnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const termsAccepted = termsCheckbox ? termsCheckbox.classList.contains('checked') : false;
    
    debugLog(`Register attempt: ${firstname} ${lastname}, ${email}`);
    
    // Validation
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
        showMessage('error', 'Please fill in all fields', 'register');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('error', 'Please enter a valid email address', 'register');
        return false;
    }
    
    if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match', 'register');
        return false;
    }
    
    if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters long', 'register');
        return false;
    }
    
    if (!termsAccepted) {
        showMessage('error', 'Please accept the Terms of Service and Privacy Policy', 'register');
        return false;
    }
    
    // Prevent double submission
    if (btn.disabled) {
        return false;
    }
    
    // Set loading state
    btn.disabled = true;
    //btn.classList.add('loading');
    const originalText = btn.textContent;
    btn.textContent = 'Creating Account...';
    
    // Create the request
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            first_name: firstname,
            last_name: lastname,
            email: email,
            password: password
        })
    };
    
    // Make API call
    fetch('https://bluqq-backend.vercel.app/api/register-user/', requestOptions)
        .then(response => {
            debugLog(`Response status: ${response.status}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('API endpoint not found');
                } else if (response.status === 400) {
                    throw new Error('email already exists');
                    showMessage('error', 'Email already exists', 'register')
                } else if (response.status === 500) {
                    throw new Error('Server error occurred');
                } else if (response.status === 409) {
                    throw new Error('Email already exists');
                    showMessage('error', 'Email already exists', 'register');
                } else {
                    throw new Error(`Server returned ${response.status}`);
                }
            }
            
            return response.json();
        })
        .then(data => {
            debugLog('Registration successful');
            
            if (data && data.success !== false) {
                showMessage('success', 'Account created successfully! Please check your email for verification.', 'register');
                
                // Switch to verify-email page after 3 seconds
                setTimeout(() => {
                    window.location.href = `/pages/auth-pages/verify-email.html?email=${email}`;
                    localStorage.setItem('email', email);
                    //showMessage('success', 'Please verify your email with the code  sent to your email', 'verification');
                }, 3000);
            } else {
                const errorMsg = (data && data.message) || (data && data.error) || 'Registration failed. Please try again.';
                showMessage('error', errorMsg, 'register');
            }
        })
        .catch(error => {
            debugLog(`Error: ${error.message}`);
            
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.message.includes('fetch')) {
                errorMessage = 'Cannot connect to server. Please check your internet connection.';
            } else if (error.message.includes('already exists')) {
                errorMessage = 'An account with this email already exists.';
            } else if (error.message.includes('not found')) {
                errorMessage = 'Registration service temporarily unavailable.';
            } else if (error.message.includes('Server error')) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            showMessage('error', errorMessage, 'register');
        })
        .finally(() => {
            // Always reset button state
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('loading');
                btn.textContent = originalText;
            }
        });
    
    return false;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOM loaded');
    
    // Add entrance animations
    const container = document.querySelector('.auth-container');
    if (container) {
        container.style.transform = 'translateY(50px)';
        container.style.opacity = '0';
        
        setTimeout(() => {
            container.style.transition = 'all 0.6s ease';
            container.style.transform = 'translateY(0)';
            container.style.opacity = '1';
        }, 100);
    }
    
    // Add form submit event listeners as backup
    const loginForm = document.querySelector('#login-form form');
    const registerForm = document.querySelector('#register-form form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Prevent any other form submissions
window.addEventListener('submit', function(e) {
    const form = e.target;
    if (form && form.closest('#login-form')) {
        e.preventDefault();
        handleLogin(e);
    } else if (form && form.closest('#register-form')) {
        e.preventDefault();
        handleRegister(e);
    }
});