---
title: Azure Service Bus frequently asked questions (FAQ) | Microsoft Docs
description: Answers some frequently-asked questions about Azure Service Bus.
services: service-bus-messaging
documentationcenter: na
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: cc75786d-3448-4f79-9fec-eef56c0027ba
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/09/2017
ms.author: sethm;jotaub

---
# Service Bus FAQ
This article answers some frequently-asked questions about Microsoft Azure Service Bus. You can also visit the [Azure Support FAQ](http://go.microsoft.com/fwlink/?LinkID=185083) for general Azure pricing and support information.

## General questions about Azure Service Bus
### What is Azure Service Bus?
[Azure Service Bus](service-bus-messaging-overview.md) is an asynchronous messaging cloud platform that enables you to send data between decoupled systems. Microsoft offers this feature as a service, which means that you do not need to host any of your own hardware in order to use it.

### What is a Service Bus namespace?
A [namespace](service-bus-create-namespace-portal.md) provides a scoping container for addressing Service Bus resources within your application. Creating one is necessary to use Service Bus and will be one of the first steps in getting started.

### What is an Azure Service Bus queue?
A [Service Bus queue](service-bus-queues-topics-subscriptions.md) is an entity in which messages are stored. Queues are particularly useful when you have multiple applications, or multiple parts of a distributed application that need to communicate with each other. The queue is similar to a distribution center in that multiple products (messages) are received and then sent from that location.

### What are Azure Service Bus topics and subscriptions?
A topic can be visualized as a queue and when using multiple subscriptions, it becomes a richer messaging model; essentially a one-to-many communication tool. This publish/subscribe model (or *pub/sub*) enables an application that sends a message to a topic with multiple subscriptions to have that message received by multiple applications.

### What is a partitioned entity?
A conventional queue or topic is handled by a single message broker and stored in one messaging store. A [partitioned queue or topic](service-bus-partitioning.md) is handled by multiple message brokers and stored in multiple messaging stores. This means that the overall throughput of a partitioned queue or topic is no longer limited by the performance of a single message broker or messaging store. In addition, a temporary outage of a messaging store does not render a partitioned queue or topic unavailable.

Note that ordering is not ensured when using partitioning entities. In the event that a partition is unavailable, you can still send and receive messages from the other partitions.

## Best practices
### What are some Azure Service Bus best practices?
* [Best practices for performance improvements using Service Bus][Best practices for performance improvements using Service Bus] – this article describes how to optimize performance when exchanging messages.

### What should I know before creating entities?
The following properties of a queue and topic are immutable. Please take this into account when you provision your entities as this cannot be modified, without creating a new replacement entity.

* Size
* Partitioning
* Sessions
* Duplicate detection
* Express entity

## Pricing
This section answers some frequently-asked questions about the Service Bus pricing structure. You can also visit the [Azure Support FAQ](http://go.microsoft.com/fwlink/?LinkID=185083) for general Microsoft Azure pricing information. For complete information about Service Bus pricing, see [Service Bus pricing details](https://azure.microsoft.com/pricing/details/service-bus/).

### How do you charge for Service Bus?
For complete information about Service Bus pricing, please see [Service Bus pricing details][Pricing overview]. In addition to the prices noted, you are charged for associated data transfers for egress outside of the data center in which your application is provisioned.

### What usage of Service Bus is subject to data transfer? What is not?
Any data transfer within a given Azure region is provided at no charge, as well as any inbound data transfer. Data transfer outside a region is subject to egress charges which can be found [here](https://azure.microsoft.com/pricing/details/bandwidth/).

### Does Service Bus charge for storage?
No, Service Bus does not charge for storage. However, there is a quota limiting the maximum amount of data that can be persisted per queue/topic. See the next FAQ.

## Quotas
For a list of Service Bus limits and quotas, see [Quotas overview][Quotas overview].

### Does Service Bus have any usage quotas?
By default, for any cloud service Microsoft sets an aggregate monthly usage quota that is calculated across all of a customer's subscriptions. Because we understand that you may need more than these limits, please contact customer service at any time so that we can understand your needs and adjust these limits appropriately. For Service Bus, the aggregate usage quotas is 5 billion messages per month.

While we do reserve the right to disable a customer account that has exceeded its usage quotas in a given month, we will provide e-mail notification and make multiple attempts to contact a customer before taking any action. Customers exceeding these quotas will still be responsible for charges that exceed the quotas.

As with other services on Azure, Service Bus enforces a set of specific quotas to ensure that there is fair usage of resources. The following are the usage quotas that the service enforces:

#### Queue/topic size
You specify the maximum queue or topic size upon creation of the queue or topic. This quota can have a value of 1, 2, 3, 4, or 5 GB. If the maximum size is reached, additional incoming messages will be rejected and an exception will be received by the calling code.

#### Naming restrictions
A Service Bus namespace name can only be between 6-50 characters in length. The character count limit for each queue, topic, or subscription is between 1-50 characters.

#### Number of concurrent connections
Queue/Topic/Subscription - The number of concurrent TCP connections on a queue/topic/subscription is limited to 100. If this quota is reached, subsequent requests for additional connections will be rejected and an exception will be received by the calling code. For every messaging factory, Service Bus maintains one TCP connection if any of the clients created by that messaging factory have an active operation pending, or have completed an operation less than 60 seconds ago. REST operations do not count towards concurrent TCP connections.

#### Number of topics/queues per service namespace
The maximum number of topics/queues (durable storage-backed entities) on a service namespace is limited to 10,000. If this quota is reached, subsequent requests for creation of a new topic/queue on the service namespace will be rejected. In this case, the Azure classic portal will display an error message or the calling client code will receive an exception, depending on whether the create attempt was done via the portal or in client code.

### Message size quotas
#### Queue/Topic/Subscription
**Message size** – Each message is limited to a total size of 256KB, including message headers.

**Message header size** – Each message header is limited to 64KB.

Messages that exceed these size quotas will be rejected and an exception will be received by the calling code.

**Number of subscriptions per topic** – The maximum number of subscriptions per topic is limited to 2,000. If this quota is reached, subsequent requests for creating additional subscriptions to the topic will be rejected. In this case, the Azure classic portal will display an error message or the calling client code will receive an exception, depending on whether the create attempt was done via the portal or in client code.

**Number of SQL filters per topic** – The maximum number of SQL filters per topic is limited to 2,000. If this quota is reached, any subsequent requests for creation of additional filters on the topic will be rejected and an exception will be received by the calling code.

**Number of correlation filters per topic** – The maximum number of correlation filters per topic is limited to 100,000. If this quota is reached, any subsequent requests for creation of additional filters on the topic will be rejected and an exception will be received by the calling code.

## Troubleshooting
### What are some of the exceptions generated by Azure Service Bus APIs and their suggested actions?
For a list of possible Service Bus exceptions, see [Exceptions overview][Exceptions overview].

### What is a Shared Access Signature and which languages support generating a signature?
Shared Access Signatures are an authentication mechanism based on SHA – 256 secure hashes or URIs. For information about how to generate your own signatures in Node, PHP, Java and C\#, see the [Shared Access Signatures][Shared Access Signatures] article.

## Subscription and namespace management
### How do I migrate a namespace to another Azure subscription?
Using the Azure portal, you can migrate Service Bus namespaces to another subscription by following the directions [here](../azure-resource-manager/resource-group-move-resources.md#use-portal). If you prefer to use PowerShell, follow the instructions below: 

The following sequence of commands moves a namespace from one Azure subscription to another. To execute this operation, the namespace must already be active, and the user running the PowerShell commands must be an administrator on both the source and target subscriptions.

```powershell
# Create a new resource group in target subscription
Select-AzureRmSubscription -SubscriptionId 'ffffffff-ffff-ffff-ffff-ffffffffffff'
New-AzureRmResourceGroup -Name 'targetRG' -Location 'East US'

# Move namespace from source subscription to target subscription
Select-AzureRmSubscription -SubscriptionId 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
$res = Find-AzureRmResource -ResourceNameContains mynamespace -ResourceType 'Microsoft.ServiceBus/namespaces'
Move-AzureRmResource -DestinationResourceGroupName 'targetRG' -DestinationSubscriptionId 'ffffffff-ffff-ffff-ffff-ffffffffffff' -ResourceId $res.ResourceId
```

## Next steps
To learn more about Service Bus, see the following topics.

* [Introducing Azure Service Bus Premium (blog post)](http://azure.microsoft.com/blog/introducing-azure-service-bus-premium-messaging/)
* [Introducing Azure Service Bus Premium (Channel9)](https://channel9.msdn.com/Blogs/Subscribe/Introducing-Azure-Service-Bus-Premium-Messaging)
* [Service Bus overview](service-bus-messaging-overview.md)
* [Azure Service Bus architecture overview](service-bus-fundamentals-hybrid-solutions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)

[Best practices for performance improvements using Service Bus]: service-bus-performance-improvements.md
[Best practices for insulating applications against Service Bus outages and disasters]: service-bus-outages-disasters.md
[Pricing overview]: https://azure.microsoft.com/pricing/details/service-bus/
[Quotas overview]: service-bus-quotas.md
[Exceptions overview]: service-bus-messaging-exceptions.md
[Shared Access Signatures]: service-bus-sas-overview.md
