        // Confirm completion function
        function confirmCompletion() {
            if (confirm('Are you sure you want to confirm completion and release funds to the seller? This action cannot be undone.')) {
                // Simulate completion
                alert('Transaction completed successfully! Funds have been released to the seller. You will receive a confirmation email shortly.');
                
                // Update UI to show completion
                document.querySelector('.completion-icon.pending').className = 'completion-icon completed';
                document.querySelector('.completion-icon.completed').innerHTML = '✓';
                document.querySelector('.completion-title').textContent = 'Transaction Completed';
                document.querySelector('.completion-desc').textContent = 'Funds have been released to the seller successfully.';
                
                // Hide action buttons
                document.querySelector('.action-buttons').style.display = 'none';
                document.querySelector('.warning-notice').style.display = 'none';
                
                console.log('Transaction completed');
            }
        }

        // Dispute transaction function
        function disputeTransaction() {
            if (confirm('Are you sure you want to dispute this transaction? Our team will review the case and contact both parties.')) {
                alert('Dispute request submitted successfully. Our team will review the case and contact you within 24 hours.');
                console.log('Transaction disputed');
            }
        }

        // Request changes function
        function requestChanges() {
            const changes = prompt('Please describe the changes you would like to request:');
            if (changes && changes.trim() !== '') {
                alert('Change request sent to the seller. They will be notified and can respond to your request.');
                console.log('Changes requested:', changes);
            }
        }

        // Auto-update transaction status (demo)
        setTimeout(() => {
            console.log('Transaction status updated');
        }, 5000);