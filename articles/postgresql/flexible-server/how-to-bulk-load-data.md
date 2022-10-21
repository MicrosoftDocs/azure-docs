---
title: Bulk data uploads For Azure Database for PostgreSQL - Flexible Server
description: Best practices to bulk load data in Azure Database for PostgreSQL - Flexible Server 
author: sarat0681
ms.author: sbalijepalli
ms.reviewer: maghan 
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/16/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---


# Best practices for bulk data upload for Azure Database for PostgreSQL - Flexible Server

There are two types of bulk loads:
- Initial data load of an empty database
- Incremental data loads

This article discusses various loading techniques along with best practices when it comes to initial data loads and incremental data loads.

## Loading methods

Performance-wise, the data loading methods arranged in the order of most time consuming to least time consuming is as follows:
- Single record Insert
- Batch into 100-1000 rows per commit. One can use transaction block to wrap multiple records per commit  
- INSERT with multi row values
- COPY command

The preferred method to load the data into the database is by copy command. If the copy command isn't possible, batch INSERTs is the next best method. Multi-threading with a COPY command is the optimal method for bulk data loads.

## Best practices for initial data loads

#### Drop indexes

Before an initial data load, it's advised to drop all the indexes in the tables. It's always more efficient to create the indexes after the data load.

#### Drop constraints

##### Unique key constraints

To achieve strong performance, it's advised to drop unique key constraints before an initial data load, and recreate it once the data load is completed. However, dropping unique key constraints cancels the safeguards against duplicated data.

##### Foreign key constraints

It's advised to drop foreign key constraints before initial data load and recreate once data load is completed.

Changing the `session_replication_role` parameter to replica also disables all foreign key checks. However, be aware making the change can leave data in an inconsistent state if not properly used.

#### Unlogged tables

Use of unlogged tables will make data load faster. Data written to unlogged tables isn't written to the write-ahead log.

The disadvantages of using unlogged tables are
- They aren't crash-safe. An unlogged table is automatically truncated after a crash or unclean shutdown.
- Data from unlogged tables can't be replicated to standby servers.

The pros and cons of using unlogged tables should be considered before using in initial data loads.

Use the following options to create an unlogged table or change an existing table to unlogged table:

Create a new unlogged table by using the following syntax:  
``` 
CREATE UNLOGGED TABLE <tablename>;
```

Convert an existing logged table to an unlogged table by using the following syntax:   
```
ALTER TABLE <tablename> SET UNLOGGED;
```

#### Server parameter tuning

`Autovacuum`

During the initial data load, it's best to turn off the autovacuum. Once the initial load is completed, it's advised to run a manual VACUUM ANALYZE on all tables in the database, and then turn on autovacuum.

> [!NOTE]
> Please follow the recommendations below only if there is enough memory and disk space.

`maintenance_work_mem`

The maintenance_work_mem can be set to a maximum of 2 GB on a flexible server. `maintenance_work_mem` helps in speeding up autovacuum, index, and foreign key creation.

`checkpoint_timeout`

On the flexible server, the checkpoint_timeout can be increased to maximum 24 h from default 5 minutes. It's advised to increase the value to 1 hour before initial data loads on Flexible server.

`checkpoint_completion_target`

A value of 0.9 is always recommended.

`max_wal_size`

The max_wal_size can be set to the maximum allowed value on the Flexible server, which is 64 GB while we do the initial data load.

`wal_compression`

wal_compression can be turned on. Enabling the parameter can have some extra  CPU cost spent on the compression during WAL logging and on the decompression during WAL replay.


#### Flexible server recommendations

Before the start of initial data load on a Flexible server, it's recommended to

- Disable high availability [HA] on the server. You can enable HA once initial load is completed on master/primary.
- Create read replicas after initial data load is completed.
- Make logging minimal or disable all together during initial data loads. Example: disable pgaudit, pg_stat_statements, query store.


#### Recreating indexes and adding constraints

Assuming the indexes and constraints were dropped before the initial load, it's recommended to have high values of maintenance_work_mem (as recommended above) for creating indexes and adding constraints. In addition, starting with Postgres version 11, the following parameters can be modified for faster parallel index creation after initial data load:

`max_parallel_workers`

Sets the maximum number of workers that the system can support for parallel queries.

`max_parallel_maintenance_workers`

Controls the maximum number of worker processes, which can be used to CREATE INDEX.

One could also create the indexes by making recommended settings at the session level. An example of how it can be done at the session level is shown below:

```sql
SET maintenance_work_mem = '2GB';
SET max_parallel_workers = 16;
SET max_parallel_maintenance_workers = 8;
CREATE INDEX test_index ON test_table (test_column);
```

## Best practices for incremental data loads

#### Table partitioning

