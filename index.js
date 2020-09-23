function loadModuleSafe() {
    try {
        const {hookWindow, unHookWindow} = require("bindings")("livepaper-native")
        return {
            hookWindow: hookWindow,
            unHookWindow: unHookWindow,
            moduleLoadSuccess: true
        }
    } catch (e) {
        return {
            hookWindow: null,
            unHookWindow: null,
            moduleLoadSuccess: false
        }
    }
}

const {hookWindow, unHookWindow} = loadModuleSafe()
const {app, BrowserWindow: orgBrowserWindow, screen} = require('electron')
const {BrowserWindow} = require('electron-acrylic-window')
const os = require("os");


let mainWindow, settingWindow

function getHwnd(win) {
    if (!win) throw new TypeError('WINDOW_NOT_GIVEN')
    try {
        const hbuf = win.getNativeWindowHandle()
        if (os.endianness() === "LE") {
            return hbuf.readInt32LE()
        } else {
            return hbuf.readInt32BE()
        }
    } catch (e) {
        throw new TypeError('NOT_VALID_WINDOW')
    }
}

function openMainWindow() {
    mainWindow = new orgBrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })
    mainWindow.loadURL(`file://${__dirname}/test.html`)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        mainWindow.setBounds(screen.getPrimaryDisplay().bounds)
        hookWindow(getHwnd(mainWindow))
        mainWindow.show()
    })
    //mainWindow.webContents.openDevTools({mode: "detach"})
}

function createSettingWindow() {
    settingWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        vibrancy: 'appearance-based'
    })
    settingWindow.loadURL(`file://${__dirname}/test.html`)
    //settingWindow.webContents.openDevTools({mode: "detach"})
}

function init() {
    openMainWindow()
    //createSettingWindow()
}

app.on('ready', init)

app.on('window-all-closed', (e) => {
    e.preventDefault()
})
