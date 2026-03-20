# Connectify: Containerization and Deployment (Docker + Kubernetes)

This repository contains Assignment 2 implementation for containerization and deployment of the Connectify microservices web application.

## 1. Project Overview

Connectify is a social media web app with:

- Frontend: React + Vite
- Backend: Node.js/Express microservices
	- `User-Service` (port `5001`)
	- `Auth-Service` (port `5002`)
	- `Admin-Service` (port `5003`)
- Database: MongoDB (port `27017`)

This submission includes:

- Dockerfiles for all services
- Docker Compose multi-container setup
- Kubernetes manifests for Deployments/Services
- Persistent storage (PV + PVC) for MongoDB
- Horizontal Pod Autoscaler (HPA)

## 2. Tools and Technologies

- Docker
- Docker Compose
- Kubernetes (Minikube, Docker Desktop Kubernetes, or any cluster)
- Node.js 18
- React + Vite
- MongoDB

## 3. Application Architecture

Flow:

1. Frontend serves UI on port `5173` (Docker) / NodePort `30080` (Kubernetes).
2. Frontend calls backend APIs on ports `5001`, `5002`, `5003`.
3. Backend microservices connect to MongoDB using `MONGO_URI`.
4. MongoDB uses persistent volume to preserve data.

## 4. Task 1: Docker Containerization

Dockerfiles are available in:

- `frontend/Dockerfile`
- `User-Service/Dockerfile`
- `Auth-Service/Dockerfile`
- `Admin-Service/Dockerfile`

Build images manually:

```bash
docker build -t connectify/frontend:latest ./frontend
docker build -t connectify/user-service:latest ./User-Service
docker build -t connectify/auth-service:latest ./Auth-Service
docker build -t connectify/admin-service:latest ./Admin-Service
```

Run a sample container locally:

```bash
docker run --rm -p 5001:5001 -e PORT=5001 -e MONGO_URI=mongodb://host.docker.internal:27017/connectify connectify/user-service:latest
```

## 5. Task 2: Multi-Container Setup using Docker Compose

Compose file: `docker-compose.yml`

Services included:

- `frontend`
- `user-service`
- `auth-service`
- `admin-service`
- `mongo`

Implemented requirements:

- Multi-service configuration
- Shared Docker network (`connectify-net`)
- Environment variables for backend services
- Port mapping for each container
- Persistent MongoDB volume (`mongo_data`)

Run with Compose:

```bash
docker compose up --build -d
docker compose ps
```

Stop and cleanup:

```bash
docker compose down
```

Access points:

- Frontend: `http://localhost:5173`
- User service: `http://localhost:5001`
- Auth service: `http://localhost:5002`
- Admin service: `http://localhost:5003`
- MongoDB: `mongodb://localhost:27017`

## 6. Task 3: Kubernetes Deployment

Kubernetes manifests are in `k8s/base`:

- `namespace.yaml`
- `configmap.yaml`
- `secret.yaml`
- `storage.yaml`
- `mongo.yaml`
- `backend.yaml`
- `frontend.yaml`
- `hpa.yaml`

### Build images for Kubernetes

Option A (registry):

1. Build images.
2. Push to your Docker Hub/registry.
3. Update image names in manifests if needed.

Option B (Minikube local images):

```bash
minikube docker-env
```

Then build images with the same tags used in manifests:

```bash
docker build -t connectify/frontend:latest ./frontend
docker build -t connectify/user-service:latest ./User-Service
docker build -t connectify/auth-service:latest ./Auth-Service
docker build -t connectify/admin-service:latest ./Admin-Service
```

### Deploy to cluster

```bash
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/base/configmap.yaml
kubectl apply -f k8s/base/secret.yaml
kubectl apply -f k8s/base/storage.yaml
kubectl apply -f k8s/base/mongo.yaml
kubectl apply -f k8s/base/backend.yaml
kubectl apply -f k8s/base/frontend.yaml
kubectl apply -f k8s/base/hpa.yaml
```

Verify resources:

```bash
kubectl get pods -n connectify
kubectl get svc -n connectify
kubectl get deployments -n connectify
kubectl get hpa -n connectify
```

Replica requirement satisfied:

- Frontend deployment replicas: `3`
- Backend deployments replicas: `3` each

## 7. Task 4: Persistent Storage

Persistent storage resources are defined in `k8s/base/storage.yaml`:

- PersistentVolume: `mongo-pv`
- PersistentVolumeClaim: `mongo-pvc`

MongoDB pod mounts PVC at `/data/db` in `k8s/base/mongo.yaml`.

## 8. Task 5: Application Scaling (HPA)

HPA manifest: `k8s/base/hpa.yaml`

Configuration:

- Target deployment: `user-service`
- Min pods: `2`
- Max pods: `5`
- CPU utilization target: `70%`

Note: Metrics server must be installed in cluster for HPA to function.

## 9. Task 6: Documentation and Project Structure

Folder structure includes:

- Service-level Dockerfiles
- Root-level `docker-compose.yml`
- Kubernetes YAML files under `k8s/base`
- Assignment-complete README

## 10. Screenshot Checklist for Submission

Capture and include these screenshots in your report/repository:

1. Docker containers running (`docker compose ps` output)
2. Kubernetes pods running (`kubectl get pods -n connectify`)
3. Kubernetes services and scaling (`kubectl get svc -n connectify` and `kubectl get hpa -n connectify`)

## 11. Team Members

- Mujtaba Ali (22F-3650)
- Muhammad Omair (22F-3651)
- Sarmad Mehmood (22F-3695)

