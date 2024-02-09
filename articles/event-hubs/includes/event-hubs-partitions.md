---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 11/27/2023
ms.author: spelluru
ms.custom: "include file"

---

Event Hubs organizes sequences of events sent to an event hub into one or more partitions. As newer events arrive, they're added to the end of this sequence. 

:::image type="content" source="./media/event-hubs-partitions/multiple-partitions.png" alt-text="Image that shows an event hub with a few partitions.":::

A partition can be thought of as a commit log. Partitions hold event data that contains body of the event, a user-defined property bag describing the event, metadata such as its offset in the partition, its number in the stream sequence, and service-side timestamp at which it was accepted.

:::image type="content" source="./media/event-hubs-partitions/partition.png" alt-text="Diagram that displays the older to newer sequence of events.":::

### Advantages of using partitions
Event Hubs is designed to help with processing of large volumes of events, and partitioning helps with that in two ways:

- Even though Event Hubs is a PaaS service, there's a physical reality underneath, and maintaining a log that preserves the order of events requires that these events are being kept together in the underlying storage and its replicas and that results in a throughput ceiling for such a log. Partitioning allows for multiple parallel logs to be used for the same event hub and therefore multiplying the available raw IO throughput capacity.
- Your own applications must be able to keep up with processing the volume of events that are being sent into an event hub. It might be complex and requires substantial, scaled-out, parallel processing capacity. The capacity of a single process to handle events is limited, so you need several processes. Partitions are how your solution feeds those processes and yet ensures that each event has a clear processing owner. 

### Number of partitions
The number of partitions is specified at the time of creating an event hub. It must be between one and the maximum partition count allowed for each pricing tier. For the partition count limit for each tier, see [this article](../event-hubs-quotas.md#basic-vs-standard-vs-premium-vs-dedicated-tiers). 

We recommend that you choose at least as many partitions as you expect that are required during the peak load of your application for that particular event hub. For tiers other than the premium and dedicated tiers, you can't change the partition count for an event hub after its creation. For an event hub in a premium or dedicated tier, you can [increase the partition count](../dynamically-add-partitions.md) after its creation, but you can't decrease them. The distribution of streams across partitions will change when it's done as the mapping of partition keys to partitions changes, so you should try hard to avoid such changes if the relative order of events matters in your application.

Setting the number of partitions to the maximum permitted value is tempting, but always keep in mind that your event streams need to be structured such that you can indeed take advantage of multiple partitions. If you need absolute order preservation across all events or only a handful of substreams, you might not be able to take advantage of many partitions. Also, many partitions make the processing side more complex. 

It doesn't matter how many partitions are in an event hub when it comes to pricing. It depends on the number of pricing units ([throughput units
(TUs)](../event-hubs-scalability.md#throughput-units) for the standard tier, [processing units (PUs)](../event-hubs-scalability.md#processing-units) for the premium tier, and [capacity units (CUs)](../event-hubs-dedicated-overview.md) for the dedicated tier) for the namespace or the dedicated cluster. For example, an event hub of the standard tier with 32 partitions or with one partition incur the exact same cost when the namespace is set to one TU capacity. Also, you can scale TUs or PUs on your namespace or CUs of your dedicated cluster independent of the partition count. 

[!INCLUDE [event-hubs-partition-count](event-hubs-partition-count.md)]

### Mapping of events to partitions
You can use a partition key to map incoming event data into specific partitions for the purpose of data organization. The partition key is a sender-supplied value passed into an event hub. It's processed through a static hashing function, which creates the partition assignment. If you don't specify a partition key when publishing an event, a round-robin assignment is used.

The event publisher is only aware of its partition key, not the partition to which the events are published. This decoupling of key and partition insulates the sender from needing to know too much about the downstream processing. A per-device or user unique identity makes a good partition key, but other attributes such as geography can also be used to group related events into a single partition.

Specifying a partition key enables keeping related events together in the same partition and in the exact order in which they arrived. The partition key is some string that is derived from your application context and identifies the interrelationship of the events. A sequence of events identified by a partition key is a *stream*. A partition is a multiplexed log store for many such streams. 

> [!NOTE]
> While you can send events directly to partitions, we don't recommend it, especially when high availability is important to you. It downgrades the availability of an event hub to partition-level. For more information, see [Availability and Consistency](../event-hubs-availability-and-consistency.md).

