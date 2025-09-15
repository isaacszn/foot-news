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
  const email = document.getElementById("email").value;
  let btn = document.getElementById('btn');
  if (!email) {
    showMessage('error', 'Please type your registered code, before requesting for reset code!', 'code');
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
    btn.textContent = 'Sending reset code...';
    
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
    fetch('https://bluqq-backend.vercel.app/api/forgot-password/', requestOptions)
      .then(response => {
        debugLog(`Response status: ${response.status}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('API endpoint not found');
          } else if (response.status === 500) {
            throw new Error('Server error occurred');
          } else if (response.status === 409) {
            throw new Error('Email invalid');
            showMessage('error', 'Email not registered. Please use a registered email.', 'forgot')
          } else {
            throw new Error(`Server returned ${response.status}`);
          }
        }
        
        return response.json();
      })
      .then(data => {
        debugLog('Code sent successful');
        
        if (data && data.success !== false) {
          showMessage('success', 'Code sent successful. Go to your email and click reset password link...', 'forgot');
          
          // Redirect to dashboard after 3 seconds
          // setTimeout(() => {
          //   window.href = '/frontend/pages/reset-password.html';
          // }, 3000);
        } else {
          const errorMsg = (data && data.message) || (data && data.error) || 'Failed to send code. Please try again!';
          showMessage('error', errorMsg, 'verify');
        }
      })
      .catch(error => {
        debugLog(`Error: ${error.message}`);
        
        let errorMessage = 'Failed to send code because the email is not registered. Please try again.';
        
        if (error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.message.includes('ivalid')) {
          errorMessage = 'Invalid code.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Registration service temporarily unavailable.';
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        showMessage('error', errorMessage, 'code');
      })
      .finally(() => {
        // Always reset button state
        if (btn) {
          btn.disabled = false;
          //btn.classList.remove('loading');
          btn.textContent = originalText;
        }
      });
  }
  
  return false;
}