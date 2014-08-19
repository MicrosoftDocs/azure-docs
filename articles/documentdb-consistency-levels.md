<properties title="required" pageTitle="required" description="required" metaKeywords="Optional" services="Optional" solutions="Optional" documentationCenter="Optional" authors="Required" videoId="Optional" scriptId="Optional" />

#Consistency Levels in DocumentDB
Developers are often faced with the challenge of choosing between the two extremes of strong and eventual consistency. The reality is that there exist multiple consistency click-stops between these two extremes (see References). In most real world scenarios, applications benefit from making fine grained tradeoffs between consistency, availability and latency. DocumentDB offers four well-defined consistency levels with associated performance levels. This allows you as the application developer to make predictable consistency-availability-latency tradeoffs.  
 
All system resources including database accounts, databases, collections, users and permissions are always strongly consistent for reads and queries. The consistency levels apply only to the user defined resources. For queries and read operations on user defined resources including documents, attachments, stored procedures, triggers and UDFs, DocumentDB offers four distinct consistency levels - Strong, Bounded-Staleness, Session, and Eventual. These granular, well-defined consistency levels allow you to make sound tradeoffs between consistency, availability and performance. These consistency levels are backed by predictable performance levels ensuring consistent results for your application.   

##Consistency Levels
You can configure the Default Consistency Level on the database account which applies to all the collections (across all the databases) under your database account. By default all reads and queries issued against the user defined resources will use the default consistency level specified on the database account. You can however, lower the consistency level of a specific read/query request by specifying [x-ms-consistency-level] request header . There are four types of consistency levels supported by DocumentDB’s replication protocol – these are briefly described below.  
>[AZURE.NOTE] In future, we intend to support overriding the default consistency level on a per collection basis.  

**Strong**: Strong consistency guarantees that a write is only visible after it is committed durably by the majority quorum of replicas. A write is either synchronously committed durably by both the primary and the quorum of secondaries or is aborted. A read is always acknowledged by the majority read quorum - a client can never see an uncommitted or partial write and is always guaranteed to read the latest acknowledged write.   
 
Strong consistency provides absolute guarantees on data consistency but offers the lowest level of read and write performance.  

**Bounded Staleness**: Bounded Staleness consistency guarantees the total order of propagation of writes but with reads potentially lagging behind the writes by at most K prefixes. The read is always acknowledged by a majority quorum of replicas. The response of a read request specifies if relative freshness (in terms of K).  

Bounded Staleness provides more predictable behavior for read consistency while offering the lowest latency writes. As reads are acknowledged by a majority quorum, read latency is not the lowest offered by the system.    

**Session**: Unlike the global consistency models offered by strong and bounded staleness consistency levels, “session” consistency is tailored for a specific client session. Session consistency is usually sufficient since it provides guaranteed monotonic reads, and writes and ability to read your own writes. A read request for session consistency is issued against a replica that can serve the client requested version (part of the session cookie).  

Session provides predictable read data consistency for a session while offering the lowest latency writes. Reads are also low latency as except in the rare cases, the read will be served by a single replica.  

**Eventual**: Eventual consistency is the weakest form of consistency wherein a client may get the values which are older than the ones it had seen before, over time. In the absence of any further writes, the replicas within the group will eventually converge. The read request is served by any secondary.  

Eventual provides the weakest read consistency but offers the lowest latency for both reads and writes. 

##Query Consistency
By default, for user defined resources, the consistency level of the queries is the same as the reads. By default, the index is updated synchronously on each insert, replace or delete of a document to the collection. This enables the queries to honor the same consistency level as that of the document reads. While DocumentDB is write optimized and supports sustained volumes of document writes along with synchronous index maintenance and serving consistent queries, you can configure certain collections to update their index lazily. Lazy indexing boosts the write performance further and is ideal for bulk ingestion scenarios when a workload is primarily read-heavy.  

Indexing Mode|	Reads|	Queries  
-------------|-------|---------
Consistent (default)|	Select from Strong, Bounded Staleness, Session or Eventual|	Select from Strong, Bounded Staleness, Session or Eventual|
Lazy|	Select from Strong, Bounded Staleness, Session or Eventual|	Eventual  

As with read requests, you can lower the consistency level of a specific query request by specifying [x-ms-consistency-level] request header.  

##References
-	Doug Terry. Replicated Data Consistency explained through baseball.   
[http://research.microsoft.com/pubs/157411/ConsistencyAndBaseballReport.pdf](http://research.microsoft.com/pubs/157411/ConsistencyAndBaseballReport.pdf)
-	Doug Terry. Session Guarantees for Weakly Consistent Replicated Data.   
[http://www2.parc.com/csl/projects/bayou/pubs/sg-pdis-94/www/SessionGuaranteesPDIS_1.html](http://www2.parc.com/csl/projects/bayou/pubs/sg-pdis-94/www/SessionGuaranteesPDIS_1.html)
-	Daniel Abadi. Consistency Tradeoffs in Modern Distributed Database Systems Design: CAP is only part of the story”.   
[http://computer.org/csdl/mags/co/2012/02/mco2012020037-abs.html](http://computer.org/csdl/mags/co/2012/02/mco2012020037-abs.html) 
-	Peter Bailis, Shivaram Venkataraman, Michael J. Franklin, Joseph M. Hellerstein, Ion Stoica. Probabilistic Bounded Staleness (PBS) for Practical Partial Quorums.   
[http://vldb.org/pvldb/vol5/p776_peterbailis_vldb2012.pdf](http://vldb.org/pvldb/vol5/p776_peterbailis_vldb2012.pdf)
-	Werner Vogels. Eventual Consistent – Revisited.    
[http://allthingsdistributed.com/2008/12/eventually_consistent.html](http://allthingsdistributed.com/2008/12/eventually_consistent.html)
