# Personal Blogging Platform API

A robust, secure, and fully documented RESTful API built using Node.js, Express, and PostgreSQL. It allows users to register, log in, and perform full CRUD operations on their personal blog posts. 

Security features include password hashing and token-based JWT authorization to prevent unauthorized access and ensure users can only modify their own posts.

---

## Features
* **User Authentication**: Secure signup and login endpoints with password hashing using `bcryptjs`.
* **Token Authorization**: Request protection utilizing JSON Web Tokens (JWT).
* **Validation**: Request payloads are rigorously validated using `Zod`.
* **Database & ORM**: PostgreSQL database powered by Prisma ORM for relational integrity and type safety.
* **Centralized Error Handling**: Unified error response format for clean client-side consumption.

---

## Tech Stack & Key Decisions

* **Runtime & Framework**: Node.js & Express
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Validation**: Zod
* **Authentication**: JSON Web Tokens (JWT) & bcryptjs

### Why PostgreSQL & Prisma?
For a blogging platform, the data is inherently relational:
1. **One-to-Many Relationship**: One user owns many blog posts. PostgreSQL (a relational database) handles this connection through Foreign Keys, enforcing data integrity at the database level.
2. **Prisma ORM Benefits**: Prisma provides a declarative schema and type-safe database queries. Using features like `onDelete: Cascade` ensures that if a user deletes their account, all associated posts are automatically removed, preventing orphaned records.
3. **Structured Schema**: Unlike NoSQL databases (which allow inconsistent document structures), PostgreSQL ensures that every post has a title, content, and valid author, guaranteeing high quality and reliability of data.

---

## Setup & Local Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [PostgreSQL](https://www.postgresql.org/) database running locally or in the cloud.

### 1. Clone the repository
```bash
git clone https://github.com/hatem-abdelrahman/personal-blogging-platform-api.git
cd personal-blogging-platform-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
DATABASE_URL="postgresql://<db_user>:<db_password>@localhost:5432/<db_name>?schema=public"
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="24h"
```
*Replace `<db_user>`, `<db_password>`, and `<db_name>` with your PostgreSQL local credentials.*

### 4. Run Migrations & Generate Prisma Client
This will create the necessary tables in your database and configure the Prisma Client:
```bash
npx prisma migrate dev --name init
```

### 5. Start the Server
* **Development Mode (Auto-restart on save)**:
  ```bash
  npm run dev
  ```
* **Production Mode**:
  ```bash
  npm start
  ```
The server will start running at `http://localhost:5000`.

---

## 🔌 API Endpoints Reference

### Authentication

#### 1. Register User
* **Endpoint**: `POST /auth/register`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "User registered successfully!",
    "data": {
      "user": {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "createdAt": "2026-06-19T16:00:00.000Z"
      }
    }
  }
  ```

#### 2. Login User
* **Endpoint**: `POST /auth/login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Logged in successfully!",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com"
      }
    }
  }
  ```

---

### Blog Posts

> [!NOTE]
> For all protected routes, you must provide the JWT in the header format: `Authorization: Bearer <your_jwt_token>`

#### 3. Get All Posts
* **Endpoint**: `GET /posts`
* **Access**: Public
* **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "results": 1,
    "data": {
      "posts": [
        {
          "id": 1,
          "title": "My First Blog Post",
          "content": "This is the content of my post...",
          "createdAt": "2026-06-19T16:30:00.000Z",
          "authorId": 1,
          "author": {
            "id": 1,
            "name": "Jane Doe"
          }
        }
      ]
    }
  }
  ```

#### 4. Create Post
* **Endpoint**: `POST /posts`
* **Access**: Protected (JWT Required)
* **Request Body**:
  ```json
  {
    "title": "My First Blog Post",
    "content": "This is the content of my post..."
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Post created successfully!",
    "data": {
      "post": {
        "id": 1,
        "title": "My First Blog Post",
        "content": "This is the content of my post...",
        "createdAt": "2026-06-19T16:30:00.000Z",
        "authorId": 1,
        "author": {
          "id": 1,
          "name": "Jane Doe",
          "email": "jane@example.com"
        }
      }
    }
  }
  ```

#### 5. Update Post
* **Endpoint**: `PUT /posts/:id`
* **Access**: Protected (JWT Required & Owner only)
* **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content..."
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Post updated successfully!",
    "data": {
      "post": {
        "id": 1,
        "title": "Updated Title",
        "content": "Updated content...",
        "createdAt": "2026-06-19T16:30:00.000Z",
        "authorId": 1
      }
    }
  }
  ```

#### 6. Delete Post
* **Endpoint**: `DELETE /posts/:id`
* **Access**: Protected (JWT Required & Owner only)
* **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Post deleted successfully!"
  }
  ```

---

## Postman Testing Collection
To test these endpoints directly, you can import the `blogging-platform.postman_collection.json` file located in the root of this project into your Postman application.
