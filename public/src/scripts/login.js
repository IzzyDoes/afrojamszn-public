document.addEventListener('DOMContentLoaded', () => {
        // Get the form elements
        const form = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const submitButton = form.querySelector('button[type="submit"]');
        const registerLink = document.querySelector('a[href="#"]'); // Register link

        let isRegistering = false;

        // Toggle between login and register mode
        if (registerLink) {
                registerLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        isRegistering = !isRegistering;
                        if (isRegistering) {
                                submitButton.textContent = 'Register';
                                registerLink.textContent = 'Already have an account? Login';
                        } else {
                                submitButton.textContent = 'Sign In';
                                registerLink.textContent = 'Don\'t have an account? Register';
                        }
                });
        }

        // Handle form submission (login or register)
        form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const username = usernameInput.value.trim();
                const password = passwordInput.value;

                // Basic validation
                if (!username || !password) {
                        showNotification('Please fill in all fields.', 'error');
                        return;
                }

                // API Configuration
                const loginApiUrl = window.location.hostname === 'localhost'
                        ? 'http://localhost:5000/api'
                        : 'https://api.yourdomain.com/api';

                const endpoint = isRegistering
                        ? `${loginApiUrl}/auth/register`
                        : `${loginApiUrl}/auth/login`;

                const bodyData = JSON.stringify({
                        username: username,
                        password: password
                });

                // Disable submit button during request
                submitButton.disabled = true;
                submitButton.textContent = isRegistering ? 'Registering...' : 'Signing In...';

                try {
                        const response = await fetch(endpoint, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json'
                                },
                                body: bodyData
                        });

                        const data = await response.json();

                        if (response.ok) {
                                if (!isRegistering) {
                                        // Store token and user role in localStorage (current subdomain)
                                        localStorage.setItem('token', data.token);
                                        localStorage.setItem('role', data.role);

                                        // Also set a cookie on parent domain so other subdomains can read it
                                        const twoHours = 2 * 60 * 60; // seconds
                                                        document.cookie = `token=${data.token}; Max-Age=${twoHours}; Path=/; Domain=.yourdomain.com; Secure; SameSite=Lax`;
                document.cookie = `role=${data.role}; Max-Age=${twoHours}; Path=/; Domain=.yourdomain.com; Secure; SameSite=Lax`;

                                        showNotification('Login successful!', 'success');

                                        // Check the role to redirect user accordingly
                                        if (data.role === 'admin') {
                                                setTimeout(() => {
                                                        window.location.href = 'admin.html';
                                                }, 1000);
                                        } else {
                                                setTimeout(() => {
                                                        window.location.href = 'index.html';
                                                }, 1000);
                                        }
                                } else {
                                        showNotification('Registration successful! You can now login.', 'success');
                                        // Toggle back to login mode
                                        if (registerLink) {
                                                registerLink.click();
                                        }
                                }
                        } else {
                                showNotification(data.message || 'An error occurred. Please try again.', 'error');
                        }
                } catch (error) {
                        console.error('Error during form submission:', error);
                        showNotification('Network error. Please check your connection and try again.', 'error');
                } finally {
                        // Re-enable submit button
                        submitButton.disabled = false;
                        submitButton.textContent = isRegistering ? 'Register' : 'Sign In';
                }
        });

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
