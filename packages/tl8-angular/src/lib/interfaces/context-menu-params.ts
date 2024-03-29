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
