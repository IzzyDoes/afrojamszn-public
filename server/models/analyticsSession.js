const mongoose = require('mongoose');

const AnalyticsSessionSchema = new mongoose.Schema({
        sessionId: { type: String, required: true, unique: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        start: { type: Date, default: Date.now },
        end: { type: Date },
        duration: { type: Number }, // seconds
        pages: [{ type: String }],
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
        isBounce: { type: Boolean, default: false }
});

module.exports = mongoose.model('AnalyticsSession', AnalyticsSessionSchema); 