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

Azure Database for PostgreSQL - Flexible Server has an intelligent tuning feature that's designed to enhance
performance automatically and help prevent problems. Intelligent tuning continuously monitors the PostgreSQL database's
status and dynamically adapts the database to your workload.

This feature comprises two
automatic tuning functions:

* **Autovacuum tuning**: This function tracks the bloat ratio and adjusts autovacuum settings accordingly. It
  factors in both current and predicted resource usage to prevent workload disruptions.
* **Writes tuning**: This function monitors the volume and patterns of write operations, and it modifies
  parameters that affect write performance. These adjustments enhance both system performance and reliability, to proactively avert potential
  complications.

You can enable intelligent tuning by using the [Azure portal](how-to-enable-intelligent-performance-portal.md) or the [Azure CLI](how-to-enable-intelligent-performance-cli.md).

## Why intelligent tuning?

The autovacuum process is a critical part of maintaining the health and performance of a PostgreSQL database. It helps
reclaim storage occupied by "dead" rows, freeing up space and keeping the database running smoothly.

Equally important is the tuning of write operations within the database. This task typically falls to database
administrators. Constantly monitoring a database and fine-tuning write operations can be challenging and time-consuming. This
task becomes increasingly complex when you're dealing with multiple databases.

This is where intelligent tuning steps in. Rather than manually overseeing and tuning your database, you can use intelligent
tuning to automatically monitor and tune the
database. You can then focus on other important tasks.

The autovacuum tuning function in intelligent tuning monitors the bloat ratio and adjusts settings as needed for optimal resource utilization. It proactively manages the "cleaning" process of the database and mitigates performance problems that outdated data can cause.

The writes tuning function observes the quantity and transactional patterns of write operations. It intelligently adjusts parameters such as `bgwriter_delay`, `checkpoint_completion_target`, `max_wal_size`, and `min_wal_size`. By doing so, it enhances system performance and reliability, even under high write loads.

When you use intelligent tuning, you can save valuable time and resources by relying on Azure Database for
PostgreSQL - Flexible Server to maintain the optimal performance of your databases.

## How does intelligent tuning work?

Intelligent tuning is an ongoing monitoring and analysis process that not only learns about the characteristics of your
workload but also tracks your current load and resource usage, such as CPU or IOPS. It doesn't
disturb the normal operations of your application workload.

The process allows the database to dynamically adjust to your workload by discerning the current bloat ratio, write
performance, and checkpoint efficiency on your instance. With these insights, intelligent tuning deploys tuning
actions that enhance your workload's performance and avoid potential pitfalls.

### Autovacuum tuning

Intelligent tuning adjusts five parameters related to
autovacuum: `autovacuum_vacuum_scale_factor`, `autovacuum_cost_limit`, `autovacuum_naptime`, `autovacuum_vacuum_threshold`,
and `autovacuum_vacuum_cost_delay`. These parameters regulate components such as:

- The fraction of the table that sets off
a `VACUUM` process.
- The cost-based vacuum delay limit.
- The pause interval between autovacuum runs.
- The minimum count of
updated or dead tuples needed to start a `VACUUM` process.
- The pause duration between cleanup rounds.

> [!IMPORTANT]
> Intelligent tuning modifies autovacuum-related parameters at the server level, not at individual table levels. Also, if autovacuum is turned off, intelligent tuning can't operate correctly. For intelligent tuning to optimize the process, the autovacuum feature must be enabled.

Although the autovacuum daemon triggers two operations (`VACUUM` and `ANALYZE`), intelligent tuning fine-tunes only the `VACUUM`
process. This feature currently doesn't adjust the `ANALYZE` process, which gathers statistics on table contents to help the PostgreSQL query planner choose the
most suitable query execution plan.

Intelligent tuning includes safeguards to measure resource utilization like CPU and IOPS.
It won't increase autovacuum activity when your instance is under heavy load. This way, intelligent
tuning ensures a balance between effective cleanup operations and the overall performance of your system.

When intelligent tuning is optimizing autovacuum, it considers the server's average bloat by using statistics about live and
dead tuples. To lessen bloat, intelligent tuning might reduce parameters like the scale factor or naptime. It might trigger
the `VACUUM` process sooner and, if necessary, decrease the delay between rounds.

On the other hand, if the bloat is minimal and the autovacuum process is too aggressive, intelligent tuning might increase parameters such as delay,
scale factor, and naptime. This balance minimizes bloat and helps ensure that the autovacuum process is using resources efficiently.

### Writes tuning

Intelligent tuning adjusts four parameters related to writes
tuning: `bgwriter_delay`, `checkpoint_completion_target`, `max_wal_size`, and `min_wal_size`.

The `bgwriter_delay` parameter determines the frequency at which the background writer process is awakened to clean "dirty" buffers (buffers that are new or modified). The background writer process is one of three processes in PostgreSQL
that handle write operations. The other are the checkpointer process and back-end writes (standard client processes, such
as application connections).

The background writer process's primary role is to alleviate the load from the main
checkpointer process and decrease the strain of back-end writes. The `bgwriter_delay` parameter governs the frequency of background writer rounds. By adjusting this parameter, you can also optimize the performance of Data Manipulation Language (DML) queries.

The `checkpoint_completion_target` parameter is part of the second write mechanism that PostgreSQL supports, specifically
the checkpointer process. Checkpoints occur at constant intervals that `checkpoint_timeout` defines (unless forced by
exceeding the configured space). To avoid overloading the I/O system with a surge of page writes, writing dirty buffers
during a checkpoint is spread out over a period of time. The `checkpoint_completion_target` parameter controls this duration by using `checkpoint_timeout` to specify the duration as a fraction of the checkpoint interval.

The default value of `checkpoint_completion_target` is 0.9 (since PostgreSQL 14). This value generally works best, because it
spreads the I/O load over the maximum time period. In rare instances, checkpoints might not finish in time because of unexpected fluctuations
in the number of needed Write-Ahead Logging (WAL) segments. Potential impact on
performance is the reason why `checkpoint_completion_target` is a target metric for intelligent tuning.

## Limitations and known issues

* Intelligent tuning makes optimizations only in specific ranges. It's possible that the feature won't make any changes.
* Intelligent tuning doesn't adjust `ANALYZE` settings.
* Autovacuum tuning is currently supported for the General Purpose and Memory Optimized server compute tiers that have four or more vCores. The Burstable server compute tier is not supported.

## Next steps

* [Configure intelligent tuning for Azure Database for PostgreSQL - Flexible Server by using the Azure portal](how-to-enable-intelligent-performance-portal.md)
* [Configure intelligent tuning for Azure Database for PostgreSQL - Flexible Server by using the Azure CLI](how-to-enable-intelligent-performance-cli.md)
* [Troubleshooting guides for Azure Database for PostgreSQL - Flexible Server](concepts-troubleshooting-guides.md)
* [Autovacuum tuning in Azure Database for PostgreSQL - Flexible Server](how-to-autovacuum-tuning.md)
* [Troubleshoot high IOPS utilization for Azure Database for PostgreSQL - Flexible Server](how-to-high-io-utilization.md)
* [Best practices for uploading data in bulk in Azure Database for PostgreSQL - Flexible Server](how-to-bulk-load-data.md)
* [Troubleshoot high CPU utilization in Azure Database for PostgreSQL - Flexible Server](how-to-high-cpu-utilization.md)
* [Query Performance Insight for Azure Database for PostgreSQL - Flexible Server](concepts-query-performance-insight.md)
