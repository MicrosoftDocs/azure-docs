---
title: Save IoT Hub messages to Azure data storage | Microsoft Docs
description: Use an Azure function app to save IoT Hub messages to your Azure table storage. The IoT Hub messages contain information like sensor data that is sent from your IoT device.
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
# Save IoT Hub messages that contain sensor data to your Azure table storage

![End-to-end diagram](media/iot-hub-get-started-e2e-diagram/3.png)

[!INCLUDE [iot-hub-get-started-note](../../includes/iot-hub-get-started-note.md)]

## What you learn

You learn how to create an Azure storage account and an Azure function app to store IoT hub messages in your table storage.

## What you do

- Create an Azure storage account.
- Prepare for IoT Hub connection to read messages.
- Create and deploy an Azure function app.

## What you need

- [Set up your device](iot-hub-raspberry-pi-kit-node-get-started.md), which covers the following requirements:
  - An active Azure subscription
  - An Iot hub under your subscription 
  - A running application that sends messages to your IoT hub

## Create an Azure storage account

1. In the [Azure portal](https://portal.azure.com/), click **New** > **Storage** > **Storage account**.
2. Enter the necessary information for the storage acount:

   ![Create a storage account in the Azure Portal](media\iot-hub-store-data-in-azure-table-storage\1_azure-portal-create-storage-account.png)

   **Name**: The name of the storage account. The name must be globally unique.

   **Resource group**: Use the same resource group that your IoT hub uses.

   **Pin to dashboard**: Check this option for easy access to your IoT hub from the dashboard.
3. Click **Create**.

## Prepare your IoT hub connection to read messages

IoT hub exposes a built-in event hub-compatible endpoint to enable applications to read IoT hub messages. Meanwhile, applications use consumer groups to read data from your IoT hub. Before creating an Azure function app to read data from your IoT hub, you need to:

- Get the connection string of your IoT hub endpoint.
- Create a consumer group for your IoT hub.

### Get the connection string of your IoT hub endpoint

1. Open your IoT hub.
2. On the **IoT Hub** pane, under **Messaging**, click **Endpoints**.
3. In the right pane, under **Built-in endpoints**, click **Events**.
4. In the **Properties** pane, make a note of the following values:
   - Event hub-compatible endpoint
   - Event hub-compatible name

   ![Get the connection string of your IoT hub endpoint in the Azure portal](media\iot-hub-store-data-in-azure-table-storage\2_azure-portal-iot-hub-endpoint-connection-string.png)

5. In the **IoT Hub** pane, under **Settings**, click **Shared access policies**.
6. Click **iothubowner**.
7. Make a note of the **Primary key** value.
8. Make up the connection string of your IoT hub endpoint as follows:

   `Endpoint=<Event Hub-compatible endpoint>;SharedAccessKeyName=iothubowner;SharedAccessKey=<Primary key>`

   > [!NOTE]
   > Replace `<Event Hub-compatible endpoint>` and `<Primary key>` with the values you noted down.

### Create a consumer group for your IoT hub

1. Open your IoT hub.
2. In the **IoT Hub** pane, under **Messaging**, click **Endpoints**.
3. In the right pane, under **Built-in endpoints**, click **Events**.
4. In the **Properties** pane, under **Consumer groups**, enter a name, and then make a note of it.
5. Click **Save**.

## Create and deploy an Azure function app

1. In the [Azure portal](https://portal.azure.com/), click **New** > **Compute** > **Function App**.
2. Enter the necessary information for the function app.

   ![Create a function app in the Azure portal](media\iot-hub-store-data-in-azure-table-storage\3_azure-portal-create-function-app.png)

   **App name**: The name of the function app. The name must be globally unique.

   **Resource group**: Use the same resource group that your IoT hub uses.

   **Storage Account**: The storage account that you created.

   **Pin to dashboard**: Check this option for easy access to the function app from the dashboard.
1. Click **Create**.
1. Open the function app once it is created.
1. Create a new function in the Function App.
   1. Click **New Function**.
   1. Select **JavaScript** for **Language**, and **Data Processing** for **Scenario**.
   1. Click **create this function**, then click **New Function**.
   1. Select **JavaScript** for the language, and **Data Processing** for the scenario.
   1. Click the **EventHubTrigger-JavaScript** template.
   1. Enter the necessary information for the template.

      **Name your function**: The name of the function.

      **Event Hub name**: The event hub-compatible name you noted down.

      **Event Hub connection**: Click new to add the connection string of your IoT hub endpoint that you made up.
   1. Click **Create**.
1. Configure an output of the function.
   1. Click **Integrate** > **New Output** > **Azure Table Storage** > **Select**.

      ![Add table storage to your function app in the Azure portal](media\iot-hub-store-data-in-azure-table-storage\4_azure-portal-function-app-add-output-table-storage.png)
   1. Enter the necessary information.

      **Table parameter name**: Use `outputTable` for the name, which will be used in the Azure Functions' code.
      
      **Table name**: Use `deviceData` for the name.

      **Storage account connection**: Click **new** and select or input your storage account. If you cannot see the storage account, please refer to [Storage account requirements](https://docs.microsoft.com/azure/azure-functions/functions-create-function-app-portal#storage-account-requirements)
      
   1. Click **Save**.
1. Under **Triggers**, click **Azure Event Hub (myEventHubTrigger)**.
1. Under **Event Hub consumer group**, enter the name of the consumer group that you created, and then click **Save**.
1. Click **Develop**, and then click **View files**.
1. Replace the code in `index.js` with the following, and then click **Save**.

   ```javascript
   'use strict';

   // This function is triggered each time a message is revieved in the IoTHub.
   // The message payload is persisted in an Azure Storage table
 
   module.exports = function (context, iotHubMessage) {
    context.log('Message received: ' + JSON.stringify(iotHubMessage));
    var date = Date.now();
    var partitionKey = Math.floor(date / (24 * 60 * 60 * 1000)) + '';
    var rowKey = date + '';
    context.bindings.outputTable = {
     "partitionKey": partitionKey,
     "rowKey": rowKey,
     "message": JSON.stringify(iotHubMessage)
    };
    context.done();
   };
   ```

By now, you have created the function app. It stores messages that your IoT hub receives in your table storage.

> [!Note]
> You can use the **Run** button to test the function app. When you click **Run**, the test message is sent to your IoT hub. The arrival of the message should trigger the function app to start and then save the message to your table storage. The **Logs** pane records the details of the process.

## Verify your message in your table storage

1. Run the sample application on your device to send messages to your IoT hub.
2. [Download and install Azure Storage Explorer](http://storageexplorer.com/).
3. Open Storage Explorer, click **Add an Azure Account** > **Sign in**, and then sign in to your Azure account.
4. Click your Azure subscription > **Storage Accounts** > your storage account > **Tables** > **deviceData**.

   You should see messages sent from your device to your IoT hub logged in the `deviceData` table.

## Next steps

You’ve successfully created your Azure storage account and Azure function app to store messages that your IoT hub receives in your table storage.

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]
