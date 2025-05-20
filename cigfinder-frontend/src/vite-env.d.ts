/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_GOOGLE_MAPS_KEY: string;
    [key: string]: string | boolean | undefined;
  };
} 