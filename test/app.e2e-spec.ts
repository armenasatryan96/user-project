import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // Включаем валидацию для E2E тестов
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Очищаем базу данных перед каждым тестом
    await prismaService.user.deleteMany();
  });

  describe('Auth Flow', () => {
    it('should register a new user', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(registerData.email);
      expect(response.body.user).not.toHaveProperty('password');

      // Сохраняем токен и ID для последующих тестов
      authToken = response.body.access_token;
      userId = response.body.user.id;
    });

    it('should login with valid credentials', async () => {
      // Сначала регистрируем пользователя
      const registerData = {
        email: 'login@example.com',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      // Затем логинимся
      const loginData = {
        email: 'login@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should reject login with invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('Users Flow', () => {
    beforeEach(async () => {
      // Регистрируем пользователя для тестов
      const registerData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      authToken = response.body.access_token;
      userId = response.body.user.id;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email', 'user@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should update user profile', async () => {
      const updateData = {
        email: 'updated@example.com',
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.email).toBe(updateData.email);
    });

    it('should delete user profile', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Проверяем, что пользователь удален
      // После удаления токен становится недействительным, поэтому ожидаем 401
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });

    it('should reject access to other user profile', async () => {
      // Создаем второго пользователя
      const secondUserData = {
        email: 'second@example.com',
        password: 'password123',
      };

      const secondUserResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(secondUserData)
        .expect(201);

      const secondUserId = secondUserResponse.body.user.id;

      // Пытаемся получить профиль второго пользователя с токеном первого
      await request(app.getHttpServer())
        .get(`/users/${secondUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });

    it('should reject access without token', async () => {
      await request(app.getHttpServer()).get(`/users/${userId}`).expect(401);
    });

    it('should reject access with invalid token', async () => {
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Error Handling', () => {
    it('should return 400 for invalid email format', async () => {
      const registerData = {
        email: 'not-an-email',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(400);
    });

    it('should return 400 for short password', async () => {
      const registerData = {
        email: 'test@example.com',
        password: '123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(400);
    });

    it('should return 409 for duplicate email', async () => {
      const registerData = {
        email: 'duplicate@example.com',
        password: 'password123',
      };

      // Регистрируем пользователя первый раз
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      // Пытаемся зарегистрировать с тем же email
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(409);
    });
  });
});
