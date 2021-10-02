import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front-end'),
      exclude: ['/api*'],
    })
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
