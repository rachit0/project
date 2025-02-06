# Assignment
 simple Task Management API using Node.js with Express

# To start application use npm run dev to access the development server then with below swagger api documentation access the localhost server
 
 ## Swagger API Documents :- http://localhost:3000/api-docs

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

