const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const started = require("electron-squirrel-startup");

const { execSync, spawn } = require('child_process');

// Handle creating/removing shortcuts on Windows
if (started) {
  app.quit();
}

ipcMain.handle("processo-rodando", async (_, nomeProcesso) => {
  try {
    // O tasklist retorna uma string gigante com todos os processos
    const stdout = execSync('tasklist', { encoding: 'utf8' });

    // Verificamos se o nome do processo está presente nessa string
    return stdout.toLowerCase().includes(nomeProcesso.toLowerCase());
  } catch (e) {
    console.error("Erro ao verificar processos:", e);
    return false;
  }
});

ipcMain.handle("listar-ultimo-comando", () => {

  try {

    const caminho = path.join(
      app.getPath("documents"),
      "MeusComandos",
      "ultimo_comando.txt"
    );

    if (!fs.existsSync(caminho)) {
      return null;
    }

    const conteudo = fs.readFileSync(caminho, "utf-8");

    return conteudo.trim();

  } catch (e) {
    console.error("Erro ao ler último comando:", e);
    return null;
  }

})

ipcMain.handle("listar-comandos", () => {
  const pastaPrincipal = path.join(
    app.getPath("documents"),
    "MeusComandos"
  );

  const pastaRotinas = path.join(pastaPrincipal, "rotinas");

  if (!fs.existsSync(pastaPrincipal)) {
    fs.mkdirSync(pastaPrincipal, { recursive: true });
  }

  if (!fs.existsSync(pastaRotinas)) {
    fs.mkdirSync(pastaRotinas, { recursive: true });
  }

  const lerArquivosJson = (diretorio) => {
    const arquivos = fs.readdirSync(diretorio);

    return arquivos
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const caminho = path.join(diretorio, file);

        try {
          const raw = fs.readFileSync(caminho, "utf-8");
          const parsed = JSON.parse(raw);

          return {
            nome: parsed.nome || file.replace(".json", ""),
            caminho,
            conteudo: parsed.comando || "Sem conteúdo",
            categoria: parsed.categoria || "desconhecido",
            horario: parsed.horario || null,
            subcategoria: parsed.subcategoria || null,
          };
        } catch (e) {
          console.error("Erro ao ler arquivo:", caminho, e);

          return {
            nome: file.replace(".json", ""),
            caminho,
            conteudo: "Erro ao ler arquivo",
            categoria: "desconhecido",
          };
        }
      });
  };


  const comandosPrincipais = lerArquivosJson(pastaPrincipal);
  const comandosRotinas = lerArquivosJson(pastaRotinas);

  return [...comandosPrincipais, ...comandosRotinas];
});

ipcMain.handle("criar-arquivo", async (_, nome, comando, categoria) => {
  const caminho = path.join(app.getPath("documents"), "MeusComandos", `${nome}.json`);

  fs.writeFileSync(
    caminho,
    JSON.stringify({ nome, comando, categoria }, null, 2)
  );

  return caminho;
});

ipcMain.handle("criar-arquivo-periodico", async (_, nome, comando, categoria, horario, subcategoria) => {

  const caminho = path.join(app.getPath("documents"), "MeusComandos", "rotinas", `${nome}.json`);

  fs.writeFileSync(
    caminho,
    JSON.stringify({ nome, comando, categoria, horario, subcategoria }, null, 2)
  );

  return caminho;

});

ipcMain.handle("deletar-arquivo", async (_, caminho) => {

  return fs.unlinkSync(caminho)

})

ipcMain.handle("abrir-listener", async () => {
  try {


    const exePath = path.join(__dirname, "speech_assistant_app.exe");

    spawn(exePath, [], {
      detached: true,
      stdio: "ignore"
    }).unref();

    return {
      success: true
    };

  } catch (e) {
    console.error("Erro ao abrir listener:", e);

    return {
      success: false,
      error: e.message
    };
  }
});
/* global MAIN_WINDOW_VITE_DEV_SERVER_URL, MAIN_WINDOW_VITE_NAME, MAIN_WINDOW_VITE_PRELOAD */

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      preload: typeof MAIN_WINDOW_VITE_PRELOAD !== 'undefined'
        ? MAIN_WINDOW_VITE_PRELOAD
        : path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== 'undefined') {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // Agora apontamos para '../renderer' poque __dirname no build fica em '.vite/build'
    mainWindow.loadFile(path.join(__dirname, '../renderer', MAIN_WINDOW_VITE_NAME, 'index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});