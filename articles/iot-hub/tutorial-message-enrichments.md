---
title: Tutorial - Use Azure IoT Hub message enrichments
description: Tutorial showing how to use message enrichments for Azure IoT Hub messages
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 06/08/2022
ms.author: kgremban
ms.custom: "mqtt, devx-track-azurecli, devx-track-csharp"
# Customer intent: As a customer using Azure IoT Hub, I want to add information to the messages that come through my IoT hub and are sent to another endpoint. For example, I'd like to pass the IoT hub name to the application that reads the messages from the final endpoint, such as Azure Storage.
---
# Tutorial: Use Azure IoT Hub message enrichments

*Message enrichments* are the ability of Azure IoT Hub to stamp messages with additional information before the messages are sent to the designated endpoint. One reason to use message enrichments is to include data that can be used to simplify downstream processing. For example, enriching device messages with a device twin tag can reduce load on customers to make device twin API calls for this information. For more information, see [Overview of message enrichments](iot-hub-message-enrichments-overview.md).

In this tutorial, you see two ways to create and configure the resources that are needed to test the message enrichments for an IoT hub. The resources include one storage account with two storage containers. One container holds the enriched messages, and another container holds the original messages. Also included is an IoT hub to receive the messages and route them to the appropriate storage container based on whether they're enriched or not.

* The first method is to use the Azure CLI to create the resources and configure the message routing. Then you define the message enrichments in the Azure portal.

* The second method is to use an Azure Resource Manager template to create both the resources and configure both the message routing and message enrichments.

After the configurations for the message routing and message enrichments are finished, you use an application to send messages to the IoT hub. The hub then routes them to both storage containers. Only the messages sent to the endpoint for the **enriched** storage container are enriched.

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
>
> * First method: Create resources and configure message routing using the Azure CLI. Configure the message enrichments in the Azure portal.
> * Second method: Create resources and configure message routing and message enrichments using a Resource Manager template.
> * Run an app that simulates an IoT device sending messages to the hub.
> * View the results, and verify that the message enrichments are being applied to the targeted messages.

## Prerequisites

* You must have an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Make sure that port 8883 is open in your firewall. The device sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Retrieve the IoT C# samples repository

