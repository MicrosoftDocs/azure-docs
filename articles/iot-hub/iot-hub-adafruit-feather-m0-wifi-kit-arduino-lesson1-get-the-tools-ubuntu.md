---
title: 'Connect Arduino to Azure IoT - Lesson 1: Get tools (Ubuntu) | Microsoft Docs'
description: Download and install the necessary tools and software for the first sample application for Adafruit Feather M0 WiFi on Ubuntu.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'arduino development tools, iot development, iot software, internet of things software, install git on ubuntu, install node js ubuntu'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started

ms.assetid: 7572f191-420d-41f0-923b-7ea86c0bfa73
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Get the tools (Ubuntu 16.04)

> [!div class="op_single_selector"]
> * [Windows 7 or later][windows]
> * [Ubuntu 16.04][ubuntu]
> * [macOS 10.10][macos]

## What you will do

Download the development tools and the software for the first sample application for your Adafruit Feather M0 WiFi Arduino board. 

If you have any problems, look for solutions on the [troubleshooting page][troubleshooting].

> [!NOTE]
> Although the programming language of the main logic is Arduino, Node.js tools are used in the lessons to build and deploy sample applications.

## What you will learn
In this article, you will learn:

* How to install Git and Node.js
  * [Git](https://git-scm.com) is an open source distributed version control system. The sample application for this article is stored on Git.
  * [Node.js](https://nodejs.org/en/) is a JavaScript runtime with a rich package ecosystem.
* How to use NPM to install additional Node.js development tools.
  * The minimum required version of Node.js is 4.5 LTS.
  * [NPM](https://www.npmjs.com) is one of the package managers for Node.js.

## What you need
To complete this operation, you will need:
* An Internet connection to download the development tools and the software.
* A computer that is running Ubuntu 16.04 or later.

## Install Git, Node.js, and NPM
Use the keyboard shortcut `Ctrl + Alt + T` to open a terminal and run the following commands:

```bash
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install git
```

## Install additional Node.js development tools
Use [gulp.js](http://gulpjs.com) to automate the deployment of the sample application to your Arduino board.

Install `gulp`, `device-discovery-cli` by running the following command in the terminal:

```bash
sudo npm install -g gulp device-discovery-cli
```

If you experience issues installing Node.js and these additional development tools on Ubuntu, see the [troubleshooting guide][troubleshooting] for solutions to common problems.

## Install Visual Studio Code
[Download](https://code.visualstudio.com/docs/setup/linux) and install Visual Studio Code. Visual Studio Code is a lightweight but powerful source code editor for Windows, Linux, and macOS. You use this editor later in the tutorial to edit the sample code.

## Summary
You've installed the required development tools and software for the first sample application. The next task is to create, deploy, and run the sample application on your Arduino board.

## Next steps
[Create and deploy the blink sample application][create-and-deploy-the-blink-sample-application]

<!-- Images and links -->

[windows]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-get-the-tools-win32.md
[ubuntu]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-get-the-tools-ubuntu.md
[macos]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-get-the-tools-mac.md
[troubleshooting]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-troubleshooting.md
[create-and-deploy-the-blink-sample-application]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-deploy-blink-app.md