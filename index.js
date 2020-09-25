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
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
app.commandLine.appendSwitch('disable-site-isolation-trials');
const {BrowserWindow} = require('electron-acrylic-window')
const os = require('os')
const w32disp = require("win32-displayconfig")
const setting = require('electron-settings')


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

function openOneBackgroundWindow(id, bound, totalWidth, totalHeight) {
    let win = new orgBrowserWindow({
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false
        }
    });
    win.loadURL(`file://${__dirname}/UI/main/main.html?id=${id}&x=${bound.x}&y=${bound.y}&w=${totalWidth}&h=${totalHeight}`)
    win.once('ready-to-show', () => {
        win.show()
        win.setBounds(bound)
        hookWindow(getHwnd(win))
    })
    //win.webContents.openDevTools({mode: "detach"})
    mainWindow.push(win)
}

function openMainWindow() {
    let totalWidth = 0, totalHeight = 0
    w32disp.extractDisplayConfig().then((displayList) => {
        for (let i of displayList) {
            let BottomRightPoint = {
                x: i.sourceMode.position.x + i.sourceMode.width,
                y: i.sourceMode.position.y + i.sourceMode.height
            }

            BottomRightPoint = screen.screenToDipPoint(BottomRightPoint)
            totalWidth = Math.max(totalWidth, BottomRightPoint.x)
            totalHeight = Math.max(totalHeight, BottomRightPoint.y)
        }
        for (let i of displayList) {
            let TopLeftPoint = {
                x: i.sourceMode.position.x,
                y: i.sourceMode.position.y
            }, BottomRightPoint = {
                x: i.sourceMode.position.x + i.sourceMode.width,
                y: i.sourceMode.position.y + i.sourceMode.height
            }

            TopLeftPoint = screen.screenToDipPoint(TopLeftPoint)
            BottomRightPoint = screen.screenToDipPoint(BottomRightPoint)

            setting.setSync(`back.m_${Buffer.from(i.devicePath).toString('base64')}.displayName`, i.displayName)

            openOneBackgroundWindow(Buffer.from(i.devicePath).toString('base64'), {
                x: TopLeftPoint.x,
                y: TopLeftPoint.y,
                width: BottomRightPoint.x - TopLeftPoint.x,
                height: BottomRightPoint.y - TopLeftPoint.y
            }, totalWidth, totalHeight)
        }
    })
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
    settingWindow.loadURL(`file://${__dirname}/UI/setting/setting.html`)
    //settingWindow.webContents.openDevTools({mode: "detach"})
}

function init() {
    openMainWindow()
    createSettingWindow()
    screen.on('display-metrics-changed', refresh);
}

app.once('ready', init)

app.on('window-all-closed', (e) => {
    e.preventDefault()
})
