// Import the core angular services.
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[fileExplorerHesitate]',
  exportAs: 'hesitation',
})
export class HesitateDirective implements OnInit, OnDestroy {
  @Input() duration = 1000;
  @Output() hesitates = new EventEmitter<void>();
  private unlisteners: ((...args: unknown[]) => void)[] | null = null;
  private timer = 0;

  constructor(private elementRef: ElementRef, private renderer: Renderer2, private zone: NgZone) {}

  public cancel(): void {
    clearTimeout(this.timer);
  }

  public ngOnDestroy(): void {
    this.cancel();

    // If we have event-handler bindings, unbind them all.
    if (this.unlisteners) {
      for (const unlistener of this.unlisteners) {
        unlistener();
      }
    }
  }

  public ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.unlisteners = [
        this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', this.handleMouseenter),
        this.renderer.listen(this.elementRef.nativeElement, 'mousedown', this.handleMousedown),
        this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', this.handleMouseleave),
      ];
    });
  }

  private handleMousedown = (event: MouseEvent): void => {
    this.cancel();
  };

  private handleMouseenter = (event: MouseEvent): void => {
    this.timer = setTimeout(this.handleTimerThreshold, this.duration) as unknown as number;
  };

  private handleMouseleave = (event: MouseEvent): void => {
    this.cancel();
  };

  private handleTimerThreshold = (): void => {
    this.zone.runGuarded(() => {
      this.hesitates.emit();
    });
  };
}
