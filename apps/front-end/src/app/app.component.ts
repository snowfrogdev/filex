import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { FileItem } from '@file-explorer/api-interfaces';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry, skip } from 'rxjs/operators';
import { FileDeleteDialogComponent } from './file-delete-dialog/file-delete-dialog.component';
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
  isLoading = new BehaviorSubject(false);
  sidebarOpened = false;
  selectedFileItem: FileDetails | null = null;
  trees: Observable<FileItem[]> = this.fileService.trees;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.fileService.subscribeToEvents();
    this.route.queryParams.pipe(skip(1)).subscribe((params: Params) => {
      this.isLoading.next(true);
      const dirs = params['dirs'].trim();
      if (dirs) {
        this.fileService.registerDirectories(dirs);
      }
    });

    this.trees.subscribe(() => {
      this.updateSelectedFileItem();
      this.isLoading.next(false);
    });
  }

  private updateSelectedFileItem() {
    if (this.selectedFileItem) {
      this.selectedFileItem = this.fileService.findFileItemByIno(this.selectedFileItem.stats.ino);
    }

    if (!this.selectedFileItem) {
      this.closeSidebar();
    }
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

  handleDeleteClick(fileTreeNode: FileTreeNode) {
    const dialogRef = this.dialog.open(FileDeleteDialogComponent, { data: fileTreeNode.name, disableClose: true });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading.next(true);
        this.fileService
          .deleteFileItem(fileTreeNode.path)
          .pipe(
            retry(1),
            catchError((error) => {
              this.snackBar.open('Delete operation failed', 'Close', { duration: 3500 });
              this.isLoading.next(false);
              return throwError(error);
            })
          )
          .subscribe((_) => {
            this.isLoading.next(false);
          });
      }
    });
  }

  handleEditName(file: FileDetails) {
    this.fileService
      .editFileName(file)
      .pipe(
        retry(1),
        catchError((error) => {
          this.snackBar.open('Renaming operation failed', 'Close', { duration: 3500 });
          this.isLoading.next(false);
          return throwError(error);
        })
      )
      .subscribe((_) => {
        this.isLoading.next(false);
      });
  }
}
