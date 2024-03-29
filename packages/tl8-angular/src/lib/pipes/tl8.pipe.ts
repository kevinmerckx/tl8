import {
  ChangeDetectorRef,
  ElementRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { TL8Entry, TL8Service } from '../services/tl8.service';

@Pipe({
  name: 'tl8',
  pure: false,
})
export class TL8Pipe implements PipeTransform, OnDestroy, TL8Entry {
  private currentKey$ = new BehaviorSubject<string | null>(null);
  private tPipe = new TranslatePipe(this.translateService, this.chDetectorRef);
  private currentKey: string | null = null;
  private currentTranslation: string | null = null;

  constructor(
    private translateService: TranslateService,
    private chDetectorRef: ChangeDetectorRef,
    private tl8Service: TL8Service,
    private elementRef: ElementRef<HTMLElement>
  ) {
    this.currentKey$
      .pipe(
        distinctUntilChanged(),
        switchMap((key) => {
          if (key) {
            return this.tl8Service.observeOverwrittenTranslation(key);
          }
          return of(null);
        }),
        tap((translation) => {
          this.chDetectorRef.markForCheck();
          this.currentTranslation = translation;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.tPipe.ngOnDestroy();
    this.unregister();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(key: string, ...args: unknown[]): any {
    this.currentKey$.next(key);
    if (this.currentKey !== key) {
      this.unregister();
      this.currentKey = key;
      this.register();
    }
    if (this.currentTranslation === null) {
      return this.tPipe.transform(key, ...args);
    }
    return this.translateService.parser.interpolate(
      this.currentTranslation,
      ...args
    );
  }

  get key() {
    return this.currentKey as string;
  }

  get element() {
    return this.elementRef.nativeElement;
  }

  get currentValue() {
    if (this.currentTranslation === null) {
      return this.initialValue;
    }
    return this.currentTranslation;
  }

  get initialValue() {
    return this.translateService.instant(this.currentKey as string);
  }

  private unregister(): void {
    if (this.currentKey) {
      this.tl8Service.unregsiterElement(this);
    }
  }

  private register(): void {
    if (this.currentKey) {
      this.tl8Service.registerElement(this);
    }
  }
}
