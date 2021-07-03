const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        return;
    }

    const appName = context.packager.appInfo.productFilename;

    if (process.env.APPLE_ID && process.env.APPLE_ID_PASS) {
		console.log("Attempting to notarize!", process.env.APPLE_ID, process.env.APPLE_ID_PASS, process.env.APPLE_ID_TEAM, appName);
        return await notarize({
            appBundleId: 'com.robertlowe.forceaudio',
            appPath: `${appOutDir}/${appName}.app`,
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_ID_PASS,
            ascProvider: process.env.APPLE_ID_TEAM,
        });
		console.log("Notarized!");
    } else {
        console.warn('NOTICE: Did not notarize application due to missing environment variables.');
    }
};

