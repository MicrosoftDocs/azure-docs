---
title: Azure Service Bus messaging overview | Microsoft Docs
description: This article provides a high-level overview of Azure Service Bus, a fully managed enterprise integration message broker. 
ms.topic: overview
ms.date: 06/11/2021
---

# What is Azure Service Bus?
Microsoft Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics. Service Bus is used to decouple applications and services from each other, providing the following benefits:

- Load-balancing work across competing workers
- Safely routing and transferring data and control across service and application boundaries
- Coordinating transactional work that requires a high-degree of reliability 

## Overview
Data is transferred between different applications and services using **messages**. A message is a container decorated with metadata, and contains data. The data can be any kind of information, including structured data encoded with the common formats such as the following ones: JSON, XML, Apache Avro, Plain Text.

Some common messaging scenarios are:

* **Messaging**. Transfer business data, such as sales or purchase orders, journals, or inventory movements.
* **Decouple applications**. Improve reliability and scalability of applications and services. Producer and consumer don't have to be online or readily available at the same time. The [load is leveled](/azure/architecture/patterns/queue-based-load-leveling) such that traffic spikes don't overtax a service. 
* **Load Balancing**. Allow for multiple [competing consumers](/azure/architecture/patterns/competing-consumers) to read from a queue at the same time, each safely obtaining exclusive ownership to specific messages. 
* **Topics and subscriptions**. Enable 1:*n* relationships between [publishers and subscribers](/azure/architecture/patterns/publisher-subscriber), allowing subscribers to select particular messages from a published message stream.
* **Transactions**. Allows you to do several operations, all in the scope of an atomic transaction. For example, the following operations can be done in the scope of a transaction.  

    1. Obtain a message from one queue.
    2. Post results of processing to one or more different queues.
    3. Move the input message from the original queue. 
    
    The results become visible to downstream consumers only upon success, including the successful settlement of input message, allowing for once-only processing semantics. This transaction model is a robust foundation for the [compensating transactions](/azure/architecture/patterns/compensating-transaction) pattern in the greater solution context. 
* **Message sessions**. Implement high-scale coordination of workflows and multiplexed transfers that require strict message ordering or message deferral.

If you're familiar with other message brokers like Apache ActiveMQ, Service Bus concepts are similar to what you know. As Service Bus is a platform-as-a-service (PaaS) offering, a key difference is that you don't need to worry about the following actions. Azure takes care of those chores for you. 

- Worrying about hardware failures 
- Keeping the operating systems or the products patched
- Placing logs and managing disk space
- Handling backups
- Failing over to a reserve machine

## Compliance with standards and protocols

The primary wire protocol for Service Bus is [Advanced Messaging Queueing Protocol (AMQP) 1.0](service-bus-amqp-overview.md), an open ISO/IEC standard. It allows customers to write applications that work against Service Bus and on-premises brokers such as ActiveMQ or RabbitMQ. The [AMQP protocol guide](service-bus-amqp-protocol-guide.md) provides detailed information in case you want to build such an abstraction.

[Service Bus Premium](service-bus-premium-messaging.md) is fully compliant with the Java/Jakarta EE [Java Message Service (JMS) 2.0](how-to-use-java-message-service-20.md) API. And, Service Bus Standard supports the JMS 1.1 subset focused on queues. JMS is a common abstraction for message brokers and integrates with many applications and frameworks, including the popular Spring framework. To switch from other brokers to Azure Service Bus, you just need to recreate the topology of queues and topics, and change the client provider dependencies and configuration. For an example, see the [ActiveMQ migration guide](migrate-jms-activemq-to-servicebus.md).

## Concepts and terminology 
This section discusses concepts and terminology of Service Bus.

### Queues
Messages are sent to and received from **queues**. Queues store messages until the receiving application is available to receive and process them.

![Queue](./media/service-bus-messaging-overview/about-service-bus-queue.png)

Messages in queues are ordered and timestamped on arrival. Once accepted by the broker, the message is always held durably in triple-redundant storage, spread across availability zones if the namespace is zone-enabled. Service Bus never leaves messages in memory or volatile storage after they've been reported to the client as accepted.

Messages are delivered in **pull** mode, only delivering messages when requested. Unlike the busy-polling model of some other cloud queues, the pull operation can be long-lived and only complete once a message is available. 

### Topics

