const mongoose = require('mongoose');
const slugify = require('slugify'); // Use this for generating slugs

const PostSchema = new mongoose.Schema({
        title: {
                type: String,
                required: [true, 'Must Provide Post Title'],
                trim: true,
                maxLength: [200, 'Title cannot be more than 200 characters']
        },
        description: {
                type: String,
                required: [true, 'Must Provide Post Description'],
                trim: true
        },
        author: {
                type: String,
                required: true,
                trim: true
        },
        authorTwitter: {
                type: String,
                required: false,
                trim: true
        },
        headerImage: {
                type: String, // Store the image URL
                trim: true
        },
        slug: {
                type: String,
                required: true,
                unique: true // Slugs must be unique to avoid URL conflicts
        },
        category: {
                type: String,
                enum: ['New Releases', 'Artists', 'Music Videos', 'Trending/Charts', 'Interviews', 'Uncategorized'],
                default: 'Uncategorized'
        },
        genre: {
                type: String,
                enum: ['Afrobeats', 'Amapiano', 'Hip-Hop', 'Gospel'],
                required: false,
        },
        tags: {
                type: [String], // An array of strings for keyword tagging
                default: []
        },
        createdAt: {
                type: Date,
                default: Date.now // Automatically sets the creation date
        },
        published: {
                type: Boolean,
                default: false // Posts are unpublished (draft) by default
        },
        inlineImages: {
                type: [String],
                default: []
        },
        updatedAt: {
                type: Date,
                default: Date.now
        }
});

// Middleware to automatically generate slug before saving the post
PostSchema.pre('validate', function (next) {
        if (!this.slug) {
                this.slug = slugify(this.title, { lower: true, strict: true });
        }
        next();
});

// Middleware to update the updatedAt field
PostSchema.pre('save', function (next) {
        this.updatedAt = Date.now();
        next();
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
