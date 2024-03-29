export type ContextMenuParams =
  | UntranslatedContextMenuParams
  | TranslatedContextMenuParams;

export interface UntranslatedContextMenuParams {
  nodeContent: string | null;
  lang?: string;
}

export interface TranslatedContextMenuParams {
  key: string;
  currentValue: string;
  initialValue: string;
}

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
  return (window as any).TL8_TARGET_API as TargetApiGateway | undefined;
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
