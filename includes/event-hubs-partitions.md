---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 03/15/2021
ms.author: spelluru
ms.custom: "include file"

---

Event Hubs organizes sequences of events sent to an event hub into one or more partitions. As newer events arrive, they're added to the end of this sequence. 

![Event Hubs](./media/event-hubs-partitions/multiple-partitions.png)

### What's a partition?
A partition can be thought of as a "commit log". Partitions hold event data that contains the following information:

- Body of the event
- User-defined property bag describing the event
- Metadata such as its offset in the partition, its number in the stream sequence
- Service-side timestamp at which it was accepted.

    ![Diagram that displays the older to newer sequence of
events.](./media/event-hubs-partitions/partition.png)

### Advantages of using partitions
Event Hubs is designed to help with processing of large volumes of events,
and partitioning helps with that in two ways:

- Even though Event Hubs is a PaaS service, there's a physical reality
underneath, and maintaining a log that preserves the order of events requires
that these events are being kept together in the underlying storage and its
replicas and that results in a throughput ceiling for such a log. Partitioning
allows for multiple parallel logs to be used for the same event hub and
therefore multiplying the available raw IO throughput capacity.
- Your own applications must be able to keep up with processing the volume
of events that are being sent into an event hub. It may be complex and
requires substantial, scaled-out, parallel processing capacity. The capacity of a single process to handle events is limited, so you need several processes. Partitions are how your solution feeds those processes and yet ensures that each event has a clear processing owner. 

### Mapping of events to partitions
Applications control the mapping of events to partitions in one of three ways:

- By specifying partition key, which is consistently mapped (using a hash
  function) to one of the available partitions. 
- By not specifying a partition key, which enables to broker to randomly choose
  a partition for a given event.
- By explicitly sending events to a specific partition.

### Partition key
Specifying a partition key enables keeping related events together in the same
partition and in the exact order in which they were sent. The partition key is
some string that is derived from your application context and identifies the
interrelationship of the events.

A sequence of events identified by a partition key is a *stream*. A partition is
a multiplexed log store for many such streams. 

While you can send events directly to partitions, we don't recommend it, especially when high availability is important to you. It downgrades the availability of an event hub to partition-level. For more information, see [Availability and Consistency](event-hubs-availability-and-consistency.md).

### Number of partitions
The number of partitions is specified at creation and must be between 1 and 32
in Event Hubs Standard. The partition count can be up to 2000 partitions per
Capacity Unit in Event Hubs Dedicated. 

We recommend that you choose at least as many partitions as you expect to
require in sustained [throughput units
(TU)](../articles/event-hubs/event-hubs-faq.md#what-are-event-hubs-throughput-units)
during the peak load of your application for that particular Event Hub. You
should calculate with a single partition having a throughput capacity of 1 TU (1
MByte in, 2 MByte out). You can scale the TUs on your namespace or the capacity
units of your cluster independent of the partition count. An Event Hub with 32
partitions or an Event Hub with 1 partition incur the exact same cost when the
namespace is set to 1 TU capacity. 

The partition count for an event hub in a [dedicated Event Hubs cluster](../articles/event-hubs/event-hubs-dedicated-overview.md) can be [increased](../articles/event-hubs/dynamically-add-partitions.md) after the event hub has
been created, but the distribution of streams across partitions will change when
it's done as the mapping of partition keys to partitions changes, so you
should try hard to avoid such changes if the relative order of events matters in
your application.

Setting the number of partitions to the maximum permitted value is tempting, but
always keep in mind that your event streams need to be structured such that you
can indeed take advantage of multiple partitions. If you need absolute order
preservation across all events or only a handful of substreams, you may not
be able to take advantage of many partitions. Also, many partitions make the
processing side more complex. 


