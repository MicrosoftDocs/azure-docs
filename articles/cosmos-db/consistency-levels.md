---
title: Consistency levels in Azure Cosmos DB
description: Azure Cosmos DB has five consistency levels to help balance eventual consistency, availability, and latency trade-offs.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/20/2019
---
# Consistency levels in Azure Cosmos DB

Distributed databases that rely on replication for high availability, low latency, or both, make the fundamental tradeoff between the read consistency vs. availability, latency, and throughput. Most commercially available distributed databases ask developers to choose between the two extreme consistency models: *strong* consistency and *eventual* consistency. The  [linearizability](https://cs.brown.edu/~mph/HerlihyW90/p463-herlihy.pdf) or the strong consistency model is the gold standard of data programmability. But it adds a price of higher latency (in steady state) and reduced availability (during failures). On the other hand, eventual consistency offers higher availability and better performance, but makes it hard to program applications. 

Azure Cosmos DB approaches data consistency as a spectrum of choices instead of two extremes. Strong consistency and eventual consistency are at the ends of the spectrum, but there are many consistency choices along the spectrum. Developers can use these options to make precise choices and granular tradeoffs with respect to high availability and performance. 

With Azure Cosmos DB, developers can choose from five well-defined consistency models on the consistency spectrum. From strongest to more relaxed, the models include *strong*, *bounded staleness*, *session*, *consistent prefix*, and *eventual* consistency. The models are well-defined and intuitive and can be used for specific real-world scenarios. Each model provides [availability and performance tradeoffs](consistency-levels-tradeoffs.md) and is backed by the SLAs. The following image shows the different consistency levels as a spectrum.

![Consistency as a spectrum](./media/consistency-levels/five-consistency-levels.png)

The consistency levels are region-agnostic and are guaranteed for all operations regardless of the region from which the reads and writes are served, the number of regions associated with your Azure Cosmos account, or whether your account is configured with a single or multiple write regions.

## Scope of the read consistency

Read consistency applies to a single read operation scoped within a partition-key range or a logical partition. The read operation can be issued by a remote client or a stored procedure.

## Configure the default consistency level

You can configure the default consistency level on your Azure Cosmos account at any time. The default consistency level configured on your account applies to all Azure Cosmos databases and containers under that account. All reads and queries issued against a container or a database use the specified consistency level by default. To learn more, see how to [configure the default consistency level](how-to-manage-consistency.md#configure-the-default-consistency-level).

## Guarantees associated with consistency levels

The comprehensive SLAs provided by Azure Cosmos DB guarantee that 100 percent of read requests meet the consistency guarantee for any consistency level you choose. A read request meets the consistency SLA if all the consistency guarantees associated with the consistency level are satisfied. The precise definitions of the five consistency levels in Azure Cosmos DB using the [TLA+ specification language](https://lamport.azurewebsites.net/tla/tla.html) are provided in the [azure-cosmos-tla](https://github.com/Azure/azure-cosmos-tla) GitHub repo. 

The semantics of the five consistency levels are described here:

- **Strong**: Strong consistency offers a [linearizability](https://aphyr.com/posts/313-strong-consistency-models) guarantee. The reads are guaranteed to return the most recent committed version of an item. A client never sees an uncommitted or partial write. Users are always guaranteed to read the latest committed write.

- **Bounded staleness**: The reads are guaranteed to honor the consistent-prefix guarantee. The reads might lag behind writes by at most *"K"* versions (i.e., "updates") of an item or by *"T"* time interval. In other words, when you choose bounded staleness, the "staleness" can be configured in two ways: 

  * The number of versions (*K*) of the item
  * The time interval (*T*) by which the reads might lag behind the writes 

  Bounded staleness offers total global order except within the "staleness window." The monotonic read guarantees exist within a region both inside and outside the staleness window. Strong consistency has the same semantics as the one offered by bounded staleness. The staleness window is equal to zero. Bounded staleness is also referred to as time-delayed linearizability. When a client performs read operations within a region that accepts writes, the guarantees provided by bounded staleness consistency are identical to those guarantees by the strong consistency.

- **Session**:  Within a single client session reads are guaranteed to honor the consistent-prefix (assuming a single “writer” session), monotonic reads, monotonic writes, read-your-writes, and write-follows-reads guarantees. Clients outside of the session performing writes will see eventual consistency.

- **Consistent prefix**: Updates that are returned contain some prefix of all the updates, with no gaps. Consistent prefix consistency level guarantees that reads never see out-of-order writes.

- **Eventual**: There's no ordering guarantee for reads. In the absence of any further writes, the replicas eventually converge.

## Consistency levels explained through baseball

Let's take a baseball game scenario as an example. Imagine a sequence of writes that represent the score from a baseball game. The inning-by-inning line score is described in the [Replicated data consistency through baseball](https://www.microsoft.com/en-us/research/wp-content/uploads/2011/10/ConsistencyAndBaseballReport.pdf) paper. This hypothetical baseball game is currently in the middle of the seventh inning. It's the seventh-inning stretch. The visitors are behind with a score of 2 to 5 as shown below:

| | **1** | **2** | **3** | **4** | **5** | **6** | **7** | **8** | **9** | **Runs** |
| - | - | - | - | - | - | - | - | - | - | - |
| **Visitors** | 0 | 0 | 1 | 0 | 1 | 0 | 0 |  |  | 2 |
| **Home** | 1 | 0 | 1 | 1 | 0 | 2 |  |  |  | 5 |

An Azure Cosmos container holds the run totals for the visitors and home teams. While the game is in progress, different read guarantees might result in clients reading different scores. The following table lists the complete set of scores that might be returned by reading the visitors' and home scores with each of the five consistency guarantees. The visitors' score is listed first. Different possible return values are separated by commas.

| **Consistency level** | **Scores (Visitors, Home)** |
| - | - |
| **Strong** | 2-5 |
| **Bounded staleness** | Scores that are at most one inning out of date: 2-3, 2-4, 2-5 |
| **Session** | <ul><li>For the writer: 2-5</li><li> For anyone other than the writer: 0-0, 0-1, 0-2, 0-3, 0-4, 0-5, 1-0, 1-1, 1-2, 1-3, 1-4, 1-5, 2-0, 2-1, 2-2, 2-3, 2-4, 2-5</li><li>After reading 1-3: 1-3, 1-4, 1-5, 2-3, 2-4, 2-5</li> |
| **Consistent prefix** | 0-0, 0-1, 1-1, 1-2, 1-3, 2-3, 2-4, 2-5 |
| **Eventual** | 0-0, 0-1, 0-2, 0-3, 0-4, 0-5, 1-0, 1-1, 1-2, 1-3, 1-4, 1-5, 2-0, 2-1, 2-2, 2-3, 2-4, 2-5 |

## Additional reading

To learn more about consistency concepts, read the following articles:

- [High-level TLA+ specifications for the five consistency levels offered by Azure Cosmos DB](https://github.com/Azure/azure-cosmos-tla)
- [Replicated Data Consistency Explained Through Baseball (video) by Doug Terry](https://www.youtube.com/watch?v=gluIh8zd26I)
- [Replicated Data Consistency Explained Through Baseball (whitepaper) by Doug Terry](https://www.microsoft.com/en-us/research/publication/replicated-data-consistency-explained-through-baseball/?from=http%3A%2F%2Fresearch.microsoft.com%2Fpubs%2F157411%2Fconsistencyandbaseballreport.pdf)
- [Session guarantees for weakly consistent replicated data](https://dl.acm.org/citation.cfm?id=383631)
- [Consistency Tradeoffs in Modern Distributed Database Systems Design: CAP is Only Part of the Story](https://www.computer.org/csdl/magazine/co/2012/02/mco2012020037/13rRUxjyX7k)
- [Probabilistic Bounded Staleness (PBS) for Practical Partial Quorums](https://vldb.org/pvldb/vol5/p776_peterbailis_vldb2012.pdf)
- [Eventually Consistent - Revisited](https://www.allthingsdistributed.com/2008/12/eventually_consistent.html)

## Next steps

To learn more about consistency levels in Azure Cosmos DB, read the following articles:

* [Choose the right consistency level for your application](consistency-levels-choosing.md)
* [Consistency levels across Azure Cosmos DB APIs](consistency-levels-across-apis.md)
* [Availability and performance tradeoffs for various consistency levels](consistency-levels-tradeoffs.md)
* [Configure the default consistency level](how-to-manage-consistency.md#configure-the-default-consistency-level)
* [Override the default consistency level](how-to-manage-consistency.md#override-the-default-consistency-level)

