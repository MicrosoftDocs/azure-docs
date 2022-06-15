---
title: Autovacuum Tuning
description: Troubleshooting guide for autovacuum in Azure Database for PostgreSQL - Flexible Server
ms.author: sbalijepalli
author: sarat0681
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 6/15/2022
---

# Autovacuum Tuning

## What is Autovacuum 

Internal data consistency in PostgreSQL is based on the Multi-Version Concurrency Control (MVCC) mechanism, which allows the database engine to maintain multiple versions of a row and provides greater concurrency with minimal blocking between the different processes. The downside of it is it needs appropriate maintenance done by VACUUM and ANALYZE commands.  

For example, when a row is deleted, it is not removed physically. Instead, the row is marked as “dead”. Similarly for updates, it marks the existing row as “dead” and inserts a new version of this row. These operations leave behind the dead records, called dead tuples, even after all the transactions that might see those versions finish. Unless cleaned up, these dead tuples will stay, consuming disk space, increasing table and index bloat that results in slow query performance.   

The purpose of autovacuum process is to automate the execution of VACUUM and ANALYZE commands. The autovacuum daemon is made up of multiple processes that reclaim storage by removing obsolete data or tuples from the database. It checks for tables that have a significant number of inserted, updated, or deleted records and vacuums these tables.  

## Autovacuum Internals

Autovacuum reads pages (8KB default block size) from disk and writes to pages having dead tuples.
When a page is read, if no dead tuples are found autovacuum discards that page.
If dead tuples are found, they are removed. The cost is based on:

`vacuum_cost_page_hit`
Cost of reading a page that is already in shared buffers and does not need a disk read. The default value is set to 1.

`vacuum_cost_page_miss`
Cost of fetching a page that is not in shared buffers. The default value is set to 10.

`vacuum_cost_page_dirty`
Cost of writing to a page when dead tuples are found in it. The default value is set to 20.

The amount of work autovacuum does depends on two parameters:

`autovacuum_vacuum_cost_delay` = 20ms    
`autovacuum_vacuum_cost_limit` = 200    

`autovacuum_vacuum_cost_limit` is the amount of work autovacuum does in one go and every time the cleanup is done autovacuum sleeps for `autovacuum_vacuum_cost_delay` 
number of milliseconds. By default, every time a cost of 200 is cleaned up autovacuum sleeps for 20 milliseconds.
Every 1 second autovacuum wakes up 50 times (50*20 ms= 1000 ms). Every time it wakes up, autovacuum reads 200 pages.

That means in 1 second autovacuum can do
- ~80 MB/Sec [ (200 pages/`vacuum_cost_page_hit`) * 50 * 8 KB per page] if all pages with dead tuples are found in shared buffers.
- ~8 MB/Sec [ (200 pages/`vacuum_cost_page_miss`) * 50 * 8 KB per page] if all pages with dead tuples are read from disk.
- ~4 MB/Sec  [ (200 pages/`vacuum_cost_page_dirty`) * 50 * 8 KB per page] autovacuum can write up to 4 MB/sec.


## Monitoring Autovacuum 
Autovacuum can be monitored by using the query below  

```
select schemaname,relname,n_dead_tup,n_live_tup,round(n_dead_tup::float/n_live_tup::float*100) dead_pct,autovacuum_count,last_vacuum,last_autovacuum,last_autoanalyze,last_analyze from pg_stat_all_tables where n_live_tup >0;
```   
  

The following columns help determine if autovacuum is catching up with table activity.  

<b>Dead_pct</b>: percentage of dead tuples when compared to live tuples  
<b>Last_autovacuum</b>: What was the date when the table was last autovacuumed  
<b>Last_autoanalyze</b>: What was the date when the table was last autoanalyzed  

## When Does PostgreSQL Trigger Autovacuum 

Autovacuum uses a threshold; autovacuum is triggered when the number of dead tuples exceeds the threshold.   

The threshold is calculated using several server parameters as mentioned below:  

Threshold --> autovacuum_vacuum_scale_factor * tuples + autovacuum_vacuum_threshold.

The query below gives a list of tables in the database and lets you know which ones qualify for autovacuum processing:

```
 SELECT *
      ,n_dead_tup > av_threshold AS av_needed
      ,CASE 
        WHEN reltuples > 0
          THEN round(100.0 * n_dead_tup / (reltuples))
        ELSE 0
        END AS pct_dead
    FROM (
      SELECT N.nspname
        ,C.relname
        ,pg_stat_get_tuples_inserted(C.oid) AS n_tup_ins
        ,pg_stat_get_tuples_updated(C.oid) AS n_tup_upd
        ,pg_stat_get_tuples_deleted(C.oid) AS n_tup_del
        ,pg_stat_get_live_tuples(C.oid) AS n_live_tup
        ,pg_stat_get_dead_tuples(C.oid) AS n_dead_tup
        ,C.reltuples AS reltuples
        ,round(current_setting('autovacuum_vacuum_threshold')::INTEGER + current_setting('autovacuum_vacuum_scale_factor')::NUMERIC * C.reltuples) AS av_threshold
        ,date_trunc('minute', greatest(pg_stat_get_last_vacuum_time(C.oid), pg_stat_get_last_autovacuum_time(C.oid))) AS last_vacuum
        ,date_trunc('minute', greatest(pg_stat_get_last_analyze_time(C.oid), pg_stat_get_last_analyze_time(C.oid))) AS last_analyze
      FROM pg_class C
      LEFT JOIN pg_namespace N ON (N.oid = C.relnamespace)
      WHERE C.relkind IN (
          'r'
          ,'t'
          )
        AND N.nspname NOT IN (
          'pg_catalog'
          ,'information_schema'
          )
        AND N.nspname ! ~ '^pg_toast'
      ) AS av
    ORDER BY av_needed DESC ,n_dead_tup DESC;  
```

