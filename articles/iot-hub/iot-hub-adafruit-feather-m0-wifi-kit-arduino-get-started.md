---
title: Connect Arduino (C) to Azure IoT - Get started | Microsoft Docs
description: Get started with Adafruit Feather M0 WiFi, create your Azure IoT hub, and connect Adafruit Feather M0 WiFi to the IoT hub
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'azure iot hub, getting started with the internet of things, internet of things tutorial, adafruit internet of things, getting started with arduino'

ms.assetid: 51befcdb-332b-416f-a6a1-8aabdb67f283
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Get started with your Arduino board: Adafruit Feather M0 WiFi

In this tutorial, you begin by learning the basics of working with your Arduino board. You then learn how to seamlessly connect your devices to the cloud by using [Azure IoT Hub](iot-hub-what-is-iot-hub.md).

## Lesson 1: Configure your device
![Lesson 1 end-to-end diagram][Lesson-1-end-to-end-diagram]

In this lesson, you configure your Arduino board with an operating system, set up the development environment, and deploy an application to your Arduino board.

### Configure your device
Configure your Arduino board for first-time use by assembling the board, powering it up.

*Estimated time to complete: 5 minutes*

Go to [Configure your device][configure-your-device].

### Get the tools
Download the tools and software to build and deploy your first application for your Arduino board.

*Estimated time to complete: 20 minutes*

Go to [Get the tools][get-the-tools]

### Create and deploy the blink application
Clone the sample Arduino blink application from GitHub, and use gulp to deploy this application to your Arduino board. This sample application blinks the GPIO #13 on-board LED every two seconds.

*Estimated time to complete: 5 minutes*

Go to [Create and deploy the blink application][create-and-deploy-the-blink-application].

## Lesson 2: Create your IoT hub
![Lesson 2 end-to-end diagram][lesson-2-end-to-end-diagram]

In this lesson, you create your free Azure account, provision your Azure IoT hub and create your first device in the IoT hub.

Complete Lesson 1 before you start this lesson.

### Get the Azure tools
Install the Azure command-line interface (Azure CLI).

*Estimated time to complete: 10 minutes*

Go to [Get Azure tools][get-azure-tools].

### Create your IoT hub and register your Arduino board
Create your resource group, provision your first Azure IoT hub, and add your first device to the IoT hub using Azure CLI.

*Estimated time to complete: 10 minutes*

Go to [Create your IoT hub and register your Arduino board][create-your-iot-hub-and-register-your-arduino-board].

## Lesson 3: Send device-to-cloud messages
![Lesson 3 end-to-end diagram][lesson-3-end-to-end-diagram]

In this lesson, you send messages from your Arduino board to your IoT hub. You also create an Azure function app that gets incoming messages from your IoT hub and writes them to Azure Table storage.

Complete Lessons 1 and Lesson 2 before you start this lesson.

### Create an Azure function app and Azure Storage account
Use an Azure Resource Manager template to create an Azure function app and an Azure Storage account.

*Estimated time to complete: 10 minutes*

Go to [Create an Azure function app and Azure Storage account][create-an-azure-function-app-and-azure-storage-account].

### Run a sample application to send device-to-cloud messages
Deploy and run a sample application to your Arduino board that sends messages to the IoT hub.

*Estimated time to complete: 10 minutes*

Go to [Run a sample application to send device-to-cloud messages][send-device-to-cloud-messages].

### Read messages persisted in Azure Storage
Monitor the device-to-cloud messages as they are written to Azure Storage.

*Estimated time to complete: 5 minutes*

Go to [Read messages persisted in Azure Storage][read-messages-persisted-in-azure-storage].

## Lesson 4: Send cloud-to-device messages
![Lesson 4 end-to-end diagram][lesson-4-end-to-end-diagram]

This lesson shows how to send messages from your Azure IoT hub to your Arduino board. The messages control the on and off behavior of the GPIO #13 on-board LED. A sample application is prepared for you to achieve this task.

Complete Lessons 1, Lesson 2 and Lesson 3 before you start this lesson.

### Run the sample application to receive cloud-to-device messages
The sample application in Lesson 4 runs on your Arduino board and monitors incoming messages from your IoT hub. A new gulp task sends messages to your Arduino board from your IoT hub to blink the LED.

*Estimated time to complete: 10 minutes*

Go to [Run the sample application to receive cloud-to-device messages][receive-cloud-to-device-messages].

### Optional section: Change the on and off behavior of the LED
Customize the messages to change the LED’s on and off behavior.

*Estimated time to complete: 10 minutes*

Go to [Optional section: Change the on and off behavior of the LED][change-the-on-and-off-behavior-of-the-led].

## Troubleshooting
If you have any problems during the lessons, look for solutions in the [Troubleshooting][troubleshooting] article.

<!-- Images and links -->

[Lesson-1-end-to-end-diagram]: media/iot-hub-adafruit-feather-m0-wifi-lessons/e2e-lesson1.png
[configure-your-device]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-configure-your-device.md
[get-the-tools]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-get-the-tools-win32.md
[create-and-deploy-the-blink-application]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-deploy-blink-app.md
[lesson-2-end-to-end-diagram]: media/iot-hub-adafruit-feather-m0-wifi-lessons/e2e-lesson2.png
[get-azure-tools]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson2-get-azure-tools-win32.md
[create-your-iot-hub-and-register-your-arduino-board]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson2-prepare-azure-iot-hub.md
[lesson-3-end-to-end-diagram]: media/iot-hub-adafruit-feather-m0-wifi-lessons/e2e-lesson3.png
[create-an-azure-function-app-and-azure-storage-account]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson3-deploy-resource-manager-template.md
[send-device-to-cloud-messages]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson3-run-azure-blink.md
[read-messages-persisted-in-azure-storage]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson3-read-table-storage.md
[lesson-4-end-to-end-diagram]: media/iot-hub-adafruit-feather-m0-wifi-lessons/e2e-lesson4.png
[receive-cloud-to-device-messages]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson4-send-cloud-to-device-messages.md
[change-the-on-and-off-behavior-of-the-led]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson4-change-led-behavior.md
[troubleshooting]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-troubleshooting.md