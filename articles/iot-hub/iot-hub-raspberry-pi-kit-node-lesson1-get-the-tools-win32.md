<properties
 pageTitle="Get the tools (Windows 7 or later) | Microsoft Azure"
 description="Download and install the necessary tools and software for the first sample application for your Pi on Windows 7 and later versions."
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
 ms.date="10/21/2016"
 ms.author="xshi"/>

# Get the tools (Windows 7 or later)

> [AZURE.SELECTOR]
- [Windows 7 or later](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-win32.md)
- [Ubuntu 16.04](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-ubuntu.md)
- [macOS 10.10](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-mac.md)

## What you will do

Download the development tools and the software for the first sample application for your Raspberry Pi 3. If you have any problems, look for solutions on the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## What you will learn

In this section you will learn:

- How to install Git and Node.js.
  - [Git](https://git-scm.com) is an open source distributed version control system. The sample application for this lesson is stored on Git.
  - [Node.js](https://nodejs.org/en/) is a JavaScript runtime with a rich package ecosystem.
- How to use NPM to install additional Node.js development tools.
  - The minimum version requirement of Node.js is 4.5 LTS.
  - [NPM](https://www.npmjs.com) is one of the package managers for Node.js.

## What you need

To complete this operation, you will need:

- An Internet connection to download the development tools and the software.
- A computer that is running Windows.

## Install Git and Node.js

Click the following links to download and install Git and Node.js LTS for Windows.

- [Get Git for Windows](https://git-scm.com/download/win/)
- [Get Node.js LTS for Windows](https://nodejs.org/en/)

## Install additional Node.js development tools

Use [gulp.js](http://gulpjs.com) to automate the deployment of the sample application to your Pi. You also use the [device-discovery-cli](https://github.com/Azure/device-discovery-cli) to retrieve network information about your IoT devices.

Start a command prompt as an administrator. Install `gulp` and `device-discovery-cli` by running the following command:

```bash
npm install -g device-discovery-cli gulp
```

If you experience issues installing Node.js and these additional Node.js development tools on your computer, see the [troubleshooting guide](iot-hub-raspberry-pi-kit-node-troubleshooting.md) for solutions to common problems.

## Install Visual Studio Code

[Download](https://code.visualstudio.com/docs/setup/windows) and install Visual Studio Code. Visual Studio Code is a lightweight but powerful source code editor for Windows, Linux, and macOS. You use this editor later in the tutorial to edit the sample code.

## Summary

You've installed the required development tools and software for the first sample application. In the next section, you create, deploy, and run the sample application on your Pi.

## Next steps

[Create and deploy the blink sample application](iot-hub-raspberry-pi-kit-node-lesson1-deploy-blink-app.md)
