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

function setNewPassword() {
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    // Getting the uuid and token from URL parameters
    const params = new URLSearchParams(window.location.search);
    const uuid = params.get("uid");
    const token = params.get("token");    

    let btn = document.getElementById("btn");
    if (!newPassword) {
      showMessage("error", "Please type in a password!", "reset");
      return;
    } else {
      // Prevent double submission
      if (btn.disabled) {
        return false;
      }

      if (newPassword !== confirmPassword) {
        showMessage("error", "Password and confirm password do not match!", "reset");
        return;
      }

      if (newPassword.length < 8) {
        showMessage("error", "Password should be at least 8 character long and should contain a number", "reset");
        return;
      } else {
          // Set loading state
          btn.disabled = true;
          //btn.classList.add('loading');
          const originalText = btn.textContent;
          btn.textContent = "Resetting password...";

          // Create the request
          // Create the request
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              token: token,
              uidb64: uuid,
              password: newPassword,
              confirm_password: confirmPassword,
            }),
          };

          // Make API call
          fetch("https://bluqq-backend.vercel.app/api/reset-password-confirm/", requestOptions)
            .then((response) => {
              debugLog(`Response status: ${response.status}`);

              if (!response.ok) {
                // Try to read JSON error if available
                return response.json().then((err) => {
                  let msg = err?.error || err?.message;

                  if (response.status === 400) {
                    msg =
                      msg ||
                      "Check password well. Password must have at least 8 characters and include at least a number.";
                  } else if (response.status === 500) {
                    msg = msg || "Server error occurred. Please try again later.";
                  } else if (response.status === 409) {
                    msg = msg || "Password reset failed. Please try again.";
                  } else {
                    msg = msg || `Server returned ${response.status}`;
                  }

                  showMessage("error", msg, "reset");
                  throw new Error(msg);
                });
              }

              return response.json();
            })
            .then((data) => {
              debugLog("Password reset response:", data);

              if (data && data.success !== false) {
                showMessage(
                  "success",
                  "Password reset successful. You can now log in with your new password...",
                  "reset"
                );

                // Redirect to login after 3 seconds
                setTimeout(() => {
                  window.location.href = "/pages/auth-pages/auth.html";
                }, 3000);
              } else {
                const errorMsg =
                  data?.message || data?.error || "Failed to reset password. Please try again!";
                showMessage("error", errorMsg, "reset");
              }
            })
            .catch((error) => {
              debugLog(`Error: ${error.message}`);

              let errorMessage = "Failed to reset password. Please try again.";

              if (error.message.toLowerCase().includes("fetch")) {
                errorMessage = "Cannot connect to server. Please check your internet connection.";
              } else if (error.message.toLowerCase().includes("invalid")) {
                errorMessage = "Invalid password.";
              } else if (error.message.toLowerCase().includes("not found")) {
                errorMessage = "Registration service temporarily unavailable.";
              } else if (error.message.toLowerCase().includes("server error")) {
                errorMessage = "Server error. Please try again later.";
              }

              showMessage("error", errorMessage, "reset");
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
  }  
  
  return false;
}