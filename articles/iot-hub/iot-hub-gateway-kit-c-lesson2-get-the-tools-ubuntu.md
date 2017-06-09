---
title: 'SensorTag device & Azure IoT Gateway - Lesson 2: Get tools (Ubuntu) | Microsoft Docs'
description: Install the tools and the software on your host computer running Ubuntu, create an IoT hub and register your device in the IoT hub.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'iot development, iot software, iot cloud service, internet of things software, azure cli, install git on ubuntu, gulp run, install node js ubuntu'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-gateway-kit-c-lesson1-set-up-nuc

ms.assetid: 0bac1412-385b-4255-a33f-9d44c35feb3e
ms.service: iot-hub
ms.devlang: c
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Get the tools (Ubuntu 16.04)
> [!div class="op_single_selector"]
> * [Windows 7 or later](iot-hub-gateway-kit-c-lesson2-get-the-tools-win32.md)
> * [Ubuntu 16.04](iot-hub-gateway-kit-c-lesson2-get-the-tools-ubuntu.md)
> * [macOS 10.10](iot-hub-gateway-kit-c-lesson2-get-the-tools-mac.md)

## What you will do

- Install Git, Node.js, Gulp, Python.
- Install the Azure command-line interface (Azure CLI). 

If you have any problems, look for solutions on the [troubleshooting page](iot-hub-gateway-kit-c-troubleshooting.md).
## What you will learn

In this lesson, you will learn:

- How to install Git and Node.js.
  - Git is an open source distributed version control system. The sample application for this lesson is stored on Git.
  - Node.js is a JavaScript runtime with a rich package ecosystem.
- How to use NPM to install Node.js development tools.
  - The minimum required version of Node.js is 4.5 LTS.
  - NPM is one of the package managers for Node.js.
- How to install Visual Studio Code.
  - Visual Studio Code is a cross platform, lightweight but powerful source code editor for Windows, Linux, and macOS. It has great support for debugging, embedded Git control, syntax highlighting, intelligent code completion, snippets, and code refactoring as well.
- How to install the Azure CLI
  - The Azure CLI provides a multiplatform command-line experience for Azure. You work directly from a command line to provision and manage resources.
- How to use the Azure CLI to create an IoT hub.

## What you need

- An Internet connection to download the tools and software.
- A computer that is running Ubuntu 16.04 or later.

## Install Git and Node.js

To install Git and Node.js, follow these steps:

1. Press `Ctrl + Alt + T` to open a terminal.
2. Run the following commands:

   ```bash
   sudo apt-get update
   curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install git
   ```

## Install Node.js development tools

You use [gulp.js](http://gulpjs.com/) to automate deployment and execution of scripts.

To install gulp, run the following command in the terminal:

```bash
sudo npm install -g gulp
```

If you experience issues with the installation, see the [troubleshooting guide](iot-hub-gateway-kit-c-troubleshooting.md) for solutions to common problems.

> [!Note]
> Node, NPM and Gulp are required to run automation scripts developed in Node.js.

## Install the Azure CLI

To install the Azure CLI, follow these steps:

1. Run the following commands in the terminal:

   ```bash
   sudo apt-get update
   sudo apt-get install -y libssl-dev libffi-dev
   sudo apt-get install -y python-dev
   sudo apt-get install -y build-essential
   sudo apt-get install -y python-pip
   sudo pip install --upgrade azure-cli
   sudo pip install --upgrade azure-cli-iot
   ```

   The installation might take 5 minutes.

2. Verify the installation by running the following command:

   ```bash
   az iot -h
   ```
You should see the following output if the installation is successful.
![Verify Azure CLI installation](media/iot-hub-gateway-kit-lessons/lesson2/az_iot_help_ubuntu.png)

### Install Visual Studio Code

You use Visual Studio Code later in the tutorial to edit configuration files.

[Download](https://code.visualstudio.com/docs/setup/linux) and install Visual Studio Code.

## Summary

You've installed all the required tools and software on your host computer. Your next task is to use the Azure CLI to create an IoT hub and register your device in your IoT hub.

## Next steps
[Create an IoT hub and register your device](iot-hub-gateway-kit-c-lesson2-register-device.md)
