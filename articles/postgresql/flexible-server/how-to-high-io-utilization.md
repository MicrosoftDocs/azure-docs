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

### Azure metrics

Azure Metrics is a good starting point to check the IO utilization for the definite date and period. Metrics give information about the time duration during which the IO utilization is high. Compare the graphs of Write IOPs, Read IOPs, Read Throughput, and Write Throughput to find out times when the workload caused high IO utilization. For proactive monitoring, you can configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](./howto-alert-on-metrics.md).

### Query store

Query Store automatically captures the history of queries and runtime statistics, and it retains them for your review. It slices the data by time so that you can see temporal usage patterns. Data for all users, databases and queries is stored in a database named azure_sys in the Azure Database for PostgreSQL instance. For step-by-step guidance, see [Query Store](./concepts-query-store.md).

Use the following statement to view the top five SQL statements that consume IO:

``` postgresql

select * from query_store.qs_view qv where is_system_query is FALSE 
order by blk_read_time + blk_write_time  desc limit 5;

```

### pg_stat_statements

The pg_stat_statements extension helps identify queries that consume IO on the server.

Use the following statement to view the top five SQL statements that consume IO:

``` postgresql
SELECT userid::regrole, dbid, query
FROM pg_stat_statements 
ORDER BY blk_read_time + blk_write_time desc  
LIMIT 5;   
```
[!NOTE]
When using query store or pg_stat_statements for columns blk_read_time and blk_write_time to be populated one must enable server parameter `track_io_timing`.For more information about the **track_io_timing** parameter, review [Server Parameter](https://www.postgresql.org/docs/current/runtime-config-statistics.html). 

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

### Checkpoint timings

High IO can also be seen in scenarios where a checkpoint is happening too frequently. One way to identify this is by checking the Postgres log file for the following log text "LOG: checkpoints are occurring too frequently."

You could also investigate using an approach where periodic snapshots of `pg_stat_bgwriter` with a timestamp is saved.Using the snapshots saved the average checkpoint interval, number of checkpoints requested and number of checkpoints timed can be calculated. 

### Disruptive autovacuum daemon process

The following query helps in monitoring autovacuum:

``` postgresql
SELECT schemaname, relname, n_dead_tup, n_live_tup, autovacuum_count, last_vacuum, last_autovacuum, last_autoanalyze, autovacuum_count, autoanalyze_count FROM pg_stat_all_tables WHERE n_live_tup > 0; 
```
The query can be used to check how frequently the tables in the database are being vacuumed. 

**last_autovacuum** provides date and time when the last autovacuum ran on the table.      
**autovacuum_count** : provides number of times the table was vacuumed.    
**autoanalyze_count** provides number of times the table was analyzed.   


### High storage utilization

You can check storage usage using storage percent metric from Azure Metrics. Storage free, storage used along with storage percent gives amount of storage being used.

## Resolve high IO utilization

To resolve high IO utilization, there are three methods you could employ - using Explain Analyze, terminating long-running transactions, or tuning server parameters.

### Explain Analyze 

Once you know the query that's running for a long time, use **EXPLAIN** to further investigate the query and tune it. For more information about the **EXPLAIN** command, review [Explain Plan](https://www.postgresql.org/docs/current/sql-explain.html). 

### Terminating long running transactions   

You could consider killing a long running transaction as an option.

To terminate a session's PID, you will need to detect the PID using the following query: 

``` postgresql
SELECT pid, usename, datname, query, now() - xact_start as duration 
FROM pg_stat_activity  
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active') 
ORDER BY duration DESC;   
```

You can also filter by other properties like `usename` (username), `datname` (database name) etc.  

Once you have the session's PID you can terminate using the following query:

``` postgresql
SELECT pg_terminate_backend(pid);
```

### Server parameter tuning

If it's observed that the checkpoint is happening too frequently, increase `max_wal_size` server parameter until most checkpoints are time driven, instead of requested. Eventually, 90% or more should be time based, and the interval between two checkpoints is close to the `checkpoint_timeout` set on the server.

#### max_wal_size

One way to tune `max_wal_size` is to find a suitable time to find `max_wal_size` on the server. Peak business hours is a good time to arrive at the value. Follow the below listed steps to arrive at a value.

Take the current WAL LSN using the following command, note down the result:

 ``` postgresql
select pg_current_wal_lsn();
```
Wait for checkpoint_timeout number of seconds. Take the current WAL LSN using the following command, note down the result:

 ``` postgresql
select pg_current_wal_lsn();
```
Use the two results to check the difference in GB, using the following:

 ``` postgresql 
select round (pg_wal_lsn_diff ('LSN value when run second time', 'LSN value when run first time')/1024/1024/1024,2) WAL_CHANGE_GB;
```      

#### check_point_completion_target

check_point_completion_target determins the total time between checkpoints. A good practice would be to set it to 0.9.

#### checkpoint_timeout

Maximum time between automatic WAL checkpoints. The value can be increased from default value set on server. Set an appropriate value taking into consideration that increasing the value would also increase the time for crash recovery.

### Autovacuum tuning to decrease disruptions

For more details on monitoring and tuning in scenarios where autovacuum is too disruptive please review [Autovacuum Tuning](./how-to-autovacuum-tuning.md).

###  Increase storage
In scenarios where storage usage percent is high, increasing storage will get more IOPS. For more details on storage and associated IOPS review [Compute and Storage Options](./concepts-compute-storage.md).


## Next steps

- Troubleshoot and tune Autovacuum [Autovacuum Tuning](./how-to-autovacuum-tuning.md).
- Compute and Storage Options [Compute and Storage Options](./concepts-compute-storage.md).
 