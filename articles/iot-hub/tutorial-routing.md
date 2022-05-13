---
title: Tutorial - Configure message routing for Azure IoT Hub using Azure CLI
description: Tutorial - Configure message routing for Azure IoT Hub using the Azure CLI and the Azure portal
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 08/16/2021
ms.author: kgremban
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics', devx-track-azurecli]
#Customer intent: As a developer, I want to be able to route messages sent to my IoT hub to different destinations based on properties stored in the message. This step of the tutorial needs to show me how to set up my base resources using CLI and the Azure Portal.
---

# Tutorial: Use the Azure CLI and Azure portal to configure IoT Hub message routing

Use [message routing](iot-hub-devguide-messages-d2c.md) in Azure IoT Hub to send telemetry data from your IoT devices Azure services such as blob storage, Service Bus Queues, Service Bus Topics, and Event Hubs.

Every IoT hub has a default built-in endpoint that is compatible with Event Hubs. You can also create custom endpoints and route messages to other Azure services by defining  [routing queries](iot-hub-devguide-routing-query-syntax.md). Each message that arrives at the IoT hub is routed to all endpoints whose routing queries it matches. If a message doesn't match any of the defined routing queries, it is routed to the default endpoint.

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
>
> * Create an IoT hub and send device messages to it.
> * Create a storage account.
> * Configure a custom endpoint and message route in IoT Hub for the storage account.
> * View device messages arriving in the storage account blob.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An IoT hub in your Azure subscription. If you don't have a hub yet, you can follow the steps in [Create an IoT hub](iot-hub-create-through-portal.md).

* This tutorial uses sample code from [Azure IoT samples for C#](https://github.com/Azure-Samples/azure-iot-samples-csharp).

  * Download or clone the samples repo to your development machine.
  * Have .NET Core 3.0.0 or greater on your development machine. Check your version by running `dotnet --version` and [Download .NET](https://dotnet.microsoft.com/download) if necessary. <!-- TODO: update sample to use .NET 6.0 -->

* Make sure that port 8883 is open in your firewall. The sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).

* Optionally, install [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer). This tool isn't necessary for completing the tutorial, but allows you to observe the messages as they arrive at your IoT hub.

[!INCLUDE [cloud-shell-try-it.md](cloud-shell-try-it.md)]

## Register a device and send messages to IoT Hub

Register a new device in your IoT hub.

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.
1. Select **Devices** from the **Device management** section of the menu.
1. Select **Add device**.
1. Provide a device ID and select **Save**.
1. The new device should be in the list of devices now. If it's not, refresh the page. Select the device ID to open the device details page.
1. Copy one of the device keys and save it. You'll use this value to configure the sample code that generates simulated device telemetry messages.

# [Azure CLI](#tab/cli)

1. Run the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) command in your CLI shell. This creates the device identity.

   **IOTHUB_NAME**. Replace this placeholder with the name of your IoT hub.

   **DEVICE_NAME**. Replace this placeholder with any name you want to use for the device in this tutorial.

    ```azurecli-interactive
    az iot hub device-identity create --device-id DEVICE_NAME --hub-name IOTHUB_NAME 
    ```

1. Run the [az iot hub device-identity show](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-show) command.

    ```azurecli-interactive
    az iot hub device-identity show --device-id DEVICE_NAME --hub-name IOTHUB_NAME
    ```

1. From the device-identity output, copy the **primaryKey** value and save it. You'll use this value to configure the sample code that generates simulated device telemetry messages.

---

Now that you have a device ID and key, use the sample code to start sending device telemetry messages to IoT Hub.
<!-- TODO: update sample to use environment variables, not inline variables -->

1. If you didn't as part of the prerequisites, download or clone the [Azure IoT samples for C# repo](https://github.com/Azure-Samples/azure-iot-samples-csharp) from GitHub now.
1. In the sample folder, navigate to the `/iot-hub/Tutorials/Routing/SimulatedDevice/` folder.
1. In an editor of your choice, open the `Program.cs` file.
1. Find the variable definitions at the top of the **Program** class. Update the following variables with your own information:

   * **s_myDeviceId**: The device Id that you assigned when registering the device.
   * **s_iotHubUri**: The hostname of your IoT hub, which takes the format `IOTHUB_NAME.azure-devices.net`.
   * **s_deviceKey**: The device key that you copied from the device identity information.

1. Save and close the file.
1. Install the Azure IoT C# SDK and necessary dependencies as specified in the `SimulatedDevice.csproj` file:

   ```console
   dotnet restore
   ```

1. Run the sample code:

   ```console
   dotnet run
   ```

1. You should start to see messages printed to output as they are sent to IoT Hub. Leave this program running for the duration of the tutorial.

## Configure IoT Explorer to view messages

Configure IoT Explorer to connect to your IoT hub and read messages as they arrive at the built-in endpoint.

First, retrieve the connection string for your IoT hub.

# [Azure portal](#tab/portal)

1. In the Azure portal, navigate to your IoT hub.
1. Select **Shared access policies** from the **Security settings** section of the menu.
1. Select the **iothubowner** policy.
1. Copy the **Primary connection string**.

# [Azure CLI](#tab/cli)

