---
title: Create and delete routes and endpoints by using Azure PowerShell
description: Learn how to create and delete routes and endpoints in Azure IoT Hub by using Azure PowerShell.
author: kgremban
ms.service: iot-hub
ms.custom: devx-track-azurepowershell
services: iot-hub
ms.topic: how-to
ms.date: 12/15/2022
ms.author: kgremban
---

# Create and delete routes and endpoints by using Azure PowerShell

This article shows you how to create a route and endpoint in your hub in Azure IoT Hub and then delete your route and endpoint. Learn how to use Azure PowerShell to create routes and endpoints for Azure Event Hubs, Azure Service Bus queues and topics, and Azure Storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](./iot-hub-devguide-messages-d2c.md). To walk through setting up a route that sends messages to storage and then testing on a simulated device, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=portal).

## Prerequisites

The procedures that are described in the article use the following resources:

* Azure PowerShell
* An IoT hub
* An endpoint service in Azure

### Azure PowerShell

This article uses Azure PowerShell to work with IoT Hub and other Azure services. To use Azure PowerShell locally, install the [Azure PowerShell module](/powershell/azure/install-azure-powershell) on your computer. Alternatively, to use Azure PowerShell in a web browser, enable [Azure Cloud Shell](../cloud-shell/overview.md).

### IoT hub

To create an IoT hub route, you need an IoT hub that you created by using Azure IoT Hub. Device messages and event logs originate in your IoT hub.

Be sure to have the following hub resource to use when you create your IoT hub route:

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps to [create an IoT hub by using the New-AzIotHub PowerShell cmdlet](./iot-hub-create-using-powershell.md).

### Endpoint service

To create an IoT hub route, you need at least one other Azure service to use as an endpoint to the route. The endpoint receives device messages and event logs. You can choose which Azure service you use for an endpoint to connect with your IoT hub route: Event Hubs, Service Bus queues or topics, or Azure Storage.

Be sure to have *one* of the following resources to use when you create an endpoint your IoT hub route:

* An Event Hubs resource (with container). If you need to create a new Event Hubs resource, see  [Quickstart: Create an event hub by using Azure PowerShell](../event-hubs/event-hubs-quickstart-powershell.md).

* A Service Bus queue resource. If you need to create a new Service Bus queue, see [Use Azure PowerShell to create a Service Bus namespace and queue](../service-bus-messaging/service-bus-quickstart-powershell.md).

* A Service Bus topic resource. If you need to create a new Service Bus topic, see the [New-AzServiceBusTopic](/powershell/module/az.servicebus/new-azservicebustopic) reference and the [Azure Service Bus messaging](../service-bus-messaging/index.yml) documentation.

* An Azure Storage resource. If you need to create a new storage account in Azure, see [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-powershell).

## Create resources and endpoints

In IoT Hub, you can create a route to send messages or capture events. Each route has a data source and an endpoint. The data source is where messages or event logs originate. The endpoint is where the messages or event logs end up. You choose locations for the data source and endpoint when you create a new route in your IoT hub. Then, you use routing queries to filter messages or events before they go to the endpoint.

You can use an event hub, a Service Bus queue or topic, or a storage account to be the endpoint for your IoT hub route. The service that you use to create your endpoint must first exist in your Azure account.

> [!NOTE]
> If you use a local version of Azure PowerShell, [sign in to Azure PowerShell](/powershell/azure/authenticate-azureps) before you begin.
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

1. Create your new Event Hubs entity. For `Name`, use a unique value. For `NamespaceName`, use the name of the namespace you created in the preceding step.

   ```powershell
   New-AzEventHub -Name MyEventHub -NamespaceName MyNamespace -ResourceGroupName MyResourceGroup
   ```

1. Create a new authorization rule. For `Name`, use the name of your entity for `EventHubName`. For the name of your authorization rule, use a unique value.

   ```powershell
   New-AzEventHubAuthorizationRule -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -EventHubName MyEventHub -Name MyAuthRule -Rights @('Manage', 'Send', 'Listen')
   ```

   For more information about access, see [Authorize access to Azure Event Hubs](../event-hubs/authorize-access-event-hubs.md).

### Create an Event Hubs endpoint

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

To create a new [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) queue resource:

1. Create a new Service Bus namespace. For `Name`, use a unique value.

   ```powershell
   New-AzServiceBusNamespace -ResourceGroupName MyResourceGroup -Name MyNamespace -Location MyRegion
   ```

1. Create a new Service Bus queue. For `NamespaceName`, use the name of the namespace you created in the preceding step. For the name of your queue, use a unique value.

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

   For a list of all routing endpoint options, see [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/add-aziothubroutingendpoint).

# [Service Bus topic](#tab/servicebustopic)

The commands in the following procedures use these references:

* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.ServiceBus](/powershell/module/az.servicebus/)

