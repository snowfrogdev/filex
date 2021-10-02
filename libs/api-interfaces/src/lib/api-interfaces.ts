import { Stats } from 'fs';

export interface FileItem {
  name: string;
  path: string;
  stats: Stats;
  children?: FileItem[];
}

export interface FileEvent {
  path: string;
}

export class FileDeleted implements FileEvent {
  constructor(readonly path: string) {}
}

export interface FileEventsMap {
  'file-deleted': (event: FileDeleted) => void;
}
