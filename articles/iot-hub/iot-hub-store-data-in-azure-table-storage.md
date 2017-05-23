---
title: Save IoT Hub messages to Azure data storage | Microsoft Docs
description: Use Azure Function App to save IoT Hub messages to Azure table storage. The IoT Hub messages contain information like sensor data that is sent from your IoT device.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'iot data storage, iot sensor data storage'

ms.assetid: 62fd14fd-aaaa-4b3d-8367-75c1111b6269
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/27/2017
ms.author: xshi

---
# Save IoT Hub messages that contain information like sensor data to Azure table storage

> [!Note]
> Before you start this tutorial, make sure you’ve completed [Connect ESP8266 to Azure IoT Hub](iot-hub-arduino-huzzah-esp8266-get-started.md). In [Connect ESP8266 to Azure IoT Hub](iot-hub-arduino-huzzah-esp8266-get-started.md), you set up your IoT device and IoT hub, and deploy a sample application to run on your device. The application sends collected sensor data to your IoT hub.

## What you will learn

You learn how to create an Azure storage account and an Azure Function App to store IoT Hub messages in Azure table storage.

## What you will do

- Create an Azure storage account.
- Prepare for IoT Hub connection to read messages.
- Create and deploy an Azure Function App.

## What you will need

- Tutorial [Connect ESP8266 to Azure IoT Hub](iot-hub-arduino-huzzah-esp8266-get-started.md) completed which covers the following requirements:
  - An active Azure subscription.
  - An Azure IoT hub under your subscription.
  - A running application that sends messages to your Azure IoT hub.

## Create an Azure storage account

1. In the Azure portal, click **New** > **Storage** > **Storage account**.
1. Enter the necessary information for the storage acount:

   ![Create an storage account in the Azure Portal](media\iot-hub-store-data-in-azure-table-storage\1_azure-portal-create-storage-account.png)

   **Name**: The name of the storage account. The name must be globally unique.

   **Resource group**: Use the same resource group that your IoT hub uses.

   **Pin to dashboard**: Check this option for easy access to your IoT hub from the dashboard.
1. Click **Create**.

## Prepare for IoT Hub connection to read messages

IoT Hub exposes a built-in Event Hub-compatible endpoint to enable applications to read IoT Hub messages. Meanwhile, applications use consumer groups to read data from IoT Hub. Before creating an Azure Function App to read data from your IoT hub, you need to:

- Get the connection string of your IoT hub endpoint.
- Create a consumer group for your IoT hub.

### Get the connection string of your IoT hub endpoint

1. Open your IoT hub.
1. On the **IoT Hub** pane, click **Endpoints** under **MESSAGING**.
1. On the right pane, click **Events** under **Built-in endpoints**.
1. In the **Properties** pane, make a note of the following values:
   - Event Hub-compatible endpoint
   - Event Hub-compatible name

   ![Get the connection string of your IoT hub endpoint in the Azure portal](media\iot-hub-store-data-in-azure-table-storage\2_azure-portal-iot-hub-endpoint-connection-string.png)

1. On the **IoT Hub** pane, click **Shared access policies** under **SETTINGS**.
1. Click **iothubowner**.
1. Make a note of the **Primary key** value.
1. Make up the connection string of your IoT hub endpoint as follows:

   `Endpoint=<Event Hub-compatible endpoint>;SharedAccessKeyName=iothubowner;SharedAccessKey=<Primary key>`

   > [!Note]
   > Replace `<Event Hub-compatible endpoint>` and `<Primary key>` with the values you noted down.

### Create a consumer group for your IoT hub

1. Open your IoT hub.
1. On the **IoT Hub** pane, click **Endpoints** under **MESSAGING**.
1. On the right pane, click **Events** under **Built-in endpoints**.
1. In the **Properties** pane, enter a name under **Consumer groups** and make a note of the name.
1. Click **Save**.

## Create and deploy an Azure Function App

