---
title: 'Connect Intel Edison (Node) to Azure IoT - Lesson 3: Monitor messages | Microsoft Docs'
description: Monitor the device-to-cloud messages as they are written to your Azure Table storage.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'data in the cloud, cloud data collection, iot cloud service, iot data'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-intel-edison-kit-node-get-started

ms.assetid: fa2c7efe-7e34-4e39-bb70-015c15ac69ed
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Read messages persisted in Azure Storage
## What you will do
Monitor the device-to-cloud messages that are sent from Intel Edison to your IoT hub as the messages are written to your Azure Table storage. If you have any problems, look for solutions on the [troubleshooting page][troubleshooting].

## What you will learn
In this article, you will learn how to use the gulp read-message task to read messages persisted in your Azure Table storage.

## What you need
Before starting this process, you must have successfully completed [Run the Azure blink sample application on Intel Edison][run-the-azure-blink-sample-application-on-intel-edison].

## Read new messages from your storage account
In the previous article, you ran a sample application on Edison. The sample application sent messages to your Azure IoT hub. The messages sent to your IoT hub are stored into your Azure Table storage via the Azure function app. You need the Azure storage connection string to read messages from your Azure Table storage.

To read messages stored in your Azure Table storage, follow these steps:

1. Get the connection string by running the following commands:

   ```bash
   az storage account list -g iot-sample --query [].name
   az storage account show-connection-string -g iot-sample -n {storage name}
   ```

   The first command retrieves the `storage name` that is used in the second command to get the connection string. Use `iot-sample` as the value of `{resource group name}` if you didn't change the value.
2. Open the configuration file `config-edison.json` in Visual Studio Code by running the following command:

   ```bash
   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-edison.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-edison.json
   ```
3. Replace `[Azure storage connection string]` with the connection string you got in step 1.
4. Save the `config-edison.json` file.
5. Send messages again and read them from your Azure Table storage by running the following command:

   ```bash
   gulp run --read-storage
   ```

   The logic for reading from Azure Table storage is in the `azure-table.js` file.

   ![gulp run --read-storage][gulp run]

## Summary
You've successfully connected Edison to your IoT hub in the cloud and used the blink sample application to send device-to-cloud messages. You also used the Azure function app to store incoming IoT hub messages to your Azure Table storage. You can now send cloud-to-device messages from your IoT hub to Edison.

## Next steps
[Run a sample application to receive cloud-to-device messages][receive-cloud-to-device-messages]
<!-- Images and links -->

[troubleshooting]: iot-hub-intel-edison-kit-node-troubleshooting.md
[run-the-azure-blink-sample-application-on-intel-edison]: iot-hub-intel-edison-kit-node-lesson3-run-azure-blink.md
[gulp run]: media/iot-hub-intel-edison-lessons/lesson3/gulp_read_message.png
[receive-cloud-to-device-messages]: iot-hub-intel-edison-kit-node-lesson4-send-cloud-to-device-messages.md