It's always recommended to partition large tables. Some advantages of partitioning, especially during incremental loads:
- Creation of new partitions based on the new deltas makes it efficient to add new data to the table.
- Maintenance of tables becomes easier. One can drop a partition during incremental data loads avoiding time-consuming deletes on large tables.
- Autovacuum would be triggered only on partitions that were changed or added during incremental loads, which make maintaining statistics on the table easier.

#### Maintain up-to-date table statistics

Monitoring and maintaining table statistics is important for query performance on the database. This also includes scenarios where you have incremental loads. PostgreSQL uses the autovacuum daemon process to clean up dead tuples and analyze the tables to keep the statistics updated. For more details on autovacuum monitoring and tuning, review [Autovacuum Tuning](./how-to-autovacuum-tuning.md).

#### Index creation on foreign key constraints

Creating indexes on foreign keys in the child tables would be beneficial in the following scenarios:
- Data updates or deletions in the parent table. When data is updated or deleted in the parent table lookups would be performed on the child table. To make lookups faster, you could index foreign keys on the child table.
- Queries, where we see join between parent and child tables on key columns.

#### Unused indexes

Identify unused indexes in the database and drop them. Indexes are an overhead on data loads. The fewer the indexes on a table the better the performance is during data ingestion.
Unused indexes can be identified in two ways - by Query Store and an index usage query.

##### Query store

Query Store helps identify indexes, which can be dropped based on query usage patterns on the database. For step-by-step guidance, see [Query Store](./concepts-query-store.md).
Once Query Store is enabled on the server, the following query can be used to identify indexes that can be dropped by connecting to azure_sys database.

```sql
SELECT * FROM IntelligentPerformance.DropIndexRecommendations;
```

##### Index usage

The below query can also be used to identify unused indexes:

```sql
SELECT 
    t.schemaname, 
    t.tablename, 
    c.reltuples::bigint                            AS num_rows, 
    pg_size_pretty(pg_relation_size(c.oid))        AS table_size, 
    psai.indexrelname                              AS index_name, 
    pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size, 
    CASE WHEN i.indisunique THEN 'Y' ELSE 'N' END AS "unique", 
    psai.idx_scan                                  AS number_of_scans, 
    psai.idx_tup_read                              AS tuples_read, 
    psai.idx_tup_fetch                             AS tuples_fetched 
FROM 
    pg_tables t 
    LEFT JOIN pg_class c ON t.tablename = c.relname 
    LEFT JOIN pg_index i ON c.oid = i.indrelid 
    LEFT JOIN pg_stat_all_indexes psai ON i.indexrelid = psai.indexrelid 
WHERE 
    t.schemaname NOT IN ('pg_catalog', 'information_schema') 
ORDER BY 1, 2; 
```

Number_of_scans, tuples_read, and tuples_fetched columns would indicate index usage.number_of_scans column value of zero points to index not being used.

#### Server parameter tuning

> [!NOTE]
> Please follow the recommendations below only if there is enough memory and disk space.

`maintenance_work_mem`

The maintenance_work_mem parameter can be set to a maximum of 2 GB on Flexible Server. `maintenance_work_mem` helps speed up index creation and foreign key additions.

`checkpoint_timeout`

On the Flexible Server, the checkpoint_timeout parameter can be increased to 10 minutes or 15 minutes from the default 5 minutes. Increasing `checkpoint_timeout` to a larger value, such as 15 minutes, can reduce the I/O load, but the downside is that it takes longer to recover if there was a crash. Careful consideration is recommended before making the change.

`checkpoint_completion_target`

A value of 0.9 is always recommended.

`max_wal_size`

The max_wal_size depends on SKU, storage, and workload.

One way to arrive at the correct value for max_wal_size is shown below.

During peak business hours, follow the below steps to arrive at a value:

- Take the current WAL LSN by executing the below query:

```sql
SELECT pg_current_wal_lsn (); 
```

- Wait for checkpoint_timeout number of seconds. Take the current WAL LSN by executing the below query:

```sql
SELECT pg_current_wal_lsn (); 
```

- Use the two results to check the difference in GB:
 
```sql
SELECT round (pg_wal_lsn_diff('LSN value when run second time','LSN value when run first time')/1024/1024/1024,2) WAL_CHANGE_GB; 
```

`wal_compression`

wal_compression can be turned on. Enabling the parameter can have some extra  CPU cost spent on the compression during WAL logging and on the decompression during WAL replay.


## Next steps
- Troubleshoot high CPU utilization [High CPU Utilization](./how-to-high-CPU-utilization.md).
- Troubleshoot high memory utilization [High Memory Utilization](./how-to-high-memory-utilization.md).
- Configure server parameters [Server Parameters](./howto-configure-server-parameters-using-portal.md).
- Troubleshoot and tune Autovacuum [Autovacuum Tuning](./how-to-autovacuum-tuning.md).
- Troubleshoot high CPU utilization [High IOPS Utilization](./how-to-high-io-utilization.md).
