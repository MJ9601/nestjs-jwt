import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('NEST_PORT') || 3333;
  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
