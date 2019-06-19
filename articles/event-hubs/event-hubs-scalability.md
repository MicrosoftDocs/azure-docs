---
title: Scalability - Azure Event Hubs | Microsoft Docs
description: Provides information on how to scale Azure Event Hubs. 
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.custom: seodec18
ms.date: 06/18/2019
ms.author: shvija

---

## Scaling with Event Hubs

There are two factors which influence scaling with Event Hubs.
*	Throughput units
*	Partitions

### Throughput units

The throughput capacity of Event Hubs is controlled by *throughput units*. Throughput units are pre-purchased units of capacity. A single throughput lets you:

* Ingress: Up to 1 MB per second or 1000 events per second (whichever comes first).
* Egress: Up to 2 MB per second or 4096 events per second.

Beyond the capacity of the purchased throughput units, ingress is throttled and a [ServerBusyException](/dotnet/api/microsoft.azure.eventhubs.serverbusyexception) is returned. Egress does not produce throttling exceptions, but is still limited to the capacity of the purchased throughput units. If you receive publishing rate exceptions or are expecting to see higher egress, be sure to check how many throughput units you have purchased for the namespace. You can manage throughput units on the **Scale** blade of the namespaces in the [Azure portal](https://portal.azure.com). You can also manage throughput units programmatically using the [Event Hubs APIs](event-hubs-api-overview.md).

Throughput units are pre-purchased and are billed per hour. Once purchased, throughput units are billed for a minimum of one hour. Up to 20 throughput units can be purchased for an Event Hubs namespace and are shared across all event hubs in that namespace.

### Partitions

Partitions let you scale for your downstream processing. Because of the partitioned consumer model that Event Hubs offers with partitions, you can scale-out while processing your events concurrently. An Event Hub can have up to 32 partitions.

We recommend that you balance 1:1 throughput units and partitions to achieve optimal scale. A single partition has a guaranteed Ingress and Egress of up to one throughput unit. While you may be able to achieve higher throughput on a partition, performance is not guaranteed. This is why we strongly recommend that the number of partitions in an event hub be greater than or equal to the number of throughput units.

Given the total throughput you plan on needing, you know the number of throughput units you require and the minimum number of partitions, but how many partitions should you have? Choose number of partitions based on the downstream parallelism you want to achieve as well as your future throughput needs. There is no charge for the number of partitions you have within an Event Hub.

For detailed Event Hubs pricing information, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs service overview](event-hubs-what-is-event-hubs.md)
* [Create an event hub](event-hubs-create.md)
