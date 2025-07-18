const mongoose = require('mongoose');

const AnalyticsPageviewSchema = new mongoose.Schema({
        url: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        sessionId: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        referrer: { type: String },
        utm: { type: Object },
        device: { type: String },
        os: { type: String },
        browser: { type: String },
        ip: { type: String },
        geolocation: {
                country: String,
                region: String,
                city: String,
                lat: Number,
                lon: Number
        },
        scrollDepth: { type: Number },
        duration: { type: Number }, // time spent on page in seconds
        isBounce: { type: Boolean, default: false }
});

module.exports = mongoose.model('AnalyticsPageview', AnalyticsPageviewSchema); 