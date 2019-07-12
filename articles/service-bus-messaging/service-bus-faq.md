---
title: Azure Service Bus frequently asked questions (FAQ) | Microsoft Docs
description: Answers some frequently asked questions about Azure Service Bus.
services: service-bus-messaging
author: axisc
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.topic: article
ms.date: 01/23/2019
ms.author: aschhab

---
# Service Bus FAQ

This article discusses some frequently asked questions about Microsoft Azure Service Bus. You can also visit the [Azure Support FAQs](https://azure.microsoft.com/support/faq/) for general Azure pricing and support information.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## General questions about Azure Service Bus
### What is Azure Service Bus?
[Azure Service Bus](service-bus-messaging-overview.md) is an asynchronous messaging cloud platform that enables you to send data between decoupled systems. Microsoft offers this feature as a service, which means that you do not need to host your own hardware to use it.

### What is a Service Bus namespace?
A [namespace](service-bus-create-namespace-portal.md) provides a scoping container for addressing Service Bus resources within your application. Creating a namespace is necessary to use Service Bus and is one of the first steps in getting started.

### What is an Azure Service Bus queue?
A [Service Bus queue](service-bus-queues-topics-subscriptions.md) is an entity in which messages are stored. Queues are useful when you have multiple applications, or multiple parts of a distributed application that need to communicate with each other. The queue is similar to a distribution center in that multiple products (messages) are received and then sent from that location.

### What are Azure Service Bus topics and subscriptions?
A topic can be visualized as a queue and when using multiple subscriptions, it becomes a richer messaging model; essentially a one-to-many communication tool. This publish/subscribe model (or *pub/sub*) enables an application that sends a message to a topic with multiple subscriptions to have that message received by multiple applications.

### What is a partitioned entity?
A conventional queue or topic is handled by a single message broker and stored in one messaging store. Supported only in the Basic and Standard messaging tiers, a [partitioned queue or topic](service-bus-partitioning.md) is handled by multiple message brokers and stored in multiple messaging stores. This feature means that the overall throughput of a partitioned queue or topic is no longer limited by the performance of a single message broker or messaging store. In addition, a temporary outage of a messaging store does not render a partitioned queue or topic unavailable.

Ordering is not ensured when using partitioned entities. In the event that a partition is unavailable, you can still send and receive messages from the other partitions.

 Partitioned entities are no longer supported in the [Premium SKU](service-bus-premium-messaging.md). 

### What ports do I need to open on the firewall? 
You can use the following protocols with Azure Service Bus to send and receive messages:

- Advanced Message Queuing Protocol (AMQP)
- Service Bus Messaging Protocol (SBMP)
- HTTP

See the following table for the outbound ports you need to open to use these protocols to communicate with Azure Event Hubs. 

| Protocol | Ports | Details | 
| -------- | ----- | ------- | 
| AMQP | 5671 and 5672 | See [AMQP protocol guide](service-bus-amqp-protocol-guide.md) | 
| SBMP | 9350 to 9354 | See [Connectivity mode](/dotnet/api/microsoft.servicebus.connectivitymode?view=azure-dotnet) |
| HTTP, HTTPS | 80, 443 | 

### What IP addresses do I need to whitelist?
To find the right IP addresses to white list for your connections, follow these steps:

1. Run the following command from a command prompt: 

    ```
    nslookup <YourNamespaceName>.servicebus.windows.net
    ```
2. Note down the IP address returned in `Non-authoritative answer`. This IP address is static. The only point in time it would change is if you restore the namespace on to a different cluster.

If you use the zone redundancy for your namespace, you need to do a few additional steps: 

1. First, you run nslookup on the namespace.

    ```
    nslookup <yournamespace>.servicebus.windows.net
    ```
2. Note down the name in the **non-authoritative answer** section, which is in one of the following formats: 

    ```
    <name>-s1.servicebus.windows.net
    <name>-s2.servicebus.windows.net
    <name>-s3.servicebus.windows.net
    ```
3. Run nslookup for each one with suffixes s1, s2, and s3 to get the IP addresses of all three instances running in three availability zones, 


## Best practices
### What are some Azure Service Bus best practices?
See [Best practices for performance improvements using Service Bus][Best practices for performance improvements using Service Bus] – this article describes how to optimize performance when exchanging messages.

### What should I know before creating entities?
The following properties of a queue and topic are immutable. Consider this limitation when you provision your entities, as these properties cannot be modified without creating a new replacement entity.

* Partitioning
* Sessions
* Duplicate detection
* Express entity

## Pricing
This section answers some frequently asked questions about the Service Bus pricing structure.

The [Service Bus pricing and billing](https://azure.microsoft.com/pricing/details/service-bus/) article explains the billing meters in Service Bus. For specific information about Service Bus pricing options, see [Service Bus pricing details](https://azure.microsoft.com/pricing/details/service-bus/).

You can also visit the [Azure Support FAQs](https://azure.microsoft.com/support/faq/) for general Azure pricing information. 

### How do you charge for Service Bus?
For complete information about Service Bus pricing, see [Service Bus pricing details][Pricing overview]. In addition to the prices noted, you are charged for associated data transfers for egress outside of the data center in which your application is provisioned.

### What usage of Service Bus is subject to data transfer? What is not?
Any data transfer within a given Azure region is provided at no charge, as well as any inbound data transfer. Data transfer outside a region is subject to egress charges, which can be found [here](https://azure.microsoft.com/pricing/details/bandwidth/).

### Does Service Bus charge for storage?
No, Service Bus does not charge for storage. However, there is a quota limiting the maximum amount of data that can be persisted per queue/topic. See the next FAQ.

## Quotas

For a list of Service Bus limits and quotas, see the [Service Bus quotas overview][Quotas overview].

### Does Service Bus have any usage quotas?
By default, for any cloud service Microsoft sets an aggregate monthly usage quota that is calculated across all of a customer's subscriptions. If you need more than these limits, you can contact customer service at any time to understand your needs and adjust these limits appropriately. For Service Bus, the aggregate usage quota is 5 billion messages per month.

While Microsoft reserves the right to disable a customer account that has exceeded its usage quotas in a given month, e-mail notifications are sent and multiple attempts are made to contact a customer before taking any action. Customers exceeding these quotas are still responsible for charges that exceed the quotas.

As with other services on Azure, Service Bus enforces a set of specific quotas to ensure that there is fair usage of resources. You can find more details about these quotas in the [Service Bus quotas overview][Quotas overview].

### How to handle messages of size > 1 MB?
Service Bus messaging services (queues and topics/subscriptions) allow application to send messages of size up to 256 KB (standard tier) or 1 MB (premium tier). If you are dealing with messages of size greater than 1 MB, use the claim check pattern described in [this blog post](https://www.serverless360.com/blog/deal-with-large-service-bus-messages-using-claim-check-pattern).

## Troubleshooting
### Why am I not able to create a namespace after deleting it from another subscription? 
When you delete a namespace from a subscription, wait for 4 hours before recreating it with the same name in another subscription. Otherwise, you may receive the following error message: `Namespace already exists`. 

### What are some of the exceptions generated by Azure Service Bus APIs and their suggested actions?
For a list of possible Service Bus exceptions, see [Exceptions overview][Exceptions overview].

### What is a Shared Access Signature and which languages support generating a signature?
Shared Access Signatures are an authentication mechanism based on SHA-256 secure hashes or URIs. For information about how to generate your own signatures in Node.js, PHP, Java, and C\#, see the [Shared Access Signatures][Shared Access Signatures] article.

## Subscription and namespace management
### How do I migrate a namespace to another Azure subscription?

You can move a namespace from one Azure subscription to another, using either the [Azure portal](https://portal.azure.com) or PowerShell commands. In order to execute the operation, the namespace must already be active. The user executing the commands must be an administrator on both the source and target subscriptions.

#### Portal

To use the Azure portal to migrate Service Bus namespaces to another subscription, follow the directions [here](../azure-resource-manager/resource-group-move-resources.md#use-the-portal). 

#### PowerShell

The following sequence of PowerShell commands moves a namespace from one Azure subscription to another. To execute this operation, the namespace must already be active, and the user running the PowerShell commands must be an administrator on both the source and target subscriptions.

```powershell
# Create a new resource group in target subscription
Select-AzSubscription -SubscriptionId 'ffffffff-ffff-ffff-ffff-ffffffffffff'
New-AzResourceGroup -Name 'targetRG' -Location 'East US'

# Move namespace from source subscription to target subscription
Select-AzSubscription -SubscriptionId 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
$res = Find-AzResource -ResourceNameContains mynamespace -ResourceType 'Microsoft.ServiceBus/namespaces'
Move-AzResource -DestinationResourceGroupName 'targetRG' -DestinationSubscriptionId 'ffffffff-ffff-ffff-ffff-ffffffffffff' -ResourceId $res.ResourceId
```

## Next steps
To learn more about Service Bus, see the following articles:

* [Introducing Azure Service Bus Premium (blog post)](https://azure.microsoft.com/blog/introducing-azure-service-bus-premium-messaging/)
* [Introducing Azure Service Bus Premium (Channel9)](https://channel9.msdn.com/Blogs/Subscribe/Introducing-Azure-Service-Bus-Premium-Messaging)
* [Service Bus overview](service-bus-messaging-overview.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)

[Best practices for performance improvements using Service Bus]: service-bus-performance-improvements.md
[Best practices for insulating applications against Service Bus outages and disasters]: service-bus-outages-disasters.md
[Pricing overview]: https://azure.microsoft.com/pricing/details/service-bus/
[Quotas overview]: service-bus-quotas.md
[Exceptions overview]: service-bus-messaging-exceptions.md
[Shared Access Signatures]: service-bus-sas.md
