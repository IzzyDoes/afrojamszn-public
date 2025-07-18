const xss = require('xss');

// XSS sanitization middleware
const sanitizeInput = (req, res, next) => {
        // Sanitize body parameters
        if (req.body) {
                Object.keys(req.body).forEach(key => {
                        if (typeof req.body[key] === 'string') {
                                req.body[key] = xss(req.body[key]);
                        }
                });
        }

        // Sanitize query parameters
        if (req.query) {
                Object.keys(req.query).forEach(key => {
                        if (typeof req.query[key] === 'string') {
                                req.query[key] = xss(req.query[key]);
                        }
                });
        }

        // Sanitize URL parameters
        if (req.params) {
                Object.keys(req.params).forEach(key => {
                        if (typeof req.params[key] === 'string') {
                                req.params[key] = xss(req.params[key]);
                        }
                });
        }

        next();
};

// Specific sanitization for blog content (allows some HTML tags)
const sanitizeBlogContent = (req, res, next) => {
        if (req.body && req.body.description) {
                // Allow specific HTML tags for rich content
                const allowedTags = {
                        'p': [],
                        'br': [],
                        'strong': [],
                        'em': [],
                        'u': [],
                        'h1': [],
                        'h2': [],
                        'h3': [],
                        'h4': [],
                        'h5': [],
                        'h6': [],
                        'ul': [],
                        'ol': [],
                        'li': [],
                        'blockquote': [],
                        'code': [],
                        'pre': [],
                        'img': ['src', 'alt', 'title', 'width', 'height'],
                        'a': ['href', 'title', 'target'],
                        'span': ['class'],
                        'div': ['class'],
                        'table': [],
                        'thead': [],
                        'tbody': [],
                        'tr': [],
                        'td': [],
                        'th': []
                };

                // Custom XSS filter for blog content
                req.body.description = xss(req.body.description, {
                        whiteList: allowedTags,
                        stripIgnoreTag: true,
                        stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed']
                });
        }

        next();
};

module.exports = {
        sanitizeInput,
        sanitizeBlogContent
}; 