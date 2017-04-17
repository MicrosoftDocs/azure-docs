---
title: 'Connect Arduino (C) to Azure IoT - Lesson 1: Configure device | Microsoft Docs'
description: Configure Adafruit Feather M0 WiFi for first-time use.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'arduino set up, connect arduino to pc, setup arduino, arduino board'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started

ms.assetid: f5b334f0-a148-41aa-b374-ce7b9f5b305a
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Configure your device
## What you will do
Configure your Adafruit Feather M0 WiFi Arduino board for first-time use by assembling the board, powering it up. If you have any problems, look for solutions on the [troubleshooting page](iot-hub-adafruit-feather-m0-wifi-kit-arduino-troubleshooting.md).

## What you need
To complete this operation, you need the following parts for your Adafruit Feather M0 WiFi Starter Kit:

* The Adafruit Feather M0 WiFi board
* A Micro B to Type A USB cable

![kit][kit]

You also need:

* A computer running Windows, Mac, or Linux.
* A wireless connection for your Arduino board to connect to.
* An Internet connection to download configuration tool.

## What you will learn
In this article, you will learn:

* How to assemble your Arduino board and power it up for the following lessons.
* How to add serial port permissions on Ubuntu.

## Connect your Arduino board to your computer

1. Plug the micro USB cable into the top micro USB port.

   ![Top micro USB port][top-micro-usb-port]

2. Plug the other end of USB cable into your computer.

   ![Computer USB][computer-usb]

## Add serial port permissions on Ubuntu

You can skip this section if you use Windows or macOS. For Ubuntu, you need the following steps to make sure the normal linux user has the permissions to operate on the USB port of your Arduino board.

1. Now as normal user from terminal:

   ```bash
   ls -l /dev/ttyUSB*
   # Or
   ls -l /dev/ttyACM*
   ```

   You will get something like:

   ```bash
   crw-rw---- 1 root uucp 188, 0 5 apr 23.01 ttyUSB0
   # Or
   crw-rw---- 1 root dialout 188, 0 5 apr 23.01 ttyACM0
   ```

   The "0" might be a different number, or multiple entries might be returned. In the first case the data we need is `uucp`, in the second is `dialout`, which is the group owner of the file.

2. Add user to the to the group:

   ```bash
   sudo usermod -a -G group-name username
   ```

   Where `group-name` is the data found in the first step, and `username` is your linux user name.

3. You will need to log out and in again for this change to take effect and complete the setup.

## Summary
In this article, you’ve learned how to configure your Arduino board. The next task is to install the necessary tools and software in preparation for running a sample application on your Arduino board.

![Hardware is ready][hardware-is-ready]

## Next steps
[Get the tools][get-the-tools]
<!-- Images and links -->

[kit]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/kit.png
[top-micro-usb-port]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/top_usbport.jpg
[computer-usb]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/computer_usb.jpg
[hardware-is-ready]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/hardware_ready.jpg
[get-the-tools]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-get-the-tools-win32.md