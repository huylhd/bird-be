import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';
import configuration from 'src/config/configuration';
import { House } from './entities/house.entity';

jest.setTimeout(30000);

describe('HouseController (e2e)', () => {
  let app: INestApplication;
  let pg: StartedPostgreSqlContainer;
  let ubid: string;

  beforeAll(async () => {
    const config = configuration();
    pg = await new PostgreSqlContainer('postgres')
      .withExposedPorts({
        container: 5432,
        host: config.database.port,
      })
      .withDatabase(config.database.database)
      .withUsername(config.database.username)
      .withPassword(config.database.password)
      .start();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await pg.stop();
    await app.close();
  });

  const houses: Partial<House>[] = [
    { name: 'Blue house', latitude: 10.762622, longitude: 106.660172 },
    { name: 'Red house', latitude: 10.762621, longitude: 106.660171 },
  ];

  describe('POST /houses', () => {
    it('should create multiple houses', async () => {
      const response = await request(app.getHttpServer())
        .post('/houses/')
        .send({ houses })
        .expect(201);

      expect(response.body.length).toBe(2);
      expect(response.body[0]).toMatchObject(houses[0]);
      expect(response.body[1]).toMatchObject(houses[1]);
      ubid = response.body[0].ubid;
    });
  });

  describe('PATCH /houses/:ubid', () => {
    const updateRequest = { name: 'Updated House' };
    it('should update the house', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/houses/${ubid}`)
        .send(updateRequest)
        .set({ 'x-ubid': ubid })
        .expect(200);

      expect(response.body).toMatchObject({ ...houses[0], ...updateRequest });
      houses[0] = { ...houses[0], ...response.body };
    });

    describe('error', () => {
      it('should throw unauthorized error if x-ubid header is missing', async () => {
        await request(app.getHttpServer())
          .patch(`/houses/${ubid}`)
          .send(updateRequest)
          .expect(401);
      });

      it('should throw forbidden error if x-ubid is invalid', async () => {
        await request(app.getHttpServer())
          .patch(`/houses/${ubid}`)
          .send(updateRequest)
          .set({ 'x-ubid': 'invalid' })
          .expect(403);
      });
    });
  });

  describe('GET /houses/:ubid', () => {
    it('should return requested house', async () => {
      const response = await request(app.getHttpServer())
        .get(`/houses/${ubid}`)
        .set({ 'x-ubid': ubid })
        .expect(200);

      expect(response.body).toMatchObject({
        name: houses[0].name,
        longitude: houses[0].longitude,
        latitude: houses[0].latitude,
        birds: houses[0].birds,
        eggs: houses[0].eggs,
      });
    });

    describe('error', () => {
      it('should throw unauthorized error if x-ubid header is missing', async () => {
        await request(app.getHttpServer()).get(`/houses/${ubid}`).expect(401);
      });

      it('should throw forbidden error if x-ubid is invalid', async () => {
        await request(app.getHttpServer())
          .get(`/houses/${ubid}`)
          .set({ 'x-ubid': 'invalid' })
          .expect(403);
      });
    });
  });

  describe('POST /houses/:ubid/occupancy', () => {
    const updateRequest = { birds: 2, eggs: 5 };
    it('should update occupancy for the house', async () => {
      const response = await request(app.getHttpServer())
        .post(`/houses/${ubid}/occupancy`)
        .send(updateRequest)
        .set({ 'x-ubid': ubid })
        .expect(201);

      expect(response.body).toMatchObject({ ...houses[0], ...updateRequest });
      houses[0] = { ...houses[0], ...response.body };
    });

    describe('error', () => {
      it('should throw unauthorized error if x-ubid header is missing', async () => {
        await request(app.getHttpServer())
          .post(`/houses/${ubid}/occupancy`)
          .send(updateRequest)
          .expect(401);
      });

      it('should throw forbidden error if x-ubid is invalid', async () => {
        await request(app.getHttpServer())
          .post(`/houses/${ubid}/occupancy`)
          .send(updateRequest)
          .set({ 'x-ubid': 'invalid' })
          .expect(403);
      });
    });
  });
});
