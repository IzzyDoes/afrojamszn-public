const { response } = require("express")
const jwt = require("jsonwebtoken")
const fs = require("fs")

// Helper function to read Docker secrets or fall back to environment variables
const getSecret = (secretName, envVarName) => {
        try {
                const secretPath = `/run/secrets/${secretName}`;
                if (fs.existsSync(secretPath)) {
                        return fs.readFileSync(secretPath, 'utf8').trim();
                }
        } catch (error) {
                console.log(`Could not read secret ${secretName}, falling back to environment variable`);
        }
        return process.env[envVarName];
};

const verifyToken = (req, res, next) => {
        let token
        let authHeader = req.headers.Authorization || req.headers.authorization
        if (authHeader && authHeader.startsWith("Bearer")) {
                token = authHeader.split(" ")[1]

                if (!token) {
                        return res.status(401).json({ message: ` No token, Authorization denied` })
                }

                try {
                        const jwtSecret = getSecret('jwt_secret', 'JWT_SECRET');
                        if (!jwtSecret) {
                                return res.status(500).json({ message: 'JWT secret not configured' });
                        }
                        
                        const decoded = jwt.verify(token, jwtSecret)
                        req.user = decoded
                        next()
                } catch (error) {
                        return res.status(401).json({ message: `Token is invalid` })
                }
        } else {
                return res.status(401).json({ message: "Authorization header is missing" })
        }
}

// Role-based authorization middleware
const requireAdmin = (req, res, next) => {
        if (!req.user) {
                return res.status(401).json({ message: "Authentication required" })
        }

        if (req.user.role !== 'admin') {
                return res.status(403).json({ message: "Admin access required" })
        }

        next()
}

module.exports = { verifyToken, requireAdmin }