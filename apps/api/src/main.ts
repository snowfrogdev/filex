import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import open from 'open';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

async function bootstrap() {
  let dirs: string;
  if (environment.production) {
    dirs = process.argv.slice(2).join(',');
    if (!dirs) {
      console.error('Please specify at least one directory to open.');
      process.exit(1);
    }
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });

  if (environment.production) {
    open(`http://localhost:${port}?dirs=${dirs}`);
  }
}

bootstrap();
