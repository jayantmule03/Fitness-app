# Fitness Microservices Application

A cloud-native **Fitness Application** built using **Spring Boot Microservices**, **Docker**, **Kubernetes**, **Jenkins CI/CD**, and **Argo CD**.

The application is designed as a distributed system where individual business capabilities are separated into independent microservices. Service discovery, centralized configuration, API routing, authentication, messaging, and persistent storage are handled by dedicated infrastructure services.

---

## Architecture

```text
                         ┌──────────────────────────┐
                         │        FRONTEND          │
                         │      HTML / CSS / JS      │
                         │        Port: 3000         │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │       API GATEWAY        │
                         │      Spring Cloud        │
                         │        Port: 8080        │
                         └────────────┬─────────────┘
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
                 ▼                    ▼                    ▼
        ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
        │  USER SERVICE  │   │ ACTIVITY SERVICE│   │   AI SERVICE   │
        │ Spring Boot    │   │  Spring Boot    │   │  Spring Boot   │
        │    :8081       │   │     :8082       │   │     :8083      │
        └───────┬────────┘   └───────┬────────┘   └───────┬────────┘
                │                    │                    │
                ▼                    ▼                    ▼
        ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
        │   PostgreSQL   │   │    MongoDB     │   │    MongoDB     │
        │ fitness-user-db│   │ fitnes-activity│   │ recommendation │
        └────────────────┘   └───────┬────────┘   └───────┬────────┘
                                     │                    │
                                     └─────────┬──────────┘
                                               ▼
                                      ┌────────────────┐
                                      │    RabbitMQ     │
                                      │      :5672      │
                                      └────────────────┘


        ┌─────────────────────── Infrastructure ───────────────────────┐
        │                                                              │
        │  ┌────────────────┐       ┌────────────────┐                 │
        │  │ Eureka Server  │       │ Config Server  │                 │
        │  │     :8761      │       │     :8888      │                 │
        │  └────────────────┘       └────────────────┘                 │
        │                                                               │
        │  ┌────────────────┐                                           │
        │  │    Keycloak    │                                           │
        │  │     :8181*    │                                           │
        │  └────────────────┘                                           │
        │                                                               │
        └───────────────────────────────────────────────────────────────┘


                       CI/CD PIPELINE

       Developer
           │
           ▼
        GitHub
           │
           ▼
       ┌─────────┐
       │ Jenkins │  ── Build → Test → Docker Build → Push
       └────┬────┘
            │
            ▼
       Docker Hub
            │
            ▼
       Kubernetes
            │
            ▼
       ┌─────────┐
       │ Argo CD │  
       └─────────┘
```

> *Keycloak is shown as port `8181` from the application's external configuration. Inside Kubernetes, the Keycloak container may listen on a different internal port depending on its configuration.*

---

## Project Overview

The Fitness Application follows a **microservices architecture** to make the system modular, scalable, maintainable, and independently deployable.

The main services are:

| Component | Technology | Port | Responsibility |
|---|---|---:|---|
| Frontend | HTML, CSS, JavaScript | 3000 | User interface |
| API Gateway | Spring Cloud Gateway | 8080 | API routing and security |
| User Service | Spring Boot | 8081 | User management |
| Activity Service | Spring Boot | 8082 | Fitness activity tracking |
| AI Service | Spring Boot | 8083 | AI-based recommendations |
| Config Server | Spring Cloud Config | 8888 | Centralized configuration |
| Eureka Server | Netflix Eureka | 8761 | Service discovery |
| PostgreSQL | PostgreSQL | 5432 | User-service database |
| MongoDB | MongoDB | 27017 | Activity and recommendation data |
| RabbitMQ | RabbitMQ | 5672 | Asynchronous messaging |
| Keycloak | Keycloak | 8181* | Authentication and authorization |

---

## Microservices

### 1. User Service

**Port:** `8081`

Responsible for user-related operations.

Responsibilities:

- User registration and management
- User data persistence
- Validation
- PostgreSQL database integration
- Eureka service registration

**Database:**

```text
PostgreSQL
Database: fitness-user-db
```

---

### 2. Activity Service

**Port:** `8082`

