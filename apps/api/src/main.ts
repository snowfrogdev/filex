import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import open from 'open';
import { AppModule } from './app/app.module';
import { Command } from 'commander';
import { environment } from './environments/environment';
import { existsSync } from 'fs';
import chalk from 'chalk';

async function bootstrap() {
  const port = process.env.PORT || 3333;

  if (environment.production) {
    const program = new Command();
    program
      .argument('[dirs...]')
      .description(
        'Open a file explorer in a browser with the directories passed in as arguments to this command. Defaults to the current directory.'
      )
      .action(async (dirs: string[]) => {
        let dirsQueryParam: string;
        if (!dirs || !dirs.length) {
          dirsQueryParam = './';
        } else {
          dirs.forEach((dir: string) => {
            if (!existsSync(dir)) {
              console.error(chalk.red(`Directory ${dir} does not exist`));
              process.exit(1);
            }
          });
          dirsQueryParam = dirs.join(',');
        }

        await startWebServer(port);
        open(`http://localhost:${port}?dirs=${dirsQueryParam}`);
      })
      .parseAsync(process.argv);
    return;
  }

  await startWebServer(port);
}

async function startWebServer(port: string | number) {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
