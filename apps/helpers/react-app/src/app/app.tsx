import NxWelcome from './nx-welcome';
import { TL8Context, useTL8Context } from '@react-app-tl8/tl8-react';
import en from './en.json';
import fr from './fr.json';
import { useMemo } from 'react';

export function App() {
  const tl8Context = useMemo(
    () => ({
      currentLang: 'en',
      translations: {
        en,
        fr,
      },
    }),
    []
  );
  const tl8ContextValue = useTL8Context(tl8Context);

  return (
    <TL8Context.Provider value={tl8ContextValue}>
      <div>
        <button onClick={() => tl8ContextValue.setCurrentLang('en')}>
          EN{' '}
        </button>
        <button onClick={() => tl8ContextValue.setCurrentLang('fr')}>
          FR{' '}
        </button>
        Current: {tl8ContextValue.currentLang}
      </div>
      <NxWelcome title="react-app-tl8" />
    </TL8Context.Provider>
  );
}

export default App;
