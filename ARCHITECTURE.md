# Project Architecture

## Overview
Microservices-based NestJS application using monorepo structure for managing users, data sources, and processing data via RabbitMQ messaging.

## Folder Structure

```
app/
├── main-api/
│   └── src/
│       ├── config/
│       │   └── database.config.ts        # TypeORM configuration for main DB
│       ├── modules/
│       │   ├── users/
│       │   │   ├── dto/
│       │   │   │   └── user.ts           # CreateUserDto for validation
│       │   │   ├── enums/
│       │   │   │   └── user-role.enum.ts # USER, ADMIN roles
│       │   │   ├── users.controller.ts   # Routes: POST /users
│       │   │   ├── users.entity.ts       # User entity with relations
│       │   │   ├── users.service.ts      # Business logic
│       │   │   └── users.module.ts       # Module definition
│       │   ├── sources/
│       │   │   ├── enums/
│       │   │   │   └── source-statuses.enum.ts  # NEW, IN_PROGRESS, SUCCESS, FAILED
│       │   │   ├── sources.entity.ts            # Source entity (ManyToOne with User)
│       │   │   └── sources.module.ts            # Module definition (empty, ready to expand)
│       │   └── auth/
│       │       ├── auth.entity.ts               # Auth entity for storing refresh tokens
│       │       ├── auth.service.ts              # JWT authentication logic
│       │       ├── auth.controller.ts           # Auth endpoints
│       │       └── auth.module.ts               # Module definition
│       ├── app.controller.ts
│       ├── app.module.ts                 # Root module
│       ├── app.service.ts
│       └── main.ts
├── data-processing/
│   ├── main.ts                          # Microservice entry point
│   ├── app.module.ts                    # Root module with RabbitMQ client
│   └── tsconfig.app.json
package.json
nest-cli.json
tsconfig.json
docker-compose.yml
```

## Microservices Architecture

### Main API Service
- **Purpose**: Handles user management, authentication, and source data CRUD.
- **Database**: PostgreSQL (db-main) for users, sources, auth sessions.
- **Endpoints**:
  - `POST /auth/register` - User registration with JWT tokens
  - `POST /auth/login` - User login with JWT tokens
  - `POST /auth/refresh` - Refresh JWT tokens
  - `POST /users` - Create user

### Data Processing Service
- **Purpose**: Processes data asynchronously via RabbitMQ messages.
- **Database**: Separate PostgreSQL (db-data) for processed data.
- **Queue**: Listens to `data_queue` for processing tasks.

### Communication
- **RabbitMQ**: Used for inter-service communication.
- **Queue**: `data_queue` for sending data processing requests from main-api to data-processing.

## Database Schema

### Main Database (db-main)
#### User Entity
- `id` (UUID, PK)
- `email` (string, unique)
- `password` (string, hashed with bcrypt, select: false)
- `role` (enum: USER, ADMIN)
- `sources` (OneToMany -> Source)
- `auth` (OneToMany -> Auth)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

#### Source Entity
- `id` (UUID, PK)
- `name` (varchar 255)
- `link` (text, unique)
- `user` (ManyToOne -> User, CASCADE delete)
- `status` (enum: NEW, IN_PROGRESS, SUCCESS, FAILED)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

#### Auth Entity
- `id` (UUID, PK)
- `user` (ManyToOne -> User, CASCADE delete, indexed)
- `hashedRefreshToken` (text)
- `expiresAt` (timestamp)
- `userAgent` (text, nullable)
- `ipAddress` (varchar 45, nullable)
- `createdAt` (timestamp)

### Data Processing Database (db-data)
- Separate schema for processed data (to be defined based on requirements).

## Current Features

### Authentication Module
- JWT-based authentication with access and refresh tokens
- Session management with hashed refresh tokens
- Transactional operations for registration and login
- Password hashing with bcrypt
- User roles (USER, ADMIN)

### Users Module
- **POST /users** - Create user with email and password validation
  - Validates email format
  - Enforces 8+ character password
  - Checks for duplicate email (409 Conflict)
  - Hashes password with bcrypt before storing
  - Returns user without password

### Validation
- Global `ValidationPipe` in main.ts
- DTO validation with class-validator decorators
- Password excluded from responses with `@Exclude()`

