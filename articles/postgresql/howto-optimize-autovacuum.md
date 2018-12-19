---
title: Optimize autovacuum in Azure Database for PostgreSQL server
description: This article describes how you can optimize autovacuum in Azure Database for PostgreSQL server.
author: dianaputnam
ms.author: dianas
editor: jasonwhowell
ms.service: postgresql
ms.topic: conceptual
ms.date: 10/22/2018
---

# Optimizing autovacuum on Azure Database for PostgreSQL server 
This article describes how to effectively optimize autovacuum on Azure Database for PostgreSQL.

## Overview of autovacuum
PostgreSQL uses MVCC to allow greater database concurrency. Every update results in an insert and delete, and every delete results in the row(s) being soft-marked for deletion. The soft-marking results in identification of dead tuples that will be purged later. PostgreSQL achieves all of this by running a vacuum job.

A vacuum job can be triggered manually or automatically. More dead tuples will exist when the database is experiencing heavy update or delete operations and fewer when idle.  The need for running vacuum more frequently is greater when the database is under heavy load; making running vacuum jobs **manually** inconvenient.

Autovacuum can be configured and benefits from tuning. The default values that PostgreSQL ships with try to ensure the product works on all kinds of devices including Raspberry Pis, and the ideal configuration values depend on a number of factors:
- Total resources available - SKU and storage size.
- Resource usage.
- Individual object characteristics.

## Autovacuum benefits
If you don't run vacuum from time to time, the dead tuples that accumulate can result in:
- Data bloat - larger databases and tables.
- Larger suboptimal indexes.
- Increased I/O.

## Monitoring bloat with autovacuum queries
The following sample query is designed to identify the number of dead and live tuples in a table named "XYZ": 'SELECT relname, n_dead_tup, n_live_tup, (n_dead_tup/ n_live_tup) AS DeadTuplesRatio,
last_vacuum, last_autovacuum FROM pg_catalog.pg_stat_all_tables
WHERE relname = 'XYZ' order by n_dead_tup DESC;'

## Autovacuum configurations
The configuration parameters that control autovacuum revolve around two key questions:
- When should it start?
- How much should it clean after it starts?

Below are some of the autovacuum configuration parameters that you can update based on the above questions, along with some guidance:
Parameter|Description|Default value
---|---|---
autovacuum_vacuum_threshold|Specifies the minimum number of updated or deleted tuples needed to trigger a VACUUM in any one table. The default is 50 tuples. This parameter can only be set in the postgresql.conf file or on the server command line. The setting can be overridden for individual tables by changing table storage parameters.|50
autovacuum_vacuum_scale_factor|Specifies a fraction of the table size to add to autovacuum_vacuum_threshold when deciding whether to trigger a VACUUM. The default is 0.2 (20 percent of table size). This parameter can only be set in the postgresql.conf file or on the server command line. The setting can be overridden for individual tables by changing table storage parameters.|5 percent
autovacuum_vacuum_cost_limit|Specifies the cost limit value that will be used in automatic VACUUM operations. If -1 is specified (which is the default), the regular vacuum_cost_limit value will be used. The value is distributed proportionally among the running autovacuum workers, if there's more than one worker. The sum of the limits for each worker doesn't exceed the value of this variable. This parameter can only be set in the postgresql.conf file or on the server command line. The setting can be overridden for individual tables by changing table storage parameters.|-1
autovacuum_vacuum_cost_delay|Specifies the cost delay value that will be used in automatic VACUUM operations. If -1 is specified, the regular vacuum_cost_delay value will be used. The default value is 20 milliseconds. This parameter can only be set in the postgresql.conf file or on the server command line. The setting can be overridden for individual tables by changing table storage parameters.|20 ms
autovacuum_nap_time|Specifies the minimum delay between autovacuum runs on any given database. In each round, the daemon examines the database and issues VACUUM and ANALYZE commands as needed for tables in that database. The delay is measured in seconds, and the default is one minute (1 min). This parameter can only be set in the postgresql.conf file or on the server command line.|15 s
autovacuum_max_workers|Specifies the maximum number of autovacuum processes (other than the autovacuum launcher) that may be running at any one time. The default is three. This parameter can only be set at server start.|3
The above settings can be overridden for individual tables by changing table storage parameters.  

