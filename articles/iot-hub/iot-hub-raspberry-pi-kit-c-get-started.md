---
title: Connect Raspberry Pi (C) to Azure IoT - Get started | Microsoft Docs
description: Get started with Raspberry Pi 3, create your Azure IoT hub, and connect Pi to the IoT hub.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'azure iot hub, getting started with the internet of things, iot toolkit'

ms.assetid: 68c0e730-1dc8-4e26-ac6b-573b217b302d
ms.service: iot-hub
ms.devlang: c
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/28/2016
ms.author: xshi

---
# Get started with Raspberry Pi 3 (C)
> [!div class="op_single_selector"]
> * [Node.JS](iot-hub-raspberry-pi-kit-node-get-started.md)
> * [C](iot-hub-raspberry-pi-kit-c-get-started.md)

In this tutorial, you begin by learning the basics of working with Raspberry Pi 3 that's running Raspbian. You then learn how to seamlessly connect your devices to the cloud by using [Azure IoT Hub](iot-hub-what-is-iot-hub.md). For Windows 10 IoT Core samples, go to the [Windows Dev Center](http://www.windowsondevices.com/).

## Lesson 1: Configure your device
![Lesson 1 end-to-end diagram](media/iot-hub-raspberry-pi-lessons/e2e-lesson1.png)

In this lesson, you configure your Raspberry Pi 3 device with an operating system, set up the development environment, and deploy an application to Pi.

### Configure your device
Configure Raspberry Pi 3 for first-time use and install Raspbian. Raspbian is a free operating system that is optimized for the Raspberry Pi hardware.

*Estimated time to complete: 30 minutes*

Go to [Configure your device](iot-hub-raspberry-pi-kit-c-lesson1-configure-your-device.md).

### Get the tools
Download the tools and software to build and deploy your first application for Raspberry Pi 3.

*Estimated time to complete: 20 minutes*

Go to [Get the tools](iot-hub-raspberry-pi-kit-c-lesson1-get-the-tools-win32.md).

### Create and deploy the blink application
Clone the sample C blink application from GitHub, and use gulp to deploy this application to your Raspberry Pi 3 board. This sample application blinks the LED connected to the board every two seconds.

*Estimated time to complete: 5 minutes*

Go to [Create and deploy the blink application](iot-hub-raspberry-pi-kit-c-lesson1-deploy-blink-app.md).

## Lesson 2: Create your IoT hub
![Lesson 2 end-to-end diagram](media/iot-hub-raspberry-pi-lessons/e2e-lesson2.png)

In this lesson, you create your free Azure account, provision your Azure IoT hub and create your first device in the IoT hub.

Complete Lesson 1 before you start this lesson.

### Get the Azure tools
Install the Azure command-line interface (Azure CLI).

*Estimated time to complete: 10 minutes*

Go to [Get Azure tools](iot-hub-raspberry-pi-kit-c-lesson2-get-azure-tools-win32.md).

### Create your IoT hub and register Raspberry Pi 3
Create your resource group, provision your first Azure IoT hub, and add your first device to the IoT hub using Azure CLI.

*Estimated time to complete: 10 minutes*

Go to [Create your IoT hub and register Raspberry Pi 3](iot-hub-raspberry-pi-kit-c-lesson2-prepare-azure-iot-hub.md).

## Lesson 3: Send device-to-cloud messages
![Lesson 3 end-to-end diagram](media/iot-hub-raspberry-pi-lessons/e2e-lesson3.png)

In this lesson, you send messages from Pi to your IoT hub. You also create an Azure function app that gets incoming messages from your IoT hub and writes them to Azure Table storage.

Complete Lessons 1 and Lesson 2 before you start this lesson.

### Create an Azure function app and Azure Storage account
Use an Azure Resource Manager template to create an Azure function app and an Azure Storage account.

*Estimated time to complete: 10 minutes*

Go to [Create an Azure function app and Azure Storage account](iot-hub-raspberry-pi-kit-c-lesson3-deploy-resource-manager-template.md).

### Run a sample application to send device-to-cloud messages
Deploy and run a sample application to your Raspberry Pi 3 device that sends messages to the IoT hub.

*Estimated time to complete: 10 minutes*

Go to [Run a sample application to send device-to-cloud messages](iot-hub-raspberry-pi-kit-c-lesson3-run-azure-blink.md).

### Read messages persisted in Azure Storage
Monitor the device-to-cloud messages as they are written to Azure Storage.

*Estimated time to complete: 5 minutes*

Go to [Read messages persisted in Azure Storage](iot-hub-raspberry-pi-kit-c-lesson3-read-table-storage.md).

## Lesson 4: Send cloud-to-device messages
![Lesson 4 end-to-end diagram](media/iot-hub-raspberry-pi-lessons/e2e-lesson4.png)

This lesson shows how to send messages from your Azure IoT hub to Raspberry Pi 3. The messages control the on and off behavior of the LED that is connected to Pi. A sample application is prepared for you to achieve this task.

Complete Lessons 1, Lesson 2 and Lesson 3 before you start this lesson.

### Run the sample application to receive cloud-to-device messages
The sample application in Lesson 4 runs on Pi and monitors incoming messages from your IoT hub. A new gulp task sends messages to Pi from your IoT hub to blink the LED.

*Estimated time to complete: 10 minutes*

Go to [Run the sample application to receive cloud-to-device messages](iot-hub-raspberry-pi-kit-c-lesson4-send-cloud-to-device-messages.md).

### Optional section: Change the on and off behavior of the LED
Customize the messages to change the LED’s on and off behavior.

*Estimated time to complete: 10 minutes*

Go to [Optional section: Change the on and off behavior of the LED](iot-hub-raspberry-pi-kit-c-lesson4-change-led-behavior.md).

## Troubleshooting
If you have any problems during the lessons, look for solutions in the [Troubleshooting](iot-hub-raspberry-pi-kit-c-troubleshooting.md) article.
