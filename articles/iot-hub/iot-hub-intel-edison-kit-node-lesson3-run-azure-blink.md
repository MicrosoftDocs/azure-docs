---
title: 'Connect Intel Edison (Node) to Azure IoT - Lesson 3: Send messages | Microsoft Docs'
description: Deploy and run a sample application to Intel Edison that sends messages to your IoT hub and blinks the LED.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'iot cloud service, arduino send data to cloud'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-intel-edison-kit-node-get-started

ms.assetid: 1b3b1074-f4d4-42ac-b32c-55f18b304b44
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Run a sample application to send device-to-cloud messages
## What you will do
This article will show you how to deploy and run a sample application on Intel Edison that sends messages to your IoT hub. If you have any problems, look for solutions on the [troubleshooting page][troubleshooting].

## What you will learn
You will learn how to use the gulp tool to deploy and run the sample C application on Edison.

## What you need
* Before you start this task, you must have successfully completed [Create an Azure function app and a storage account to process and store IoT hub messages][process-and-store-iot-hub-messages].

## Get your IoT hub and device connection strings
The device connection string is used to connect Edison to your IoT hub. The IoT hub connection string is used to connect your IoT hub to the device identity that represents Edison in the IoT hub.

* List all your IoT hubs in your resource group by running the following Azure CLI command:

```bash
az iot hub list -g iot-sample --query [].name
```

Use `iot-sample` as the value of `{resource group name}` if you didn't change the value.

* Get the IoT hub connection string by running the following Azure CLI command:

```bash
az iot hub show-connection-string --name {my hub name}
```

`{my hub name}` is the name that you specified when you created your IoT hub and registered Edison.

* Get the device connection string by running the following command:

```bash
az iot device show-connection-string --hub-name {my hub name} --device-id myinteledison
```

Use `myinteledison` as the value of `{device id}` if you didn't change the value.

## Configure the device connection
1. Initialize the configuration file by running the following commands:

   ```bash
   npm install
   gulp init
   ```

2. Open the device configuration file `config-edison.json` in Visual Studio Code by running the following command:

   ```bash
   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-edison.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-edison.json
   ```

   ![config.json](media/iot-hub-intel-edison-lessons/lesson3/config.png)
3. Make the following replacements in the `config-edison.json` file:

   * Replace **[device hostname or IP address]** with the device IP address you marked down when you configured your device.
   * Replace **[IoT device connection string]** with the `device connection string` you obtained.
   * Replace **[IoT hub connection string]** with the `iot hub connection string` you obtained.

   > [!NOTE]
   > You don't need `azure_storage_connection_string` in this article. Keep it as is.

## Deploy and run the sample application
Deploy and run the sample application on Edison by running the following command:

```bash
gulp deploy && gulp run
```

## Verify that the sample application works
You should see the LED that is connected to Edison blinking every two seconds. Every time the LED blinks, the sample application sends a message to your IoT hub and verifies that the message has been successfully sent to your IoT hub. In addition, each message received by the IoT hub is printed in the console window. The sample application terminates automatically after sending 20 messages.

![Sample application with sent and received messages][sample-application-with-sent-and-received-messages]

## Summary
You've deployed and run the new blink sample application on Edison to send device-to-cloud messages to your IoT hub. You now monitor your messages as they are written to the storage account.

## Next steps
[Read messages persisted in Azure Storage][read-messages-persisted-in-azure-storage]
<!-- Images and links -->

[troubleshooting]: iot-hub-intel-edison-kit-node-troubleshooting.md
[process-and-store-iot-hub-messages]: iot-hub-intel-edison-kit-node-lesson3-deploy-resource-manager-template.md
[sample-application-with-sent-and-received-messages]: media/iot-hub-intel-edison-lessons/lesson3/gulp_run.png
[read-messages-persisted-in-azure-storage]: iot-hub-intel-edison-kit-node-lesson3-read-table-storage.md