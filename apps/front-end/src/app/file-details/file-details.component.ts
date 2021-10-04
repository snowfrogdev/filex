import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import prettyBytes from 'pretty-bytes';

export interface FileDetails {
  name: string;
  path: string;
  stats: {
    ino: number;
    size: number;
    birthtimeMs: number;
    atimeMs: number;
    mtimeMs: number;
  };
}

@Component({
  selector: 'file-explorer-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDetailsComponent implements OnChanges {
  @Output() closeButtonClicked = new EventEmitter();
  @Output() editedName = new EventEmitter();
  @Input() fileItem: FileDetails | null = null;

  editMode = false;

  ngOnChanges() {
    this.editMode = false;
  }

  getFileSize(file: FileDetails): string {
    return prettyBytes(file.stats.size);
  }

  handleCloseButtonClick() {
    this.editMode = false;
    this.closeButtonClicked.emit();
  }

  save(name: string) {
    if (this.fileItem) {
      this.fileItem.name = name;
      this.editedName.next(this.fileItem);
      this.editMode = false;
    }
  }
}
