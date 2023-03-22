import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全体にValidationPipeを反映させる。
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // フロントからのアクセスを許可する。
  app.enableCors({
    // 今回はcookie から取得するため。
    credentials: true,
    // Next.js のIP
    origin: ['http://localhost:3001'],
  });
  // フロントエンドから受け取ったcookie を解析できるようにするためのもの
  app.use(cookieParser());
  await app.listen(3002);
}
bootstrap();
