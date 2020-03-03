---
title: Optimize autovacuum - Azure Database for PostgreSQL - Single Server
description: This article describes how you can optimize autovacuum on an Azure Database for PostgreSQL - Single Server
author: dianaputnam
ms.author: dianas
ms.service: postgresql
ms.topic: conceptual
ms.date: 5/6/2019
---

# Optimize autovacuum on an Azure Database for PostgreSQL - Single Server
This article describes how to effectively optimize autovacuum on an Azure Database for PostgreSQL server.

## Overview of autovacuum
PostgreSQL uses multiversion concurrency control (MVCC) to allow greater database concurrency. Every update results in an insert and delete, and every delete results in rows being soft-marked for deletion. Soft-marking identifies dead tuples that will be purged later. To carry out these tasks, PostgreSQL runs a vacuum job.

A vacuum job can be triggered manually or automatically. More dead tuples exist when the database experiences heavy update or delete operations. Fewer dead tuples exist when the database is idle. You need to vacuum more frequently when the database load is heavy, which makes running vacuum jobs *manually* inconvenient.

Autovacuum can be configured and benefits from tuning. The default values that PostgreSQL ships with try to ensure the product works on all kinds of devices. These devices include Raspberry Pis. The ideal configuration values depend on the:
- Total resources available, such as SKU and storage size.
- Resource usage.
- Individual object characteristics.

## Autovacuum benefits
If you don't vacuum from time to time, the dead tuples that accumulate can result in:
- Data bloat, such as larger databases and tables.
- Larger suboptimal indexes.
- Increased I/O.

## Monitor bloat with autovacuum queries
The following sample query is designed to identify the number of dead and live tuples in a table named XYZ:
 
    'SELECT relname, n_dead_tup, n_live_tup, (n_dead_tup/ n_live_tup) AS DeadTuplesRatio, last_vacuum, last_autovacuum FROM pg_catalog.pg_stat_all_tables WHERE relname = 'XYZ' order by n_dead_tup DESC;'

## Autovacuum configurations
The configuration parameters that control autovacuum are based on answers to two key questions:
- When should it start?
- How much should it clean after it starts?

Here are some autovacuum configuration parameters that you can update based on the previous questions, along with some guidance.

Parameter|Description|Default value
---|---|---
autovacuum_vacuum_threshold|Specifies the minimum number of updated or deleted tuples needed to trigger a vacuum operation in any one table. The default is 50 tuples. Set this parameter only in the postgresql.conf file or on the server command line. To override the setting for individual tables, change the table storage parameters.|50
autovacuum_vacuum_scale_factor|Specifies a fraction of the table size to add to autovacuum_vacuum_threshold when deciding whether to trigger a vacuum operation. The default is 0.2, which is 20 percent of table size. Set this parameter only in the postgresql.conf file or on the server command line. To override the setting for individual tables, change the table storage parameters.|5 percent
autovacuum_vacuum_cost_limit|Specifies the cost limit value used in automatic vacuum operations. If -1 is specified, which is the default, the regular vacuum_cost_limit value is used. If there's more than one worker, the value is distributed proportionally among the running autovacuum workers. The sum of the limits for each worker doesn't exceed the value of this variable. Set this parameter only in the postgresql.conf file or on the server command line. To override the setting for individual tables, change the table storage parameters.|-1
autovacuum_vacuum_cost_delay|Specifies the cost delay value used in automatic vacuum operations. If -1 is specified, the regular vacuum_cost_delay value is used. The default value is 20 milliseconds. Set this parameter only in the postgresql.conf file or on the server command line. To override the setting for individual tables, change the table storage parameters.|20 ms
autovacuum_nap_time|Specifies the minimum delay between autovacuum runs on any given database. In each round, the daemon examines the database and issues VACUUM and ANALYZE commands as needed for tables in that database. The delay is measured in seconds, and the default is one minute (1 min). Set this parameter only in the postgresql.conf file or on the server command line.|15 s
autovacuum_max_workers|Specifies the maximum number of autovacuum processes, other than the autovacuum launcher, that can run at any one time. The default is three. Set this parameter only at server start.|3

