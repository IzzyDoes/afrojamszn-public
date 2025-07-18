// seedPosts.js
require('dotenv').config()
const mongoose = require('mongoose');
const Post = require('./models/posts'); // Adjust the path if your Post model is in a different location

// Sample articles data
const samplePosts = [
        {
                title: "Confusing Asynchronous JavaScript",
                description: "An in-depth look at callbacks, promises, and async/await in JavaScript.",
                author: "Jane Doe",
                tags: ["JavaScript", "Asynchronous", "Programming"],
                headerImageUrl: "https://via.placeholder.com/800x400.png?text=Asynchronous+JavaScript",
                published: true
        },
        {
                title: "A Guide to Node.js Performance Optimization",
                description: "Tips and techniques for improving the performance of your Node.js applications.",
                author: "John Smith",
                tags: ["Node.js", "Performance", "Optimization"],
                headerImageUrl: "https://via.placeholder.com/800x400.jpg?text=Node.js+Performance",
                published: true
        },
        {
                title: "Mastering CSS Grid Layout",
                description: "Learn how to build complex and responsive layouts using CSS Grid.",
                author: "Emily Clark",
                tags: ["CSS", "Web Design", "Frontend"],
                headerImageUrl: "https://via.placeholder.com/800x400.png?text=CSS+Grid+Layout",
                published: false
        },
        {
                title: "Introduction to Machine Learning with Python",
                description: "A beginner's guide to machine learning concepts and implementing them using Python.",
                author: "Michael Lee",
                tags: ["Machine Learning", "Python", "Data Science"],
                headerImageUrl: "https://via.placeholder.com/800x400.jpg?text=Machine+Learning+Python",
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
