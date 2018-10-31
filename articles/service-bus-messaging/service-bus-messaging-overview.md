---
title: Azure Service Bus messaging overview | Microsoft Docs
description: Description of Service Bus messaging
services: service-bus-messaging
documentationcenter: ''
author: spelluru
manager: timlt
editor: ''

ms.service: service-bus-messaging
ms.topic: overview
ms.date: 09/22/2018
ms.custom: mvc
ms.author: spelluru
#Customer intent: As a developer, I want to be able to securely and reliably send messages between applications and services, with the ability to use publish/subscribe capabilities.
---

# What is Azure Service Bus?

Microsoft Azure Service Bus is a fully managed enterprise integration message broker. Service Bus is most commonly used to decouple applications and services from each other, and is a reliable and secure platform for asynchronous data and state transfer. Data is transferred between different applications and services using *messages*. A message is in binary format, which can contain JSON, XML, or just text. 

Some common messaging scenarios are:

* Messaging: transfer business data, such as sales or purchase orders, journals, or inventory movements.
* Decouple applications: improve reliability and scalability of applications and services (client and service do not have to be online at the same time).
* Topics and subscriptions: enable 1:*n* relationships between publishers and subscribers.
* Message sessions: implement workflows that require message ordering or message deferral.

## Namespaces

A namespace is a scoping container for all messaging components. Multiple queues and topics can reside within a single namespace, and namespaces often serve as application containers.

## Queues

Messages are sent to and received from *queues*. Queues enable you to store messages until the receiving application is available to receive and process them.

![Queue](./media/service-bus-messaging-overview/about-service-bus-queue.png)

Messages in queues are ordered and timestamped on arrival. Once accepted, the message is held safely in redundant storage. Messages are delivered in *pull* mode, which delivers messages on request.

## Topics

You can also use *topics* to send and receive messages. While a queue is often used for point-to-point communication, topics are useful in publish/subscribe scenarios.

![Topic](./media/service-bus-messaging-overview/about-service-bus-topic.png)

Topics can have multiple, independent subscriptions. A subscriber to a topic can receive a copy of each message sent to that topic. Subscriptions are named entities, which are durably created but can optionally expire or auto-delete.

In some scenarios, you may not want individual subscriptions to receive all messages sent to a topic. If so, you can use [rules and filters](topic-filters.md) to define conditions that trigger optional [actions](topic-filters.md#actions), filter specified messages, and set or modify message properties.

## Advanced features

Service Bus also has advanced features that enable you to solve more complex messaging problems. The following sections describe these key features:

### Message sessions

To realize a first-in, first-out (FIFO) guarantee in Service Bus, use sessions. [Message sessions](message-sessions.md) enable joint and ordered handling of unbounded sequences of related messages. 

### Auto-forwarding

The [auto-forwarding](service-bus-auto-forwarding.md) feature enables you to chain a queue or subscription to another queue or topic that is part of the same namespace. When auto-forwarding is enabled, Service Bus automatically removes messages that are placed in the first queue or subscription (source) and puts them in the second queue or topic (destination).

### Dead-lettering

Service Bus supports a [dead-letter queue](service-bus-dead-letter-queues.md) (DLQ) to hold messages that cannot be delivered to any receiver, or messages that cannot be processed. You can then remove messages from the DLQ and inspect them.

### Scheduled delivery

You can submit messages to a queue or topic [for delayed processing](message-sequencing.md#scheduled-messages); for example, to schedule a job to become available for processing by a system at a certain time.

### Message deferral

When a queue or subscription client receives a message that it is willing to process, but for which processing is not currently possible due to special circumstances within the application, the entity has the option to [defer retrieval of the message](message-deferral.md) to a later point. The message remains in the queue or subscription, but it is set aside.

### Batching

[Client-side batching](service-bus-performance-improvements.md#client-side-batching) enables a queue or topic client to delay sending a message for a certain period of time. If the client sends additional messages during this time period, it transmits the messages in a single batch. 

### Transactions

A [transaction](service-bus-transactions.md) groups two or more operations together into an execution scope. Service Bus supports grouping operations against a single messaging entity (queue, topic, subscription) within the scope of a transaction.

### Filtering and actions

Subscribers can define which messages they want to receive from a topic. These messages are specified in the form of one or more [named subscription rules](topic-filters.md). For each matching rule condition, the subscription produces a copy of the message, which may be differently annotated for each matching rule.

### Auto-delete on idle

[Auto-delete on idle](/dotnet/api/microsoft.servicebus.messaging.queuedescription.autodeleteonidle) enables you to specify an idle interval after which the queue is automatically deleted. The minimum duration is 5 minutes.

### Duplicate detection

If an error occurs that causes the client to have any doubt about the outcome of a send operation, [duplicate detection](duplicate-detection.md) takes the doubt out of these situations by enabling the sender re-send the same message, and the queue or topic discards any duplicate copies.

### SAS, RBAC, and Managed identities for Azure resources

Service Bus supports security protocols such as [Shared Access Signatures](service-bus-sas.md) (SAS), [Role Based Access Control](service-bus-role-based-access-control.md) (RBAC) and [Managed identities for Azure resources](service-bus-managed-service-identity.md).

### Geo-disaster recovery

When Azure regions or datacenters experience downtime, [Geo-disaster recovery](service-bus-geo-dr.md) enables data processing to continue operating in a different region or datacenter.

### Security

Service Bus supports standard [AMQP 1.0](service-bus-amqp-overview.md) and [HTTP/REST](/rest/api/servicebus/) protocols.

## Client libraries

Service Bus supports client libraries for [.NET](https://github.com/Azure/azure-service-bus-dotnet/tree/master), [Java](https://github.com/Azure/azure-service-bus-java/tree/master), [JMS](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/qpid-jms-client).

## Integration

Service Bus fully integrates with the following Azure services:

- [Event Grid](https://azure.microsoft.com/services/event-grid/) 
- [Logic Apps](https://azure.microsoft.com/services/logic-apps/) 
- [Functions](https://azure.microsoft.com/services/functions/) 
- [Dynamics 365](https://dynamics.microsoft.com)
- [Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)
 
## Next steps

To get started using Service Bus messaging, see the following articles:

* [Compare Azure messaging services](../event-grid/compare-messaging-services.md?toc=%2fazure%2fservice-bus-messaging%2ftoc.json&bc=%2fazure%2fservice-bus-messaging%2fbreadcrumb%2ftoc.json)
* Learn more about Azure Service Bus [Standard and Premium](https://azure.microsoft.com/pricing/details/service-bus/) tiers and their pricing
* [Performance and Latency of Azure Service Bus Premium tier](https://blogs.msdn.microsoft.com/servicebus/2016/07/18/premium-messaging-how-fast-is-it/)
* Try the quickstarts in [.NET](service-bus-quickstart-powershell.md), [Java](service-bus-quickstart-powershell.md), or [JMS](service-bus-quickstart-powershell.md)
