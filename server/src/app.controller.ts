import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async sendAll(@Query() query: any) {
    console.log('controller response');
    const res = await this.appService.sendAll(query);
    console.log(res);
    return res;
  }

  @Get()
  async getMessageHistory() {
    const res = await this.appService.getAll();
    console.log(res);
    return res;
  }
}
