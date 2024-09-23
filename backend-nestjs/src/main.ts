import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { logger } from 'metalmental-logger';
import * as csrf from 'csurf';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    csrf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      value: (req: Request) => {
        return typeof req.headers['csrf-token'] === 'string'
          ? req.headers['csrf-token']
          : '';
      },
    }),
  );
  await app.listen(process.env.PORT || 3005);
  logger.info('Server is running');
}
bootstrap();

// csurfとは、CSRFトークンを生成し、リクエストに含めることで、リクエストを検証し、CSRF攻撃を防ぐためのライブラリです
// SameSiteを設定しないとフロントとバックエンドでCookieが共有されないため、CSRFトークンが生成されない
// JWTはトークンを使用しリクエストごとに認証する仕組みで、サインイン状態を保持しない

// CSRFは、以下の流れ
// 1. ユーザーがサインインし、サーバからCSRFトークンを取得
// 2. ユーザがCSRFトークンを含めてリクエストを送信する
// 3. サーバはCSRFトークンを検証し、正しいサーバに認証し、認証情報を取得しているかを確認してリクエストを処理する
// つまり、悪意あるユーザが何らかの方法で認証情報を取得し、サーバにリクエストを送信しても、CSRFトークンが正しくないため、リクエストを処理しないという仕組み
// また、サインインリクエストも含め、全てのリクエストにCSRFトークンを含める必要があるため、CSRFトークンを取得するAPIを用意している
// ※ただし、GetリクエストはCSRFトークンを含めなくても良いので、CSRFトークンを設定しなくても問題ない
