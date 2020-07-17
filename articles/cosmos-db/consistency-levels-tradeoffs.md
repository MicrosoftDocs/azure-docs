---
title: Azure Cosmos DB consistency, availability, and performance tradeoffs 
description: Availability and performance tradeoffs for various consistency levels in Azure Cosmos DB.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/23/2020
ms.reviewer: sngun
---

# Consistency, availability, and performance tradeoffs

Distributed databases that rely on replication for high availability, low latency, or both must make tradeoffs. The tradeoffs are between read consistency vs. availability, latency, and throughput.

Azure Cosmos DB approaches data consistency as a spectrum of choices. This approach includes more options than the two extremes of strong and eventual consistency. You can choose from five well-defined levels on the consistency spectrum. From strongest to weakest, the levels are:

- *Strong*
- *Bounded staleness*
- *Session*
- *Consistent prefix*
- *Eventual*

Each level provides availability and performance tradeoffs and is backed by comprehensive SLAs.

## Consistency levels and latency

The read latency for all consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. This read latency is backed by the SLA. The average read latency, at the 50th percentile, is typically 4 milliseconds or less.

The write latency for all consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. This write latency is backed by the SLA. The average write latency, at the 50th percentile, is usually 5 milliseconds or less. Azure Cosmos accounts that span several regions and are configured with strong consistency are an exception to this guarantee.

### Write latency and Strong consistency

For Azure Cosmos accounts configured with strong consistency with more than one region, the write latency is equal to two times round-trip time (RTT) between any of the two farthest regions, plus 10 milliseconds at the 99th percentile. High network RTT between the regions will translate to higher latency for Cosmos DB requests since strong consistency completes an operation only after ensuring that it has been committed to all regions within an account.

The exact RTT latency is a function of speed-of-light distance and the Azure networking topology. Azure networking doesn't provide any latency SLAs for the RTT between any two Azure regions. For your Azure Cosmos account, replication latencies are displayed in the Azure portal. You can use the Azure portal (go to the Metrics blade, select Consistency tab) to monitor the replication latencies between various regions that are associated with your Azure Cosmos account.

> [!IMPORTANT]
> Strong consistency for accounts with regions spanning more than 5000 miles (8000 kilometers) is blocked by default due to high write latency. To enable this capability please contact support.

## Consistency levels and throughput

- For strong and bounded staleness, reads are done against two replicas in a four replica set (minority quorum) to provide consistency guarantees. Session, consistent prefix and eventual do single replica reads. The result is that, for the same number of request units, read throughput for strong and bounded staleness is half of the other consistency levels.

- For a given type of write operation, such as insert, replace, upsert, and delete, the write throughput for request units is identical for all consistency levels.

|**Consistency Level**|**Quorum Reads**|**Quorum Writes**|
|--|--|--|
|**Strong**|Local Minority|Global Majority|
|**Bounded Staleness**|Local Minority|Local Majority|
|**Session**|Single Replica (using session token)|Local Majority|
|**Consistent Prefix**|Single Replica|Local Majority|
|**Eventual**|Single Replica|Local Majority|

## <a id="rto"></a>Consistency levels and data durability

Within a globally distributed database environment there is a direct relationship between the consistency level and data durability in the presence of a region-wide outage. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after a disruptive event. The time required for an application to fully recover is known as **recovery time objective** (**RTO**). You also need to understand the maximum period of recent data updates the application can tolerate losing when recovering after a disruptive event. The time period of updates that you might afford to lose is known as **recovery point objective** (**RPO**).

The table below defines the relationship between consistency model and data durability in the presence of a region wide outage. It is important to note that in a distributed system, even with strong consistency, it is impossible to have a distributed database with an RPO and RTO of zero due to the CAP Theorem. To learn more about why, see [Consistency levels in Azure Cosmos DB](consistency-levels.md).

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

## Strong consistency and multi-master

Cosmos accounts configured for multi-master cannot be configured for strong consistency as it is not possible for a distributed system to provide an RPO of zero and an RTO of zero. Additionally, there are no write latency benefits for using strong consistency with multi-master as any write into any region must be replicated and committed to all configured regions within the account. This results in the same write latency as a single master account.

## Next steps

Learn more about global distribution and general consistency tradeoffs in distributed systems. See the following articles:

- [Consistency tradeoffs in modern distributed database systems design](https://www.computer.org/csdl/magazine/co/2012/02/mco2012020037/13rRUxjyX7k)
- [High availability](high-availability.md)
- [Azure Cosmos DB SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_2/)