## Configuration

### Environment Variables
See `.env.example` for all available configuration options including:
- Database connections for both services
- JWT secrets and expirations
- RabbitMQ credentials

### Databases
- Main API: PostgreSQL with TypeORM
- Data Processing: Separate PostgreSQL instance
- Synchronize enabled (⚠️ development only, use migrations for production)

### Docker Compose
- `main-api`: Builds from `app/main-api/Dockerfile`
- `data-processing`: Builds from `app/data-processing/Dockerfile`
- `db-main`: PostgreSQL for main API
- `db-data`: PostgreSQL for data processing
- `rabbitmq`: RabbitMQ with management UI
- `redis`: Redis for caching

## Next Steps / TODOs

1. **Data Processing Service**
   - Implement message handlers for `data_queue`
   - Define data processing logic
   - Add database schema for processed data

2. **Inter-Service Communication**
   - Add RabbitMQ client in main-api for sending messages
   - Implement error handling and retries

3. **Sources Module**
   - Implement CRUD operations
   - Add authorization checks
   - Integrate with data processing service

4. **Database Migrations**
   - Replace `synchronize: true` with TypeORM migrations for both DBs

5. **Testing**
   - Unit tests for services
   - E2E tests for API endpoints
   - Integration tests for microservices

6. **Documentation**
   - Add Swagger/OpenAPI documentation
   - API documentation for inter-service communication

7. **Monitoring & Logging**
   - Implement centralized logging
   - Add health checks
   - Monitoring for RabbitMQ queues

## Security Notes

- Passwords are hashed with bcrypt (10 rounds by default)
- Passwords are excluded from database queries with `select: false`
- Password field is excluded from JSON responses with `@Exclude()`
- Email uniqueness is enforced at database level
- Refresh tokens are stored hashed in Auth entity
- Cascading delete ensures user data is cleaned up
- JWT secrets configured via environment variables

## Database Schema

### User Entity
- `id` (UUID, PK)
- `email` (string, unique)
- `password` (string, hashed with bcrypt, select: false)
- `role` (enum: USER, ADMIN)
- `sources` (OneToMany -> Source)
- `auth` (OneToMany -> Auth)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Source Entity
- `id` (UUID, PK)
- `name` (varchar 255)
- `link` (text, unique)
- `user` (ManyToOne -> User, CASCADE delete)
- `status` (enum: NEW, IN_PROGRESS, SUCCESS, FAILED)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Auth Entity
- `id` (UUID, PK)
- `user` (ManyToOne -> User, CASCADE delete, indexed)
- `hashedRefreshToken` (text)
- `expiresAt` (timestamp)
- `userAgent` (text, nullable)
- `ipAddress` (varchar 45, nullable)
- `createdAt` (timestamp)

## Current Features

### Users Module
- **POST /users** - Create user with email and password validation
  - Validates email format
  - Enforces 8+ character password
  - Checks for duplicate email (409 Conflict)
  - Hashes password with bcrypt before storing
  - Returns user without password

### Validation
- Global `ValidationPipe` in main.ts
- DTO validation with class-validator decorators
- Password excluded from responses with `@Exclude()`

## Configuration

### Environment Variables
See `.env.example` for all available configuration options.

### Database
- Uses PostgreSQL
- TypeORM with auto-loading entities
- Synchronize enabled (⚠️ development only, use migrations for production)

## Next Steps / TODOs

1. **Authentication Module**
   - Implement JWT strategy
   - Add login/refresh endpoints
   - Create JWT guards

2. **Sources Module**
   - Implement CRUD operations
   - Add authorization checks
   - Implement status workflow

3. **Database Migrations**
   - Replace `synchronize: true` with TypeORM migrations

4. **Testing**
   - Unit tests for services
   - E2E tests for API endpoints

5. **Documentation**
   - Add Swagger/OpenAPI documentation

6. **Error Handling**
   - Implement global exception filter for consistent error responses

## Security Notes

- Passwords are hashed with bcrypt (10 rounds by default)
- Passwords are excluded from database queries with `select: false`
- Password field is excluded from JSON responses with `@Exclude()`
- Email uniqueness is enforced at database level
- Refresh tokens are stored hashed in Auth entity
- Cascading delete ensures user data is cleaned up
