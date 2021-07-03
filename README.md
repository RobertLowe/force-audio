# Force Audio

## Description

Force Audio is a simple macos application to keep an audio device selected even after unpluging/plugging other audio devices in.

Works great if you have a KVM setup and don't want to have to keep adjusting audio inputs after which computers.

## Demo

![Demo](https://user-images.githubusercontent.com/601141/124347045-354e8f00-dbb0-11eb-9067-24cd6314d77a.gif)

## Instructions

- Download the release, open the app, select which audio device you would like to "pin".

## Development

- Clone the repository.
- Run `npm install` from the root folder.


### Running
- Run `npm run start` from the root folder.

### Building & Releasing

- Bump `package.json` version
- Set your CSC name: `export CSC_NAME='Robert Lowe (6XXXXXXXXW)'`
- Set your AppleID for signing: `export APPLE_ID="rob@example.com"`
- Set your AppleID app specifc password: `export APPLE_ID_PASS="xxxx-xxxx-xxxx-xxxx"`
- Set your AppleID Team short name: `export APPLE_ID_TEAM=TeamName299123456` (https://github.com/electron/electron-notarize#notes-on-your-team-short-name)
- Run `npm run release` from the root folder.

Note: Be aware of: https://github.com/electron-userland/electron-builder/issues/4940 publishing will fail if an existing release exists.
Note: Currently electron-builder's zip bundling process fails to create a proper zip, so `fix-zip` is used as a workaround https://github.com/electron-userland/electron-builder/issues/4299