1. In the [Azure portal](https://portal.azure.com/), click **New** > **Compute** > **Function App**.
1. Enter the necessary information for the Function App.

   ![Create an Fuction App in the Azure portal](media\iot-hub-store-data-in-azure-table-storage\3_azure-portal-create-function-app.png)

   **App name**: The name of the Function App. The name must be globally unique.

   **Resource group**: Use the same resource group that your IoT Hub uses.

   **Storage Account**: The storage account that you created.

   **Pin to dashboard**: Check this option for easy access to the Function App from the dashboard.
1. Click **Create**.
1. Open the Function App once it is created.
1. Create a new function in the Function App.
   1. Click **New Function**.
   1. Select **JavaScript** for **Language**, and **Data Processing** for **Scenario**.
   1. Click the **EventHubTrigger-JavaScript** template.
   1. Enter the necessary information for the template.

      **Name your function**: The name of the functio.

      **Event Hub name**: The Event Hub-compatible name you noted down.

      **Event Hub connection**: Click new to add the connection string of your IoT hub endpoint that you made up.
   1. Click **Create**.
1. Configure an output of the function.
   1. Click **Integrate** > **New Output** > **Azure Table Storage** > **Select**.

      ![Add a table storage to your Fuction App in the Azure portal](media\iot-hub-store-data-in-azure-table-storage\4_azure-portal-function-app-add-output-table-storage.png)
   1. Enter the necessary information.

      **Table name**: Use `deviceData` for the name.

      **Storage account connection**: Click **new** and select your storage account.
   1. Click **Save**.
1. Under **Triggers**, click **Azure Event Hub (myEventHubTrigger)**.
1. Under **Event Hub consumer group**, enter the name of the consumer group that you created, and then click **Save**.
1. Click **Develop**, and then click **View files**.
1. Click **Add** to add a new file named `package.json`, paste in the following information, and then click **Save**.

   ```json
   {
      "name": "iothub_save_message_to_table",
      "version": "0.0.1",
      "private": true,
      "main": "index.js",
      "author": "Microsoft Corp.",
      "dependencies": {
         "azure-iothub": "1.0.9",
         "azure-iot-common": "1.0.7",
         "moment": "2.14.1"
      }
   }
   ```
1. Replace the code in `index.js` with the following, and then click **Save**.

   ```javascript
   'use strict';

   // This function is triggered each time a message is revieved in the IoTHub.
   // The message payload is persisted in an Azure Storage Table
   var moment = require('moment');

   module.exports = function (context, iotHubMessage) {
      context.log('Message received: ' + JSON.stringify(iotHubMessage));
      context.bindings.outputTable = {
      "partitionKey": moment.utc().format('YYYYMMDD'),
         "rowKey": moment.utc().format('hhmmss') + process.hrtime()[1] + '',
         "message": JSON.stringify(iotHubMessage)
      };
      context.done();
   };
   ```
1. Click **Function app settings** > **Open dev console**.

   You should be at the `wwwroot` folder of the Function App.
1. Go to the function folder by running the following command:

   ```bash
   cd <your function name>
   ```
1. Install the npm package by running the following command:

   ```bash
   npm install
   ```

   > [!Note]
   > The installation may take some time to complete.

By now, you have created the Function App. It stores messages that your IoT hub receives in your Azure table storage.

> [!Note]
> You can use the **Run** button to test the Function App. When you click **Run**, the test message is sent to your IoT hub. The arrival of the message should trigger the Function App to start and then save the message to your Azure table storage. The **Logs** pane records the details of the process.

## Verify your message in your table storage

1. Run the sample application on your device to send messages to your IoT hub.
1. [Download and install Microsoft Azure Storage Explorer](http://storageexplorer.com/).
1. Open Microsoft Azure Storage Explorer, click **Add an Azure Account** > **Sign in**, and then sign in to your Azure account.
1. Click your Azure subscription > **Storage Accounts** > your storage account > **Tables** > **deviceData**.

   You should see messages sent from your device to your IoT hub logged in the `deviceData` table.

## Next steps

You’ve successfully created your Azure storage account and Azure Function App to store messages that your IoT hub receives in your Azure table storage.

To continue getting started with IoT Hub and to explore other IoT scenarios, see:

- [Manage cloud device messaging with iothub-explorer](iot-hub-explorer-cloud-device-messaging.md)
- [Use Power BI to visualize real-time sensor data from Azure IoT Hub](iot-hub-live-data-visualization-in-power-bi.md).
- [Use Azure Web Apps to visualize real-time sensor data from Azure IoT Hub](iot-hub-live-data-visualization-in-web-apps.md).
- [Weather forecast using the sensor data from your IoT hub in Azure Machine Learning](iot-hub-weather-forecast-machine-learning.md)