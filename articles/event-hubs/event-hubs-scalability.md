---
title: Scalability - Azure Event Hubs | Microsoft Docs
description: This article provides information on how to scale Azure Event Hubs by using partitions and throughput units. 
ms.topic: article
ms.date: 10/25/2022
---

# Scaling with Event Hubs

There are two factors which influence scaling with Event Hubs.
* Throughput units (standard tier) or processing units (premium tier) 
* Partitions

## Throughput units

The throughput capacity of Event Hubs is controlled by *throughput units*. Throughput units are pre-purchased units of capacity. A single throughput unit lets you:

* Ingress: Up to 1 MB per second or 1000 events per second (whichever comes first).
* Egress: Up to 2 MB per second or 4096 events per second.

Beyond the capacity of the purchased throughput units, ingress is throttled and a [ServerBusyException](/dotnet/api/microsoft.azure.eventhubs.serverbusyexception) is returned. Egress does not produce throttling exceptions, but is still limited to the capacity of the purchased throughput units. If you receive publishing rate exceptions or are expecting to see higher egress, be sure to check how many throughput units you have purchased for the namespace. You can manage throughput units on the **Scale** blade of the namespaces in the [Azure portal](https://portal.azure.com). You can also manage throughput units programmatically using the [Event Hubs APIs](./event-hubs-samples.md).

Throughput units are pre-purchased and are billed per hour. Once purchased, throughput units are billed for a minimum of one hour. Up to 40 throughput units can be purchased for an Event Hubs namespace and are shared across all event hubs in that namespace.

The **Auto-inflate** feature of Event Hubs automatically scales up by increasing the number of throughput units, to meet usage needs. Increasing throughput units prevents throttling scenarios, in which:

- Data ingress rates exceed set throughput units.
- Data egress request rates exceed set throughput units.

The Event Hubs service increases the throughput when load increases beyond the minimum threshold, without any requests failing with ServerBusy errors. 

For more information about the auto-inflate feature, see [Automatically scale throughput units](event-hubs-auto-inflate.md).

## Processing units

 [Event Hubs Premium](./event-hubs-premium-overview.md) provides superior performance and better isolation within a managed multitenant PaaS environment. The resources in a Premium tier are isolated at the CPU and memory level so that each tenant workload runs in isolation. This resource container is called a *Processing Unit* (PU). You can purchase 1, 2, 4, 8 or 16 processing Units for each Event Hubs Premium namespace. 

How much you can ingest and stream with a processing unit depends on various factors such as your producers, consumers, the rate at which you're ingesting and processing, and much more. 

For example, Event Hubs Premium namespace with 1 PU and 1 event hub (100 partitions) can approximately offer core capacity of ~5-10 MB/s ingress and 10-20 MB/s egress for both AMQP or Kafka workloads.

To learn about configuring PUs for a premium tier namespace, see [Configure processing units](configure-processing-units-premium-namespace.md).

> [!NOTE]
> To learn more about quotas and limits, see [Azure Event Hubs - quotas and limits](event-hubs-quotas.md).

## Partitions
[!INCLUDE [event-hubs-partitions](./includes/event-hubs-partitions.md)]




## Next steps
You can learn more about Event Hubs by visiting the following links:

- [Automatically scale throughput units for a standard tier namespace](event-hubs-auto-inflate.md)
- [Configure processing units for a premium tier namespace](configure-processing-units-premium-namespace.md)
