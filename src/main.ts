import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryExceptionFilter } from './query-exception/query-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new QueryExceptionFilter());
  await app.listen(8000);
}
bootstrap();
