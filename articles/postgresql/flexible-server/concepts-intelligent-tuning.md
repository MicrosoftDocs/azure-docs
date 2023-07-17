---
title: Intelligent tuning - Azure Database for PostgreSQL - Flexible Server
description: This article describes the intelligent tuning feature in Azure Database for PostgreSQL - Flexible Server.
author: AwdotiaRomanowna
ms.author: alkuchar
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 06/02/2023
---

# Perform intelligent tuning in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The intelligent tuning feature of Azure Database for PostgreSQL - Flexible Server is designed to enhance overall
performance automatically and help prevent possible issues. It continuously monitors the database instance's overall
status and performance and automatically optimizes the workload's performance.

The Azure Database for PostgreSQL - Flexible Server is equipped with an inherent intelligence mechanism that can
dynamically adapt the database to your workload, thereby automatically enhancing performance. This feature comprises two
automatic tuning functionalities:

* **Autovacuum tuning**: This function diligently tracks the bloat ratio and adjusts autovacuum settings accordingly. It
  factors in both current and predicted resource usage to ensure your workload isn't disrupted.
* **Writes tuning**: This feature persistently monitors the volume and patterns of write operations, modifying
  parameters that affect write performance. These parameters
  include `bgwriter_delay`, `checkpoint_completion_target`, `max_wal_size`, and `min_wal_size`. The primary aim of these
  adjustments is to enhance both system performance and reliability, thereby proactively averting potential
  complications.

Learn how to enable intelligent tuning using [Azure portal](how-to-enable-intelligent-performance-portal.md) or [CLI](how-to-enable-intelligent-performance-cli.md).

## Why intelligent tuning?

The autovacuum process is a critical part of maintaining the health and performance of a PostgreSQL database. It helps
to reclaim storage occupied by "dead" rows, freeing up space and ensuring the database continues to run smoothly.
Equally important is the tuning of write operations within the database, a task that typically falls to database
administrators (DBAs).

However, constantly monitoring a database and fine-tuning write operations can be challenging and time-consuming. This
becomes increasingly complex when dealing with multiple databases, and might even become an impossible task when
managing a large number of them.

This is where intelligent tuning steps in. Rather than manually overseeing and tuning your database, the intelligent
tuning feature can effectively shoulder some of the load. It helps in the automatic monitoring and tuning of the
database, allowing you to focus on other important tasks.

Intelligent tuning provides an autovacuum tuning feature that vigilantly monitors the bloat ratio, adjusting settings as needed to ensure optimal resource utilization. It proactively manages the "cleaning" process of the database, mitigating performance issues caused by outdated data.

In addition, the Writes Tuning aspect of intelligent tuning observes the quantity and transactional patterns of write operations. It intelligently adjusts parameters such as `bgwriter_delay`, `checkpoint_completion_target`, `max_wal_size`, and `min_wal_size`. By doing so, it effectively enhances system performance and reliability, ensuring smooth and efficient operation even under high write loads.

In summary, intelligent tuning provides an efficient solution for database monitoring and tuning, taking the hard and
tedious tasks off your plate. By using this automatic tuning feature, you can rely on the Azure Database for
PostgreSQL - Flexible Server to maintain the optimal performance of your databases, saving you valuable time and
resources.

### How does intelligent tuning work?

Intelligent Tuning is an ongoing monitoring and analysis process that not only learns about the characteristics of your
workload but also tracks your current load and resource usage such as CPU or IOPS. By doing so, it makes sure not to
disturb the normal operations of your application workload.

The process allows the database to dynamically adjust to your workload by discerning the current bloat ratio, write
performance, and checkpoint efficiency on your instance. Armed with these insights, intelligent tuning deploys tuning
actions designed to not only enhance your workload's performance but also to circumvent potential pitfalls.

## Autovacuum tuning

Intelligent tuning adjusts five significant parameters related to
autovacuum: `autovacuum_vacuum_scale_factor`, `autovacuum_cost_limit`, `autovacuum_naptime`, `autovacuum_vacuum_threshold`,
and `autovacuum_vacuum_cost_delay`. These parameters regulate components such as the fraction of the table that sets off
a VACUUM process, the cost-based vacuum delay limit, the pause interval between autovacuum runs, the minimum count of
updated or dead tuples needed to start a VACUUM, and the pause duration between cleanup rounds.

