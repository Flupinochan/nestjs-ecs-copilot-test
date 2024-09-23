import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// @Controller()内でパス指定可能1
@Controller()
export class AppController {
  // コンストラクタでapp.serviceをインスタンス化して、使用したいサービスをprivate readonlyで指定する
  constructor(private readonly appService: AppService) {}

  // @Get()内でパス指定可能2
  @Get('hellor')
  getHello(): string {
    // thisは、AppControllerのインスタンスを指す
    return this.appService.getHello();
  }
}
