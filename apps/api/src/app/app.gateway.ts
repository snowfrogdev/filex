import { FileEventsMap, FileItem } from '@file-explorer/api-interfaces';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import chokidar from 'chokidar';
import { Stats } from 'fs';
import { Server } from 'socket.io';
import { FileService } from './file.service';
import nodePath from 'path';

@WebSocketGateway(8988, { cors: { origin: '*' } })
export class AppGateway {
  @WebSocketServer()
  server: Server<FileEventsMap>;

  constructor(private fileService: FileService) {}

  @SubscribeMessage('watch-directory')
  watchDirectory(@MessageBody() paths: string[]) {
    const watcher = chokidar
      .watch(paths, { ignoreInitial: true, alwaysStat: true })
      .on('all', (event, path, stats) => {
        console.log(event, path)
        switch (event) {
          case 'unlink':
          case 'unlinkDir':
            this.handleUnlink(path);
            break;
          case 'add':
            this.handleAdd(path, stats)
        }
      });
  }

  private handleUnlink(path: string) {
    this.server.emit('file-deleted', { path });
  }

  private handleAdd(path: string, stats: Stats) {
    const directory = nodePath.dirname(path);
    const file: FileItem = {
      name: nodePath.basename(path),
      path,
      stats,
    }
    this.server.emit('file-added', { file, directory });
  }
}
