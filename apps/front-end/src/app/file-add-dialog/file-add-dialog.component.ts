import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './file-add-dialog.component.html',
  styleUrls: ['./file-add-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileAddDialogComponent {
  fileName = '';
  constructor(
    public dialogRef: MatDialogRef<FileAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string; directory: string }
  ) {}
}
