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

function sendCode() {
  const verificationCode = document.getElementById("otp").value;
  const params = new URLSearchParams(window.location.search);
  const emailFromURL = params.get('email');
  const emailFromLocalStorage = localStorage.getItem('email');
  let email = '';
  
  // Check if email derived from url is true, and if not use the one from LocalStorage
  if (emailFromURL) {
    email = emailFromURL;
  } else {
    email = emailFromLocalStorage;
  }
  
  let btn = document.getElementById('btn');
  if (!verificationCode) {
    showMessage('error', 'Please enter the verification code sent to you!', 'verify');
    return;
  } else {
    // Prevent double submission
    if (btn.disabled) {
      return false;
    }
    
    // Set loading state
    btn.disabled = true;
    //btn.classList.add('loading');
    const originalText = btn.textContent;
    btn.textContent = 'Verifying...';
    
    // Create the request
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        verification_code: verificationCode
      })
    };
    
    // Make API call
    fetch('https://bluqq-backend.vercel.app/api/verify-user/', requestOptions)
      .then(response => {
        debugLog(`Response status: ${response.status}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('API endpoint not found');
          } else if (response.status === 500) {
            throw new Error('Server error occurred');
          } else if (response.status === 400) {
            throw new Error('Verification code not correct or invalid');
            showMessage('error', 'Verification code not correct or invalid. Try again with a correct code!', 'verify');
          } else if (response.status === 409) {
            throw new Error('Verification failed');
            showMessage('error', 'Verification code not correct', 'verify')
          } else {
            throw new Error(`Server returned ${response.status}`);
          }
        }
        
        return response.json();
      })
      .then(data => {
        debugLog('Verification successful');
        
        if (data && data.success !== false) {
          showMessage('success', 'Email verified. Now login with your credentials!', 'verify');
          
          // Switch to setup pin form after 3 seconds
          setTimeout(() => {
            window.location.href = '/pages/auth-pages/auth.html';
          }, 3000);
        } else {
          const errorMsg = (data && data.message) || (data && data.error) || 'Verification failed. Please try again!';
          showMessage('error', errorMsg, 'verify');
        }
      })
      .catch(error => {
        debugLog(`Error: ${error.message}`);
        
        let errorMessage = 'Verification code expired or invalid. Please request a new one.';
        
        if (error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.message.includes('ivalid')) {
          errorMessage = 'Incorrect verification code.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Registration service temporarily unavailable.';
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        showMessage('error', errorMessage, 'verify');
      })
      .finally(() => {
        // Always reset button state
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('loading');
          btn.textContent = originalText;
        }
      });
  }
  
  return false;
}

function resendCode() {
  const params = new URLSearchParams(window.location.search);
  const emailFromURL = params.get('email');
  const emailFromLocalStorage = localStorage.getItem('email');
  let email = '';
  
  // Check if email derived from url is true, and if not use the one from LocalStorage
  if (emailFromURL) {
    email = emailFromURL;
  } else {
    email = emailFromLocalStorage;
  }
  
    let btn = document.getElementById('btn');
    // Set loading state
    btn.disabled = true;
    //btn.classList.add('loading');
    const originalText = btn.textContent;
    btn.textContent = 'Resending code...';
    
    // Create the request
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    };
    
    // Make API call
    fetch('https://bluqq-backend.vercel.app/api/resend-code/', requestOptions)
      .then(response => {
        debugLog(`Response status: ${response.status}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('API endpoint not found');
          } else if (response.status === 500) {
            throw new Error('Server error occurred');
          } else if (response.status === 409) {
            throw new Error('Verification code not sent');
            showMessage('error', 'Verification code failed to send', 'verify')
          } else {
            throw new Error(`Server returned ${response.status}`);
          }
        }
        
        return response.json();
      })
      .then(data => {
        debugLog('Code sent successful');
        
        if (data && data.success !== false) {
          showMessage('success', 'Email verified. You will be redirected to the login page, to login!', 'verify');
          
          // Redirect the user to login after 3 seconds
          setTimeout(() => {
            window.location.href = "/pages/auth-pages/auth.html";
          }, 3000);
        } else {
          const errorMsg = (data && data.message) || (data && data.error) || 'Code failed to send. Please try again!';
          showMessage('error', errorMsg, 'verify');
        }
      })
      .catch(error => {
        debugLog(`Error: ${error.message}`);
        
        let errorMessage = 'Code failed to send. Please try again.';
        
        if (error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.message.includes('ivalid')) {
          errorMessage = 'Incorrect verification code.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Registration service temporarily unavailable.';
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        showMessage('error', errorMessage, 'verify');
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
