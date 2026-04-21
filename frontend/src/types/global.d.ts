export {};

declare global {
  interface Window {
    api: {
      criarArquivo: (nome: string, comando:string) => Promise<string>;
    };
  }
}