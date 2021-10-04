import { FileItem } from '@file-explorer/api-interfaces';
import { Body, Controller, Delete, Get, HttpException, Patch, Query } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file-items')
export class AppController {
  constructor(private readonly appService: FileService) {}

  @Get()
  async getFileItems(@Query('dirs') directories: string | undefined): Promise<FileItem[]> {
    if (!directories) {
      throw new HttpException('No directories provided', 400);
    }

    return this.appService.getFileItems(directories);
  }

  @Delete()
  async deleteFileItem(@Body('path') path: string): Promise<void> {
    if (!path) {
      throw new HttpException('No path provided', 400);
    }

    return this.appService.deleteFileItem(path);
  }

  @Patch()
  async renameFileItem(@Body('path') path: string, @Body('newName') newName: string): Promise<void> {
    if (!path || !newName) {
      throw new HttpException('No path or new name provided', 400);
    }

    return this.appService.renameFileItem(path, newName);
  }
}
