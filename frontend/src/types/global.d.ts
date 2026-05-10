export { };

declare global {
  interface Comando {
    nome: string;
    caminho: string;
    conteudo: string;
    categoria: string;
}

  declare global {
    interface Window {
      api: {
        listarComandos: (pasta: string) => Promise<Comando[]>;
      };
    }
  }
  interface Window {
    api: {
      criarArquivo: (nome: string, comando: string, categoria:string) => Promise<string>;
      listarComandos: () => Promise<{ nome: string; caminho: string }[]>;
      processoRodando: (nomeProcesso:string) => Promise<boolean>;
      abrirExeListener : () => {};
      lerUltimoComando : () => Promise<string>;
      deletarComando : (caminho:string) => {}
    };
  }
}