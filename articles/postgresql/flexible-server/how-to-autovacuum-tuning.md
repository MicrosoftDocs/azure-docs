---
title: Autovacuum tuning
description: Troubleshooting guide for autovacuum in Azure Database for PostgreSQL - Flexible Server.
author: sarat0681
ms.author: sbalijepalli
ms.reviewer: maghan
ms.date: 05/07/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Autovacuum tuning in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](~/reusable-content/ce-skilling/azure/includes/postgresql/includes/applies-to-postgresql-flexible-server.md)]

This article provides an overview of the autovacuum feature for [Azure Database for PostgreSQL flexible server](overview.md) and the feature troubleshooting guides that are available to monitor the database bloat, autovacuum blockers. It also provides information around how far the database is from emergency or wraparound situation.

## What is autovacuum

Autovacuum is a PostgreSQL background process that automatically cleans up dead tuples and updates statistics. It helps maintain the database performance by automatically running two key maintenance tasks:
 
- VACUUM - Frees up disk space by removing dead tuples.
- ANALYZE - Collects statistics to help the PostgreSQL Optimizer choose the best execution paths for queries.
 
To ensure autovacuum works properly, the autovacuum server parameter should always be set to ON. When enabled, PostgreSQL automatically decides when to run VACUUM or ANALYZE on a table, ensuring the database remains efficient and optimized.

## Autovacuum internals

Autovacuum reads pages looking for dead tuples, and if none are found, autovacuum discards the page. When autovacuum finds dead tuples, it removes them. The cost is based on:

| Parameter                        | Description                                                                   
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
`vacuum_cost_page_hit` | Cost of reading a page that is already in shared buffers and doesn't need a disk read. The default value is set to 1.
`vacuum_cost_page_miss` | Cost of fetching a page that isn't in shared buffers. The default value is set to 10.
`vacuum_cost_page_dirty` | Cost of writing to a page when dead tuples are found in it. The default value is set to 20.

The amount of work autovacuum performs depend on two parameters:

| Parameter                        | Description                                                                       
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
`autovacuum_vacuum_cost_limit` | The amount of work autovacuum does in one go.
`autovacuum_vacuum_cost_delay` | Number of milliseconds that autovacuum is asleep after it reaches the cost limit specified by the `autovacuum_vacuum_cost_limit`  parameter.

In all currently supported versions of Postgres the default value for `autovacuum_vacuum_cost_limit` is 200 (actually, set to -1, which makes it equals to the value of the regular `vacuum_cost_limit`, which by default, is 200).

As for `autovacuum_vacuum_cost_delay`, in Postgres version 11 it defaults to 20 milliseconds, while in Postgres versions 12 and above it defaults to 2 milliseconds.

Autovacuum wakes up 50 times (50*20 ms=1000 ms) every second. Every time it wakes up, autovacuum reads 200 pages.

That means in one-second autovacuum can do:

- ~80 MB/Sec [ (200 pages/`vacuum_cost_page_hit`) * 50 * 8 KB per page] if all pages with dead tuples are found in shared buffers.
- ~8 MB/Sec [ (200 pages/`vacuum_cost_page_miss`) * 50 * 8 KB per page] if all pages with dead tuples are read from disk.
- ~4 MB/Sec  [ (200 pages/`vacuum_cost_page_dirty`) * 50 * 8 KB per page] autovacuum can write up to 4 MB/sec.

## Monitor autovacuum

Use the following queries to monitor autovacuum:

```sql
select schemaname,relname,n_dead_tup,n_live_tup,round(n_dead_tup::float/n_live_tup::float*100) dead_pct,autovacuum_count,last_vacuum,last_autovacuum,last_autoanalyze,last_analyze from pg_stat_all_tables where n_live_tup >0;
```

The following columns help determine if autovacuum is catching up to table activity:

| Parameter                        | Description                                                                       
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
`dead_pct` | Percentage of dead tuples when compared to live tuples.
`last_autovacuum` | The date of the last time the table was autovacuumed.
`last_autoanalyze` |  The date of the last time the table was automatically analyzed.

## When does PostgreSQL trigger autovacuum

An autovacuum action (either *ANALYZE* or *VACUUM*) triggers when the number of dead tuples exceeds a particular number that is dependent on two factors: the total count of rows in a table, plus a fixed threshold. *ANALYZE*, by default, triggers when 10% of the table plus 50 row changes, while *VACUUM* triggers when 20% of the table plus 50 row changes. Since the *VACUUM* threshold is twice as high as the *ANALYZE* threshold, *ANALYZE* gets triggered earlier than *VACUUM*. 
For PG versions >=13; *ANALYZE* by default, triggers when 20% of the table plus 1000 row inserts.

