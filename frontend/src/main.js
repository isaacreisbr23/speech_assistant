const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const started = require("electron-squirrel-startup");

// Handle creating/removing shortcuts on Windows
if (started) {
  app.quit();
}

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
    .filter(file => file.endsWith(".txt"))
    .map(file => {
      const caminho = path.join(pasta, file);

      let conteudo = "";

      try {
        conteudo = fs.readFileSync(caminho, "utf-8");
      } catch {
        conteudo = "Erro ao ler arquivo";
      }

      return {
        nome: file.replace(".txt", ""),
        caminho,
        conteudo,
      };
    });
});


ipcMain.handle("criar-arquivo", async (_, nome, comando) => {
  const caminho = path.join(app.getPath("documents"), "MeusComandos", `${nome}.txt`);

  fs.writeFileSync(caminho, comando);

  return caminho;
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
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