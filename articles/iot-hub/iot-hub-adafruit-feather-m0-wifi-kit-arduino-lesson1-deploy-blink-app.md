---
title: 'Connect Arduino to Azure IoT - Lesson 1: Deploy app | Microsoft Docs'
description: Clone the sample Arduino application from GitHub, and run gulp to deploy this application to your Adafruit Feather M0 WiFi. This sample application blinks the GPIO #13 on-board LED every two seconds.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'arduino led projects, arduino led blink, arduino led blink code, arduino blink program, arduino blink example'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started

ms.assetid: b0a7d076-d580-4686-9f7d-c0712750b615
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Create and deploy the blink application
## What you will do
Clone the sample Arduino application from GitHub, and use the gulp tool to deploy the sample application to your Adafruit Feather M0 WiFi Arduino board. The sample application blinks the GPIO #13 on-barod LED every two seconds.

If you have any problems, look for solutions on the [troubleshooting page][troubleshooting-page].

## What you will learn
* How to deploy and run the sample application on your Arduino board.

## What you need
You must have successfully completed the following operations:

* [Configure your device][configure-your-device]
* [Get the tools][get-the-tools]

## Open the sample application
To open the sample application, follow these steps:

1. Clone the sample repository from GitHub by running the following command:

   ```bash
   git clone https://github.com/Azure-Samples/iot-hub-c-feather-m0-getting-started.git
   ```
2. Open the sample application in Visual Studio Code by running the following commands:

   ```bash
   cd iot-hub-c-feather-m0-getting-started
   cd Lesson1
   code .
   ```

   ![Repo structure][repo-structure]

The `app.ino` file in the `app` subfolder is the key source file that contains the code to control the LED.

### Install application dependencies
Install the libraries and other modules you need for the sample application by running the following command:

```bash
npm install
```

## Configure the device connection
To configure the device connection, follow these steps:

1. Obtain the serial port of the device with the device discovery cli:

   ```bash
   devdisco list --usb
   ```

   You should see an output that is similar to the following and find the usb COM port for your Arduino board:
   ![Device discovery][device-discovery]

2. Open the file `config.json` in the lesson folder and add the value of the found COM port number:

   ```json
   {
       "device_port" : "COM1"
   }
   ```
   ![config.json][config-json]
   > [!NOTE]
   > For the COM port, on Windows platform, it has the format of `COM1, COM2, ...`. On macOS or Ubuntu, it starts with `/dev/`.

## Deploy and run the sample application
### Install the required tools for your Arduino board

Install the Azure IoT Hub SDK for your Arduino board by running the following command:

```bash
gulp install-tools
```

This task might take a long time to complete, depending on your network connection.

> [!NOTE]
> Please exit the running Arduino IDE instance when running gulp tasks: `install-tools`, `run`.

### Deploy and run the sample app
Deploy and run the sample application by running the following command:

```bash
gulp run

# You can monitor the serial port by running listen task:
gulp listen

# Or you can combine above two gulp tasks into one:
gulp run --listen
```

### Verify the app works
If you don’t see the LED blinking, see the [troubleshooting guide][troubleshooting-page] for solutions to common problems.

![LED blinking][led-blinking]

## Summary
You've installed the required tools to work with your Arduino board and deployed a sample application to your Arduino board to blink the LED. You can now create, deploy, and run another sample application that connects your Arduino board to Azure IoT Hub to send and receive messages.

## Next steps
[Get the Azure tools][get-the-azure-tools]

<!-- Images and links -->

[troubleshooting-page]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-troubleshooting.md
[configure-your-device]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-configure-your-device.md
[get-the-tools]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-get-the-tools-win32.md
[repo-structure]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/vscode-blink-arduino-mac.png
[device-discovery]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/device_discovery.png
[config-json]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/vscode-config-mac.png
[led-blinking]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/led_blinking.png
[get-the-azure-tools]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson2-get-azure-tools-win32.md