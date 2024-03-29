import { TL8Service } from './services/tl8.service';

export function startTl8Factory(tl8: TL8Service) {
  return () => {
    return tl8.start();
  }
}
