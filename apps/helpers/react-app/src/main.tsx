import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { TL8Provider } from '@react-app-tl8/tl8-react';
import en from './en.json';
import fr from './fr.json';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const tl8Config = {
  currentLang: 'en',
  translations: {
    en,
    fr,
  },
};

root.render(
  <TL8Provider config={tl8Config}>
    <App />
  </TL8Provider>
);
