        // Sample data structure - this would come from your backend
        const escrowData = [
            {
                id: 'ESC-2025-001234',
                title: 'Web Development Project',
                amount: 1250.00,
                status: 'awaiting',
                service: 'Web Development',
                deadline: '2025-01-15',
                paymentMethod: 'BluQQ Wallet',
                buyer: { name: 'John Smith', avatar: '👤' },
                seller: { name: 'Sarah Johnson', avatar: '👤' },
                role: 'buyer' // Current user's role
            },
            {
                id: 'ESC-2025-001235',
                title: 'Logo Design',
                amount: 450.00,
                status: 'pending',
                service: 'Graphic Design',
                deadline: '2025-01-20',
                paymentMethod: 'BluQQ Wallet',
                buyer: { name: 'Mike Wilson', avatar: '👤' },
                seller: { name: 'You', avatar: '👤' },
                role: 'seller'
            },
            {
                id: 'ESC-2025-001236',
                title: 'Content Writing',
                amount: 750.00,
                status: 'disputed',
                service: 'Content Writing',
                deadline: '2025-01-10',
                paymentMethod: 'BluQQ Wallet',
                buyer: { name: 'Lisa Brown', avatar: '👤' },
                seller: { name: 'Tom Davis', avatar: '👤' },
                role: 'buyer'
            },
            {
                id: 'ESC-2025-001237',
                title: 'Mobile App Development',
                amount: 2500.00,
                status: 'completed',
                service: 'Mobile Development',
                deadline: '2024-12-30',
                paymentMethod: 'BluQQ Wallet',
                buyer: { name: 'You', avatar: '👤' },
                seller: { name: 'Alex Chen', avatar: '👤' },
                role: 'buyer'
            }
        ];

        // Status configuration
        const statusConfig = {
            pending: { class: 'status-pending', icon: '⏳', label: 'Pending' },
            awaiting: { class: 'status-awaiting', icon: '✓', label: 'Awaiting Confirmation' },
            disputed: { class: 'status-disputed', icon: '⚠️', label: 'Disputed' },
            completed: { class: 'status-completed', icon: '✅', label: 'Completed' }
        };

        // Current filter
        let currentFilter = 'all';

        // DOM elements
        const escrowGrid = document.getElementById('escrowGrid');
        const emptyState = document.getElementById('emptyState');
        const filterTabs = document.querySelectorAll('.filter-tab');

        // Initialize the dashboard
        function initDashboard() {
            renderEscrows();
            setupFilterTabs();
        }

        // Render escrow cards
        function renderEscrows() {
            const filteredEscrows = currentFilter === 'all' 
                ? escrowData 
                : escrowData.filter(escrow => escrow.status === currentFilter);

            if (filteredEscrows.length === 0) {
                escrowGrid.style.display = 'none';
                emptyState.style.display = 'block';
                return;
            }

            escrowGrid.style.display = 'grid';
            emptyState.style.display = 'none';

            escrowGrid.innerHTML = filteredEscrows.map(escrow => {
                const status = statusConfig[escrow.status];
                const otherParty = escrow.role === 'buyer' ? escrow.seller : escrow.buyer;
                const otherRole = escrow.role === 'buyer' ? 'seller' : 'buyer';

                return `
                    <div class="escrow-card" onclick="viewEscrow('${escrow.id}')">
                        <div class="escrow-card-header">
                            <div class="escrow-info">
                                <div class="escrow-title">${escrow.title}</div>
                                <div class="escrow-id">ID: #${escrow.id}</div>
                                <div class="escrow-amount">$${escrow.amount.toFixed(2)}</div>
                            </div>
                            <div class="escrow-status ${status.class}">
                                <span>${status.icon}</span>
                                <span>${status.label}</span>
                            </div>
                        </div>

                        <div class="escrow-details">
                            <div class="detail-item">
                                <div class="detail-label">Service</div>
                                <div class="detail-value">${escrow.service}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Deadline</div>
                                <div class="detail-value">${formatDate(escrow.deadline)}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Payment</div>
                                <div class="detail-value">${escrow.paymentMethod}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Your Role</div>
                                <div class="detail-value">${escrow.role.charAt(0).toUpperCase() + escrow.role.slice(1)}</div>
                            </div>
                        </div>

                        <div class="escrow-parties">
                            <div class="party-avatar">${otherParty.avatar}</div>
                            <div class="party-info">
                                <div class="party-name">${otherParty.name}</div>
                                <div class="party-role">${otherRole.charAt(0).toUpperCase() + otherRole.slice(1)}</div>
                            </div>
                        </div>

                        <div class="escrow-actions">
                            ${getActionButtons(escrow)}
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Get action buttons based on escrow status and user role
        function getActionButtons(escrow) {
            switch (escrow.status) {
                case 'pending':
                    return `
                        <a href="/escrow/confirm/${escrow.id}" class="action-btn">View Details</a>
                        <button class="action-btn" onclick="event.stopPropagation(); cancelEscrow('${escrow.id}')">Cancel</button>
                    `;
                case 'awaiting':
                    if (escrow.role === 'buyer') {
                        return `
                            <a href="/escrow/confirm/${escrow.id}" class="action-btn primary">Review & Confirm</a>
                            <button class="action-btn" onclick="event.stopPropagation(); disputeEscrow('${escrow.id}')">Dispute</button>
                        `;
                    } else {
                        return `
                            <a href="/escrow/confirm/${escrow.id}" class="action-btn">View Details</a>
                        `;
                    }
                case 'disputed':
                    return `
                        <a href="/escrow/dispute/${escrow.id}" class="action-btn primary">View Dispute</a>
                        <button class="action-btn" onclick="event.stopPropagation(); contactSupport('${escrow.id}')">Contact Support</button>
                    `;
                case 'completed':
                    return `
                        <a href="/escrow/receipt/${escrow.id}" class="action-btn">View Receipt</a>
                        <button class="action-btn" onclick="event.stopPropagation(); downloadInvoice('${escrow.id}')">Download Invoice</button>
                    `;
                default:
                    return `<a href="/escrow/confirm/${escrow.id}" class="action-btn">View Details</a>`;
            }
        }

        // Setup filter tabs
        function setupFilterTabs() {
            filterTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    filterTabs.forEach(t => t.classList.remove('active'));
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    // Update current filter
                    currentFilter = tab.dataset.filter;
                    // Re-render escrows
                    renderEscrows();
                });
            });
        }

        // Utility functions
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
        }

        function viewEscrow(escrowId) {
            window.location.href = `/escrow/confirm/${escrowId}`;
        }

        function cancelEscrow(escrowId) {
            if (confirm('Are you sure you want to cancel this escrow? This action cannot be undone.')) {
                alert('Escrow cancelled successfully.');
                // Here you would make an API call to cancel the escrow
                console.log('Cancelling escrow:', escrowId);
            }
        }

        function disputeEscrow(escrowId) {
            if (confirm('Are you sure you want to dispute this transaction? Our team will review the case.')) {
                alert('Dispute submitted successfully. Our team will contact you within 24 hours.');
                console.log('Disputing escrow:', escrowId);
            }
        }

        function contactSupport(escrowId) {
            alert('Redirecting to support chat...');
            console.log('Contacting support for escrow:', escrowId);
        }

        function downloadInvoice(escrowId) {
            alert('Downloading invoice...');
            console.log('Downloading invoice for escrow:', escrowId);
        }

        // Initialize dashboard when page loads
        document.addEventListener('DOMContentLoaded', initDashboard);

        // Function to update escrow data (for backend integration)
        function updateEscrowData(newData) {
            escrowData.length = 0;
            escrowData.push(...newData);
            renderEscrows();
        }

        // Export function for backend integration
        window.BluQQEscrowDashboard = {
            updateData: updateEscrowData,
            refresh: renderEscrows
        };