---
title: Message routing with IoT Hub — PowerShell | Microsoft Docs
description: A how-to article that creates and deletes routes and endpoints in IoT Hub, using PowerShell.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 11/11/2022
ms.author: kgremban
---

# Create and delete routes and endpoints by using PowerShell

This article shows you how to create a route and endpoint in your hub in Azure IoT Hub and then delete your route and endpoint. Learn how to use Azure PowerShell to create routes and endpoints to Azure Event Hubs, Azure Service Bus queues and topics, and Azure Storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](/azure/iot-hub/iot-hub-devguide-messages-d2c). To walk through setting up a route that sends messages to storage and then testing on a simulated device, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

The procedures that are described in the article use the following prerequisites:

* Azure PowerShell
* An IoT hub
* An endpoint service

### Azure PowerShell

To use PowerShell locally, install the [Azure PowerShell module](/powershell/azure/install-az-ps) on your computer. Alternatively, to use Azure PowerShell in a web browser, enable [Azure Cloud Shell](/azure/cloud-shell/overview).

### IoT Hub and an endpoint service

You need an IoT hub created with Azure IoT Hub and at least one other service to serve as an endpoint to your IoT hub route. You can choose which Azure service (Event Hubs, a Service Bus queue or topic, or Azure Storage) you use for an endpoint to connect with your IoT hub route.

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).  If you don't have a hub yet, complete the steps to [create an IoT hub by using the New-AzIotHub PowerShell cmdlet](/azure/iot-hub/iot-hub-create-using-powershell).

* (Optional) An Event Hubs resource (namespace and entity). If you need to create a new Event Hubs resource, see  [Quickstart: Create an event hub by using Azure PowerShell](/azure/event-hubs/event-hubs-quickstart-powershell).

* (Optional) A Service Bus queue resource. If you need to create a new Service Bus queue, see [Use Azure PowerShell to create a Service Bus namespace and queue](/azure/service-bus-messaging/service-bus-quickstart-powershell).

* (Optional) A Service Bus topic resource. If you need to create a new Service Bus topic, see the [New-AzServiceBusTopic](/powershell/module/az.servicebus/new-azservicebustopic) reference and the [Azure Service Bus messaging](/azure/service-bus-messaging/) documentation.

* (Optional) An Azure Storage resource. If you need to create a new storage account in Azure, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-powershell).

## Create, update, and remove endpoints and routes

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint where the messages or events end up, and a data source where the messages or events originate. You choose these locations when you create a new route in your IoT hub. Then, you use routing queries to filter messages or events before they go to the endpoint.

You can use an event hubs, a Service Bus queue or topic, or an Azure storage account to be the endpoint for your IoT hub route. The service that you use for your endpoint must first exist in your Azure account.

> [!NOTE]
> If you're using a local version of PowerShell, [sign in to Azure PowerShell](/powershell/azure/authenticate-azureps) before you begin.
>

# [Event Hubs](#tab/eventhubs)

The commands in the following procedures use these references:

* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.EventHub](/powershell/module/az.eventhub/)

### Create an event hub

To create a new Event Hubs resource that has an authorization rule:

1. Create a new Event Hubs namespace. For `NamespaceName`, use a unique value.

   ```powershell
   New-AzEventHubNamespace -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -Location MyLocation
   ```

1. Create your new Event Hubs entity. For `Name`, use a unique value. For `NamespaceName`, use the namespace name you created in the preceding step.

   ```powershell
   New-AzEventHub -Name MyEventHub -NamespaceName MyNamespace -ResourceGroupName MyResourceGroup
   ```

1. Create a new authorization rule. For `Name`, use the name of your entity for `EventHubName`. For the name of your authorization rule, use a unique value.

   ```powershell
   New-AzEventHubAuthorizationRule -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -EventHubName MyEventHub -Name MyAuthRule -Rights @('Manage', 'Send', 'Listen')
   ```

   For more information about access, see [Authorize access to Azure Event Hubs](/azure/event-hubs/authorize-access-event-hubs).

### Create an event hub endpoint

