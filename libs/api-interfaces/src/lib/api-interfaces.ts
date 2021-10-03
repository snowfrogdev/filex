import { Stats } from 'fs';

export interface FileItem {
  name: string;
  path: string;
  stats: Stats;
  children?: FileItem[];
}

export class FileDeleted {
  constructor(readonly path: string) {}
}

export class FileAdded {
  constructor(readonly file: FileItem, readonly parentDir: string) {}
}

export interface FileEventsMap {
  'file-deleted': (event: FileDeleted) => void;
  'file-added': (event: FileAdded) => void;
}
