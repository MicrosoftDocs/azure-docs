---
title: Consistency levels in Azure Cosmos DB | Microsoft Docs
description: Azure Cosmos DB has five consistency levels to help balance eventual consistency, availability, and latency trade-offs.
keywords: eventual consistency, azure cosmos db, azure, Microsoft azure
services: cosmos-db
author: mimig1
manager: jhubbard
editor: cgronlun
documentationcenter: ''

ms.assetid: 3fe51cfa-a889-4a4a-b320-16bf871fe74c
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/16/2017
ms.author: mimig
ms.custom: H1Hack27Feb2017

---
# Tunable data consistency levels in Azure Cosmos DB
Azure Cosmos DB is designed from the ground up with global distribution in mind for every data model. It is designed to offer predictable low latency guarantees, a 99.99% availability SLA, and multiple well-defined relaxed consistency models. Currently, Azure Cosmos DB provides five consistency levels: strong, bounded-staleness, session, consistent prefix, and eventual. 

Besides **strong** and **eventual consistency** models commonly offered by distributed databases, Azure Cosmos DB offers three more carefully codified and operationalized consistency models, and has validated their usefulness against real world use cases. These are the **bounded staleness**, **session**, and **consistent prefix** consistency levels. Collectively these five consistency levels enable you to make well-reasoned trade-offs between consistency, availability, and latency. 

## Distributed databases and consistency
Commercial distributed databases fall into two categories: databases that do not offer well-defined, provable consistency choices at all, and databases which offer two extreme programmability choices (strong vs. eventual consistency). 

