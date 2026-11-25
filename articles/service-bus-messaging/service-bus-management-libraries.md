---
title: Programmatically manage Azure Service Bus namespaces and entities
description: This article explains how to dynamically or programmatically create Service Bus namespaces and entities.
ms.topic: article
ms.date: 10/06/2026
ms.devlang: csharp
# ms.devlang: csharp,java,javascript,python
ms.custom: devx-track-arm-template
---

# Dynamically create Service Bus namespaces and entities 
Azure Service Bus provides libraries to help dynamically create Service Bus namespaces and entities. It enables complex deployments and messaging scenarios and makes it possible to programmatically determine what entities to create.

## Overview
There are two approaches you can take to manage Azure Service Bus resources programmatically. The first is to use the [Azure Resource Manager](../azure-resource-manager/management/overview.md)-based libraries, which allow you to manage namespaces, queues, topics, subscriptions, rules, and SAS policies. Azure Resource Manager-based libraries have support for authentication through Microsoft Entra ID, but not through connection strings. The second approach is to use the same Service Bus client libraries that you use to send and receive messages. The client libraries also provide APIs to help you manage queues, topics, subscriptions, and rules in an *existing* namespace. They have support for authentication with connection strings. When deciding which approach to take, consider the following points.

The Azure Resource Manager-based libraries offer the same functionality as Azure portal, CLI, and PowerShell when it comes to managing Service Bus namespaces and entities like queues, topics, subscriptions, etc. If you have been using Azure portal, CLI, or PowerShell for your management operations and would like a dynamic way of doing that, then these libraries might be a better choice for you.

If you're already using a Service Bus client library to send and receive messages, use its `ServiceBusAdministrationClient` to manage entities in the same application. This client manages queues, topics, subscriptions, and rules in an existing namespace. Use an Azure Resource Manager-based library to manage the namespace itself.

## Manage using Azure Resource Manager-based libraries

The Azure Resource Manager-based libraries allow you to manage namespaces, queues, topics, subscriptions, rules, and SAS policies. They support authentication with Microsoft Entra ID *only*; they don't support connection strings.

| Language | Package | Documentation | Samples|
|-|-|-|-|
|.NET | [Azure.ResourceManager.ServiceBus](https://www.nuget.org/packages/Azure.ResourceManager.ServiceBus/)|[API reference for Azure.ResourceManager.ServiceBus](/dotnet/api/azure.resourcemanager.servicebus)|[.NET](https://github.com/Azure/azure-sdk-for-net/tree/Azure.ResourceManager.ServiceBus_1.0.0/sdk/servicebus/Azure.ResourceManager.ServiceBus/samples) |
| Java | [azure-resourcemanager-servicebus](https://central.sonatype.com/artifact/com.azure.resourcemanager/azure-resourcemanager-servicebus)|[API reference for com.azure.resourcemanager.servicebus](/java/api/com.azure.resourcemanager.servicebus)|[Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-resourcemanager-servicebus/src/samples/java)|
| JavaScript |[@Azure/arm-servicebus](https://www.npmjs.com/package/@azure/arm-servicebus)|[API reference for @Azure/arm-servicebus](/javascript/api/@azure/arm-servicebus/)||
|Python|[azure-mgmt-servicebus](https://pypi.org/project/azure-mgmt-servicebus/)|[API reference for azure-mgmt-servicebus](/python/api/azure-mgmt-servicebus/azure.mgmt.servicebus)||


### Fluent .NET and Java libraries
There's a Fluent version of the Azure Resource Manager-based libraries.

|Language|Package|Documentation|
|-|-|-|
|.NET|[Microsoft.Azure.Management.ServiceBus.Fluent](https://www.nuget.org/packages/Microsoft.Azure.Management.ServiceBus.Fluent/) |[API reference for Microsoft.Azure.Management.ServiceBus.Fluent](/dotnet/api/microsoft.azure.management.servicebus.fluent) |
| Java|[azure-resourcemanager-servicebus](https://central.sonatype.com/artifact/com.azure.resourcemanager/azure-resourcemanager-servicebus)|[API reference for com.azure.resourcemanager.servicebus.fluent](/java/api/com.azure.resourcemanager.servicebus.fluent) |

## Manage using Service Bus client libraries 

Service Bus client libraries provide a `ServiceBusAdministrationClient` to manage queues, topics, subscriptions, and rules in an *existing* Service Bus namespace.

### Latest Service Bus libraries
|Language|Package|Documentation|Samples|
|-|-|-|-|
|.NET|	[Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus)|[ServiceBusAdministrationClient](/dotnet/api/azure.messaging.servicebus.administration.servicebusadministrationclient)|[.NET](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/)|
|Java|[azure-messaging-servicebus](https://central.sonatype.com/artifact/com.azure/azure-messaging-servicebus)|[ServiceBusAdministrationAsyncClient](/java/api/com.azure.messaging.servicebus.administration.servicebusadministrationasyncclient), [ServiceBusAdministrationClient](/java/api/com.azure.messaging.servicebus.administration.servicebusadministrationclient)| [Java](/samples/azure/azure-sdk-for-java/servicebus-samples/)|
|JavaScript|[@Azure/service-bus](https://www.npmjs.com/package/@azure/service-bus)|[ServiceBusAdministrationClient](/javascript/api/@azure/service-bus/servicebusadministrationclient)|[JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)/[TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)|
|Python|[azure-servicebus](https://pypi.org/project/azure-servicebus/)|[ServiceBusAdministrationClient](/python/api/azure-servicebus/azure.servicebus.management.servicebusadministrationclient)|[Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)|

## Next steps
- Send messages to and receive messages from queue using the latest Service Bus library: [.NET](./service-bus-dotnet-get-started-with-queues.md#send-messages-to-the-queue), [Java](./service-bus-java-how-to-use-queues.md), [JavaScript](./service-bus-nodejs-how-to-use-queues.md), [Python](./service-bus-python-how-to-use-queues.md)
- Send messages to topic and receive messages from subscription using the latest Service Bus library: .[NET](./service-bus-dotnet-how-to-use-topics-subscriptions.md),  [Java](./service-bus-java-how-to-use-topics-subscriptions.md), [JavaScript](./service-bus-nodejs-how-to-use-topics-subscriptions.md), [Python](./service-bus-python-how-to-use-topics-subscriptions.md)
