# Assignment
 simple Task Management API using Node.js with Express

 ## Swagger API Endpoints

 # Authentication
POST /api/auth/register
POST /api/auth/login

# Users
GET /api/users
GET /api/users/:id
PATCH /api/users/:id
DELETE /api/users/:id

# Tasks
POST /api/tasks
GET /api/tasks
GET /api/tasks/:id
PATCH /api/tasks/:id
DELETE /api/tasks/:id

# Task Filtering Examples
GET /api/tasks?status=todo
GET /api/tasks?priority=high
GET /api/tasks?dueDate=2024-01-01