Responsible for recording and processing fitness activities.

Responsibilities:

- Activity tracking
- Activity persistence
- MongoDB integration
- RabbitMQ event publishing/consuming
- Eureka service registration

**Database:**

```text
MongoDB
Database: fitnes-activity
```

**RabbitMQ:**

```text
Exchange: fitness.exchange
Queue: activity.queue
Routing Key: activity.tracking
```

---

### 3. AI Service

**Port:** `8083`

Provides AI-powered fitness recommendations.

Responsibilities:

- Generate fitness recommendations
- Process activity/user information
- MongoDB integration
- RabbitMQ integration
- Gemini API integration
- Eureka service registration

**Database:**

```text
MongoDB
Database: fitness-recommendation
```

The Gemini configuration is supplied through environment variables:

```text
GEMINI_API_URL
GEMINI_API_KEY
```

Sensitive API credentials should not be committed to Git.

---

## API Gateway

**Port:** `8080`

The API Gateway is the single entry point for frontend API requests.

It uses **Spring Cloud Gateway** and Eureka service discovery.

### Routes

```text
/api/Users/**             → USER-SERVICE
/api/Activities/**        → ACTIVITY-SERVICE
/api/Recommendations/**  → AI-SERVICE
```

The Gateway uses:

```text
lb://USER-SERVICE
lb://ACTIVITY-SERVICE
lb://AI-SERVICE
```

This allows services to be discovered through Eureka rather than hardcoding individual service IP addresses.

---

## Service Discovery

### Eureka Server

**Port:** `8761`

Eureka provides service registration and discovery.

Services registered with Eureka include:

```text
USER-SERVICE
ACTIVITY-SERVICE
AI-SERVICE
API-GATEWAY
```

Instead of communicating through fixed container IP addresses, services can discover one another through Eureka.

---

## Centralized Configuration

### Config Server

**Port:** `8888`

The project uses **Spring Cloud Config Server** for centralized configuration.

Configuration is stored under:

```text
src/main/resources/config/
```

Example configuration files:

```text
application.yml
user-service.yml
activity-service.yml
ai-service.yml
api-gateway.yml
```

Microservices load their configuration from:

```text
http://config-server:8888
```

when running inside Kubernetes.

---

## Authentication and Authorization

The application uses **Keycloak** for authentication and authorization.

The API Gateway is configured as an OAuth2 Resource Server using JWT.

The JWT public key endpoint is provided by Keycloak.

Typical flow:

```text
User
 │
 ▼
Frontend
 │
 ▼
Keycloak Login
 │
 ▼
JWT Token
 │
 ▼
API Gateway
 │
 ▼
Microservices
```

---

## Messaging

The application uses **RabbitMQ** for asynchronous communication between services.

RabbitMQ helps decouple services and allows events to be processed asynchronously.

Example:

```text
Activity Service
      │
      │ activity.tracking
      ▼
RabbitMQ
      │
      ▼
AI Service
      │
      ▼
Fitness Recommendation
```

---

# Technology Stack

## Backend

- Java 23
- Spring Boot 3.4.3
- Spring Web
- Spring WebFlux
- Spring Data JPA
- Spring Data MongoDB
- Spring Cloud Gateway
- Spring Cloud Config
- Spring Cloud Netflix Eureka
- Spring Security
- OAuth2 Resource Server
- Lombok

## Databases

- PostgreSQL
- MongoDB

## Messaging

- RabbitMQ

## Authentication

- Keycloak
- OAuth2
- JWT

## Containerization

- Docker
- Docker Hub

## Orchestration

- Kubernetes

## CI/CD

- Jenkins
- Argo CD
- Git/GitHub

---

```text
jayantmule02/user-service:latest
```

---

# Argo CD

Argo CD is used for **continuous delivery using GitOps**.

The Kubernetes manifests are maintained in a Git repository.

Argo CD continuously monitors the Git repository and synchronizes the desired state with the Kubernetes cluster.

```text
Git Repository
      │
      │ Desired State
      ▼
   Argo CD
      │
      │ Sync
      ▼
 Kubernetes Cluster
```

### GitOps Benefits

