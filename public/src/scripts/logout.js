document.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        // No confirm dialog, just logout
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        // Remove token cookies as well
                        document.cookie = 'token=; Max-Age=0; Path=/; Domain=.afrojamszn.com';
                        document.cookie = 'role=; Max-Age=0; Path=/; Domain=.afrojamszn.com';

                        showNotification('Logged out successfully!', 'success');
                        setTimeout(() => {
                                // Redirect to admin login if on admin subdomain, otherwise to main site
                                if (window.location.hostname === 'admin.afrojamszn.com') {
                                        window.location.href = 'admin-login.html';
                                } else {
                                        window.location.href = 'https://afrojamszn.com';
                                }
                        }, 1000);
                });
        }

        // Simple notification function
        function showNotification(message, type) {
                // Create notification element
                const notification = document.createElement('div');
                notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;

                if (type === 'success') {
                        notification.classList.add('bg-green-600', 'text-white');
                } else {
                        notification.classList.add('bg-red-600', 'text-white');
                }

                notification.textContent = message;

                // Add to page
                document.body.appendChild(notification);

                // Animate in
                setTimeout(() => {
                        notification.classList.remove('translate-x-full');
                }, 100);

                // Remove after 3 seconds
                setTimeout(() => {
                        notification.classList.add('translate-x-full');
                        setTimeout(() => {
                                if (notification.parentNode) {
                                        notification.parentNode.removeChild(notification);
                                }
                        }, 300);
                }, 3000);
        }
});
