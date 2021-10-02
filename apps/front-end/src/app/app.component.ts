import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { skip } from 'rxjs/operators';
import { FileService } from './file.service';

@Component({
  selector: 'file-explorer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.fileService.subscribeToEvents();

    this.route.queryParams.pipe(skip(1)).subscribe((params: Params) => {
      const dirs = params['dirs'].trim();
      if (dirs) {
        this.fileService.registerDirectories(dirs);
      }
    });
  }
}