The exact equations for each action are:

- **Autoanalyze** = autovacuum_analyze_scale_factor * tuples + autovacuum_analyze_threshold or 
                    autovacuum_vacuum_insert_scale_factor * tuples + autovacuum_vacuum_insert_threshold (For PG versions >= 13)
- **Autovacuum** =  autovacuum_vacuum_scale_factor * tuples + autovacuum_vacuum_threshold

For example,  if we have a table with 100 rows. The following equation then provides the information on when the analyze and vacuum triggers:

For Updates/deletes:
`Autoanalyze = 0.1 * 100 + 50 = 60`  
`Autovacuum =  0.2 * 100 + 50 = 70`

Analyze triggers after 60 rows are changed on a table, and Vacuum triggers when 70 rows are changed on a table.

For Inserts:
`Autoanalyze = 0.2 * 100 + 1000 = 1020`  

Analyze triggers after 1,020 rows are inserted on a table

Here's the description of the parameters used in the equation:

| Parameter                        | Description                                                                       
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autovacuum_analyze_scale_factor` | Percentage of inserts/updates/deletes which triggers ANALYZE on the table.
| `autovacuum_analyze_threshold` | Specifies the minimum number of tuples inserted/updated/deleted to ANALYZE a table.
| `autovacuum_vacuum_insert_scale_factor` | Percentage of inserts that triggers ANLYZE on the table.
| `autovacuum_vacuum_insert_threshold` | Specifies the minimum number of tuples inserted to ANALYZE a table.
| `autovacuum_vacuum_scale_factor` | Percentage of updates/deletes which triggers VACUUM on the table.

Use the following query to list the tables in a database and identify the tables that qualify for the autovacuum process:

```sql
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
        ,date_trunc('minute', greatest(pg_stat_get_last_analyze_time(C.oid), pg_stat_get_last_autoanalyze_time(C.oid))) AS last_analyze
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
        AND N.nspname !~ '^pg_toast'
      ) AS av
    ORDER BY av_needed DESC ,n_dead_tup DESC;
```

> [!NOTE]  
> The query doesn't take into consideration that autovacuum can be configured on a per-table basis using the "alter table" DDL command.

## Common autovacuum problems

Review the following list of possible common problems with the autovacuum process.

### Not keeping up with busy server

The autovacuum process estimates the cost of every I/O operation, accumulates a total for each operation it performs and pauses once the upper limit of the cost is reached. `autovacuum_vacuum_cost_delay` and `autovacuum_vacuum_cost_limit` are the two server parameters that are used in the process.

By default, `autovacuum_vacuum_cost_limit` is set to –1,  meaning autovacuum cost limit is the same value as the parameter `vacuum_cost_limit`, which defaults to 200. `vacuum_cost_limit` is the cost of a manual vacuum.

If `autovacuum_vacuum_cost_limit` is set to `-1`, then autovacuum uses the `vacuum_cost_limit` parameter, but if `autovacuum_vacuum_cost_limit` itself is set to greater than `-1` then `autovacuum_vacuum_cost_limit` parameter is considered.

In case the autovacuum isn't keeping up, the following parameters might be changed:

| Parameter                        | Description                                                                       
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autovacuum_vacuum_cost_limit`   | Default: `200`. Cost limit might be increased. CPU and I/O utilization on the database should be monitored before and after making changes.                                                                                   |
| `autovacuum_vacuum_cost_delay`   | **Postgres Version 11** - Default: `20 ms`. The parameter might be decreased to `2-10 ms`.<br />**Postgres Versions 12 and above** - Default: `2 ms`.                                                                         |

> [!NOTE]  
> - The `autovacuum_vacuum_cost_limit` value is distributed proportionally among the running autovacuum workers, so that if there is more than one, the sum of the limits for each worker doesn't exceed the value of the `autovacuum_vacuum_cost_limit` parameter.
> - `autovacuum_vacuum_scale_factor`  is another parameter which could trigger vacuum on a table based on dead tuple accumulation. Default: `0.2`, Allowed range: `0.05 - 0.1`. The scale factor is workload-specific and should be set depending on the amount of data in the tables. Before changing the value, investigate the workload and individual table volumes. 

### Autovacuum constantly running

Continuously running autovacuum might affect CPU and IO utilization on the server. Here are some of the possible reasons:

#### `maintenance_work_mem`

Autovacuum daemon uses `autovacuum_work_mem` that is by default set to `-1` meaning `autovacuum_work_mem` would have the same value as the parameter `maintenance_work_mem`. This document assumes `autovacuum_work_mem` is set to `-1` and `maintenance_work_mem` is used by the autovacuum daemon.

