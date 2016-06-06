<properties
	pageTitle="Consistency levels in DocumentDB | Microsoft Azure"
	description="Review how DocumentDB has four consistency levels with associated performance levels to help balance eventual consistency, availability, and latency trade-offs."
	keywords="eventual consistency, documentdb, azure, Microsoft azure"
	services="documentdb"
	authors="mimig1"
	manager="jhubbard"
	editor="cgronlun"
	documentationCenter=""/>

<tags
	ms.service="documentdb"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/27/2016"
	ms.author="mimig"/>

# Using consistency levels to maximize availability and performance in DocumentDB

Despite more than four decades of research in the systems community and multitude of relaxed consistency models, most commercial databases do not offer well-defined consistency models and guarantees to developers. Application developers are burdened with the minutia of replication protocols and are expected to make reasoned tradeoffs between consistency, availability, and performance. A small number of NoSQL databases do offer (two albeit extreme) programmability choices: **strong** vs. **eventual** consistency. While strong consistency enables developers to write correct programs easily, it is impossible to operationalize it in a globally distributed setup and offer guarantees for consistency, availability or performance. Since strong consistency is essentially applicable only within the local datacenter, for globally distributed applications written against these databases, the only viable consistency model has been eventual consistency. While eventual consistency offers great performance and availability properties, application developers need to understand its impact on the correctness of the program behavior. 

DocumentDB is designed from the ground up with global distribution. It is designed to offer predictable low latency guarantees, 99.99 availability SLA and multiple well-defined relaxed consistency models. Currently, DocumentDB allows you to choose from four well-defined consistency levels: strong, bounded-staleness, session and eventual. Besides the strong and the eventual consistency models, we have carefully codified and operationalized two additional consistency models – bounded staleness and session, and validated their usefulness against real world use cases. Collectively these four consistency levels allow you to make well-reasoned tradeoffs between consistency, availability, and latency. 

The granularity of consistency is of a single user request. A write request may correspond to an insert, upsert, replace, upsert, delete transaction (with or without the execution of an associated pre/post triggers) or may correspond to transactional execution of a JavaScript stored procedure operating over multiple documents within a partition. As with the writes, a read/query transaction is also scoped to a single user request. The user may require to paginate over a large result-set spanning multiple partitions, but each read transaction is scoped to a single page and served from within a single partition.  For queries and read operations on user defined resources, including documents, attachments, stored procedures, triggers, and UDFs, DocumentDB offers four distinct consistency levels:


 - Strong consistency
 - Bounded staleness consistency
 - Session consistency
 - Eventual consistency

All of these consistency levels are backed by predictable performance, availability and consistency guarantees enabling you to ensure that your application can correctly and intuitively reason over the data in DocumentDB and the tradeoffs of consistency, availability and performance are clear..  

## Consistency levels

You can configure a default consistency level on your database account that applies to all the collections (across all of the databases) under your database account. By default, all reads and queries issued against the user defined resources will use the default consistency level specified on the database account. However, you can relax the consistency level of a specific read/query request by specifying [x-ms-consistency-level] request header. There are four types of consistency levels supported by the DocumentDB replication protocol - these are briefly described below.

>[AZURE.NOTE] In a future release, we intend to support overriding the default consistency level on a per collection basis.  

**Strong**: Strong consistency offers linearizability guarantee with the reads guaranteed to return the most recent version of a document. Strong consistency is only available within a single Azure region. Strong consistency guarantees that a write is only visible after it is committed durably by the majority quorum of replicas. A write is either synchronously committed durably by both the primary and the quorum of secondaries or it is aborted. A read is always acknowledged by the majority read quorum - a client can never see an uncommitted or partial write and is always guaranteed to read the latest acknowledged write. 

**Bounded staleness**: BBounded staleness consistency guarantees the total order of propagation of writes with the possibility that reads lag behind writes by at most K prefixes. The read is always acknowledged by a majority quorum of replicas. The response of a read request specifies its relative freshness (in terms of K). With bounded staleness you can set configurable threshold of staleness (as prefixes or time) for reads to tradeoff latency and consistency in steady state. Bounded staleness offers total global order except within the “staleness window”. Bounded staleness provides a stronger consistency guarantee than session or eventual consistency.

Bounded staleness provides more predictable behavior for read consistency while offering the lowest latency writes. As reads are acknowledged by a majority quorum, read latency is not the lowest offered by the system. For globally distributed applications, Bounded Staleness is the only viable option for scenarios where you would like to have strong consistency. 

**Session**: Unlike the global consistency models offered by strong and bounded staleness consistency levels, “session” consistency is tailored for a specific client session. Session consistency is usually sufficient since it provides guaranteed monotonic reads, monotonic writes and read your own writes (RYW) guarantees. A read request for session consistency is issued against a replica that can serve the client requested version (part of the session cookie).

Session consistency provides predictable read data consistency for a session while offering the lowest latency writes and reads.  

**Eventual**: Eventual consistency is the weakest form of consistency wherein a client may get the values which are older than the ones it had seen before, over time. In the absence of any further writes, the replicas within the group will eventually converge. The read request is served by any secondary index.

Eventual consistency provides the weakest read consistency but offers the lowest latency for both reads and writes

## Consistency Levels and Tradeoffs

