const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
        storage: storage,
        limits: {
                fileSize: 20 * 1024 * 1024, // Limit header image size
                fieldSize: 100 * 1024 * 1024 // Set a higher limit for text fields (adjust as needed)
        },
        fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith('image/')) {
                        return cb(new Error('Only Images are allowed'), false);
                }
                cb(null, true);
        }
});

// Middleware for handling single header image and multiple inline images
const uploadImages = upload.fields([
        { name: 'headerImage', maxCount: 1 },
        { name: 'inlineImages', maxCount: 10 } // Allow up to 10 inline images
]);

module.exports = { upload, uploadImages };
