import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './file-delete-dialog.component.html',
  styleUrls: ['./file-delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public fileName: string) {}
}
