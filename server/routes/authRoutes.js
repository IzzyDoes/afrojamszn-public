const express = require("express")
const { login, register } = require("../controllers/userAuth")
const { verifyToken } = require("../middleware/authMiddleware")
const router = express.Router()

router.post("/register", register)
router.post("/login", login)

router.get('/verify-token', (req, res) => {
        try {
                // Your token verification logic
                res.status(200).json({ role: 'admin' });  // Ensure res is being used correctly
        } catch (error) {
                res.status(500).json({ message: 'Server error' });
        }
});


module.exports = router