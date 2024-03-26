import { useContext } from "react";
import { TL8Context } from "./tl8-react";

export const useCurrentTranslations = () => {
  const tl8Context = useContext(TL8Context);

  if (!tl8Context) {
    return;
  }

  return tl8Context.translations[tl8Context.currentLang];
};
