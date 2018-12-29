/** Global definitions for developement **/


interface Window {
  DEVELOPMENT: boolean;
  PRODUCTION: boolean;
}

declare module '*.css' {
  const styles: any;
  export = styles;
}

declare module '*.scss' {
  const styles: { [x: string]: string };
  export = styles;
}

declare module '*.svg' {
  const svg: string;
  export = svg;
}

declare module '*.jpg' {
  const svg: string;
  export = svg;
}

declare type CSSProperties = React.CSSProperties;
declare type Omit<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;
declare type Overwrite<T, U> = Omit<T, keyof T & keyof U> & U;
interface Dictionary<T> {
  [index: string]: T;
}

type PartialDeep<T> = { [P in keyof T]?: PartialDeep<T[P]> };

type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : any;
