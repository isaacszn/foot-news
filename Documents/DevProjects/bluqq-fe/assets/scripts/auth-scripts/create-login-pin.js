// Getting items needed
const setupPinPage = document.getElementById('pin-inputs');
const setupPinInputs = setupPinPage.querySelectorAll('.the-pin-input');
const confirmPinPage = document.getElementById('confirm-pin-inputs');
const confirmPinInputs = confirmPinPage.querySelectorAll('.confirm-pin-input');

window.onload = () => {
  handlePinInput(setupPinInputs);
  handlePinInput(confirmPinInputs);
};

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

function setPin() {
  const pin1 = document.getElementById("pin1").value;
  const pin2 = document.getElementById("pin2").value;
  const pin3 = document.getElementById("pin3").value;
  const pin4 = document.getElementById("pin4").value;
  const pin5 = document.getElementById("pin5").value;
  const pin6 = document.getElementById("pin6").value;
  const confirmPin1 = document.getElementById("confirmPin1").value;
  const confirmPin2 = document.getElementById("confirmPin2").value;
  const confirmPin3 = document.getElementById("confirmPin3").value;
  const confirmPin4 = document.getElementById("confirmPin4").value;
  const confirmPin5 = document.getElementById("confirmPin5").value;
  const confirmPin6 = document.getElementById("confirmPin6").value;
  const pin = pin1 + pin2 + pin3 + pin4 + pin5 + pin6;
  const confirmPin = confirmPin1 + confirmPin2 + confirmPin3 + confirmPin4 + confirmPin5 + confirmPin6;
  /*const pin = setupPinInputs;
  const confirmPin = confirmPinInputs;*/
  let btn = document.getElementById('btn');
  
  if (pin !== confirmPin) {
    showMessage('error', 'Pin and confirm pin don\'t match!', 'pin')
  }
  
  if (!pin) {
    showMessage('error', 'Please add a pin!', 'pin');
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
    btn.textContent = 'Setting pin...';
    
    // Create the request
    const requestOptions = {
      method: 'POST',
      credentials: "included",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        pin: pin
      })
    };
    
    // Make API call
    fetch('https://bluqq-backend.vercel.app/api/create-pin/', requestOptions)
      .then(response => {
        debugLog(`Response status: ${response.status}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('API endpoint not found');
          } else if (response.status === 500) {
            throw new Error('Server error occurred');
          } else if (response.status === 409) {
            throw new Error('Pin invalid');
            showMessage('error', 'Failed to set pin', 'pin')
          } else {
            throw new Error(`Server returned ${response.status}`);
          }
        }
        
        return response.json();
      })
      .then(data => {
        debugLog('Pin setup successful');
        
        if (data && data.success !== false) {
          showMessage('success', 'Pin setup successful. Redirecting to dashboard...', 'pin');
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            window.href = '/pages/dashboard.html';
          }, 3000);
        } else {
          const errorMsg = (data && data.message) || (data && data.error) || 'Failed to set pin. Please try again!';
          showMessage('error', errorMsg, 'verify');
        }
      })
      .catch(error => {
        debugLog(`Error: ${error.message}`);
        
        let errorMessage = 'Failed to set pin. Please try again.';
        
        if (error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.message.includes('ivalid')) {
          errorMessage = 'Invalid pin format.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Registration service temporarily unavailable.';
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        showMessage('error', errorMessage, 'pin');
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

function cancelSetPin() {
  window.href = '/pages/auth-pages/create-login-pin.html';
}