Note: The query does not take into consideration that autovacuum can be configured on a per-table basis using the "alter table" DDL command.  

## Common Autovacuum Problems

### Not Keeping Up with Busy Server

Cost-based vacuuming limits the amount of disk I/O autovacuum process is expected to do per unit of time. The autovacuum process estimates the cost of every I/O operation, accumulates a total for each operation it performs and pauses once the upper limit of the cost is reached.  

`autovacuum_vacuum_cost_delay` and `autovacuum_vacuum_cost_limit` are the two server parameters that are used in the process.  

By default, `autovacuum_vacuum_cost_limit` is set to –1 meaning autovacuum cost limit would be same value as the parameter – `vacuum_cost_limit` that defaults to 200. 

`vacuum_cost_limit` is the cost of manual vacuum. If `autovacuum_vacuum_cost_limit` is set to 200, autovacuum would use this parameter. `autovacuum_vacuum_cost_delay` is set to 20 ms by default. So, by default every time the autovacuum process accumulates a cost of 200 it pauses for 20 ms.  

In case the autovacuum is not keeping up, the following parameters may be changed:
                                                                                                         
##### autovacuum_vacuum_scale_factor
Default: 0.2, range 0.05 - 0.1. The scale factor is workload-specific and should be set depending on the amount of data in the tables. Before changing the value, the workload and individual table volumes need to be investigated.

##### autovacuum_vacuum_cost_limit
Default: 200. Cost limit may be increased. CPU and I/O utilization on the database should be monitored before and after changing this.

##### autovacuum_vacuum_cost_delay  
This parameter can have a wide range, from 2 to 10 ms.


### Autovacuum Constantly Running
There might be two reasons:

##### maintenance_work_mem  

Autovacuum daemon uses `autovacuum_work_mem` that is by default set to -1 meaning `autovacuum_work_mem` would have the same value as the 
parameter `maintenance_work_mem`. This document assumes `autovacuum_work_mem` is set to -1 and `maintenance_work_mem` is used by 
the autovacuum daemon.

If `maintenance_work_mem` is low, it may be increased to up to 2 GB on Flexible Server. A general rule of thumb is to allocate 
50 MB to `maintenance_work_mem` for every 1 GB of RAM.  


##### Large number of databases.
Auto vacuum tries to start a worker on each database every `autovacuum_naptime` seconds.  
For example, if a server has 60 databases and autovacuum_naptime is set to 60 seconds, 
then every second [autovacuum_naptime/Number of DBs] autovacuum worker is started.  

It is a good idea to increase `autovacuum_naptime` if there are more databases in a cluster.
At the same time, the autovacuum process can be made more aggressive by changing the 
`autovacuum_cost_limit` & `autovacuum_cost_delay` parameters and increasing the `autovacuum_max_workers` from the default of 3 to 4 or 5. 

### Out Of Memory Errors  
Overly aggressive `maintenance_work_mem` values could periodically cause out-of-memory errors in the system. 
It is important to understand available RAM on the server before any change to parameter `maintenance_work_mem` is made. 
Each autovacuum worker uses the entire memory assigned to 'maintenance_work_mem' whenever an autovacuum worker starts.

For example, if this parameter is set to 1 GB, each running autovacuum worker will use 1 GB of memory. 
So, with the default value of 3 workers, 3 autovacuum workers will use 3 GB of memory.

###  Autovacuum is too Disruptive
If autovacuum is consuming a lot of resources, the following can be done:

- Increase `autovacuum_vacuum_cost_delay` and reduce `autovacuum_vacuum_cost_limit` if set higher than the default of 200.  
- Reduce the number of `autovacuum_max_workers` if it is set higher than the default of 3.  

#### Too Many Autovacuum Workers  

Increasing the number of autovacuum workers will not necessarily increase the speed of vacuum. It is not recommended to have 
a high number of autovacuum workers. Increasing the number of autovacuum workers will result in more memory consumption, 
depending on the value of `maintenance_work_mem` and could cause performance degradation. 
Each autovacuum worker process only gets (1/autovacuum_max_workers) of the total `autovacuum_cost_limit`, so having a high number
of workers causes each one to go slower.
If the number of workers is increased, `autovacuum_vacuum_cost_limit` should also be increased and/or
`autovacuum_vacuum_cost_delay` should be decreased to make the vacuum process faster.

