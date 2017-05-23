---
title: 'Connect Intel Edison (Node) to Azure IoT - Lesson 4: Receive messages | Microsoft Docs'
description: A sample application runs on Edison and monitors incoming messages from your IoT hub. A new gulp task sends messages to Edison from your IoT hub to blink the LED.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'arduino control led from web, arduino control led via web'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-intel-edison-kit-node-get-started

ms.assetid: bc738bf6-e38d-4024-82d7-39b6c2d4bacb
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Run a sample application to receive cloud-to-device messages
In this article, you deploy a sample application on Intel Edison. The sample application monitors incoming messages from your IoT hub. You also run a gulp task on your computer to send messages to Edison from your IoT hub. When the sample application receives the messages, it blinks the LED. If you have any problems, look for solutions on the [troubleshooting page][troubleshooting].

## What you will do
* Connect the sample application to your IoT hub.
* Deploy and run the sample application.
* Send messages from your IoT hub to Edison to blink the LED.

## What you will learn
In this article, you will learn:
* How to monitor incoming messages from your IoT hub.
* How to send cloud-to-device messages from your IoT hub to Edison.

## What you need
* Intel Edison, set up for use. To learn how to set up Edison, see [Configure your device][configure-your-device].
* An IoT hub that is created in your Azure subscription. To learn how to create your IoT hub, see [Create your Azure IoT Hub][create-your-azure-iot-hub].

## Connect the sample application to your IoT hub
1. Make sure that you're in the repo folder `iot-hub-node-edison-getting-started`. Open the sample application in Visual Studio Code by running the following commands:

   ```bash
   cd Lesson4
   code .
   ```

   The file in the `app` subfolder is the key source file that contains the code to monitor incoming messages from the IoT hub. The `blinkLED` function blinks the LED.

   ![Repo structure in the sample application][repo-structure]
2. Initialize the configuration file by running the following commands:

   ```bash
   npm install
   gulp init
   ```

   If you completed the steps in [Create an Azure function app and storage account][create-an-azure-function-app-and-storage-account] on this computer, all the configurations are inherited, so you can skip the step to the task of deploying and running the sample application. If you completed the steps in [Create an Azure function app and storage account][create-an-azure-function-app-and-storage-account] on a different computer, you need to replace the placeholders in the `config-edison.json` file. The `config-edison.json` file is in the subfolder of your home folder.

   ![Contents of the config-edison.json file](media/iot-hub-intel-edison-lessons/lesson4/config-edison.png)

   * Replace **[device hostname or IP address]** with the device IP address you marked down when you configured your device.
   * Replace **[IoT device connection string]** with the device connection string that you get by running the `az iot device show-connection-string --hub-name {my hub name} --device-id {device id}` command.
   * Replace **[IoT hub connection string]** with the IoT hub connection string that you get by running the `az iot hub show-connection-string --name {my hub name}` command.

## Deploy and run the sample application
Deploy and run the sample application on Edison by running the following commands:

```bash
gulp deploy && gulp run
```

The gulp command deploys the sample application to Edison. Then, it runs the application on Edison and a separate task on your host computer to send 20 blink messages to Edison from your IoT hub.

After the sample application runs, it starts listening to messages from your IoT hub. Meanwhile, the gulp task sends several "blink" messages from your IoT hub to Edison. For each blink message that Edison receives, the sample application calls the `blinkLED` function to blink the LED.

You should see the LED blink every two seconds as the gulp task sends 20 messages from your IoT hub to Edison. The last one is a "stop" message that stops the application from running.

![Sample application with gulp command and blink messages][gulp-command-and-blink-messages]

## Summary
You’ve successfully sent messages from your IoT hub to Edison to blink the LED. The next task is optional: change the on and off behavior of the LED.

## Next steps
[Change the on and off behavior of the LED][change-the-on-and-off-behavior-of-the-led]

<!-- Images and links -->

[troubleshooting]: iot-hub-intel-edison-kit-node-troubleshooting.md
[configure-your-device]: iot-hub-intel-edison-kit-node-lesson1-configure-your-device.md
[create-your-azure-iot-hub]: iot-hub-intel-edison-kit-node-lesson2-prepare-azure-iot-hub.md
[repo-structure]: media/iot-hub-intel-edison-lessons/lesson4/repo_structure.png
[create-an-azure-function-app-and-storage-account]: iot-hub-intel-edison-kit-node-lesson3-deploy-resource-manager-template.md
[gulp-command-and-blink-messages]: media/iot-hub-intel-edison-lessons/lesson4/gulp_blink.png
[change-the-on-and-off-behavior-of-the-led]: iot-hub-intel-edison-kit-node-lesson4-change-led-behavior.md