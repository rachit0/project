const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../index');
const Task = require('../models/Task');
const User = require('../models/User');

describe('Task Endpoints', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      });
    
    token = response.body.token;
    userId = response.body.user._id;
  });

  afterEach(async () => {
    await Task.deleteMany();
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
    server.close();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'todo',
          priority: 'medium',
          dueDate: new Date(),
          assignedTo: userId
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Task');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'high',
        dueDate: new Date(),
        assignedTo: userId,
        createdBy: userId
      });
    });

    it('should get all tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter tasks by status', async () => {
      const res = await request(app)
        .get('/api/tasks?status=todo')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body[0].status).toBe('todo');
    });

    it('should filter tasks by priority', async () => {
      const res = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body[0].priority).toBe('high');
    });
  });
});