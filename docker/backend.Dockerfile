# Backend image for AfroJamSzn (API)
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies only for production
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy source code
COPY server/ ./server/

# Use production environment
ENV NODE_ENV=production

# Expose backend port
EXPOSE 5000

# Start API server
WORKDIR /app/server
CMD ["node", "app.js"] 