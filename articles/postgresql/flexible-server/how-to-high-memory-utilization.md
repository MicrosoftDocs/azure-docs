---
title: High Memory Utilization
description: Troubleshooting guide for high memory utilization in Azure Database for PostgreSQL - Flexible Server
ms.author: sbalijepalli
author: sarat0681
ms.reviewer: maghan
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 08/03/2022
---

# High memory utilization in Azure Database for PostgreSQL - Flexible Server

This article introduces common scenarios and root causes that might lead to high memory utilization in [Azure Database for PostgreSQL - Flexible Server](overview.md). 

In this article, you learn: 

- Tools to identify high memory utilization.
- Reasons for high memory & remedial actions.

## Tools to identify high memory utilization 

Consider the following tools to identify high memory utilization. 

### Azure Metrics

Use Azure Metrics to monitor the percentage of memory in use for the definite date and time frame. 
For proactive monitoring, configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](./howto-alert-on-metrics.md).


### Query Store

Query Store automatically captures the history of queries and their runtime statistics, and it retains them for your review. 

Query Store can correlate wait event information with query run time statistics. Use Query Store to identify queries that have high memory consumption during the period of interest. 

For more information on setting up and using Query Store, review [Query Store](./concepts-query-store.md).

## Reasons and remedial actions

Consider the following reasons and remedial actions for resolving high memory utilization. 

### Server parameters

The following server parameters impact memory consumption and should be reviewed:

#### Work_Mem  

The `work_mem` parameter specifies the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files. It isn't on a per-query basis rather, it's set based on the number of sort and hash operations. 


If the workload has many short-running queries with simple joins and minimal sort operations, it's advised to keep lower `work_mem`. If there are a few active queries with complex joins and sorts, then it's advised to set a higher value for work_mem. 

It's tough to get the value of `work_mem` right.  If you notice high memory utilization or out-of-memory issues, consider decreasing `work_mem`. 

A safer setting for `work_mem` is `work_mem = Total RAM / Max_Connections / 16 `

The default value of `work_mem` = 4 MB. You can set the `work_mem` value on multiple levels including at the server level via the parameters page in the Azure portal. 

A good strategy is to monitor memory consumption during peak times. 

If disk sorts are happening during this time and there's plenty of unused memory, increase `work_mem` gradually until you're able to reach a good balance between available and used memory
Similarly, if the memory use looks high, reduce `work_mem`. 

#### Maintenance_Work_Mem 

`maintenance_work_mem` is for maintenance tasks like vacuuming, adding indexes or foreign keys. The usage of memory in this scenario is per session. 

For example, consider a scenario where there are three autovacuum workers running. 

If `maintenance_work_mem` is set to 1 GB, then all sessions combined will use 3 GB of memory.

A high `maintenance_work_mem` value along with multiple running sessions for vacuuming/index creation/adding foreign keys can cause high memory utilization. The maximum allowed value for the `maintenance_work_mem` server parameter in Azure Database for Flexible Server  is 2 GB.

#### Shared buffers 

The `shared_buffers` parameter determines how much memory is dedicated to the server for caching data. The objective of shared buffers is to reduce DISK I/O.

A reasonable setting for shared buffers is 25% of RAM. Setting a value of greater than 40% of RAM isn't recommended for most common workloads. 

### Max connections 

All new and idle connections on a Postgres database consume up to 2 MB of memory. One way to monitor connections is by using the following query: 

```postgresql
select count(*) from pg_stat_activity;
```

When the number of connections to a database is high, memory consumption also increases.

In situations where there are many database connections, consider using a connection pooler like PgBouncer.

For more details on PgBouncer, review:

[Connection Pooler](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717).

[Best Practices](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connection-handling-best-practice-with-postgresql/ba-p/790883).

Azure Database for Flexible Server offers PgBouncer as a built-in connection pooling solution. For more information, see [PgBouncer](./concepts-pgbouncer.md).

### Explain Analyze 

Once high memory-consuming queries have been identified from Query Store, use **EXPLAIN,** and **EXPLAIN ANALYZE** to investigate further and tune them.

For more information on the **EXPLAIN** command, review [Explain Plan](https://www.postgresql.org/docs/current/sql-explain.html).

## Next steps

- Troubleshoot and tune Autovacuum [Autovacuum Tuning](./how-to-autovacuum-tuning.md).
- Troubleshoot High CPU Utilization [High CPU Utilization](./how-to-high-cpu-utilization.md).
- Configure server parameters [Server Parameters](./howto-configure-server-parameters-using-portal.md).