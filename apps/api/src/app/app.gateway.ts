import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import chokidar from 'chokidar';
import { Server } from 'socket.io';

@WebSocketGateway(8988, { cors: { origin: '*' } })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('watch-directory')
  watchDirectory(@MessageBody() paths: string[]) {
    for (const path of paths) {
      chokidar.watch(path, { ignoreInitial: true }).on('all', (event, path) => {
        this.server.emit('directory-updated', { event, path });
      });
    }
  }
}
