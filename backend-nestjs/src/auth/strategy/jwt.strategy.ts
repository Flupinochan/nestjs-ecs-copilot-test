import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { User } from '@prisma/client';
import { logger } from 'metalmental-logger';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // JWTをリクエストのクッキーから抽出する
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let jwt = null;
          if (request && (request as any).cookies) {
            logger.info(`Cookies: ${JSON.stringify((request as any).cookies)}`);
            jwt = (request as any).cookies['access_token'];
          }
          logger.info(`Extracted JWT: ${jwt}`);
          return jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // JWTは、ユーザーが正しいユーザーであることを示すためのトークンであり、セキュアでスケーラブルな認証方法を提供
  // validateメソッドで、JWTのペイロードを検証し、ユーザーをデータベースから取得
  async validate(payload: { sub: number; email: string }): Promise<User> {
    logger.info(`Validating JWT payload: ${JSON.stringify(payload)}`);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    delete user.hashedPassword;
    return user;
  }
}
