import { FileItem } from '@file-explorer/api-interfaces';
import { Injectable } from '@nestjs/common';
import { readdir, rm, stat, unlink } from 'fs/promises';
import path from 'path';

@Injectable()
export class FileService {
  async getFileItems(directories: string): Promise<FileItem[]> {
    const trees: Promise<FileItem>[] = [];
    directories.split(',').forEach((directory) => trees.push(this.getDirectoryTree(directory)));
    return await Promise.all(trees);
  }

  async getDirectoryTree(directory: string): Promise<FileItem> {
    const stats = await stat(directory);
    const absolutePath = path.resolve(directory);
    const name = path.basename(absolutePath);
    const results: FileItem = { name, path: absolutePath, stats, children: [] };

    const childDirectories: Promise<FileItem>[] = [];
    const childFiles: FileItem[] = [];

    const childrenNames = await readdir(directory);
    for (const childrenName of childrenNames) {
      const filePath = `${directory}${path.sep}${childrenName}`;
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        childDirectories.push(this.getDirectoryTree(filePath));
      } else {
        childFiles.push({
          name: childrenName,
          path: path.resolve(filePath),
          stats,
        });
      }
    }

    results.children?.push(...(await Promise.all(childDirectories)));
    results.children?.push(...childFiles);
    return results;
  }

  async deleteFileItem(path: string): Promise<void> {
    return rm(path, { recursive: true });
  }
}
