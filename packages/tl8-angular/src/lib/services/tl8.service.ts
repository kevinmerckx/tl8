import { Inject, Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { TranslatedContextMenuParams } from '../interfaces/context-menu-params';
import {
  TargetApplicationConfig,
  WebAppOverwrittenTranslations,
} from '../target-api';
import { TL8_CONFIG } from '../tl8-config.token';
import { TargetService } from './target.service';

interface TL8State {
  overwrittenTranslations: WebAppOverwrittenTranslations;
  currentEntries: Set<TL8Entry>;
}

export interface TL8Entry {
  element: HTMLElement;
  key: string;
  currentValue: string;
  initialValue: string;
}

@Injectable({
  providedIn: 'root',
})
export class TL8Service {
  private _state = new BehaviorSubject<TL8State>({
    overwrittenTranslations: {},
    currentEntries: new Set(),
  });

  private get currentKeysInView$(): Observable<string[]> {
    return this._state.pipe(
      map(({ currentEntries }) => currentEntries),
      distinctUntilChanged(),
      map((entries) =>
        Array.from(entries.values()).reduce((prev, { key }) => {
          if (prev.includes(key)) {
            return prev;
          }
          return [...prev, key];
        }, [] as string[])
      )
    );
  }

  private overwrittenTranslations$ = this._state.pipe(
    map(({ overwrittenTranslations }) => overwrittenTranslations)
  );

  constructor(
    private translate: TranslateService,
    private target: TargetService,
    @Inject(TL8_CONFIG) private tl8config: TargetApplicationConfig,
    private zone: NgZone
  ) {}

  start(): void {
    if (!this.target.isHosted) {
      return;
    }
    this.target.gatewayOrThrow.onSetOverwrittenTranslations(
      (overwrittenTranslations: WebAppOverwrittenTranslations) => {
        this.zone.run(() => {
          this.setOverwrittenTranslations(overwrittenTranslations);
        });
      }
    );
    this.target.sendToHost('state:ready', this.tl8config);
    this.target.declareReady(this.tl8config).then((overwrittenTranslations) => {
      this.setOverwrittenTranslations(overwrittenTranslations);
    });
    this.translate.onLangChange
      .pipe(
        startWith(true),
        map(() => this.translate.currentLang || this.translate.defaultLang),
        tap((lang) => this.target.sendToHost('state:currentLanguage', lang))
      )
      .subscribe();
    combineLatest(
      this.tl8config.langs
        .map(({ lang }) => lang)
        .map((lang) => this.translate.getTranslation(lang))
    )
      .pipe(
        tap(() => {
          this.target.sendToHost(
            'state:currentAppTranslations',
            this.translate.translations
          );
        })
      )
      .subscribe();
    this.target.on<{ value: string }>('selectLanguage', ({ value }) => {
      this.translate.use(value);
    });
    this.currentKeysInView$
      .pipe(
        tap((values) =>
          this.target.sendToHost('state:currentVisibleKeys', values)
        )
      )
      .subscribe();

    if (!this.tl8config.withoutContextMenu) {
      window.addEventListener('contextmenu', (e) => {
        const targets = window.document.elementsFromPoint(e.clientX, e.clientY);
        const entry =
          this.currentEntriesAsArray.find((entry) =>
            Array.from(targets[0].childNodes).some((c) => c === entry.element)
          ) ||
          this.currentEntriesAsArray.find((entry) =>
            Array.from(targets).some((c) => c === entry.element)
          );
        if (entry) {
          const translatedContextMenuParams: TranslatedContextMenuParams = {
            key: entry.key,
            currentValue: entry.currentValue,
            initialValue: entry.initialValue,
          };
          this.target.openContextMenu(translatedContextMenuParams);
        } else {
          this.target.openContextMenu({
            nodeContent: (e.target as HTMLElement)?.textContent,
            lang: this.currentLang,
          });
        }
        e.preventDefault();
      });
    }
  }

  observeOverwrittenTranslation(key: string): Observable<string | null> {
    return combineLatest([this.overwrittenTranslations$, this.lang$]).pipe(
      map(([overwrittenTranslations, lang]) => overwrittenTranslations[lang]),
      distinctUntilChanged(),
      map((translationsForLang) => {
        if (!translationsForLang) {
          return null;
        }
        return translationsForLang[key] || null;
      }),
      distinctUntilChanged()
    );
  }

  registerElement(entry: TL8Entry): void {
    const currentEntries = new Set(this._state.value.currentEntries);
    currentEntries.add(entry);
    this._state.next({
      ...this._state.value,
      currentEntries,
    });
  }

  unregsiterElement(entry: TL8Entry): void {
    const currentEntries = new Set(this._state.value.currentEntries);
    currentEntries.delete(entry);
    this._state.next({
      ...this._state.value,
      currentEntries,
    });
  }

  private setOverwrittenTranslations(obj: WebAppOverwrittenTranslations): void {
    this._state.next({
      ...this._state.value,
      overwrittenTranslations: obj,
    });
  }

  private get currentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang;
  }

  private get lang$(): Observable<string> {
    return this.translate.onLangChange.pipe(
      map((e) => e.lang),
      startWith(this.currentLang)
    );
  }

  private get currentEntriesAsArray() {
    return Array.from(this._state.value.currentEntries.values());
  }
}
