import { Stats } from 'fs';

export interface FileItem {
  name: string;
  path: string;
  stats: Stats;
  children?: FileItem[];
}
