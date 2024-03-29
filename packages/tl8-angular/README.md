# TL8

TL8 is a system that enables every team member to edit translations on an Angular application that uses `ngx-translate`. For more information, visit the website [tl8.io](https://tl8.io).

## Compatibility

| Angular | Tl8        |
| ------- | ---------- |
| `17`    | `7.*`      |
| `15`    | `5.*`      |
| `14`    | `3.*, 2.*` |
| `<14`   | `1.*`      |

## Setup

### Install

```sh
npm install --save tl8
```

### Setup your module

Add the TL8 module to your application, ideally where you include the `TranslateModule` of `ngx-translate`

```ts
import { TL8Module } from 'tl8';

@NgModule({
  ...
  imports: [
    ...
    TranslateModule.forRoot(...),
    TL8Module.forRoot({
      langs: [
        { lang: 'en', label: 'English' },
        { lang: 'fr', label: 'French' },
        { lang: 'de', label: 'German' },
      ]
    }),
    ...
  ],
  ...
})
export class SharedModule { }
```
