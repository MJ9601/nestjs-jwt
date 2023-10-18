import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppService } from '../src/app.service';
import { LoginDto, RegisterDto } from 'src/dtos';

describe('app e2e', () => {
  let dbService: AppService;
  let app: INestApplication;
  const url = 'http://localhost:3333/';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);
    pactum.request.setBaseUrl(url);

    dbService = app.get(AppService);

    await dbService.flushingDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const regiterDto: RegisterDto = {
      email: 'test@test.com',
      password: '1234321',
      access: 95,
      name: 'test',
    };

    const dto: LoginDto = {
      email: 'test@test.com',
      password: '1234321',
    };

    describe('Resgiter a user', () => {
      it('should signup', () => {
        return pactum
          .spec()
          .post(`auth/register`)
          .withBody(regiterDto)
          .expectStatus(201)
          .stores('id', 'id');
      });

      it('no body should throw error', () => {
        return pactum.spec().post(`auth/register`).expectStatus(400);
      });

      it('no password should throw error', () => {
        return pactum
          .spec()
          .post(`auth/register`)
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('no email should throw error', () => {
        return pactum
          .spec()
          .post(`auth/register`)
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
    });

    describe('Login a user', () => {
      it('should login user', () => {
        return pactum
          .spec()
          .post('auth/login')
          .withBody(dto)
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
      });

      it('no body should throw error', () => {
        return pactum.spec().post(`auth/login`).expectStatus(400);
      });

      it('no password should throw error', () => {
        return pactum
          .spec()
          .post(`auth/login`)
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('no email should throw error', () => {
        return pactum
          .spec()
          .post(`auth/login`)
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
    });

    describe('Get all users', () => {
      it('should return all users', () => {
        return pactum.spec().get('auth/users').expectStatus(200);
      });
    });
    describe('Get a user by id', () => {
      it('should return userinfo', () => {
        return pactum.spec().get('auth/users/$S{id}').expectStatus(200);
      });
    });

    describe('Get me', () => {
      it('should return userinfo', () => {
        return pactum
          .spec()
          .get('auth/me')
          .withBearerToken(`$S{accessToken}`)
          .expectStatus(200);
      });

      it('should throw; no bearer token', () => {
        return pactum.spec().get('auth/me').expectStatus(401).inspect();
      });

      // it('should throw; access less than 11', () => {
      //   return pactum
      //     .spec()
      //     .get('auth/me')
      //     .withBearerToken(`$S{accessToken}`)
      //     .expectStatus(403);
      // });
    });

    describe('Delete a user by Id', () => {
      it('should throw; no bearer token', () => {
        return pactum
          .spec()
          .delete('auth/users/$S{id}')
          .expectStatus(401)
          .inspect();
      });

      // it('should throw; access less than 90', () => {
      //   return pactum
      //     .spec()
      //     .delete('auth/users/$S{id}')
      //     .withBearerToken(`$S{accessToken}`)
      //     .expectStatus(403);
      // });

      // it('should remove user', () => {
      //   return pactum
      //     .spec()
      //     .delete('auth/users/$S{id}')
      //     .withBearerToken(`$S{accessToken}`)
      //     .expectStatus(200);
      // });
    });
  });

  describe('Bookmark', () => {
    describe('create a bookmark', () => {});
    describe('update a bookmark with Id', () => {});
    describe('Get all bookmarks', () => {});
    describe('Get a bookmark by id', () => {});
    describe('Delete a bookmark by Id', () => {});
  });
  it.todo(' test');
});
