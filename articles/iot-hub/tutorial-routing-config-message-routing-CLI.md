---
title: Configure message routing for Azure IoT Hub using the Azure CLI
description: Configure message routing for Azure IoT Hub using the Azure CLI. Depending on properties in the message, route to either a storage account or a Service Bus queue.
author: robinsh
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 03/25/2019
ms.author: robinsh
ms.custom: mvc
#Customer intent: As a developer, I want to be able to route messages sent to my IoT hub to different destinations based on properties stored in the message. I want to be able to set up the resource and the routing using the Azure CLI.
---

# Tutorial: Use the Azure CLI to configure IoT Hub message routing

[!INCLUDE [iot-hub-include-routing-intro](../../includes/iot-hub-include-routing-intro.md)]

[!INCLUDE [iot-hub-include-routing-create-resources](../../includes/iot-hub-include-routing-create-resources.md)]

## Download the script (optional)

For the second part of this tutorial, you download and run a Visual Studio application to send messages to the IoT Hub. There is a folder in the download that contains the Azure Resource Manager template and parameters file, as well as the Azure CLI and PowerShell scripts.

If you want to view the finished script, download the [Azure IoT C# Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip). Unzip the master.zip file. The Azure CLI script is in /iot-hub/Tutorials/Routing/SimulatedDevice/resources/ as **iothub_routing_cli.azcli**.

## Use the Azure CLI to create your resources

Copy and paste the script below into Cloud Shell and press Enter. It runs the script one line at a time. This first section of the script will create the base resources for this tutorial, including the storage account, IoT Hub, Service Bus Namespace, and Service Bus queue. As you go through the rest of the tutorial, copy each block of script and paste it into Cloud Shell to run it.

> [!TIP]
> A tip about debugging: this script uses the continuation symbol (the backslash `\`) to make the script more readable. If you have a problem running the script, make sure your Cloud Shell session is running `bash` and that there are no spaces after any of the backslashes.
> 

There are several resource names that must be globally unique, such as the IoT Hub name and the storage account name. To make this easier, those resource names are appended with a random alphanumeric value called *randomValue*. The randomValue is generated once at the top of the script and appended to the resource names as needed throughout the script. If you don't want it to be random, you can set it to an empty string or to a specific value. 

> [!IMPORTANT]
> The variables set in the initial script are also used by the routing script, so run all of the script in the same Cloud Shell session. If you open a new session to run the script for setting up the routing, several of the variables will be missing values.
>

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
location=westus
resourceGroup=ContosoResources
iotHubConsumerGroup=ContosoConsumers
containerName=contosoresults
iotDeviceName=Contoso-Test-Device

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

# Create the IoT device identity to be used for testing.
az iot hub device-identity create --device-id $iotDeviceName \
    --hub-name $iotHubName

# Retrieve the information about the device identity, then copy the primary key to
#   Notepad. You need this to run the device simulation during the testing phase.
az iot hub device-identity show --device-id $iotDeviceName \
    --hub-name $iotHubName
```

Now that the base resources are set up, you can configure the message routing.

## Set up message routing

[!INCLUDE [iot-hub-include-create-routing-description](../../includes/iot-hub-include-create-routing-description.md)]

To create a routing endpoint, use [az iot hub routing-endpoint create](/cli/azure/iot/hub/routing-endpoint?view=azure-cli-latest#az-iot-hub-routing-endpoint-create). To create the message route for the endpoint, use [az iot hub route create](/cli/azure/iot/hub/route?view=azure-cli-latest#az-iot-hub-route-create).

### Route to a storage account

[!INCLUDE [iot-hub-include-blob-storage-format](../../includes/iot-hub-include-blob-storage-format.md)]

First, set up the endpoint for the storage account, then set up the route. 

These are the variables used by the script that must be set within your Cloud Shell session:

**storageConnectionString**: This value is retrieved from the storage account set up in the previous script. It is used by the message routing to access the storage account.

  **resourceGroup**: There are two occurrences of resource group -- set them to your resource group.

**endpoint subscriptionID**: This field is set to the Azure subscriptionID for the endpoint. 

**endpointType**: This field is the type of endpoint. This value must be set to `azurestoragecontainer`, `eventhub`, `servicebusqueue`, or `servicebustopic`. For your purposes here, set it to `azurestoragecontainer`.

**iotHubName**: This field is the name of the hub that will do the routing.

**containerName**: This field is the name of the container in the storage account to which data will be written.

**encoding**: This field will be either `avro` or `json`. This denotes the format of the stored data.

**routeName**: This field is the name of the route you are setting up. 

**endpointName**: This field is the name identifying the endpoint. 

**enabled**: This field defaults to `true`, indicating that the message route should be enabled after being created.

**condition**: This field is the query used to filter for the messages sent to this endpoint. The query condition for the messages being routed to storage is `level="storage"`.

Copy this script and paste it into your Cloud Shell window and run it.

```azurecli
##### ROUTING FOR STORAGE ##### 

endpointName="ContosoStorageEndpoint"
endpointType="azurestoragecontainer"
routeName="ContosoStorageRoute"
condition='level="storage"'

# Get the connection string for the storage account.
# Adding the "-o tsv" makes it be returned without the default double quotes around it.
storageConnectionString=$(az storage account show-connection-string \
  --name $storageAccountName --query connectionString -o tsv)
```

The next step is to create the routing endpoint for the storage account. You also specify the container in which the results will be stored. The container was created previously when the storage account was created.

```azurecli
# Create the routing endpoint for storage.
az iot hub routing-endpoint create \
  --connection-string $storageConnectionString \
  --endpoint-name $endpointName \
  --endpoint-resource-group $resourceGroup \
  --endpoint-subscription-id $subscriptionID \
  --endpoint-type $endpointType \
  --hub-name $iotHubName \
  --container $containerName \
  --resource-group $resourceGroup \
  --encoding avro
```

Next, create the route for the storage endpoint. The message route designates where to send the messages that meet the query specification. 

```azurecli
# Create the route for the storage endpoint.
az iot hub route create \
  --name $routeName \
  --hub-name $iotHubName \
  --source devicemessages \
  --resource-group $resourceGroup \
  --endpoint-name $endpointName \
  --enabled \
  --condition $condition
```

### Route to a Service Bus queue

Now set up the routing for the Service Bus queue. To retrieve the connection string for the Service Bus queue, you must create an authorization rule that has the correct rights defined. The following script creates an authorization rule for the Service Bus queue called `sbauthrule`, and sets the rights to `Listen Manage Send`. Once this authorization rule is defined, you can use it to retrieve the connection string for the queue.

```azurecli
# Create the authorization rule for the Service Bus queue.
az servicebus queue authorization-rule create \
  --name "sbauthrule" \
  --namespace-name $sbNamespace \
  --queue-name $sbQueueName \
  --resource-group $resourceGroup \
  --rights Listen Manage Send \
  --subscription $subscriptionID
```

Now use the authorization rule to retrieve the connection string to the Service Bus queue.

```azurecli
# Get the Service Bus queue connection string.
# The "-o tsv" ensures it is returned without the default double-quotes.
sbqConnectionString=$(az servicebus queue authorization-rule keys list \
  --name "sbauthrule" \
  --namespace-name $sbNamespace \
  --queue-name $sbQueueName \
  --resource-group $resourceGroup \
  --subscription $subscriptionID \
  --query primaryConnectionString -o tsv)

# Show the Service Bus queue connection string.
echo "service bus queue connection string = " $sbqConnectionString
```

Now set up the routing endpoint and the message route for the Service Bus queue. These are the variables used by the script that must be set within your Cloud Shell session:

**endpointName**: This field is the name identifying the endpoint. 

**endpointType**: This field is the type of endpoint. This value must be set to `azurestoragecontainer`, `eventhub`, `servicebusqueue`, or `servicebustopic`. For your purposes here, set it to `servicebusqueue`.

**routeName**: This field is the name of the route you are setting up. 

**condition**: This field is the query used to filter for the messages sent to this endpoint. The query condition for the messages being routed to the Service Bus queue is `level="critical"`.

Here is the Azure CLI for the routing endpoint and the message route for the Service Bus queue.

```azurecli
endpointName="ContosoSBQueueEndpoint"
endpointType="ServiceBusQueue"
routeName="ContosoSBQueueRoute"
condition='level="critical"'

# Set up the routing endpoint for the Service Bus queue.
# This uses the Service Bus queue connection string.
az iot hub routing-endpoint create \
  --connection-string $sbqConnectionString \
  --endpoint-name $endpointName \
  --endpoint-resource-group $resourceGroup \
  --endpoint-subscription-id $subscriptionID \
  --endpoint-type $endpointType \
  --hub-name $iotHubName \
  --resource-group $resourceGroup 

# Set up the message route for the Service Bus queue endpoint.
az iot hub route create --name $routeName \
  --hub-name $iotHubName \
  --source-type devicemessages \
  --resource-group $resourceGroup \
  --endpoint-name $endpointName \
  --enabled \
  --condition $condition
  ```

### View message routing in the portal

[!INCLUDE [iot-hub-include-view-routing-in-portal](../../includes/iot-hub-include-view-routing-in-portal.md)]

## Next steps

Now that you have the resources set up and the message routes configured, advance to the next tutorial to learn how to send messages to the IoT hub and see them be routed to the different destinations. 

> [!div class="nextstepaction"]
> [Part 2 - View the message routing results](tutorial-routing-view-message-routing-results.md)
