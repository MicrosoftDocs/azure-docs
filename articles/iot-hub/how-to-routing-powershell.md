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

# Message routing with IoT Hub — PowerShell

This article shows you how to create a route and endpoint in your IoT hub, then delete your route and endpoint. We use the PowerShell to create routes and endpoints to Event Hubs, Service Bus queue, Service Bus topic, and Azure Storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](/azure/iot-hub/iot-hub-devguide-messages-d2c). To walk through setting up a route that sends messages to storage and testing on a simulated device, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

**Azure PowerShell**

To use PowerShell locally, install the [Azure PowerShell module](/powershell/azure/install-az-ps). Alternatively, to use the Azure PowerShell in a browser enable [Azure Cloud Shell](/azure/cloud-shell/overview).

**IoT Hub and an endpoint service**

You need an IoT hub and at least one other service to serve as an endpoint to an IoT hub route. You can choose which Azure service (Event Hubs, Service Bus queue or topic, or Azure Storage) endpoint that you'd like to connect with your IoT Hub route.

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps in [Create an IoT hub using the New-AzIotHub cmdlet](/azure/iot-hub/iot-hub-create-using-powershell).

* (Optional) An Event Hubs resource (with container). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub using Azure PowerShell](/azure/event-hubs/event-hubs-quickstart-powershell).

* (Optional) A Service Bus queue resource. If you need to create a new Service Bus queue, see [Use Azure PowerShell to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-powershell).

* (Optional) A Service Bus topic resource. If you need to create a new Service Bus topic, see the [New-AzServiceBusTopic](/powershell/module/az.servicebus/new-azservicebustopic) reference and the [Azure Service Bus Messaging](/azure/service-bus-messaging/) documentation.

* (Optional) An Azure Storage resource. If you need to create a new Azure Storage, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-powershell).

## Create, update, or remove endpoints and routes

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint, where the messages or events end up, and a data source, where the messages or events originate. You choose these locations when creating a new route in the IoT Hub. Routing queries are then used to filter messages or events before they go to the endpoint.

You can use Events Hubs, a Service Bus queue or topic, or an Azure storage to be the endpoint for your IoT hub route. The service must first exist in your Azure account.

> [!NOTE]
> If you're using a local version of PowerShell, [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps) before proceeding.
> 

# [Event Hubs](#tab/eventhubs)

References used in the following commands:
* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.EventHub](/powershell/module/az.eventhub/)

### Create an Event hub

Let's create a new Event Hubs resource with an authorization rule.

1. Create a new Event Hubs namespace. Use a unique **NamespaceName**.

   ```powershell
   New-AzEventHubNamespace -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -Location MyLocation
   ```

1. Create your new Event hubs entity. Use a unique **Name**. Use the same **NamespaceName** you created in the previous step.

   ```powershell
   New-AzEventHub -Name MyEventHub -NamespaceName MyNamespace -ResourceGroupName MyResourceGroup
   ```

1. Create a new authorization rule. Use the **Name** of your entity for **EventHubName**. Use a unique **Name** for your authorization rule.

   ```powershell
   New-AzEventHubAuthorizationRule -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -EventHubName MyEventHub -Name MyAuthRule -Rights @('Manage', 'Send', 'Listen')
   ```

   For more information about access, see [Authorize access to Azure Event Hubs](/azure/event-hubs/authorize-access-event-hubs).

### Create an Event Hubs endpoint

1. Retrieve the primary connection string from your Event hub. Copy the connection string for later use.

   ```powershell
   Get-AzEventHubKey -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -EventHubName MyEventHub -Name MyAuthRule
   ```

1. Create a new IoT hub endpoint to Event Hubs. Use your primary connection string from the previous step. The `EndpointType` must be `EventHub`, otherwise all other values should be your own.

   ```powershell
   Add-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -EndpointType EventHub -EndpointResourceGroup MyResourceGroup -EndpointSubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ConnectionString "Endpoint=<my connection string>"
   ```

   To see all routing endpoint options, see [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/add-aziothubroutingendpoint).

# [Service Bus queue](#tab/servicebusqueue)

References used in the following commands:
* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.ServiceBus](/powershell/module/az.servicebus/)

### Create a Service Bus namespace and queue

Let's create a new [Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) queue resource.

1. Create a new Service Bus namespace. Use a unique `Name`.

   ```powershell
   New-AzServiceBusNamespace -ResourceGroupName MyResourceGroup -Name MyNamespace -Location MyRegion
   ```

