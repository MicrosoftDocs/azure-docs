---
title: Upload data in bulk in Azure Database for PostgreSQL - Flexible Server
description: This article discusses best practices for uploading data in bulk in Azure Database for PostgreSQL - Flexible Server 
author: sarat0681
ms.author: sbalijepalli
ms.reviewer: maghan 
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/16/2022
ms.custom: template-how-to
---


# Best practices for uploading data in bulk in Azure Database for PostgreSQL - Flexible Server

This article discusses various methods for loading data in bulk in Azure Database for PostgreSQL - Flexible Server, along with best practices for both initial data loads in empty databases and incremental data loads.

## Loading methods

The following data-loading methods are arranged in order from most time consuming to least time consuming:
- Run a single-record `INSERT` command.
- Batch into 100 to 1000 rows per commit. You can use a transaction block to wrap multiple records per commit.  
- Run `INSERT` with multiple row values.
- Run the `COPY` command.

The preferred method for loading data into a database is to use the `COPY` command. If the `COPY` command isn't possible, using batch `INSERT` is the next best method. Multi-threading with a `COPY` command is the optimal method for loading data in bulk.

## Best practices for initial data loads

### Drop indexes

Before you do an initial data load, we recommend that you drop all the indexes in the tables. It's always more efficient to create the indexes after the data is loaded.

### Drop constraints

The main drop constraints are described here:

* **Unique key constraints** 

   To achieve strong performance, we recommend that you drop unique key constraints before an initial data load, and re-create them after the data load is completed. However, dropping unique key constraints cancels the safeguards against duplicated data.

* **Foreign key constraints** 

   We recommend that you drop foreign key constraints before the initial data load and re-create them after the data load is completed.

   Changing the `session_replication_role` parameter to `replica` also disables all foreign key checks. However, be aware that making the change can leave data in an inconsistent state if it's not properly used.

### Unlogged tables

Consider the pros and cons of using unlogged tables before you use them in initial data loads.

Using unlogged tables makes data load faster. Data that's written to unlogged tables isn't written to the write-ahead log.

The disadvantages of using unlogged tables are:
- They aren't crash-safe. An unlogged table is automatically truncated after a crash or unclean shutdown.
- Data from unlogged tables can't be replicated to standby servers.

To create an unlogged table or change an existing table to an unlogged table, use the following options:

* Create a new unlogged table by using the following syntax:  
    ``` 
    CREATE UNLOGGED TABLE <tablename>;
    ```

* Convert an existing logged table to an unlogged table by using the following syntax:   

    ```
    ALTER TABLE <tablename> SET UNLOGGED;
    ```

### Server parameter tuning

* `autovacuum`: During the initial data load, it's best to turn off `autovacuum`. After the initial load is completed, we recommend that you run a manual `VACUUM ANALYZE` on all tables in the database, and then turn on `autovacuum`.

> [!NOTE]
> Follow the recommendations here only if there's enough memory and disk space.

* `maintenance_work_mem`: Can be set to a maximum of 2 gigabytes (GB) on a flexible server. `maintenance_work_mem` helps in speeding up autovacuum, index, and foreign key creation.

* `checkpoint_timeout`: On a flexible server, the `checkpoint_timeout` value can be increased to a maximum of 24 hours from the default setting of 5 minutes. We recommend that you increase the value to 1 hour before you load data initially on the flexible server.

* `checkpoint_completion_target`: We recommend a value of 0.9.

* `max_wal_size`: Can be set to the maximum allowed value on a flexible server, which is 64 GB while you're doing the initial data load.

* `wal_compression`: Can be turned on. Enabling this parameter can incur some extra CPU cost spent on the compression during write-ahead log (WAL) logging and on the decompression during WAL replay.


### Flexible server recommendations

Before you begin an initial data load on the flexible server, we recommend that you:

- Disable high availability on the server. You can enable it after the initial load is completed on the primary.
- Create read replicas after the initial data load is completed.
- Make logging minimal or disable it altogether during initial data loads (for example: disable pgaudit, pg_stat_statements, query store).


### Re-create indexes and add constraints

Assuming that you dropped the indexes and constraints before the initial load, we recommend that you use high values in `maintenance_work_mem` (as mentioned earlier) for creating indexes and adding constraints. In addition, starting with PostgreSQL version 11, the following parameters can be modified for faster parallel index creation after the initial data load:

* `max_parallel_workers`: Sets the maximum number of workers that the system can support for parallel queries.

