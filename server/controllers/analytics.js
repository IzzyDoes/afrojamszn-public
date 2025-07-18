const AnalyticsPageview = require('../models/analyticsPageview');
const AnalyticsSession = require('../models/analyticsSession');
const AnalyticsError = require('../models/analyticsError');
const AnalyticsClick = require('../models/analyticsClick');

// Collect pageview event
exports.collectPageview = async (req, res) => {
        try {
                const data = req.body;
                await AnalyticsPageview.create(data);
                res.status(201).json({ success: true });
        } catch (err) {
                res.status(500).json({ success: false, error: err.message });
        }
};

// Collect session event
exports.collectSession = async (req, res) => {
        try {
                const data = req.body;
                await AnalyticsSession.findOneAndUpdate(
                        { sessionId: data.sessionId },
                        data,
                        { upsert: true, new: true }
                );
                res.status(201).json({ success: true });
        } catch (err) {
                res.status(500).json({ success: false, error: err.message });
        }
};

// Collect click event
exports.collectClick = async (req, res) => {
        try {
                const data = req.body;
                await AnalyticsClick.create(data);
                res.status(201).json({ success: true });
        } catch (err) {
                res.status(500).json({ success: false, error: err.message });
        }
};

// Collect scroll event (as pageview update)
exports.collectScroll = async (req, res) => {
        try {
                const { sessionId, url, scrollDepth } = req.body;
                await AnalyticsPageview.findOneAndUpdate(
                        { sessionId, url },
                        { $max: { scrollDepth } },
                        { upsert: true }
                );
                res.status(201).json({ success: true });
        } catch (err) {
                res.status(500).json({ success: false, error: err.message });
        }
};

// Collect error event
exports.collectError = async (req, res) => {
        try {
                const data = req.body;
                await AnalyticsError.create(data);
                res.status(201).json({ success: true });
        } catch (err) {
                res.status(500).json({ success: false, error: err.message });
        }
};

// Dashboard: aggregate metrics
exports.getDashboard = async (req, res) => {
        try {
                // Page views
                const pageViews = await AnalyticsPageview.countDocuments();
                // Unique visitors (by IP for now)
                const uniqueVisitors = await AnalyticsPageview.distinct('ip');
                // Sessions
                const sessions = await AnalyticsSession.countDocuments();
                // Referrers
                const referrers = await AnalyticsPageview.aggregate([
                        { $group: { _id: '$referrer', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                ]);
                // Bounce rate
                const bounces = await AnalyticsSession.countDocuments({ isBounce: true });
                const bounceRate = sessions ? (bounces / sessions) * 100 : 0;
                // Session duration
                const avgSessionDuration = await AnalyticsSession.aggregate([
                        { $group: { _id: null, avg: { $avg: '$duration' } } }
                ]);
                // Geolocation
                const geo = await AnalyticsPageview.aggregate([
                        { $group: { _id: '$geolocation.country', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                ]);
                // Device/OS/Browser
                const device = await AnalyticsPageview.aggregate([
                        { $group: { _id: { device: '$device', os: '$os', browser: '$browser' }, count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                ]);
                // Scroll depth
                const avgScroll = await AnalyticsPageview.aggregate([
                        { $group: { _id: null, avg: { $avg: '$scrollDepth' } } }
                ]);
                // Click events
                const topClicks = await AnalyticsClick.aggregate([
                        { $group: { _id: '$element', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                ]);
                // UTM tags
                const utm = await AnalyticsPageview.aggregate([
                        { $group: { _id: '$utm', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                ]);
                // Errors/404s
                const errors = await AnalyticsError.countDocuments();

                res.json({
                        pageViews,
                        uniqueVisitors: uniqueVisitors.length,
                        sessions,
                        referrers,
                        bounceRate,
                        avgSessionDuration: avgSessionDuration[0]?.avg || 0,
                        geo,
                        device,
                        avgScroll: avgScroll[0]?.avg || 0,
                        topClicks,
                        utm,
                        errors
                });
        } catch (err) {
                res.status(500).json({ success: false, error: err.message });
        }
}; 