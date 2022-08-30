---
title: High IOPS Utilization
description: Troubleshooting guide for high IOPS utilization in Azure Database for PostgreSQL - Flexible Server 
author: sarat0681
ms.author: sbalijepalli
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/16/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Troubleshoot high IOPS utilization in Azure Database for PostgreSQL - Flexible Server

This article shows you how to quickly identify the root cause of high IOPS utilization, and possible remedial actions to control IOPS utilization when using [Azure Database for PostgreSQL - Flexible Server](overview.md). 

In this article, you will learn:

- About tools to identify high IO utilization such as Azure Metrics, Query Store, and pg_stat_statements.
- How to identify root causes, such as long running queries, checkpoint timings, disruptive autovacuum daemon process  and high storage utilization.
- How to resolve high IO utilization by using Explain Analyze, tuning checkpoint related server parameters and tuning autovacuum daemon.

## Tools to identify high IO utilization

Consider these tools to identify high IO utilization.

### Azure Metrics

Azure Metrics is a good starting point to check the IO utilization for the definite date and period. Metrics give information about the time duration during which the IO utilization is high. Compare the graphs of Write IOPs, Read IOPs, Read Throughput, and Write Throughput to find out times when the workload caused high IO utilization. For proactive monitoring, you can configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](./howto-alert-on-metrics.md).

### Query Store

Query Store automatically captures the history of queries and runtime statistics, and it retains them for your review. It slices the data by time so that you can see temporal usage patterns. Data for all users, databases and queries is stored in a database named azure_sys in the Azure Database for PostgreSQL instance. For step-by-step guidance, see [Query Store](./concepts-query-store.md).

Use the following statement to view the top five SQL statements that consume IO:

```postgresql

select * from query_store.qs_view qv where is_system_query is FALSE 
order by blk_read_time + blk_write_time  desc limit 5;

```

### pg_stat_statements

The pg_stat_statements extension helps identify queries that consume IO on the server.

Use the following statement to view the top five SQL statements that consume IO:

```postgresql
SELECT userid::regrole, dbid, query
FROM pg_stat_statements 
ORDER BY blk_read_time + blk_write_time desc  
LIMIT 5;   
```
> [!NOTE]
> For blk_read_time and blk_write_time columns to be populated one must enable server parameter track_io_timing.

## Identify root causes 

If IO consumption levels are high in general, the following could be possible root causes: 


### Long-running transactions  

Long-running transactions can consume IO that can lead to high IO utilization.

The following query helps identify connections running for the longest time:  

```postgresql
SELECT pid, usename, datname, query, now() - xact_start as duration 
FROM pg_stat_activity  
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active') 
ORDER BY duration DESC;   
```

### Checkpoint Timings
High IO can also be seen in scenarios where checkpoint is happening too frequently. One way to identify is by checking postgres log file for following log text "LOG: checkpoints are occurring too frequently".

You could also investigate using an approach where we save periodic snapshots of `pg_stat_bgwriter` with a timestamp as illustrated below

- Take first snapshot of pg_stat_bgwriter as shown below.

```postgresql
create table checkpoint_snapshot as select current_timestamp as snapshottime,* from pg_stat_bgwriter;
```
- Now wait for some time, generally it is recommended to wait for one hour.

- Take a second snapshot as shown below.

```postgresql
insert into checkpoint_snapshot (select current_timestamp as snapshottime,* from pg_stat_bgwriter);
```
- Run the below query to analyze the statistics

```postgresql
SELECT
cast(date_trunc('minute',start) AS timestamp) AS start,
 date_trunc('second',elapsed) AS elapsed,
date_trunc('second',elapsed / (checkpoints_timed + checkpoints_req))
AS avg_checkpoint_interval,
(100 * checkpoints_req) / (checkpoints_timed + checkpoints_req)
AS checkpoints_req_pct,
100 * buffers_checkpoint / (buffers_checkpoint + buffers_clean +
buffers_backend) AS checkpoint_write_pct,
100 * buffers_backend / (buffers_checkpoint + buffers_clean +
buffers_backend) AS backend_write_pct,
pg_size_pretty(buffers_checkpoint * block_size / (checkpoints_timed +
checkpoints_req))
AS avg_checkpoint_write,
pg_size_pretty(cast(block_size * (buffers_checkpoint + buffers_clean
+ buffers_backend) / extract(epoch FROM elapsed) AS int8)) AS
written_per_sec,
 pg_size_pretty(cast(block_size * (buffers_alloc) / extract(epoch FROM
elapsed) AS int8)) AS alloc_per_sec
FROM
(
SELECT
 one.snapshottime AS start,
 two.snapshottime - one.snapshottime AS elapsed,
two.checkpoints_timed - one.checkpoints_timed AS checkpoints_timed,
two.checkpoints_req - one.checkpoints_req AS checkpoints_req,
 two.buffers_checkpoint - one.buffers_checkpoint AS
buffers_checkpoint,
 two.buffers_clean - one.buffers_clean AS buffers_clean,
 two.maxwritten_clean - one.maxwritten_clean AS maxwritten_clean,
 two.buffers_backend - one.buffers_backend AS buffers_backend,
two.buffers_alloc - one.buffers_alloc AS buffers_alloc,
 (SELECT cast(current_setting('block_size') AS integer)) AS block_size
FROM checkpoint_snapshot one
 INNER JOIN checkpoint_snapshot two
ON two.snapshottime > one.snapshottime
) bgwriter_diff
WHERE (checkpoints_timed + checkpoints_req) > 0;
```
- The column avg_checkpoint_interval gives us average time between checkpoints.If this value is not closer to `checkpoint_timeout` set on the server then we can conclude the checkpoints are happening too frequently.Another column checkpoints_req_pct points to pct value of number of checkpoints that were required to the total checkpoints completed during the time interval.


