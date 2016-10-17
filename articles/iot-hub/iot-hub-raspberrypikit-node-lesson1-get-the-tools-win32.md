 <properties
 pageTitle="Get the tools (Windows 7 +) | Microsoft Azure"
 description="Download and install the necessary tools and software for the first sample application for your Pi."
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

# 1.2 Get the tools (Windows 7 +)
 
> [AZURE.SELECTOR]
- [Windows 7 +](iot-hub-raspberrypikit-node-lesson1-get-the-tools-win32.md)
- [Ubuntu 16.04](iot-hub-raspberrypikit-node-lesson1-get-the-tools-ubuntu.md)
- [OS X 10.10](iot-hub-raspberrypikit-node-lesson1-get-the-tools-mac.md)

## 1.2.1 What will you do

Download the development tools and the software for the first sample application for your Raspberry Pi 3.

## 1.2.2 What will you learn

- How to install Git and Node.js
  - [Git](https://git-scm.com) is an open source distributed version control system. The sample code for this lesson is stored on Git.
  - [Node.js](https://nodejs.org/en/) is a JavaScript runtime with a rich package ecosystem.
- How to use NPM to install additional Node.js development tools.
  - The minimum version requirement of Node.js is 4.5 LTS.
  - [NPM](https://www.npmjs.com) is the package manager for Node.js.

## 1.2.3 What do you need

- An Internet connection to download the development tools and the software
- A computer that is running Windows

## 1.2.4 Install the Git and Node.js software

Click the links below to download and install Git and Node.js LTS for Windows.
- [Get Git for Windows](https://git-scm.com/download/win/)
- [Get Node.js LTS for Windows](https://nodejs.org/en/)

## 1.2.5 Install additional Node.js development tools

1. Download Gulp and device-discovery-cli.
  - [Get gulp.js](http://gulpjs.com).
    Gulp is a tool to automate the deployment of the sample code to your Pi.
  - [Get device-discovery-cli](https://github.com/Azure/device-discovery-cli)
    device-discovery-cli is a Node.js utility to retrieve network information about your Pi.
2. Install these development tools.
  1. Press `Windows + R`, type `cmd` and press Enter to open a command prompt window.
  2. Run the following command:
    ```bash
    npm install -g device-discovery-cli gulp
    ```
If you experience issues installing Node.js and these additional Node.js development tools on your computer, click the [troubleshooting guide](iot-hub-raspberrypikit-node-troubleshooting.md).

## 1.2.6 Install Visual Studio Code

Click [Get Visual Studio Code](https://code.visualstudio.com/docs/setup/windows) to download and install Visual Studio Code. Visual Studio Code is a lightweight but powerful source code editor for Windows, Linux and OS X. You use this later in the tutorial to edit your sample code.

## 1.2.7 Summary

You have installed all the required development tools and software for the first sample application. In the next section, you build, deploy, and run the sample application on your Pi.

## Next Steps

[1.3 Create and deploy the blink sample application](iot-hub-raspberrypikit-node-lesson1-deploy-blink-app.md)
