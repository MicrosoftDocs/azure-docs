---
title: Scalability - Azure Event Hubs | Microsoft Docs
description: This article provides information on how to scale Azure Event Hubs by using partitions and throughput units. 
ms.topic: article
ms.date: 06/23/2020
---

# Scaling with Event Hubs

There are two factors which influence scaling with Event Hubs.
*	Throughput units
*	Partitions

## Throughput units

The throughput capacity of Event Hubs is controlled by *throughput units*. Throughput units are pre-purchased units of capacity. A single throughput lets you:

* Ingress: Up to 1 MB per second or 1000 events per second (whichever comes first).
* Egress: Up to 2 MB per second or 4096 events per second.

Beyond the capacity of the purchased throughput units, ingress is throttled and a [ServerBusyException](/dotnet/api/microsoft.azure.eventhubs.serverbusyexception) is returned. Egress does not produce throttling exceptions, but is still limited to the capacity of the purchased throughput units. If you receive publishing rate exceptions or are expecting to see higher egress, be sure to check how many throughput units you have purchased for the namespace. You can manage throughput units on the **Scale** blade of the namespaces in the [Azure portal](https://portal.azure.com). You can also manage throughput units programmatically using the [Event Hubs APIs](event-hubs-api-overview.md).

Throughput units are pre-purchased and are billed per hour. Once purchased, throughput units are billed for a minimum of one hour. Up to 20 throughput units can be purchased for an Event Hubs namespace and are shared across all event hubs in that namespace.

The **Auto-inflate** feature of Event Hubs automatically scales up by increasing the number of throughput units, to meet usage needs. Increasing throughput units prevents throttling scenarios, in which:

- Data ingress rates exceed set throughput units.
- Data egress request rates exceed set throughput units.

The Event Hubs service increases the throughput when load increases beyond the minimum threshold, without any requests failing with ServerBusy errors. 

For more information about the auto-inflate feature, see [Automatically scale throughput units](event-hubs-auto-inflate.md).

## Partitions
[!INCLUDE [event-hubs-partitions](../../includes/event-hubs-partitions.md)]

### Partition key

You can use a [partition key](event-hubs-programming-guide.md#partition-key) to map incoming event data into specific partitions for the purpose of data organization. The partition key is a sender-supplied value passed into an event hub. It is processed through a static hashing function, which creates the partition assignment. If you don't specify a partition key when publishing an event, a round-robin assignment is used.

The event publisher is only aware of its partition key, not the partition to which the events are published. This decoupling of key and partition insulates the sender from needing to know too much about the downstream processing. A per-device or user unique identity makes a good partition key, but other attributes such as geography can also be used to group related events into a single partition.


## Next steps
You can learn more about Event Hubs by visiting the following links:

- [Automatically scale throughput units](event-hubs-auto-inflate.md)
- [Event Hubs service overview](event-hubs-what-is-event-hubs.md)