### Disruptive Autovacuum Daemon Process

The following query helps in monitoring autovacuum:

```postgresql
SELECT schemaname, relname, n_dead_tup, n_live_tup, autovacuum_count, last_vacuum, last_autovacuum, last_autoanalyze, autovacuum_count, autoanalyze_count FROM pg_stat_all_tables WHERE n_live_tup > 0; 
```
The query can be monitored to check how frequently the tables in the database are being vacuumed. The column last_autovacuum provides date and time when the last autovacuum ran on the table.The autovacuum_count and autoanalyze_count gives number of times the table was vacuumed and analyzed.


### High Storage Utilization

You can check storage usage using storage percent metric from Azure Metrics. Storage free, storage used along with storage percent gives amount of storage being used.


## Resolve high IO utilization

Use Explain Analyze, terminate long running transactions, tune server parameters to resolve high IO utilization. 

### Using Explain Analyze 

Once you know the query that's running for a long time, use **EXPLAIN** to further investigate the query and tune it. 
For more information about the **EXPLAIN** command, review [Explain Plan](https://www.postgresql.org/docs/current/sql-explain.html). 

### Terminating long running transactions

You could consider killing a long running transaction as an option.

To terminate a session's PID, you will need to detect the PID using the following query: 

```postgresql
SELECT pid, usename, datname, query, now() - xact_start as duration 
FROM pg_stat_activity  
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active') 
ORDER BY duration DESC;   
```

You can also filter by other properties like `usename` (username), `datname` (database name) etc.  

Once you have the session's PID you can terminate using the following query:

```postgresql
SELECT pg_terminate_backend(pid);
```

### Server Parameter Tuning

If it is observed that the checkpoint is happening too frequently increase `max_wal_size` server parameter until most checkpoints are time driven, instead of requested.Eventually, 90% or more should be time based and interval between two checkpoints is close to `checkpoint_timeout` set on the server.

#### max_wal_size

`max_wal_size` is an important parameter to tune. To tune this, you will need to find out the amount of WAL that was written over a specific time; the size of WAL should be able to fit into `checkpoint_timeout` interval.

A suitable time to find `max_wal_size` is during the peak business hours. The following can be done to arrive at a value

- Take the current WAL LSN using the following command, note down the result:

 ```postgresql
select pg_current_wal_lsn();
```
Wait for checkpoint_timeout number of seconds. Take the current WAL LSN using the following command, note down the result:

 ```postgresql
select pg_current_wal_lsn();
```
Use the two results to check the difference in GB, using the following:

 ```postgresql 
select round (pg_wal_lsn_diff ('LSN value when run second time', 'LSN value when run first time')/1024/1024/1024,2) WAL_CHANGE_GB;
```      

If `max_wal_size` is increased you could also consider increasing shared buffers to 25% - 40% of total RAM but not more than that.After `max_wal_size` and `shared_buffers` are increased it is expected that percentage of buffers written at checkpoint time increases and buffers written by backend or background writer should decrease.From the checkpoint query [as mentioned above] previously executed  the written_per_sec column should decrease.



#### check_point_completion_target

Determines the total time between checkpoints, a good practice would be to set it to 0.9.


#### checkpoint_timeout

Maximum time between automatic WAL checkpoints. The value can be increased from default value set on server, but one should set an appropriate value taking into consideration that increasing the value would also increase the time for crash recovery.

If `max_wal_size` and `shared_buffers` are set optimally on the server but still large percentage of writes are coming from buffers_checkpoint and the written_per_sec column seems high consider increasing the `checkpoint_timeout` parameter.

### Autovacuum Tuning To make it less disruptive

For more details on monitoring and tuning in scenarios where autovacuum is too disruptive please review [Autovacuum Tuning](./how-to-autovacuum-tuning.md).

###  Increase Storage

In scenarios where storage usage percent is high, increasing storage will get more IOPS. For more details on storage and associated IOPS review [Compute and Storage Options](./concepts-compute-storage.md)


## Next steps

- Troubleshoot and tune Autovacuum [Autovacuum Tuning](./how-to-autovacuum-tuning.md).
- Compute and Storage Options [Compute and Storage Options](./concepts-compute-storage.md).
 