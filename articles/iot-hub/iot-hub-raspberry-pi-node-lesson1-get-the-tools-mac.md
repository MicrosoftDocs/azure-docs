<properties
 pageTitle="Get the tools (Mac OS X 10.10) | Microsoft Azure"
 description="Download the tools and software to build and deploy your first application for the Raspberry Pi 3."
 services="iot-hub"
 documentationCenter=""
 authors="shizn"
 manager="timlt"
 tags=""
 keywords=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/28/2016" 
 ms.author="xshi"/>

# 1.2 Get the tools (Mac OS X 10.10)

> [AZURE.SELECTOR]
- [Windows 7 +](iot-hub-raspberry-pi-node-lesson1-get-the-tools-win32.md)
- [Ubuntu 16.04](iot-hub-raspberry-pi-node-lesson1-get-the-tools-ubuntu.md)
- [OS X 10.10](iot-hub-raspberry-pi-node-lesson1-get-the-tools-mac.md)

## 1.2.1 What you will do
Download the tools and software to build and deploy your first application for the Raspberry Pi 3.

## 1.2.2 What you will learn
In this section, you will learn:
- How to install Git and Node.js
    - [Git](https://git-scm.com) is an open source distributed version control system used to store the sample code for this lesson
    - [Node.js](https://nodejs.org/en/) is a JavaScript runtime with a rich package ecosystem
- How to use NPM to download additional Node.js packages and development tools
    - [NPM](https://www.npmjs.com) is the package manager for Node.js

## 1.2.3 What you need
- An internet connection to download the tools and software
- A Mac with OS X Yosemite (10.10) or later

## 1.2.4 Install Git and Node.js

Use the [Homebrew](http://brew.sh) package management utility to install the software needed for this tutorial, if you don’t already have Homebrew installed you can press `Cmd + Space` and enter `Terminal` to open a terminal window and run the following command:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
Use Homebrew to install Node.js and Git:

```bash
brew install node git
```

## 1.2.5 Install additional Node.js development tools
You will use [gulp.js](http://gulpjs.com) to automate the deployment of code to your Raspberry Pi 3. In addition, you will also use the [device-discovery-cli](https://github.com/Azure/device-discovery-cli) Node.js utility to retrieve network information about your connected Raspberry Pi 3 device. In this step, you install these required tools.

You can run the following command in your Terminal prompt:

```bash
npm install -g device-discovery-cli gulp
```

If you experience issues installing Node.js and additional tools on OS X, click [here](iot-hub-raspberry-pi-node-troubleshooting.md) to follow a simple troubleshooting guide.

## 1.2.6 Install Visual Studio Code
Click [here](https://code.visualstudio.com/docs/setup/osx) to install VS Code, a lightweight but powerful source code editor which runs on your desktop and is available for Windows, Linux and OS X. You use this later in the tutorial to edit your sample code.

## 1.2.7 Summary
You have now installed all the required desktop tools and software you need for your first Raspberry Pi 3 sample application. In the next section you deploy, build, and run the sample application on the Raspberry Pi 3.

## Next Steps
[1.3 Create and deploy the blink sample application](iot-hub-raspberry-pi-node-lesson1-depoly-blink-app.md)