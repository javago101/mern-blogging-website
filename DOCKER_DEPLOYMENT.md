# 🐳 Docker Deployment Guide

## Why Docker is Better?

✅ **Works Everywhere:** AWS, Google Cloud, Azure, DigitalOcean, any Linux server  
✅ **Consistent:** Same environment in dev, staging, and production  
✅ **Easy to Scale:** Duplicate containers for load balancing  
✅ **Isolated:** Each service runs in its own container  
✅ **Version Control:** Rollback to previous versions instantly  

---

## 📦 What's Included

```
mern-blogging-website/
├── docker-compose.yml          # Orchestrates all services
├── .env.example                # Environment variables template
├── server/
│   ├── Dockerfile              # Backend container
│   └── .dockerignore          # Files to exclude
└── blogging website - frontend/
    ├── Dockerfile              # Frontend container (multi-stage build)
    ├── nginx.conf              # Web server config
    └── .dockerignore          # Files to exclude
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Docker
- **Mac:** Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Windows:** Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux:** `curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh`

### 2. Set Up Environment Variables
```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your actual values
nano .env
```

### 3. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Or run in background (detached mode)
docker-compose up -d --build
```

**Access your app:**
- Frontend: http://localhost
- Backend: http://localhost:3000

### 4. Stop Services
```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (database data)
docker-compose down -v
```

---

## 🌐 Deploy to Cloud Platforms

### Option 1: **AWS EC2** (Most Popular)

```bash
# 1. Launch EC2 instance (Ubuntu 22.04)
# 2. SSH into server
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# 4. Clone your repo
git clone https://github.com/javago101/mern-blogging-website.git
cd mern-blogging-website

# 5. Create .env file
nano .env
# (paste your environment variables)

# 6. Run with Docker Compose
docker-compose up -d --build

# Done! Access at http://your-ec2-ip
```

**Cost:** ~$5-10/month (t2.micro/t3.micro)

---

### Option 2: **Google Cloud Run** (Serverless)

```bash
# 1. Install Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# 2. Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 3. Build and push backend
cd server
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/blog-backend
gcloud run deploy blog-backend \
  --image gcr.io/YOUR_PROJECT_ID/blog-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# 4. Build and push frontend
cd "../blogging website - frontend"
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/blog-frontend
gcloud run deploy blog-frontend \
  --image gcr.io/YOUR_PROJECT_ID/blog-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Cost:** Pay per request (very cheap for low traffic)

---

### Option 3: **DigitalOcean App Platform** (Easiest)

```bash
# 1. Go to https://cloud.digitalocean.com/apps
# 2. Click "Create App"
# 3. Connect your GitHub repo
# 4. DigitalOcean auto-detects Dockerfiles!
# 5. Add environment variables in the UI
# 6. Click "Deploy"

# Done in 5 minutes!
```

**Cost:** $5/month per service ($10 total)

---

### Option 4: **Azure Container Instances**

```bash
# 1. Install Azure CLI
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# 2. Login
az login

# 3. Create resource group
az group create --name blog-rg --location eastus

# 4. Create container registry
az acr create --resource-group blog-rg --name blogregistry --sku Basic

# 5. Build and push
cd server
az acr build --registry blogregistry --image blog-backend:v1 .

cd "../blogging website - frontend"
az acr build --registry blogregistry --image blog-frontend:v1 .

# 6. Deploy containers
az container create \
  --resource-group blog-rg \
  --name blog-backend \
  --image blogregistry.azurecr.io/blog-backend:v1 \
  --dns-name-label blog-api \
  --ports 3000
```

**Cost:** ~$10-20/month

---

### Option 5: **Render** (Recommended for Beginners)

```bash
# 1. Go to https://render.com
# 2. New → Web Service
# 3. Connect GitHub repo
# 4. Render auto-detects Dockerfile!
# 5. Set environment variables
# 6. Deploy

# Repeat for frontend service
```

**Cost:** FREE tier available! ($0 for hobby projects)

---

## 🔧 Docker Commands Cheat Sheet

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View logs
docker logs <container_id>
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart a service
docker-compose restart backend

# Rebuild after code changes
docker-compose up --build

# Execute commands in container
docker exec -it <container_id> sh
docker-compose exec backend sh

# Remove all containers
docker-compose down

# Remove all images
docker system prune -a

# Check resource usage
docker stats
```

---

