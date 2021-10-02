import { FileItem } from '@file-explorer/api-interfaces';
import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('directory-trees')
export class AppController {
  constructor(private readonly appService: FileService) {}

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
