import { FileEventsMap, FileItem } from '@file-explorer/api-interfaces';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import chokidar from 'chokidar';
import { Stats } from 'fs';
import nodePath from 'path';
import { Server } from 'socket.io';

@WebSocketGateway(8988, { cors: { origin: '*' } })
export class AppGateway {
  @WebSocketServer()
  server: Server<FileEventsMap>;

  @SubscribeMessage('watch-directory')
  watchDirectory(@MessageBody() paths: string[]) {
    chokidar.watch(paths, { ignoreInitial: true, alwaysStat: true }).on('all', (event, path, stats) => {
      switch (event) {
        case 'unlink':
        case 'unlinkDir':
          this.handleUnlink(path);
          break;
        case 'add':
          this.handleAdd(path, stats);
          break;
        case 'addDir':
          this.handleAddDir(path, stats);
          break;
        case 'change':
          this.handleChange(path, stats);
          break;
      }
    });
  }

  private handleUnlink(path: string) {
    this.server.emit('file-deleted', { path });
  }

  private handleAdd(path: string, stats: Stats) {
    const parentDir = nodePath.dirname(path);
    const file: FileItem = {
      name: nodePath.basename(path),
      path,
      stats,
    };
    this.server.emit('file-added', { file, parentDir });
  }

  private handleAddDir(path: string, stats: Stats) {
    const parentDir = nodePath.dirname(path);
    const file: FileItem = {
      name: nodePath.basename(path),
      path,
      stats,
      children: [],
    };
    this.server.emit('file-added', { file, parentDir });
  }

  private handleChange(path: string, stats: Stats) {
    this.server.emit('file-changed', { path, stats });
  }
}
