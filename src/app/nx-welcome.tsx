import { Tl8 } from "@react-app-tl8/tl8-react";

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 This is a starter component and can be deleted.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 Delete this file and get started with your project!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export function NxWelcome({ title }: { title: string }) {
  return (
    <>
      <h1>
        <Tl8 of="view1.key1" />
      </h1>
      <h2>With params: <Tl8 of="view1.key2" params={{value: '42'}}/></h2>
    </>
  );
}

export default NxWelcome;
