import { Body, Controller, Patch, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { logger } from 'metalmental-logger';
@UseGuards(AuthGuard('jwt')) // JWT認証されている場合のみ処理が実行される
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // nestjsでは、ルーティングする際に、@Req()や@Body()を使用して、リクエストオブジェクトやボディを取得して、処理を実行できる
  @Get()
  getLoginUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
    const user = req.user as User;
    logger.info(`サインインユーザー: ${user.email}`);
    return user;
  }

  @Patch()
  updateUser(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const user = req.user as User;
    return this.userService.updateUser(user.id, dto);
  }
}
