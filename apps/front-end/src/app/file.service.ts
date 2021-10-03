import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FileAdded,
  FileDeleted,
  FileItem,
} from '@file-explorer/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FileService {
  readonly trees = new BehaviorSubject<FileItem[]>([]);
  constructor(private http: HttpClient, private socket: Socket) {}

  registerDirectories(directories: string) {
    const options = { params: new HttpParams().set('dirs', directories) };
    this.http
      .get<FileItem[]>('/api/directory-trees', options)
      .pipe(
        tap((trees) =>
          this.socket.emit(
            'watch-directory',
            trees.map((tree) => tree.path)
          )
        )
      )
      .subscribe((trees) => this.trees.next(trees));
  }

  subscribeToEvents() {
    this.socket
      .fromEvent<FileDeleted>('file-deleted')
      .subscribe((event) => this.handleFileDeleted(event));

    this.socket
      .fromEvent<FileAdded>('file-added')
      .subscribe((event) => this.handleFileAdded(event));
  }

  private handleFileDeleted(event: FileDeleted): void {
    const parent = this.findParent(event.path);
    if (parent?.children) {
      const index = parent.children.findIndex(
        (file) => file.path === event.path
      );
      if (index !== -1) {
        parent.children.splice(index, 1);
        this.trees.next(this.trees.value);
      }
    }
  }

  private findParent(path: string): FileItem | undefined {
    const queue = [...this.trees.value];
    while (queue.length) {
      const current = queue.shift() as FileItem;
      if (current.children) {
        if (current.children.some((file) => file.path === path)) return current;
        queue.push(...current.children);
      }
    }

    return undefined;
  }

  private handleFileAdded(event: FileAdded): void {
    const parent = this.findFileItem(event.parentDir);
    if (parent?.children) {
      if (parent.children.some((file) => file.name === event.file.name)) return;
      parent.children.push(event.file);
      this.trees.next(this.trees.value);
    }
  }

  private findFileItem(path: string): FileItem | undefined {
    const queue = [...this.trees.value];
    while (queue.length) {
      const current = queue.shift() as FileItem;
      if (current.path === path) return current;
      if (current.children) queue.push(...current.children);
    }

    return undefined;
  }
}