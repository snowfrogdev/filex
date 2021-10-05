import { FileItem } from '@file-explorer/api-interfaces';
import { Injectable } from '@nestjs/common';
import { readdir, rename, rm, stat, writeFile } from 'fs/promises';
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

  async renameFileItem(oldPath: string, newName: string): Promise<void> {
    const dir = path.dirname(oldPath);
    const newPath = path.resolve(dir, newName);
    return rename(oldPath, newPath);
  }

  async moveFileItem(oldPath: string, newPath: string): Promise<void> {
    const name = path.basename(oldPath);
    if ((await stat(newPath)).isDirectory()) {
      return rename(oldPath, path.resolve(newPath, name));
    }

    newPath = path.dirname(newPath);
    return rename(oldPath, path.resolve(newPath, name));
  }

  async createFile(referencePath: string, name: string): Promise<void> {
    if(!(await stat(referencePath)).isDirectory()) {
      referencePath = path.dirname(referencePath);
    }
    return await writeFile(path.resolve(referencePath, name), '');
  }
}
