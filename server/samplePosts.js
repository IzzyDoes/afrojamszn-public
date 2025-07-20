// seedPosts.js
require('dotenv').config()
const mongoose = require('mongoose');
const Post = require('./models/posts'); // Adjust the path if your Post model is in a different location

// Sample articles data
const samplePosts = [
        {
                title: "Getting Started with Web Development",
                description: "A comprehensive guide for beginners looking to start their journey in web development. Learn the basics of HTML, CSS, and JavaScript.",
                author: "Web Dev Team",
                tags: ["Web Development", "HTML", "CSS", "JavaScript", "Beginner"],
                headerImageUrl: "https://via.placeholder.com/800x400.png?text=Web+Development+Guide",
                published: true
        },
        {
                title: "Understanding Modern JavaScript Frameworks",
                description: "Explore the world of modern JavaScript frameworks like React, Vue, and Angular. Learn when to use each one and their key differences.",
                author: "Tech Writer",
                tags: ["JavaScript", "React", "Vue", "Angular", "Frontend"],
                headerImageUrl: "https://via.placeholder.com/800x400.jpg?text=JavaScript+Frameworks",
                published: true
        },
        {
                title: "The Future of Web Design",
                description: "Discover the latest trends in web design and how they're shaping the future of user experience and interface design.",
                author: "Design Expert",
                tags: ["Web Design", "UX", "UI", "Trends", "Design"],
                headerImageUrl: "https://via.placeholder.com/800x400.png?text=Future+of+Web+Design",
                published: false
        },
        {
                title: "Introduction to Backend Development",
                description: "Learn the fundamentals of backend development including databases, APIs, and server-side programming concepts.",
                author: "Backend Developer",
                tags: ["Backend", "API", "Database", "Server", "Programming"],
                headerImageUrl: "https://via.placeholder.com/800x400.jpg?text=Backend+Development",
                published: true
        }
];

// Function to connect to MongoDB
const connectDB = async () => {
        try {
                await mongoose.connect(process.env.MONGO_URI);
                // MongoDB connected successfully.
        } catch (error) {
                console.error('MongoDB connection failed:', error);
                process.exit(1);
        }
};

// Seed function
const seedPosts = async () => {
        try {
                await connectDB();

                // Optional: Clear existing posts to avoid duplicates
                // Uncomment the following lines if you want to remove existing posts
                // await Post.deleteMany({});
                // console.log('Existing posts removed.');

                // Insert sample posts
                await Post.insertMany(samplePosts);
                // Sample posts have been added successfully.

                // Close the database connection
                mongoose.connection.close();
        } catch (error) {
                console.error('Error seeding posts:', error);
                mongoose.connection.close();
                process.exit(1);
        }
};

// Run the seed function
seedPosts();
