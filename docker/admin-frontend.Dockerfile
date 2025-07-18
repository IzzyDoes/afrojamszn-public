# ---------- Builder stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY public/src/package*.json ./public/src/
RUN cd public/src && npm ci

# Copy source files
COPY public/src ./public/src

# Build Tailwind output
RUN cd public/src && npm run build

# ---------- Runtime stage ----------
FROM nginx:stable-alpine

# Copy built static assets
COPY --from=builder /app/public/src /usr/share/nginx/html

# Copy only admin HTML files to web root
COPY --from=builder /app/public/src/pages/admin-login.html /usr/share/nginx/html/index.html
COPY --from=builder /app/public/src/pages/admin.html /usr/share/nginx/html/admin.html

# Copy images and other assets
COPY --from=builder /app/public/src/images /usr/share/nginx/html/images/
COPY --from=builder /app/public/src/scripts /usr/share/nginx/html/scripts/
COPY --from=builder /app/public/src/output.css /usr/share/nginx/html/output.css

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 