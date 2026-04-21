const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const started = require("electron-squirrel-startup");
const { default: psList } = require("ps-list");

// Handle creating/removing shortcuts on Windows
if (started) {
  app.quit();
}

ipcMain.handle("processo-rodando", async (_, nomeProcesso) => {
  const processos = await psList();

  return processos.some(
    (p) =>
      p.name.toLowerCase().includes(nomeProcesso.toLowerCase())
  );
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
    .filter(file => file.endsWith(".txt"))
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
            nome: file.replace(".txt", ""),
            caminho,
            conteudo: "Erro ao ler arquivo",
            categoria: "desconhecido",
          };
        }
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


ipcMain.handle("criar-arquivo", async (_, nome, comando, categoria) => {
  const caminho = path.join(app.getPath("documents"), "MeusComandos", `${nome}.txt`);

  fs.writeFileSync(
    caminho,
    JSON.stringify({ nome, comando, categoria }, null, 2)
  );

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

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(
      path.join(__dirname, "../renderer/index.html")
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