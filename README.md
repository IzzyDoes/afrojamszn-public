# Blog Platform - Full Stack Web Application

A modern, full-stack blog platform built with Node.js, Express, MongoDB, and vanilla JavaScript. Features include content management, user authentication, analytics, and responsive design.

## 🚀 Features

- **Content Management**: Rich text editor with image uploads
- **User Authentication**: JWT-based authentication with role-based access
- **Analytics Dashboard**: Real-time analytics with Google Charts integration
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Search & Filter**: Server-side search with debounced queries
- **Docker Support**: Containerized deployment with Docker Compose
- **Security**: Input sanitization, CORS protection, rate limiting

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **Authentication**: JWT tokens
- **File Upload**: Cloudinary integration
- **Deployment**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Docker (optional, for containerized deployment)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example.txt server/.env
   
   # Edit the .env file with your configuration
   nano server/.env
   ```

4. **Start the development servers**
   ```bash
   # Start backend (from server directory)
   npm run dev
   
   # Start frontend (from public/src directory)
   npm run dev
   ```

### Docker Deployment

1. **Set up environment variables**
   ```bash
   # Create a .env file in the root directory
   cp server/env.example.txt .env
   # Edit .env with your production values
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/your_database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Google Maps API Key (optional, for analytics)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Domain Configuration

Update the following files to use your domain:

- `server/app.js`: Update CORS origins and CSP directives
- `public/src/scripts/*.js`: Update API endpoints and cookie domains

## 📁 Project Structure

```
├── server/                 # Backend application
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── app.js           # Main server file
├── public/src/           # Frontend application
│   ├── pages/           # HTML pages
│   ├── scripts/         # JavaScript files
│   └── images/          # Static assets
├── docker/              # Docker configuration
└── docker-compose.yml   # Docker Compose setup
```

## 🔐 Security Features

- JWT-based authentication
- Input sanitization and validation
- CORS protection
- Rate limiting (configurable)
- Content Security Policy (CSP)
- Secure cookie configuration

## 📊 Analytics

The platform includes a comprehensive analytics system:

- Page views and unique visitors
- Session tracking
- Geographic data (with Google Maps integration)
- Device and browser analytics
- Click event tracking
- UTM parameter tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Responsive design with Tailwind CSS
- Analytics powered by Google Charts
- Image optimization with Cloudinary
