import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, timer} from 'rxjs';
import { map } from 'rxjs/operators';

const messages = [
  'Your call is important to us, please remain glued to the screen while we fetch your information...',
  "Wow... that's a lot of files...",
  'We are almost done, just a few more hou... seconds...',
  'What are you keeping in there, the whole internet?...',
  'Please wait while a large software vendor takes over the world...',
  'Steve Jobs would have never allowed this...',
  'What did you expect, I only had 4 days to make this...',
  'You might want to try again without targeting the root directory of your system.'
]

@Component({
  selector: 'file-explorer-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingScreenComponent implements OnInit {
  loadingMessage!: Observable<string>;
  index = 0;

  ngOnInit() {

    this.loadingMessage = timer(0, 8000).pipe(
      map(_ => messages[this.index++ % messages.length])
    );
    
  }
}
