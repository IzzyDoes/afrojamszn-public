const AnalyticsPageview = require('../models/analyticsPageview');
const AnalyticsSession = require('../models/analyticsSession');
const geoip = require('geoip-lite');
const { v4: uuidv4 } = require('uuid');

// Helper: parse user agent
function parseUserAgent(ua) {
        if (!ua) return { device: 'Unknown', os: 'Unknown', browser: 'Unknown' };
        // Simple parsing (for demo)
        let device = 'Desktop', os = 'Unknown', browser = 'Unknown';
        if (/mobile/i.test(ua)) device = 'Mobile';
        if (/windows/i.test(ua)) os = 'Windows';
        else if (/mac/i.test(ua)) os = 'MacOS';
        else if (/linux/i.test(ua)) os = 'Linux';
        else if (/android/i.test(ua)) os = 'Android';
        else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
        if (/chrome/i.test(ua)) browser = 'Chrome';
        else if (/safari/i.test(ua)) browser = 'Safari';
        else if (/firefox/i.test(ua)) browser = 'Firefox';
        else if (/edge/i.test(ua)) browser = 'Edge';
        else if (/msie|trident/i.test(ua)) browser = 'IE';
        return { device, os, browser };
}

// Analytics middleware
module.exports = async function analyticsMiddleware(req, res, next) {
        try {
                // Only track GET requests to HTML pages (not API, static, etc)
                if (req.method !== 'GET' || req.path.startsWith('/api/') || req.path.startsWith('/static/')) {
                        return next();
                }
                const url = req.originalUrl.split('?')[0];
                const referrer = req.get('referer') || '';
                const utm = {};
                if (req.query.utm_source) utm.source = req.query.utm_source;
                if (req.query.utm_medium) utm.medium = req.query.utm_medium;
                if (req.query.utm_campaign) utm.campaign = req.query.utm_campaign;
                if (req.query.utm_term) utm.term = req.query.utm_term;
                if (req.query.utm_content) utm.content = req.query.utm_content;
                const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
                const geo = geoip.lookup(ip) || {};
                const ua = req.headers['user-agent'] || '';
                const { device, os, browser } = parseUserAgent(ua);
                // Session logic: use cookie or generate new
                let sessionId = req.cookies?.sessionId;
                if (!sessionId) {
                        sessionId = uuidv4();
                        res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
                }
                req.sessionId = sessionId;
                // Save pageview
                await AnalyticsPageview.create({
                        url,
                        sessionId,
                        referrer,
                        utm,
                        device,
                        os,
                        browser,
                        ip,
                        geolocation: {
                                country: geo.country || '',
                                region: geo.region || '',
                                city: geo.city || '',
                                lat: geo.ll ? geo.ll[0] : undefined,
                                lon: geo.ll ? geo.ll[1] : undefined
                        }
                });
                // Upsert session
                await AnalyticsSession.findOneAndUpdate(
                        { sessionId },
                        {
                                $setOnInsert: {
                                        sessionId,
                                        device,
                                        os,
                                        browser,
                                        ip,
                                        geolocation: {
                                                country: geo.country || '',
                                                region: geo.region || '',
                                                city: geo.city || '',
                                                lat: geo.ll ? geo.ll[0] : undefined,
                                                lon: geo.ll ? geo.ll[1] : undefined
                                        },
                                        start: new Date()
                                },
                                $addToSet: { pages: url }
                        },
                        { upsert: true }
                );
        } catch (err) {
                // Don't block user if analytics fails
        }
        next();
}; 