|                                                          |    Strong                                       |    Bounded Staleness                                                                           |    Session                                       |    Eventual                                 |
|----------------------------------------------------------|-------------------------------------------------|------------------------------------------------------------------------------------------------|--------------------------------------------------|--------------------------------------------------|
|    **Global distribution**                               |    No, single region                            |    Yes, any number of regions                                                                  |    Yes, any number of regions                    |    Yes, any number of regions                    |
|    **Total global order**                                |    Yes                                          |    Yes, outside of the “staleness window”                                                      |    No, Partial “session” order                   |    No                                            |
|    **Consistent Prefix Guarantee**                       |    Yes                                          |    Yes                                                                                         |    Yes                                           |    Yes                                           |
|    **Monotonic reads**                                   |    Yes                                          |    Yes, across   regions outside of the staleness window and within a region all the time.     |    Yes ,for the given session                    |    No                                            |
|    **Monotonic writes**                                  |    Yes                                          |    Yes                                                                                         |    Yes                                           |    Yes                                           |
|    **Read your writes**                                  |    Yes                                          |    Yes                                                                                         |    Yes, in the write region                      |    No                                            |
|    **Read latencies at P99**                             |    < 10ms                                       |    < 10ms                                                                                      |    < 10ms                                        |    < 10ms                                        |
|    **write latencies at P99**                            |    < 15ms                                       |    < 15ms                                                                                      |    < 15ms                                        |    < 15ms                                        |
|    **Availability SLA**                                  |    Yes, 99.99                                   |    Yes, 99.99                                                                                  |    Yes, 99.99                                    |    Yes, 99.99                                    |
|    **Throughput for 100 RUs**                            |    30 read requests/sec each of 1KB document    |    30 read requests/sec each of 1KB document                                                   |    100 read requests/sec each of 1KB document    |    100 read requests/sec each of 1KB document    |
|    **Potential data loss in case of regional disaster**  |    Complete data loss                           |    Limited to the staleness window                                                             |    Limited to the 100 sec.                       |    Limited to the 100 sec.                       |


## Changing the database consistency level

1.  In the [Azure Portal](https://portal.azure.com/), in the Jumpbar, click **DocumentDB Accounts**.

2. In the **DocumentDB Accounts** blade, select the database account to modify.

3. In the account blade, if the **Settings** blade is not already opened, click the **Settings** icon on the top command bar.

4. In the **All Settings** blade, click on the **Default Consistency** entry under **Feature**.

	![Screen shot highlighting the Settings icon and Default Consistency entry](./media/documentdb-consistency-levels/database-consistency-level-1.png)

5. In the **Default Consistency** blade, select the new consistency level and click **OK**.

	![Screen shot highlighting the Consistency level and the OK button ](./media/documentdb-consistency-levels/database-consistency-level-2.png)

## Consistency levels for queries

By default, for user defined resources, the consistency level of the queries is the same as the reads. By default, the index is updated synchronously on each insert, replace, or delete of a document to the collection. This enables the queries to honor the same consistency level as that of the document reads. While DocumentDB is write optimized and supports sustained volumes of document writes along with synchronous index maintenance and serving consistent queries, you can configure certain collections to update their index lazily. Lazy indexing further boosts the write performance and is ideal for bulk ingestion scenarios when a workload is primarily read-heavy.  

Indexing Mode|	Reads|	Queries  
-------------|-------|---------
Consistent (default)|	Select from Strong, Bounded staleness, Session, or Eventual|	Select from Strong, Bounded staleness, Session, or Eventual|
Lazy|	Select from Strong, Bounded staleness, Session, or Eventual|	Eventual  

As with read requests, you can lower the consistency level of a specific query request by specifying the [x-ms-consistency-level](https://msdn.microsoft.com/library/azure/mt632096.aspx) request header.

## Next steps

If you'd like to do more reading about consistency levels and tradeoffs, we recommend the following resources:

-	Doug Terry. Replicated Data Consistency explained through baseball (video).   
[https://www.youtube.com/watch?v=gluIh8zd26I](https://www.youtube.com/watch?v=gluIh8zd26I)
-	Doug Terry. Replicated Data Consistency explained through baseball.   
[http://research.microsoft.com/pubs/157411/ConsistencyAndBaseballReport.pdf](http://research.microsoft.com/pubs/157411/ConsistencyAndBaseballReport.pdf)
-	Doug Terry. Session Guarantees for Weakly Consistent Replicated Data.   
[http://dl.acm.org/citation.cfm?id=383631](http://dl.acm.org/citation.cfm?id=383631)
-	Daniel Abadi. Consistency Tradeoffs in Modern Distributed Database Systems Design: CAP is only part of the story”.   
[http://computer.org/csdl/mags/co/2012/02/mco2012020037-abs.html](http://computer.org/csdl/mags/co/2012/02/mco2012020037-abs.html)
-	Peter Bailis, Shivaram Venkataraman, Michael J. Franklin, Joseph M. Hellerstein, Ion Stoica. Probabilistic Bounded Staleness (PBS) for Practical Partial Quorums.   
[http://vldb.org/pvldb/vol5/p776_peterbailis_vldb2012.pdf](http://vldb.org/pvldb/vol5/p776_peterbailis_vldb2012.pdf)
-	Werner Vogels. Eventual Consistent - Revisited.    
[http://allthingsdistributed.com/2008/12/eventually_consistent.html](http://allthingsdistributed.com/2008/12/eventually_consistent.html)
