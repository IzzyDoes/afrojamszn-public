const mongoose = require('mongoose');

const AnalyticsErrorSchema = new mongoose.Schema({
        url: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        errorType: { type: String },
        message: { type: String },
        sessionId: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        referrer: { type: String },
        ip: { type: String },
        userAgent: { type: String }
});

module.exports = mongoose.model('AnalyticsError', AnalyticsErrorSchema); 