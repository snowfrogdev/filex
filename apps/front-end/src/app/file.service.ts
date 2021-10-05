import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileAdded, FileChanged, FileDeleted, FileItem } from '@file-explorer/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FileDetails } from './file-details/file-details.component';

@Injectable({ providedIn: 'root' })
export class FileService {
  trees = new BehaviorSubject<FileItem[]>([]);

  constructor(private http: HttpClient, private socket: Socket, private snackBar: MatSnackBar) {}

  registerDirectories(directories: string) {
    const options = { params: new HttpParams().set('dirs', directories) };
    return this.http.get<FileItem[]>('/api/file-items', options).pipe(
      tap((trees) =>
        this.socket.emit(
          'watch-directory',
          trees.map((tree) => tree.path)
        )
      ),
      tap((trees) => this.trees.next(trees))
    );
  }

  subscribeToEvents() {
    this.socket.fromEvent<FileDeleted>('file-deleted').subscribe((event) => this.handleFileDeleted(event));

    this.socket.fromEvent<FileAdded>('file-added').subscribe((event) => this.handleFileAdded(event));

    this.socket.fromEvent<FileChanged>('file-changed').subscribe((event) => this.handleFileChanged(event));
  }

  private handleFileDeleted(event: FileDeleted): void {
    if (this.isRootDir(event.path)) {
      const newTree = this.trees.value.filter((rootDir) => rootDir.path !== event.path);
      this.trees.next(newTree);
      return;
    }

    const parent = this.findParent(event.path);
    if (parent?.children) {
      const index = parent.children.findIndex((file) => file.path === event.path);
      if (index !== -1) {
        parent.children.splice(index, 1);
        this.trees.next([...this.trees.value]);
        this.snackBar.open(`DELETED - '${event.path}'`, 'Close', { duration: 3500 });
      }
    }
  }

  private isRootDir(path: string): boolean {
    return this.trees.value.some((rootDir) => rootDir.path === path);
  }

  private findParent(path: string): FileItem | null {
    const queue = [...this.trees.value];
    while (queue.length) {
      const current = queue.shift() as FileItem;
      if (current.children) {
        if (current.children.some((file) => file.path === path)) return current;
        queue.push(...current.children);
      }
    }

    return null;
  }

  private handleFileAdded(event: FileAdded): void {
    const parent = this.findFileItem(event.parentDir);
    if (parent?.children) {
      if (parent.children.some((file) => file.name === event.file.name)) return;
      parent.children.push(event.file);
      parent.children.sort(this.sortByTypeAndName);
      this.trees.next([...this.trees.value]);
      this.snackBar.open(`CREATED - '${event.file.path}'`, 'Close', { duration: 3500 });
    }
  }

  private sortByTypeAndName(a: FileItem, b: FileItem): number {
    if (a.children && !b.children) return -1;
    if (!a.children && b.children) return 1;
    return a.name.localeCompare(b.name);
  }

  private findFileItem(path: string): FileItem | null {
    const queue = [...this.trees.value];
    while (queue.length) {
      const current = queue.shift() as FileItem;
      if (current.path === path) return current;
      if (current.children) queue.push(...current.children);
    }

    return null;
  }

  private handleFileChanged(event: FileChanged): void {
    const parent = this.findParent(event.path);
    const fileItem = parent?.children?.find((file) => file.path === event.path);
    if (fileItem && parent) {
      const newFileItem = { ...fileItem, stats: event.stats };
      parent.children = parent.children?.map((file) => (file.path === event.path ? newFileItem : file));
      parent.children?.sort(this.sortByTypeAndName);
      this.trees.next([...this.trees.value]);
      this.snackBar.open(`MODIFIED - '${event.path}'`, 'Close', { duration: 3500 });
    }
  }

  findFileItemByIno(ino: number): FileItem | null {
    const queue = [...this.trees.value];
    while (queue.length) {
      const current = queue.shift() as FileItem;
      if (current.stats.ino === ino) return current;
      if (current.children) queue.push(...current.children);
    }

    return null;
  }

  deleteFileItem(path: string) {
    const options = { headers: { 'Content-Type': 'application/json' }, body: { path } };
    return this.http.delete(`/api/file-items`, options);
  }

  editFileName(file: FileDetails) {
    const options = { headers: { 'Content-Type': 'application/json' } };
    return this.http.patch(`api/file-items`, { path: file.path, newName: file.name }, options);
  }

  moveFileItem(from: string, to: string) {
    const options = { headers: { 'Content-Type': 'application/json' } };
    return this.http.put(`api/file-items`, { from, to }, options);
  }

  addFileItem(name: string, path: string | undefined, type: 'file' | 'directory') {
    const options = { headers: { 'Content-Type': 'application/json' } };
    return this.http.post(`api/file-items`, { name, path, type }, options);
  }
}