* `max_parallel_maintenance_workers`: Controls the maximum number of worker processes, which can be used in `CREATE INDEX`.

You can also create the indexes by making the recommended settings at the session level. Here's an example of how to do it:

```sql
SET maintenance_work_mem = '2GB';
SET max_parallel_workers = 16;
SET max_parallel_maintenance_workers = 8;
CREATE INDEX test_index ON test_table (test_column);
```

## Best practices for incremental data loads

### Partition tables

We always recommend that you partition large tables. Some advantages of partitioning, especially during incremental loads, include:
- Creating new partitions based on new deltas makes it efficient to add new data to the table.
- Maintaining tables becomes easier. You can drop a partition during an incremental data load to avoid time-consuming deletions in large tables.
- Autovacuum would be triggered only on partitions that were changed or added during incremental loads, which makes maintaining statistics on the table easier.

### Maintain up-to-date table statistics

Monitoring and maintaining table statistics is important for query performance on the database. This also includes scenarios where you have incremental loads. PostgreSQL uses the autovacuum daemon process to clean up dead tuples and analyze the tables to keep the statistics updated. For more information, see [Autovacuum monitoring and tuning](./how-to-autovacuum-tuning.md).

### Create indexes on foreign key constraints

Creating indexes on foreign keys in the child tables can be beneficial in the following scenarios:
- Data updates or deletions in the parent table. When data is updated or deleted in the parent table, lookups are performed on the child table. To make lookups faster, you could index foreign keys on the child table.
- Queries, where you can see the joining of parent and child tables on key columns.

### Identify unused indexes

Identify unused indexes in the database and drop them. Indexes are an overhead on data loads. The fewer the indexes on a table, the better the performance during data ingestion.

You can identify unused indexes in two ways: by Query Store and an index usage query.

**Query Store**

The Query Store feature helps identify indexes, which can be dropped based on query usage patterns on the database. For step-by-step guidance, see [Query Store](./concepts-query-store.md).

After you've enabled Query Store on the server, you can use the following query to identify indexes that can be dropped by connecting to azure_sys database.

```sql
SELECT * FROM IntelligentPerformance.DropIndexRecommendations;
```

**Index usage**

You can also use the following query to identify unused indexes:

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

The `number_of_scans`, `tuples_read`, and `tuples_fetched` columns would indicate the index usage.number_of_scans column value of zero points as an index that's not being used.

### Server parameter tuning

> [!NOTE]
> Follow the recommendations in the following parameters only if there's enough memory and disk space.

* `maintenance_work_mem`: This parameter can be set to a maximum of 2 GB on the flexible server. `maintenance_work_mem` helps speed up index creation and foreign key additions.

* `checkpoint_timeout`: On the flexible server, the `checkpoint_timeout` value can be increased to 10 or 15 minutes from the default setting of 5 minutes. Increasing `checkpoint_timeout` to a larger value, such as 15 minutes, can reduce the I/O load, but the downside is that it takes longer to recover if there's a crash. We recommend careful consideration before you make the change.

* `checkpoint_completion_target`: We recommend a value of 0.9.

* `max_wal_size`: This value depends on SKU, storage, and workload. One way to arrive at the correct value for `max_wal_size` is shown in the following example.

    During peak business hours, arrive at a value by doing the following:

    a. Take the current WAL log sequence number (LSN) by running the following query:

    ```sql
    SELECT pg_current_wal_lsn (); 
    ```
    b. Wait for `checkpoint_timeout` number of seconds. Take the current WAL LSN by running the following query:

    ```sql
    SELECT pg_current_wal_lsn (); 
    ```
    c. Use the two results to check the difference, in GB:
    
    ```sql
    SELECT round (pg_wal_lsn_diff('LSN value when run second time','LSN value when run first time')/1024/1024/1024,2) WAL_CHANGE_GB; 
    ```

* `wal_compression`: Can be turned on. Enabling this parameter can incur some extra CPU cost spent on the compression during WAL logging and on the decompression during WAL replay.


## Next steps
- [Troubleshoot high CPU utilization](./how-to-high-CPU-utilization.md)
- [Troubleshoot high memory utilization](./how-to-high-memory-utilization.md)
- [Configure server parameters](./howto-configure-server-parameters-using-portal.md)
- [Troubleshoot and tune Autovacuum](./how-to-autovacuum-tuning.md)
- [Troubleshoot high CPU utilization](./how-to-high-io-utilization.md)
