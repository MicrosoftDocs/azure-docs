---
title: Tutorial - Use message enrichments
titleSuffix: Azure IoT Hub
description: Tutorial showing how to use message enrichments for Azure IoT Hub messages
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 05/11/2023
ms.author: kgremban
ms.custom: "mqtt, devx-track-azurecli, devx-track-csharp"
# Customer intent: As a customer using Azure IoT Hub, I want to add information to the messages that come through my IoT hub and are sent to another endpoint. For example, I'd like to pass the IoT hub name to the application that reads the messages from the final endpoint, such as Azure Storage.
---
# Tutorial: Use Azure IoT Hub message enrichments

*Message enrichments* are the ability of Azure IoT Hub to stamp messages with additional information before the messages are sent to the designated endpoint. One reason to use message enrichments is to include data that can be used to simplify downstream processing. For example, enriching device messages with a device twin tag can reduce load on customers to make device twin API calls for this information. For more information, see [Overview of message enrichments](iot-hub-message-enrichments-overview.md).

In the [first part of this tutorial](tutorial-routing.md), you saw how to create custom endpoints and route messages to other Azure services. In this tutorial, you see how to create and configure the extra resources needed to test message enrichments for an IoT hub. The resources include a second storage container for an existing storage account (created in the first part of the tutorial) to hold the enriched messages and a message route to send them there. After the configurations for the message routing and message enrichments are finished, you use an application to send messages to the IoT hub. The hub then routes them to both storage containers. Only the messages sent to the endpoint for the **enriched** storage container are enriched.

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
>
> * Create a second container in your storage account.
> * Create another custom endpoint and route messages to it from the IoT hub.
> * Configure message enrichments that are routed to the new endpoint.
> * Run an app that simulates an IoT device sending messages to the hub.
> * View the results and verify that the message enrichments are being applied to the targeted messages.

## Prerequisites

* You must have an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* You must have completed [Tutorial: Send device data to Azure Storage using IoT Hub message routing](tutorial-routing.md) and maintained the resources you created for it.

* Make sure that port 8883 is open in your firewall. The device sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

# [Azure portal](#tab/portal)

There are no other prerequisites for the Azure portal.

# [Azure CLI](#tab/cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

---

## Create a second container in your storage account

