---
title: Consistency levels in Azure Cosmos DB
description: Azure Cosmos DB has five consistency levels to help balance eventual consistency, availability, and latency trade-offs.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/22/2021
---
# Consistency levels in Azure Cosmos DB
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Distributed databases that rely on replication for high availability, low latency, or both, must make a fundamental tradeoff between the read consistency, availability, latency, and throughput as defined by the [PACLC theorem](https://en.wikipedia.org/wiki/PACELC_theorem). The linearizability of the strong consistency model is the gold standard of data programmability. But it adds a steep price from higher write latencies due to data having to replicate and commit across large distances. Strong consistency may also suffer from reduced availability (during failures) because data cannot replicate and commit in every region. Eventual consistency offers higher availability and better performance, but its more difficult to program applications because data may not be completely consistent across all regions.

Most commercially available distributed NoSQL databases available in the market today provide only strong and eventual consistency. Azure Cosmos DB offers five well-defined levels. From strongest to weakest, the levels are:

- *Strong*
- *Bounded staleness*
- *Session*
- *Consistent prefix*
- *Eventual*

Each level provides availability and performance tradeoffs. The following image shows the different consistency levels as a spectrum.

:::image type="content" source="./media/consistency-levels/five-consistency-levels.png" alt-text="Consistency as a spectrum" border="false" :::

The consistency levels are region-agnostic and are guaranteed for all operations regardless of the region from which the reads and writes are served, the number of regions associated with your Azure Cosmos account, or whether your account is configured with a single or multiple write regions.

## Consistency levels and Azure Cosmos DB APIs

Azure Cosmos DB provides native support for wire protocol-compatible APIs for popular databases. These include MongoDB, Apache Cassandra, Gremlin, and Azure Table storage. When using Gremlin API and Table API, the default consistency level configured on the Azure Cosmos account is used. For details on consistency level mapping between Cassandra API or the API for MongoDB and Azure Cosmos DB's consistency levels see, [Cassandra API consistency mapping](cassandra-consistency.md) and [API for MongoDB consistency mapping](mongodb-consistency.md).

## Scope of the read consistency

Read consistency applies to a single read operation scoped within a logical partition. The read operation can be issued by a remote client or a stored procedure.

## Configure the default consistency level

You can configure the default consistency level on your Azure Cosmos account at any time. The default consistency level configured on your account applies to all Azure Cosmos databases and containers under that account. All reads and queries issued against a container or a database use the specified consistency level by default. To learn more, see how to [configure the default consistency level](how-to-manage-consistency.md#configure-the-default-consistency-level). You can also override the default consistency level for a specific request, to learn more, see how to [Override the default consistency level](how-to-manage-consistency.md?#override-the-default-consistency-level) article.

> [!IMPORTANT]
> It is required to recreate any SDK instance after changing the default consistency level. This can be done by restarting the application. This ensures the SDK uses the new default consistency level.

## Guarantees associated with consistency levels

Azure Cosmos DB guarantees that 100 percent of read requests meet the consistency guarantee for the consistency level chosen. The precise definitions of the five consistency levels in Azure Cosmos DB using the TLA+ specification language are provided in the [azure-cosmos-tla](https://github.com/Azure/azure-cosmos-tla) GitHub repo.

The semantics of the five consistency levels are described in the following sections.

### Strong consistency

Strong consistency offers a linearizability guarantee. Linearizability refers to serving requests concurrently. The reads are guaranteed to return the most recent committed version of an item. A client never sees an uncommitted or partial write. Users are always guaranteed to read the latest committed write.

  The following graphic illustrates the strong consistency with musical notes. After the data is written to the "West US 2" region, when you read the data from other regions, you get the most recent value:

  :::image type="content" source="media/consistency-levels/strong-consistency.gif" alt-text="Illustration of strong consistency level":::

### Bounded staleness consistency

In bounded staleness consistency, the reads are guaranteed to honor the consistent-prefix guarantee. The reads might lag behind writes by at most *"K"* versions (that is, "updates") of an item or by *"T"* time interval, whichever is reached first. In other words, when you choose bounded staleness, the "staleness" can be configured in two ways:

- The number of versions (*K*) of the item
- The time interval (*T*) reads might lag behind the writes

For a single region account, the minimum value of *K* and *T* is 10 write operations or 5 seconds. For multi-region accounts the minimum value of *K* and *T* is 100,000 write operations or 300 seconds.

Bounded staleness offers total global order outside of the "staleness window." When a client performs read operations within a region that accepts writes, the guarantees provided by bounded staleness consistency are identical to those guarantees by the strong consistency. As the staleness window approaches for either time or updates, whichever is closer, the service will throttle new writes to allow replication to catch up and honor the consistency guarantee.

Inside the staleness window, Bounded Staleness provides the following consistency guarantees:

- Consistency for clients in the same region for an account with single write region = Strong
- Consistency for clients in different regions for an account with single write region = Consistent Prefix
- Consistency for clients writing to a single region for an account with multiple write regions = Consistent Prefix
- Consistency for clients writing to different regions for an account with multiple write regions = Eventual

  Bounded staleness is frequently chosen by globally distributed applications that expect low write latencies but require total global order guarantee. Bounded staleness is great for applications featuring group collaboration and sharing, stock ticker, publish-subscribe/queueing etc. The following graphic illustrates the bounded staleness consistency with musical notes. After the data is written to the "West US 2" region, the "East US 2" and "Australia East" regions read the written value based on the configured maximum lag time or the maximum operations:

  :::image type="content" source="media/consistency-levels/bounded-staleness-consistency.gif" alt-text="Illustration of bounded staleness consistency level":::

### Session consistency

In session consistency, within a single client session reads are guaranteed to honor the consistent-prefix, monotonic reads, monotonic writes, read-your-writes, and write-follows-reads guarantees. This assumes a single "writer" session or sharing the session token for multiple writers.

Clients outside of the session performing writes will see the following guarantees:

- Consistency for clients in same region for an account with single write region = Consistent Prefix
- Consistency for clients in different regions for an account with single write region = Consistent Prefix
- Consistency for clients writing to a single region for an account with multiple write regions = Consistent Prefix
- Consistency for clients writing to multiple regions for a account with multiple write regions = Eventual

  Session consistency is the most widely used consistency level for both single region as well as globally distributed applications. It provides write latencies, availability, and read throughput comparable to that of eventual consistency but also provides the consistency guarantees that suit the needs of applications written to operate in the context of a user. The following graphic illustrates the session consistency with musical notes. The "West US 2 writer" and the "West US 2 reader" are using the same session (Session A) so they both read the same data at the same time. Whereas the "Australia East" region is using "Session B" so, it receives data later but in the same order as the writes.

  :::image type="content" source="media/consistency-levels/session-consistency.gif" alt-text="Illustration of session consistency level":::

### Consistent prefix consistency

In consistent prefix option, updates that are returned contain some prefix of all the updates, with no gaps. Consistent prefix consistency level guarantees that reads never see out-of-order writes.

If writes were performed in the order `A, B, C`, then a client sees either `A`, `A,B`, or `A,B,C`, but never out-of-order permutations like `A,C` or `B,A,C`. Consistent Prefix provides write latencies, availability, and read throughput comparable to that of eventual consistency, but also provides the order guarantees that suit the needs of scenarios where order is important.

Below are the consistency guarantees for Consistent Prefix:

- Consistency for clients in same region for an account with single write region = Consistent Prefix
- Consistency for clients in different regions for an account with single write region = Consistent Prefix
- Consistency for clients writing to a single region for an account with multiple write region = Consistent Prefix
- Consistency for clients writing to multiple regions for an account with multiple write region = Eventual

The following graphic illustrates the consistency prefix consistency with musical notes. In all the regions, the reads never see out of order writes:

  :::image type="content" source="media/consistency-levels/consistent-prefix.gif" alt-text="Illustration of consistent prefix":::

### Eventual consistency

In eventual consistency, there's no ordering guarantee for reads. In the absence of any further writes, the replicas eventually converge.  
Eventual consistency is the weakest form of consistency because a client may read the values that are older than the ones it had read before. Eventual consistency is ideal where the application does not require any ordering guarantees. Examples include count of Retweets, Likes, or non-threaded comments. The following graphic illustrates the eventual consistency with musical notes.

  :::image type="content" source="media/consistency-levels/eventual-consistency.gif" alt-text="viIllustration of eventual consistency":::

## Consistency guarantees in practice

In practice, you may often get stronger consistency guarantees. Consistency guarantees for a read operation correspond to the freshness and ordering of the database state that you request. Read-consistency is tied to the ordering and propagation of the write/update operations.  

If there are no write operations on the database, a read operation with **eventual**, **session**, or **consistent prefix** consistency levels is likely to yield the same results as a read operation with strong consistency level.

If your Azure Cosmos account is configured with a consistency level other than the strong consistency, you can find out the probability that your clients may get strong and consistent reads for your workloads by looking at the *Probabilistically Bounded Staleness* (PBS) metric. This metric is exposed in the Azure portal, to learn more, see [Monitor Probabilistically Bounded Staleness (PBS) metric](how-to-manage-consistency.md#monitor-probabilistically-bounded-staleness-pbs-metric).

Probabilistic bounded staleness shows how eventual is your eventual consistency. This metric provides an insight into how often you can get a stronger consistency than the consistency level that you have currently configured on your Azure Cosmos account. In other words, you can see the probability (measured in milliseconds) of getting strongly consistent reads for a combination of write and read regions.

## Consistency levels and latency

The read latency for all consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. The average read latency, at the 50th percentile, is typically 4 milliseconds or less.

The write latency for all consistency levels is always guaranteed to be less than 10 milliseconds at the 99th percentile. The average write latency, at the 50th percentile, is usually 5 milliseconds or less. Azure Cosmos accounts that span several regions and are configured with strong consistency are an exception to this guarantee.

### Write latency and Strong consistency

For Azure Cosmos accounts configured with strong consistency with more than one region, the write latency is equal to two times round-trip time (RTT) between any of the two farthest regions, plus 10 milliseconds at the 99th percentile. High network RTT between the regions will translate to higher latency for Cosmos DB requests since strong consistency completes an operation only after ensuring that it has been committed to all regions within an account.

The exact RTT latency is a function of speed-of-light distance and the Azure networking topology. Azure networking doesn't provide any latency SLAs for the RTT between any two Azure regions, however it does publish [Azure network round-trip latency statistics](../networking/azure-network-latency.md). For your Azure Cosmos account, replication latencies are displayed in the Azure portal. You can use the Azure portal (go to the Metrics blade, select Consistency tab) to monitor the replication latencies between various regions that are associated with your Azure Cosmos account.

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

> [!NOTE]
> The RU/s cost of reads for Local Minority reads are twice that of weaker consistency levels because reads are made from two replicas to provide consistency guarantees for Strong and Bounded Staleness.

## <a id="rto"></a>Consistency levels and data durability

Within a globally distributed database environment there is a direct relationship between the consistency level and data durability in the presence of a region-wide outage. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after a disruptive event. The time required for an application to fully recover is known as **recovery time objective** (**RTO**). You also need to understand the maximum period of recent data updates the application can tolerate losing when recovering after a disruptive event. The time period of updates that you might afford to lose is known as **recovery point objective** (**RPO**).

The table below defines the relationship between consistency model and data durability in the presence of a region wide outage. It is important to note that in a distributed system, even with strong consistency, it is impossible to have a distributed database with an RPO and RTO of zero due to [CAP Theorem](https://en.wikipedia.org/wiki/CAP_theorem).

|**Region(s)**|**Replication mode**|**Consistency level**|**RPO**|**RTO**|
|---------|---------|---------|---------|---------|
|1|Single or Multiple write regions|Any Consistency Level|< 240 Minutes|<1 Week|
|>1|Single write region|Session, Consistent Prefix, Eventual|< 15 minutes|< 15 minutes|
|>1|Single write region|Bounded Staleness|*K* & *T*|< 15 minutes|
|>1|Single write region|Strong|0|< 15 minutes|
|>1|Multiple write regions|Session, Consistent Prefix, Eventual|< 15 minutes|0|
|>1|Multiple write regions|Bounded Staleness|*K* & *T*|0|

*K* = The number of *"K"* versions (i.e., updates) of an item.

*T* = The time interval *"T"* since the last update.

For a single region account, the minimum value of *K* and *T* is 10 write operations or 5 seconds. For multi-region accounts the minimum value of *K* and *T* is 100,000 write operations or 300 seconds. This defines the minimum RPO for data when using Bounded Staleness.

## Strong consistency and multiple write regions

Cosmos accounts configured with multiple write regions cannot be configured for strong consistency as it is not possible for a distributed system to provide an RPO of zero and an RTO of zero. Additionally, there are no write latency benefits on using strong consistency with multiple write regions because a write to any region must be replicated and committed to all configured regions within the account. This results in the same write latency as a single write region account.

## Additional reading

To learn more about consistency concepts, read the following articles:

- [High-level TLA+ specifications for the five consistency levels offered by Azure Cosmos DB](https://github.com/Azure/azure-cosmos-tla)
- [Replicated Data Consistency Explained Through Baseball (video) by Doug Terry](https://www.youtube.com/watch?v=gluIh8zd26I)
- [Replicated Data Consistency Explained Through Baseball (whitepaper) by Doug Terry](https://www.microsoft.com/research/publication/replicated-data-consistency-explained-through-baseball/)
- [Session guarantees for weakly consistent replicated data](https://dl.acm.org/citation.cfm?id=383631)
- [Consistency Tradeoffs in Modern Distributed Database Systems Design: CAP is Only Part of the Story](https://www.computer.org/csdl/magazine/co/2012/02/mco2012020037/13rRUxjyX7k)
- [Probabilistic Bounded Staleness (PBS) for Practical Partial Quorums](https://vldb.org/pvldb/vol5/p776_peterbailis_vldb2012.pdf)
- [Eventually Consistent - Revisited](https://www.allthingsdistributed.com/2008/12/eventually_consistent.html)

## Next steps

To learn more about consistency levels in Azure Cosmos DB, read the following articles:

- [Configure the default consistency level](how-to-manage-consistency.md#configure-the-default-consistency-level)
- [Override the default consistency level](how-to-manage-consistency.md#override-the-default-consistency-level)
- [Azure Cosmos DB SLA](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_3/)