## 📊 Multi-Region Deployment (Advanced)

### Deploy to Multiple Clouds Simultaneously:

```bash
# 1. Build once
docker-compose build

# 2. Tag for different registries
docker tag blog-backend:latest your-docker-hub/blog-backend:latest
docker tag blog-backend:latest gcr.io/project/blog-backend:latest
docker tag blog-backend:latest your-aws-id.dkr.ecr.region.amazonaws.com/blog-backend:latest

# 3. Push to all registries
docker push your-docker-hub/blog-backend:latest
docker push gcr.io/project/blog-backend:latest
docker push your-aws-id.dkr.ecr.region.amazonaws.com/blog-backend:latest

# 4. Deploy to each platform using their respective CLIs
# Now you have the same app running on AWS, GCP, and Docker Hub!
```

---

## 🔒 Production Best Practices

### 1. **Use Docker Secrets for Sensitive Data**
```yaml
# docker-compose.prod.yml
services:
  backend:
    secrets:
      - db_password
      - jwt_secret
secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

### 2. **Enable Health Checks**
Already configured in `docker-compose.yml`:
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### 3. **Use Multi-Stage Builds**
Already configured in frontend Dockerfile:
- Stage 1: Build React app
- Stage 2: Serve with Nginx (smaller image)

### 4. **Add Docker Compose Override for Production**
```bash
# Development
docker-compose up

# Production (uses docker-compose.override.yml)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

---

## 📈 Scaling with Docker

### Horizontal Scaling (Multiple Instances)
```bash
# Run 3 instances of backend
docker-compose up --scale backend=3

# Add load balancer (nginx)
# See docker-compose.scale.yml for example
```

### Load Balancer Setup
```yaml
# docker-compose.scale.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
  
  backend:
    build: ./server
    deploy:
      replicas: 3
```

---

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs backend

# Check if port is already in use
lsof -i :3000
```

### Build fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

### Can't connect to MongoDB
```bash
# Make sure DB_LOCATION in .env is correct
# MongoDB Atlas requires IP whitelist:
# - Go to MongoDB Atlas → Network Access
# - Add IP: 0.0.0.0/0 (or your server IP)
```

### Frontend can't reach backend
```bash
# Update frontend .env to use correct backend URL
# For Docker Compose: http://backend:3000
# For separate deployments: https://your-backend-url.com
```

---

## 💰 Cost Comparison (Docker vs Traditional)

| Platform | Docker | Without Docker | Savings |
|----------|--------|----------------|---------|
| **AWS EC2** | 1 instance ($10/mo) | 2 instances ($20/mo) | 50% |
| **Google Cloud** | Cloud Run (pay-per-use) | Compute Engine ($30/mo) | 60-80% |
| **DigitalOcean** | App Platform ($10/mo) | 2 Droplets ($12/mo) | 17% |
| **Heroku** | N/A | $14/mo | N/A |

**Docker saves money by running multiple services on one server!**

---

## 🎯 Recommended Deployment Path

### For Learning/Testing:
```
DigitalOcean App Platform ($5/mo)
or
Render (FREE tier)
```

### For Small Projects:
```
AWS EC2 t3.micro ($10/mo)
+ Docker Compose
+ MongoDB Atlas (FREE)
```

### For Production:
```
AWS ECS (Elastic Container Service)
+ Application Load Balancer
+ Auto-scaling
+ CloudWatch monitoring
```

### For Enterprise:
```
Kubernetes (AWS EKS / Google GKE)
+ Multi-region deployment
+ Auto-healing
+ CI/CD pipeline
```

---

## 🚀 Next Steps

1. **Test locally:**
   ```bash
   docker-compose up --build
   ```

2. **Choose a platform** (I recommend Render for beginners)

3. **Deploy:**
   ```bash
   git push origin master
   # Platform auto-deploys from GitHub
   ```

4. **Monitor:**
   - Check logs: `docker-compose logs -f`
   - Monitor resources: `docker stats`

5. **Scale when needed:**
   ```bash
   docker-compose up --scale backend=3
   ```

---

## 📚 Learn More

- Docker Docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- Best Practices: https://docs.docker.com/develop/dev-best-practices
- Awesome Docker: https://github.com/veggiemonk/awesome-docker

---

**Your app is now ready to deploy anywhere! 🎉**

Need help deploying? Just ask which platform you want to use!