> [!IMPORTANT]
> Autovacuum tuning is currently supported for the General Purpose and Memory Optimized server compute tiers that have
> four or more vCores, Burstable server compute tier is not supported.

> [!IMPORTANT]
> It's important to keep in mind that intelligent tuning modifies autovacuum-related parameters at the server level, not
> at individual table levels. Also, if autovacuum is turned off, intelligent tuning cannot operate correctly. For
> intelligent tuning to optimize the process, the autovacuum feature must be enabled.

While the autovacuum daemon triggers two operations - VACUUM and ANALYZE, intelligent tuning only fine-tunes the VACUUM
process. The ANALYZE process, which gathers statistics on table contents to help the PostgreSQL query planner choose the
most suitable query execution plan, is currently not adjusted by this feature.

One key feature of intelligent tuning is that it includes safeguards to measure resource utilization like CPU and IOPS.
This means that it will not ramp up autovacuum activity when your instance is under heavy load. This way, intelligent
tuning ensures a balance between effective cleanup operations and the overall performance of your system.

When optimizing autovacuum, intelligent tuning considers the server's average bloat, using statistics about live and
dead tuples. To lessen bloat, intelligent tuning might reduce parameters like the scale factor or naptime, triggering
the VACUUM process sooner and, if necessary, decreasing the delay between rounds.

On the other hand, if the bloat is minimal and the autovacuum process is too aggressive, then parameters such as delay,
scale factor, and naptime may be increased. This balance ensures minimal bloat and the efficient use of the resources by
the autovacuum process.


## Writes tuning

Intelligent tuning adjusts four parameters related to writes
tuning:`bgwriter_delay`, `checkpoint_completion_target`, `max_wal_size`, and `min_wal_size`. The behavior and benefits of adjusting some of these are described below.

The `bgwriter_delay` parameter determines the frequency at which the background writer process is awakened to clean "dirty" buffers (those buffers that are new or modified). The background writer process is one of three processes in PostgreSQL
that handle write operations, the other two being the checkpointer process and backends (standard client processes, such
as application connections). The background writer process's primary role is to alleviate the load from the main
checkpointer process and decrease the strain of backend writes. By adjusting the `bgwriter_delay` parameter, which governs the frequency of background writer rounds, we can also optimize the performance of DML queries.

The `checkpoint_completion_target` parameter is part of the second write mechanism supported by PostgreSQL, specifically
the checkpointer process. Checkpoints occur at constant intervals defined by `checkpoint_timeout` (unless forced by
exceeding the configured space). To avoid overloading the I/O system with a surge of page writes, writing dirty buffers
during a checkpoint is spread out over a period of time. This duration is controlled by
the `checkpoint_completion_target`, specified as a fraction of the checkpoint interval, which is set
using `checkpoint_timeout`.
While the default value of `checkpoint_completion_target` is 0.9 (since PostgreSQL 14), which generally works best as it
spreads the I/O load over the maximum time period, there might be rare instances where, due to unexpected fluctuations
in the number of WAL segments needed, checkpoints may not complete in time. Hence, due to its potential impact on
performance, `checkpoint_completion_target` has been chosen as a target metric for intelligent tuning.


## Limitations and known issues

* Intelligent tuning makes optimizations only in specific ranges. It's possible that the feature won't make any changes.
* ANALYZE settings are not adjusted by intelligent tuning.

## Next steps

* [Configure intelligent performance for Azure Database for PostgreSQL - Flexible Server using Azure portal](how-to-enable-intelligent-performance-portal.md)
* [Configure intelligent performance for Azure Database for PostgreSQL - Flexible Server using Azure CLI](how-to-enable-intelligent-performance-cli.md)
* [Troubleshooting guides for Azure Database for PostgreSQL - Flexible Server](concepts-troubleshooting-guides.md)
* [Autovacuum Tuning in Azure Database for PostgreSQL - Flexible Server](how-to-autovacuum-tuning.md)
* [Troubleshoot high IOPS utilization for Azure Database for PostgreSQL - Flexible Server](how-to-high-io-utilization.md)
* [Best practices for uploading data in bulk in Azure Database for PostgreSQL - Flexible Server](how-to-bulk-load-data.md)
* [Troubleshoot high CPU utilization in Azure Database for PostgreSQL - Flexible Server](how-to-high-cpu-utilization.md)
* [Query Performance Insight for Azure Database for PostgreSQL - Flexible Server](concepts-query-performance-insight.md)
