const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // alwaysOnTop: true,
    width: 800,
    height: 600,
    minWidth: 480,
    minHeight: 300,
    // frame: false,
    // show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    titleBarStyle: "hidden",
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      // pathname: path.join(__dirname, "../index.html"),
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true,
    });

  mainWindow.loadURL(startUrl);

  //   settings.loadWindowSettings(mainWindow, "main");
  mainWindow.on("close", () => {
    // settings.saveWindowSettings(mainWindow, "main");
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.once("ready-to-show", () => mainWindow.show());

  //   mainWindow.setMenu(null);
}

app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
