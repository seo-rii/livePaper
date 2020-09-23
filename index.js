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


let mainWindow = [], settingWindow

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

function openOneBackgroundWindow(scr) {
    let win = new orgBrowserWindow({
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })
    win.loadURL(`file://${__dirname}/test.html?id=${scr.id}&x=${scr.bounds.x}&y=${scr.bounds.y}`)
    win.once('ready-to-show', () => {
        win.show()
        win.setBounds(scr.bounds)
        hookWindow(getHwnd(win))
    })
    //win.webContents.openDevTools({mode: "detach"})
    mainWindow.push(win)
}

function openMainWindow() {
    for (let i of screen.getAllDisplays()) {
        openOneBackgroundWindow(i)
    }
}

function refresh() {
    for (let i of mainWindow) {
        i.close()
    }
    mainWindow = []
    openMainWindow()
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
    screen.on('display-metrics-changed', refresh);
}

app.once('ready', init)

app.on('window-all-closed', (e) => {
    e.preventDefault()
})
