---
title: Programmatically manage Azure Service Bus namespaces and entities
description: This article explains how to dynamically or programmatically provision Service Bus namespaces and entities.
ms.topic: article
ms.date: 08/06/2021
ms.devlang: csharp,java,javascript,python
ms.custom: devx-track-arm-template
---

# Dynamically provision Service Bus namespaces and entities 
Azure Service Bus provides libraries to help dynamically provision Service Bus namespaces and entities. This enables complex deployments and messaging scenarios and makes it possible to programmatically determine what entities to provision.

## Overview
There are two approaches you can take to manage Azure Service Bus resources programmatically. The first is to use the [Azure Resource Manager](../azure-resource-manager/management/overview.md)-based libraries, which allow you to manage namespaces, queues, topics, subscriptions, rules, and SAS policies. Azure Resource Manager-based libraries have support for authentication through Microsoft Entra ID, but not through connection strings. The second approach is to leverage the same Service Bus client libraries that you use to send and receive messages. The client libraries also provide APIs to help you manage queues, topics, subscriptions, and rules in an *existing* namespace. They have support for authentication with connection strings. When deciding which approach to take, consider the following. 

The Azure Resource Manager-based libraries offer the same functionality as Azure portal, CLI, and PowerShell when it comes to managing Service Bus namespaces and entities like queues, topics, subscriptions, etc. If you have been using Azure portal, CLI, or PowerShell for your management operations and would like a dynamic way of doing that, then these libraries might be a better choice for you. 

However, if you are already using a Service Bus client library for service specific operations like send and receive messages and you need to manage Service Bus entities as well, then using the same library might be more convenient for you. The client libraries have a `ServiceBusAdministrationClient` (called `ServiceBusManagementClient` in the older libraries) that provides a subset of the management features provided by the Azure Resource Manager-based libraries. It must be emphasized that while the Azure Resource Manager-based libraries allow you to manage both Service Bus namespaces and entities, the client libraries only allow you to manage entities in an existing namespace but *not* the namespace itself.

## Manage using Azure Resource Manager-based libraries

The Azure Resource Manager-based libraries allow you to manage namespaces, queues, topics, subscriptions, rules, and SAS policies.  They support authentication with Microsoft Entra ID *only*; they do not support connection strings. 

| Language | Package | Documentation | Samples|
|-|-|-|-|
|.NET | [Azure.ResourceManager.ServiceBus](https://www.nuget.org/packages/Azure.ResourceManager.ServiceBus/)|[API reference for Microsoft.Azure.Management.ServiceBus](/dotnet/api/azure.resourcemanager.servicebus)|[.NET](https://github.com/Azure/azure-sdk-for-net/tree/Azure.ResourceManager.ServiceBus_1.0.0/sdk/servicebus/Azure.ResourceManager.ServiceBus/samples) |
| Java | [azure-resourcemanager-servicebus](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-servicebus)|[API reference for com.azure.resourcemanager.servicebus](/java/api/com.azure.resourcemanager.servicebus)|[Java](https://github.com/Azure-Samples/service-bus-java-manage-publish-subscribe-with-basic-features/tree/e4718a825e8fcfe58e5921770ff8084da67ccd89)|
| JavaScript |[@azure/arm-servicebus](https://www.npmjs.com/package/@azure/arm-servicebus)|[API reference for @azure/arm-servicebus](/javascript/api/@azure/arm-servicebus/)||
|Python|[azure-mgmt-servicebus](https://pypi.org/project/azure-mgmt-servicebus/)|[API reference for azure-mgmt-servicebus](/python/api/azure-mgmt-servicebus/azure.mgmt.servicebus)||


### Fluent .NET and Java libraries
There is a Fluent version of the Azure Resource Manager-based libraries. 

|Language|Package|Documentation|
|-|-|-|
|.NET|[Microsoft.Azure.Management.ServiceBus.Fluent](https://www.nuget.org/packages/Microsoft.Azure.Management.ServiceBus.Fluent/) |[API reference for Microsoft.Azure.Management.ServiceBus.Fluent](/dotnet/api/microsoft.azure.management.servicebus.fluent) |
| Java|[azure-resourcemanager-servicebus](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-servicebus)|[API reference for com.azure.resourcemanager.servicebus.fluent](/java/api/com.azure.resourcemanager.servicebus.fluent) |

## Manage using Service Bus client libraries 

Service Bus client libraries that are used for operations like send and receive messages can also be used to manage queues, topics, subscriptions, and rules in an *existing* Service Bus namespace. This feature is available via the `ServiceBusAdministrationClient` in the latest libraries and via the `ServiceBusManagementClient` in the older libraries. It is highly recommended that you use the latest libraries.

### Latest Service Bus libraries
|Language|Package|Documentation|Samples|
|-|-|-|-|
|.NET|	[Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus)|[ServiceBusAdministrationClient](/dotnet/api/azure.messaging.servicebus.administration.servicebusadministrationclient)|[.NET](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/)|
|Java|[azure-messaging-servicebus](https://search.maven.org/artifact/com.azure/azure-messaging-servicebus)|[ServiceBusAdministrationAsyncClient](/java/api/com.azure.messaging.servicebus.administration.servicebusadministrationasyncclient), [ServiceBusAdministrationClient](/java/api/com.azure.messaging.servicebus.administration.servicebusadministrationclient)| [Java](/samples/azure/azure-sdk-for-java/servicebus-samples/)|
|JavaScript|[@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus)|[ServiceBusAdministrationClient](/javascript/api/@azure/service-bus/servicebusadministrationclient)|[JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)/[TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)|
|Python|[azure-servicebus](https://pypi.org/project/azure-servicebus/)|[ServiceBusAdministrationClient](/python/api/azure-servicebus/azure.servicebus.management.servicebusadministrationclient)|[Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)|

### Legacy Service Bus libraries
|Language|Package|Documentation|Samples|
|-|-|-|-|
|.NET|[Microsoft.Azure.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus/)|[ManagementClient](/dotnet/api/microsoft.azure.servicebus.management.managementclient)|[.NET](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus)|
|Java|[azure-mgmt-servicebus](https://search.maven.org/artifact/com.microsoft.azure/azure-mgmt-servicebus)|[ManagementClientAsync](/java/api/com.microsoft.azure.servicebus.management.managementclientasync), [ManagementClient](/java/api/com.microsoft.azure.servicebus.management.managementclient)|[Java](https://github.com/Azure/azure-service-bus/tree/master/samples/Java)|

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)]

## Next steps
- Send messages to and receive messages from queue using the latest Service Bus library: [.NET](./service-bus-dotnet-get-started-with-queues.md#send-messages-to-the-queue), [Java](./service-bus-java-how-to-use-queues.md), [JavaScript](./service-bus-nodejs-how-to-use-queues.md), [Python](./service-bus-python-how-to-use-queues.md)
- Send messages to topic and receive messages from subscription using the latest Service Bus library: .[NET](./service-bus-dotnet-how-to-use-topics-subscriptions.md),  [Java](./service-bus-java-how-to-use-topics-subscriptions.md), [JavaScript](./service-bus-nodejs-how-to-use-topics-subscriptions.md), [Python](./service-bus-python-how-to-use-topics-subscriptions.md)
