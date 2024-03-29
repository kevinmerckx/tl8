import { useTL8, useTranslation, } from '@react-app-tl8/tl8-react';
import NxWelcome from './nx-welcome';

export function App() {
  const something = useTranslation('something');
  const { setCurrentLanguage, currentLanguage } = useTL8()
  return (<>
    <div>
      <button onClick={() => setCurrentLanguage('en')}>
        EN
      </button>
      <button onClick={() => setCurrentLanguage('fr')}>
        FR
      </button>
      Current: {currentLanguage}
    </div>
    Using <pre><code>useTranslation('something')</code></pre>: {something}
    <NxWelcome title="react-app-tl8" />
  </>
  );
}

export default App;