The former burdens application developers with minutia of their replication protocols and expects them to make difficult tradeoffs between consistency, availability, latency, and throughput. The latter puts a pressure to choose one of the two extremes. Despite the abundance of research and proposals for more than 50 consistency models, the distributed database community has not been able to commercialize consistency levels beyond strong and eventual consistency. Cosmos DB allows developers to choose between five well-defined consistency models along the consistency spectrum – strong, bounded staleness, [session](http://dl.acm.org/citation.cfm?id=383631), consistent prefix, and eventual. 

![Azure Cosmos DB offers multiple, well defined (relaxed) consistency models to choose from](./media/consistency-levels/five-consistency-levels.png)

The following table illustrates the specific guarantees each consistency level provides.
 
**Consistency Levels and guarantees**

| Consistency Level	| Guarantees |
| --- | --- |
| Strong | Linearizability |
| Bounded Staleness	| Consistent Prefix. Reads lag behind writes by k prefixes or t interval |
| Session	| Consistent Prefix. Monotonic reads, monotonic writes, read-your-writes, write-follows-reads |
| Consistent Prefix	| Updates returned are some prefix of all the updates, with no gaps |
| Eventual	| Out of order reads |

You can configure the default consistency level on your Cosmos DB account (and later override the consistency on a specific read request). Internally, the default consistency level applies to data within the partition sets which may be span regions. About 73% of our tenants use session consistency and 20% prefer bounded staleness. We observe that approximately 3% of our customers experiment with various consistency levels initially before settling on a specific consistency choice for their application. We also observe that only 2% of our tenants override consistency levels on a per request basis. 

In Cosmos DB, reads served at session, consistent prefix and eventual consistency are twice as cheap as reads with strong or bounded staleness consistency. Cosmos DB has industry leading comprehensive 99.99% SLAs including consistency guarantees along with availability, throughput, and latency. We employ a [linearizability checker](http://dl.acm.org/citation.cfm?id=1806634), which continuously operates over our service telemetry and openly reports any consistency violations to you. For bounded staleness, we monitor and report any violations to k and t bounds. For all five relaxed consistency levels, we also report the [probabilistic bounded staleness metric](http://dl.acm.org/citation.cfm?id=2212359) directly to you.  

## Scope of consistency
The granularity of consistency is scoped to a single user request. A write request may correspond to an insert, replace, upsert, or delete transaction. As with writes, a read/query transaction is also scoped to a single user request. The user may be required to paginate over a large result-set, spanning multiple partitions, but each read transaction is scoped to a single page and served from within a single partition.

## Consistency levels
You can configure a default consistency level on your database account that applies to all collections (and databases) under your Cosmos DB account. By default, all reads and queries issued against the user-defined resources use the default consistency level specified on the database account. You can relax the consistency level of a specific read/query request using in each of the supported APIs. There are five types of consistency levels supported by the Azure Cosmos DB replication protocol that provide a clear trade-off between specific consistency guarantees and performance, as described in this section.

**Strong**: 

* Strong consistency offers a [linearizability](https://aphyr.com/posts/313-strong-consistency-models) guarantee with the reads guaranteed to return the most recent version of an item. 
* Strong consistency guarantees that a write is only visible after it is committed durably by the majority quorum of replicas. A write is either synchronously committed durably by both the primary and the quorum of secondaries, or it is aborted. A read is always acknowledged by the majority read quorum, a client can never see an uncommitted or partial write and is always guaranteed to read the latest acknowledged write. 
* Azure Cosmos DB accounts that are configured to use strong consistency cannot associate more than one Azure region with their Azure Cosmos DB account. 
* The cost of a read operation (in terms of [request units](request-units.md) consumed) with strong consistency is higher than session and eventual, but the same as bounded staleness.

**Bounded staleness**: 

* Bounded staleness consistency guarantees that the reads may lag behind writes by at most *K* versions or prefixes of an item or *t* time-interval. 
* Therefore, when choosing bounded staleness, the "staleness" can be configured in two ways: number of versions *K* of the item by which the reads lag behind the writes, and the time interval *t* 
* Bounded staleness offers total global order except within the "staleness window." The monotonic read guarantees exists within a region both inside and outside the "staleness window." 
* Bounded staleness provides a stronger consistency guarantee than session or eventual consistency. For globally distributed applications, we recommend you use bounded staleness for scenarios where you would like to have strong consistency but also want 99.99% availability and low latency. 
* Azure Cosmos DB accounts that are configured with bounded staleness consistency can associate any number of Azure regions with their Azure Cosmos DB account. 
* The cost of a read operation (in terms of RUs consumed) with bounded staleness is higher than session and eventual consistency, but the same as strong consistency.

**Session**: 

* Unlike the global consistency models offered by strong and bounded staleness consistency levels, session consistency is scoped to a client session. 
* Session consistency is ideal for all scenarios where a device or user session is involved since it guarantees monotonic reads, monotonic writes, and read your own writes (RYW) guarantees. 
* Session consistency provides predictable consistency for a session, and maximum read throughput while offering the lowest latency writes and reads. 
* Azure Cosmos DB accounts that are configured with session consistency can associate any number of Azure regions with their Azure Cosmos DB account. 
* The cost of a read operation (in terms of RUs consumed) with session consistency level is less than strong and bounded staleness, but more than eventual consistency

<a id="consistent-prefix"></a>
**Consistent Prefix**: 

* Consistent prefix guarantees that in absence of any further writes, the replicas within the group eventually converge. 
* Consistent prefix guarantees that reads never see out of order writes. If writes were performed in the order `A, B, C`, then a client sees either `A`, `A,B`, or `A,B,C`, but never out of order like `A,C` or `B,A,C`.
* Azure Cosmos DB accounts that are configured with consistent prefix consistency can associate any number of Azure regions with their Azure Cosmos DB account. 

**Eventual**: 

* Eventual consistency guarantees that in absence of any further writes, the replicas within the group eventually converge. 
* Eventual consistency is the weakest form of consistency where a client may get the values that are older than the ones it had seen before.
* Eventual consistency provides the weakest read consistency but offers the lowest latency for both reads and writes.
* Azure Cosmos DB accounts that are configured with eventual consistency can associate any number of Azure regions with their Azure Cosmos DB account. 
* The cost of a read operation (in terms of RUs consumed) with the eventual consistency level is the lowest of all the Azure Cosmos DB consistency levels.

## Configuring the default consistency level
1. In the [Azure portal](https://portal.azure.com/), in the Jumpbar, click **Azure Cosmos DB**.
2. In the **Azure Cosmos DB** blade, select the database account to modify.
3. In the account blade, click **Default consistency**.
4. In the **Default Consistency** blade, select the new consistency level and click **Save**.
   
    ![Screen shot highlighting the Settings icon and Default Consistency entry](./media/consistency-levels/database-consistency-level-1.png)

## Consistency levels for queries
By default, for user-defined resources, the consistency level for queries is the same as the consistency level for reads. By default, the index is updated synchronously on each insert, replace, or delete of an item to the Cosmos DB container. This enables the queries to honor the same consistency level as that of point reads. While Azure Cosmos DB is write optimized and supports sustained volumes of writes, synchronous index maintenance and serving consistent queries, you can configure certain collections to update their index lazily. Lazy indexing further boosts the write performance and is ideal for bulk ingestion scenarios when a workload is primarily read-heavy.  

| Indexing Mode | Reads | Queries |
| --- | --- | --- |
| Consistent (default) |Select from strong, bounded staleness, session, consistent prefix, or eventual |Select from strong, bounded staleness, session, or eventual |
| Lazy |Select from strong, bounded staleness, session, consistent prefix, or eventual |Eventual |
| None |Select from strong, bounded staleness, session, consistent prefix, or eventual |Not applicable |

As with read requests, you can lower the consistency level of a specific query request in each API.

## Next steps
If you'd like to do more reading about consistency levels and tradeoffs, we recommend the following resources:

* Doug Terry. Replicated Data Consistency explained through baseball (video).   
  [https://www.youtube.com/watch?v=gluIh8zd26I](https://www.youtube.com/watch?v=gluIh8zd26I)
* Doug Terry. Replicated Data Consistency explained through baseball.   
  [http://research.microsoft.com/pubs/157411/ConsistencyAndBaseballReport.pdf](http://research.microsoft.com/pubs/157411/ConsistencyAndBaseballReport.pdf)
* Doug Terry. Session Guarantees for Weakly Consistent Replicated Data.   
  [http://dl.acm.org/citation.cfm?id=383631](http://dl.acm.org/citation.cfm?id=383631)
* Daniel Abadi. Consistency Tradeoffs in Modern Distributed Database Systems Design: CAP is only part of the story”.   
  [http://computer.org/csdl/mags/co/2012/02/mco2012020037-abs.html](http://computer.org/csdl/mags/co/2012/02/mco2012020037-abs.html)
* Peter Bailis, Shivaram Venkataraman, Michael J. Franklin, Joseph M. Hellerstein, Ion Stoica. Probabilistic Bounded Staleness (PBS) for Practical Partial Quorums.   
  [http://vldb.org/pvldb/vol5/p776_peterbailis_vldb2012.pdf](http://vldb.org/pvldb/vol5/p776_peterbailis_vldb2012.pdf)
* Werner Vogels. Eventual Consistent - Revisited.    
  [http://allthingsdistributed.com/2008/12/eventually_consistent.html](http://allthingsdistributed.com/2008/12/eventually_consistent.html)
* Moni Naor , Avishai Wool, The Load, Capacity, and Availability of Quorum Systems, SIAM Journal on Computing, v.27 n.2, p.423-447, April 1998.
  [http://epubs.siam.org/doi/abs/10.1137/S0097539795281232](http://epubs.siam.org/doi/abs/10.1137/S0097539795281232)
* Sebastian Burckhardt, Chris Dern, Macanal Musuvathi, Roy Tan, Line-up: a complete and automatic linearizability checker, Proceedings of the 2010 ACM SIGPLAN conference on Programming language design and implementation, June 05-10, 2010, Toronto, Ontario, Canada  [doi>10.1145/1806596.1806634]
  [http://dl.acm.org/citation.cfm?id=1806634](http://dl.acm.org/citation.cfm?id=1806634)
* Peter Bailis, Shivaram Venkataraman, Michael J. Franklin, Joseph M. Hellerstein , Ion Stoica, Probabilistically bounded staleness for practical partial quorums, Proceedings of the VLDB Endowment, v.5 n.8, p.776-787, April 2012
  [http://dl.acm.org/citation.cfm?id=2212359](http://dl.acm.org/citation.cfm?id=2212359)
