import { useCallback, useContext, useMemo } from 'react';
import { NoTL8ContextError } from './no-tl8-context.error';
import { TL8Context } from './tl8-react';

export const useTL8 = () => {
  const context = useContext(TL8Context);
  const setCurrentLanguage = useCallback((lang: string) => {
    if (!context) {
      throw new NoTL8ContextError();
    }

    context.setCurrentLang(lang);
  }, [context]);
  const currentLanguage = useMemo(() => {
    if (!context) {
      throw new NoTL8ContextError();
    }

    return context.currentLang;
  }, [context]);

  return {
    setCurrentLanguage,
    currentLanguage
  };
};