Download or clone the [IoT C# samples](https://github.com/Azure-Samples/azure-iot-samples-csharp) from GitHub. Follow the directions in **README.md** to set up the prerequisites for running C# samples.

This repository has several applications, scripts, and Resource Manager templates in it. The ones to be used for this tutorial are as follows:

* For the manual method, there's a CLI script that creates the cloud resources. This script is in `/azure-iot-samples-csharp/iot-hub/Tutorials/Routing/SimulatedDevice/resources/iothub_msgenrichment_cli.azcli`. This script creates the resources and configures the message routing. After you run this script, create the message enrichments manually by using the Azure portal.
* For the automated method, there's an Azure Resource Manager template. The template is in `/azure-iot-samples-csharp/iot-hub/Tutorials/Routing/SimulatedDevice/resources/template_msgenrichments.json`. This template creates the resources, configures the message routing, and then configures the message enrichments.
* The third application you use is the device simulation app, which you use to send messages to the IoT hub and test the message enrichments.

## Create and configure resources using the Azure CLI

In addition to creating the necessary resources, the Azure CLI script also configures the two routes to the endpoints that are separate storage containers. For more information on how to configure message routing, see the [routing tutorial](tutorial-routing.md). After the resources are set up, use the [Azure portal](https://portal.azure.com) to configure message enrichments for each endpoint. Then continue on to the testing step.

> [!NOTE]
> All messages are routed to both endpoints, but only the messages going to the endpoint with configured message enrichments will be enriched.

You can use the script that follows, or you can open the script in the /resources folder of the downloaded repository. The script performs the following steps:

* Create an IoT hub.
* Create a storage account.
* Create two containers in the storage account. One container is for the enriched messages, and another container is for messages that aren't enriched.
* Set up routing for the two different storage containers:
  * Create an endpoint for each storage account container.
  * Create a route to each of the storage account container endpoints.

There are several resource names that must be globally unique, such as the IoT hub name and the storage account name. To make running the script easier, those resource names are appended with a random alphanumeric value called *randomValue*. The random value is generated once at the top of the script. It's appended to the resource names as needed throughout the script. If you don't want the value to be random, you can set it to an empty string or to a specific value.

If you haven't already done so, open an Azure [Cloud Shell window](https://shell.azure.com) and ensure that it's set to Bash. Open the script in the unzipped repository, select Ctrl+A to select all of it, and then select Ctrl+C to copy it. Alternatively, you can copy the following CLI script or open it directly in Cloud Shell. Paste the script in the Cloud Shell window by right-clicking the command line and selecting **Paste**. The script runs one statement at a time. After the script stops running, select **Enter** to make sure it runs the last command. The following code block shows the script that's used, with comments that explain what it's doing.

Here are the resources created by the script. *Enriched* means that the resource is for messages with enrichments. *Original* means that the resource is for messages that aren't enriched.

| Name | Value |
|-----|-----|
| resourceGroup | ContosoResourcesMsgEn |
| IoT device name | Contoso-Test-Device |
| IoT Hub name | ContosoTestHubMsgEn |
| storage Account Name | contosostorage |
| container name 1 | original  |
| container name 2 | enriched  |
| endpoint Name 1 | ContosoStorageEndpointOriginal |
| endpoint Name 2 | ContosoStorageEndpointEnriched|
| route Name 1 | ContosoStorageRouteOriginal |
| route Name 2 | ContosoStorageRouteEnriched |

```azurecli-interactive
# This command retrieves the subscription id of the current Azure account.
# This field is used when setting up the routing queries.
subscriptionID=$(az account show --query id -o tsv)

# Concatenate this number onto the resources that have to be globally unique.
# You can set this to "" or to a specific value if you don't want it to be random.
# This retrieves a random value.
randomValue=$RANDOM

# This command installs the IoT Extension for Azure CLI.
# You only need to install this the first time.
# You need it to create the device identity.
az extension add --name azure-iot

# Set the values for the resource names that
#   don't have to be globally unique.
location=westus2
resourceGroup=ContosoResourcesMsgEn
containerName1=original
containerName2=enriched
iotDeviceName=Contoso-Test-Device

# Create the resource group to be used
#   for all the resources for this tutorial.
az group create --name $resourceGroup \
    --location $location

# The IoT hub name must be globally unique,
#   so add a random value to the end.
iotHubName=ContosoTestHubMsgEn$randomValue
echo "IoT hub name = " $iotHubName

# Create the IoT hub.
az iot hub create --name $iotHubName \
    --resource-group $resourceGroup \
    --sku S1 --location $location

# You need a storage account that will have two containers
#   -- one for the original messages and
#   one for the enriched messages.
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
#    You need this to create the containers.
storageAccountKey=$(az storage account keys list \
    --resource-group $resourceGroup \
    --account-name $storageAccountName \
    --query "[0].value" | tr -d '"')

# See the value of the storage account key.
echo "storage account key = " $storageAccountKey

# Create the containers in the storage account.
az storage container create --name $containerName1 \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --public-access off

az storage container create --name $containerName2 \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --public-access off

# Create the IoT device identity to be used for testing.
az iot hub device-identity create --device-id $iotDeviceName \
    --hub-name $iotHubName

# Retrieve the information about the device identity, then copy the primary key to
#   Notepad. You need this to run the device simulation during the testing phase.
# If you are using Cloud Shell, you can scroll the window back up to retrieve this value.
az iot hub device-identity show --device-id $iotDeviceName \
    --hub-name $iotHubName

##### ROUTING FOR STORAGE #####

# You're going to have two routes and two endpoints.
# One route points to the first container ("original") in the storage account
#   and includes the original messages.
# The other points to the second container ("enriched") in the same storage account
#   and includes the enriched versions of the messages.

endpointType="azurestoragecontainer"
endpointName1="ContosoStorageEndpointOriginal"
endpointName2="ContosoStorageEndpointEnriched"
routeName1="ContosoStorageRouteOriginal"
routeName2="ContosoStorageRouteEnriched"

# for both endpoints, retrieve the messages going to storage
condition='level="storage"'

# Get the connection string for the storage account.
# Adding the "-o tsv" makes it be returned without the default double quotes around it.
storageConnectionString=$(az storage account show-connection-string \
  --name $storageAccountName --query connectionString -o tsv)

# Create the routing endpoints and routes.
# Set the encoding format to either avro or json.

# This is the endpoint for the first container, for endpoint messages that are not enriched.
az iot hub routing-endpoint create \
  --connection-string $storageConnectionString \
  --endpoint-name $endpointName1 \
  --endpoint-resource-group $resourceGroup \
  --endpoint-subscription-id $subscriptionID \
  --endpoint-type $endpointType \
  --hub-name $iotHubName \
  --container $containerName1 \
  --resource-group $resourceGroup \
  --encoding json

# This is the endpoint for the second container, for endpoint messages that are enriched.
az iot hub routing-endpoint create \
  --connection-string $storageConnectionString \
  --endpoint-name $endpointName2 \
  --endpoint-resource-group $resourceGroup \
  --endpoint-subscription-id $subscriptionID \
  --endpoint-type $endpointType \
  --hub-name $iotHubName \
  --container $containerName2 \
  --resource-group $resourceGroup \
  --encoding json

# This is the route for messages that are not enriched.
# Create the route for the first storage endpoint.
az iot hub route create \
  --name $routeName1 \
  --hub-name $iotHubName \
  --source devicemessages \
  --resource-group $resourceGroup \
  --endpoint-name $endpointName1 \
  --enabled \
  --condition $condition

# This is the route for messages that are enriched.
# Create the route for the second storage endpoint.
az iot hub route create \
  --name $routeName2 \
  --hub-name $iotHubName \
  --source devicemessages \
  --resource-group $resourceGroup \
  --endpoint-name $endpointName2 \
  --enabled \
  --condition $condition
```

At this point, the resources are all set up and the message routing is configured. You can view the message routing configuration in the portal and set up the message enrichments for messages going to the **enriched** storage container.

### Configure the message enrichments using the Azure portal

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub by selecting **Resource groups**. Then select the resource group set up for this tutorial (**ContosoResourcesMsgEn**). Find the IoT hub in the list, and select it.

2. Select **Message routing** for the IoT hub.

   :::image type="content" source="./media/tutorial-message-enrichments/select-iot-hub.png" alt-text="Screenshot that shows how to select message routing." border="true":::

   The message routing pane has three tabs labeled **Routes**, **Custom endpoints**, and **Enrich messages**. Browse the first two tabs to see the configuration set up by the script.

3. Select the **Enrich messages** tab to add three message enrichments for the messages going to the endpoint for the storage container called **enriched**.

4. For each message enrichment, fill in the name and value, and then select the endpoint **ContosoStorageEndpointEnriched** from the drop-down list. Here's an example of how to set up an enrichment that adds the IoT hub name to the message:

   ![Add first enrichment](./media/tutorial-message-enrichments/add-message-enrichments.png)

   Add these values to the list for the ContosoStorageEndpointEnriched endpoint:

   | Name | Value | Endpoint |
   | ---- | ----- | -------- |
   | myIotHub | `$iothubname` | ContosoStorageEndpointEnriched |
   | DeviceLocation | `$twin.tags.location` (assumes that the device twin has a location tag) | ContosoStorageEndpointEnriched |
   |customerID | `6ce345b8-1e4a-411e-9398-d34587459a3a` | ContosoStorageEndpointEnriched |

   When you're finished, your pane should look similar to this image:

   ![Table with all enrichments added](./media/tutorial-message-enrichments/all-message-enrichments.png)

5. Select **Apply** to save the changes.

You now have message enrichments set up for all messages routed to the **enriched** endpoint. Skip to the [Test message enrichments](#test-message-enrichments) section to continue the tutorial.

## Create and configure resources using a Resource Manager template

You can use a Resource Manager template to create and configure the resources, message routing, and message enrichments.

1. Sign in to the [Azure portal](https://portal.azure.com). Select **+ Create a Resource** to bring up a search box. Enter *template deployment*, and search for it. In the results pane, select **Template deployment (deploy using custom template)**.

   ![Template deployment in the Azure portal](./media/tutorial-message-enrichments/template-select-deployment.png)

1. Select **Create** in the **Template deployment** pane.

1. In the **Custom deployment** pane, select **Build your own template in the editor**.

1. In the **Edit template** pane, select **Load file**. Windows Explorer appears. Locate the **template_messageenrichments.json** file in the unzipped repo file in the **/iot-hub/Tutorials/Routing/SimulatedDevice/resources** directory.

   ![Select template from local machine](./media/tutorial-message-enrichments/template-select.png)

1. Select **Open** to load the template file from the local machine. It loads and appears in the edit pane.

   This template is set up to use a globally unique IoT hub name and storage account name by adding a random value to the end of the default names, so you can use the template without making any changes to it.

   Here are the resources created by loading the template. **Enriched** means that the resource is for messages with enrichments. **Original** means that the resource is for messages that aren't enriched. These are the same values used in the Azure CLI script.

   | Name | Value |
   |-----|-----|
   | IoT Hub name | ContosoTestHubMsgEn |
   | storage Account Name | contosostorage |
   | container name 1 | original  |
   | container name 2 | enriched  |
   | endpoint Name 1 | ContosoStorageEndpointOriginal |
   | endpoint Name 2 | ContosoStorageEndpointEnriched|
   | route Name 1 | ContosoStorageRouteOriginal |
   | route Name 2 | ContosoStorageRouteEnriched |

1. Select **Save**. The **Custom deployment** pane appears and shows all of the parameters used by the template. The only field you need to set is **Resource group**. Either create a new one or select one from the drop-down list.

   Here's the top half of the **Custom deployment** pane. You can see where you fill in the resource group.

   ![Top half of Custom deployment pane](./media/tutorial-message-enrichments/template-deployment-top.png)

1. Here's the bottom half of the **Custom deployment** pane. You can see the rest of the parameters and the terms and conditions.

   ![Bottom half of Custom deployment pane](./media/tutorial-message-enrichments/template-deployment-bottom.png)

1. Select the check box to agree to the terms and conditions. Then select **Purchase** to continue with the template deployment.

1. Wait for the template to be fully deployed. Select the bell icon at the top of the screen to check on the progress.

### Register a device in the portal

1. Once your resources are deployed, select the IoT hub in your resource group.
1. Select **Devices** from the **Device management** section of the navigation menu.
1. Select **Add Device** to register a new device in your hub.
1. Provide a device ID. The sample application used later in this tutorial defaults to a device named `Contoso-Test-Device`, but you can use any ID. Select **Save**.
1. Once the device is created in your hub, select its name from the list of devices. You may need to refresh the list.
1. Copy the **Primary key** value and have it available to use in the testing section of this article.

## Add location tag to the device twin

One of the message enrichments configured on your IoT hub specifies a key of DeviceLocation with its value determined by the following device twin path: `$twin.tags.location`. If your device twin doesn't have a location tag, the twin path, `$twin.tags.location`, will be stamped as a string for the DeviceLocation value in the message enrichments.

Follow these steps to add a location tag to your device's twin with the portal.

1. Navigate to your IoT hub in the Azure portal.

1. Select **Devices** on the left-pane of the IoT hub, then select your device.

1. Select the **Device twin** tab at the top of the device page and add the following line just before the closing brace at the bottom of the device twin. Then select **Save**.

    ```json
    		, "tags": {"location": "Plant 43"}
    ```
  
    :::image type="content" source="./media/tutorial-message-enrichments/add-location-tag-to-device-twin.png" alt-text="Screenshot of adding location tag to device twin in Azure portal":::

1. Wait about five minutes before continuing to the next section. It can take up to that long for updates to the device twin to be reflected in message enrichment values.

To learn more about how device twin paths are handled with message enrichments, see [Message enrichments limitations](iot-hub-message-enrichments-overview.md#limitations). To learn more about device twins, see [Understand and use device twins in IoT Hub](iot-hub-devguide-device-twins.md).

## Test message enrichments

To view the message enrichments, select **Resource groups**. Then select the resource group you're using for this tutorial. Select the IoT hub from the list of resources, and go to **Messaging**. The message routing configuration and the configured enrichments appear.

Now that the message enrichments are configured for the **enriched** endpoint, run the simulated device application to send messages to the IoT hub. The hub was set up with settings that accomplish the following tasks:

* Messages routed to the storage endpoint ContosoStorageEndpointOriginal won't be enriched and will be stored in the storage container **original**.

* Messages routed to the storage endpoint ContosoStorageEndpointEnriched will be enriched and stored in the storage container **enriched**.

The simulated device application is one of the applications in the azure-iot-samples-csharp repository. The application sends messages with a randomized value for the property `level`. Only messages that have `storage` set as the message's level property will be routed to the two endpoints.

1. Open the file **Program.cs** from the **SimulatedDevice** directory in your preferred code editor.

1. Replace the placeholder text with your own resource information. Substitute the IoT hub name for the marker `{your hub name}`. The format of the IoT hub host name is **{your hub name}.azure-devices.net**. Next, substitute the device key you saved earlier when you ran the script to create the resources for the marker `{your device key}`.

   If you don't have the device key, you can retrieve it from the portal. After you sign in, go to **Resource groups**, select your resource group, and then select your IoT hub. Look under **IoT Devices** for your test device, and select your device. Select the copy icon next to **Primary key** to copy it to the clipboard.

   ```csharp
   private readonly static string s_myDeviceId = "Contoso-Test-Device";
   private readonly static string s_iotHubUri = "{your hub name}.azure-devices.net";
   // This is the primary key for the device. This is in the portal.
   // Find your IoT hub in the portal > IoT devices > select your device > copy the key.
   private readonly static string s_deviceKey = "{your device key}";
   ```

### Run and test

Run the console application for a few minutes.

In a command line window, you can run the sample with the following commands executed at the **SimulatedDevice** directory level:

```console
dotnet restore
dotnet run
```

The app sends a new device-to-cloud message to the IoT hub every second. The messages that are being sent are displayed on the console screen of the application. The message contains a JSON-serialized object with the device ID, temperature, humidity, and message level, which defaults to `normal`. The sample program randomly changes the message level to either `critical` or `storage`. Messages labeled for storage are routed to the storage account, and the rest go to the default endpoint. The messages sent to the **enriched** container in the storage account will be enriched.

After several storage messages are sent, view the data.

1. Select **Resource groups**. Find your resource group, **ContosoResourcesMsgEn**, and select it.

2. Select your storage account, which begins with **contosostorage**. Then select **Storage browser (preview)** from the navigation menu. Select **Blob containers** to see the two containers that you created.

   :::image type="content" source="./media/tutorial-message-enrichments/show-blob-containers.png" alt-text="See the containers in the storage account.":::

The messages in the container called **enriched** have the message enrichments included in the messages. The messages in the container called **original** have the raw messages with no enrichments. Drill down into one of the containers until you get to the bottom, and open the most recent message file. Then do the same for the other container to verify that the one is enriched and one isn't.

When you look at messages that have been enriched, you should see "my IoT Hub" with the hub name and the location and the customer ID, like this:

```json
{
  "EnqueuedTimeUtc":"2019-05-10T06:06:32.7220000Z",
  "Properties":
  {
    "level":"storage",
    "myIotHub":"contosotesthubmsgen3276",
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

Here's an unenriched message. Notice that `my IoT Hub,` `devicelocation,` and `customerID` don't show up here because these fields are added by the enrichments. This endpoint has no enrichments.

```json
{
  "EnqueuedTimeUtc":"2019-05-10T06:06:32.7220000Z",
  "Properties":
  {
    "level":"storage"
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

To remove all of the resources you created in this tutorial, delete the resource group. This action deletes all resources contained within the group. In this case, it removes the IoT hub, the storage account, and the resource group itself.

### Use the Azure CLI to clean up resources

To remove the resource group, use the [az group delete](/cli/azure/group#az-group-delete) command. Recall that `$resourceGroup` was set to **ContosoResourcesMsgEn** at the beginning of this tutorial.

```azurecli-interactive
az group delete --name $resourceGroup
```

## Next steps

In this tutorial, you configured and tested message enrichments for IoT Hub messages as they are routed to an endpoint.

For more information about message enrichments, see [Overview of message enrichments](iot-hub-message-enrichments-overview.md).

To learn more about IoT Hub, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Set up and use metrics and logs with an IoT hub](tutorial-use-metrics-and-diags.md)