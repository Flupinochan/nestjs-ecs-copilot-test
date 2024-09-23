import { Injectable, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthDto } from './dto/auth.dto';
import { AuthResponse, JwtTokenResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}
  /////////////////////
  // サインアップ処理 //
  /////////////////////
  async signup(dto: AuthDto): Promise<AuthResponse> {
    // emailとハッシュ化したpasswordをprismaでデータベースに登録
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashedPassword,
        },
      });
      return { message: 'サインアップに成功しました' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'このメールアドレスはすでに登録されています',
          );
        }
      }
      throw error;
    }
  }
  ///////////////////
  // サインイン処理 //
  ///////////////////
  async signin(dto: AuthDto): Promise<JwtTokenResponse> {
    // emailとpasswordをデータベースから取得
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // ユーザーが存在しない場合は、エラーをスロー
    if (!user) {
      throw new ForbiddenException(
        'メールアドレスまたはパスワードが間違っています',
      );
    }
    // パスワードが一致しない場合は、エラーをスロー
    const passwordMatch = await bcrypt.compare(
      dto.password,
      user.hashedPassword,
    );
    if (!passwordMatch) {
      throw new ForbiddenException(
        'メールアドレスまたはパスワードが間違っています',
      );
    }
    // ユーザとパスワードに問題がなければ、ユーザとパスワードを使ってJWTを生成し、JWTを返す
    return this.signJwt(user.id, user.email);
  }
  /////////////////////
  // JWTを生成する処理 //
  /////////////////////
  async signJwt(userId: number, email: string): Promise<JwtTokenResponse> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      secret: secret,
      expiresIn: '30m',
    });
    return { access_token: token };
  }
}
