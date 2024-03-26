import { useContext, useEffect } from "react";
import { TL8Context } from "./tl8-react";
import { useTranslation } from "./useTranslation";

export const Tl8 = ({
  of, params
}: { of: string; params?: Record<string, string | number | boolean>; }) => {
  const tl8Context = useContext(TL8Context);

  useEffect(() => {
    if (!tl8Context) {
      return;
    }
    const ref = tl8Context.addVisibleKey(of)
    return () => tl8Context.removeVisibleKey(ref);
  }, [of]);

  const translation = useTranslation(of, params || {});
  return translation;
};
