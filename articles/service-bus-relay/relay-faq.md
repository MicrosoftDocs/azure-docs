<properties 
    pageTitle="Relay FAQ | Microsoft Azure"
    description="Answers some frequently-asked questions about Azure Relay."
    services="service-bus"
    documentationCenter="na"
    authors="jtaubensee"
    manager=""
    editor="" />
<tags 
    ms.service="service-bus"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na"
    ms.date="11/01/2016"
    ms.author="jotaub" />

# Relay FAQ

This article answers some frequently-asked questions about Microsoft Azure Relay. You can also visit the [Azure Support FAQ](http://go.microsoft.com/fwlink/?LinkID=185083) for general Azure pricing and support information. The following topics are included:

- [General questions about Azure Relay](#general-questions)
- [Pricing](#pricing)
- [Quotas](#quotas)
- [Subscription and namespace management](#subscription-and-namespace-management)
- [Troubleshooting](#troubleshooting)

## General questions

### What is Azure Relay?

The [Relay service](../service-bus-Relay/Relay-what-is-it.md) provides the ability to transparently host and access WCF services from anywhere. In other words, this enables hybrid applications that run in both an Azure datacenter and an on-premises enterprise environment.

### What is a Relay namespace?

A [namespace](Relay-create-namespace-portal.md) provides a scoping container for addressing Relay resources within your application. Creating one is necessary to use Relay and will be one of the first steps in getting started.

## Pricing

This section answers some frequently-asked questions about the Relay pricing structure. You can also visit the [Azure Support FAQ](http://go.microsoft.com/fwlink/?LinkID=185083) for general Microsoft Azure pricing information. For complete information about Relay pricing, see [Service Bus pricing details](https://azure.microsoft.com/pricing/details/service-bus/).

### How do you charge for Relay?

For complete information about Relay pricing, please see [Service Bus pricing details][Pricing overview]. In addition to the prices noted, you are charged for associated data transfers for egress outside of the data center in which your application is provisioned.

### What usage of Relay is subject to data transfer?

Relay includes 5 GB per month, per subscription.

### How are Relay hours calculated?

Relay hours are billed for the cumulative amount of time during which each Relay is "open" during a given billing period. A Relay is implicitly instantiated and opened at a given namespace when a Relay listener first connects to that address. The Relay is closed only when the last listener disconnects from its address. Therefore, for billing purposes a Relay is considered "open" from the time the first Relay listener connects, to the time the last Relay listener disconnects from the namespace. In other words, a Relay is considered open whenever one or more Relay listeners are connected to its Service Bus address.

### What if I have more than one listener connected to a given Relay?

In some cases, a single Relay in Service Bus may have multiple connected listeners. A Relay is considered "open" when at least one Relay listener is connected to it. Adding additional listeners to an open Relay does not change the status of that Relay for billing purposes. The number of Relay senders (clients that invoke or send messages to Relays) connected to a Relay also has no effect on the calculation of Relay hours.

### How is the messages meter calculated for Relays?

In general, billable messages are calculated for Relays using the same method as described above for brokered entities (queues, topics, and subscriptions). However, there are several notable differences:

Sending a message to a Service Bus Relay is treated as a "full through" send to the Relay listener that receives the message, rather than a send to the Service Bus Relay followed by a delivery to the Relay listener. Therefore, a request-reply style service invocation (of up to 64 KB) against a Relay listener will result in two billable messages: one billable message for the request and one billable message for the response (assuming the response is also \<= 64 KB). This differs from using a queue to mediate between a client and a service. In the latter case, the same request-reply pattern would require a request send to the queue, followed by a dequeue/delivery from the queue to the service, followed by a response send to another queue, and a dequeue/delivery from that queue to the client. Using the same (\<= 64 KB) size assumptions throughout, the mediated queue pattern would thus result in four billable messages, twice the number billed to implement the same pattern using Relay. Of course, there are benefits to using queues to achieve this pattern, such as durability and load leveling. These benefits may justify the additional expense.

Relays that are opened using the netTCPRelay WCF binding treat messages not as individual messages but as a stream of data flowing through the system. In other words, only the sender and listener have visibility into the framing of the individual messages sent/received using this binding. Thus, for Relays using the netTCPRelay binding, all data is treated as a stream for the purpose of calculating billable messages. In this case, Service Bus will calculate the total amount of data sent or received via each individual Relay on a 5-minute basis and divide that total by 64 KB in order to determine the number of billable messages for the Relay in question during that time period.

## Quotas

|Quota Name|Scope|Type|Behavior when exceeded|Value|
|---|---|---|---|---|
|Number of concurrent listeners on a relay|Entity|Static|Subsequent requests for additional connections will be rejected and an exception will be received by the calling code.|25|
|Number of concurrent relay listeners|System-wide|Static|Subsequent requests for additional connections will be rejected and an exception will be received by the calling code.|2,000|
|Number of concurrent relay connections per all relay endpoints in a service namespace|System-wide|Static|-|5,000|
|Number of relay endpoints per service namespace|System-wide|Static|-|10,000|
|Message size for [NetOnewayRelayBinding](https://msdn.microsoft.com/library/microsoft.servicebus.netonewayrelaybinding.aspx) and [NetEventRelayBinding](https://msdn.microsoft.com/library/microsoft.servicebus.neteventrelaybinding.aspx) relays|System-wide|Static|Incoming messages that exceed these quotas will be rejected and an exception will be received by the calling code.|64KB
|Message size for [HttpRelayTransportBindingElement](https://msdn.microsoft.com/library/microsoft.servicebus.httprelaytransportbindingelement.aspx) and [NetTcpRelayBinding](https://msdn.microsoft.com/library/microsoft.servicebus.nettcprelaybinding.aspx) relays|System-wide|Static|-|Unlimited|


### Does Relay have any usage quotas?

By default, for any cloud service Microsoft sets an aggregate monthly usage quota that is calculated across all of a customer's subscriptions. Because we understand that you may need more than these limits, please contact customer service at any time so that we can understand your needs and adjust these limits appropriately. For Service Bus, the aggregate usage quotas are as follows:

- 5 billion messages
- 2 million Relay hours

While we do reserve the right to disable a customer account that has exceeded its usage quotas in a given month, we will provide e-mail notification and make multiple attempts to contact a customer before taking any action. Customers exceeding these quotas will still be responsible for charges that exceed the quotas.

As with other services on Azure, Relay enforces a set of specific quotas to ensure that there is fair usage of resources. The following are the usage quotas that the service enforces:

#### Naming restrictions

A Relay namespace name can only be between 6-50 characters in length.

## Subscription and namespace management

### How do I migrate a namespace to another Azure subscription?

You can use PowerShell commands (found in the article [here][]) to move a namespace from one Azure subscription to another. In order to execute the operation, the namespace must already be active. Also the user executing the commands must be an administrator on both source and target subscriptions.

## Troubleshooting

[Exceptions overview][]

### What are some of the exceptions generated by Azure Relay APIs and their suggested actions?

The [Messaging exceptions][Exceptions overview] article describes some exceptions with suggested actions.

### What is a Shared Access Signature and which languages support generating a signature?

Shared Access Signatures are an authentication mechanism based on SHA – 256 secure hashes or URIs. For information about how to generate your own signatures in Node, PHP, Java and C\#, see the [Shared Access Signatures][] article.

## Next steps

To learn more about Service Bus messaging, see the following topics.

- [Introducing Azure Service Bus Premium messaging (blog post)](http://azure.microsoft.com/blog/introducing-azure-service-bus-premium-messaging/)
- [Introducing Azure Service Bus Premium messaging (Channel9)](https://channel9.msdn.com/Blogs/Subscribe/Introducing-Azure-Service-Bus-Premium-Messaging)
- [Service Bus messaging overview](service-bus-messaging-overview.md)
- [Azure Service Bus architecture overview](service-bus-fundamentals-hybrid-solutions.md)
- [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)

[Best practices for performance improvements using Service Bus brokered messaging]: service-bus-performance-improvements.md
[Best practices for insulating applications against Service Bus outages and disasters]: service-bus-outages-disasters.md
[Pricing overview]: https://azure.microsoft.com/pricing/details/service-bus/
[here]: service-bus-powershell-how-to-provision.md#migrate-a-namespace-to-another-azure-subscription
[Exceptions overview]: service-bus-messaging-exceptions.md
[Shared Access Signatures]: service-bus-sas-overview.md
