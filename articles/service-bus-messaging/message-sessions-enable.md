---
title: Enable Azure Service Bus message sessions | Microsoft Docs
description: This article explains how to enable message sessions using Azure portal, PowerShell, CLI, and programming languages (C#, Java, Python, and JavaScript)
ms.topic: article
ms.date: 04/12/2021
---

# Enable message sessions for an Azure Service Bus queue or subscription
Azure Service Bus sessions enable joint and ordered handling of unbounded sequences of related messages. Sessions can be used in **first in, first out (FIFO)** and **request-response** patterns. See [Message sessions](message-sessions.md) to learn more about this concept. This article shows how to enable sessions for a Service Bus queue or subscription. 

> [!NOTE]
> The basic tier of Service Bus doesn't support sessions. The standard and premium tiers support sessions. For differences between these tiers, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).

## Azure portal
In the portal, you can enable sessions while creating a queue or a topic subscription. 

:::image type="content" source="./media/message-sessions/queue-sessions.png" alt-text="Enable session at the time of the queue creation":::

:::image type="content" source="./media/message-sessions/subscription-sessions.png" alt-text="Enable session at the time of the subscription creation":::

## Azure CLI
The following table gives you the CLI commands that you can use to enable sessions for queues and topic subscriptions. 

| Task | Command | 
| ---- | ------- | 
| Create a queue with sessions enabled | [`az servicebus queue create`](/cli/azure/servicebus/queue#az_servicebus_queue_create) command with `--enable-session` set to `true` | 
| Create a topic subscription with sessions enabled | [`az servicebus topic subscription create`](/cli/azure/servicebus/topic/subscription#az_servicebus_topic_subscription_create) command with `--enable-session` set to `true` |

For a tutorial on using CLI to create a Service Bus namespace and a queue, see [Use the Azure CLI to create a Service Bus namespace and a queue](service-bus-quickstart-cli.md). 


## Azure PowerShell
The following table gives you the PowerShell commands that you can use to enable sessions for queues and topic subscriptions. 

| Task | Command | 
| ---- | ------- | 
| Create a queue with sessions enabled | [`New-AzServiceBusQueue`](/powershell/module/az.servicebus/new-azservicebusqueue) command with `-RequiresSession` set to `true` | 
| Create a topic subscription with sessions enabled | [`New-AzServiceBusSubscription`](/powershell/module/az.servicebus/new-azservicebussubscription) command with `-RequiresSession` set to `true` | 

For a tutorial on using PowerShell to create a Service Bus namespace and a queue, see [Use Azure PowerShell to create a Service Bus namespace and a queue](service-bus-quickstart-powershell.md). 

## Azure Resource Manager template

| Task | Instructions | 
| ---- | ------- | 
| Create a queue with sessions enabled | Set `requiresSession` to `true`. For an example, see [Microsoft.ServiceBus namespaces/queues template reference](/templates/microsoft.servicebus/namespaces/queues?tabs=json). |
| Create a topic subscription with sessions enabled | Set `requiresSession` to `true`. For an example, see [Microsoft.ServiceBus namespaces/topics/subscriptions template reference](/templates/microsoft.servicebus/namespaces/topics/subscriptions?tabs=json). |


## Management library SDKs

# [.NET](#tab/dotnet)

# [Java](#tab/java)

# [JavaScript](#tab/javascript)

# [Python](#tab/python)

---

## Client library SDKs

# [.NET](#tab/dotnet)

# [Java](#tab/java)

# [JavaScript](#tab/javascript)

# [Python](#tab/python)

---


## Next steps

- [Azure.Messaging.ServiceBus samples for .NET](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/)
- [Azure Service Bus client library for Java - Samples](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library for Python - Samples](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library for JavaScript - Samples](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library for TypeScript - Samples](/samples/azure/azure-sdk-for-js/service-bus-typescript/)
- [Microsoft.Azure.ServiceBus samples for .NET](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/) (Sessions and SessionState samples)  
