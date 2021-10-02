import { Controller, Get, Query } from '@nestjs/common';
import { Message } from '@file-explorer/api-interfaces';
import { AppService } from './app.service';

@Controller('directory-trees')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getDirectoryTrees(@Query('dirs') directories: string) {
    console.log(directories);
    //return this.appService.getDirectoryTrees();
  }
}
