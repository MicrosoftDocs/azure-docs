<properties 
   pageTitle="Service Bus Pricing FAQ | Microsoft Azure"
   description="Answers some frequently-asked questions about the Service Bus pricing structure."
   services="service-bus"
   documentationCenter="na"
   authors="sethmanheim"
   manager="timlt"
   editor="tysonn" />
<tags 
   ms.service="service-bus"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/09/2015"
   ms.author="sethm" />

# Service Bus Pricing FAQ

This section answers some frequently-asked questions about the Service Bus pricing structure. You can also visit the [Azure Support FAQ](http://go.microsoft.com/fwlink/?LinkID=185083) for general Microsoft Azure pricing information. For complete information about Service Bus pricing, see [Service Bus pricing details](http://azure.microsoft.com/pricing/details/service-bus/).

>[AZURE.NOTE] The pricing structure for Event Hubs is described in the [Event Hubs availability and support FAQ](event-hubs-availability-and-support-faq.md) topic, with more information in the [Event Hubs pricing](http://azure.microsoft.com/pricing/details/event-hubs/) topic.

- [How do you charge for Service Bus?](#how-do-you-charge-for-service-bus)
- [What usage of Service Bus is subject to data transfer? What is not?](#what-usage-of-service-bus-is-subject-to-data-transfer-what-is-not)
- [What exactly is a Service Bus “relay”?](#what-exactly-is-a-service-bus-quotrelayquot)
- [How is the Relay Hours meter calculated?](#how-is-the-relay-hours-meter-calculated)
- [What if I have more than one listener connected to a given relay?](#what-if-i-have-more-than-one-listener-connected-to-a-given-relay)
- [How is the Messages meter calculated for relays?](#how-is-the-messages-meter-calculated-for-relays)
- [Does Service Bus charge for storage?](#does-service-bus-charge-for-storage)
- [Does Service Bus have any usage quotas?](#does-service-bus-have-any-usage-quotas)

## How do you charge for Service Bus?

For complete information about Service Bus pricing, see [Service Bus Pricing and Billing](https://msdn.microsoft.com/library/dn831889.aspx) and [Service Bus Pricing Details](http://azure.microsoft.com/pricing/details/service-bus/). In addition to the prices noted, you are charged for associated data transfers for egress outside of the data center in which your application is provisioned. You can find more details in the [What usage of Service Bus is subject to data transfer? What is not?](#what-usage-of-service-bus-is-subject-to-data-transfer-what-is-not) section below.

## What usage of Service Bus is subject to data transfer? What is not?

Any data transfer within a given Azure region is provided at no charge. Any data transfer outside a region is subject to egress charges at the rate of $0.15 per GB from the North America and Europe regions, and $0.20 per GB from the Asia-Pacific region. Any inbound data transfer is provided at no charge.

## What exactly is a Service Bus "relay"?

A relay is a Service Bus entity that relays messages between clients and Web services. The relay provides the service with a persistent, discoverable Service Bus address, reliable connectivity with firewall/NAT traversal capabilities, and additional features such as automatic load balancing. A relay is implicitly instantiated and opened at a given Service Bus address (namespace URL) whenever a relay-enabled WCF service, or “relay listener,” first connects to that address. Applications create relay listeners by using the Service Bus .NET managed API, which provides special relay-enabled versions of the standard WCF bindings.

## How is the Relay Hours meter calculated?

Relay hours are billed for the cumulative amount of time during which each Service Bus relay is “open” during a given billing period. A relay is implicitly instantiated and opened at a given Service Bus address (service namespace URL) when a relay-enabled WCF service, or “Relay listener,” first connects to that address. The relay is closed only when the last listener disconnects from its address. Therefore, for billing purposes a relay is considered “open” from the time the first relay listener connects, to the time the last relay listener disconnects from the Service Bus address of that relay. In other words, a relay is considered “open” whenever one or more relay listeners are connected to its Service Bus address.

## What if I have more than one listener connected to a given relay?

In some cases, a single relay in Service Bus may have multiple connected listeners. This can occur with load-balanced services that use the **netTCPRelay** or **HttpRelay** WCF bindings, or with broadcast event listeners that use the **netEventRelay** WCF binding. A relay in Service Bus is considered "open" when at least one relay listener is connected to it. Adding additional listeners to an open relay does not change the status of that relay for billing purposes. The number of relay senders (clients that invoke or send messages to relays) connected to a relay also has no effect on the calculation of relay hours.

## How is the messages meter calculated for relays?

In general, billable messages are calculated for relays using the same method as described above for brokered entities (queues, topics, and subscriptions). However, there are several notable differences:

1. Sending a message to a Service Bus relay is treated as a “full through” send to the relay listener that receives the message, rather than a send to the Service Bus relay followed by a delivery to the relay listener. Therefore, a request-reply style service invocation (of up to 64 KB) against a relay listener will result in two billable messages: one billable message for the request and one billable message for the response (assuming the response is also <= 64 KB). This differs from using a queue to mediate between a client and a service. In the latter case, the same request-reply pattern would require a request send to the queue, followed by a dequeue/delivery from the queue to the service, followed by a response send to another queue, and a dequeue/delivery from that queue to the client. Using the same (<= 64 KB) size assumptions throughout, the mediated queue pattern would thus result in four billable messages, twice the number billed to implement the same pattern using relay. Of course, there are benefits to using queues to achieve this pattern, such as durability and load leveling. These benefits may justify the additional expense.

2. Relays that are opened using the **netTCPRelay** WCF binding treat messages not as individual messages but as a stream of data flowing through the system. In other words, only the sender and listener have visibility into the framing of the individual messages sent/received using this binding. Thus, for relays using the **netTCPRelay** bindng, all data is treated as a stream for the purpose of calculating billable messages. In this case, Service Bus will calculate the total amount of data sent or received via each individual relay on a 5-minute basis and divide that total by 64 KB in order to determine the number of billable messages for the relay in question during that time period.

## Does Service Bus charge for storage?

No, Service Bus does not charge for storage. However, there is a quota limiting the maximum amount of data that can be persisted per queue/topic. See the next FAQ.

## Does Service Bus have any usage quotas?

By default, for any cloud service Microsoft sets an aggregate monthly usage quota that is calculated across all of a customer’s subscriptions. Because we understand that you may need more than these limits, please contact customer service at any time so that we can understand your needs and adjust these limits appropriately. For Service Bus, the aggregate usage quotas are as follows:

- 5 billion messages

- 2 million relay hours

While we do reserve the right to disable a customer's account that has exceeded its usage quotas in a given month, we will provide e-mail notification and make multiple attempts to contact a customer before taking any action. Customers exceeding these quotas will still be responsible for charges that exceed the quotas.

As with other services on Azure, Service Bus enforces a set of specific quotas to ensure that there is fair usage of resources. The following are the usage quotas that the service enforces:

- **Queue/topic size** – You specify the maximum queue or topic size upon creation of the queue or topic. This quota can have a value of 1, 2, 3, 4, or 5 GB. If the maximum size is reached, additional incoming messages will be rejected and an exception will be received by the calling code.

- **Number of concurrent connections**
	- **Queue/Topic/Subscription** - The number of concurrent TCP connections on a queue/topic/subscription is limited to 100. If this quota is reached, subsequent requests for additional connections will be rejected and an exception will be received by the calling code. For every messaging factory, Service Bus maintains one TCP connection if any of the clients created by that messaging factory have an active operation pending, or have completed an operation less than 60 seconds ago. REST operations do not count towards concurrent TCP connections.


- **Number of concurrent listeners on a relay** – The number of concurrent **netTcpRelay** and **netHttpRelay ** listeners on a relay is limited to 25 (1 for a **NetOneway** relay).

- **Number of concurrent relay listeners per namespace** – Service Bus enforces a limit of 2000 concurrent relay listeners per service namespace. If this quota is reached, subsequent requests to open additional relay listeners will be rejected and an exception will be received by the calling code.

- **Number of topics/queues per service namespace** – The maximum number of topics/queues (durable storage-backed entities) on a service namespace is limited to 10,000. If this quota is reached, subsequent requests for creation of a new topic/queue on the service namespace will be rejected. In this case, the Azure portal will display an error message or the calling client code will receive an exception, depending on whether the create attempt was done via the portal or in client code.

- **Message size quotas**
	- **Queue/Topic/Subscription**
		- **Message size** – Each message is limited to a total size of 256KB, including message headers.
		- **Message header size** – Each message header is limited to 64KB.

	- **NetOneway and NetEvent relays** - Each message is limited to a total size of 64KB, including message headers.
	- **Http and NetTcp relays** – Service Bus does not enforce an upper bound on the size of these messages.

	Messages that exceed these size quotas will be rejected and an exception will be received by the calling code.

- **Number of subscriptions per topic** – The maximum number of subscriptions per topic is limited to 2,000. If this quota is reached, subsequent requests for creating additional subscriptions to the topic will be rejected. In this case, the management portal will display an error message or the calling client code will receive an exception, depending on whether the create attempt was done via the portal or in client code.

- **Number of SQL filters per topic** – The maximum number of SQL filters per topic is limited to 2,000. If this quota is reached, any subsequent requests for creation of additional filters on the topic will be rejected and an exception will be received by the calling code.

- **Number of correlation filters per topic** – The maximum number of correlation filters per topic is limited to 100,000. If this quota is reached, any subsequent requests for creation of additional filters on the topic will be rejected and an exception will be received by the calling code.

For more information about quotas, see [Service Bus quotas](service-bus-quotas.md).

## Next steps

To learn more about Service Bus messaging, see the following topics.

- [Introducing Azure Service Bus Premium messaging (blog post)](http://azure.microsoft.com/blog/introducing-azure-service-bus-premium-messaging/)
- [Introducing Azure Service Bus Premium messaging (Channel9)](https://channel9.msdn.com/Blogs/Subscribe/Introducing-Azure-Service-Bus-Premium-Messaging)
- [Service Bus messaging overview](service-bus-messaging-overview.md)
- [Azure Service Bus Architectural Overview](fundamentals-service-bus-hybrid-solutions.md)
- [How to use Service Bus queues](service-bus-dotnet-how-to-use-queues.md)