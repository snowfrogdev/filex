import { FileItem } from '@file-explorer/api-interfaces';
import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('directory-trees')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getDirectoryTrees(
    @Query('dirs') directories: string | undefined
  ): Promise<FileItem[]> {
    if (!directories) {
      throw new HttpException('No directories provided', 400);
    }

    return this.appService.getDirectoryTrees(directories);
  }
}
