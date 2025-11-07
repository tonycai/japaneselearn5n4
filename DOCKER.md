# Docker Deployment Guide

Complete guide for deploying the Japanese Study Web Application using Docker and Docker Compose.

## Prerequisites

- Docker installed (version 20.10 or later)
- Docker Compose installed (version 2.0 or later)
- At least 1GB of free disk space

## Quick Start

The easiest way to run the application in a container:

```bash
# From the japanese-study-web directory
docker-compose up -d
```

The application will be available at:
- **http://localhost:8080** (mapped from container port 3000)

## Configuration

### Port Configuration

The default configuration in `docker-compose.yml` maps port **8080** on your host to port 3000 in the container:

```yaml
ports:
  - "8080:3000"
```

**To use a different port**, edit `docker-compose.yml`:

```yaml
ports:
  - "3000:3000"  # Use port 3000
  # or
  - "8888:3000"  # Use port 8888
```

### Port Conflict Resolution

If you see an error like `Bind for 0.0.0.0:8080 failed: port is already allocated`:

1. Check what's using the port:
   ```bash
   lsof -i :8080
   ```

2. Either stop the conflicting service or change the port in `docker-compose.yml`

## Docker Compose Commands

### Start the Application

```bash
# Start in detached mode (background)
docker-compose up -d

# Start with logs visible (foreground)
docker-compose up
```

### View Logs

```bash
# Follow logs in real-time
docker-compose logs -f

# View last 50 lines
docker-compose logs --tail=50

# View specific service logs
docker-compose logs -f japanese-study-web
```

### Check Status

```bash
# List containers
docker-compose ps

# Check health status
docker ps --filter name=japanese-study-web
```

### Stop the Application

```bash
# Stop containers (preserves data)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop, remove containers and volumes
docker-compose down -v
```

### Restart After Code Changes

```bash
# Rebuild and restart
docker-compose up -d --build

# Or do it in two steps
docker-compose build
docker-compose up -d
```

## Manual Docker Commands

If you prefer not to use Docker Compose:

### Build the Image

```bash
docker build -t japanese-study-web .
```

### Run the Container

```bash
docker run -d \
  --name japanese-study-web \
  -p 8080:3000 \
  --restart unless-stopped \
  japanese-study-web
```

### Manage the Container

```bash
# View logs
docker logs -f japanese-study-web

# Stop container
docker stop japanese-study-web

# Start container
docker start japanese-study-web

# Restart container
docker restart japanese-study-web

# Remove container
docker rm -f japanese-study-web
```

## Docker Image Details

### Multi-Stage Build

The Dockerfile uses a 3-stage build process:

1. **deps**: Install dependencies
2. **builder**: Build the Next.js application
3. **runner**: Run the production server

This results in a smaller, optimized image.

### Image Size

- **Base image**: node:20-alpine (~180MB)
- **Final image**: ~250-300MB (with all dependencies and static assets)

### Security Features

- **Non-root user**: Application runs as user `nextjs` (UID 1001)
- **Minimal base image**: Uses Alpine Linux for smaller attack surface
- **Production mode**: NODE_ENV set to production
- **No unnecessary packages**: Only runtime dependencies included

## Health Checks

The container includes a health check that:
- Runs every 30 seconds
- Times out after 10 seconds
- Retries 3 times before marking as unhealthy
- Waits 40 seconds before first check

Check health status:
```bash
docker inspect japanese-study-web | grep -A 10 Health
```

## Environment Variables

The following environment variables are configured in `docker-compose.yml`:

| Variable | Value | Description |
|----------|-------|-------------|
| NODE_ENV | production | Run in production mode |
| PORT | 3000 | Port inside container |
| HOSTNAME | 0.0.0.0 | Bind to all interfaces |

To add custom environment variables, edit `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - HOSTNAME=0.0.0.0
  - CUSTOM_VAR=value
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Check if container exists
docker ps -a | grep japanese-study-web

# Remove and recreate
docker-compose down
docker-compose up -d
```

### Port Already in Use

```bash
# Find what's using the port
lsof -i :8080

# Change port in docker-compose.yml
ports:
  - "8081:3000"  # Use different port
```

### Build Fails

```bash
# Clear build cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache
```

### Container Unhealthy

```bash
# Check health status
docker inspect japanese-study-web | grep -A 10 Health

# Check application logs
docker logs japanese-study-web

# Restart container
docker-compose restart
```

### Out of Disk Space

```bash
# Remove unused images
docker image prune -a

# Remove all stopped containers
docker container prune

# Check disk usage
docker system df
```

## Production Deployment

### Using Docker Compose in Production

```bash
# Start with production settings
docker-compose up -d

# Monitor logs
docker-compose logs -f | tee app.log
```

### Behind a Reverse Proxy (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name japanese-study.example.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### With SSL/TLS (Let's Encrypt)

1. Install certbot
2. Get certificate:
   ```bash
   certbot --nginx -d japanese-study.example.com
   ```

## Maintenance

### Updating the Application

```bash
# Pull latest code
git pull

# Rebuild and restart
cd japanese-study-web
docker-compose up -d --build
```

### Backup Data

Since this is a stateless application, no data backup is needed. All data is stored in static JSON files that are part of the codebase.

### Monitoring

View container stats:
```bash
docker stats japanese-study-web
```

## Performance Tuning

### Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  japanese-study-web:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)

## Summary

The Japanese Study Web Application is now fully containerized and ready for deployment! The Docker setup provides:

✅ Production-ready configuration
✅ Multi-stage optimized build
✅ Health checks for monitoring
✅ Easy deployment and management
✅ Secure non-root execution
✅ Auto-restart on failure

Access your application at **http://localhost:8080** and start learning Japanese!
