import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import  request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/test-connection (GET) - Debería conectar al pool y devolver la hora del servidor', async () => {
    const response = await request(app.getHttpServer()).get('/test-connection').expect(200);
    expect(response.body).toHaveProperty('time');
    console.log('Hora de la DB:', response.body.time);
  });

  afterAll(async () => {
    await app.close();
  });
});
