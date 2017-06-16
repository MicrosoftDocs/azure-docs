---
title: 'Connect Arduino (C) to Azure IoT - Lesson 3: Run sample | Microsoft Docs'
description: Deploy and run a sample application to Adafruit Feather M0 WiFi that sends messages to your IoT hub and blinks the LED.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'iot cloud service, arduino send data to cloud'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started

ms.assetid: 92cce319-2b17-4c9b-889d-deac959e3e7c
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Run a sample application to send device-to-cloud messages
## What you will do
This article will show you how to deploy and run a sample application on your Adafruit Feather M0 WiFi Arduino board that sends messages to your IoT hub.

If you have any problems, look for solutions on the [troubleshooting page][troubleshooting].

## What you will learn
You will learn how to use the gulp tool to deploy and run the sample Arduino application on your Arduino board.

## What you need
* Before you start this task, you must have successfully completed [Create an Azure function app and a storage account to process and store IoT hub messages][process-and-store-iot-hub-messages].

## Get your IoT hub and device connection strings
The device connection string is used to connect your Arduino board to your IoT hub. The IoT hub connection string is used to connect your IoT hub to the device identity that represents your Arduino board in the IoT hub.

* List all your IoT hubs in your resource group by running the following Azure CLI command:

```bash
az iot hub list -g iot-sample --query [].name
```

Use `iot-sample` as the value of `{resource group name}` if you didn't change the value.

* Get the IoT hub connection string by running the following Azure CLI command:

```bash
az iot hub show-connection-string --name {my hub name}
```

`{my hub name}` is the name that you specified when you created your IoT hub and registered your Arduino board.

* Get the device connection string by running the following command:

```bash
az iot device show-connection-string --hub-name {my hub name} --device-id mym0wifi
```

Use `mym0wifi` as the value of `{device id}` if you didn't change the value.
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

3. Initialize the configuration file by running the following commands:

   ```bash
   npm install
   gulp init
   gulp install-tools
   ```
4. Open the device configuration file `config-arduino.json` in Visual Studio Code by running the following command:

   ```bash
   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-arduino.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-arduino.json
   ```

   ![config-arduino.json][config-arduino-json]

5. Make the following replacements in the `config-arduino.json` file:

   * Replace **[Wi-Fi SSID]** with your Wi-Fi SSID that connected to the Internet.
   * Replace **[Wi-Fi password]** with your Wi-Fi password. Remove the string if your Wi-Fi doesn't require password.
   * Replace **[IoT device connection string]** with the `device connection string` you obtained.
   * Replace **[IoT hub connection string]** with the `iot hub connection string` you obtained.

   > [!NOTE]
   > You don't need `azure_storage_connection_string` in this article. Keep it as is.

## Deploy and run the sample application
Deploy and run the sample application on your Arduino board by running the following command:

```bash
gulp run
# You can monitor the serial port by running listen task:
gulp listen

# Or you can combine above two gulp tasks into one:
gulp run --listen
```

> [!NOTE]
> The default gulp task runs `install-tools` and `run` tasks sequentially. When you [deployed the blink app][deployed-the-blink-app], you ran these tasks separately.

## Verify that the sample application works
You should see the GPIO #0 on-board LED blinking every two seconds. Every time the LED blinks, the sample application sends a message to your IoT hub and verifies that the message has been successfully sent to your IoT hub. In addition, each message received by the IoT hub is printed in the console window. The sample application terminates automatically after sending 20 messages.

![Sample application with sent and received messages][sample-application-with-sent-and-received-messages]

## Summary
You've deployed and run the new blink sample application on your Arduino board to send device-to-cloud messages to your IoT hub. You now monitor your messages as they are written to the storage account.

## Next steps
[Read messages persisted in Azure Storage][read-messages-persisted-in-azure-storage]
<!-- Images and links -->

[troubleshooting]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-troubleshooting.md
[process-and-store-iot-hub-messages]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson3-deploy-resource-manager-template.md
[device-discovery]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/device_discovery.png
[config-json]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson1/vscode-config-mac.png
[config-arduino-json]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson3/config-arduino.png
[deployed-the-blink-app]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson1-deploy-blink-app.md
[sample-application-with-sent-and-received-messages]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson3/gulp_run_arduino.png
[read-messages-persisted-in-azure-storage]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson3-read-table-storage.md