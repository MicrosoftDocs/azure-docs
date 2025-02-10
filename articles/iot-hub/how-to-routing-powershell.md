---
title: Create and delete routes and endpoints by using Azure PowerShell
description: Learn how to create and delete routes and endpoints in Azure IoT Hub by using Azure PowerShell.
author: kgremban
ms.service: azure-iot-hub
ms.custom: devx-track-azurepowershell
services: iot-hub
ms.topic: how-to
ms.date: 12/05/2024
ms.author: kgremban
---

# Create and delete routes and endpoints by using Azure PowerShell

This article shows you how to create a route and endpoint in your hub in Azure IoT Hub and then delete your route and endpoint. Learn how to use Azure PowerShell to create routes and endpoints for Azure Event Hubs, Azure Service Bus queues and topics, and Azure Storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](./iot-hub-devguide-messages-d2c.md). To walk through setting up a route that sends messages to storage and then testing on a simulated device, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=portal).

> [!NOTE]
> Currently, PowerShell doesn't support managed identity authentication types for creating endpoints. If you can't use SAS authentication in your scenario, use one of the other management tools to create endpoints.
>
> Also, PowerShell currently doesn't support creating Cosmos DB endpoints.

## Prerequisites

Review the prerequisites for this article based on the type of endpoint you want to route the messages to.

### [Event Hubs](#tab/eventhubs)

* An Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub. If you don't have a hub, you can follow the steps to [create an IoT hub](create-hub.md).

* Azure PowerShell. To use Azure PowerShell locally, install the [Azure PowerShell module](/powershell/azure/install-azure-powershell) on your computer. Alternatively, to use Azure PowerShell in a web browser, enable [Azure Cloud Shell](../cloud-shell/overview.md).

* An Event Hubs resource (with container). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub](../event-hubs/event-hubs-quickstart-powershell.md).

* (Recommended) A managed identity with role-based access control permissions for the Event Hubs namespace. For more information, see [Authenticate a managed identity with Microsoft Entra ID to access Event Hubs resources](../event-hubs/authenticate-managed-identity.md).

### [Service Bus queue](#tab/servicebusqueue)

* An Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub. If you don't have a hub, you can follow the steps to [create an IoT hub](create-hub.md).

* Azure PowerShell. To use Azure PowerShell locally, install the [Azure PowerShell module](/powershell/azure/install-azure-powershell) on your computer. Alternatively, to use Azure PowerShell in a web browser, enable [Azure Cloud Shell](../cloud-shell/overview.md).

* A Service Bus queue resource. If you need to create a new Service Bus queue, see [Quickstart: Create a Service Bus namespace and a queue](../service-bus-messaging/service-bus-quickstart-powershell.md).

* (Recommended) A managed identity with role-based access control permissions for the Service Bus namespace or queue. For more information, see [Authenticate a managed identity with Microsoft Entra ID to access Azure Service Bus resources](../service-bus-messaging/service-bus-managed-service-identity.md)

### [Service Bus topic](#tab/servicebustopic)

* An Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub. If you don't have a hub, you can follow the steps to [create an IoT hub](create-hub.md).

* Azure PowerShell. To use Azure PowerShell locally, install the [Azure PowerShell module](/powershell/azure/install-azure-powershell) on your computer. Alternatively, to use Azure PowerShell in a web browser, enable [Azure Cloud Shell](../cloud-shell/overview.md).

* A Service Bus topic resource. If you need to create a new Service Bus topic, see [Quickstart: Create a Service Bus namespace with topic and subscription by using a Resource Manager template](../service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md).

* (Recommended) A managed identity with role-based access control permissions for the Service Bus namespace or topic. For more information, see [Authenticate a managed identity with Microsoft Entra ID to access Azure Service Bus resources](../service-bus-messaging/service-bus-managed-service-identity.md)

### [Azure Storage](#tab/azurestorage)

* An Azure subscription. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* An IoT hub. If you don't have a hub, you can follow the steps to [create an IoT hub](create-hub.md).

* Azure PowerShell. To use Azure PowerShell locally, install the [Azure PowerShell module](/powershell/azure/install-azure-powershell) on your computer. Alternatively, to use Azure PowerShell in a web browser, enable [Azure Cloud Shell](../cloud-shell/overview.md).

* An Azure Storage resource. If you need to create a new Azure Storage account, see [Create a storage account](../storage/common/storage-account-create.md).

* (Recommended) A managed identity with role-based access control permissions for the Storage account. For more information, see [Assign an Azure role for access to blob data](../storage/blobs/assign-azure-role-data-access.md).

---

## Create endpoints

In IoT Hub, you can create a route to send messages or capture events. Each route has a data source and an endpoint. The data source is where messages or event logs originate. The endpoint is where the messages or event logs end up. You choose locations for the data source and endpoint when you create a new route in your IoT hub. Then, you use routing queries to filter messages or events before they go to the endpoint.

The service that you use to create your endpoint must first exist in your Azure account.

> [!NOTE]
> If you use a local version of Azure PowerShell, [sign in to Azure PowerShell](/powershell/azure/authenticate-azureps) before you begin.
>

### [Event Hubs](#tab/eventhubs)

The commands in the following procedures use these references:

* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.EventHub](/powershell/module/az.eventhub/)

1. Get the primary connection string from your event hub. Copy the connection string to use later.

   ```powershell
   Get-AzEventHubKey -ResourceGroupName MyResourceGroup -NamespaceName MyNamespace -EventHubName MyEventHub -Name MyAuthRule
   ```

1. Create a new IoT hub endpoint to Event Hubs. Use your primary connection string from the preceding step. The value for `EndpointType` must be `EventHub`. For all other parameters, use the values for your scenario.

   ```powershell
   Add-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -EndpointType EventHub -EndpointResourceGroup MyResourceGroup -EndpointSubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ConnectionString "Endpoint=<my connection string>"
   ```

   To see all routing endpoint options, see [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/add-aziothubroutingendpoint).

### [Service Bus queue](#tab/servicebusqueue)

The commands in the following procedures use these references:

* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.ServiceBus](/powershell/module/az.servicebus/)

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

### [Service Bus topic](#tab/servicebustopic)

The commands in the following procedures use these references:

* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.ServiceBus](/powershell/module/az.servicebus/)

1. Retrieve the primary connection string from your Service Bus namespace. Copy the connection string to use later.

   ```powershell
   Get-AzServiceBusKey -ResourceGroupName MyResourceGroup -Namespace MyNamespace -Name RootManageSharedAccessKey
   ```

1. Create a new IoT hub endpoint to your Service Bus topic. Use your primary connection string from the preceding step with `;EntityPath=MyServiceBusTopic` added to the end. The value for `EndpointType` must be `ServiceBusTopic`. For all other parameters, use the values for your scenario. For `EndpointName`, use a unique value.

   ```powershell
   Add-AzIotHubRoutingEndpoint -ResourceGroupName MyResourceGroup -Name MyIotHub -EndpointName MyEndpoint -EndpointType ServiceBusTopic -EndpointResourceGroup MyResourceGroup -EndpointSubscriptionId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ConnectionString "Endpoint=<my connection string>;EntityPath=MyServiceBusTopic"
   ```

   For a list of all routing endpoint options, see [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/add-aziothubroutingendpoint).

### [Azure Storage](#tab/azurestorage)

The commands in the following procedures use these references:

* [Az.IotHub](/powershell/module/az.iothub/)
* [Az.Storage](/powershell/module/az.storage/)

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
