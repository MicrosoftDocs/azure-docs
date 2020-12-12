---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 11/24/2020
ms.author: spelluru
ms.custom: "include file"

---

Event Hub organizes sequences of events into one or more partitions. As newer
events arrive, they're added to the end of this sequence. A partition can be
thought of as a "commit log."

Partitions hold event data containing the body of the event, a user-defined
property bag describing the event, and metadata such as its offset in the
partition, its number in the stream sequence, and the service-side timestamp at
which it was accepted.

![Diagram that displays the older to newer sequence of
events.](./media/event-hubs-partitions/partition.png)

Event Hubs is designed to help with processing of very large volumes of events,
and partitioning helps with that in two ways:

First, even though Event Hubs is a PaaS service, there's a physical reality
underneath, and maintaining a log that preserves the order of events requires
that these events are being kept together in the underlying storage and its
replicas and that results in a throughput ceiling for such a log. Partitioning
allows for multiple parallel logs to be used for the same Event Hub and
therefore multiplying the available raw IO throughput capacity.

Second, your own applications must be able to keep up with processing the volume
of events that are being sent into an Event Hub. That may be quite complex and
requires substantial, scaled-out, parallel processing capacity. The rationale
for partitions is the same as above: The capacity of a single process to handle
events is limited, and therefore you need several processes, and partitions are
how your solution feeds those processes and yet ensures that each event has a
clear processing owner. 

Event Hubs retains events for a configured retention time that applies across
all partitions. Events are automatically removed when the retention period has
been reached. If you specify a retention period of one day, the event will
become unavailable exactly 24 hours after it has been accepted. You cannot
explicitly delete events. 

The allowed retention time is up to 7 days for Event Hubs Standard and up to 90
days for Event Hubs Dedicated. If you need to archive events beyond the allowed
retention period, you can have them [automatically stored in Azure Storage or
Azure Data Lake by turning on the Event Hubs Capture
feature](../articles/event-hubs/event-hubs-capture-overview.md), and if you need
to search or analyze such deep archives, you can [easily import them into Azure
Synapse](../articles/event-hubs/store-captured-data-data-warehouse.md) or other
similar stores and analytics platforms. 

The reason for Event Hubs' limit on data retention based on time is to prevent
large volumes of historic customer data getting trapped in a deep store that is
only indexed by a timestamp and only allows for sequential access. The
architectural philosophy here is that historic data needs richer indexing and
more direct access than the real-time eventing interface that Event Hubs or
Kafka provide. Event stream engines are not well suited to play the role of data
lakes or long-term archives for event sourcing. 

Because partitions are independent and contain their own sequence of data, they
often grow at different rates. In Event Hubs, that is no concern that requires
administrative intervention as it would be, for instance, in Apache Kafka, but
uneven distribution will lead to uneven load on your downstream event
processors.

![Event Hubs](./media/event-hubs-partitions/multiple-partitions.png)

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

Applications control the mapping of events to partitions in one of three ways:

- By specifying partition key, which is consistently mapped (using a hash
  function) to one of the available partitions. 
- By not specifying a partition key, which enables to broker to randomly choose
  a partition for a given event.
- By explicitly sending events to a specific partition.

Specifying a partition key enables keeping related events together in the same
partition and in the exact order in which they were sent. The partition key is
some string that is derived from your application context and identifies the
interrelationship of the events.

A sequence of events identified by a partition key is a *stream*. A partition is
a multiplexed log store for many such streams. 

The partition count of an Event Hub can be increased after the Event Hub has
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

While partitions can be sent to directly, it's not recommended. Instead, you
can use higher level constructs introduced in the [Event
publishers](../articles/event-hubs/event-hubs-features.md#event-publishers)
section. 

For more information about partitions and the trade-off between availability and
reliability, see the [Event Hubs programming
guide](../articles/event-hubs/event-hubs-programming-guide.md#partition-key) and
the [Availability and consistency in Event
Hubs](../articles/event-hubs/event-hubs-availability-and-consistency.md)
article.
