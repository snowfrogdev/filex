import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import prettyBytes from 'pretty-bytes';
import { FlatTreeNode } from '../file-tree/file-tree.component';
import { FileService } from '../file.service';

@Component({
  selector: 'file-explorer-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDetailsComponent implements OnInit {
  selectedFile!: Observable<FlatTreeNode | null>
  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.selectedFile = this.fileService.selectedNode;
  }

  getFileSize(file: FlatTreeNode): string {
    return prettyBytes(file.stats.size);
  }

  closeSideNav() {
    this.fileService.closeSideNav();
  }
}
