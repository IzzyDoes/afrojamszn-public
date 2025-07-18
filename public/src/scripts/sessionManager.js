// Session Manager for automatic logout and inactivity detection
class SessionManager {
        constructor() {
                this.inactivityTimeout = 30 * 60 * 1000; // 30 minutes of inactivity
                this.warningTimeout = 5 * 60 * 1000; // Show warning 5 minutes before logout
                this.inactivityTimer = null;
                this.warningTimer = null;
                this.isWarningShown = false;
                this.lastActivity = Date.now();
                
                this.init();
        }

        init() {
                // Only initialize if user is logged in
                if (!this.isLoggedIn()) {
                        return;
                }

                this.resetTimers();
                this.setupActivityListeners();
                this.checkTokenExpiration();
                
                // Check token every minute
                setInterval(() => {
                        this.checkTokenExpiration();
                }, 60000);
        }

        isLoggedIn() {
                return localStorage.getItem('token') !== null || document.cookie.includes('token=');
        }

        resetTimers() {
                // Clear existing timers
                if (this.inactivityTimer) {
                        clearTimeout(this.inactivityTimer);
                }
                if (this.warningTimer) {
                        clearTimeout(this.warningTimer);
                }

                this.lastActivity = Date.now();
                this.isWarningShown = false;

                // Set new timers
                this.warningTimer = setTimeout(() => {
                        this.showWarning();
                }, this.inactivityTimeout - this.warningTimeout);

                this.inactivityTimer = setTimeout(() => {
                        this.autoLogout();
                }, this.inactivityTimeout);
        }

        setupActivityListeners() {
                // Track user activity
                const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
                
                activityEvents.forEach(event => {
                        document.addEventListener(event, () => {
                                this.resetTimers();
                        }, { passive: true });
                });

                // Also track visibility changes (tab switching)
                document.addEventListener('visibilitychange', () => {
                                this.resetTimers();
                });
        }

        checkTokenExpiration() {
                const token = localStorage.getItem('token') || (document.cookie.match(/(?:^| )token=([^;]+)/) || [])[1];
                if (!token) {
                        return;
                }

                try {
                        // Decode JWT token (without verification, just to get expiration)
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const expirationTime = payload.exp * 1000; // Convert to milliseconds
                        const currentTime = Date.now();

                        if (currentTime >= expirationTime) {
                                this.autoLogout('Session expired');
                                return;
                        }

                        // If token expires in less than 5 minutes, show warning
                        const timeUntilExpiration = expirationTime - currentTime;
                        if (timeUntilExpiration < this.warningTimeout && !this.isWarningShown) {
                                this.showWarning('Your session will expire soon');
                        }
                } catch (error) {
                        console.error('Error checking token expiration:', error);
                        this.autoLogout('Invalid session');
                }
        }

        showWarning(message = 'You will be logged out due to inactivity') {
                if (this.isWarningShown) {
                        return;
                }

                this.isWarningShown = true;

                // Create warning modal
                const warningModal = document.createElement('div');
                warningModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                warningModal.innerHTML = `
                        <div class="bg-card border border-faded rounded-lg p-6 max-w-md mx-4 shadow-xl">
                                <div class="flex items-center mb-4">
                                        <svg class="w-6 h-6 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                        </svg>
                                        <h3 class="text-lg font-semibold text-text">Session Timeout Warning</h3>
                                </div>
                                <p class="text-faded mb-6">${message}. You will be logged out in 5 minutes unless you continue using the application.</p>
                                <div class="flex justify-end space-x-3">
                                        <button id="extendSession" class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                                Continue Session
                                        </button>
                                        <button id="logoutNow" class="px-4 py-2 bg-faded text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
                                                Logout Now
                                        </button>
                                </div>
                        </div>
                `;

                document.body.appendChild(warningModal);

                // Add event listeners
                const extendBtn = warningModal.querySelector('#extendSession');
                const logoutBtn = warningModal.querySelector('#logoutNow');

                extendBtn.addEventListener('click', () => {
                        this.resetTimers();
                        document.body.removeChild(warningModal);
                        this.showNotification('Session extended!', 'success');
                });

                logoutBtn.addEventListener('click', () => {
                        this.autoLogout('Logged out by user');
                });

                // Auto-remove warning after 5 minutes
                setTimeout(() => {
                        if (document.body.contains(warningModal)) {
                                document.body.removeChild(warningModal);
                        }
                }, this.warningTimeout);
        }

        autoLogout(reason = 'Session timeout') {
                // Clear timers
                if (this.inactivityTimer) {
                        clearTimeout(this.inactivityTimer);
                }
                if (this.warningTimer) {
                        clearTimeout(this.warningTimer);
                }

                // Remove session data and cookies
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                document.cookie = 'token=; Max-Age=0; Path=/; Domain=.afrojamszn.com';
                document.cookie = 'role=; Max-Age=0; Path=/; Domain=.afrojamszn.com';

                // Show notification
                this.showNotification(`Logged out: ${reason}`, 'error');

                // Redirect to correct login page based on host
                setTimeout(() => {
                        const isAdminSubdomain = window.location.hostname === 'admin.afrojamszn.com';
                        window.location.href = isAdminSubdomain ? 'admin-login.html' : 'login.html';
                }, 2000);
        }

        showNotification(message, type) {
                const notification = document.createElement('div');
                notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;

                if (type === 'success') {
                        notification.classList.add('bg-green-600', 'text-white');
                } else {
                        notification.classList.add('bg-red-600', 'text-white');
                }

                notification.textContent = message;
                document.body.appendChild(notification);

                setTimeout(() => {
                        notification.classList.remove('translate-x-full');
                }, 100);

                setTimeout(() => {
                        notification.classList.add('translate-x-full');
                        setTimeout(() => {
                                if (notification.parentNode) {
                                        notification.parentNode.removeChild(notification);
                                }
                        }, 300);
                }, 3000);
        }
}

// Initialize session manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
        new SessionManager();
}); 