import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TargetApiGatewayMock } from './target-api-gateway.mock';
import { TL8Module } from './tl8.module';

describe('Tl8Module', () => {
  @Component({
    template: `{{ 'some.key' | tl8 }}
      <ng-container *ngIf="showSecondKey">{{
        'some.other.key' | tl8
      }}</ng-container>`,
  })
  class MyComponent {
    showSecondKey = true;
  }

  let targetGateway: TargetApiGatewayMock;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(() => {
    targetGateway = new TargetApiGatewayMock();
    jest.spyOn(targetGateway, 'sendToHost');
    (global as any).TL8_TARGET_API = targetGateway;

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          defaultLanguage: 'en',
        }),
        TL8Module.forRoot({
          langs: [{ lang: 'en', label: 'English' }],
        }),
      ],
      declarations: [MyComponent],
    });

    fixture = TestBed.createComponent(MyComponent);
    fixture.detectChanges();
  });

  it('#1 sends a state:ready to the Host App when starting', () => {
    expect(targetGateway.sendToHost).toHaveBeenNthCalledWith(1, 'state:ready', {
      langs: [{ label: 'English', lang: 'en' }],
    });
  });

  it('#2 sends the current language to the Host App when starting', () => {
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentLanguage',
      'en'
    );
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentAppTranslations',
      { en: {} }
    );
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentVisibleKeys',
      []
    );
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentVisibleKeys',
      ['some.key']
    );
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentAppTranslations',
      { en: {} }
    );
  });

  it('#3 sends the current translations to the Host App when starting', () => {
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentAppTranslations',
      { en: {} }
    );
  });

  it('#4 sends the current visible keys (as empty array) to the Host App when starting', () => {
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentVisibleKeys',
      []
    );
  });

  it('sends the current visible keys to the Host App a first time', () => {
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentVisibleKeys',
      ['some.key']
    );
  });

  it('sends the current visible keys every time they change', () => {
    fixture.componentInstance.showSecondKey = false;
    fixture.detectChanges();
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentVisibleKeys',
      ['some.key', 'some.other.key']
    );
    fixture.componentInstance.showSecondKey = true;
    fixture.detectChanges();
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentVisibleKeys',
      ['some.key']
    );
  });

  it('sends the new language when the language changes', () => {
    TestBed.inject(TranslateService).use('fr');
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentLanguage',
      'fr'
    );
  });

  it('sends the translations when the language changes', () => {
    TestBed.inject(TranslateService).use('fr');
    expect(targetGateway.sendToHost).toHaveBeenCalledWith(
      'state:currentAppTranslations',
      { fr: {}, en: {} }
    );
  });

  it('gets new translations from the TL8 application', () => {
    targetGateway.overwrittenTranslationsSubject.next({
      en: {
        'some.key': 'hey hey',
      },
    });
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toEqual(
      'hey hey some.other.key'
    );
  });

  it('sets the ngx-translate language when the TL8 application says so', () => {
    targetGateway.sendToTarget('selectLanguage', { value: 'fr' });
    expect(TestBed.inject(TranslateService).currentLang).toEqual('fr');
    targetGateway.sendToTarget('selectLanguage', { value: 'de' });
    expect(TestBed.inject(TranslateService).currentLang).toEqual('de');
  });
});
