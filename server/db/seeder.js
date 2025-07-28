const User = require('../models/userModel');
const Post = require('../models/posts');
const AnalyticsPageview = require('../models/analyticsPageview');
const AnalyticsSession = require('../models/analyticsSession');
const AnalyticsClick = require('../models/analyticsClick');
const AnalyticsError = require('../models/analyticsError');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
        try {
                // Seed admin user
                await seedAdminUser();

                // Seed sample posts (only in development)
                if (process.env.NODE_ENV === 'development') {
                        await seedSamplePosts();
                        await seedSampleAnalytics();
                }

        } catch (error) {
                console.error(' Error seeding database:', error);
        }
};

const seedAdminUser = async () => {
        try {
                // Check if admin user already exists
                const adminExists = await User.findOne({ username: 'admin' });

                if (!adminExists) {
                        // Hash the password
                        const hashedPassword = await bcrypt.hash('admin1', 10);

                        // Create admin user
                        const adminUser = new User({
                                username: 'admin',
                                password: hashedPassword,
                                role: 'admin'
                        });

                        await adminUser.save();
                        console.log(' Admin user created successfully');
                        console.log(' Username: ');
                        console.log(' Password: ');
                        console.log(' IMPORTANT: Change these default credentials in production!');
                } 
        } catch (error) {
                console.error('Error creating admin user:', error);
        }
};

const seedSamplePosts = async () => {
        try {
                // Check if posts already exist
                const postsCount = await Post.countDocuments();

                if (postsCount === 0) {
                        const samplePosts = [
                                {
                                        title: 'Welcome to My Blog',
                                        description: '<p>This is my first blog post. Welcome to my personal blog where I share my thoughts and experiences.</p>',
                                        author: 'Admin',
                                        tags: ['welcome', 'first-post'],
                                        published: true
                                },
                                {
                                        title: 'Getting Started with Web Development',
                                        description: '<p>Web development can seem overwhelming at first, but with the right approach, anyone can learn it. In this post, I\'ll share some tips for beginners.</p>',
                                        author: 'Admin',
                                        tags: ['web-development', 'tutorial', 'beginners'],
                                        published: true
                                },
                                {
                                        title: 'The Future of Technology',
                                        description: '<p>Technology is evolving at an incredible pace. Let\'s explore what the future might hold for us.</p>',
                                        author: 'Admin',
                                        tags: ['technology', 'future', 'innovation'],
                                        published: false // Draft post
                                }
                        ];

                        await Post.insertMany(samplePosts);
                        console.log(' Sample posts created successfully');
                } else {
                        console.log('Posts already exist, skipping sample data');
                }
        } catch (error) {
                console.error('Error creating sample posts:', error);
        }
};

const seedSampleAnalytics = async () => {
        try {
                // Check if analytics data already exists
                const analyticsCount = await AnalyticsPageview.countDocuments();

                if (analyticsCount === 0) {
                        // Sample pageviews
                        const samplePageviews = [
                                {
                                        sessionId: 'session1',
                                        url: '/',
                                        ip: '192.168.1.1',
                                        referrer: 'https://google.com',
                                        device: 'desktop',
                                        os: 'Windows',
                                        browser: 'Chrome',
                                        geolocation: { country: 'US', city: 'New York' },
                                        scrollDepth: 75,
                                        utm: 'utm_source=google&utm_medium=cpc'
                                },
                                {
                                        sessionId: 'session1',
                                        url: '/blog',
                                        ip: '192.168.1.1',
                                        referrer: 'https://google.com',
                                        device: 'desktop',
                                        os: 'Windows',
                                        browser: 'Chrome',
                                        geolocation: { country: 'US', city: 'New York' },
                                        scrollDepth: 90,
                                        utm: 'utm_source=google&utm_medium=cpc'
                                },
                                {
                                        sessionId: 'session2',
                                        url: '/',
                                        ip: '192.168.1.2',
                                        referrer: 'https://twitter.com',
                                        device: 'mobile',
                                        os: 'iOS',
                                        browser: 'Safari',
                                        geolocation: { country: 'UK', city: 'London' },
                                        scrollDepth: 45,
                                        utm: 'utm_source=twitter&utm_medium=social'
                                }
                        ];

                        // Sample sessions
                        const sampleSessions = [
                                {
                                        sessionId: 'session1',
                                        startTime: new Date(Date.now() - 3600000), // 1 hour ago
                                        endTime: new Date(Date.now() - 3000000), // 50 minutes ago
                                        duration: 600000, // 10 minutes
                                        isBounce: false,
                                        ip: '192.168.1.1'
                                },
                                {
                                        sessionId: 'session2',
                                        startTime: new Date(Date.now() - 1800000), // 30 minutes ago
                                        endTime: new Date(Date.now() - 1700000), // 28 minutes ago
                                        duration: 120000, // 2 minutes
                                        isBounce: true,
                                        ip: '192.168.1.2'
                                }
                        ];

                        // Sample clicks
                        const sampleClicks = [
                                {
                                        sessionId: 'session1',
                                        element: 'nav-link',
                                        page: '/',
                                        ip: '192.168.1.1'
                                },
                                {
                                        sessionId: 'session1',
                                        element: 'blog-card',
                                        page: '/blog',
                                        ip: '192.168.1.1'
                                },
                                {
                                        sessionId: 'session2',
                                        element: 'header-logo',
                                        page: '/',
                                        ip: '192.168.1.2'
                                }
                        ];

                        // Sample errors
                        const sampleErrors = [
                                {
                                        sessionId: 'session1',
                                        error: '404 Not Found',
                                        url: '/nonexistent-page',
                                        ip: '192.168.1.1'
                                }
                        ];

                        await AnalyticsPageview.insertMany(samplePageviews);
                        await AnalyticsSession.insertMany(sampleSessions);
                        await AnalyticsClick.insertMany(sampleClicks);
                        await AnalyticsError.insertMany(sampleErrors);

                        console.log('Sample analytics data created successfully');
                } else {
                        console.log('Analytics data already exists, skipping sample data');
                }
        } catch (error) {
                console.error('Error creating sample analytics data:', error);
        }
};

module.exports = seedDatabase; 
