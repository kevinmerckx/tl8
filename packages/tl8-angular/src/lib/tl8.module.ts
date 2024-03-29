import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TL8Pipe } from './pipes/tl8.pipe';
import { TL8Service } from './services/tl8.service';
import { startTl8Factory } from './start-tl8.factory';
import { TargetApplicationConfig } from './target-api';
import { TL8_CONFIG } from './tl8-config.token';


@NgModule({
  declarations: [TL8Pipe],
  imports: [
    TranslateModule,
    CommonModule,
  ],
  exports: [TL8Pipe],
})
export class TL8Module {
  static forRoot(config: TargetApplicationConfig): ModuleWithProviders<TL8Module> {
    return {
      ngModule: TL8Module,
      providers: [
        { provide: TL8_CONFIG, useValue: config },
        { provide: APP_INITIALIZER, useFactory: startTl8Factory, multi: true, deps: [TL8Service] }
      ],
    };
  }
}