1. Get the primary connection string from your event hub. Copy the connection string to use later.

   ```powershell
   Get-AzEventHubKey -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -EventHubName MyEventHub -Name MyAuthRule
   ```

1. Create a new IoT hub endpoint to Event Hubs. Use your primary connection string from the preceding step. The value for `EndpointType` must be `EventHub`. For all other parameters, use the values for your scenario.

   ```powershell
   Add-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -EndpointType EventHub -EndpointResourceGroup MyResourceGroup -EndpointSubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ConnectionString "Endpoint=<my connection string>"
   ```

   To see all routing endpoint options, see [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/add-aziothubroutingendpoint).

# [Service Bus queue](#tab/servicebusqueue)

The commands in the following procedures use these references:

* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.ServiceBus](/powershell/module/az.servicebus/)

### Create a Service Bus namespace and queue

To create a new [Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) queue resource:

1. Create a new Service Bus namespace. For `Name`, use a unique value.

   ```powershell
   New-AzServiceBusNamespace -ResourceGroupName MyResourceGroup -Name MyNamespace -Location MyRegion
   ```

1. Create a new Service Bus queue. Use the value for `NamespaceName` you created in the preceding step. For the name of your queue, use a unique value.

   ```powershell
   New-AzServiceBusQueue -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -Name MyQueue
   ```

### Create a Service Bus queue endpoint

To create a new Service Bus queue endpoint:

1. Retrieve the primary connection string from your Service Bus namespace. Copy the connection string to use later.

   ```powershell
   Get-AzServiceBusKey -ResourceGroupName MyResourceGroup -Namespace MyNamespace -Name RootManageSharedAccessKey
   ```

1. Create a new IoT hub endpoint to your Service Bus queue. Use your primary connection string from the preceding step with `;EntityPath=MyServiceBusQueue` added to the end. The value for `EndpointType` must be `ServiceBusQueue`. For all other parameters, use the values for your scenario. For `EndpointName`, use a unique value.

   ```powershell
   Add-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -EndpointType EventHub -EndpointResourceGroup MyResourceGroup -EndpointSubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ConnectionString "Endpoint=my-connection-string;EntityPath=MyServiceBusQueue"
   ```

   To see all routing endpoint options, see [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/add-aziothubroutingendpoint).

# [Service Bus topic](#tab/servicebustopic)

The commands in the following procedures use these references:

* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.ServiceBus](/powershell/module/az.servicebus/)

With [Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) topics, users can subscribe to one or more topics.

To create a Service Bus namespace, topic, and then subscribe to the topic:

### Create a Service Bus namespace, topic, and subscription

1. Create a new Service Bus namespace. For `Name` for your namespace, use a unique value.

   ```powershell
   New-AzServiceBusNamespace -ResourceGroupName MyResourceGroup -Name MyNamespace -Location MyRegion
   ```

1. Create a new Service Bus topic. For the topic name, use a unique value.

   ```powershell
   New-AzServiceBusTopic -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -Name MyTopic
   ```

1. Create a new subscription to your topic. For `TopicName`, use the topic name you created in the preceding step. For your subscription name, use a unique value.

   ```powershell
   New-AzServiceBusSubscription -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -TopicName MyTopic -Name MySubscription
   ```

### Create a Service Bus topic endpoint

1. Retrieve the primary connection string from your Service Bus namespace. Copy the connection string to use later.

   ```powershell
   Get-AzServiceBusKey -ResourceGroupName MyResourceGroup -Namespace MyNamespace -Name RootManageSharedAccessKey
   ```

1. Create a new IoT hub endpoint to your Service Bus topic. Use your primary connection string from the preceding step with `;EntityPath=MyServiceBusTopic` added to the end. The value for `EndpointType` must be `ServiceBusTopic`. For all other parameters, use the values for your scenario. For `EndpointName`, use a unique value.

   ```powershell
   Add-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -EndpointType ServiceBusTopic -EndpointResourceGroup MyResourceGroup -EndpointSubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ConnectionString "Endpoint=<my connection string>;EntityPath=MyServiceBusTopic"
   ```

   To see all routing endpoint options, see [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/add-aziothubroutingendpoint).

