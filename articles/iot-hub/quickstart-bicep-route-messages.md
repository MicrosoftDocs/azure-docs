---
title: Quickstart - route messages to storage (Bicep)
titleSuffix: Azure IoT Hub
description: Learn how to use Bicep to publish Azure IoT Hub, storage account, and route messages in this quickstart
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: quickstart-bicep
ms.date: 01/04/2024
ms.custom: mvc, subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Deploy an Azure IoT hub and a storage account using Bicep

In this quickstart, you use Bicep to create an IoT hub, an Azure Storage account, and a route to send messages from the IoT hub to storage. The hub is configured so the messages sent to the hub are automatically routed to the storage account if they meet the routing condition. At the end of this quickstart, you can open the storage account and see the messages sent.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* [Install Azure CLI](/cli/azure/install-azure-cli)

## Review the Bicep file

The Bicep file used in this quickstart is called `101-iothub-auto-route-messages` from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/iothub-auto-route-messages).

Two Azure resources are defined in the Bicep file:

* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts): A storage account with a container.
* [Microsoft.Devices/IotHubs](/azure/templates/microsoft.devices/iothubs): An IoT hub with an endpoint that points to the storage container and a route to send filtered messages to that endpoint.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.devices/iothub-auto-route-messages/main.bicep":::

## Deploy the Bicep file

This section provides the steps to deploy the Bicep file.

1. Download the [main.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.devices/iothub-auto-route-messages/main.bicep) file from the Azure Quickstart Templates repo.

1. Create the resources by deploying the Bicep file using Azure CLI.

   ```azurecli
   az group create --name ContosoResourceGrp --location eastus
   az deployment group create --resource-group exampleRG --template-file main.bicep
   ```

   The deployment takes several minutes to complete. When the deployment finishes, you should see output detailing the deployed resources.

## Send device-to-cloud messages

In this section, you register a device in your new IoT hub and then send messages from that device to IoT Hub. The route that the Bicep file configured in the IoT hub only sends messages to storage if they contain the message property `level=storage`. To test that this routing condition works as expected, we'll send some messages with that property and some without.

>[!TIP]
>This quickstart uses the Azure CLI simulated device for convenience. For a code example of sending device-to-cloud messages with message properties for routing, see [HubRoutingSample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/how%20to%20guides/HubRoutingSample) in the Azure IoT SDK for .NET.

1. Retrieve the name of the IoT hub that the template created for you.

   If you used the default commands in the previous section, your resources were created in the **ContosoResourceGrp** resource group. If you used a different resource group, update the following command to match.

   ```azurecli
   az iot hub list --resource-group ContosoResourceGrp --output table
   ```

1. Copy the name of your IoT hub from the output. It should be formatted like `contosoHub{randomidentifier}`

1. Add a device to the hub.

   ```azurecli
   az iot hub device-identity create --device-id contosoDevice --hub-name {YourIoTHubName} 
   ```

1. Simulate the device and send device-to-cloud messages.

   The `--data` parameter lets us set the message body.

   ```azurecli
   az iot device simulate \
     --device-id contosoDevice \
     --hub-name {YourIoTHubName} \
     --data "This message won't be routed."
   ```

   The simulator sends 100 messages and then disconnects. You don't need to wait for all 100 for the purposes of this quickstart.

   >[!TIP]
   >The Azure CLI won't print the messages as it sends them. If you want to watch the messages as the arrive at your hub, you can install the [Azure IoT Hub extension for Visual Studio Code](./reference-iot-hub-extension.md) and use it to monitor the built-in endpoint.

1. Send device-to-cloud messages to be routed to storage.

   The `--properties` parameter allows us to add message, application, or system properties to the default message. For this quickstart, the route in your IoT hub is looking for messages that contain the message property `level=storage`.

   ```azurecli
   az iot device simulate \
     --device-id contosoDevice \
     --hub-name {YourIoTHubName} \
     --properties level=storage \
     --data "This message will be routed to storage."
   ```

## Review routed messages

1. Sign in to the [Azure portal](https://portal.azure.com) and select the resource group, then select the storage account.

1. Drill down into the storage account until you find files.

   ![Look at the storage account files](./media/horizontal-arm-route-messages/07-see-storage.png)

1. Select one of the files and select **Download** and download the file to a location you can find later. It has a name that's numeric, like 47. Add _.txt_ to the end and then double-click on the file to open it.

1. When you open the file, each row is for a different message. The body of each message is also encrypted. It must be in order for you to perform queries against the body of the message.

   ![View the sent messages](./media/horizontal-arm-route-messages/08-messages.png)

   > [!NOTE]
   > These messages are encoded in UTF-8 and base64. If you read the message back, you have to decode it from base64 and utf-8 in order to read it as ASCII. If you're interested, you can use the method ReadOneRowFromFile in the Routing Tutorial to read one for from one of these message files and decode it into ASCII. ReadOneRowFromFile is in the IoT C# SDK repository that you unzipped for this quickstart. Here is the path from the top of that folder: *./iothub/device/samples/how to guides/HubRoutingSample/Program.cs* Set the boolean `readTheFile` to true, and hardcode the path to the file on disk, and it will open and translate the first row in the file.

In this quickstart, you deployed a Bicep file to create an IoT hub and a storage account, then run a program to send messages to the hub. The messages are routed based on their message properties and stored in the storage account where they can be viewed.

## Clean up resources

When you no longer need the resources that you created, delete the resource group.

```azurecli
az group delete --name exampleRG
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create Bicep files with Visual Studio Code](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md)
