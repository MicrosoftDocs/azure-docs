---
title: 'Connect Arduino (C) to Azure IoT - Lesson 4: Cloud-to-device | Microsoft Docs'
description: A sample application runs on Adafruit Feather M0 WiFi and monitors incoming messages from your IoT hub. A new gulp task sends messages to Adafruit Feather M0 WiFi from your IoT hub to blink the LED.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'arduino control led from web, arduino control led via web'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started

ms.assetid: a0bf53fb-29fb-485f-ba4a-6c715057b1a2
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Run a sample application to receive cloud-to-device messages
In this article, you deploy a sample application on your Adafruit Feather M0 WiFi Arduino board.

The sample application monitors incoming messages from your IoT hub. You also run a gulp task on your computer to send messages to your Arduino board from your IoT hub. When the sample application receives the messages, it blinks the LED. If you have any problems, look for solutions on the [troubleshooting page][troubleshooting].

## What you will do
* Connect the sample application to your IoT hub.
* Deploy and run the sample application.
* Send messages from your IoT hub to your Arduino board to blink the LED.

## What you will learn
In this article, you will learn:
* How to monitor incoming messages from your IoT hub.
* How to send cloud-to-device messages from your IoT hub to your Arduino board.

## What you need
* Your Arduino board, set up for use. To learn how to set up your Arduino board, see [Configure your device][configure-your-device].
* An IoT hub that is created in your Azure subscription. To learn how to create your IoT hub, see [Create your Azure IoT Hub][create-your-azure-iot-hub].

## Connect the sample application to your IoT hub

1. Make sure that you're in the repo folder `iot-hub-c-feather-m0-getting-started`.

   Open the sample application in Visual Studio Code by running the following commands:

   ```bash
   cd Lesson4
   code .
   ```

   Notice the `app.ino` file in the `app` subfolder. The `app.ino` file is the key source file that contains the code to monitor incoming messages from the IoT hub. The `blinkLED` function blinks the LED.

   ![Repo structure in the sample application][repo-structure]

2. Obtain the serial port of the device with the device discovery cli:

   ```bash
   devdisco list --usb
   ```

   You should see an output that is similar to the following and find the usb COM port for your Arduino board:

   ![Device discovery][device-discovery]

3. Open the file `config.json` in the lesson folder and input the value of the found COM port number:

   ```json
   {
       "device_port" : "COM1"
   }
   ```

   ![config.json][config-json]

   > [!NOTE]
   > For the COM port, on Windows platform, it has the format of `COM1, COM2, ...`. On macOS or Ubuntu, it will start with `/dev/`.

4. Initialize the configuration file by running the following commands:

   ```bash
   # For Windows command prompt
   npm install
   gulp init
   gulp install-tools
   ```

5. Make the following replacements in the `config-arduino.json` file:

   If you completed the steps in [Create an Azure function app and storage account][create-an-azure-function-app-and-storage-account] on this computer, all the configurations are inherited, so you can skip the step to the task of deploying and running the sample application. If you completed the steps in [Create an Azure function app and storage account][create-an-azure-function-app-and-storage-account] on a different computer, you need to replace the placeholders in the `config-arduino.json` file. The `config-arduino.json` file is in the subfolder of your home folder.

   ![Contents of the config-arduino.json file][config-arduino-json]

   * Replace **[Wi-Fi SSID]** with your Wi-Fi SSID that connected to the Internet.
   * Replace **[Wi-Fi password]** with your Wi-Fi password. Remove the string if your Wi-Fi doesn't require password.
   * Replace **[IoT device connection string]** with the device connection string that you get by running the `az iot device show-connection-string --hub-name {my hub name} --device-id {device id}` command.
   * Replace **[IoT hub connection string]** with the IoT hub connection string that you get by running the `az iot hub show-connection-string --name {my hub name}` command.

## Deploy and run the sample application
Deploy and run the sample application on your Arduino board by running the following commands:

```bash
gulp run
# You can monitor the serial port by running listen task:
gulp listen

# Or you can combine above two gulp tasks into one:
gulp run --listen
```

The gulp command deploys the sample application to your Arduino board. Then, it runs the application on your Arduino board and a separate task on your host computer to send 20 blink messages to your Arduino board from your IoT hub.

After the sample application runs, it starts listening to messages from your IoT hub. Meanwhile, the gulp task sends several "blink" messages from your IoT hub to your Arduino board. For each blink message that the board receives, the sample application calls the `blinkLED` function to blink the LED.

You should see the LED blink every two seconds as the gulp task sends 20 messages from your IoT hub to your Arduino board. The last one is a "stop" message that stops the application from running.

![Sample application with gulp command and blink messages][sample-application]

## Summary
You’ve successfully sent messages from your IoT hub to your Arduino board to blink the LED. The next task is optional: change the on and off behavior of the LED.

## Next steps
[Change the on and off behavior of the LED][change-the-on-and-off-led-behavior]


<!-- Images and links -->

[troubleshooting]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-troubleshooting.md
[configure-your-device]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-configure-your-device.md
[create-your-azure-iot-hub]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson2-prepare-azure-iot-hub.md
[repo-structure]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson4/repo_structure_arduino.png
[device-discovery]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/device_discovery.png
[config-json]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/vscode-config-mac.png
[create-an-azure-function-app-and-storage-account]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson3-deploy-resource-manager-template.md
[config-arduino-json]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson4/config-arduino.png
[sample-application]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson4/gulp_blink_arduino.png
[change-the-on-and-off-led-behavior]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson4-change-led-behavior.md