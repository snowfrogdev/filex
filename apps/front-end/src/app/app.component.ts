import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FileItem } from '@file-explorer/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { mergeMap, skip, tap } from 'rxjs/operators';

@Component({
  selector: 'file-explorer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  trees!: Observable<FileItem[]>;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private socket: Socket
  ) {}

  ngOnInit() {
    this.socket
      .fromEvent('directory-updated')
      .subscribe((data) => console.log(data));

    this.trees = this.route.queryParams.pipe(
      skip(1),
      mergeMap((params: Params) => {
        const dirs = params['dirs'].trim();
        const options = params['dirs']
          ? { params: new HttpParams().set('dirs', dirs) }
          : {};
        return this.http.get<FileItem[]>('/api/directory-trees', options);
      }),
      tap((trees) => {
        this.socket.emit(
          'watch-directory',
          trees.map((tree) => tree.path)
        );
      })
    );
  }
}
