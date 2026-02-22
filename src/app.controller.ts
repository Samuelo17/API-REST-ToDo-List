import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test-connection')
async testConn() {
  return await this.appService.checkDatabase();
}
}
