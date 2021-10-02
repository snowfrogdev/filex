import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import chokidar from 'chokidar';
import { Server } from 'socket.io';
import { FileEventsMap } from '@file-explorer/api-interfaces';
import { FileService } from './file.service';

@WebSocketGateway(8988, { cors: { origin: '*' } })
export class AppGateway {
  @WebSocketServer()
  server: Server<FileEventsMap>;

  constructor(private fileService: FileService) { }

  @SubscribeMessage('watch-directory')
  watchDirectory(@MessageBody() paths: string[]) {
    const watcher = chokidar.watch(paths, { ignoreInitial: true, alwaysStat: true })
      .on('all', (event, path, stats) => {
        switch (event) {
          case 'unlink': this.handleUnlink(path)
        }
      
    });
  }

  private handleUnlink(path: string) {
    this.server.emit('file-deleted', { path });
  }
}
