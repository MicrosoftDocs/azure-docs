---
title: Bulk Data Uploads
description: Best practices to bulk load data in Azure Database for PostgreSQL - Flexible Server 
author: sarat0681
ms.author: sbalijepalli
ms.reviewer: maghan 
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/16/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Bulk Data Load Best Practices

There are two types of bulk loads:
- Initial data load of an empty database
- Incremental data loads

This article discusses various loading techniques along with best practices when it comes to initial data loads and incremental data loads.

## Loading Methods

Performance-wise the data loading methods arranged in ascending order are as follows:
- Single record Insert
- Batch into 100-1000 rows per commit. One can use a transaction block to wrap multiple records per commit [Batch Inserts]
- INSERT with multirow VALUES syntax
- COPY command

The preferred method to load the data into the database is by copy command. If the copy command isn't possible, batch INSERTs is the following best method. Multi-threading with a COPY command is the optimal method for bulk data loads.

## Best Practices for Initial Data Loads

### Drop Indexes

Index-building during data load slows up the performance. During the initial data loads, dropping all the indexes in the tables is advised. It's always more efficient to build the indexes after the data load.

### Drop Constraints

#### Unique Key Constraints

Suppose a unique key constraint is defined on the table (implemented in Postgres as a unique B-tree index). In that case, every insert will do an index lookup to determine if a row exists, which slows data load performance. It's advised performance-wise to drop unique key constraints before bulk data load and recreate once data load is completed. On the other hand, one should be aware that dropping unique constraints cancels the safeguards against duplicated data.

#### Foreign Key Constraints

It's advised to drop foreign key constraints before bulk data load and recreate once data load is completed or change the session_replication_role parameter to a replica as follows:

```sql
SET session_replication_role to 'replica'; 
```

#### Unlogged Tables

The use of unlogged tables will make data load faster. Data written to unlogged tables isn't written to the write-ahead log.

Use the following options to create an unlogged table:
- Create a new unlogged table by using syntax 

```sql
CREATE UNLOGGED TABLE <tablename>;
```

- Convert an existing logged table to an unlogged table by using syntax

```sql
ALTER TABLE <tablename> SET UNLOGGED;
```

The disadvantages of using unlogged tables are:
- They aren't crash-safe. An unlogged table is automatically truncated after a crash or unclean shutdown
- Data from unlogged tables can't be replicated to standby servers

Before using bulk data loads, the pros and cons of unlogged tables should be considered.

### Server Parameter Tuning

`Autovacuum`: During the initial data load, it's best to turn off the autovacuum. Once the bulk load is completed, it's advised to run a manual VACUUM ANALYZE on all tables in the database, and then turn on autovacuum.

> [!NOTE]
> Please follow the recommendations below only if there is enough memory and disk space.

`maintenance_work_mem`: The maintenance_work_mem can be set to a maximum of 2 GB on a flexible server. `maintenance_work_mem` helps in speeding up autovacuum, index, and foreign key creation.

`wal_buffers`: The wal_buffers parameter can be increased from default 8 MB to 16 MB.

`checkpoint_timeout`: On the flexible server, the checkpoint_timeout can be increased to a maximum of 24 h from the default 5 minutes. It's advised to increase the value to 1 hour before data loads on a flexible server.

`checkpoint_completion_target`: A value of 0.9 is always recommended.

`max_wal_size`: The max_wal_size can be set to the maximum allowed value on the flexible server, 64 GB, while we do the initial data load.

`wal_compression`: wal_compression can be turned on. Enabling the parameter can reduce the WAL volume without increasing the risk of unrecoverable data corruption.


### Flexible Server Recommendations

Before the start of initial data load on a flexible server, it's recommended to

- Disable HA. We can enable HA once the full load is completed on master/primary.
- Create read replicas after the initial data load is completed.
- Make logging minimal or disable all together during initial data loads. Example: disable pgaudit, pg_stat_statements, query store


### Recreating Indexes and Adding Constraints

Assuming the indexes and constraints were dropped before the initial load, it's recommended to have high values of maintenance_work_mem [as recommended above] for index creation and constraint addition. In addition, starting Postgres version 11, the following parameters can be modified for faster parallel index creation after initial data load.

