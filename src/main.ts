import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryExceptionFilter } from './query-exception/query-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['set-cookie'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: true,
  });
  app.useGlobalFilters(new QueryExceptionFilter());
  await app.listen(8000);
}
bootstrap();
