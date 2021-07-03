const { app, Menu, Tray } = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const path = require('path');

const iconPath = path.join(__dirname, 'volume.png');

const audioDevices = require('macos-audio-devices');

// let currentDevice = "SAMSUNG"
let currentDevice = audioDevices.getDefaultOutputDevice.sync();//{id: 84, name: "SAMSUNG"};
// let currentDevice = {id: 84, name: "SAMSUNG"};

let tray;


// const { Notification } = require('electron')
const notifier = require('node-notifier');

let notification;
let currentReminder = 30*1000; // every 30 seconds


let startTime = new Date();
let lastNotificationTime = new Date();
let checkAudioDevicesInterval = setInterval(async () => {


  const defaultDevice = audioDevices.getDefaultOutputDevice.sync();


  app.dock.hide();
  if(currentDevice.id !== defaultDevice.id){
	let isUpdated = await audioDevices.setDefaultOutputDevice(currentDevice.id).then((a,b) => {
		return true;
	}).catch((a,b)=>{ return false; });

	if(isUpdated === false) {
      if(!notification) {

		var differenceSinceLast = (new Date().getTime() - lastNotificationTime.getTime());
        if(currentReminder != 0) {
		  if (differenceSinceLast >= currentReminder) {
			notification = true;
			notifier.notify({
				title: "Force Audio",
				message: `Cannot force '${currentDevice.name}', is it unplugged?`,
				icon: iconPath,
				sound: false,
				timeout: 5,
				wait: true
			}, function(){
				notification = null;
			});
			lastNotificationTime = new Date();

			notifier.on('click', function (notifierObject, options, event) {
				// Triggers if `wait: true` and user clicks notification
				notification = null;
			});
			notifier.on('close', function (notifierObject, options, event) {
				// Triggers if `wait: true` and user clicks notification
				notification = null;
			});
			notifier.on('cancel', function (notifierObject, options, event) {
				// Triggers if `wait: true` and user clicks notification
				notification = null;
			});
			notifier.on('reply', function (notifierObject, options, event) {
				// Triggers if `wait: true` and user clicks notification
				notification = null;
			});
			notifier.on('timeout', function (notifierObject, options) {
				// Triggers if `wait: true` and notification closes
				notification = null;
			});

		}

        }
      }
    }
  }

  const outputDevices = audioDevices.getOutputDevices.sync();

  const menu = []
  for(let device of outputDevices) {
    menu.push({ label: device.name, type: 'radio', checked: currentDevice.id === device.id, click: () => { currentDevice = device;}})
  }
  menu.push({ type: 'separator' });

  menu.push({label: 'About Force Audio', role: 'about' });
  menu.push({ label: 'Settings', submenu: [
	{label: 'Unplugged Reminder'},
	{ type: 'separator' },
	{label: '10 seconds', type: 'radio', checked: currentReminder === 10*1000, click: () => { currentReminder = 10*1000;}},
	{label: '30 seconds', type: 'radio', checked: currentReminder === 30*1000, click: () => { currentReminder = 30*1000;}},
	{label: '1 minute', type: 'radio', checked: currentReminder === 60*1000, click: () => { currentReminder = 60*1000;}},
	{label: '5 minutes', type: 'radio', checked: currentReminder === 5*60*1000, click: () => { currentReminder = 5*60*1000;}},
	{label: '15 minutes', type: 'radio', checked: currentReminder === 15*60*1000, click: () => { currentReminder = 5*60*1000;}},
	{label: '30 minutes', type: 'radio', checked: currentReminder === 30*60*1000, click: () => { currentReminder = 30*60*1000;}},
	{label: '1 hour', type: 'radio', checked: currentReminder === 60*60*1000, click: () => { currentReminder = 60*60*1000;}},
	{label: '3 hour', type: 'radio', checked: currentReminder === 3*60*60*1000, click: () => { currentReminder = 3*60*60*1000;}},
	{label: '5 hour', type: 'radio', checked: currentReminder === 5*60*60*1000, click: () => { currentReminder = 5*60*60*1000;}},
	{label: 'Never', type: 'radio', checked: currentReminder === 0, click: () => { currentReminder = 0;}},
  ] });
  menu.push({ label: 'Quit', click: () => { app.quit() }})

  const contextMenu = Menu.buildFromTemplate(menu);
  tray.setContextMenu(contextMenu);


}, 1000);

app.on('ready', () => {
  app.dock.hide();
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([{ label: 'Quit', click: () => { app.quit() }}]);
  tray.setContextMenu(contextMenu);

  autoUpdater.checkForUpdatesAndNotify();

});