`max_parallel_workers`: Sets the maximum number of workers the system can support for parallel queries.

`max_parallel_maintenance_workers`: Controls the maximum number of worker processes, which can be used to CREATE INDEX.

One could also create the indexes by making recommended settings at the session level. An example of how it can be done at the session level is shown below:

```sql
SET maintenance_work_mem = '2GB';
SET max_parallel_workers = 16;
SET max_parallel_maintenance_workers = 8;
CREATE INDEX test_index ON test_table (test_column);
```

## Best Practices for Incremental Data Loads

### Table Partitioning

It's always recommended to partition large tables. Some advantages of partitioning, especially during incremental loads:
- Creation of new partitions based on the new deltas makes adding new data to the table efficient.
- Maintenance of tables becomes easier. One can drop a partition during incremental data loads avoiding time-consuming deletes on large tables.
- autovacuum would be triggered only on partitions that were changed or added during incremental loads, which make maintaining statistics on the table easier

### Maintain Up-To-Date Table Statistics

Monitoring and maintaining table statistics is important for the performance of the queries on the database. This would also include scenarios where we have incremental loads. PostgreSQL uses the autovacuum daemon process to clean up dead tuples and analyze the tables to keep the statistics updated. For more details on autovacuum monitoring and tuning, review [Autovacuum Tuning](./how-to-autovacuum-tuning.md). 

### Index Creation on Foreign Key Constraints

For understanding, we assume two tables - the parent table and the table where foreign key is created, which references the parent table's primary key. We call this the child table.

Creating indexes on foreign keys on the child table would be beneficial in the following scenarios:

- Data updates or deletions in the parent table. Lookups are performed on the child table when data is updated or deleted in the parent table. We could index foreign keys on the child table to make lookups faster.
- Queries, where we see join between parent and child tables on key columns, is another scenario where index creation on foreign keys is recommended.

### Unused Indexes

Identify unused indexes in the database and drop them. Indexes are overhead on data loads. The fewer indexes on a table, the better the performance is during data ingestion.

Unused indexes can be identified in two ways.

#### Query Store

Query Store helps identify indexes, which can be dropped based on query usage patterns on the database. For step-by-step guidance, see [Query Store](./concepts-query-store.md).

Once Query Store is enabled on the server, the following query can be used to identify indexes that can be dropped by connecting to azure_sys database.

```sql
SELECT * FROM IntelligentPerformance.CreateIndexRecommendations;
```

#### Index Usage

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


### Server Parameter Tuning

> [!NOTE]
> Please follow the recommendations below only if there is enough memory and disk space.

`maintenance_work_mem`: The maintenance_work_mem parameter can be set to a maximum of 2 GB on Flexible Server. `maintenance_work_mem` helps speed up index creation and foreign key additions.

`checkpoint_timeout`: On the Flexible Server, the checkpoint_timeout parameter can be increased to 10 minutes or 15 minutes from the default 5 minutes. Increasing checkpoint_timeout to a larger value, such as 15 minutes, can reduce the I/O load, but the downside is that it takes longer to recover if there was a crash. Careful consideration is recommended before making the change.

`checkpoint_completion_target`: A value of 0.9 is always recommended.

`max_wal_size`: The max_wal_size depends on SKU, storage, and workload.

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

`wal_compression`: wal_compression can be turned on. Enabling the parameter can reduce the WAL volume without increasing the risk of unrecoverable data corruption, but at the cost of some extra CPU spent on the compression during WAL logging and on the decompression during WAL replay.


## Next steps
- Troubleshoot high CPU utilization [High CPU Utilization](./how-to-high-CPU-utilization.md).
- Troubleshoot high memory utilization [High Memory Utilization](./how-to-high-memory-utilization.md).
- Configure server parameters [Server Parameters](./howto-configure-server-parameters-using-portal.md).
- Troubleshoot and tune Autovacuum [Autovacuum Tuning](./how-to-autovacuum-tuning.md).
- Troubleshoot high CPU utilization [High IOPS Utilization](./how-to-high-io-utilization.md).
