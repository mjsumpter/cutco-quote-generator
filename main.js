const electron = require("electron");
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

//SET ENV -> production
//process.env.NODE_ENV = 'production';

let mainWindow;

// listen for app to be ready
app.on('ready', function() {
    //generate HTML
    //create new window
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 1000
    });
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

function createQuoteWindow(email){
    //create new window
    quoteWindow = new BrowserWindow({
        width: 800,
        height: 700,
        title: 'Order Quote'
    });
    // Load html into window
    quoteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'quote.html'),
        protocol:'file:',
        slashes: true
    }));

    // Build menu from template
    const quoteMenu = Menu.buildFromTemplate(quoteMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(quoteMenu);

    // add email html from ipcRenderer
    quoteWindow.webContents.on('did-finish-load', () => {
        quoteWindow.webContents.send('email', email);
    });

    //garbage collection handle
    quoteWindow.on('close', () => {
        quoteWindow = null;
    });
}

// Catch email
ipcMain.on('email', function(e, email){
    createQuoteWindow(email);   
});

// Create main menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Clear Page',
                click(){
                    //refresh/clear all page content
                }
            },
            {
                label: 'Reload Database',
                click(){
                    // run sqltohtml script, reload html
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// Create quote menu template
const quoteMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// if mac, add empty object to menu
if(process.platform == 'darwin')
{
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production')
{
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}