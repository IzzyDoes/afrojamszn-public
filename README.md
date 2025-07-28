# Blog Platform - Full Stack Web Application (THIS IS A STRIPPED VERSION OF PRODUCTION CODE)

This was my very first "real" project,it's a full-stack blog platform built with Node.js, Express, MongoDB, and vanilla JavaScript. Features include content management, user authentication, analytics, and responsive design. I chose Javascript as the sole dev language for continuity and also to prpactice my js skills. `honestly, it was a little complex, understanding authentication was a hassle, but yeah so far so good.

## Some Features

- **Content Management**: Rich text editor (I initially built a self made text editor before finding about Quilljs- obvioudly the better choice) with image uploads
- **User Authentication**: JWT-based authentication with role-based access... admin only for now, later in the future, I might add user account
- **Analytics Dashboard**: Real-time analytics with Google Charts integration
- **Search & Filter**: Server-side search with debounced queries

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **Authentication**: JWT tokens
- **File Upload**: Cloudinary integration (Will change to a self hosted option in the near future)
- **Deployment**: Docker, Docker Compose
- 

## If you'd like to use this as a template for your next project

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

   ```

4. **Start the development servers**
   ```bash
   # Start backend (from server directory)
   npm run dev
   
   # Start frontend (from public/src directory)
   npm run dev
   ```


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

Contributing

This repo is closed for any pull requests as they will be rejected. you can fork and maintain a version.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Responsive design with Tailwind CSS
- Analytics powered by Google Charts
- Image optimization with Cloudinary
