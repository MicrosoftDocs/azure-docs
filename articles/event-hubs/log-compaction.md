---
title: Log compaction in Azure Event Hubs
description: This article describes how the log compaction feature works in Event Hubs.
ms.topic: article
ms.date: 05/18/2023
ms.custom: ignite-2022
---

# Log compaction in Azure Event Hubs

Log compaction is a way of retaining data in Event Hubs using event key based retention. By default, each event hub/Kafka topic is created with time-based retention or the *delete* cleanup policy, where events are purged upon the expiration of the retention time. Rather using coarser-grained time based retention, you can use event key-based retention mechanism where Event Hubs retrains the last known value for each event key of an event hub or a Kafka topic. 

> [!NOTE] 
> Log compaction feature isn't supported in the * **basic** tier. 


As shown in the following image, an event log (of an event hub partition) may have multiple events with the same key. If you're using a compacted event hub, then Event Hubs service takes care of purging old events and only keeping the latest events of a given event key. 

:::image type="content" source="./media/event-hubs-log-compaction/log-compaction.png" alt-text="Diagram showing how a topic gets compacted." lightbox="./media/event-hubs-resource-governance-overview/app-groups.png":::

### Compaction key
The partition key that you set with each event is used as the compaction key. 

### Tombstones
Client application can mark existing events of an event hub to be deleted during compaction job. These markers are known as *Tombstones*. Client applications set tombstones by sending a new event with an existing key and a `null` event payload. 

## How log compaction works

You can enable log compaction at each event hub/Kafka topic level. You can ingest events to a compacted article from any support protocol. Azure Event Hubs service runs a compaction job for each compacted event hub. Compaction job cleans each event hub partition log by only retaining the latest event of a given event key. 

:::image type="content" source="./media/event-hubs-log-compaction/how-compaction-work.png" alt-text="Diagram showing how log compaction works." lightbox="./media/event-hubs-log-compaction/how-compaction-work.png":::

At any given time, the event log of a compacted event hub can have a *cleaned* portion and *dirty* portion. The clean portion contains the events that are compacted by the compaction job while the dirty portion comprises the events that are yet to be compacted. 

The Event Hubs service manages the execution of the compaction job and user can't control it. Therefore, Event Hubs service determines when to start compaction and how fast it compact a given compacted event hub. 

## Compaction guarantees
Log compaction feature of Event Hubs provides the following guarantee: 
- Ordering of the messages is always maintained at the key and partition level. Compaction job doesn't alter ordering of messages but it just discards the old events of the same key. 
- The sequence number and offset of a message never changes. 
- Any consumer progressing from the start of the event log sees at least the final state of all events in the order they were written. 
- Consumers can still see events that are marked to be deleted for the time defined by *Tombstone Retention Time(hours)*. 


## Log compaction use cases
Log compaction can be useful in scenarios where you stream the same set of updatable events. As compacted event hubs only keep the latest events, users don't need to worry about the growth of the event storage. Therefore log compaction is commonly used in scenarios such as Change Data Capture(CDC), maintaining event in tables for stream processing applications and event caching. 

## Quotas and limits
| Limit | Basic | Standard | Premium |  Dedicated |
| ----- | ----- | -------- | -------- | --------- | 
| Size of compacted event hub  | N/A | 1 GB per partition | 250 GB per partition | 250 GB per partition |

For other quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md).

## Next steps
For instructions on how to use log compaction in Event Hubs, see [Use log compaction](./use-log-compaction.md)
