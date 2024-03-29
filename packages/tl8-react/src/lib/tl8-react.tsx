import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  TL8TargetAPI,
  TargetApplicationConfig,
  WebAppOverwrittenTranslations,
} from './copied-from-tl8';

const tl8Target = TL8TargetAPI();

const useTL8Context = ({
  translations,
  currentLang: defaultCurrentLang,
}: {
  translations: Record<string, any>;
  currentLang: string;
}) => {
  const [isReadyForTl8, setIsReadyForTl8] = useState(false);
  const [visibleKeyRefs, setVisibleKeyRefs] = useState([] as { key: string }[]);
  const visibleKeys = useMemo(() => {
    return visibleKeyRefs.map(({ key }) => key);
  }, [visibleKeyRefs]);
  const addVisibleKey = useCallback((key: string) => {
    const ref = { key };
    setVisibleKeyRefs((state) => [...state, ref]);
    return ref;
  }, []);
  const removeVisibleKey = useCallback((ref: { key: string }) => {
    setVisibleKeyRefs((state) => state.filter((r) => r !== ref));
  }, []);
  const [state, setState] = useState<{
    currentLang: string;
    overwrittenTranslations: Record<string, any>;
  }>({ currentLang: defaultCurrentLang, overwrittenTranslations: {} });
  const setCurrentLang = useCallback((lang: string) => {
    setState((state) => ({ ...state, currentLang: lang }));
    tl8Target && tl8Target.sendToHost('state:currentLanguage', lang);
  }, []);
  const setOverwrittenTranslations = useCallback(
    (overwrittenTranslations: Record<string, any>) => {
      setState((state) => ({ ...state, overwrittenTranslations }));
    },
    []
  );
  const config: TargetApplicationConfig = useMemo(
    () => ({
      langs: Object.keys(translations).map((lang) => ({ lang, label: lang })),
    }),
    [translations]
  );

  useEffect(() => {
    if (!tl8Target) {
      return;
    }
    tl8Target.onSetOverwrittenTranslations(
      (overwrittenTranslations: WebAppOverwrittenTranslations) => {
        setOverwrittenTranslations(overwrittenTranslations);
      }
    );
    tl8Target.sendToHost('state:ready', config);
    tl8Target.declareReady(config).then((overwrittenTranslations) => {
      setOverwrittenTranslations(overwrittenTranslations);
      tl8Target.sendToHost('state:currentLanguage', defaultCurrentLang);
      tl8Target.sendToHost('state:currentAppTranslations', translations);
      setIsReadyForTl8(true);
    });
    tl8Target.on<{ value: string }>('selectLanguage', ({ value }) => {
      setState((state) => ({ ...state, currentLang: value }));
    });
  }, [
    config,
    setOverwrittenTranslations,
    defaultCurrentLang,
    translations,
    setCurrentLang,
  ]);

  useEffect(() => {
    if (!tl8Target) {
      return;
    }
    if (!isReadyForTl8) {
      return;
    }
    tl8Target.sendToHost('state:currentVisibleKeys', visibleKeys);
  }, [isReadyForTl8, visibleKeys]);

  return {
    setCurrentLang,
    translations,
    currentLang: state.currentLang,
    overwrittenTranslations: state.overwrittenTranslations,
    visibleKeys,
    addVisibleKey,
    removeVisibleKey,
  };
};

interface ITL8Context {
  translations: Record<string, any>;
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  visibleKeys: string[];
  addVisibleKey: (key: string) => { key: string };
  removeVisibleKey: (ref: { key: string }) => void;
  overwrittenTranslations: Record<string, any>;
}

interface TL8Config {
  translations: Record<string, any>;
  currentLang: string;
}

export const TL8Context = createContext<ITL8Context | null>(null);

export const TL8Provider = ({ config, children}: { config: TL8Config, children: React.ReactNode }) => {
  const value = useTL8Context(config);
  return <TL8Context.Provider value={value}>{children}</TL8Context.Provider>
}