In [the first part](tutorial-routing.md#create-a-storage-account) of this tutorial, you created a storage account and container for routed messages. Now you should create a second container for enriched messages.

# [Azure portal](#tab/portal)

1. In the Azure portal, search for **Storage accounts**.

1. Select the account you created earlier.

1. In the storage account menu, select **Containers** from the **Data storage** section.

1. Select **Container** to create the new container.

   :::image type="content" source="./media/tutorial-message-enrichments/create-storage-container.png" alt-text="Screenshot of creating a storage container.":::

1. Name the container `enriched`, and select **Create**.

# [Azure CLI](#tab/cli)

> [!TIP]
> Many of the CLI commands used throughout this tutorial use the same parameters. For your convenience, we have you define local variables that can be called as needed. Be sure to run all the commands in the same session, or else you will have to redefine the variables.

The values for these variables should be for the same resources you used in the first part of this tutorial.

1. Define the variables for your IoT hub, storage account, and container.

   *GROUP_NAME*: Replace this placeholder with the name of the resource group that contains your IoT hub.

   *IOTHUB_NAME*: Replace this placeholder with the name of your IoT hub.

   *DEVICE_ID*: Replace this placeholder with the ID of your device.

   *STORAGE_NAME*: Replace this placeholder with the name of your storage account.

   For this tutorial, the value for the `containerName` variable should be *enriched*.

   ```azurecli-interactive
   resourceGroup=GROUP_NAME
   hubName=IOTHUB_NAME
   deviceId=DEVICE_ID
   storageName=STORAGE_NAME
   containerName=enriched
   ```

1. Use the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command to add the container to your storage account.

   ```azurecli-interactive
   az storage container create --auth-mode login --account-name $storageName --name $containerName
   ```

---

## Route messages to a second endpoint

Create a second endpoint and route for the enriched messages.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub.

1. In the resource menu under **Hub settings**,  select **Message routing** then select **Add**.

   :::image type="content" source="media/tutorial-routing/message-routing-add.png" alt-text="Screenshot that shows location of the Add button, to add a new route in your IoT hub.":::

1. On the **Endpoint** tab, create a Storage endpoint by providing the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Endpoint type** | Select **Storage**. |
   | **Endpoint name** | Enter `ContosoStorageEndpointEnriched`. |
   | **Azure Storage container** | Select **Pick a container**. Follow the prompts to select the storage account and **enriched** container that you created in the previous section. |
   | **Encoding** | Select **JSON**. If this field is greyed out, then your storage account region doesn't support JSON. In that case, continue with the default **AVRO**. |

   :::image type="content" source="./media/tutorial-message-enrichments/create-storage-endpoint.png" alt-text="Screenshot showing selecting a container for an endpoint.":::

1. Accept the default values for the rest of the parameters and select **Create + next**.

1. Continue creating the new route, now that you've added the storage endpoint. Provide the following information for the new route:

   | Parameter | Value |
   | -------- | ----- |
   | **Name** | ContosoStorageRouteEnriched |
   | **Data source** | Verify that **Device Telemetry Messages** is selected from the dropdown list. |
   | **Enable route** | Verify that this field is set to `enabled`. |
   | **Routing query** | Enter `level="storage"` as the query string. |

   :::image type="content" source="./media/tutorial-message-enrichments/create-storage-route.png" alt-text="Screenshot showing saving routing query information.":::

1. Select **Create + add enrichments**.

# [Azure CLI](#tab/cli)

1. Configure the variables for the endpoint and route commands to use the values *ContosoStorageEndpointEnriched* and *ContosoStorageRouteEnriched*, respectively.

   ```azurecli-interactive
   endpointName=ContosoStorageEndpointEnriched
   routeName=ContosoStorageRouteEnriched
   ```

1. Use the [az iot hub routing-endpoint create](/cli/azure/iot/hub/routing-endpoint#az-iot-hub-routing-endpoint-create) command to create a custom endpoint that points to the storage container you made in the previous section.

   ```azurecli-interactive
   az iot hub routing-endpoint create \
     --connection-string $(az storage account show-connection-string --name $storageName --query connectionString -o tsv) \
     --endpoint-name $endpointName \
     --endpoint-resource-group $resourceGroup \
     --endpoint-subscription-id $(az account show --query id -o tsv) \
     --endpoint-type azurestoragecontainer
     --hub-name $hubName \
     --container $containerName \
     --resource-group $resourceGroup \
     --encoding json
   ```

1. Use the [az iot hub route create](/cli/azure/iot/hub/route#az-iot-hub-route-create) command to create a route that passes any message where `level=storage` to the storage container endpoint.

   ```azurecli-interactive
   az iot hub route create \
     --name $routeName \
     --hub-name $hubName \
     --resource-group $resourceGroup \
     --source devicemessages \
     --endpoint-name $endpointName \
     --enabled true \
     --condition 'level="storage"'
   ```

---

## Add message enrichment to the new endpoint

Create three message enrichments that will be routed to the **enriched** storage container.

# [Azure portal](#tab/portal)

1. On the **Enrichment** tab of the **Add a route** wizard, add three message enrichments for the messages going to the endpoint for the storage container called **enriched**.

   Add these values as message enrichments for the ContosoStorageEndpointEnriched endpoint:

   | Name | Value |
   | ---- | ----- |
   | myIotHub | `$hubname` |
   | DeviceLocation | `$twin.tags.location` (assumes that the device twin has a location tag) |
   | customerID | `6ce345b8-1e4a-411e-9398-d34587459a3a` |

   When you're finished, your enrichments should look similar to this image:

   :::image type="content" source="./media/tutorial-message-enrichments/all-message-enrichments.png" alt-text="Screenshot of table with all enrichments added.":::

1. Select **Add** to add the message enrichments.

# [Azure CLI](#tab/cli)

Make three calls to the [az iot hub message-enrichment create](/cli/azure/iot/hub/message-enrichment#az-iot-hub-message-enrichment-create) command to add message enrichments to the route going to the endpoint created earlier.

```azurecli-interactive
az iot hub message-enrichment create \
  --key myIotHub \
  --value $hubName \
  --endpoints ContosoStorageEndpointEnriched \
  --name $hubName

# This assumes that the device twin has a location tag.
az iot hub message-enrichment create \
  --key DeviceLocation \
  --value '$twin.tags.location' \
  --endpoints ContosoStorageEndpointEnriched \
  --name $hubName

az iot hub message-enrichment create \
  --key customerID \
  --value 6ce345b8-1e4a-411e-9398-d34587459a3a \
  --endpoints ContosoStorageEndpointEnriched \
  --name $hubName
```

---

You now have message enrichments set up for all messages routed to the endpoint you created for enriched messages. If you don't want to add a location tag to the device twin, you can skip to the [Test message enrichments](#test-message-enrichments) section to continue the tutorial.

## Add location tag to the device twin

One of the message enrichments configured on your IoT hub specifies a key of **DeviceLocation** with its value determined by the following device twin path: `$twin.tags.location`. If your device twin doesn't have a location tag, the twin path, `$twin.tags.location`, will be stamped as a string for the **DeviceLocation** key in the message enrichments.

Follow these steps to add a location tag to your device's twin:

# [Azure portal](#tab/portal)

1. Navigate to your IoT hub in the Azure portal.

1. Select **Devices** on the navigation menu of the IoT hub, then select your device.

1. Select the **Device twin** tab at the top of the device page and add the following line just before the closing brace at the bottom of the device twin. Then select **Save**.

    ```json
      , "tags": {"location": "Plant 43"}
    ```

    :::image type="content" source="./media/tutorial-message-enrichments/add-location-tag-to-device-twin.png" alt-text="Screenshot of adding location tag to device twin in Azure portal.":::

# [Azure CLI](#tab/cli)

Use the [az iot hub device-twin update](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-update) command to update the device twin with a new tag key and value.

```azurecli-interactive
az iot hub device-twin update \
  --hub-name $hubName \
  --device-id $deviceId \
  --tags '{"location": "Plant 43"}'
```

---

> [!TIP]
> Wait about five minutes before continuing to the next section. It can take up to that long for updates to the device twin to be reflected in message enrichment values.

To learn more about how device twin paths are handled with message enrichments, see [Message enrichments limitations](iot-hub-message-enrichments-overview.md#limitations). To learn more about device twins, see [Understand and use device twins in IoT Hub](iot-hub-devguide-device-twins.md).

## Test message enrichments

Now that the message enrichments are configured for the **ContosoStorageEndpointEnriched** endpoint, run the simulated device application to send messages to the IoT hub. At this point, message routing has been set up as follows:

* Messages routed to the [storage endpoint you created](tutorial-routing.md#route-to-a-storage-account) in the first part of the tutorial won't be enriched and will be stored in the storage container you created then.

* Messages routed to the storage endpoint **ContosoStorageEndpointEnriched** will be enriched and stored in the storage container **enriched**.

If you aren't still running the SimulatedDevice console application from the first part of this tutorial, run it again:

> [!TIP]
> If you're following the Azure CLI steps for this tutorial, run the sample code in a separate session. That way, you can allow the sample code to continue running while you follow the rest of the CLI steps.

1. In the sample folder, navigate to the `/iot-hub/Tutorials/Routing/SimulatedDevice/` folder.

1. The variable definitions you updated before should still be valid but, if not, edit them in the `Program.cs` file:

   1. Find the variable definitions at the top of the **Program** class. Update the following variables with your own information:

      * **s_myDeviceId**: The device ID that you assigned when registering the device to your IoT hub.
      * **s_iotHubUri**: The hostname of your IoT hub, which takes the format `IOTHUB_NAME.azure-devices.net`.
      * **s_deviceKey**: The device primary key found in the device identity information.

   1. Save and close the file.

1. Run the sample code:

   ```console
   dotnet run
   ```

After leaving the console application to run for a few minutes, view the data:

1. In the [Azure portal](https://portal.azure.com), navigate to your storage account.

1. Select **Storage browser** from the navigation menu. Select **Blob containers** to see the two containers that you created over the course of these tutorials.

   :::image type="content" source="./media/tutorial-message-enrichments/show-blob-containers.png" alt-text="Screenshot showing the blob containers in the storage account.":::

The messages in the container called **enriched** have the message enrichments included in the messages. The messages in the container you created earlier have the raw messages with no enrichments. Drill down into the **enriched** container until you get to the bottom and then open the most recent message file. Then do the same for the other container to verify that one is enriched and one isn't.

When you look at messages that have been enriched, you should see `"myIotHub"` with the hub name, the location, and the customer ID, like this:

```json
{
  "EnqueuedTimeUtc":"2019-05-10T06:06:32.7220000Z",
  "Properties":
  {
    "level":"storage",
    "myIotHub":"{your hub name}",
    "DeviceLocation":"Plant 43",
    "customerID":"6ce345b8-1e4a-411e-9398-d34587459a3a"
  },
  "SystemProperties":
  {
    "connectionDeviceId":"Contoso-Test-Device",
    "connectionAuthMethod":"{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
    "connectionDeviceGenerationId":"636930642531278483",
    "enqueuedTime":"2019-05-10T06:06:32.7220000Z"
  },"Body":"eyJkZXZpY2VJZCI6IkNvbnRvc28tVGVzdC1EZXZpY2UiLCJ0ZW1wZXJhdHVyZSI6MjkuMjMyMDE2ODQ4MDQyNjE1LCJodW1pZGl0eSI6NjQuMzA1MzQ5NjkyODQ0NDg3LCJwb2ludEluZm8iOiJUaGlzIGlzIGEgc3RvcmFnZSBtZXNzYWdlLiJ9"
}
```

## Clean up resources

To remove all of the resources you created in both parts of this tutorial, delete the resource group. This action deletes all resources contained within the group. If you don't want to delete the entire resource group, you can select individual resources within to delete.

# [Azure portal](#tab/portal)

1. In the Azure portal, navigate to the resource group that contains the IoT hub and storage account for this tutorial.
1. Review all the resources that are in the resource group to determine which ones you want to clean up.
   * If you want to delete all the resource, select **Delete resource group**.
   * If you only want to delete certain resource, use the check boxes next to each resource name to select the ones you want to delete. Then select **Delete**.

# [Azure CLI](#tab/cli)

1. Use the [az resource list](/cli/azure/resource#az-resource-list) command to view all the resources in your resource group.

   ```azurecli-interactive
   az resource list --resource-group $resourceGroup --output table
   ```

1. Review all the resources that are in the resource group to determine which ones you want to clean up.

   * If you want to delete all the resources, use the [az group delete](/cli/azure/group#az-group-delete) command.

     ```azurecli-interactive
     az group delete --name $resourceGroup
     ```

   * If you only want to delete certain resources, use the [az resource delete](/cli/azure/resource#az-resource-delete) command. For example:

     ```azurecli-interactive
     az resource delete --resource-group $resourceGroup --name $storageName
     ```

---

## Next steps

In this tutorial, you configured and tested message enrichments for IoT Hub messages as they're routed to an endpoint.

For more information about message enrichments, see [Overview of message enrichments](iot-hub-message-enrichments-overview.md).

To learn more about IoT Hub, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Set up and use metrics and logs with an IoT hub](tutorial-use-metrics-and-diags.md)