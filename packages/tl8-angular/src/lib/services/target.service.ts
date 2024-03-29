import { Injectable, NgZone } from '@angular/core';
import { ContextMenuParams } from '../interfaces/context-menu-params';
import {
  TargetApiGateway,
  TargetApplicationConfig,
  TL8TargetAPI,
} from '../target-api';

@Injectable({
  providedIn: 'root',
})
export class TargetService {
  get gatewayOrThrow(): TargetApiGateway {
    return TL8TargetAPI();
  }

  constructor(private zone: NgZone) {}

  sendToHost(message: string, data: unknown): void {
    return this.gatewayOrThrow.sendToHost(message, data);
  }

  openContextMenu(params: ContextMenuParams) {
    return this.gatewayOrThrow.openContextMenu(params);
  }

  declareReady(config: TargetApplicationConfig) {
    return this.gatewayOrThrow.declareReady(config);
  }

  on<DataType>(event: string, listener: (data: DataType) => void): void {
    this.gatewayOrThrow.on(event, (data: DataType) =>
      this.zone.run(() => listener(data))
    );
  }

  get isHosted(): boolean {
    try {
      return !!this.gatewayOrThrow;
    } catch (error) {
      return false;
    }
  }
}
