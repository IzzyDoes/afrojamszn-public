// Helper function to strip HTML tags
function stripHtmlTags(html) {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
}

const debounce = (func, delay) => {
        let timeoutID;
        return (...args) => {
                if (timeoutID) clearTimeout(timeoutID);
                timeoutID = setTimeout(() => {
                        func.apply(this, args);
                }, delay);
        };
};

// API Configuration
const searchApiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api'
        : window.location.hostname === 'admin.yourdomain.com'
        ? 'https://admin.yourdomain.com/api'
        : 'https://api.yourdomain.com/api';

const performSearch = async (query) => {
        const blogContainer = document.querySelector('.card-container-main');
        const paginationContainer = blogContainer.querySelector('.flex.justify-center');
        // Remove any previous no-results message
        const prevNoResults = blogContainer.querySelector('.no-results-message');
        if (prevNoResults) prevNoResults.remove();
        // Remove all cards
        const existingCards = blogContainer.querySelectorAll('.card');
        existingCards.forEach(card => card.remove());
        // Remove previous no-posts message
        const prevMsg = blogContainer.querySelector('.no-posts-message');
        if (prevMsg) prevMsg.remove();
        // Hide pagination during search
        if (paginationContainer) paginationContainer.style.display = 'none';

        if (!query) {
                // If the query is empty, fetch and display all posts with pagination
                if (window.fetchAndRenderPage) {
                        if (paginationContainer) paginationContainer.style.display = '';
                        window.fetchAndRenderPage(1);
                }
                return;
        }
        try {
                const response = await fetch(`${searchApiUrl}/posts/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) { 
                        console.error('Search API error:', response.status, response.statusText);
                        throw new Error(`Network response was not ok: ${response.status}`);
                }
                const data = await response.json();
                console.log('Search results:', data);
                displayResults(data.searchResult || []);
        } catch (error) {
                console.error('Error fetching search results:', error);
                displayResults([]);
        }
};

const displayResults = (posts) => {
        const blogContainer = document.querySelector('.card-container-main');
        const paginationContainer = blogContainer.querySelector('.flex.justify-center');
        // Remove any previous no-results message
        const prevNoResults = blogContainer.querySelector('.no-results-message');
        if (prevNoResults) prevNoResults.remove();
        // Remove all cards
        const existingCards = blogContainer.querySelectorAll('.card');
        existingCards.forEach(card => card.remove());
        // Remove previous no-posts message
        const prevMsg = blogContainer.querySelector('.no-posts-message');
        if (prevMsg) prevMsg.remove();
        // Hide pagination during search
        if (paginationContainer) paginationContainer.style.display = 'none';

        // Sort posts by recency (most recent first)
        if (posts && posts.length > 0) {
                posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        if (!posts || posts.length === 0) {
                const noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results-message text-center py-8 text-faded';
                noResultsMessage.innerHTML = '<p class="text-lg">No posts found matching your search.</p>';
                blogContainer.insertBefore(noResultsMessage, paginationContainer);
                return;
        }

        posts.forEach((post) => {
                const { _id, title, description, category, genre, createdAt, author } = post;
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
                                        </div>
                                </div>
                                <h2 class="card-title text-xl font-bold mb-3">
                                        <a href="blog.html?${(post.slug && post.slug !== 'undefined') ? `slug=${post.slug}` : `id=${post._id}`}" class="blog-link hover:text-accent transition-colors duration-200">${title || 'No Title'}</a>
                                </h2>
                                <p class="text-faded mb-4">${truncatedDescription}</p>
                                <div class="flex justify-between items-center">
                                        <div class="flex items-center space-x-2">
                                                <img src="../images/profile-avatar.png" alt="Author" class="w-6 h-6 rounded-full">
                                                <span class="text-sm text-faded">${author || 'Unknown Author'}</span>
                                        </div>
                                        <a href="blog.html?${(post.slug && post.slug !== 'undefined') ? `slug=${post.slug}` : `id=${post._id}`}" class="blog-link text-accent hover:text-blue-400 transition-colors duration-200 text-sm font-semibold">
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
                                const url = `${window.location.origin}/blog.html?${(post.slug && post.slug !== 'undefined') ? `slug=${post.slug}` : `id=${post._id}`}`;
                                navigator.clipboard.writeText(url).then(() => {
                                        showNotification('Post link copied to clipboard!', 'success');
                                }).catch(() => {
                                        showNotification('Failed to copy link.', 'error');
                                });
                        });
                }

                blogContainer.insertBefore(card, paginationContainer);

                // Save list state before navigating
                const links = card.querySelectorAll('.blog-link');
                links.forEach(l => {
                        l.addEventListener('click', () => {
                                const page = window.currentPage || 1;
                                sessionStorage.setItem('blogListPage', page);
                                sessionStorage.setItem('blogListScroll', window.scrollY);
                        });
                });
        });
};

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
        // Get the search input element
        const searchInput = document.getElementById('search-input');
        console.log('Search input element:', searchInput);

        // Create a debounced version of the search function
        const debouncedSearch = debounce(function (event) {
                const query = event.target.value.trim();
                console.log('Search query:', query);
                performSearch(query);
        }, 300); // 300 milliseconds delay

        // Add event listener for input changes
        if (searchInput) {
                console.log('Adding search event listeners');
                searchInput.addEventListener('input', debouncedSearch);

                // Handle Enter key for search
                searchInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                                e.preventDefault();
                                performSearch(searchInput.value.trim());
                        }
                });
        } else {
                console.error('Search input element not found!');
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
