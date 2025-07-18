const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')
const fs = require('fs')
const app = express()
const postsRouter = require('./routes/post')
const authRouter = require('./routes/authRoutes')
const analyticsRouter = require('./routes/analytics')
const { sanitizeInput } = require('./middleware/sanitization')
const port = process.env.PORT || 5000
const connectDB = require('./db/posts')
const cookieParser = require('cookie-parser');
const analyticsMiddleware = require('./middleware/analytics');
// Import analytics models to ensure collections are created
require('./models/analyticsPageview');
require('./models/analyticsSession');
require('./models/analyticsError');
require('./models/analyticsClick');
require('dotenv').config()

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

// Get configuration from Docker secrets or environment variables
const config = {
        NODE_ENV: getSecret('node_env', 'NODE_ENV') || 'development',
        PORT: getSecret('port', 'PORT') || 5000,
        MONGO_URI: getSecret('mongo_uri', 'MONGO_URI'),
        JWT_SECRET: getSecret('jwt_secret', 'JWT_SECRET'),
        CLOUDINARY_CLOUD_NAME: getSecret('cloudinary_cloud_name', 'CLOUDINARY_CLOUD_NAME'),
        CLOUDINARY_API_KEY: getSecret('cloudinary_api_key', 'CLOUDINARY_API_KEY'),
        CLOUDINARY_API_SECRET: getSecret('cloudinary_api_secret', 'CLOUDINARY_API_SECRET'),
};

const cloudinary = require('cloudinary').v2

cloudinary.config({
        cloud_name: config.CLOUDINARY_CLOUD_NAME,
        api_key: config.CLOUDINARY_API_KEY,
        api_secret: config.CLOUDINARY_API_SECRET,
})


// CORS configuration
const corsOptions = {
        origin: config.NODE_ENV === 'production'
                ? [
                        'https://afrojamszn.com',
                        'https://www.afrojamszn.com',
                        'https://admin.afrojamszn.com',
                        getSecret('frontend_url', 'FRONTEND_URL')
                ].filter(Boolean)
                : '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
// Security middleware
app.use(helmet({
        contentSecurityPolicy: {
                directives: {
                        defaultSrc: ["'self'"],
                        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                        scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdn.quilljs.com"],
                        imgSrc: ["'self'", "data:", "https:", "blob:"],
                        fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
                        connectSrc: ["'self'", "https://afrojamszn.com", "https://api.afrojamszn.com"],
                        frameSrc: ["'none'"],
                        objectSrc: ["'none'"],
                        upgradeInsecureRequests: []
                }
        }
}));

// Rate limiting - temporarily disabled for debugging
// const limiter = rateLimit({
//         windowMs: 15 * 60 * 1000, // 15 minutes
//         max: 100, // limit each IP to 100 requests per windowMs
//         message: 'Too many requests from this IP, please try again later.',
//         standardHeaders: true,
//         legacyHeaders: false,
//         skipSuccessfulRequests: false,
//         skipFailedRequests: false
// });
// app.use('/api/', limiter);

app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' })) // Limit request body size
app.use(sanitizeInput) // Sanitize all input
app.use(cookieParser());
app.use(analyticsMiddleware);

// Trust proxy for rate limiting behind nginx
app.set('trust proxy', 1);

// API routes
app.use('/api/posts', postsRouter)
app.use('/api/auth', authRouter)
app.use('/api/analytics', analyticsRouter)

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public/src')));

// Serve different HTML files based on hostname
app.get('/', (req, res) => {
        if (req.get('host') === 'admin.afrojamszn.com') {
                res.sendFile(path.join(__dirname, '../public/src/pages/login.html'));
        } else {
                res.sendFile(path.join(__dirname, '../public/src/pages/index.html'));
        }
});

app.get('/admin', (req, res) => {
        if (req.get('host') === 'admin.afrojamszn.com') {
                res.sendFile(path.join(__dirname, '../public/src/pages/admin.html'));
        } else {
                res.status(404).send('Not Found');
        }
});

app.get('/login', (req, res) => {
        if (req.get('host') === 'admin.afrojamszn.com') {
                res.sendFile(path.join(__dirname, '../public/src/pages/login.html'));
        } else {
                res.status(404).send('Not Found');
        }
});

app.get('/blog', (req, res) => {
        if (req.get('host') !== 'admin.afrojamszn.com') {
                res.sendFile(path.join(__dirname, '../public/src/pages/blog.html'));
        } else {
                res.status(404).send('Not Found');
        }
});

app.get('/accessDenied', (req, res) => {
        if (req.get('host') === 'admin.afrojamszn.com') {
                res.sendFile(path.join(__dirname, '../public/src/pages/accessDenied.html'));
        } else {
                res.status(404).send('Not Found');
        }
});


// upload image

const start = async () => {
        try {
                await connectDB();
                app.listen(config.PORT, () => {
                        // Server started successfully
                })

        } catch (error) {
                // Log error to production logging service instead of console
                process.exit(1);
        }
}

start() 