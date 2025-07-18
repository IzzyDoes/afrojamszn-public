const mongoose = require('mongoose')
const fs = require('fs')
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

let URI = getSecret('mongo_uri', 'MONGO_URI')
// Ensure we authenticate against the admin database so that the root user works across DBs
if (URI && !URI.includes('authSource=')) {
        const separator = URI.includes('?') ? '&' : '?';
        URI = `${URI}${separator}authSource=admin`;
}
const connectDB = async () => {
        try {
                await mongoose.connect(URI)
                console.log('✅ MongoDB connected successfully!')

                // Seed database with admin user
                const seedDatabase = require('./seeder');
                await seedDatabase();

        } catch (error) {
                console.error('❌ MongoDB connection failed:', error.message);
                process.exit(1);
        }
}

module.exports = connectDB