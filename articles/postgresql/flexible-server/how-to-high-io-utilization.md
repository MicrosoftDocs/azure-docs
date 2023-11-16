---
title: High IOPS utilization for Azure Database for PostgreSQL - Flexible Server
description: This article is a troubleshooting guide for high IOPS utilization in Azure Database for PostgreSQL - Flexible Server
author: sarat0681
ms.author: sbalijepalli
ms.reviewer: maghan
ms.date: 10/26/2023
ms.service: postgresql
ms.topic: conceptual
ms.custom:
  - template-how-to
---

# Troubleshoot high IOPS utilization for Azure Database for PostgreSQL - Flexible Server

This article shows you how to quickly identify the root cause of high IOPS (input/output operations per second) utilization and provides remedial actions to control IOPS utilization when you're using [Azure Database for PostgreSQL - Flexible Server](overview.md).

In this article, you learn how to:

- About troubleshooting guides to identify and get recommendations to mitigate root causes.
- Use tools to identify high input/output (I/O) utilization, such as Azure Metrics, Query Store, and pg_stat_statements.
- Identify root causes, such as long-running queries, checkpoint timings, a disruptive autovacuum daemon process, and high storage utilization.
- Resolve high I/O utilization by using Explain Analyze, tune checkpoint-related server parameters, and tune the autovacuum daemon.

## Troubleshooting guides

Using the feature troubleshooting guides which is available on the Azure Database for PostgreSQL - Flexible Server portal the probable root cause and recommendations to the mitigate high IOPS utilization scenario can be found. How to setup the troubleshooting guides to use them please follow [setup troubleshooting guides](how-to-troubleshooting-guides.md).

## Tools to identify high I/O utilization

Consider the following tools to identify high I/O utilization.

### Azure Metrics

Azure Metrics is a good starting point to check I/O utilization for a defined date and period. Metrics give information about the time during which I/O utilization is high. Compare the graphs of Write IOPs, Read IOPs, Read Throughput, and Write Throughput to find out times when the workload is causing high I/O utilization. For proactive monitoring, you can configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](./howto-alert-on-metrics.md).

### Query Store

The Query Store feature automatically captures the history of queries and runtime statistics, and retains them for your review. It slices the data by time to see temporal usage patterns. Data for all users, databases, and queries is stored in a database named *azure_sys* in the Azure Database for PostgreSQL instance. For step-by-step guidance, see [Monitor performance with Query Store](./concepts-query-store.md).

Use the following statement to view the top five SQL statements that consume I/O:

```sql
select * from query_store.qs_view qv where is_system_query is FALSE
order by blk_read_time + blk_write_time  desc limit 5;
```

### The pg_stat_statements extension

The `pg_stat_statements` extension helps identify queries that consume I/O on the server.

Use the following statement to view the top five SQL statements that consume I/O:

```sql
SELECT userid::regrole, dbid, query
FROM pg_stat_statements
ORDER BY blk_read_time + blk_write_time desc
LIMIT 5;
```

> [!NOTE]  
> When using query store or pg_stat_statements for columns blk_read_time and blk_write_time to be populated, you need to enable server parameter `track_io_timing`. For more information about `track_io_timing`, review [Server parameters](https://www.postgresql.org/docs/current/runtime-config-statistics.html).

## Identify root causes

If I/O consumption levels are high in general, the following could be the root causes:

### Long-running transactions

Long-running transactions can consume I/O, which can lead to high I/O utilization.

The following query helps identify connections that are running for the longest time:

```sql
SELECT pid, usename, datname, query, now() - xact_start as duration
FROM pg_stat_activity
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active')
ORDER BY duration DESC;
```

### Checkpoint timings

High I/O can also be seen in scenarios where a checkpoint is happening too frequently. One way to identify this is by checking the PostgreSQL log file for the following log text: "LOG: checkpoints are occurring too frequently."

You could also investigate by using an approach where periodic snapshots of `pg_stat_bgwriter` with a time stamp are saved. By using the saved snapshots, you can calculate the average checkpoint interval, number of checkpoints requested, and number of checkpoints timed.

### Disruptive autovacuum daemon process

Run the following query to monitor autovacuum:

```sql
SELECT schemaname, relname, n_dead_tup, n_live_tup, autovacuum_count, last_vacuum, last_autovacuum, last_autoanalyze, autovacuum_count, autoanalyze_count FROM pg_stat_all_tables WHERE n_live_tup > 0;
```
The query is used to check how frequently the tables in the database are being vacuumed.


- `last_autovacuum`: The date and time when the last autovacuum ran on the table.
- `autovacuum_count`: The number of times the table was vacuumed.
- `autoanalyze_count`: The number of times the table was analyzed.

## Resolve high I/O utilization

To resolve high I/O utilization, you can use any of the following three methods.

### The `EXPLAIN ANALYZE` command

After you've identified the query that's consuming high I/O, use `EXPLAIN ANALYZE` to further investigate the query and tune it. For more information about the `EXPLAIN ANALYZE` command, review the [EXPLAIN plan](https://www.postgresql.org/docs/current/sql-explain.html).

### Terminate long-running transactions

You could consider killing a long-running transaction as an option.

To terminate a session's process ID (PID), you need to detect the PID by using the following query:

```sql
SELECT pid, usename, datname, query, now() - xact_start as duration
FROM pg_stat_activity
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active')
ORDER BY duration DESC;
```

You can also filter by other properties, such as `usename` (username) or `datname` (database name).

After you have the session's PID, you can terminate it by using the following query:

```sql
SELECT pg_terminate_backend(pid);
```

### Tune server parameters

If you've observed that the checkpoint is happening too frequently, increase the `max_wal_size` server parameter until most checkpoints are time driven, instead of requested. Eventually, 90 percent or more should be time based, and the interval between two checkpoints should be close to the `checkpoint_timeout` value that's set on the server.

- `max_wal_size`: Peak business hours are a good time to arrive at a `max_wal_size` value. To arrive at a value, do the following:

    1. Run the following query to get the current WAL LSN, and then note the result:

        ```sql
        select pg_current_wal_lsn();
        ```

    1. Wait for a `checkpoint_timeout` number of seconds. Run the following query to get the current WAL LSN, and then note the result:

        ```sql
        select pg_current_wal_lsn();
        ```

    1. Run the following query, which uses the two results, to check the difference, in gigabytes (GB):

        ```sql
        select round (pg_wal_lsn_diff ('LSN value when run second time', 'LSN value when run first time')/1024/1024/1024,2) WAL_CHANGE_GB;
        ```

- `checkpoint_completion_target`: A good practice would be to set the value to 0.9. As an example, a value of 0.9 for a `checkpoint_timeout` of 5 minutes indicates that the target to complete a checkpoint is 270 seconds (0.9\*300 seconds). A value of 0.9 provides a fairly consistent I/O load. An aggressive value of `checkpoint_completion_target` might result in an increased I/O load on the server.

- `checkpoint_timeout`: You can increase the `checkpoint_timeout` value from the default value that's set on the server. As you're increasing the value, take into consideration that increasing it would also increase the time for crash recovery.

### Tune autovacuum to decrease disruptions

For more information about monitoring and tuning in scenarios where autovacuum is too disruptive, review [Autovacuum tuning](./how-to-autovacuum-tuning.md).

### Increase storage

Increasing storage helps when you're adding more IOPS to the server. For more information about storage and associated IOPS, review [Compute and storage options](./concepts-compute-storage.md).

## Related content

- [Troubleshoot and tune autovacuum](how-to-autovacuum-tuning.md)
- [Compute and storage options](concepts-compute-storage.md)
