import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors();
  app.useStaticAssets(join(__dirname, '../../src', 'public'));
  app.setBaseViewsDir(join(__dirname, '../../src', 'public'));
  app.setViewEngine('hbs');
  await app.listen(7000);
}
bootstrap();
