# AfroJamSzn - Full Stack Music Blog Platform

This is a simple, full-stack music publication platform built with Node.js, Express, MongoDB, and vanilla JavaScript. It features a clean administrator panel, JWT authentication, comprehensive analytics, and responsive design.

## 🚀 Live Site

- **Main Blog**: [afrojamszn.com](https://afrojamszn.com)
- **Admin Panel**: [admin.afrojamszn.com](https://admin.afrojamszn.com)

## ✨ Features

### 🎨 Frontend
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Clean, professional interface optimized for music content
- **Real-time Search**: Debounced search functionality across all posts
- **Session Management**: Automatic logout with inactivity warnings
- **Analytics Dashboard**: Comprehensive user behavior tracking
- **Social Integration**: Share buttons and author social links

### 🔧 Backend
- **RESTful API**: Express.js with proper routing and middleware
- **JWT Authentication**: Secure admin authentication with role-based access
- **MongoDB Integration**: Mongoose ODM with optimized queries
- **File Upload**: Cloudinary integration for image optimization
- **Input Sanitization**: XSS protection and content validation
- **Analytics Engine**: Custom tracking for page views, clicks, and sessions

### 🛡️ Security & Performance
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Domain-specific access control
- **Content Security Policy**: XSS prevention headers
- **Session Security**: Secure cookie configuration
- **Database Optimization**: Indexed queries for fast performance

## 🛠️ Tech Stack

| Frontend | Backend | Database | DevOps |
|----------|---------|----------|---------|
| HTML5/CSS3 | Node.js | MongoDB | Docker |
| Vanilla JavaScript | Express.js | Mongoose | Docker Compose |
| Tailwind CSS | JWT | Cloudinary | Nginx |
| Quill.js Editor | Multer | Redis-ready | PM2 |

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/afrojamszn-public.git
   cd afrojamszn-public
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd server
   npm install
   
   # Frontend dependencies
   cd ../public/src
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in server directory
   cd ../server
   cp env.example.txt .env
   ```

   Configure your `.env` file with your own credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   FRONTEND_URL=http://localhost:5000
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   ```

5. **Run the application**
   ```bash
   # Development mode
   cd server
   npm run dev
   
   # Or using Docker
   docker-compose up
   ```

6. **Access the application**
   - Main blog: http://localhost:5000
   - Admin panel: http://localhost:5000/admin
   - Login: http://localhost:5000/login

## 📁 Project Structure

```
afrojamszn-public/
├── public/                 # Frontend assets
│   ├── src/
│   │   ├── pages/         # HTML pages (home, admin, login, etc.)
│   │   ├── scripts/       # JavaScript modules
│   │   │   ├── analytics.js    # Analytics dashboard
│   │   │   ├── sessionManager.js # Session management
│   │   │   ├── search.js        # Search functionality
│   │   │   └── notifications.js # UI notifications
│   │   ├── images/        # Static images and logos
│   │   └── output.css     # Compiled Tailwind CSS
├── server/                 # Backend application
│   ├── controllers/        # Route controllers
│   │   ├── posts.js        # Blog post CRUD operations
│   │   ├── userAuth.js     # Authentication logic
│   │   └── analytics.js    # Analytics tracking
│   ├── middleware/         # Custom middleware
│   │   ├── authMiddleware.js # JWT verification
│   │   ├── sanitization.js # Input sanitization
│   │   └── analytics.js    # Analytics tracking
│   ├── models/            # Database models
│   │   ├── posts.js       # Blog post schema
│   │   ├── userModel.js   # User schema
│   │   └── analytics*.js  # Analytics schemas
│   ├── routes/            # API routes
│   │   ├── post.js        # Blog post endpoints
│   │   ├── authRoutes.js  # Authentication endpoints
│   │   └── analytics.js   # Analytics endpoints
│   ├── db/               # Database connection
│   │   ├── posts.js      # MongoDB connection
│   │   └── seeder.js     # Database seeding
│   └── app.js            # Main server file
├── docker/               # Docker configurations
├── docker-compose.yml    # Docker Compose setup
└── README.md            # This file
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Deployment
```bash
# Install PM2 for production
npm install -g pm2

# Start the application
cd server
pm2 start app.js --name "afrojamszn"
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration

### Blog Posts
- `GET /api/posts` - Get all posts with pagination
- `GET /api/posts/:id` - Get single post by ID
- `GET /api/posts/slug/:slug` - Get post by slug
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/search?q=query` - Search posts

### Analytics
- `GET /api/analytics/dashboard` - Get analytics data
- `POST /api/analytics/pageview` - Track page view
- `POST /api/analytics/click` - Track click event
- `POST /api/analytics/session` - Track user session

## 🎨 Customization

### Styling
The frontend uses Tailwind CSS. To modify styles:
1. Edit `public/src/input.css`
2. Run `npx tailwindcss -i input.css -o output.css --watch`

### Content Management
- **Rich Text Editor**: Quill.js WYSIWYG editor
- **Image Upload**: Drag-and-drop with Cloudinary optimization
- **Taxonomy**: Category/genre classification system
- **SEO**: Automatic slug generation and meta tags

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Sanitization**: XSS protection and content validation
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Domain-specific access control
- **Session Management**: Secure session handling with auto-logout
- **Content Security Policy**: XSS prevention headers

## 📊 Analytics & Monitoring

The application includes comprehensive analytics:
- **Page Views**: Track user navigation patterns
- **Click Events**: Monitor user interactions
- **Session Data**: User session duration and behavior
- **Geographic Data**: User location tracking (if available)
- **Referrer Analysis**: Traffic source tracking
- **Error Monitoring**: 404 and error rate tracking

## 🏗️ Architecture Highlights

### Container Architecture
```
Nginx Proxy Manager (Port 80/443)
├── afrojamszn.com → Frontend Container (Port 3000)
├── admin.afrojamszn.com → Admin Panel (Port 3000)  
└── api.afrojamszn.com → Backend API (Port 4000)
```

### Database Design
- **MongoDB**: Document-based storage with Mongoose ODM
- **Collections**: Posts, Users, Analytics (Pageviews, Sessions, Clicks, Errors)
- **Indexing**: Optimized for search queries and pagination
- **Data Validation**: Schema-level validation with custom middleware

### Performance Optimizations
- **Static Asset Delivery**: Pre-built Tailwind CSS, optimized images
- **API Response Caching**: Redis-ready architecture for future scaling
- **Database Queries**: Efficient pagination with skip/limit patterns
- **Image Optimization**: Cloudinary transformations for responsive images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Responsive design with Tailwind CSS
- Secure authentication with JWT
- Cloud storage with Cloudinary
- Containerized with Docker
- Analytics powered by custom tracking system
