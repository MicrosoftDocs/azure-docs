---
title: Azure Service Bus REST APIs and client libraries
description: Choose between Service Bus REST APIs and supported client libraries, and find the reference for messaging and resource management operations.
author: EldertGrootenboer
ms.author: egrootenboer
ms.service: azure-service-bus
ms.topic: overview
ms.date: 10/13/2026
---

# Azure Service Bus REST APIs and client libraries

Azure Service Bus exposes REST APIs for messaging and resource management. You can also use supported client libraries for your application language. Choose the interface for the operations your application needs.

## Messaging over HTTPS

The [Service Bus runtime REST reference](/rest/api/servicebus/service-bus-runtime-rest) describes operations against a namespace endpoint such as `https://your-namespace.servicebus.windows.net`.

The messaging operations include:

- [Send a message](/rest/api/servicebus/send-message-to-queue) to a queue or topic.
- [Send a batch of messages](/rest/api/servicebus/send-message-batch).
- [Receive and delete a message](/rest/api/servicebus/receive-and-delete-message-destructive-read).
- [Receive and lock a message](/rest/api/servicebus/peek-lock-message-non-destructive-read).
- [Unlock](/rest/api/servicebus/unlock-message), [complete](/rest/api/servicebus/delete-message), or [renew the lock](/rest/api/servicebus/renew-lock-for-a-message) on a received message.

Use [Microsoft Entra ID authentication](service-bus-rest-send-entra-token-how-to.md) or [shared access signatures](service-bus-sas.md) to authorize requests. The [HTTP message format](service-bus-rest-message-properties.md) describes message properties and body handling.

## Supported client libraries

Supported Service Bus client libraries use [AMQP 1.0](service-bus-amqp-overview.md) and expose language-specific APIs for messaging. Start with the queue quickstart for your language:

| Language | Quickstart |
| --- | --- |
| .NET | [Send and receive messages with .NET](service-bus-dotnet-get-started-with-queues.md) |
| Java | [Send and receive messages with Java](service-bus-java-how-to-use-queues.md) |
| JavaScript | [Send and receive messages with JavaScript](service-bus-nodejs-how-to-use-queues.md) |
| Python | [Send and receive messages with Python](service-bus-python-how-to-use-queues.md) |
| Go | [Send and receive messages with Go](service-bus-go-how-to-use-queues.md) |

Check the chosen API's reference for the features your application needs, such as [sessions](message-sessions.md), [dead-lettering](service-bus-dead-letter-queues.md), and [message deferral](message-deferral.md). Use the REST operation reference to establish HTTP coverage rather than assuming that every client-library operation has an equivalent REST operation.

> [!NOTE]
> The `WindowsAzure.ServiceBus` .NET library retired on September 30, 2026. For new .NET applications, use `Azure.Messaging.ServiceBus`. For existing applications, see the [.NET migration guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide.md).

## Resource management and API versions

Use the [Resource Manager REST reference](/rest/api/servicebus/controlplane/namespaces) for operations on Azure resources such as namespace creation and configuration. Use [namespace addressing](service-bus-rest-namespace-access.md) for entity operations against the Service Bus service endpoint.

Follow the version requirements in the reference for the specific API you call. Resource Manager operations have their own API versions. A historical Service Bus service-version list isn't a version-selection guide for Resource Manager or current client libraries.

Classic Azure Service Manager and RDFE management APIs retired on November 1, 2021. Use the [migration guidance](deprecate-service-bus-management.md) for existing integrations.

## Next steps

- [Namespace addressing for REST APIs](service-bus-rest-namespace-access.md)
- [Send a message with Microsoft Entra ID authentication](service-bus-rest-send-entra-token-how-to.md)
- [Service Bus REST API reference](/rest/api/servicebus/)
