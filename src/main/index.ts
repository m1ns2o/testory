import { app, shell, BrowserWindow, ipcMain } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

let mainWindow;

// 프로토콜 설정
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("testory", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("testory");
}

// 단일 인스턴스 보장
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, commandLine, _workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    const url = commandLine.pop();
    if (url !== undefined) {
      const code = new URL(url).searchParams.get("code") ?? "";
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("supabase-code", code);
      }
    }
  });

  app.on("open-url", (event, url) => {
    event.preventDefault();
    const code = new URL(url).searchParams.get("code") ?? "";
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("supabase-code", code);
    }
  });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // 윈도우 종료 시 정리
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// 앱 초기화 - 중복 제거
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC 핸들러 등록
  ipcMain.handle("open-external", async (_event, url) => {
    return shell.openExternal(url);
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 앱 종료 처리
app.on("window-all-closed", () => {
  // IPC 핸들러 정리
  ipcMain.removeAllListeners();
  
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// 앱이 종료되기 전 정리 작업
app.on("before-quit", () => {
  // 추가적인 정리 작업이 필요하면 여기에
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.removeAllListeners();
  }
});