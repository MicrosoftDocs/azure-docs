<properties
 pageTitle="Get the tools (macOS 10.10) | Microsoft Azure"
 description="Download and install the necessary tools and software for the first sample application for your Pi on macOS."
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

# 1.2 Get the tools (macOS 10.10)

> [AZURE.SELECTOR]
- [Windows 7 +](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-win32.md)
- [Ubuntu 16.04](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-ubuntu.md)
- [macOS 10.10](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-mac.md)

## 1.2.1 What you will do

Download the development tools and the software for the first sample application for your Raspberry Pi 3. If you meet any problems, seek solutions in the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## 1.2.2 What you will learn
In this section, you will learn:

- How to install Git and Node.js
    - [Git](https://git-scm.com) is an open source distributed version control system. The sample application for this lesson is stored on Git.
    - [Node.js](https://nodejs.org/en/) is a JavaScript runtime with a rich package ecosystem.
- How to use NPM to install additional Node.js development tools.
  - The minimum required version of Node.js is 4.5 LTS.
  - [NPM](https://www.npmjs.com) is one of the package managers for Node.js.

## 1.2.3 What you need

- An Internet connection to download the development tools and the software
- A Mac that is running macOS Yosemite (10.10) or later

## 1.2.4 Install Git and Node.js

To install Git and Node.js, use the [Homebrew](http://brew.sh) package management utility by following these steps:

1. Install Homebrew. If you've already installed Homebrew, go to step 2.
  1. Press `Cmd + Space` and enter `Terminal` to open a terminal window.
  2. Run the following command:

    ```bash
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```
2. Install Git and Node.js by running the following command:

    ```bash
    brew install node git
    ```

## 1.2.5 Install additional Node.js development tools

You use [gulp.js](http://gulpjs.com) to automate the deployment of the sample application to your Pi. You also use the [device-discovery-cli](https://github.com/Azure/device-discovery-cli) to retrieve network information about your IoT devices.

Install `gulp` and `device-discovery-cli` by running the following command in the Terminal window:

```bash
sudo npm install -g device-discovery-cli gulp
```

If you experience issues installing Node.js and these additional development tools on macOS, see the [troubleshooting guide](iot-hub-raspberry-pi-kit-node-troubleshooting.md) for solutions to common problems.

## 1.2.6 Install Visual Studio Code

[Download](https://code.visualstudio.com/docs/setup/osx) and install Visual Studio Code. Visual Studio Code is a lightweight but powerful source code editor for Windows, Linux, and macOS. You use this editor later in the tutorial to edit the sample code.

## 1.2.7 Summary

You've installed the required development tools and software for the first sample application. In the next section, you create, deploy, and run the sample application on your Pi.

## Next Steps

[1.3 Create and deploy the blink sample application](iot-hub-raspberry-pi-kit-node-lesson1-deploy-blink-app.md)
