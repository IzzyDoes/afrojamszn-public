const express = require('express');
const router = express.Router();
const { upload, uploadImages } = require('../middleware/multer'); // Correctly import 'upload'
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { sanitizeBlogContent } = require('../middleware/sanitization');
const {
        getAllPosts,
        getSinglePost,
        getPostBySlug,
        createPost,
        updatePost,
        deletePost,
        uploadInlineImage,
        searchPost // Ensure this is imported
} = require('../controllers/posts');

// Define routes

// Public routes (no authentication required)
router.get('/search', searchPost); // Place this before the '/' route
router.get('/slug/:slug', getPostBySlug); // Get post by slug
router.get('/:id', getSinglePost);
router.get('/', getAllPosts);

// Protected routes (admin authentication required)
router.post('/', verifyToken, requireAdmin, uploadImages, sanitizeBlogContent, createPost);
router.patch('/:id', verifyToken, requireAdmin, uploadImages, sanitizeBlogContent, updatePost);
router.delete('/:id', verifyToken, requireAdmin, deletePost);

// New route for uploading inline images (protected)
router.post('/upload-inline-image', verifyToken, requireAdmin, upload.single('inlineImage'), uploadInlineImage); // Ensure 'upload' is defined

module.exports = router;