# [Azure Storage](#tab/azurestorage)

The commands in the following procedures use these references:

* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.Storage](/powershell/module/az.storage/)

To create an Azure storage endpoint and route, you need an Azure storage account and container.

### Create an Azure Storage account and container

1. Create a new Azure Storage account. Your storage account `Name` must be lowercase and letters or numbers only. For `SkuName` options, see [SkuName](/powershell/module/az.storage/new-azstorageaccount#-skuname).

   ```powershell
   New-AzStorageAccount -ResourceGroupName MyResourceGroup -Name mystorageaccount -Location westus -SkuName Standard_GRS
   ```

1. Create a new container in your storage account. You need to create a context to your storage account in a variable, then add it to the `Context` parameter. For more options when creating a container, see [Manage blob containers using PowerShell](/azure/storage/blobs/blob-containers-powershell). Use a unique `Name` for the name of your container.

   ```powershell
   $ctx = New-AzStorageContext -StorageAccountName mystorageaccount -UseConnectedAccount `
   New-AzStorageContainer -Name ContainerName -Context $ctx
   ```

### Create an Azure Storage endpoint

To create an endpoint to Azure Storage, you need your access key to construct a connection string. The connection string is then a part of the IoT Hub command to create an endpoint.

1. Retrieve your access key from your storage account and copy it.

   ```powershell
   Get-AzStorageAccountKey -ResourceGroupName MyResourceGroup -Name mystorageaccount
   ```

1. Construct a primary connection string for your storage based on this template. Replace `mystorageaccount` (in two places) with the name of your storage account. Replace `mykey` with your key from the previous step. 

   ```powershell
   "DefaultEndpointsProtocol=https;BlobEndpoint=https://mystorageaccount.blob.core.windows.net;AccountName=mystorageaccount;AccountKey=mykey"
   ```

   This connection string is needed for the next step, creating the endpoint. 

1. Create your Azure Storage endpoint with the connection string you constructed. `EndpointType` must have the value `azurestorage`, otherwise all other values should be your own. Use a unique name for `EndpointName`. You'll be prompted for your container name after running this command. Type your container name as input and press **Enter** to complete the endpoint creation.

   ```powershell
   Add-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -EndpointType azurestorage -EndpointResourceGroup MyResourceGroup -EndpointSubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ConnectionString "my connection string"
   ```

---

## Create an IoT Hub route

Finally, with your new endpoint in your IoT hub, you can create a new route.

The default fallback route in IoT Hub collects messages from `DeviceMessages`, so  choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more information on source options, see [Add-AzIotHubRoute](/powershell/module/az.iothub/add-aziothubroute#parameters). The `Enabled` parameter is a switch, so no value needs to follow it.

```powershell
Add-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub -RouteName MyRoute -Source DeviceLifecycleEvents -EndpointName MyEndpoint -Enabled
```

You see a confirmation in your console:

```powershell
RouteName     : MyIotHub 
DataSource    : DeviceLifecycleEvents
EndpointNames : MyEndpoint
Condition     : true
IsEnabled     : True
```

## Update an IoT hub route

To make changes to an existing route, use the following command. Try changing the name of your route.
 
```powershell
Set-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub -RouteName MyRoute
``` 

Use the `Get-AzIotHubRoute` command to confirm the change in your route.

```powershell
Get-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub
```

## Delete an Event Hubs endpoint

```powershell
Remove-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -PassThru
```

## Delete an IoT hub route

```powershell
Remove-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub -RouteName MyRoute -PassThru
```

> [!TIP]
> Deleting a route doesn't delete any endpoints in your Azure account. You must delete an endpoint separately from deleting a route.

## Next steps

In this how-to article you learned how to create a route and endpoint for your Event Hubs, Service Bus queue or topic, and Azure Storage. 

To further your exploration into message routing, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal). In this tutorial, you'll create a storage route and test it with a device in your IoT hub.
