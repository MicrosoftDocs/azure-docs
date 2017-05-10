---
title: Azure Service Bus Premium and Standard Messaging pricing tiers overview | Microsoft Docs
description: Service Bus Premium and Standard Messaging tiers
services: service-bus-messaging
documentationcenter: .net
author: djrosanova
manager: timlt
editor: ''

ms.assetid: e211774d-821c-4d79-8563-57472d746c58
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/28/2017
ms.author: darosa;sethm;jotaub

---
# Service Bus Premium and Standard messaging tiers

Service Bus Messaging, which includes entities such as queues and topics, combines enterprise messaging capabilities with rich publish-subscribe semantics at cloud scale. Service Bus Messaging is used as the communication backbone for many sophisticated cloud solutions.

The *Premium* tier of Service Bus Messaging addresses common customer requests around scale, performance, and availability for mission-critical applications. Although the feature sets are nearly identical, these two tiers of Service Bus Messaging are designed to serve different use cases.

Some high-level differences are highlighted in the following table.

| Premium | Standard |
| --- | --- |
| High throughput |Variable throughput |
| Predictable performance |Variable latency |
| Fixed pricing |Pay as you go variable pricing |
| Ability to scale workload up and down |N/A |
| Message size up to 1 MB |Message size up to 256 KB |

**Service Bus Premium Messaging** provides resource isolation at the CPU and memory level so that each customer workload runs in isolation. This resource container is called a *messaging unit*. Each premium namespace is allocated at least one messaging unit. You can purchase 1, 2, or 4 messaging units for each Service Bus Premium namespace. A single workload or entity can span multiple messaging units and the number of messaging units can be changed at will, although billing is in 24-hour or daily rate charges. The result is predictable and repeatable performance for your Service Bus-based solution.

Not only is this performance more predictable and available, but it is also faster. Service Bus Premium Messaging builds on the storage engine introduced in [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/). With Premium Messaging, peak performance is much faster than with the Standard tier.

## Premium Messaging technical differences

The following sections discuss a few differences between Premium and Standard messaging tiers.

### Partitioned queues and topics

Partitioned queues and topics are supported in Premium Messaging; in fact these entities are always partitioned (and cannot be disabled). However, Premium partitioned queues and topics do not function the same way as in the Standard and Basic tiers of Service Bus messaging. Premium messaging does not use SQL as a data store and no longer has the possible resource competition associated with a shared platform. As a result, partitioning is not necessary to improve performance. Additionally, the partition count has been changed from 16 partitions in Standard Messaging to 2 partitions in Premium. Having two partitions ensures availability and is a more appropriate number for the Premium runtime environment. For more information about partitioning, see [Partitioned queues and topics](service-bus-partitioning.md).

### Express entities

Because Premium Messaging runs in a completely isolated run-time environment, express entities are not supported in Premium namespaces. For more information about the express feature, see the [QueueDescription.EnableExpress](/dotnet/api/microsoft.servicebus.messaging.queuedescription.enableexpress?view=azureservicebus-4.0.0#Microsoft_ServiceBus_Messaging_QueueDescription_EnableExpress) property.

## Get started with Premium Messaging

Getting started with Premium Messaging is straightforward and the process is similar to that of Standard Messaging. Begin by [creating a namespace](service-bus-create-namespace-portal.md). Make sure you select **Premium** under **Pricing tier**.

![create-premium-namespace][create-premium-namespace]

You can also create [Premium namespaces using Azure Resource Manager templates](https://azure.microsoft.com/en-us/resources/templates/101-servicebus-pn-ar/).


## Next steps

To learn more about Service Bus Messaging, see the following topics.

* [Introducing Azure Service Bus Premium Messaging (blog post)](http://azure.microsoft.com/blog/introducing-azure-service-bus-premium-messaging/)
* [Introducing Azure Service Bus Premium Messaging (Channel9)](https://channel9.msdn.com/Blogs/Subscribe/Introducing-Azure-Service-Bus-Premium-Messaging)
* [Service Bus Messaging overview](service-bus-messaging-overview.md)
* [How to use Service Bus queues](service-bus-dotnet-get-started-with-queues.md)

<!--Image references-->

[create-premium-namespace]: ./media/service-bus-premium-messaging/select-premium-tier.png
