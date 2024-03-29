import { ContextMenuParams } from './interfaces/context-menu-params';

export interface TargetApiGateway {
  sendToHost: <DataType>(channel: string, data: DataType) => void;
  openContextMenu: (params: ContextMenuParams) => void;
  on: <DataType>(channel: string, cb: (data: DataType) => void) => void;
  declareReady(
    config: TargetApplicationConfig
  ): Promise<WebAppOverwrittenTranslations>;
  onSetOverwrittenTranslations: (
    cb: (overwrittenTranslations: WebAppOverwrittenTranslations) => void
  ) => void;
}

declare const TL8_TARGET_API: TargetApiGateway;

export function TL8TargetAPI() {
  return TL8_TARGET_API;
}

export type OverwrittenTranslations = {
  [hostname: string]: WebAppOverwrittenTranslations;
};

export type WebAppOverwrittenTranslations = {
  [lang: string]: { [key: string]: string };
};

export type TargetApplicationConfig = {
  langs: { lang: string; label: string }[];
  withoutContextMenu?: boolean;
};
