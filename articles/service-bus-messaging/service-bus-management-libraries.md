---
title: Managing Azure Service Bus resources dynamically
description: This article explains how to use dynamically or programmatically provision Service Bus namespaces and entities.
ms.devlang: dotnet
ms.topic: article
ms.date: 07/19/2021
ms.custom: devx-track-csharp
---
## Overview

There are two approaches you can take to manage Azure Service Bus resources dynamically. The first is to use the [Azure Resource Manager (ARM)](https://docs.microsoft.com/azure/azure-resource-manager/management/overview)-based library, which allows you to manage namespaces, queues, topics, subscriptions, rules, and SAS policies. ARM-based library has support for authentication through Azure Active Directory, but not through connection strings. The second approach is to leverage the same Service Bus client libraries that you use to send and receive messages. These client libraries also provide APIs to help you manage queues, topics, subscriptions, and rules in an *existing* namespace. They have support for authentication with connection strings. When deciding which approach to take, consider the following. 

The ARM-based library offers the same functionality as Azure Portal, CLI, and Powershell when it comes to managing Service Bus namespaces and entities like queues, topics, subscriptions, etc. If you have been using Azure Portal, CLI, or Powershell for your management operations and would like a dynamic way of doing that, then the ARM-based library might be a better choice for you. 

However, if you are already using a Service Bus client library for service specific operations like send and receive messages and you need to manage Service Bus entities as well, then using the same library might be more convenient for you. The client libraries have a `ServiceBusAdministrationClient` (also called `ServiceBusManagementClient` in the older version) that provides a subset of the management features provided by the ARM-based library. It must be emphasized that while the ARM-based library allows you to manage both Service Bus namespaces and entities, the client libraries only allow you to manage entities in an existing namespace but *not* the namespace itself.

## Manage Service Bus namespaces, queues, topics, subscriptions, rules, SAS policies using ARM-based library

The ARM-based library allows you to manage namespaces, queues, topics, subscriptions, rules, and SAS policies.  It supports authentication with Azure Active Directory (AAD) only; it does not support connection strings. 

| Language | Package | Documentation | Samples|
|-|-|-|-|
|.NET | [Microsoft.Azure.Management.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.Management.ServiceBus/) |[API reference for Microsoft.Azure.Management.ServiceBus](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.servicebus?view=azure-dotnet)|[.NET](https://github.com/Azure-Samples/service-bus-dotnet-management/tree/a55185bef30d1763c1a8182a3361dbb548bad436) |
| Java | [azure-resourcemanager-servicebus](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-servicebus)|[API reference for com.azure.resourcemanager.servicebus](https://docs.microsoft.com/java/api/com.azure.resourcemanager.servicebus?view=azure-java-stable)|[Java](https://github.com/Azure-Samples/service-bus-java-manage-publish-subscribe-with-basic-features/tree/e4718a825e8fcfe58e5921770ff8084da67ccd89)|
| JavaScript |[@azure/arm-servicebus](https://www.npmjs.com/package/@azure/arm-servicebus)|[API reference for @azure/arm-servicebus](https://docs.microsoft.com/javascript/api/@azure/arm-servicebus/?view=azure-node-latest)||
|Python|[azure-mgmt-servicebus](https://pypi.org/project/azure-mgmt-servicebus/)|[API reference for azure-mgmt-servicebus](https://docs.microsoft.com/python/api/azure-mgmt-servicebus/azure.mgmt.servicebus?view=azure-python)||


### Fluent .NET and Java libraries
There is a Fluent version of the ARM-based library. 
|Language|Package|Documentation|
|-|-|-|
|.NET|[Microsoft.Azure.Management.ServiceBus.Fluent](https://www.nuget.org/packages/Microsoft.Azure.Management.ServiceBus.Fluent/) |[API reference for Microsoft.Azure.Management.ServiceBus.Fluent](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.servicebus.fluent?view=azure-dotnet) |
| Java|[azure-resourcemanager-servicebus](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-servicebus)|[API reference for com.azure.resourcemanager.servicebus.fluent](https://docs.microsoft.com/java/api/com.azure.resourcemanager.servicebus.fluent?view=azure-java-stable) |

## Manage Service Bus queues, topics, subscriptions and rules in an existing namespace

Service Bus client libraries that are used for operations like send and receive messages can also be used to manage queues, topics, subscriptions, and rules in an *existing* Service Bus namespace. This feature is available via the `ServiceBusAdministrationClient` in the latest libraries and via the `ServiceBusManagementClient` in the older libraries. It is highly recommended that you use the latest libraries.

### Latest Service Bus libraries
|Language|Package|Documentation|Samples|
|-|-|-|-|
|.NET|	[Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus)|[ServiceBusAdministrationClient](https://docs.microsoft.com/dotnet/api/azure.messaging.servicebus.administration.servicebusadministrationclient?view=azure-dotnet)|[.NET](https://docs.microsoft.com/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/)|
|Java|[azure-messaging-servicebus](https://search.maven.org/artifact/com.azure/azure-messaging-servicebus)|[ServiceBusAdministrationAsyncClient](https://docs.microsoft.com/java/api/com.azure.messaging.servicebus.administration.servicebusadministrationasyncclient?view=azure-java-stable), [ServiceBusAdministrationClient](https://docs.microsoft.com/java/api/com.azure.messaging.servicebus.administration.servicebusadministrationclient?view=azure-java-stable)| [Java](https://docs.microsoft.com/samples/azure/azure-sdk-for-java/servicebus-samples/)|
|JavaScript|[@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus)|[ServiceBusAdministrationClient](https://docs.microsoft.com/javascript/api/@azure/service-bus/servicebusadministrationclient?view=azure-node-latest)|[JavaScript](https://docs.microsoft.com/en-us/samples/azure/azure-sdk-for-js/service-bus-javascript/)/[TypeScript](https://docs.microsoft.com/en-us/samples/azure/azure-sdk-for-js/service-bus-typescript/)|
|Python|[azure-servicebus](https://pypi.org/project/azure-servicebus/)|[ServiceBusAdministrationClient](https://docs.microsoft.com/python/api/azure-servicebus/azure.servicebus.management.servicebusadministrationclient?view=azure-python)|[Python](https://docs.microsoft.com/samples/azure/azure-sdk-for-python/servicebus-samples/)|

### Legacy Service Bus libraries
|Language|Package|Documentation|Samples|
|-|-|-|-|
|.NET|[Microsoft.Azure.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus/)|[ManagementClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.servicebus.management.managementclient?view=azure-dotnet)|[.NET](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus)|
|Java|[azure-mgmt-servicebus](https://search.maven.org/artifact/com.microsoft.azure/azure-mgmt-servicebus)|[ManagementClientAsync](https://docs.microsoft.com/java/api/com.microsoft.azure.servicebus.management.managementclientasync?view=azure-java-stable), [ManagementClient](https://docs.microsoft.com/java/api/com.microsoft.azure.servicebus.management.managementclient?view=azure-java-stable)|[Java](https://github.com/Azure/azure-service-bus/tree/master/samples/Java)|


## Next Steps
- Send messages to and receive messages from queue using the latest Service Bus library: [.NET](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-dotnet-get-started-with-queues#send-messages-to-a-queue), [Java](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-java-how-to-use-queues), [JavaScript](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-nodejs-how-to-use-queues), [Python](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-python-how-to-use-queues)
- Send messages to topic and receive messages from subscription using the latest Service Bus library: .[NET](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-dotnet-how-to-use-topics-subscriptions),  [Java](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-java-how-to-use-topics-subscriptions), [JavaScript](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-nodejs-how-to-use-topics-subscriptions), [Python](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-python-how-to-use-topics-subscriptions)
