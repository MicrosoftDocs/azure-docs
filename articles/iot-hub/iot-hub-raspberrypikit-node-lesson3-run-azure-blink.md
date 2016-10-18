<properties
 pageTitle="Run the blink sample application on your Raspberry Pi 3 | Microsoft Azure"
 description="Deploy and run a sample application to your Raspberry Pi 3 that sends messages to IoT hub and blinks the LED."
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
 ms.date="09/28/2016"
 ms.author="xshi"/>

# 3.2 Run the blink sample application on your Raspberry Pi 3

## 3.2.1 What will you do

Deploy and run a sample application on your Raspberry Pi 3 that sends messages to your IoT hub.

## 3.2.2 What will you learn

- How to use the gulp tool to deploy and run the sample Node.js application on your Pi.

## 3.2.3 What do you need

- You must have successfully completed the previous section in this lesson: [Create an Azure function app and a storage account to process and store IoT hub messages](iot-hub-raspberrypikit-node-lesson3-deploy-arm-template.md).

## 3.2.4 Get your IoT hub and device connection strings

The device connection string is used to connect the Pi to your IoT hub. The IoT hub connect string is used to connect your IoT hub to the device identity that presensents your Pi in the IoT hub.

- Get the IoT hub connection string by running the following Azure CLI command:

  ```bash
  az iot hub show-connection-string --name {my hub name} --resource-group {resource group name}
  ```

  `{my hub name}` is the name that you specified in Lesson 2. Use `iot-sample` as the value of `{resource group name}` if you didn't change the value in Lesson 2.

- Get the device connection string by running the following command:

  ```bash
  az iot device show-connection-string --hub {my hub name} --device-id {device id} --resource-group {resource group name}
  ```

  `{my hub name}` and `{resource group name}` take the same value as the ones used above. Use `myraspberrypi` as the value of `{device id}` if you didn't change the value in Lesson 2.

## 3.2.5 Configure the device connection

1. Initialize the configuration file by running the following commands:

  ```bash
  npm install
  gulp init
  ```

2. Open the device configuration file `config-raspberrypi.json` in Visual Studio Code by running the following command:

  ```bash
  // For Windows command prompt
  code %USERPROFILE%\.iot-hub-getting-started\config-raspberrypi.json
  
  // For MacOS or Ubuntu
  code ~/.iot-hub-getting-started/config-raspberrypi.json
  ```

  ![config.json](media/iot-hub-raspberry-pi-lessons/lesson3/config.png)

3. Make the following replacements in the `config-raspberrypi.json` file:

  - Replace **[device hostname or IP address]** with the device IP address or hostname you got from `device-discovery-cli`. If you specified a hostname or an IP address value in Lesson 1, use the value accordingly.
  - Replace **[IoT device connection string]** with the `device connection string` you obtained.
  - Replace **[IoT hub connection string]** with the `iot hub connection string` you obtained.

You update the `config-raspberrypi.json` file so that you can deploy the sample application from your computer.

## 3.2.6 Deploy and run the sample appplication

Deploy and run the sample application on your Pi by running the following command:

```bash
gulp
```

> [AZURE.NOTE] The default gulp task runs `install-tools`, `deploy` and `run` tasks sequentially. In [Lesson 1](iot-hub-raspberrypikit-node-lesson1-deploy-blink-app.md), you ran these tasks one after another separately.

## 3.2.7 Verify the sample application works

You should see the LED that is connected to your Pi blinking every two seconds. Every time the LED blinks, the sample application sends a message to your IoT hub and verifies that the message has been successfully sent to your IoT hub. In addition, for each of the message received by the IoT hub, the message is printed in the console window. The sample application terminates automatically after sending 20 messages.

![](media/iot-hub-raspberry-pi-lessons/lesson3/gulp_run.png)

## 3.2.8 Summary

You've deployed and run the blink sample application on your Pi to send device-to-cloud messages to your IoT hub. You can move to the next section to monitor your messages as they are written to the storage account.

## Next Steps

[3.3 Read messages persisted in Azure Storage](iot-hub-raspberrypikit-node-lesson3-read-table-storage.md)