With [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) topics, users can subscribe to one or more topics. To create a topic, you also create a Service Bus namespace and subscription.

### Create a Service Bus namespace, topic, and subscription

1. Create a new Service Bus namespace. For `Name` for your namespace, use a unique value.

   ```powershell
   New-AzServiceBusNamespace -ResourceGroupName MyResourceGroup -Name MyNamespace -Location MyRegion
   ```

1. Create a new Service Bus topic. For the topic name, use a unique value.

   ```powershell
   New-AzServiceBusTopic -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -Name MyTopic
   ```

1. Create a new subscription to your topic. For `TopicName`, use the name of the topic you created in the preceding step. For your subscription name, use a unique value.

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

   For a list of all routing endpoint options, see [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/add-aziothubroutingendpoint).

# [Azure Storage](#tab/azurestorage)

The commands in the following procedures use these references:

* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.Storage](/powershell/module/az.storage/)

To create an Azure Storage endpoint and route, you need a Storage account and container.

### Create an Azure Storage account and container

1. Create a new Azure Storage account. The value of `Name` for your storage account can contain only lowercase letters and numbers. For `SkuName` options, see [SkuName](/powershell/module/az.storage/new-azstorageaccount#-skuname).

   ```powershell
   New-AzStorageAccount -ResourceGroupName MyResourceGroup -Name mystorageaccount -Location westus -SkuName Standard_GRS
   ```

1. Create a new container in your storage account. You need to create a context to your storage account in a variable, and then add the variable to the `Context` parameter. To learn about your options when you create a container, see [Manage blob containers by using PowerShell](../storage/blobs/blob-containers-powershell.md). For `Name`, use a unique value for the name of your container.

   ```powershell
   $ctx = New-AzStorageContext -StorageAccountName mystorageaccount -UseConnectedAccount `
   New-AzStorageContainer -Name ContainerName -Context $ctx
   ```

### Create an Azure Storage endpoint

To create an endpoint to Azure Storage, you need your access key to construct a connection string. The connection string is then part of the IoT Hub command to create an endpoint.

1. Retrieve your access key from your storage account, and then copy it.

   ```powershell
   Get-AzStorageAccountKey -ResourceGroupName MyResourceGroup -Name mystorageaccount
   ```

1. Construct a primary connection string for your storage account based on the following template. Replace `mystorageaccount` (in two places) with the name of your storage account. Replace `mykey` with your key from the preceding step.

   ```powershell
   "DefaultEndpointsProtocol=https;BlobEndpoint=https://mystorageaccount.blob.core.windows.net;AccountName=mystorageaccount;AccountKey=mykey"
   ```

   This connection string is required in the step to create the endpoint.

1. Create your Azure Storage endpoint with the connection string you constructed. `EndpointType` must have the value `azurestorage`. For all other parameters, use the values for your scenario. For `EndpointName`, use a unique value.

   ```powershell
   Add-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -EndpointType azurestorage -EndpointResourceGroup MyResourceGroup -EndpointSubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ConnectionString "my connection string"
   ```

1. When you're prompted for your container name, enter your container name, and then select Enter to create the endpoint.

---

## Create an IoT Hub route

With your new endpoint in your IoT hub, you can create a new route.

The default fallback route in IoT Hub collects messages from `DeviceMessages`. Choose a different option for your custom route, such as `DeviceConnectionStateEvents`. For more information about source options, see [Add-AzIotHubRoute](/powershell/module/az.iothub/add-aziothubroute#parameters). The `Enabled` parameter is a switch, so you don't need to use a value with the parameter.

```powershell
Add-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub -RouteName MyRoute -Source DeviceLifecycleEvents -EndpointName MyEndpoint -Enabled
```

PowerShell displays a confirmation that looks similar to this example:

```powershell
RouteName     : MyIotHub 
DataSource    : DeviceLifecycleEvents
EndpointNames : MyEndpoint
Condition     : true
IsEnabled     : True
```

## Update an IoT Hub route

To make changes to an existing route, use the following command. For example, try changing the name of your route by using the command.

```powershell
Set-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub -RouteName MyRoute
```

Use the `Get-AzIotHubRoute` command to confirm the change in your route:

```powershell
Get-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub
```

## Delete an endpoint

To delete an endpoint:

```powershell
Remove-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -PassThru
```

## Delete an IoT Hub route

To delete an IoT Hub route:

```powershell
Remove-AzIotHubRoute -ResourceGroupName MyResourceGroup -Name MyIotHub -RouteName MyRoute -PassThru
```

> [!TIP]
> Deleting a route doesn't delete any endpoints in your Azure account. You must delete an endpoint separately from deleting a route.

## Next steps

In this how-to article, you learned how to create a route and endpoint for Event Hubs, Service Bus queues and topics, and Azure Storage.

To learn more about message routing, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=portal). In the tutorial, you create a storage route and test it with a device in your IoT hub.
