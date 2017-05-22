'use strict';

const electron = require('electron');
const app = electron.app; // Module to control application life.
const ipcMain = electron.ipcMain; // Module to forward events to the main process
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// Prevent the computer from going to sleep
const powerSaveBlocker = electron.powerSaveBlocker;
powerSaveBlocker.start('prevent-display-sleep');

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  var browserWindowOptions = {
      kiosk: true,
      fullscreen: true,
      alwaysOnTop: true,
      disableAutoHideCursor: true,
      autoHideMenuBar: true,
      backgroundColor: '#000',
      transparent: true,
      frame: false,
      darkTheme: true
  };

  // Create the browser window.
  mainWindow = new BrowserWindow(browserWindowOptions)

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools if run with "npm start dev"
  if(process.argv[2] == "dev"){
      mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  console.log("Launching DeezerKids.");
  createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('online-status-changed', function(event, status) {
  console.log(status);
});
