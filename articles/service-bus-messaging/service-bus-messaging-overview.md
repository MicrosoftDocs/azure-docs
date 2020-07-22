---
title: Azure Service Bus messaging overview | Microsoft Docs
description: This article provides a high level overview of Azure Service Bus, a fully managed enterprise integration message broker. 
ms.topic: overview
ms.date: 06/23/2020
---

# What is Azure Service Bus?

Microsoft Azure Service Bus is a fully managed enterprise integration message broker. Service Bus can decouple applications and services. Service Bus offers a reliable and secure platform for asynchronous transfer of data and state.

Data is transferred between different applications and services using *messages*. A message is in binary format and can contain JSON, XML, or just text. For more information, see [Integration Services](https://azure.com/integration).

Some common messaging scenarios are:

* *Messaging*. Transfer business data, such as sales or purchase orders, journals, or inventory movements.
* *Decouple applications*. Improve reliability and scalability of applications and services. Client and service don't have to be online at the same time.
* *Topics and subscriptions*. Enable 1:*n* relationships between publishers and subscribers.
* *Message sessions*. Implement workflows that require message ordering or message deferral.

## Namespaces

A namespace is a container for all messaging components. Multiple queues and topics can be in a single namespace, and namespaces often serve as application containers.

## Queues

Messages are sent to and received from *queues*. Queues store messages until the receiving application is available to receive and process them.

![Queue](./media/service-bus-messaging-overview/about-service-bus-queue.png)

Messages in queues are ordered and timestamped on arrival. Once accepted, the message is held safely in redundant storage. Messages are delivered in *pull* mode, only delivering messages when requested.

## Topics

You can also use *topics* to send and receive messages. While a queue is often used for point-to-point communication, topics are useful in publish/subscribe scenarios.

![Topic](./media/service-bus-messaging-overview/about-service-bus-topic.png)

Topics can have multiple, independent subscriptions. A subscriber to a topic can receive a copy of each message sent to that topic. Subscriptions are named entities. Subscriptions persist, but can expire or autodelete.

You may not want individual subscriptions to receive all messages sent to a topic. If so, you can use *rules* and *filters* to define conditions that trigger optional *actions*. You can filter specified messages and set or modify message properties. For more information, see [Topic filters and actions](topic-filters.md).

## Advanced features

Service Bus includes advanced features that enable you to solve more complex messaging problems. The following sections describe several of these features.

### Message sessions

To create a first-in, first-out (FIFO) guarantee in Service Bus, use sessions. Message sessions enable joint and ordered handling of unbounded sequences of related messages. For more information, see [Message sessions: first in, first out (FIFO)](message-sessions.md).

### Autoforwarding

The autoforwarding feature chains a queue or subscription to another queue or topic. They must be part of the same namespace. With autoforwarding, Service Bus automatically removes messages from a queue or subscription and puts them in a different queue or topic. For more information, see [Chaining Service Bus entities with autoforwarding](service-bus-auto-forwarding.md).

### Dead-letter queue

Service Bus supports a dead-letter queue (DLQ). A DLQ holds messages that can't be delivered to any receiver. It holds messages that can't be processed. Service Bus lets you remove messages from the DLQ and inspect them. For more information, see [Overview of Service Bus dead-letter queues](service-bus-dead-letter-queues.md).

### Scheduled delivery

You can submit messages to a queue or topic for delayed processing. You can schedule a job to become available for processing by a system at a certain time. For more information, see [Scheduled messages](message-sequencing.md#scheduled-messages).

### Message deferral

A queue or subscription client can defer retrieval of a message until a later time. This deferral might be because of special circumstances in the application. The message remains in the queue or subscription, but it's set aside. For more information, see [Message deferral](message-deferral.md).

### Batching

Client-side batching enables a queue or topic client to delay sending a message for a certain period of time. If the client sends additional messages during this time period, it transmits the messages in a single batch. For more information, see [Client-side batching](service-bus-performance-improvements.md#client-side-batching).

### Transactions

A transaction groups two or more operations together into an *execution scope*. Service Bus supports grouping operations against a single messaging entity within the scope of a single transaction. A message entity can be a queue, topic, or subscription. For more information, see [Overview of Service Bus transaction processing](service-bus-transactions.md).

### Filtering and actions

Subscribers can define which messages they want to receive from a topic. These messages are specified in the form of one or more named subscription rules. For each matching rule condition, the subscription produces a copy of the message, which can be differently annotated for each matching rule. For more information, see [Topic filters and actions](topic-filters.md).

### Autodelete on idle

Autodelete on idle enables you to specify an idle interval after which a queue is automatically deleted. The minimum duration is 5 minutes. For more information, see the [QueueDescription.AutoDeleteOnIdle Property](/dotnet/api/microsoft.servicebus.messaging.queuedescription.autodeleteonidle).

### Duplicate detection

An error could cause the client to have a doubt about the outcome of a send operation. Duplicate detection enables the sender to resend the same message. Another option is for the queue or topic to discard any duplicate copies. For more information, see [Duplicate detection](duplicate-detection.md).

### Security protocols
<a name="sas-rbac-and-managed-identities-for-azure-resources"></a>

Service Bus supports security protocols such as [Shared Access Signatures](service-bus-sas.md) (SAS), [Role Based Access Control](authenticate-application.md) (RBAC) and [Managed identities for Azure resources](service-bus-managed-service-identity.md).

### Geo-disaster recovery

When Azure regions or datacenters experience downtime, Geo-disaster recovery enables data processing to continue operating in a different region or datacenter. For more information, see [Azure Service Bus Geo-disaster recovery](service-bus-geo-dr.md).

### Security

Service Bus supports standard [AMQP 1.0](service-bus-amqp-overview.md) and [HTTP/REST](/rest/api/servicebus/) protocols.

## Client libraries

Service Bus supports client libraries for [.NET](https://github.com/Azure/azure-service-bus-dotnet/tree/master), [Java](https://github.com/Azure/azure-service-bus-java/tree/master), and [JMS](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/qpid-jms-client).

## Integration

Service Bus fully integrates with the following Azure services:

* [Event Grid](https://azure.microsoft.com/services/event-grid/)
* [Logic Apps](https://azure.microsoft.com/services/logic-apps/)
* [Azure Functions](https://azure.microsoft.com/services/functions/)
* [Dynamics 365](https://dynamics.microsoft.com)
* [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)

## Next steps

To get started using Service Bus messaging, see the following articles:

* To compare Azure messaging services, see [Comparison of services](../event-grid/compare-messaging-services.md?toc=%2fazure%2fservice-bus-messaging%2ftoc.json&bc=%2fazure%2fservice-bus-messaging%2fbreadcrumb%2ftoc.json).
* Try the quickstarts for [.NET](service-bus-dotnet-get-started-with-queues.md), [Java](service-bus-java-how-to-use-queues.md), or [JMS](service-bus-java-how-to-use-jms-api-amqp.md).
* To manage Service Bus resources, see [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases).
* To learn more about Standard and Premium tiers and their pricing, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).
* To learn about  performance and latency for the Premium tier, see [Premium Messaging](https://techcommunity.microsoft.com/t5/Service-Bus-blog/Premium-Messaging-How-fast-is-it/ba-p/370722).
