---
title: Tutorial - Use Azure IoT Hub message enrichments
description: Tutorial showing how to use message enrichments for Azure IoT Hub messages
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 12/20/2019
ms.author: robinsh
ms.custom: mqtt
# intent: As a customer using Azure IoT Hub, I want to add information to the messages that come through my IoT hub and are sent to another endpoint. For example, I'd like to pass the IoT hub name to the application that reads the messages from the final endpoint, such as Azure Storage.
---
# Tutorial: Use Azure IoT Hub message enrichments

*Message enrichments* describes the ability of Azure IoT Hub to *stamp* messages with additional information before the messages are sent to the designated endpoint. One reason to use message enrichments is to include data that can be used to simplify downstream processing. For example, enriching device telemetry messages with a device twin tag can reduce load on customers to make device twin API calls for this information. For more information, see [Overview of message enrichments](iot-hub-message-enrichments-overview.md).

In this tutorial, you see two ways to create and configure the resources that are needed to test the message enrichments for an IoT hub. The resources include one storage account with two storage containers. One container holds the enriched messages, and another container holds the original messages. Also included is an IoT hub to receive the messages and route them to the appropriate storage container based on whether they're enriched or not.

* The first method is to use the Azure CLI to create the resources and configure the message routing. Then you define the enrichments manually by using the [Azure portal](https://portal.azure.com).

* The second method is to use an Azure Resource Manager template to create both the resources *and* the configurations for the message routing and message enrichments.

After the configurations for the message routing and message enrichments are finished, you use an application to send messages to the IoT hub. The hub then routes them to both storage containers. Only the messages sent to the endpoint for the **enriched** storage container are enriched.

Here are the tasks you perform to complete this tutorial:

**Use IoT Hub message enrichments**
> [!div class="checklist"]
> * First method: Create resources and configure message routing by using the Azure CLI. Configure the message enrichments manually by using the [Azure portal](https://portal.azure.com).
> * Second method: Create resources and configure message routing and message enrichments by using a Resource Manager template. 
> * Run an app that simulates an IoT device sending messages to the hub.
> * View the results, and verify that the message enrichments are working as expected.

## Prerequisites

* You must have an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Install [Visual Studio](https://www.visualstudio.com/).

* Make sure that port 8883 is open in your firewall. The device sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).


[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Retrieve the IoT C# samples repository

Download the [IoT C# samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip) from GitHub and unzip them. This repository has several applications, scripts, and Resource Manager templates in it. The ones to be used for this tutorial are as follows:

* For the manual method, there's a CLI script that's used to create the resources. This script is in /azure-iot-samples-csharp/iot-hub/Tutorials/Routing/SimulatedDevice/resources/iothub_msgenrichment_cli.azcli. This script creates the resources and configures the message routing. After you run this script, create the message enrichments manually by using the [Azure portal](https://portal.azure.com).
* For the automated method, there's an Azure Resource Manager template. The template is in /azure-iot-samples-csharp/iot-hub/Tutorials/Routing/SimulatedDevice/resources/template_msgenrichments.json. This template creates the resources, configures the message routing, and then configures the message enrichments.
* The third application you use is the Device Simulation app, which you use to send messages to the IoT hub and test the message enrichments.

## Manually set up and configure by using the Azure CLI

In addition to creating the necessary resources, the Azure CLI script also configures the two routes to the endpoints that are separate storage containers. For more information on how to configure the message routing, see the [Routing tutorial](tutorial-routing.md). After the resources are set up, use the [Azure portal](https://portal.azure.com) to configure message enrichments for each endpoint. Then continue on to the testing step.

> [!NOTE]
> All messages are routed to both endpoints, but only the messages going to the endpoint with configured message enrichments will be enriched.
>

You can use the script that follows, or you can open the script in the /resources folder of the downloaded repository. The script performs the following steps:

* Create an IoT hub.
* Create a storage account.
* Create two containers in the storage account. One container is for the enriched messages, and another container is for messages that aren't enriched.
* Set up routing for the two different storage accounts:
    * Create an endpoint for each storage account container.
    * Create a route to each of the storage account container endpoints.

There are several resource names that must be globally unique, such as the IoT hub name and the storage account name. To make running the script easier, those resource names are appended with a random alphanumeric value called *randomValue*. The random value is generated once at the top of the script. It's appended to the resource names as needed throughout the script. If you don't want the value to be random, you can set it to an empty string or to a specific value.

If you haven't already done so, open an Azure [Cloud Shell window](https://shell.azure.com) and ensure that it's set to Bash. Open the script in the unzipped repository, select Ctrl+A to select all of it, and then select Ctrl+C to copy it. Alternatively, you can copy the following CLI script or open it directly in Cloud Shell. Paste the script in the Cloud Shell window by right-clicking the command line and selecting **Paste**. The script runs one statement at a time. After the script stops running, select **Enter** to make sure it runs the last command. The following code block shows the script that's used, with comments that explain what it's doing.

Here are the resources created by the script. *Enriched* means that the resource is for messages with enrichments. *Original* means that the resource is for messages that aren't enriched.

| Name | Value |
|-----|-----|
| resourceGroup | ContosoResourcesMsgEn |
| container name | original  |
| container name | enriched  |
| IoT device name | Contoso-Test-Device |
| IoT Hub name | ContosoTestHubMsgEn |
| storage Account Name | contosostorage |
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

# This command installs the IOT Extension for Azure CLI.
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

### Manually configure the message enrichments by using the Azure portal

1. Go to your IoT hub by selecting **Resource groups**. Then select the resource group set up for this tutorial (**ContosoResourcesMsgEn**). Find the IoT hub in the list, and select it. Select **Message routing** for the IoT hub.

   ![Select message routing](./media/tutorial-message-enrichments/select-iot-hub.png)

   The message routing pane has three tabs labeled **Routes**, **Custom endpoints**, and **Enrich messages**. Browse the first two tabs to see the configuration set up by the script. Use the third tab to add message enrichments. Let's enrich messages going to the endpoint for the storage container called **enriched**. Fill in the name and value, and then select the endpoint **ContosoStorageEndpointEnriched** from the drop-down list. Here's an example of how to set up an enrichment that adds the IoT hub name to the message:

   ![Add first enrichment](./media/tutorial-message-enrichments/add-message-enrichments.png)

2. Add these values to the list for the ContosoStorageEndpointEnriched endpoint.

   | Key | Value | Endpoint (drop-down list) |
   | ---- | ----- | -------------------------|
   | myIotHub | $iothubname | AzureStorageContainers > ContosoStorageEndpointEnriched |
   | DeviceLocation | $twin.tags.location | AzureStorageContainers > ContosoStorageEndpointEnriched |
   |customerID | 6ce345b8-1e4a-411e-9398-d34587459a3a | AzureStorageContainers > ContosoStorageEndpointEnriched |

   > [!NOTE]
   > If your device doesn't have a twin, the value you put in here will be stamped as a string for the value in the message enrichments. To see the device twin information, go to your hub in the portal and select **IoT devices**. Select your device, and then select **Device twin** at the top of the page.
   >
   > You can edit the twin information to add tags, such as location, and set it to a specific value. For more information, see [Understand and use device twins in IoT Hub](iot-hub-devguide-device-twins.md).

3. When you're finished, your pane should look similar to this image:

   ![Table with all enrichments added](./media/tutorial-message-enrichments/all-message-enrichments.png)

4. Select **Apply** to save the changes. Skip to the [Test message enrichments](#test-message-enrichments) section.

## Create and configure by using a Resource Manager template
You can use a Resource Manager template to create and configure the resources, message routing, and message enrichments.

1. Sign in to the Azure portal. Select **+ Create a Resource** to bring up a search box. Enter *template deployment*, and search for it. In the results pane, select **Template deployment (deploy using custom template)**.

   ![Template deployment in the Azure portal](./media/tutorial-message-enrichments/template-select-deployment.png)

1. Select **Create** in the **Template deployment** pane.

1. In the **Custom deployment** pane, select **Build your own template in the editor**.

1. In the **Edit template** pane, select **Load file**. Windows Explorer appears. Locate the **template_messageenrichments.json** file in the unzipped repo file in **/iot-hub/Tutorials/Routing/SimulatedDevice/resources**. 

   ![Select template from local machine](./media/tutorial-message-enrichments/template-select.png)

1. Select **Open** to load the template file from the local machine. It loads and appears in the edit pane.

   This template is set up to use a globally unique IoT hub name and storage account name by adding a random value to the end of the default names, so you can use the template without making any changes to it.

   Here are the resources created by loading the template. **Enriched** means that the resource is for messages with enrichments. **Original** means that the resource is for messages that aren't enriched. These are the same values used in the Azure CLI script.

   | Name | Value |
   |-----|-----|
   | resourceGroup | ContosoResourcesMsgEn |
   | container name | original  |
   | container name | enriched  |
   | IoT device name | Contoso-Test-Device |
   | IoT Hub name | ContosoTestHubMsgEn |
   | storage Account Name | contosostorage |
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

1. Wait for the template to be fully deployed. Select the bell icon at the top of the screen to check on the progress. When it's finished, continue to the [Test message enrichments](#test-message-enrichments) section.

## Test message enrichments

To view the message enrichments, select **Resource groups**. Then select the resource group you're using for this tutorial. Select the IoT hub from the list of resources, and go to **Messaging**. The message routing configuration and the configured enrichments appear.

Now that the message enrichments are configured for the endpoint, run the Simulated Device application to send messages to the IoT hub. The hub was set up with settings that accomplish the following tasks:

* Messages routed to the storage endpoint ContosoStorageEndpointOriginal won't be enriched and will be stored in the storage container `original`.

* Messages routed to the storage endpoint ContosoStorageEndpointEnriched will be enriched and stored in the storage container `enriched`.

The Simulated Device application is one of the applications in the unzipped download. The application sends messages for each of the different message routing methods in the [Routing tutorial](tutorial-routing.md), which includes Azure Storage.

Double-click the solution file **IoT_SimulatedDevice.sln** to open the code in Visual Studio, and then open **Program.cs**. Substitute the IoT hub name for the marker `{your hub name}`. The format of the IoT hub host name is **{your hub name}.azure-devices.net**. For this tutorial, the hub host name is ContosoTestHubMsgEn.azure-devices.net. Next, substitute the device key you saved earlier when you ran the script to create the resources for the marker `{your device key}`.

If you don't have the device key, you can retrieve it from the portal. After you sign in, go to **Resource groups**, select your resource group, and then select your IoT hub. Look under **IoT Devices** for your test device, and select your device. Select the copy icon next to **Primary key** to copy it to the clipboard.

   ```csharp
        private readonly static string s_myDeviceId = "Contoso-Test-Device";
        private readonly static string s_iotHubUri = "ContosoTestHubMsgEn.azure-devices.net";
        // This is the primary key for the device. This is in the portal.
        // Find your IoT hub in the portal > IoT devices > select your device > copy the key.
        private readonly static string s_deviceKey = "{your device key}";
   ```

### Run and test

Run the console application for a few minutes. The messages that are being sent are displayed on the console screen of the application.

The app sends a new device-to-cloud message to the IoT hub every second. The message contains a JSON-serialized object with the device ID, temperature, humidity, and message level, which defaults to `normal`. It randomly assigns a level of `critical` or `storage`, which causes the message to be routed to the storage account or to the default endpoint. The messages sent to the **enriched** container in the storage account will be enriched.

After several storage messages are sent, view the data.

1. Select **Resource groups**. Find your resource group, **ContosoResourcesMsgEn**, and select it.

2. Select your storage account, which is **contosostorage**. Then select **Storage Explorer (preview)** in the left pane.

   ![Select Storage Explorer](./media/tutorial-message-enrichments/select-storage-explorer.png)

   Select **BLOB CONTAINERS** to see the two containers that can be used.

   ![See the containers in the storage account](./media/tutorial-message-enrichments/show-blob-containers.png)

The messages in the container called **enriched** have the message enrichments included in the messages. The messages in the container called **original** have the raw messages with no enrichments. Drill down into one of the containers until you get to the bottom, and open the most recent message file. Then do the same for the other container to verify that there are no enrichments added to messages in that container.

When you look at messages that have been enriched, you should see "my IoT Hub" with the hub name and the location and the customer ID, like this:

```json
{"EnqueuedTimeUtc":"2019-05-10T06:06:32.7220000Z","Properties":{"level":"storage","my IoT Hub":"contosotesthubmsgen3276","devicelocation":"$twin.tags.location","customerID":"6ce345b8-1e4a-411e-9398-d34587459a3a"},"SystemProperties":{"connectionDeviceId":"Contoso-Test-Device","connectionAuthMethod":"{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}","connectionDeviceGenerationId":"636930642531278483","enqueuedTime":"2019-05-10T06:06:32.7220000Z"},"Body":"eyJkZXZpY2VJZCI6IkNvbnRvc28tVGVzdC1EZXZpY2UiLCJ0ZW1wZXJhdHVyZSI6MjkuMjMyMDE2ODQ4MDQyNjE1LCJodW1pZGl0eSI6NjQuMzA1MzQ5NjkyODQ0NDg3LCJwb2ludEluZm8iOiJUaGlzIGlzIGEgc3RvcmFnZSBtZXNzYWdlLiJ9"}
```

Here's an unenriched message. Notice that "my IoT Hub," "devicelocation," and "customerID" don't show up here because these fields are added by the enrichments. This endpoint has no enrichments.

```json
{"EnqueuedTimeUtc":"2019-05-10T06:06:32.7220000Z","Properties":{"level":"storage"},"SystemProperties":{"connectionDeviceId":"Contoso-Test-Device","connectionAuthMethod":"{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}","connectionDeviceGenerationId":"636930642531278483","enqueuedTime":"2019-05-10T06:06:32.7220000Z"},"Body":"eyJkZXZpY2VJZCI6IkNvbnRvc28tVGVzdC1EZXZpY2UiLCJ0ZW1wZXJhdHVyZSI6MjkuMjMyMDE2ODQ4MDQyNjE1LCJodW1pZGl0eSI6NjQuMzA1MzQ5NjkyODQ0NDg3LCJwb2ludEluZm8iOiJUaGlzIGlzIGEgc3RvcmFnZSBtZXNzYWdlLiJ9"}
```

## Clean up resources

To remove all of the resources you created in this tutorial, delete the resource group. This action deletes all resources contained within the group. In this case, it removes the IoT hub, the storage account, and the resource group itself.

### Use the Azure CLI to clean up resources

To remove the resource group, use the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete) command. Recall that `$resourceGroup` was set to **ContosoResourcesMsgEn** at the beginning of this tutorial.

```azurecli-interactive
az group delete --name $resourceGroup
```

## Next steps

In this tutorial, you configured and tested adding message enrichments to IoT Hub messages by using the following steps:

**Use IoT Hub message enrichments**
> [!div class="checklist"]
> * First method: Create resources and configure message routing by using the Azure CLI. Configure the message enrichments manually by using the [Azure portal](https://portal.azure.com).
> * Second method: Create resources and configure message routing and message enrichments by using an Azure Resource Manager template.
> * Run an app that simulates an IoT device sending messages to the hub.
> * View the results, and verify that the message enrichments are working as expected.

For more information about message enrichments, see [Overview of message enrichments](iot-hub-message-enrichments-overview.md).

For more information about message routing, see these articles:

* [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](iot-hub-devguide-messages-d2c.md)
* [Tutorial: IoT Hub routing](tutorial-routing.md)
