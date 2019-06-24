---
title: Availability and performance tradeoffs for various consistency levels in Azure Cosmos DB
description: Availability and performance tradeoffs for various consistency levels in Azure Cosmos DB.
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/21/2019
ms.author: rimman
ms.reviewer: sngun
---

# Consistency, availability, and performance tradeoffs 

Distributed databases that rely on replication for high availability, low latency, or both must make tradeoffs. The tradeoffs are between read consistency vs. availability, latency, and throughput.

Azure Cosmos DB approaches data consistency as a spectrum of choices. This approach includes more options than the two extremes of strong and eventual consistency. You can choose from five well-defined models on the consistency spectrum. From strongest to weakest, the models are:

- *Strong*
- *Bounded staleness*
- *Session*
- *Consistent prefix*
- *Eventual*

Each model provides availability and performance tradeoffs and is backed by comprehensive SLAs.

## Consistency levels and latency

The read latency for all consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. This read latency is backed by the SLA. The average read latency, at the 50th percentile, is typically 2 milliseconds or less. Azure Cosmos accounts that span several regions and are configured with strong consistency are an exception to this guarantee.

The write latency for all consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. This write latency is backed by the SLA. The average write latency, at the 50th percentile, is usually 5 milliseconds or less.

For Azure Cosmos accounts configured with strong consistency with more than one region, the write latency is guaranteed to be less than two times round-trip time (RTT) between any of the two farthest regions, plus 10 milliseconds at the 99th percentile.

The exact RTT latency is a function of speed-of-light distance and the Azure networking topology. Azure networking doesn't provide any latency SLAs for the RTT between any two Azure regions. For your Azure Cosmos account, replication latencies are displayed in the Azure portal. You can use the Azure portal (go to the Metrics blade) to monitor the replication latencies between various regions that are associated with your Azure Cosmos account.

## Consistency levels and throughput

- For the same number of request units, the session, consistent prefix, and eventual consistency levels provide about two times the read throughput when compared with strong and bounded staleness.

- For a given type of write operation, such as insert, replace, upsert, and delete, the write throughput for request units is identical for all consistency levels.

## <a id="rto"></a>Consistency levels and data durability

Within a globally distributed database environment there is a direct relationship between the consistency level and data durability in the presence of a region-wide outage. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after a disruptive event. The time required for an application to fully recover is known as **recovery time objective** (**RTO**). You also need to understand the maximum period of recent data updates the application can tolerate losing when recovering after a disruptive event. The time period of updates that you might afford to lose is known as **recovery point objective** (**RPO**).

The table below defines the relationship between consistency model and data durability in the presence of region wide outage. It is important to note that in a distributed system, even with strong consistency, it is impossible to have a distributed database with an RPO and RTO of zero due to the CAP Theorem. To learn more about why, see [Consistency levels in Azure Cosmos DB](consistency-levels.md).

|**Region(s)**|**Replication mode**|**Consistency level**|**RPO**|**RTO**|
|---------|---------|---------|---------|---------|
|1|Single or Multi-Master|Any Consistency Level|< 240 Minutes|<1 Week|
|>1|Single Master|Session, Consistent Prefix, Eventual|< 15 minutes|< 15 minutes|
|>1|Single Master|Bounded Staleness|*K* & *T*|< 15 minutes|
|>1|Single Master|Strong|0|< 15 minutes|
|>1|Multi-Master|Session, Consistent Prefix, Eventual|< 15 minutes|0|
|>1|Multi-Master|Bounded Staleness|*K* & *T*|0|

*K* = The number of *"K"* versions (i.e., updates) of an item.

*T* = The time interval *"T"* since the last update.

## Next steps

Learn more about global distribution and general consistency tradeoffs in distributed systems. See the following articles:

- [Consistency tradeoffs in modern distributed database systems design](https://www.computer.org/csdl/magazine/co/2012/02/mco2012020037/13rRUxjyX7k)
- [High availability](high-availability.md)
- [Azure Cosmos DB SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_2/)
