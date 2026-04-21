export {};

declare global {
  interface Window {
    api: {
      criarArquivo: (nome: string) => Promise<string>;
    };
  }
}