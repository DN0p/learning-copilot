# Project Architecture

## Overview
NestJS API for managing users and their data sources with prepared authentication infrastructure.

## Folder Structure

```
src/
├── config/
│   └── database.config.ts        # TypeORM configuration
├── modules/
│   ├── users/
│   │   ├── dto/
│   │   │   └── user.ts           # CreateUserDto for validation
│   │   ├── enums/
│   │   │   └── user-role.enum.ts # USER, ADMIN roles
│   │   ├── users.controller.ts   # Routes: POST /users
│   │   ├── users.entity.ts       # User entity with relations
│   │   ├── users.service.ts      # Business logic
│   │   └── users.module.ts       # Module definition
│   ├── sources/
│   │   ├── enums/
│   │   │   └── source-statuses.enum.ts  # NEW, IN_PROGRESS, SUCCESS, FAILED
│   │   ├── sources.entity.ts            # Source entity (ManyToOne with User)
│   │   └── sources.module.ts            # Module definition (empty, ready to expand)
│   └── auth/
│       ├── auth.entity.ts               # Auth entity for storing refresh tokens
│       └── auth.module.ts               # Module definition
├── app.controller.ts
├── app.module.ts                 # Root module
├── app.service.ts
└── main.ts
```

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
