# tl8-react

Check out [tl8.io](https://tl8.io) to learn about TL8 and the open-source repository on Github [https://github.com/kevinmerckx/tl8](https://github.com/kevinmerckx/tl8).

This library is the React counter-part of the TL8 solution.

## Install

```
npm install tl8-react
```

## Use

### Prepare translation files

Prepare translation files such as `en.json`:

```json
{
  "some": {
    "textToTranslate": "Here we go",
    "other": "Yes!"
  }
}
```

### Prepare your application

```tsx
import { TL8Provider } from 'tl8-react';
import en from './en.json';
import fr from './fr.json';

const tl8Config = {
  currentLang: 'en',
  translations: {
    en,
    fr,
  },
};

function App() {
  return <TL8Provider config={tl8Config}>
    <Tl8 of="some.textToTranslate" />
    <Tl8 of="some.other" />
  </TL8Provider>;
}
```

### Get current language and change language

```tsx
const { setCurrentLanguage, currentLanguage } = useTL8();
```

