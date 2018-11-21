---
title: Consistency levels in Azure Cosmos DB | Microsoft Docs
description: Azure Cosmos DB has five consistency levels to help balance eventual consistency, availability, and latency trade-offs.
keywords: eventual consistency, azure cosmos db, azure, Microsoft azure
services: cosmos-db
author: aliuy
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 03/27/2018
ms.author: andrl
ms.custom: H1Hack27Feb2017

---
# Consistency levels in Azure Cosmos DB

Distributed databases relying on replication for high availability, low latency or both, make the fundamental tradeoff between the read consistency vs. availability, latency and throughput. Most commercially available distributed databases ask developers to choose between the two extreme consistency models: strong consistency and eventual consistency. While the [linearizability](http://cs.brown.edu/~mph/HerlihyW90/p463-herlihy.pdf) or the strong consistency model is the gold standard of data programmability, it adds a steep price of higher latency (in steady state) and reduced availability (during failures). On the other hand, eventual consistency offers higher availability and better performance, but is hard to program applications.

Cosmos DB approaches data consistency as a spectrum of choices instead of the two extremes. While strong consistency and eventual consistency are the two ends of the spectrum, there are many consistency choices along the spectrum. These consistency options enable developers to make precise choices and granular tradeoffs with respect to high availability or performance. Cosmos DB enabled developers to choose among the five well-defined consistency models from the consistency spectrum (strongest to weakest) – **strong**, **bounded staleness**, **session**, **consistent prefix**, and **eventual**. Each of these consistency models is well-defined, intuitive and can be used for specific real-world scenarios. Each of the five consistency models provide [availability and performance tradeoffs](consistency-levels-tradeoffs.md) and are backed by comprehensive SLAs. The following image shows different consistency levels as a spectrum:

![Consistency as a spectrum](./media/consistency-levels/five-consistency-levels.png)

The consistency levels are region-agnostic. The consistency level of your Cosmos DB account, is guaranteed for all read operations regardless of the region from which the reads and writes are served, the number of regions associated with your Cosmos account or whether your account is configured with a single or multiple write regions.

## Scope of the read-consistency

The read-consistency applies to a single read operation scoped within a partition-key range (that is a logical partition). The read operation can be issued by a remote client or a stored procedure.

## Configuring the default consistency level

You can configure the **default consistency level** on your Cosmos DB account at any time. The default consistency level configured on your account applies to all Cosmos databases (and containers) under that account. All reads and queries issued against a container or a database will use the specified consistency level by default. To learn more, see how to [configure the default consistency level](how-to-manage-consistency.md#configure-the-default-consistency-level) article.

## Guarantees associated with consistency levels

The comprehensive SLAs provided by Azure Cosmos DB guarantee that 100% of read requests will meet the consistency guarantee for any consistency level you choose. A read request is considered to meet the consistency SLA, if all the consistency guarantees associated with the consistency level are satisfied. The precise definitions of the five consistency levels in Cosmos DB by using the [TLA+ specification language](http://lamport.azurewebsites.net/tla/tla.html) are provided in the [azure-cosmos-tla](https://github.com/Azure/azure-cosmos-tla) GitHub repo. The semantics of the five consistency levels are described below:

- **Consistency level = "strong"**: Strong consistency offers a [linearizability](https://aphyr.com/posts/313-strong-consistency-models) guarantee, with the reads guaranteed to return the most recent committed version of an item. A client will never see an uncommitted or partial write. Users are always guaranteed to read the latest committed write.

- **Consistency level = "bounded staleness"**: The reads are guaranteed to honor the consistent-prefix guarantee. The reads may lag behind writes by at most K versions (that is "updates") of an item or by ‘t’ time-interval. When choosing bounded staleness, the "staleness" can be configured in two ways: 

  * Number of versions (K) of the item or
  * The time interval (t) by which the reads may lag behind the writes. 

  Bounded staleness offers total global order except within the "staleness window." The monotonic read guarantees exist within a region both inside and outside the "staleness window." Strong consistency has the same semantics as the ones offered by bounded staleness and with a “staleness window” equal to zero. Bounded staleness is also referred to as **time-delayed linearizability**. When a client performs read operations within a region that accepts writes, the guarantees provided by bounded staleness consistency are identical to those with the strong consistency.

- **Consistency level = "session"**: The reads are guaranteed to honor the consistent-prefix (assuming a single “writer” session), monotonic reads, monotonic writes, read-your-writes, write-follows-reads guarantees. Session consistency is scoped to a client session.

- **Consistency level = "consistent prefix"**: Updates returned contain some prefix of all the updates, with no gaps. Consistent prefix guarantee that reads never see out of order writes.

- **Consistency level = "eventual"**: There is no ordering guarantee for reads. In absence of any further writes, the replicas eventually converge.

## Consistency levels explained through baseball

Let's take the baseball game scenario as an example, imagine a sequence of writes representing the score from a baseball game with the inning-by-inning line score as described in the [Replicated data consistency through baseball](https://www.microsoft.com/en-us/research/wp-content/uploads/2011/10/ConsistencyAndBaseballReport.pdf) paper. This hypothetical baseball game is currently in the middle of the seventh inning (the proverbial seventh-inning stretch), and the home team is winning 2-5.

| | **1** | **2** | **3** | **4** | **5** | **6** | **7** | **8** | **9** | **Runs** |
| - | - | - | - | - | - | - | - | - | - | - |
| **Visitors** | 0 | 0 | 1 | 0 | 1 | 0 | 0 |  |  | 2 |
| **Home** | 1 | 0 | 1 | 1 | 0 | 2 |  |  |  | 5 |

A Cosmos DB container holds the visitors and home team’s run totals. While the game is in progress, different read guarantees may result in clients reading different scores. The following table lists the complete set of scores that could be returned by reading the visitors and home scores with each of the five consistency guarantees. The visitors’ score is listed first, and different possible return values are separated by commas.

| **Consistency Level** | **Scores** |
| - | - |
| **Strong** | 2-5 |
| **Bounded Staleness** | scores that are at most one inning out-of-date" 2-3, 2-4, 2-5 |
| **Session** | <ul><li>for the writer" 2-5</li><li> for anyone other than the writer: 0-0, 0-1, 0-2, 0-3, 0-4, 0-5, 1-0, 1-1, 1-2, 1-3, 1-4, 1-5, 2-0, 2-1, 2-2, 2-3, 2-4, 2-5</li><li>after reading 1-3:  1-3, 1-4, 1-5, 2-3, 2-4, 2-5</li> |
| **Consistent Prefix** | 0-0, 0-1, 1-1, 1-2, 1-3, 2-3, 2-4, 2-5 |
| **Eventual** | 0-0, 0-1, 0-2, 0-3, 0-4, 0-5, 1-0, 1-1, 1-2, 1-3, 1-4, 1-5, 2-0, 2-1, 2-2, 2-3, 2-4, 2-5 |

## Additional reading

To learn more about consistency concepts, read the following articles:

- [High-level TLA+ specifications for the five consistency levels offered by Azure Cosmos DB](https://github.com/Azure/azure-cosmos-tla)
- [Replicated Data Consistency Explained through Baseball (video) by Doug Terry](https://www.youtube.com/watch?v=gluIh8zd26I)
- [Replicated Data Consistency Explained through Baseball (whitepaper) by Doug Terry](https://www.microsoft.com/en-us/research/publication/replicated-data-consistency-explained-through-baseball/?from=http%3A%2F%2Fresearch.microsoft.com%2Fpubs%2F157411%2Fconsistencyandbaseballreport.pdf)
- [Session Guarantees for Weakly Consistent Replicated Data](https://dl.acm.org/citation.cfm?id=383631)
- [Consistency Tradeoffs in Modern Distributed Database Systems Design: CAP is Only Part of the Story](https://www.computer.org/web/csdl/index/-/csdl/mags/co/2012/02/mco2012020037-abs.html)
- [Probabilistic Bounded Staleness (PBS) for Practical Partial Quorums](http://vldb.org/pvldb/vol5/p776_peterbailis_vldb2012.pdf)
- [Eventually Consistent - Revisited](https://www.allthingsdistributed.com/2008/12/eventually_consistent.html)

## Next steps

To learn more about consistency levels in Cosmos DB, read the following articles:

* [Choosing the right consistency level for your application](consistency-levels-choosing.md)
* [Consistency levels across Cosmos DB APIs](consistency-levels-across-apis.md)
* [Availability and performance tradeoffs for various consistency levels](consistency-levels-tradeoffs.md)
* [How to configure the default consistency level](how-to-manage-consistency.md#configure-the-default-consistency-level)
* [How to override the default consistency level](how-to-manage-consistency.md#override-the-default-consistency-level)

