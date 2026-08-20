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