- Declarative deployment
- Version-controlled infrastructure
- Automatic synchronization
- Easy rollback
- Deployment history
- Kubernetes state visibility

---

# CI/CD Responsibilities

| Tool | Responsibility |
|---|---|
| GitHub | Source code and GitOps repository |
| Jenkins | CI / Build / Test / Docker Image |
| Docker | Application containerization |
| Docker Hub | Container image registry |
| Kubernetes | Container orchestration |
| Argo CD | Continuous deployment / GitOps |

---

# Kubernetes Service Communication

Inside Kubernetes, services communicate using Kubernetes DNS names rather than `localhost`.

Example:

```text
PostgreSQL:
postgres:5432

MongoDB:
mongodb:27017

RabbitMQ:
rabbitmq:5672

Eureka:
eureka-server:8761

Config Server:
config-server:8888

API Gateway:
api-gateway:8080
```

This is important because:

```text
localhost
```

inside a container refers to that container itself.

---

# Project Structure

A recommended repository structure:

```text
fitness-application/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── Dockerfile
│
├── api-gateway/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── user-service/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── activity-service/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── ai-service/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── config-server/
│   ├── src/
│   │   └── main/
│   │       └── resources/
│   │           └── config/
│   ├── pom.xml
│   └── Dockerfile
│
├── eureka-server/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── k8s/
│   ├── namespace.yaml
│   ├── deployments.yaml
│   ├── services.yaml
│   ├── secrets.yaml
│   └── ingress.yaml
│
└── README.md
```

---

# Deployment Workflow

### 1. Develop

Develop the Spring Boot microservices and frontend.

### 2. Commit

```bash
git add .
git commit -m "Update fitness application"
git push
```

### 3. Jenkins

Jenkins automatically:

```text
Checkout
   ↓
Build
   ↓
Test
   ↓
Docker Build
   ↓
Docker Push
```

### 4. Docker Hub

Images are pushed to:

```text
jayantmule02/
```

### 5. GitOps

The Kubernetes deployment configuration is updated with the new image version.

### 6. Argo CD

Argo CD detects the Git change and synchronizes Kubernetes.

### 7. Kubernetes

Kubernetes pulls the new image and performs a rolling deployment.

---

# Running Locally with Docker

Build an image:

```bash
docker build -t jayantmule02/user-service:latest .
```

Push it:

```bash
docker push jayantmule02/user-service:latest
```

Repeat for each service.

---

# Running on Kubernetes

Apply the Kubernetes manifests:

```bash
kubectl apply -f k8s/
```

Check pods:

```bash
kubectl get pods -n fitness
```

Check services:

```bash
kubectl get svc -n fitness
```

Check deployments:

```bash
kubectl get deployments -n fitness
```

Check pod logs:

```bash
kubectl logs -f <pod-name> -n fitness
```

Check application health:

```bash
kubectl describe pod <pod-name> -n fitness
```

---

# Monitoring Deployment

Useful commands:

```bash
kubectl get pods -n fitness
kubectl get svc -n fitness
kubectl get deployments -n fitness
kubectl get events -n fitness
```

For a specific service:

```bash
kubectl logs -f deployment/user-service -n fitness
```

---

# Key Features

- Microservices-based architecture
- Independent service deployment
- Centralized configuration
- Service discovery with Eureka
- API Gateway
- OAuth2/JWT authentication
- Keycloak integration
- PostgreSQL persistence
- MongoDB persistence
- RabbitMQ asynchronous messaging
- AI-powered fitness recommendations
- Gemini API integration
- Docker containerization
- Kubernetes orchestration
- Kubernetes health checks
- Jenkins CI pipeline
- Argo CD GitOps-based CD
- Docker Hub image registry
- Scalable and independently deployable services

---

# Future Improvements

- Add Kubernetes Ingress
- Add Horizontal Pod Autoscaler
- Add PersistentVolumeClaims for databases
- Add Kubernetes ConfigMaps and Secrets
- Add Prometheus and Grafana monitoring
- Add centralized logging
- Add distributed tracing
- Add automated image versioning
- Add HTTPS/TLS
- Add production-ready database deployments

---
