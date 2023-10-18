import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppService } from '../src/app.service';
import { BookmarkDto, LoginDto, RegisterDto } from 'src/dtos';

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
      access: 100,
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
    const dto: BookmarkDto = {
      urlParam: 'test',
      description: 'this is a test',
      title: 'test-1',
    };
    describe('create a bookmark', () => {
      it('should create a bookmark', () => {
        return pactum
          .spec()
          .post(`bookmarks/create`)
          .withBody(dto)
          .withBearerToken('$S{accessToken}')
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });

      it('no body should throw error', () => {
        return pactum
          .spec()
          .post(`bookmarks/create`)
          .withBearerToken('$S{accessToken}')
          .withBody({ title: dto.title, description: dto.description })
          .expectStatus(400);
      });

      it('no urlParam should throw error', () => {
        return pactum
          .spec()
          .post(`bookmarks/create`)
          .withBearerToken('$S{accessToken}')
          .withBody({ title: dto.title, description: dto.description })
          .expectStatus(400);
      });

      it('no auth should throw error', () => {
        return pactum
          .spec()
          .post(`bookmarks/create`)
          .withBody(dto)
          .expectStatus(401);
      });
    });

    describe('Get all bookmarks', () => {
      it('should return all bookmarks', () => {
        return pactum
          .spec()
          .get(`bookmarks`)
          .withBearerToken('$S{accessToken}')
          .expectStatus(200);
      });

      it('no auth should throw error', () => {
        return pactum.spec().get(`bookmarks`).expectStatus(401);
      });
    });

    describe('Get a bookmark by id', () => {
      it('should return a bookmark', () => {
        return pactum
          .spec()
          .get(`bookmarks/$S{bookmarkId}`)
          .withBearerToken('$S{accessToken}')
          .expectStatus(200);
      });

      it('no auth should throw error', () => {
        return pactum.spec().get(`bookmarks/$S{bookmarkId}`).expectStatus(401);
      });
    });

    describe('update a bookmark with Id', () => {
      it('should update a bookmark', () => {
        return pactum
          .spec()
          .put(`bookmarks/update/$S{bookmarkId}`)
          .withBearerToken('$S{accessToken}')
          .withBody({ title: 'new title', description: 'new description' })
          .expectStatus(200);
      });

      it('no body, shouldn"t throw', () => {
        return pactum
          .spec()
          .put(`bookmarks/update/$S{bookmarkId}`)
          .withBearerToken('$S{accessToken}')
          .expectStatus(200);
      });

      it('no auth should throw error', () => {
        return pactum
          .spec()
          .put(`bookmarks/update/$S{bookmarkId}`)
          .withBody({ title: 'new title', description: 'new description' })
          .expectStatus(401);
      });
    });

    describe('Delete a bookmark by Id', () => {
      it('access < 100, should throw', () => {
        return pactum
          .spec()
          .delete(`bookmarks/$S{bookmarkId}`)
          .withBearerToken('$S{accessToken}')
          .expectStatus(403);
      });

      it('no auth should throw error', () => {
        return pactum
          .spec()
          .delete(`bookmarks/$S{bookmarkId}`)
          .expectStatus(401);
      });

      it('should delete a bookmark', () => {
        return pactum
          .spec()
          .delete(`bookmarks/$S{bookmarkId}`)
          .withBearerToken('$S{accessToken}')
          .expectStatus(200);
      });
    });
  });
  it.todo(' test');
});
