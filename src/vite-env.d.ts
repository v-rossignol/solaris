/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INFINITY_API_URL: string;
  readonly VITE_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}