import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
export class FileDetailsComponent {
  @Output() closeButtonClicked = new EventEmitter();
  @Input() fileItem: FileDetails | null = null;

  getFileSize(file: FileDetails): string {
    return prettyBytes(file.stats.size);
  }

  handleCloseButtonClick() {
    this.closeButtonClicked.emit();
  }
}
