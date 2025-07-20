// API Configuration
const blogApiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api'
        : window.location.hostname === 'admin.yourdomain.com'
        ? 'https://admin.yourdomain.com/api'
        : 'https://api.yourdomain.com/api';

document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('blogForm');
        const publishBtn = document.getElementById('publishBtn');
        const inlineImageUpload = document.getElementById('inlineImageUpload');

        // after dom loaded, add references
        const categorySelect = document.getElementById('category');
        const genreSelect = document.getElementById('genre');

        // Genre dropdown is always visible now; no toggle needed

        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
                window.location.href = 'accessDenied.html';
                return;
        }

        // Initialize Quill editor
        const toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                ['link', 'image', 'video'],
                [{ 'header': [1, 2, false] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean']
        ];

        const quill = new Quill('#editor', {
                theme: 'snow',
                modules: {
                        toolbar: toolbarOptions
                }
        });

        // Detect edit mode
        const urlParams = new URLSearchParams(window.location.search);
        const editPostId = urlParams.get('edit');

        if (editPostId) {
                // Switch UI to edit mode
                publishBtn.textContent = 'Update Post';

                // Fetch existing post data
                fetch(`${blogApiUrl}/posts/${editPostId}`)
                        .then(res => res.json())
                        .then(post => {
                                // Populate fields
                                form.querySelector('#title').value = post.title || '';
                                form.querySelector('#author').value = post.author || '';

                                // Category & genre
                                if (post.category) {
                                        categorySelect.value = post.category;
                                        if (post.genre) {
                                                genreSelect.value = post.genre;
                                        }
                                }

                                // Tags
                                if (post.tags && Array.isArray(post.tags)) {
                                        form.querySelector('#tags').value = post.tags.join(', ');
                                }

                                // Quill content
                                quill.root.innerHTML = post.description || '';
                                // Show existing header image preview
                                if (post.headerImage) {
                                        const preview = document.createElement('img');
                                        preview.src = post.headerImage;
                                        preview.alt = 'Current Header Image';
                                        preview.className = 'w-full max-w-xs mb-2 rounded';
                                        const headerInput = form.querySelector('#headerImage');
                                        headerInput.parentNode.insertBefore(preview, headerInput);
                                }
                        })
                        .catch(err => {
                                console.error('Failed to load post for editing', err);
                                showNotification('Failed to load post data.', 'error');
                        });
        }

        form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Get form data
                const title = form.querySelector('#title').value.trim();
                const author = form.querySelector('#author').value.trim();
                const tags = form.querySelector('#tags').value.trim();
                const headerImage = form.querySelector('#headerImage').files[0];

                // Validation
                if (!title) {
                        showNotification('Please enter a blog title.', 'error');
                        return;
                }

                if (!author) {
                        showNotification('Please enter an author name.', 'error');
                        return;
                }

                // Get content from Quill editor
                const contentHtml = quill.root.innerHTML;
                if (contentHtml === '<p><br></p>' || contentHtml === '') {
                        showNotification('Please enter some content for your blog post.', 'error');
                        return;
                }

                publishBtn.textContent = 'Publishing...';
                publishBtn.disabled = true;

                const formData = new FormData(form);
                formData.append('description', contentHtml);

                // Ensure single values for category & genre (replace any existing entries)
                formData.set('category', categorySelect.value);
                if (genreSelect.value) {
                        formData.set('genre', genreSelect.value);
                } else {
                        formData.delete('genre');
                }

                // Process tags
                const tagsArray = [...new Set(tags.split(',').map(tag => tag.trim()).filter(Boolean))];
                formData.set('tags', JSON.stringify(tagsArray));

                // Validate header image size
                if (headerImage && headerImage.size > 20 * 1024 * 1024) {
                        showNotification('Header image size exceeds 20MB limit.', 'error');
                        publishBtn.disabled = false;
                        publishBtn.textContent = 'Save & Publish';
                        return;
                }

                try {
                        const endpoint = editPostId ? `${blogApiUrl}/posts/${editPostId}` : `${blogApiUrl}/posts`;
                        const method = editPostId ? 'PATCH' : 'POST';

                        const response = await fetch(endpoint, {
                                method,
                                headers: {
                                        'Authorization': `Bearer ${token}`
                                },
                                body: formData
                        });

                        const data = await response.json();

                        if (!response.ok) {
                                showNotification(data.message || 'Failed to publish post.', 'error');
                                throw new Error(data.message || 'Failed to publish post.');
                        }

                        showNotification(editPostId ? 'Post updated successfully!' : 'Post published successfully!', 'success');

                        // Reset form
                        form.reset();
                        quill.setContents([]);

                        // Clear file input
                        const fileInput = form.querySelector('#headerImage');
                        fileInput.value = '';

                        if (editPostId) {
                                // Redirect back to admin posts list
                                setTimeout(() => {
                                        window.location.href = 'admin.html';
                                }, 500);
                                return;
                        }

                } catch (error) {
                        console.error('Error:', error);
                        showNotification('Network error. Please try again.', 'error');
                } finally {
                        publishBtn.disabled = false;
                        publishBtn.textContent = 'Save & Publish';
                }
        });

        // Function to insert an inline image
        window.insertImage = () => {
                inlineImageUpload.click();
        };

        // Handle inline image upload
        inlineImageUpload.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // Validate file type
                if (!file.type.startsWith('image/')) {
                        showNotification('Please select an image file.', 'error');
                        return;
                }

                // Validate file size (5MB limit for inline images)
                if (file.size > 5 * 1024 * 1024) {
                        showNotification('Image size must be less than 5MB.', 'error');
                        return;
                }

                const formData = new FormData();
                formData.append('image', file);

                try {
                        const uploadResponse = await fetch(`${blogApiUrl}/posts/upload-inline-image`, {
                                method: 'POST',
                                headers: {
                                        'Authorization': `Bearer ${token}`
                                },
                                body: formData
                        });

                        if (!uploadResponse.ok) {
                                throw new Error('Upload failed');
                        }

                        const data = await uploadResponse.json();

                        // Insert the image into the editor
                        const range = quill.getSelection();
                        if (range) {
                                quill.insertEmbed(range.index, 'image', data.imageUrl);
                                quill.setSelection(range.index + 1);
                        }

                        showNotification('Image uploaded and inserted successfully!', 'success');

                } catch (error) {
                        console.error('Upload error:', error);
                        showNotification('Failed to upload image. Please try again.', 'error');
                }

                // Clear the file input
                inlineImageUpload.value = '';
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
