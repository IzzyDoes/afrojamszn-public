// Function to remove HTML tags and return plain text
function stripHtmlTags(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
}

// API Configuration
const mainApiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api'
        : window.location.hostname === 'admin.afrojamszn.com'
        ? 'https://admin.afrojamszn.com/api'
        : 'https://api.afrojamszn.com/api';

// Determine if we are on the admin sub-domain
const isAdminSubdomain = window.location.hostname === 'admin.afrojamszn.com';

// Run DOM manipulations after DOMContentLoaded event
document.addEventListener('DOMContentLoaded', async () => {
        // Pagination settings
        const postsPerPage = 5;
        let currentPage = 1;
        let totalPages = 1;

        // Get admin and logout buttons
        const adminButton = document.querySelector('#adminBtn');
        const logoutButton = document.querySelector('#logoutBtn');
        // Helper to read cookie value by name
        const getCookie = (name) => {
                const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                return match ? decodeURIComponent(match[2]) : null;
        };

        const token = localStorage.getItem('token') || getCookie('token');
        const role = localStorage.getItem('role') || getCookie('role');
        const isAdmin = role === 'admin';

        // Login button removed from main site - admin access only via admin subdomain

        // Show admin button only for authenticated admins
        if (isAdmin && token && adminButton) {
                adminButton.style.display = 'block';
        } else if (adminButton) {
                adminButton.style.display = 'none';
        }

        // Show logout button only for authenticated users
        if (token && logoutButton) {
                logoutButton.style.display = 'block';
        } else if (logoutButton) {
                logoutButton.style.display = 'none';
        }

        // Add click handlers for buttons

        if (adminButton) {
                adminButton.addEventListener('click', () => {
                        // Admin panel is now completely separate - redirect to admin subdomain
                        window.location.href = 'https://admin.afrojamszn.com';
                });
        }

        // Get blog container and create pagination container
        const blogContainer = document.querySelector('.card-container-main');
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('flex', 'justify-center', 'mt-10', 'space-x-2', 'pb-8', 'px-4', 'w-full');
        blogContainer.appendChild(paginationContainer);

        // Create blog card template
        function createBlogCard(post) {
                const { _id, title, description, category, genre, createdAt, author } = post;
                // Normalize category in case it comes as an array
                const normalizedCategory = Array.isArray(category) ? category[0] : category;
                const badgeText = normalizedCategory || 'Uncategorized';
                const genreBadgeHtml = genre ? `<span class="badge bg-faded text-white text-xs px-2 py-1 rounded-full">${genre}</span>` : '';
                const plainDescription = stripHtmlTags(description);
                const truncatedDescription = plainDescription.length > 150 ? `${plainDescription.substring(0, 150)}...` : plainDescription;

                const card = document.createElement('article');
                card.className = 'card bg-card border border-faded rounded-lg shadow-lg mb-6 overflow-hidden hover:shadow-xl transition-shadow duration-200 relative';
                card.innerHTML = `
                        <div class="card-body p-6">
                                <div class="flex justify-between items-start mb-4">
                                        <div class="flex items-center space-x-2">
                                                <span class="badge bg-accent text-white text-xs px-2 py-1 rounded-full">${badgeText}</span>
                                                ${genreBadgeHtml}
                                                <span class="text-faded text-sm">${new Date(createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div class="flex space-x-2">
                                                <button class="share-btn p-2 rounded-full hover:bg-faded transition-colors duration-200" title="Share this post">
                                                        <svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 text-accent' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 8a3 3 0 11-6 0 3 3 0 016 0zm6 8a3 3 0 11-6 0 3 3 0 016 0zm-6 0a3 3 0 11-6 0 3 3 0 016 0zm6-8a3 3 0 11-6 0 3 3 0 016 0z' /></svg>
                                                </button>
                                                ${(isAdmin && isAdminSubdomain) ? `
                                                        <button class="edit-btn hidden px-3 py-1 rounded bg-faded text-white text-xs hover:bg-accent transition-colors duration-200" data-id="${_id}">Edit</button>
                                                        <button class="delete-btn hidden px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 transition-colors duration-200" data-id="${_id}">Delete</button>
                                                ` : ''}
                                        </div>
                                </div>
                                <h2 class="card-title text-xl font-bold mb-3">
                                        <a href="blog.html?${(post.slug && post.slug !== 'undefined') ? `slug=${post.slug}` : `id=${_id}`}" class="blog-link hover:text-accent transition-colors duration-200">${title || 'No Title'}</a>
                                </h2>
                                <p class="text-faded mb-4">${truncatedDescription}</p>
                                <div class="flex justify-between items-center">
                                        <div class="flex items-center space-x-2">
                                                <img src="../images/profile-avatar.png" alt="Author" class="w-6 h-6 rounded-full">
                                                <span class="text-sm text-faded">${author || 'Unknown Author'}</span>
                                        </div>
                                        <a href="blog.html?${(post.slug && post.slug !== 'undefined') ? `slug=${post.slug}` : `id=${_id}`}" class="blog-link text-accent hover:text-blue-400 transition-colors duration-200 text-sm font-semibold">
                                                Read More →
                                        </a>
                                </div>
                        </div>
                `;

                // Share button logic
                const shareBtn = card.querySelector('.share-btn');
                if (shareBtn) {
                        shareBtn.addEventListener('click', (e) => {
                                e.preventDefault();
                                const url = `${window.location.origin}/blog.html?${(post.slug && post.slug !== 'undefined') ? `slug=${post.slug}` : `id=${_id}`}`;
                                navigator.clipboard.writeText(url).then(() => {
                                        showNotification('Post link copied to clipboard!', 'success');
                                }).catch(() => {
                                        showNotification('Failed to copy link.', 'error');
                                });
                        });
                }

                // Add event listeners for admin buttons
                if (isAdmin && isAdminSubdomain) {
                        const editBtn = card.querySelector('.edit-btn');
                        const deleteBtn = card.querySelector('.delete-btn');

                        editBtn.style.display = 'block';
                        deleteBtn.style.display = 'block';

                        deleteBtn.addEventListener('click', async (e) => {
                                e.preventDefault();

                                const confirmed = await Swal.fire({
                                        title: 'Delete this post?',
                                        text: 'This action cannot be undone.',
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#e3342f',
                                        cancelButtonColor: '#64748b',
                                        confirmButtonText: 'Yes, delete it!'
                                }).then(result => result.isConfirmed);

                                if (!confirmed) return;

                                try {
                                        const deleteResponse = await fetch(`${mainApiUrl}/posts/${_id}`, {
                                                method: 'DELETE',
                                                headers: { 'Authorization': `Bearer ${token}` }
                                        });
                                        if (!deleteResponse.ok) throw new Error('Failed to delete post');

                                        await Swal.fire({
                                                icon: 'success',
                                                title: 'Deleted!',
                                                text: 'Post has been removed.'
                                        });

                                        // Re-fetch current page to ensure list is up-to-date
                                        fetchAndRenderPage(currentPage);

                                } catch (error) {
                                        console.error('Error deleting post', error);
                                        Swal.fire({
                                                icon: 'error',
                                                title: 'Oops...',
                                                text: 'Failed to delete post. Please try again.'
                                        });
                                }
                        });

                        editBtn.addEventListener('click', (e) => {
                                e.preventDefault();
                                window.location.href = `admin.html?edit=${_id}`;
                        });
                }

                return card;
        }

        // Fetch and render posts for a specific page
        const categoryFilterSelect = document.getElementById('category-filter');

        async function fetchAndRenderPage(page) {
                try {
                        const categoryParam = categoryFilterSelect ? `&category=${encodeURIComponent(categoryFilterSelect.value)}` : '';
                        const response = await fetch(`${mainApiUrl}/posts?page=${page}&limit=${postsPerPage}${categoryParam}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (!response.ok) throw new Error('Failed to fetch posts');

                        const data = await response.json();
                        let blogContent = data.posts;
                        totalPages = data.totalPages;

                        // Sort posts by recency (most recent first)
                        blogContent = blogContent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                        // Clear existing posts but keep pagination container
                        const existingCards = blogContainer.querySelectorAll('.card');
                        existingCards.forEach(card => card.remove());

                        // Remove previous message if any
                        const prevMsg = blogContainer.querySelector('.no-posts-message');
                        if (prevMsg) prevMsg.remove();

                        if (blogContent.length === 0) {
                                const noPostsMessage = document.createElement('div');
                                noPostsMessage.className = 'no-posts-message text-center py-8 text-faded';
                                noPostsMessage.innerHTML = '<p class="text-lg">No posts found.</p>';
                                blogContainer.insertBefore(noPostsMessage, paginationContainer);
                        } else {
                                blogContent.forEach(post => {
                                        const card = createBlogCard(post);
                                        blogContainer.insertBefore(card, paginationContainer);

                                        // Attach state-saving to each blog link inside this card
                                        const links = card.querySelectorAll('.blog-link');
                                        links.forEach(l => {
                                                l.addEventListener('click', () => {
                                                        sessionStorage.setItem('blogListPage', currentPage);
                                                        sessionStorage.setItem('blogListScroll', window.scrollY);
                                                });
                                        });
                                });
                        }

                        createPaginationControls();
                } catch (error) {
                        console.error("Error fetching data", error);
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'text-center py-8 text-red-500';
                        errorMessage.innerHTML = '<p class="text-lg">Failed to load posts. Please try again later.</p>';
                        blogContainer.insertBefore(errorMessage, paginationContainer);
                }
        }

        function createPaginationControls() {
                paginationContainer.innerHTML = '';

                if (totalPages <= 1) return;

                // Previous button
                if (currentPage > 1) {
                        const prevButton = document.createElement('button');
                        prevButton.textContent = '← Previous';
                        prevButton.className = 'px-4 py-2 rounded-lg bg-faded text-white font-semibold hover:bg-accent transition-colors duration-200';
                        prevButton.addEventListener('click', () => {
                                currentPage--;
                                fetchAndRenderPage(currentPage);
                        });
                        paginationContainer.appendChild(prevButton);
                }

                // Page numbers
                for (let page = 1; page <= totalPages; page++) {
                        const pageButton = document.createElement('button');
                        pageButton.textContent = page;
                        pageButton.className = `px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${page === currentPage
                                ? 'bg-accent text-white'
                                : 'bg-faded text-white hover:bg-accent'
                                }`;
                        pageButton.addEventListener('click', () => {
                                if (page !== currentPage) {
                                        currentPage = page;
                                        fetchAndRenderPage(currentPage);
                                }
                        });
                        paginationContainer.appendChild(pageButton);
                }

                // Next button
                if (currentPage < totalPages) {
                        const nextButton = document.createElement('button');
                        nextButton.textContent = 'Next →';
                        nextButton.className = 'px-4 py-2 rounded-lg bg-faded text-white font-semibold hover:bg-accent transition-colors duration-200';
                        nextButton.addEventListener('click', () => {
                                currentPage++;
                                fetchAndRenderPage(currentPage);
                        });
                        paginationContainer.appendChild(nextButton);
                }
        }

        // Restore page/scroll from previous session if present
        const savedPage = sessionStorage.getItem('blogListPage');
        const savedScroll = sessionStorage.getItem('blogListScroll');
        if (savedPage) {
                currentPage = parseInt(savedPage);
        }

        fetchAndRenderPage(currentPage).then(() => {
                if (savedScroll) {
                        window.scrollTo(0, parseInt(savedScroll));
                        sessionStorage.removeItem('blogListPage');
                        sessionStorage.removeItem('blogListScroll');
                }
        });

        // Expose for search.js
        window.fetchAndRenderPage = fetchAndRenderPage;
        window.currentPage = currentPage;

        // after initial load fetchAndRenderPage add listener
        if (categoryFilterSelect) {
                categoryFilterSelect.addEventListener('change', () => {
                        currentPage = 1;
                        fetchAndRenderPage(currentPage);
                });
        }
});

// Notification function for share button
function showNotification(message, type) {
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