import { useContext, useEffect, useState } from 'react';
import { getValueAtPath } from './get-value-at-path';
import { interpolate } from './interpolate';
import { useCurrentTranslations } from './useCurrentTranslations';
import { TL8Context } from './tl8-react';

export const useOverwrittenTranslations = () => {
  const tl8Context = useContext(TL8Context);

  if (!tl8Context) {
    return;
  }

  return tl8Context.overwrittenTranslations[tl8Context.currentLang];
};

export const useTranslation = (
  key: string,
  params: Record<string, string | number | boolean> = {}
) => {
  const [result, setResult] = useState(key);
  const currentTranslations = useCurrentTranslations();
  const overwrittenTranslations = useOverwrittenTranslations();

  useEffect(() => {
    if (!currentTranslations) {
      return;
    }

    const originalTranslation = getValueAtPath(
      currentTranslations,
      key.split('.')
    );
    const overwrittenTranslation =
      overwrittenTranslations && overwrittenTranslations[key];

    if (!originalTranslation && !overwrittenTranslation) {
      setResult(key);
      return;
    }

    setResult(
      interpolate(overwrittenTranslation || originalTranslation, params)
    );
  }, [currentTranslations, key, params, overwrittenTranslations]);

  return result;
};