1. Create a new Service Bus queue. Use the same `NamespaceName` you created in the previous step. Use a unique `Name` for your queue. 

   ```powershell
   New-AzServiceBusQueue -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -Name MyQueue
   ```

### Create a Service Bus queue endpoint

1. Retrieve the primary connection string from your Service Bus namespace. Copy the connection string for later use.

   ```powershell
   Get-AzServiceBusKey -ResourceGroupName MyResourceGroup -Namespace MyNamespace -Name RootManageSharedAccessKey
   ```

1. Create a new IoT hub endpoint to your Service Bus queue. Use your primary connection string from the previous step with `;EntityPath=MyServiceBusQueue` added to the end. The `EndpointType` must be `ServiceBusQueue`, otherwise all other values should be your own. Use a unique name for your `EndpointName`.

   ```powershell
   Add-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -EndpointType EventHub -EndpointResourceGroup MyResourceGroup -EndpointSubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ConnectionString "Endpoint=my-connection-string;EntityPath=MyServiceBusQueue"
   ```

   To see all routing endpoint options, see [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/add-aziothubroutingendpoint).

# [Service Bus topic](#tab/servicebustopic)

References used in the following commands:
* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.ServiceBus](/powershell/module/az.servicebus/)

With [Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) topics, users can subscribe to one or more topics. Let's create a Service Bus namespace, topic, and then subscribe to the topic.

### Create a Service Bus namespace, topic, and subscription

1. Create a new Service Bus namespace. Use a unique `Name` for your namespace.

   ```powershell
   New-AzServiceBusNamespace -ResourceGroupName MyResourceGroup -Name MyNamespace -Location MyRegion
   ```

1. Create a new Service Bus topic. Use a unique `Name` for your topic.

   ```powershell
   New-AzServiceBusTopic -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -Name MyTopic
   ```

1. Create a new subscription to your topic. Use your topic from the previous step for `TopicName`. Use a unique `Name` for your subscription.

   ```powershell
   New-AzServiceBusSubscription -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -TopicName MyTopic -Name MySubscription
   ```

### Create a Service Bus topic endpoint

1. Retrieve the primary connection string from your Service Bus namespace. Copy the connection string for later use.

   ```powershell
   Get-AzServiceBusKey -ResourceGroupName MyResourceGroup -Namespace MyNamespace -Name RootManageSharedAccessKey
   ```

1. Create a new IoT hub endpoint to your Service Bus topic. Use your primary connection string from the previous step with `;EntityPath=MyServiceBusTopic` added to the end. The `EndpointType` must be `ServiceBusTopic`, otherwise all other values should be your own. Use a unique name for your `EndpointName`.

   ```powershell
   Add-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -EndpointType ServiceBusTopic -EndpointResourceGroup MyResourceGroup -EndpointSubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ConnectionString "Endpoint=<my connection string>;EntityPath=MyServiceBusTopic"
   ```

   To see all routing endpoint options, see [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/add-aziothubroutingendpoint).

# [Azure Storage](#tab/azurestorage)

References used in the following commands:
* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.Storage](/powershell/module/az.storage/)

To create an Azure Storage endpoint and route, you need an Azure Storage account and container.

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

The default fallback route in IoT Hub collects messages from `DeviceMessages`, so let's choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more information on source options, see [Add-AzIotHubRoute](/powershell/module/az.iothub/add-aziothubroute#parameters). The `Enabled` parameter is a switch, so no value needs to follow it.

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

## Update your IoT hub route

To make changes to an existing route, use the following command. Try changing the name of your route.
 
```powershell
Set-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub -RouteName MyRoute
``` 

Use the `Get-AzIotHubRoute` command to confirm the change in your route.

```powershell
Get-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub
```

## Delete your Event hubs endpoint

```powershell
Remove-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -PassThru
```

## Delete your IoT hub route

```powershell
Remove-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub -RouteName MyRoute -PassThru
```

> [!TIP]
> Deleting a route won't delete endpoints in your Azure account. The endpoints must be deleted separately.

## Next Steps

In this how-to article you learned how to create a route and endpoint for your Event Hubs, Service Bus queue or topic, and Azure Storage. 

To further your exploration into message routing, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal). In this tutorial, you'll create a storage route and test it with a device in your IoT hub.