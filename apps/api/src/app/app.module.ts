import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { FileService } from './file.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front-end'),
      exclude: ['/api*'],
    })
  ],
  controllers: [AppController],
  providers: [FileService, AppGateway],
})
export class AppModule {}
