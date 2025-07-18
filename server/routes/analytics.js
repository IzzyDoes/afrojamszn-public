const express = require('express');
const router = express.Router();
const analytics = require('../controllers/analytics');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/pageview', analytics.collectPageview);
router.post('/session', analytics.collectSession);
router.post('/click', analytics.collectClick);
router.post('/scroll', analytics.collectScroll);
router.post('/error', analytics.collectError);
router.get('/dashboard', verifyToken, requireAdmin, analytics.getDashboard);

module.exports = router; 