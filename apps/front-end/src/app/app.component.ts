import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { mergeMap, skip } from 'rxjs/operators';
import { FileItem } from '@file-explorer/api-interfaces';

@Component({
  selector: 'file-explorer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        skip(1),
        mergeMap((params: Params) => {
          const dirs = params['dirs'].trim();
          const options = params['dirs']
            ? { params: new HttpParams().set('dirs', dirs) }
            : {};
          return this.http.get<FileItem[]>('/api/directory-trees', options);
        })
      )
      .subscribe((trees) => console.log(trees));
  }
}
