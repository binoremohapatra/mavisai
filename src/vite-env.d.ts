/// <reference types="vite/client" />

interface ImportMetaEnv {
  // No external API keys needed - using Spring Boot backend
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
