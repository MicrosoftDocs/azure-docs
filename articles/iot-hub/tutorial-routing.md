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

Use [message routing](../articles/iot-hub/iot-hub-devguide-messages-d2c.md) in Azure IoT Hub to send telemetry data from your IoT devices Azure services such as blob storage, Service Bus Queues, Service Bus Topics, and Event Hubs.

Every IoT hub has a default built-in endpoint that is compatible with Event Hubs. You can also create custom endpoints and route messages to other Azure services by defining  [routing queries](../articles/iot-hub/iot-hub-devguide-routing-query-syntax.md). Each message that arrives at the IoT hub is routed to all endpoints whose routing queries it matches. If a message doesn't match any of the defined routing queries, it is routed to the default endpoint.

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
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

* Make sure that port 8883 is open in your firewall. The sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../articles/iot-hub/iot-hub-mqtt-support.md#connecting-to-iot-hub).

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

   *IOTHUB_NAME*. Replace this placeholder with the name of your IoT hub.

   *DEVICE_NAME*. Replace this placeholder with any name you want to use for the device in this tutorial.

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

## Use the Azure CLI to create the base resources

This tutorial uses the Azure CLI to create the base resources, then uses the [Azure portal](https://portal.azure.com) to show how to configure message routing and set up the virtual device for testing.

Copy and paste the script below into Cloud Shell and press Enter. It runs the script one line at a time. This will create the base resources for this tutorial, including the storage account, IoT Hub, Service Bus Namespace, and Service Bus queue.

There are several resource names that must be globally unique, such as the IoT Hub name and the storage account name. To make this easier, those resource names are appended with a random alphanumeric value called *randomValue*. The randomValue is generated once at the top of the script and appended to the resource names as needed throughout the script. If you don't want it to be random, you can set it to an empty string or to a specific value.

> [!TIP]
> A tip about debugging: this script uses the continuation symbol (the backslash `\`) to make the script more readable. If you have a problem running the script, make sure your Cloud Shell session is running `bash` and that there are no spaces after any of the backslashes.
>

```azurecli-interactive
# This retrieves the subscription id of the account 
#   in which you're logged in.
# This field is used to set up the routing queries.
subscriptionID=$(az account show --query id)

# Concatenate this number onto the resources that have to be globally unique.
# You can set this to "" or to a specific value if you don't want it to be random.
# This retrieves a random value.
randomValue=$RANDOM

# Set the values for the resource names that 
#   don't have to be globally unique.
location=westus
resourceGroup=ContosoResources
iotHubConsumerGroup=ContosoConsumers
containerName=contosoresults

# Create the resource group to be used
#   for all the resources for this tutorial.
az group create --name $resourceGroup \
    --location $location

# The IoT hub name must be globally unique, 
#   so add a random value to the end.
iotHubName=ContosoTestHub$randomValue 
echo "IoT hub name = " $iotHubName

# Create the IoT hub.
az iot hub create --name $iotHubName \
    --resource-group $resourceGroup \
    --sku S1 --location $location

# Add a consumer group to the IoT hub for the 'events' endpoint.
az iot hub consumer-group create --hub-name $iotHubName \
    --name $iotHubConsumerGroup

# The storage account name must be globally unique, 
#   so add a random value to the end.
storageAccountName=contosostorage$randomValue
echo "Storage account name = " $storageAccountName

# Create the storage account to be used as a routing destination.
az storage account create --name $storageAccountName \
    --resource-group $resourceGroup \
    --location $location \
    --sku Standard_LRS

# Get the primary storage account key. 
#    You need this to create the container.
storageAccountKey=$(az storage account keys list \
    --resource-group $resourceGroup \
    --account-name $storageAccountName \
    --query "[0].value" | tr -d '"') 

# See the value of the storage account key.
echo "storage account key = " $storageAccountKey

# Create the container in the storage account. 
az storage container create --name $containerName \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --public-access off

# The Service Bus namespace must be globally unique, 
#   so add a random value to the end.
sbNamespace=ContosoSBNamespace$randomValue
echo "Service Bus namespace = " $sbNamespace

# Create the Service Bus namespace.
az servicebus namespace create --resource-group $resourceGroup \
    --name $sbNamespace \
    --location $location

# The Service Bus queue name must be globally unique, 
#   so add a random value to the end.
sbQueueName=ContosoSBQueue$randomValue
echo "Service Bus queue name = " $sbQueueName

# Create the Service Bus queue to be used as a routing destination.
az servicebus queue create --name $sbQueueName \
    --namespace-name $sbNamespace \
    --resource-group $resourceGroup

```

Now that the base resources are set up, you can configure the message routing in the [Azure portal](https://portal.azure.com).

## Set up message routing

[!INCLUDE [iot-hub-include-create-routing-description](../../includes/iot-hub-include-create-routing-description.md)]

### Route to a storage account

Now set up the routing for the storage account. You go to the Message Routing pane, then add a route. When adding the route, define a new endpoint for the route. After this routing is set up, messages where the **level** property is set to **storage** are written to a storage account automatically. 

[!INCLUDE [iot-hub-include-blob-storage-format](../../includes/iot-hub-include-blob-storage-format.md)]

Now you set up the configuration for the message routing to Azure Storage.

1. In the [Azure portal](https://portal.azure.com), select **Resource Groups**, then select your resource group. This tutorial uses **ContosoResources**.

2. Select the IoT hub under the list of resources. This tutorial uses **ContosoTestHub**.

3. Select **Message Routing** in the middle column that says ***Messaging**. Select +**Add** to see the **Add a Route** pane. Select +**Add endpoint** next to the Endpoint field, then select **Storage**. You see the **Add a storage endpoint** pane.

   ![Start adding an endpoint for a route](./media/tutorial-routing/01-add-a-route-to-storage.png)

4. Enter a name for the endpoint. This tutorial uses **ContosoStorageEndpoint**.

   ![Name the endpoint](./media/tutorial-routing/02-add-a-storage-endpoint.png)

5. Select **Pick a container**. This takes you to a list of your storage accounts. Select the one you set up in the preparation steps; this tutorial uses **contosostorage**. It shows a list of containers in that storage account. **Select** the container you set up in the preparation steps. This tutorial uses **contosoresults**. Then click **Select** at the bottom of the screen. It returns to a different **Add a storage endpoint** pane. You see the URL for the selected container. 

6. Set the encoding to AVRO or JSON. For the purpose of this tutorial, use the defaults for the rest of the fields. This field will be greyed out if the region selected does not support JSON encoding. Set the file name format. 

   > [!NOTE]
   > Set the format of the blob name using the **Blob file name format**. The default is `{iothub}/{partition}/{YYYY}/{MM}/{DD}/{HH}/{mm}`. The format must contain {iothub}, {partition}, {YYYY}, {MM}, {DD}, {HH}, and {mm} in any order.
   >
   > For example, using the default blob file name format, if the hub name is ContosoTestHub, and the date/time is October 30, 2018 at 10:56 a.m., the blob name will look like this: `ContosoTestHub/0/2018/10/30/10/56`.
   > 
   > The blobs are written in the AVRO format by default.
   >

7. Select **Create** at the bottom of the page to create the storage endpoint and add it to the route. You are returned to the **Add a Route** pane. 

8. Complete the rest of the routing query information. This query specifies the criteria for sending messages to the storage container you just added as an endpoint. Fill in the fields on the screen.

9. Fill in the rest of the fields.

   - **Name**: Enter a name for your route. This tutorial uses **ContosoStorageRoute**. Next, specify the endpoint for  storage. This tutorial uses ContosoStorageEndpoint.
   
   - Specify **Data source**: Select **Device Telemetry Messages** from the dropdown list.   

   - Select **Enable route**: Be sure this field is set to `enabled`.

   - **Routing query**: Enter `level="storage"` as the query string.

   ![Save the routing query information](./media/tutorial-routing/04-save-storage-route.png)
  
10.  Select **Save**. When it finishes, it returns to the Message Routing pane, where you can see your new routing query for storage. Close the Message Routing pane, which returns you to the Resource group page.


### Route to a Service Bus queue

Now set up the routing for the Service Bus queue. You go to the Message Routing pane, then add a route. When adding the route, define a Service Bus Queue as the endpoint for the route. After this route is set up, messages where the **level** property is set to **critical** are written to the Service Bus queue, which triggers a Logic App, which then sends an e-mail with the information.

1. On the Resource group page, select your IoT hub, then select **Message Routing**.

2. On the **Message Routing** pane, select +**Add**.

3. On the **Add a Route** pane, Select +**Add** near **+endpoint**. Select **Service Bus Queue**. You see the **Add Service Bus Endpoint** pane.

   ![Adding a 1st service bus endpoint](./media/tutorial-routing/05-setup-sbq-endpoint.png)

4. Fill in the rest of the fields:

   **Endpoint Name**: Enter a name for the endpoint. This tutorial uses **ContosoSBQEndpoint**.
   
   **Service Bus Namespace**: Use the dropdown list to select the service bus namespace you set up in the preparation steps. This tutorial uses **ContosoSBNamespace**.

   **Service Bus queue**: Use the dropdown list to select the Service Bus queue. This tutorial uses **contososbqueue**.

5. Select **Create** to add the 1st Service Bus queue endpoint. You return to the **Add a route** pane.

   ![Adding 2nd service bus endpoint](./media/tutorial-routing/06-save-sbq-endpoint.png)

6. Now complete the rest of the routing query information. This query specifies the criteria for sending messages to the Service Bus queue you just added as an endpoint. Fill in the fields on the screen. 

   **Name**: Enter a name for your route. This tutorial uses **ContosoSBQueueRoute**. 

   **Endpoint**: This shows the endpoint you just set up.

   **Data source**: Select **Device Telemetry Messages** from the dropdown list.

   **Enable route**: Set this field to `enable`."

   **Routing query**: Enter `level="critical"` as the routing query. 

   ![Create a routing query for the Service Bus queue](./media/tutorial-routing/07-save-servicebusqueue-route.png)

7. Select **Save**. When it returns to the Routes pane, you see both of your new routes.

   ![The routes you just set up](./media/tutorial-routing/08-show-both-routes.png)

8. You can see the custom endpoints that you set up by selecting the **Custom Endpoints** tab.

   ![The custom endpoints you just set up](./media/tutorial-routing/09-show-custom-endpoints.png)

9. Close the Message Routing pane, which returns you to the Resource group pane.

## Create a simulated device

[!INCLUDE [iot-hub-include-create-simulated-device-portal](../../includes/iot-hub-include-create-simulated-device-portal.md)]

## Next steps

Now that you have the resources set up and the message routes configured, advance to the next tutorial to learn how to send messages to the IoT hub and see them be routed to the different destinations. 

> [!div class="nextstepaction"]
> [Part 2 - View the message routing results](tutorial-routing-view-message-routing-results.md)
