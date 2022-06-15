---
title: High Memory Utilization
description: Troubleshooting guide for high memory utilization in Azure Database for PostgreSQL - Flexible Server
ms.author: sbalijepalli
author: sarat0681
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 6/15/2022
---

# High Memory Utilization
The purpose of this document is to discuss common scenarios and root causes that might lead to high memory utilization. 
This document highlights the following -

-   Tools to Identify high memory utilization
-   Reasons & Remedial actions  

## Tools To Identify High Memory Utilization 

### Azure Metrics
Various metrics including percentage of memory in use for the definite date and timeframe can be monitored using Azure Metrics.For proactive monitoring, configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](./howto-alert-on-metrics.md).


### Query Store

Query Store automatically captures the history of queries and their runtime statistics, and it retains them for your review.It can correlate wait event information with query run time statistics. Query Store can be used to identify queries which have high memory consumption during the period of interest. 

For more information on setting up and usage of Query Store visit [Query Store](./concepts-query-store.md).

## Reasons And Remedial Actions

The following server parameters impact memory consumption and should be reviewed:

#### Work_Mem  
The `work_mem` parameter specifies the amount of memory to be used by internal sort operations and hash tables before writing to
 temporary disk files. It is not on a per-query basis; it is set based on the number of sort and hash operations. 

If the workload has a lot of short-running queries with simple joins and minimal sort operations, it is 
advised to keep lower `work_mem`. If there are a few active queries with complex joins and sorts, then it is advised to set a higher value for work_mem. 

It is tough to get the value of `work_mem` right. But if you notice high memory utilization or out-of-memory issues, 
it is advised to decrease `work_mem`.

A safer setting for `work_mem` is 

`work_mem` = Total RAM / Max_Connections / 16 

The default value of `work_mem` = 4 MB. You can set the `work_mem` value on multiple levels including at the server level 
via parameters page in Azure Portal. A good strategy is to monitor memory consumption during peak times. 
If disk sorts are happening during this time and there is plenty of unused memory, increase work_mem gradually 
until a good balance of available and used memory is reached.
Similarly, if the memory use looks high, reduce work_mem. 

#### Maintenance_Work_Mem 

`maintenance_work_mem` is for maintenance tasks like vacuuming, adding indexes or foreign keys. We can set a large value that can help 
in specific tasks like vacuum, create index, alter table and add foreign key. The usage of memory in this scenario is per session. 

For example, consider a session that is creating an index and there are three autovacuum workers running. 
If `maintenance_work_mem` is set to 1 GB, then all sessions combined will use 4 GB of memory.

A high `maintenance_work_mem` value along with multiple running sessions for vacuuming/index creation/adding foreign keys can cause 
high memory utilization. The maximum allowed value for the ``maintenance_work_mem`` server parameter in Azure Database for Flexible Server
 is 2 GB.


#### Shared Buffers 

The `shared_buffers` parameter determines how much memory is dedicated to the server for caching data. The objective of shared buffers 
is to reduce DISK I/O.

A reasonable setting for shared buffers is 25% of RAM. It is recommended to not set to a value more than 40% of RAM. 
                                                                                                         
### Max Connections 

All new and idle connections on a Postgres database consume 2 MB of memory. One way to monitor idle connections 
is using the following query: 
~~~
    select count (*) from pg_stat_activity where state = 'idle' ;
~~~
When the number of idle connections to a database is high, memory consumption also increases.

In situations where there are a lot of idle database connections consider using a connection pooler like PgBouncer.

For more details on PgBouncer check:

[Connection Pooler](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717)

[Best Practices](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connection-handling-best-practice-with-postgresql/ba-p/790883)


Azure Database for Flexible Server offers PgBouncer as a built-in connection pooling solution. For more information, see [Pg Bouncer](./concepts-pgbouncer.md)

### Explain Analyze 

Once high memory-consuming queries have been identified from Query Store,use “EXPLAIN” and “EXPLAIN ANALYZE” to further investigate and tune them.

For more information on EXPLAIN command [Explain Plan](https://www.postgresql.org/docs/current/sql-explain.html) 
