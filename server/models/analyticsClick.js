const mongoose = require('mongoose');

const AnalyticsClickSchema = new mongoose.Schema({
        element: { type: String, required: true },
        page: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        sessionId: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        ip: { type: String },
        userAgent: { type: String },
        utm: { type: Object }
});

module.exports = mongoose.model('AnalyticsClick', AnalyticsClickSchema); 