You can also use **topics** to send and receive messages. While a queue is often used for point-to-point communication, topics are useful in publish/subscribe scenarios.

![Topic](./media/service-bus-messaging-overview/about-service-bus-topic.png)

Topics can have multiple, independent subscriptions, which attach to the topic and otherwise work exactly like queues from the receiver side. A subscriber to a topic can receive a copy of each message sent to that topic. Subscriptions are named entities. Subscriptions are durable by default, but can be configured to expire and then be automatically deleted. Via the JMS API, Service Bus Premium also allows you to create volatile subscriptions that exist for the duration of the connection.

You can define rules on a subscription. A subscription rule has a **filter** to define a condition for the message to be copied into the subscription and an optional **action** that can modify message metadata. For more information, see [Topic filters and actions](topic-filters.md). This feature is useful in the following scenarios:

- You don't want a subscription to receive all messages sent to a topic.
- You want to mark up messages with extra metadata when they pass through a subscription.

### Namespaces
A namespace is a container for all messaging components (queues and topics). Multiple queues and topics can be in a single namespace, and namespaces often serve as application containers. 

A namespace can be compared to a server in the terminology of other brokers, but the concepts aren't directly equivalent. A Service Bus namespace is your own capacity slice of a large cluster made up of dozens of all-active virtual machines. It may optionally span three [Azure availability zones](../availability-zones/az-overview.md). So, you get all the availability and robustness benefits of running the message broker at enormous scale. And, you don't need to worry about underlying complexities. Service Bus is serverless messaging.

## Advanced concepts
Service Bus includes advanced features such as message sessions, scheduled delivery, and transactions that enable you to solve more complex messaging problems. For more information, see [Advanced features of Azure Service Bus](advanced-features-overview.md).

## Client libraries

Fully supported Service Bus client libraries are available via the Azure SDK.

- [Azure Service Bus for .NET](/dotnet/api/overview/azure/service-bus?preserve-view=true)
- [Azure Service Bus libraries for Java](/java/api/overview/azure/servicebus?preserve-view=true)
- [Azure Service Bus provider for Java JMS 2.0](how-to-use-java-message-service-20.md)
- [Azure Service Bus Modules for JavaScript and TypeScript](/javascript/api/overview/azure/service-bus?preserve-view=true)
- [Azure Service Bus libraries for Python](/python/api/overview/azure/servicebus?preserve-view=true)

[Azure Service Bus' primary protocol is AMQP 1.0](service-bus-amqp-overview.md) and it can be used from any AMQP 1.0 compliant protocol client. Several open-source AMQP clients have samples that explicitly demonstrate Service Bus interoperability. Review the [AMQP 1.0 protocol guide](service-bus-amqp-protocol-guide.md) to understand how to use Service Bus features with AMQP 1.0 clients directly.

[!INCLUDE [messaging-oss-amqp-stacks.md](../../includes/messaging-oss-amqp-stacks.md)]

## Integration

Service Bus fully integrates with many Microsoft and Azure services, for instance:

* [Event Grid](service-bus-to-event-grid-integration-example.md)
* [Logic Apps](../connectors/connectors-create-api-servicebus.md)
* [Azure Functions](../azure-functions/functions-bindings-service-bus.md)
* [Power Platform](../connectors/connectors-create-api-servicebus.md)
* [Dynamics 365](/dynamics365/fin-ops-core/dev-itpro/business-events/how-to/how-to-servicebus)
* [Azure Stream Analytics](../stream-analytics/stream-analytics-define-outputs.md)

## Next steps

To get started using Service Bus messaging, see the following articles:

* To compare Azure messaging services, see [Comparison of services](../event-grid/compare-messaging-services.md?toc=%2fazure%2fservice-bus-messaging%2ftoc.json&bc=%2fazure%2fservice-bus-messaging%2fbreadcrumb%2ftoc.json).
* Try the quickstarts for [.NET](service-bus-dotnet-get-started-with-queues.md), [Java](service-bus-java-how-to-use-queues.md), or [JMS](service-bus-java-how-to-use-jms-api-amqp.md).
* To manage Service Bus resources, see [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases).
* To learn more about Standard and Premium tiers and their pricing, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).
* To learn about  performance and latency for the Premium tier, see [Premium Messaging](https://techcommunity.microsoft.com/t5/Service-Bus-blog/Premium-Messaging-How-fast-is-it/ba-p/370722).