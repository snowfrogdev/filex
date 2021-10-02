import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'file-explorer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.pipe(skip(1)).subscribe((params) => {
      const dirs = params['dirs'].trim();
      const options = params['dirs']
        ? { params: new HttpParams().set('dirs', dirs) }
        : {};
      this.http.get<any>('/api/directory-trees', options).subscribe();
    });
  }
}
