import { filter, Subject, tap } from 'rxjs';
import { ContextMenuParams } from './interfaces/context-menu-params';
import {
  TargetApiGateway,
  TargetApplicationConfig,
  WebAppOverwrittenTranslations,
} from './target-api';

export class TargetApiGatewayMock implements TargetApiGateway {
  private toTarget = new Subject<{ channel: string; data: unknown }>();
  overwrittenTranslationsSubject = new Subject<WebAppOverwrittenTranslations>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  sendToHost<DataType>(channel: string, data: DataType): void {}

  on<DataType>(channel: string, cb: (data: DataType) => void) {
    this.toTarget
      .asObservable()
      .pipe(
        filter((message) => message.channel === channel),
        tap((message) => cb(message.data as DataType))
      )
      .subscribe();
  }

  sendToTarget<DataType>(channel: string, data: DataType) {
    this.toTarget.next({ channel, data });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  openContextMenu(params: ContextMenuParams) {}

  async declareReady(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    config: TargetApplicationConfig
  ): Promise<WebAppOverwrittenTranslations> {
    return {};
  }

  onSetOverwrittenTranslations(
    cb: (overwrittenTranslations: WebAppOverwrittenTranslations) => void
  ) {
    this.overwrittenTranslationsSubject.subscribe(cb);
  }
}