## Autovacuum cost
Below are the "costs" of running a vacuum operation:
- A lock is placed on the data pages vacuum runs on.
- Compute and memory are used when vacuum is running.

This implies that vacuum shouldn't run either too frequently or too infrequently, it needs to be adaptive to the workload. We recommend testing all autovacuum parameter changes because of the tradeoffs of each one.

## Autovacuum start trigger
Autovacuum is triggered when the number of dead tuples exceeds autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor * reltuples, reltuples here is a constant.

Cleanup from autovacuum needs to keep up with the database load, otherwise you could run out of storage and experience a general slowdown in queries. Amortized over time, the rate at which vacuum cleans up dead tuples should equal the rate at which dead tuples are created.

Databases with many updates/deletes have more dead tuples and need more space. Generally, databases with many updates/deletes benefit from low values of autovacuum_vacuum_scale_factor and low values of autovacuum_vacuum_threshold to prevent prolonged accumulation of dead tuples. You could use higher values for both parameters with smaller databases because the need for vacuum is less urgent. REminder, that frequent vacuuming comes at the cost of compute and memory.

The default scale factor of 20 percent works well on tables with a low percent of dead tuples, but not on tables with a high percent of dead tuples. For example, on a 20-GB table this translates to 4 GB of dead tuples and on a 1 TB table it’s 200 GB of dead tuples.

With PostgreSQL, you can set these parameters at the table level or instance level. Today, these parameters can be set at the table level only in Azure Database for PostgreSQL.

## Estimating the cost of autovacuum
Running autovacuum is "costly" andS there are parameters for controlling the runtime of vacuum operations. The following parameters help estimate the cost of running vacuum:
- vacuum_cost_page_hit = 1
- vacuum_cost_page_miss = 10
- vacuum_cost_page_dirty = 20

The vacuum process reads physical pages and checks for dead tuples. Every page in shared_buffers is considered to have a cost of 1 (vacuum_cost_page_hit), all other pages are considered to have a cost of 20 (vacuum_cost_page_dirty) if dead tuples exist, or 10 (vacuum_cost_page_miss) if no dead tuples exist. The vacuum operation stops when the process exceeds autovacuum_vacuum_cost_limit.  

After the limit is reached, the process sleeps for the duration specified by the autovacuum_vacuum_cost_delay parameter before being started again. If the limit isn't reached, autovacuum starts after the value specified by the autovacuum_nap_time parameter.

In summary, the autovacuum_vacuum_cost_delay and autovacuum_vacuum_cost_limit parameters control how much data cleanup is allowed per unit time. Note, that the default values are too low for most pricing tiers. The optimal values for these parameters are pricing tier-dependent and should be configured accordingly.

The autovacuum_max_workers parameter determines the maximum number of autovacuum processes that can be running simultaneously.

With PostgreSQL, you can set these parameters at the table level or instance level. Today, these parameters can be set at the table level only in Azure Database for PostgreSQL.

## Optimizing autovacuum per table
All the configuration parameters above may be configured per table, for example:
```sql
ALTER TABLE t SET (autovacuum_vacuum_threshold = 1000);
​ALTER TABLE t SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE t SET (autovacuum_vacuum_cost_limit = 1000);
ALTER TABLE t SET (autovacuum_vacuum_cost_delay = 10);
```

Autovacuum is a per table synchronous process. The larger percent of dead tuples a table has, the higher the "cost" to autovacuum.  Splitting tables that have a high rate of updates/deletes into multiple tables will help to parallelize autovacuum and reduce the "cost" to complete autovacuum on one table. You can also increase the number of parallel autovacuum workers to ensure workers are liberally scheduled.

## Next steps
Review the following PostgreSQL documenatation to learn more about using and tuning autovacuum:
 - PostgreSQL documentation - [Chapter 18, Server Configuration](https://www.postgresql.org/docs/9.5/static/runtime-config-autovacuum.html)
 - PostgreSQL documentation – [Chapter 24, Routine Database Maintenance Tasks](https://www.postgresql.org/docs/9.6/static/routine-vacuuming.html)
