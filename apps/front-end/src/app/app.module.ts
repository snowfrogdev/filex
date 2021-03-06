import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { HesitateDirective } from './directives/hesitate.directive';
import { FileAddDialogComponent } from './file-add-dialog/file-add-dialog.component';
import { FileDeleteDialogComponent } from './file-delete-dialog/file-delete-dialog.component';
import { FileDetailsComponent } from './file-details/file-details.component';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';

const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    FileTreeComponent,
    FileDetailsComponent,
    FileDeleteDialogComponent,
    HesitateDirective,
    FileAddDialogComponent,
    LoadingScreenComponent,
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    FlexLayoutModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([]),
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTreeModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