To override the settings for individual tables, change the table storage parameters. 

## Autovacuum cost
Here are the "costs" of running a vacuum operation:

- The data pages that the vacuum runs on are locked.
- Compute and memory are used when a vacuum job is running.

As a result, don't run vacuum jobs either too frequently or too infrequently. A vacuum job needs to adapt to the workload. Test all autovacuum parameter changes because of the tradeoffs of each one.

## Autovacuum start trigger
Autovacuum is triggered when the number of dead tuples exceeds autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor * reltuples. Here, reltuples is a constant.

Cleanup from autovacuum must keep up with the database load. Otherwise, you might run out of storage and experience a general slowdown in queries. Amortized over time, the rate at which a vacuum operation cleans up dead tuples should equal the rate at which dead tuples are created.

Databases with many updates and deletes have more dead tuples and need more space. Generally, databases with many updates and deletes benefit from low values of autovacuum_vacuum_scale_factor and autovacuum_vacuum_threshold. The low values prevent prolonged accumulation of dead tuples. You can use higher values for both parameters with smaller databases because the need for vacuuming is less urgent. Frequent vacuuming comes at the cost of compute and memory.

The default scale factor of 20 percent works well on tables with a low percentage of dead tuples. It doesn't work well on tables with a high percentage of dead tuples. For example, on a 20-GB table, this scale factor translates to 4 GB of dead tuples. On a 1-TB table, it’s 200 GB of dead tuples.

With PostgreSQL, you can set these parameters at the table level or instance level. Today, you can set these parameters at the table level only in Azure Database for PostgreSQL.

## Estimate the cost of autovacuum
Running autovacuum is "costly," and there are parameters for controlling the runtime of vacuum operations. The following parameters help estimate the cost of running vacuum:
- vacuum_cost_page_hit = 1
- vacuum_cost_page_miss = 10
- vacuum_cost_page_dirty = 20

The vacuum process reads physical pages and checks for dead tuples. Every page in shared_buffers is considered to have a cost of 1 (vacuum_cost_page_hit). All other pages are considered to have a cost of 20 (vacuum_cost_page_dirty), if dead tuples exist, or 10 (vacuum_cost_page_miss), if no dead tuples exist. The vacuum operation stops when the process exceeds the autovacuum_vacuum_cost_limit. 

After the limit is reached, the process sleeps for the duration specified by the autovacuum_vacuum_cost_delay parameter before it starts again. If the limit isn't reached, autovacuum starts after the value specified by the autovacuum_nap_time parameter.

In summary, the autovacuum_vacuum_cost_delay and autovacuum_vacuum_cost_limit parameters control how much data cleanup is allowed per unit of time. Note that the default values are too low for most pricing tiers. The optimal values for these parameters are pricing tier-dependent and should be configured accordingly.

The autovacuum_max_workers parameter determines the maximum number of autovacuum processes that can run simultaneously.

With PostgreSQL, you can set these parameters at the table level or instance level. Today, you can set these parameters at the table level only in Azure Database for PostgreSQL.

## Optimize autovacuum per table
You can configure all the previous configuration parameters per table. Here's an example:
```sql
ALTER TABLE t SET (autovacuum_vacuum_threshold = 1000);
​ALTER TABLE t SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE t SET (autovacuum_vacuum_cost_limit = 1000);
ALTER TABLE t SET (autovacuum_vacuum_cost_delay = 10);
```

Autovacuum is a per-table synchronous process. The larger percentage of dead tuples that a table has, the higher the "cost" to autovacuum. You can split tables that have a high rate of updates and deletes into multiple tables. Splitting tables helps to parallelize autovacuum and reduce the "cost" to complete autovacuum on one table. You also can increase the number of parallel autovacuum workers to ensure that workers are liberally scheduled.

## Next steps
To learn more about how to use and tune autovacuum, see the following PostgreSQL documentation:

 - [Chapter 18, Server configuration](https://www.postgresql.org/docs/9.5/static/runtime-config-autovacuum.html)
 - [Chapter 24, Routine database maintenance tasks](https://www.postgresql.org/docs/9.6/static/routine-vacuuming.html)