However, if we have changed table level `autovacuum_vacuum_cost_delay` or `autovacuum_vacuum_cost_limit` parameters 
then the workers running on those tables are exempted from being considered in the balancing algorithm 
[autovacuum_cost_limit/autovacuum_max_workers].
 
### Autovacuum Transaction ID (TXID) Wraparound Protection

When a database runs into transaction ID wraparound protection, an error message like the below is observed:
```
  <i>database is not accepting commands to avoid wraparound data loss in database ‘xx’   
  Stop the postmaster and vacuum that database in single-user mode. </i>
    
Note: This error message is a long-standing oversight. Usually, you do not need to switch to single-user mode. Instead, you can run the required VACUUM commands and perform tuning for VACUUM to run fast. While you cannot run any data manipulation language (DML), you can still run VACUUM.
```
The wraparound problem occurs when the database is either not vacuumed or there are too many dead tuples that could not be 
removed by autovacuum. The reasons for this might be: 
 
#### Heavy Workload 

The workload could cause too many dead tuples in a brief period that makes it difficult for autovacuum to catch up.
The dead tuples in the system add up over a period leading to degradation of query performance and leading to wraparound situation. 

 
#### Long Running Transactions 

Any long-running transactions in the system will not allow dead tuples to be removed while autovacuum is running. 
They are a blocker to vacuum process. Removing the long running transactions frees up dead tuples for deletion when autovacuum runs.    
The long-running transactions can be detected using the following query: 

```
    SELECT pid, 
           age(backend_xid) AS age_in_xids, 
           now () - xact_start AS xact_age, 
           now () - query_start AS query_age, 
           state, 
           query 
     FROM pg_stat_activity 
     WHERE state != 'idle' 
     ORDER BY 2 DESC 
     LIMIT 10; 
```
 
#### Prepared Statements 

If there are prepared statements that are not committed, they would prevent dead tuples from being removed.   
The following query helps to find the non-committed prepared statements:
```
    SELECT gid, prepared, owner, database, transaction 
    FROM pg_prepared_xacts 
    ORDER BY age(transaction) DESC; 
```
Use COMMIT PREPARED or ROLLBACK PREPARED to commit or rollback these statements. 

#### Unused Replication Slots 

Unused replication slots prevent autovacuum from claiming dead tuples. The following query helps to identify them:   
```
    SELECT slot_name, slot_type, database, xmin 
    FROM pg_replication_slots 
    ORDER BY age(xmin) DESC; 
```
Use pg_drop_replication_slot() to delete unused replication slots. 


When the database runs into transaction ID wraparound protection one should check if there are any blockers as mentioned above
 and remove those for autovacuum to continue and complete. The speed of the autovacuum can also be increased by
  setting `autovacuum_cost_delay` to 0 and increasing the `autovacuum_cost_limit` to a value much greater than 200. 
  However, it should be noted that existing autovacuum workers will not pick up any updates to the above parameters; 
  a database restart or killing of existing workers will be needed.

### Table-specific Requirements  

Autovacuum parameters may be set for individual tables.   

To set auto-vacuum setting per table, change the server parameters as follows (values below are examples):
```
    ALTER TABLE <table name> SET (autovacuum_analyze_scale_factor = 0);
    ALTER TABLE <table name> SET (autovacuum_analyze_threshold = 5000);
    ALTER TABLE <table name> SET (autovacuum_vacuum_scale_factor = 0); 
    ALTER TABLE <table name> SET (autovacuum_vacuum_threshold = 10000); 
```
Prioritization of autovacuum can also be made on a per-table basis. 
For example, if we have a table where growth of dead tuples is faster compared to other tables, we could set 
`autovacuum_vacuum_cost_delay` or `auto_vacuum_cost_limit parameters` at the table level to make vacuuming on the table more aggressive.     
```
    ALTER TABLE <table name> SET (autovacuum_vacuum_cost_delay = xx);  
    ALTER TABLE <table name> SET (autovacuum_vacuum_cost_limit = xx);  
```
### Insert-only Workloads  

In versions of PostgreSQL prior to 13, autovacuum will not run on tables with an insert-only workload, because if there are no updates
 or deletes, there would be no dead tuples and no free space that would need to be reclaimed. Autoanalyze will run for 
 insert-only workloads since there is new data. The disadvantages of this are
- The visibility map of the tables is not updated, and thus the query performance especially where there is Index Only Scans 
  starts to suffer over time.
- The database can run into transaction ID wraparound protection.
- Hint bits will not be set

#### Solutions  

##### Postgres Versions prior to 13  

Use a cron job to schedule a periodic vacuum analyze on the table. The frequency of the cron job would depend on the workload.   

##### Postgres 13 and Higher Versions  

Autovacuum will run on tables with an insert-only workload. Two new server parameters `autovacuum_vacuum_insert_threshold` and 
`autovacuum_vacuum_insert_scale_factor` help control when autovacuum can be triggered on insert-only tables. 
