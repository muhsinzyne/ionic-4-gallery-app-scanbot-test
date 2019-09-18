# README #

This README would normally document about to clone this demo IONIC 4 Image List Application into your working environment and run the application in your machine.

### What is this repository for? ###

* Scanbot Image list, Upload Image demonstration Application using IONIC.
* v-1.0


### Requirements ####
* Node Package Manager
* Cordova, ionic-cli
* JDK
* Android SDK, Android Studio
* Xcode - for IOS deployment

### How do I get set up? ###

* Clone the repository in your working directory 
```
npm install
```

* Building the application
```

ionic cordova build android
ionic cordova build ios

```
more build commands are describing at
 https://ionicframework.com/docs/cli/commands/cordova-build



* Running the application in Emulator
```

ionic cordova emulate android
ionic cordova emulate ios

```
more emulate commands are describing at 
https://ionicframework.com/docs/cli/commands/cordova-emulate





### What are the configuration files are available for this Application? ###

Basically the Application API Base URL and API token are configured as IONIC environment configuration files

```javascript
export const environment = {
  production: false,
  apiBaseUrl: 'http://54.76.15.222:8090/api/',
  token: '6aac0897-efcf-4d0d-a78f-xxxxxxx'
};
```

* Please change the API token to a valid token.
* The Application also provides development and production configuration under environment configurations
 

