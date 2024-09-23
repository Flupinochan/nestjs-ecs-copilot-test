import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from 'metalmental-logger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthResponse, CsrfResponse } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // CSRFトークンを取得(CSRFトークンを取得するAPIは、CSRFトークンをヘッダーに含めなくても良い)
  @Get('csrf-token')
  getCsrfToken(@Req() req: Request): CsrfResponse {
    return { csrfToken: req.csrfToken() };
  }

  // サインアップ(ユーザーを作成)
  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<AuthResponse> {
    logger.info('サインアップに成功しました');
    return this.authService.signup(dto);
  }

  // サインイン(JWTを生成し、Cookieに保存)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const jwt = await this.authService.signin(dto);
    res.cookie('access_token', jwt.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    logger.info('サインインに成功しました');
    return { message: 'サインインに成功しました' };
  }

  // サインアウト(Cookieを削除)
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    logger.info('サインアウトに成功しました');
    return { message: 'サインアウトに成功しました' };
  }
}
