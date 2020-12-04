---
title: Azure Service Bus messaging overview | Microsoft Docs
description: This article provides a high level overview of Azure Service Bus, a fully managed enterprise integration message broker. 
ms.topic: overview
ms.date: 11/20/2020
---

# What is Azure Service Bus?

Microsoft Azure Service Bus is a fully managed enterprise message broker with message queues and public-subscribe topics. Service Bus is used to decouple applications and services from each other, for load balancing work across competing workers, for safely routing and transferring data and control across service and application boundaries, and for coordinating transactional work that requires a high-degree of reliability. 

Data is transferred between different applications and services using *messages*. A message is a container decorated with metadata, and can contain any kind of information, including structured data encoded with common formats such as JSON, XML, Apache Avro, or Plain Text. 

Some common messaging scenarios are:

* *Messaging*. Transfer business data, such as sales or purchase orders, journals, or inventory movements.
* *Decouple applications*. Improve reliability and scalability of applications and services. Producer and consumer don't have to be online or readily available at the same time, and [load is leveled](https://docs.microsoft.com/azure/architecture/patterns/queue-based-load-leveling) such that traffic spikes don't overtax a service. 
* *Load Balancing*. Allow for multiple [competing consumers](https://docs.microsoft.com/azure/architecture/patterns/competing-consumers) to read from a queue at the same time, each safely obtaining exclusive ownership to specific messages. 
* *Topics and subscriptions*. Enable 1:*n* relationships between [publishers and subscribers](https://docs.microsoft.com/azure/architecture/patterns/publisher-subscriber), allowing subscribers to select particular messages from a published message stream.
* *Transactions*. Allow for a message to be obtained from one queue, the result of processing to be posted to one or more different queues, and then remove the input message from the original queue, all in the scope of an atomic transaction. This ensures that results of a transaction only become visible to downstream consumers upon success, including the successful settlement of input message, allowing for once-only processing semantics. This transaction model is a robust foundation for the [compensating transactions](https://docs.microsoft.com/azure/architecture/patterns/compensating-transaction.md) pattern in the greater solution context. 
* *Message sessions*. Implement high-scale coordination of workflows and multiplexed transfers that require strict message ordering or message deferral.

If you are familiar with message brokers like IBM MQ, VMWare RabbitMQ, Red Hat A-MQ, or Apache ActiveMQ, you will find that Azure Service Bus' concepts are quite similar to what you know. With Service Bus being a platform-as-a-service offering, a key difference to those software packages is that you don't need to worry about placing logs and managing disk space, handling backups, keeping the operating systems or the products patched, or worrying about hardware failures and failing over to a reserve machine. Azure takes care of those chores for you. 

Service Bus' primary wire protocol is [Advanced Messaging Queueing Protocol (AMQP) 1.0](service-bus-amqp-overview.md), an open ISO/IEC standard developed by a large consortium of platform vendors and users, which allows customers to write applications that alternatively work against Service Bus and on-premises brokers such as ActiveMQ or RabbitMQ. The [AMQP protocol guide](service-bus-amqp-protocol-guide.md) provides detailed information in case you want to build such an abstraction.

[Service Bus Premium](service-bus-premium-messaging.md) is fully compliant with the Java/Jakarta EE [Java Message Service (JMS) 2.0](how-to-use-java-message-service-20.md) API, and Service Bus Standard supports the JMS 1.1 subset focused on queues. JMS is a common abstraction for message brokers for Java developers and integrates with many applications and frameworks, including the popular Spring framework. Switching from one of the one of the brokers mentioned above to Azure Service Bus is often mostly just a matter of recreating the topology of queues and topics and changing the client provider dependencies and configuration, as explained, for example, in [the ActiveMQ migration guide](migrate-jms-activemq-to-servicebus.md).

## Service Bus Concepts and Terminology 

This section discusses concepts and terminology of Service Bus.
### Namespaces

A namespace is a container for all messaging components. Multiple queues and topics can be in a single namespace, and namespaces often serve as application containers. 

A namespace can be compared to a "server" in the terminology of other brokers, but the concepts are not directly equivalent. A Service Bus namespace is your own capacity slice of a large cluster made up of dozens of all-active virtual machines that may optionally span three [Azure availability zones](../availability-zones/az-overview.md), meaning you get all the availability and robustness benefits of running the broker at enormous scale without any of the underlying complexity getting in your way. Service Bus is "serverless" messaging.

### Queues

Messages are sent to and received from *queues*. Queues store messages until the receiving application is available to receive and process them.

![Queue](./media/service-bus-messaging-overview/about-service-bus-queue.png)

Messages in queues are ordered and timestamped on arrival. Once accepted by the broker, the message is always held durably in triple-redundant storage, spread across availability zones if the namespace is zone-enabled. Service Bus never leaves messages in memory or volatile storage after they have been reported to the client as accepted (=the send operation succeeded).

Messages are delivered in *pull* mode, only delivering messages when requested. Unlike the busy-polling model of some other cloud queues, the pull operation can be long-lived and only complete once a message is available. 

### Topics

You can also use *topics* to send and receive messages. While a queue is often used for point-to-point communication, topics are useful in publish/subscribe scenarios.

![Topic](./media/service-bus-messaging-overview/about-service-bus-topic.png)

Topics can have multiple, independent subscriptions which attach to the topic and otherwise work exactly like queues from the receiver side. A subscriber to a topic can receive a copy of each message sent to that topic. Subscriptions are named entities. Subscriptions are durable by default, but can be configured to expire and then be automatically deleted. Via the JMS API, Service Bus Premium also supports volatile subscriptions that are dynamically created and only exists for the duration of the connection.

If you don't want individual subscriptions to receive all messages sent to a topic and/or if you want to mark up messages with extra metadata when they pass through a subscription, you can use *subscription rules*. A subscription rule has a *filter* to define a condition for when the message becomes eligible for being copied into the subscription and an optional *action* that can modify message metadata. For more information, see [Topic filters and actions](topic-filters.md).

## Advanced features

Service Bus includes advanced features that enable you to solve more complex messaging problems. The following sections describe several of these features.

### Message sessions

To create a first-in, first-out (FIFO) guarantee in Service Bus, use sessions. Message sessions enable exclusive, ordered handling of unbounded sequences of related messages. To allow for handling sessions in high-scale, high-availability systems, the session feature also allows for storing session state, which allows sessions to safely move between handlers. For more information, see [Message sessions: first in, first out (FIFO)](message-sessions.md).

### Autoforwarding

The auto-forwarding feature chains a queue or subscription to another queue or topic inside the same namespace, enabling various useful topology patterns. With auto-forwarding, Service Bus automatically moves messages from a queue or subscription to a target queue or topic; all such moves are performed transactionally. For more information, see [Chaining Service Bus entities with auto-forwarding](service-bus-auto-forwarding.md).

### Dead-letter queue

All Service Bus queues and topic subscriptions have an associated dead-letter queue (DLQ). A DLQ holds messages that could not be delivered successfully to any receiver, timed out, or have been explicitly sidelined by the receiving application. Messages in the dead-letter queue are annotated with the reason why they have been placed there. The dead-letter queue has a special endpoint, but otherwise acts like any regular queue, which means an application or tool can browse it or dequeue from it. You can also auto-forward out of a dead-letter queue. For more information, see [Overview of Service Bus dead-letter queues](service-bus-dead-letter-queues.md).

### Scheduled delivery

You can submit messages to a queue or topic for delayed processing, setting a time when the message will become available for consumption. Scheduled messages can also be cancelled. For more information, see [Scheduled messages](message-sequencing.md#scheduled-messages).

### Message deferral

A queue or subscription client can defer retrieval of a received message until a later time. A reason for deferral might be that the message has been posted out of an expected order and needs to be set aside until another message has been received. Deferred messages remain in the queue or subscription and must be reactivated explicitly using their service-assigned sequence number. For more information, see [Message deferral](message-deferral.md).

### Batching

Client-side batching enables a queue or topic client to accumulate a set of messages and transfer them together. This is often done to either save bandwidth or to increase throughput. For more information, see [Client-side batching](service-bus-performance-improvements.md#client-side-batching).

### Transactions

A transaction groups two or more operations together into an *execution scope*. Service Bus supports grouping operations against a multiple messaging entities within the scope of a single transaction, but only one of those entities may be received from. A message entity can be a queue, topic, or subscription. For more information, see [Overview of Service Bus transaction processing](service-bus-transactions.md).

### Auto-delete on idle

Autodelete on idle enables you to specify an idle interval after which a queue or topic subscription is automatically deleted. The minimum duration is 5 minutes. For more information, see the [QueueDescription.AutoDeleteOnIdle Property](/dotnet/api/microsoft.servicebus.messaging.queuedescription.autodeleteonidle).

### Duplicate detection

If an error causes the client to have a doubts about the outcome of a send operation, duplicate detection enables the sender to resend the same message again and for the broker to drop a potential duplicate. The duplicate detection is based on tracking the `message-id` property of a message, meaning the application needs to take care to use the same value for the resend, which might be directly derived from some application-specific context. For more information, see [Duplicate detection](duplicate-detection.md).

### Geo-disaster recovery

When Azure regions or datacenters experience downtime, the disaster recovery feature enables data processing to continue operating in a different region or datacenter by keeping a structural mirror of a Service Bus namespace available in the secondary region and allowing the namespace identity to switch to the secondary namespace. Already posted messages remain in the former primary namespace for recovery once the availability episode subsides. For more information, see [Azure Service Bus Geo-disaster recovery](service-bus-geo-dr.md).

### Security

Service Bus supports standard [AMQP 1.0](service-bus-amqp-overview.md) and [HTTP/REST](/rest/api/servicebus/) protocols and their respective security facilities, including transport level security (TLS). Clients can be authorized for access using the Service Bus native [Shared Access Signature](service-bus-sas.md) model or with [Azure Active Directory](service-bus-authentication-and-authorization.md) role-based security, either using regular service accounts or Azure managed identities. 

For protection against unwanted traffic, Service Bus provides a range of [network security features](network-security.md), including an IP filtering firewall and integration with Azure and on-premises virtual networks.

## Client libraries

Fully supported Service Bus client libraries are available via the Azure SDK.

- [Azure Service Bus for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/service-bus?view=azure-dotnet&preserve-view=true)
- [Azure Service Bus libraries for Java](https://docs.microsoft.com/java/api/overview/azure/servicebus?view=azure-java-stable&preserve-view=true)
- [Azure Service Bus provider for Java JMS 2.0](how-to-use-java-message-service-20.md)
- [Azure Service Bus Modules for JavaScript and TypeScript](https://docs.microsoft.com/javascript/api/overview/azure/service-bus?view=azure-node-latest&preserve-view=true)
- [Azure Service Bus libraries for Python](https://docs.microsoft.com/python/api/overview/azure/servicebus?view=azure-python&preserve-view=true)

[Azure Service Bus' primary protocol is AMQP 1.0](service-bus-amqp-overview.md) and it can be used from any AMQP 1.0 compliant protocol client. Several open source AMQP clients have samples that explicitly demonstrate Service Bus interoperability. Please review the [AMQP 1.0 protocol guide](service-bus-amqp-protocol-guide.md) to understand how to use Service Bus'
features with AMQP 1.0 clients directly.

[!INCLUDE [messaging-oss-amqp-stacks.md](../../includes/messaging-oss-amqp-stacks.md)]

## Integration

Service Bus fully integrates with many Microsoft and Azure services, for instance:

* [Event Grid](https://azure.microsoft.com/services/event-grid/)
* [Logic Apps](https://azure.microsoft.com/services/logic-apps/)
* [Azure Functions](https://azure.microsoft.com/services/functions/)
* [Power Platform](https://powerplatform.microsoft.com/)
* [Dynamics 365](https://dynamics.microsoft.com)
* [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)

## Next steps

To get started using Service Bus messaging, see the following articles:

* To compare Azure messaging services, see [Comparison of services](../event-grid/compare-messaging-services.md?toc=%2fazure%2fservice-bus-messaging%2ftoc.json&bc=%2fazure%2fservice-bus-messaging%2fbreadcrumb%2ftoc.json).
* Try the quickstarts for [.NET](service-bus-dotnet-get-started-with-queues.md), [Java](service-bus-java-how-to-use-queues.md), or [JMS](service-bus-java-how-to-use-jms-api-amqp.md).
* To manage Service Bus resources, see [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases).
* To learn more about Standard and Premium tiers and their pricing, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).
* To learn about  performance and latency for the Premium tier, see [Premium Messaging](https://techcommunity.microsoft.com/t5/Service-Bus-blog/Premium-Messaging-How-fast-is-it/ba-p/370722).
