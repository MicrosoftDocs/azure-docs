---
title: Configure message routing for Azure IoT Hub using Azure PowerShell | Microsoft Docs
description: Configure message routing for Azure IoT Hub using Azure PowerShell
author: robinsh
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 03/25/2019
ms.author: robinsh
ms.custom: mvc
#Customer intent: As a developer, I want to be able to route messages sent to my IoT hub to different destinations based on properties stored in the message. I want to be able to set up the resources and the routing using Azure PowerShell.
---

# Tutorial: Use Azure PowerShell to configure IoT Hub message routing

[!INCLUDE [iot-hub-include-routing-intro](../../includes/iot-hub-include-routing-intro.md)]

[!INCLUDE [iot-hub-include-routing-create-resources](../../includes/iot-hub-include-routing-create-resources.md)]

## Download the script (optional)

For the second part of this tutorial, you download and run a Visual Studio application to send messages to the IoT Hub. There is a folder in the download that contains the Azure Resource Manager template and parameters file, as well as the Azure CLI and PowerShell scripts. 

If you want to view the finished script, download the [Azure IoT C# Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip). Unzip the master.zip file. The Azure CLI script is in /iot-hub/Tutorials/Routing/SimulatedDevice/resources/ as **iothub_routing_psh.ps1**.

## Create your resources

Start by creating the resources with PowerShell.

### Use PowerShell to create your base resources

There are several resource names that must be globally unique, such as the IoT Hub name and the storage account name. To make this easier, those resource names are appended with a random alphanumeric value called *randomValue*. The randomValue is generated once at the top of the script and appended to the resource names as needed throughout the script. If you don't want it to be random, you can set it to an empty string or to a specific value. 

> [!IMPORTANT]
> The variables set in the initial script are also used by the routing script, so run all of the script in the same Cloud Shell session. If you open a new session to run the script for setting up the routing, several of the variables will be missing values. 
>

Copy and paste the script below into Cloud Shell and press Enter. It runs the script one line at a time. This first section of the script will create the base resources for this tutorial, including the storage account, IoT Hub, Service Bus Namespace, and Service Bus queue. As you go through the tutorial, copy each block of script and paste it into Cloud Shell to run it.

```azurepowershell-interactive
# This command retrieves the subscription id of the current Azure account.
# This field is used when setting up the routing rules.
$subscriptionID = (Get-AzContext).Subscription.Id

# Concatenate this number onto the resources that have to be globally unique.
# You can set this to "" or to a specific value if you don't want it to be random.
# This retrieves the first 6 digits of a random value.
$randomValue = "$(Get-Random)".Substring(0,6)

# Set the values for the resource names that don't have to be globally unique.
$location = "West US"
$resourceGroup = "ContosoResources"
$iotHubConsumerGroup = "ContosoConsumers"
$containerName = "contosoresults"

# Create the resource group to be used 
#   for all resources for this tutorial.
New-AzResourceGroup -Name $resourceGroup -Location $location

# The IoT hub name must be globally unique, 
#   so add a random value to the end.
$iotHubName = "ContosoTestHub" + $randomValue
Write-Host "IoT hub name is " $iotHubName

# Create the IoT hub.
New-AzIotHub -ResourceGroupName $resourceGroup `
    -Name $iotHubName `
    -SkuName "S1" `
    -Location $location `
    -Units 1 

# Add a consumer group to the IoT hub for the 'events' endpoint.
Add-AzIotHubEventHubConsumerGroup -ResourceGroupName $resourceGroup `
  -Name $iotHubName `
  -EventHubConsumerGroupName $iotHubConsumerGroup `
  -EventHubEndpointName "events"

# The storage account name must be globally unique, so add a random value to the end.
$storageAccountName = "contosostorage" + $randomValue
Write-Host "storage account name is " $storageAccountName

# Create the storage account to be used as a routing destination.
# Save the context for the storage account 
#   to be used when creating a container.
$storageAccount = New-AzStorageAccount -ResourceGroupName $resourceGroup `
    -Name $storageAccountName `
    -Location $location `
    -SkuName Standard_LRS `
    -Kind Storage
# Retrieve the connection string from the context. 
$storageConnectionString = $storageAccount.Context.ConnectionString
Write-Host "storage connection string = " $storageConnectionString 

# Create the container in the storage account.
New-AzStorageContainer -Name $containerName `
    -Context $storageAccount.Context

# The Service Bus namespace must be globally unique,
#   so add a random value to the end.
$serviceBusNamespace = "ContosoSBNamespace" + $randomValue
Write-Host "Service Bus namespace is " $serviceBusNamespace

# Create the Service Bus namespace.
New-AzServiceBusNamespace -ResourceGroupName $resourceGroup `
    -Location $location `
    -Name $serviceBusNamespace 

# The Service Bus queue name must be globally unique,
#  so add a random value to the end.
$serviceBusQueueName  = "ContosoSBQueue" + $randomValue
Write-Host "Service Bus queue name is " $serviceBusQueueName 

# Create the Service Bus queue to be used as a routing destination.
New-AzServiceBusQueue -ResourceGroupName $resourceGroup `
    -Namespace $serviceBusNamespace `
    -Name $serviceBusQueueName  `
    -EnablePartitioning $False 
```

### Create a simulated device

[!INCLUDE [iot-hub-include-create-simulated-device-portal](../../includes/iot-hub-include-create-simulated-device-portal.md)]

Now that the base resources are set up, you can configure the message routing.

## Set up message routing

[!INCLUDE [iot-hub-include-create-routing-description](../../includes/iot-hub-include-create-routing-description.md)]

To create a routing endpoint, use [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/Add-AzIotHubRoutingEndpoint). To create the messaging route for the endpoint, use [Add-AzIotHubRoute](/powershell/module/az.iothub/Add-AzIoTHubRoute).

### Route to a storage account 

First, set up the endpoint for the storage account, then create the message route.

[!INCLUDE [iot-hub-include-blob-storage-format](../../includes/iot-hub-include-blob-storage-format.md)]

These variables are set:

**resourceGroup**: There are two occurrences of this field -- set both of them to your resource group.

**name**: This field is the name of the IoT Hub to which the routing will apply.

**endpointName**: This field is the name identifying the endpoint. 

**endpointType**: This field is the type of endpoint. This value must be set to `azurestoragecontainer`, `eventhub`, `servicebusqueue`, or `servicebustopic`. For your purposes here, set it to `azurestoragecontainer`.

**subscriptionID**: This field is set to the subscriptionID for your Azure account.

**storageConnectionString**: This value is retrieved from the storage account set up in the previous script. It is used by the routing to access the storage account.

**containerName**: This field is the name of the container in the storage account to which data will be written.

**Encoding**: Set this field to either `AVRO` or `JSON`. This designates the format of the stored data. The default is AVRO.

**routeName**: This field is the name of the route you are setting up. 

**condition**: This field is the query used to filter for the messages sent to this endpoint. The query condition for the messages being routed to storage is `level="storage"`.

**enabled**: This field defaults to `true`, indicating that the message route should be enabled after created.

Copy this script and paste it into your Cloud Shell window.

```powershell
##### ROUTING FOR STORAGE #####

$endpointName = "ContosoStorageEndpoint"
$endpointType = "azurestoragecontainer"
$routeName = "ContosoStorageRoute"
$condition = 'level="storage"'
```

The next step is to create the routing endpoint for the storage account. You also specify the container in which the results will be stored. The container was created when the storage account was created.

```powershell
# Create the routing endpoint for storage.
# Specify 'AVRO' or 'JSON' for the encoding of the data.
Add-AzIotHubRoutingEndpoint `
  -ResourceGroupName $resourceGroup `
  -Name $iotHubName `
  -EndpointName $endpointName `
  -EndpointType $endpointType `
  -EndpointResourceGroup $resourceGroup `
  -EndpointSubscriptionId $subscriptionId `
  -ConnectionString $storageConnectionString  `
  -ContainerName $containerName `
  -Encoding AVRO
```

Next, create the message route for the storage endpoint. The message route designates where to send the messages that meet the query specification.

```powershell
# Create the route for the storage endpoint.
Add-AzIotHubRoute `
   -ResourceGroupName $resourceGroup `
   -Name $iotHubName `
   -RouteName $routeName `
   -Source DeviceMessages `
   -EndpointName $endpointName `
   -Condition $condition `
   -Enabled 
```

### Route to a Service Bus queue

Now set up the routing for the Service Bus queue. To retrieve the connection string for the Service Bus queue, you must create an authorization rule that has the correct rights defined. The following script creates an authorization rule for the Service Bus queue called `sbauthrule`, and sets the rights to `Listen Manage Send`. Once this authorization rule is set up, you can use it to retrieve the connection string for the queue.

```powershell
##### ROUTING FOR SERVICE BUS QUEUE #####

# Create the authorization rule for the Service Bus queue.
New-AzServiceBusAuthorizationRule `
  -ResourceGroupName $resourceGroup `
  -NamespaceName $serviceBusNamespace `
  -Queue $serviceBusQueueName `
  -Name "sbauthrule" `
  -Rights @("Manage","Listen","Send")
```

Now use the authorization rule to retrieve the Service Bus queue key. This authorization rule will be used to retrieve the connection string later in the script.

```powershell
$sbqkey = Get-AzServiceBusKey `
    -ResourceGroupName $resourceGroup `
    -NamespaceName $serviceBusNamespace `
    -Queue $servicebusQueueName `
    -Name "sbauthrule"
```

Now set up the routing endpoint and the message route for the Service Bus queue. These variables are set:

**endpointName**: This field is the name identifying the endpoint. 

**endpointType**: This field is the type of endpoint. This value must be set to `azurestoragecontainer`, `eventhub`, `servicebusqueue`, or `servicebustopic`. For your purposes here, set it to `servicebusqueue`.

**routeName**: This field is the name of the route you are setting up. 

**condition**: This field is the query used to filter for the messages sent to this endpoint. The query condition for the messages being routed to the Service Bus queue is `level="critical"`.

Here is the Azure PowerShell for the message routing for the Service Bus queue.

```powershell
$endpointName = "ContosoSBQueueEndpoint"
$endpointType = "servicebusqueue"
$routeName = "ContosoSBQueueRoute"
$condition = 'level="critical"'

# Add the routing endpoint, using the connection string property from the key.
Add-AzIotHubRoutingEndpoint `
  -ResourceGroupName $resourceGroup `
  -Name $iotHubName `
  -EndpointName $endpointName `
  -EndpointType $endpointType `
  -EndpointResourceGroup $resourceGroup `
  -EndpointSubscriptionId $subscriptionId `
  -ConnectionString $sbqkey.PrimaryConnectionString

# Set up the message route for the Service Bus queue endpoint.
Add-AzIotHubRoute `
   -ResourceGroupName $resourceGroup `
   -Name $iotHubName `
   -RouteName $routeName `
   -Source DeviceMessages `
   -EndpointName $endpointName `
   -Condition $condition `
   -Enabled 
```

### View message routing in the portal

[!INCLUDE [iot-hub-include-view-routing-in-portal](../../includes/iot-hub-include-view-routing-in-portal.md)]

## Next steps

Now that you have the resources set up and the message routes configured, advance to the next tutorial to learn how to send messages to the IoT hub and see them be routed to the different destinations. 

> [!div class="nextstepaction"]
> [Part 2 - View the message routing results](tutorial-routing-view-message-routing-results.md)