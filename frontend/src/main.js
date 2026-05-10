const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const started = require("electron-squirrel-startup");
const { execSync } = require('child_process');

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

ipcMain.handle("listar-comandos", () => {
  const pasta = path.join(app.getPath("documents"), "MeusComandos");

  // garante que a pasta existe
  if (!fs.existsSync(pasta)) {
    fs.mkdirSync(pasta, { recursive: true });
    return [];
  }

  const arquivos = fs.readdirSync(pasta);

  console.log("Lendo arquivos:", pasta, arquivos);

  return arquivos
    .filter(file => file.endsWith(".json"))
    .map(file => {
      const caminho = path.join(pasta, file);

      let conteudo = "";

      try {
        try {
          const raw = fs.readFileSync(caminho, "utf-8");
          const parsed = JSON.parse(raw);

          return {
            nome: parsed.nome,
            caminho,
            conteudo: parsed.comando,
            categoria: parsed.categoria,
          };
        } catch {
          return {
            nome: file.replace(".json", ""),
            caminho,
            conteudo: "Erro ao ler arquivo",
            categoria: "desconhecido",
          };
        }
      } catch {
        conteudo = "Erro ao ler arquivo";
      }

      return {
        nome: file.replace(".json", ""),
        caminho,
        conteudo,
      };
    });
});


ipcMain.handle("criar-arquivo", async (_, nome, comando, categoria) => {
  const caminho = path.join(app.getPath("documents"), "MeusComandos", `${nome}.json`);

  fs.writeFileSync(
    caminho,
    JSON.stringify({ nome, comando, categoria }, null, 2)
  );

  return caminho;
});

/* global MAIN_WINDOW_VITE_DEV_SERVER_URL, MAIN_WINDOW_VITE_NAME, MAIN_WINDOW_VITE_PRELOAD */

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Verifica se a constante foi injetada, caso contrário usa um fallback
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