1. Run the [az iot hub connection-string show](/cli/azure/iot/hub/connection-string#az-iot-hub-connection-string-show) command:

   ```azurecli-interactive
   az iot hub connection-string show --hub-name IOTHUB_NAME
   ```

2. Copy the connection string without the surrounding quotation characters.

---

Now, use that connection string to configure IoT Explorer for your IoT hub.

1. Open IoT Explorer on your development machine.
1. Select **Add connection**.
1. Paste your hub's connection string into the text box.
1. Select **Save**.
1. Once you connect to your IoT hub, you should see a list of devices. Select the device ID that you created for this tutorial.
1. Select **Telemetry**.
1. Select **Start**.
1. You should see the messages arriving from your device, with the most recent displayed at the top.

These messages are all arriving at the default built-in endpoint for your IoT hub. In the next sections we're going to create a custom endpoint and route some of these messages to storage based on the message properties. Those messages will stop appearing in IoT Explorer because messages only go to the built-in endpoint when they don't match any other routes in IoT hub.

## Set up message routing

You are going to route messages to different resources based on properties attached to the message by the simulated device. Messages that are not custom routed are sent to the default endpoint (messages/events).

The sample app for this tutorial assigns a **level** to each message it sends to IoT hub. Each message is randomly assigned a level of **normal**, **storage**, or **critical**.

The first step is to set up the endpoint to which the data will be routed. The second step is to set up the message route that uses that endpoint. After setting up the routing, you can view endpoints and message routes in the portal.

### Create a storage account

Create an Azure Storage account and a container within that account which will hold the device messages that are routed to it.

# [Azure portal](#tab/portal)

1. In the Azure portal, search for **Storage accounts**.
1. Select **Create**.
1. Provide the following values for your storage account:

   | Parameter | Value |
   | --------- | ----- |
   | **Resource group** | Select the same resource group that contains your IoT hub. |
   | **Storage account name** | Provide a globally unique name for your storage account. |
   | **Performance** | Accept the default **Standard** value. |

1. You can accept all the other default values by selecting **Review + create**.
1. After validation completes, select **Create**.
1. After the deployment is complete, select **Go to resource**.
1. In the storage account menu, select **Containers** from the **Data storage** section.
1. Select **Container** to create a new container.
1. Provide a name for your container and select **Create**.

# [Azure CLI](#tab/cli)

1. Use the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command to create a standard general-purpose v2 storage account.

   **STORAGE_NAME**. Replace this placeholder with a name for your storage account. Storage account names must be lowercase and globally unique.

   **GROUP_NAME**. Replace this placeholder with the name of the resource group that contains your IoT hub.

   ```azurecli-interactive
   az storage account create --name STORAGE_NAME --resource-group GROUP_NAME
   ```

1. Use the [az storage container create](/cli/azure/storage/container#az-storage-container-create) to add a container to your storage account.

   **CONTAINER_NAME**. Replace this placeholder with a name for your container.

   ```azurecli-interactive
   az storage container create --auth-mode login --account-name STORAGE_NAME --name CONTAINER_NAME
   ```

---

### Route to a storage account

Now set up the routing for the storage account. In this section you define a new endpoint that points to the storage account you just created. Then, create a route that filters for messages where the **level** property is set to **storage**, and route those to the storage endpoint.

[!INCLUDE [iot-hub-include-blob-storage-format](../../includes/iot-hub-include-blob-storage-format.md)]

# [Azure portal](#tab/portal)

1. In the Azure portal, navigate to your IoT hub.

1. Select **Message Routing** from the **Hub settings** section of the menu. 

1. In the **Routes** tab, select **Add**.

1. Select **Add endpoint** next to the **Endpoint** field, then select **Storage** from the dropdown menu.

   ![Add a new endpoint for a route.](./media/tutorial-routing/01-add-a-route-to-storage.png)

1. Provide the following information for the new storage endpoint:

   | Parameter | Value |
   | --------- | ----- |
   | **Endpoint name** | Create a name for this endpoint. |
   | **Azure Storage container** | Select **Pick a container**, which takes you to a list of storage accounts. Choose the storage account that you created in the previous section, then choose the container that you created in that account. Select **Select**. | **Encoding** | Select **JSON**. If this field is greyed out, then your storage account region does not support JSON. In that case, continue with the default **AVRO**. |

   ![Pick a container.](./media/tutorial-routing/02-add-a-storage-endpoint.png)

1. Accept the default values for the rest of the parameters and select **Create**.

1. Continue creating the new route, now that you've added the storage endpoint. Provide the following information for the new route:

   | Paramter | Value |
   | -------- | ----- |
   | **Name** | Create a name for your route. |
   | **Data source** | Choose **Device Telemetry Messages** from the dropdown list. |
   | **Enable route** | Be sure this field is set to `enabled`. |
   | **Routing query** | Enter `level="storage"` as the query string. |

   ![Save the routing query information](./media/tutorial-routing/04-save-storage-route.png)
  
1. Select **Save**.

# [Azure CLI](#tab/cli)



---

## Next steps

Now that you have the resources set up and the message routes configured, advance to the next tutorial to learn how to send messages to the IoT hub and see them be routed to the different destinations.

> [!div class="nextstepaction"]
> [Part 2 - View the message routing results](tutorial-routing-view-message-routing-results.md)
