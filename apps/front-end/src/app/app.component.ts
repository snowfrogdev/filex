import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FileItem } from '@file-explorer/api-interfaces';
import { Observable } from 'rxjs';
import { skip } from 'rxjs/operators';
import { FileDetails } from './file-details/file-details.component';
import { FileTreeNode } from './file-tree/file-tree.component';
import { FileService } from './file.service';

@Component({
  selector: 'file-explorer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  sidebarOpened = false;
  selectedFileItem: FileDetails | null = null;
  trees: Observable<FileItem[]> = this.fileService.trees;

  constructor(private route: ActivatedRoute, private fileService: FileService) {}

  ngOnInit() {
    this.fileService.subscribeToEvents();
    this.route.queryParams.pipe(skip(1)).subscribe((params: Params) => {
      const dirs = params['dirs'].trim();
      if (dirs) {
        this.fileService.registerDirectories(dirs);
      }
    });

    this.trees.subscribe(() => this.updateSelectedFileItem());
  }

  closeSidebar() {
    this.sidebarOpened = false;
  }

  handleFileNodeClick(fileTreeNode: FileTreeNode) {
    if (!fileTreeNode.expandable) {
      this.sidebarOpened = true;
    }
    this.selectedFileItem = fileTreeNode;
  }

  updateSelectedFileItem() {
    if (this.selectedFileItem) {
      this.selectedFileItem = this.fileService.findFileItemByIno(this.selectedFileItem.stats.ino);
    }

    if (!this.selectedFileItem) {
      this.closeSidebar();
    }
  }
}