If `maintenance_work_mem` is low, it might be increased to up to 2 GB on Azure Database for PostgreSQL flexible server. A general rule of thumb is to allocate 50 MB to `maintenance_work_mem` for every 1 GB of RAM.

#### Large number of databases

Autovacuum tries to start a worker on each database every `autovacuum_naptime` seconds.

For example, if a server has 60 databases and `autovacuum_naptime` is set to 60 seconds, then the autovacuum worker starts every second [autovacuum_naptime/Number of databases].

It's a good idea to increase `autovacuum_naptime` if there are more databases in a cluster. At the same time, the autovacuum process can be made more aggressive by increasing the `autovacuum_cost_limit` and decreasing the `autovacuum_cost_delay` parameters and increasing the `autovacuum_max_workers` from the default of 3 to 4 or 5.

### Out of memory errors

Overly aggressive `maintenance_work_mem` values could periodically cause out-of-memory errors in the system. It's important to understand available RAM on the server before any change to the `maintenance_work_mem` parameter is made.

### Autovacuum is too disruptive

If autovacuum is consuming more resources, the following actions can be done:

#### Autovacuum parameters

Evaluate the parameters `autovacuum_vacuum_cost_delay`, `autovacuum_vacuum_cost_limit`, `autovacuum_max_workers`. Improperly setting autovacuum parameters might lead to scenarios where autovacuum becomes too disruptive.

If autovacuum is too disruptive, consider the following actions:

- Increase `autovacuum_vacuum_cost_delay` and reduce `autovacuum_vacuum_cost_limit` if set higher than the default of 200.
- Reduce the number of `autovacuum_max_workers` if set higher than the default of 3.

#### Too many autovacuum workers

Increasing the number of autovacuum workers doesn't increase the speed of vacuum. Having a high number of autovacuum workers isn't recommended.

Increasing the number of autovacuum workers result in more memory consumption, and depending on the value of `maintenance_work_mem` , could cause performance degradation.

Each autovacuum worker process only gets (1/autovacuum_max_workers) of the total `autovacuum_cost_limit`, so having a high number of workers causes each one to go slower.

If the number of workers is increased, `autovacuum_vacuum_cost_limit` should also be increased and/or `autovacuum_vacuum_cost_delay` should be decreased to make the vacuum process faster.

However, if we set the parameter at table level `autovacuum_vacuum_cost_delay` or `autovacuum_vacuum_cost_limit` parameters then the workers running on those tables are exempted from being considered in the balancing algorithm [autovacuum_cost_limit/autovacuum_max_workers].

### Autovacuum transaction ID (TXID) wraparound protection

When a database runs into transaction ID wraparound protection, an error message like the following error can be observed:

```
Database isn't accepting commands to avoid wraparound data loss in database 'xx'
Stop the postmaster and vacuum that database in single-user mode.
```

> [!NOTE]  
> This error message is a long-standing oversight. Usually, you do not need to switch to single-user mode. Instead, you can run the required VACUUM commands and perform tuning for VACUUM to run fast. While you cannot run any data manipulation language (DML), you can still run VACUUM.

The wraparound problem occurs when the database is either not vacuumed or there are too many dead tuples that aren't removed by autovacuum. The reasons for this issue might be:

#### Heavy workload

The workload could cause too many dead tuples in a brief period that makes it difficult for autovacuum to catch up. The dead tuples in the system add up over a period leading to degradation of query performance and leading to wraparound situation. One reason for this situation to arise might be because autovacuum parameters aren't adequately set and it isn't keeping up with a busy server.

#### Long-running transactions

Any long-running transaction in the system doesn't allow dead tuples to be removed while autovacuum is running. They're a blocker to the vacuum process. Removing the long running transactions frees up dead tuples for deletion when autovacuum runs.

Long-running transactions can be detected using the following query:

```sql
    SELECT pid, age(backend_xid) AS age_in_xids,
    now () - xact_start AS xact_age,
    now () - query_start AS query_age,
    state,
    query
    FROM pg_stat_activity
    WHERE state != 'idle'
    ORDER BY 2 DESC
    LIMIT 10;
```

#### Prepared statements

If there are prepared statements that aren't committed, they would prevent dead tuples from being removed.  
The following query helps find noncommitted prepared statements:

```sql
    SELECT gid, prepared, owner, database, transaction
    FROM pg_prepared_xacts
    ORDER BY age(transaction) DESC;
```

Use COMMIT PREPARED or ROLLBACK PREPARED to commit or roll back these statements.

#### Unused replication slots

Unused replication slots prevent autovacuum from claiming dead tuples. The following query helps identify unused replication slots:

```sql
    SELECT slot_name, slot_type, database, xmin
    FROM pg_replication_slots
    ORDER BY age(xmin) DESC;
```

Use `pg_drop_replication_slot()` to delete unused replication slots.

When the database runs into transaction ID wraparound protection, check for any blockers as mentioned previously, and remove the blockers manually for autovacuum to continue and complete. You can also increase the speed of autovacuum by setting `autovacuum_cost_delay` to 0 and increasing the `autovacuum_cost_limit` to a value greater than 200. However, changes to these parameters do not apply to existing autovacuum workers. Either restart the database or kill existing workers manually to apply parameter changes.

### Table-specific requirements

Autovacuum parameters might be set for individual tables. It's especially important for small and large tables. For example, for a small table that contains only 100 rows, autovacuum triggers VACUUM operation when 70 rows change (as calculated previously). If this table is frequently updated, you might see hundreds of autovacuum operations a day, preventing autovacuum from maintaining other tables on which the percentage of changes aren't as significant. Alternatively, a table containing a billion rows needs to change 200 million rows to trigger autovacuum operations. Setting autovacuum parameters appropriately prevents such scenarios.

To set autovacuum setting per table, change the server parameters as the following examples:

```sql
    ALTER TABLE <table name> SET (autovacuum_analyze_scale_factor = xx);
    ALTER TABLE <table name> SET (autovacuum_analyze_threshold = xx);
    ALTER TABLE <table name> SET (autovacuum_vacuum_scale_factor = xx);
    ALTER TABLE <table name> SET (autovacuum_vacuum_threshold = xx);
    ALTER TABLE <table name> SET (autovacuum_vacuum_cost_delay = xx);
    ALTER TABLE <table name> SET (autovacuum_vacuum_cost_limit = xx);
```

### Insert-only workloads

In versions of PostgreSQL <= 13, autovacuum doesn't run on tables with an insert-only workload, as there are no dead tuples and no free space that needs to be reclaimed. However, autoanalyze runs for insert-only workloads since there's new data. The disadvantages of this are:

- The visibility map of the tables isn't updated, and thus query performance, especially where there are Index Only Scans, starts to suffer over time.
- The database can run into transaction ID wraparound protection.
- Hint bits are not set.

#### Solutions

##### Postgres versions <= 13

Using the **pg_cron** extension, a cron job can be set up to schedule a periodic vacuum analyze on the table. The frequency of the cron job depends on the workload.

For step-by-step guidance using pg_cron, review [Extensions](./concepts-extensions.md).

##### Postgres 13 and higher versions

Autovacuum runs on tables with an insert-only workload. Two new server parameters `autovacuum_vacuum_insert_threshold` and  `autovacuum_vacuum_insert_scale_factor` help control when autovacuum can be triggered on insert-only tables.

## Troubleshooting guides

Using the feature troubleshooting guides that is available on the Azure Database for PostgreSQL flexible server portal it's possible to monitor bloat at database or individual schema level along with identifying potential blockers to autovacuum process. Two troubleshooting guides are available first one is autovacuum monitoring that can be used to monitor bloat at database or individual schema level. The second troubleshooting guide is autovacuum blockers and wraparound, which helps to identify potential autovacuum blockers. It also provides information on how far the databases on the server are from wraparound or emergency situation. The troubleshooting guides also share recommendations to mitigate potential issues. How to set up the troubleshooting guides to use them follow [setup troubleshooting guides](how-to-troubleshooting-guides.md).


## Azure Advisor Recommendations

Azure Advisor recommendations are a proactive way of identifying if a server has a high bloat ratio or the server is approaching transaction wraparound scenario. You can also set alerts for the recommendations using the [Create Azure Advisor alerts on new recommendations using the Azure portal](../../advisor/advisor-alerts-portal.md)

The recommendations are:

- **High Bloat Ratio**: A high bloat ratio can affect server performance in several ways. One significant issue is that the PostgreSQL Engine Optimizer might struggle to select the best execution plan, leading to degraded query performance. Therefore, a recommendation is triggered when the bloat percentage on a server reaches a certain threshold to avoid such performance issues.

- **Transaction Wrap around**: This scenario is one of the most serious issues a server can encounter. Once your server is in this state it might stop accepting any more transactions, causing the server to become read-only. Hence, a recommendation is triggered when we see the server has crossed 1 billion transactions threshold.

## Related content

- [High CPU Utilization](how-to-high-cpu-utilization.md)
- [High Memory Utilization](how-to-high-memory-utilization.md)
- [Server Parameters](how-to-configure-server-parameters-using-portal.md)
