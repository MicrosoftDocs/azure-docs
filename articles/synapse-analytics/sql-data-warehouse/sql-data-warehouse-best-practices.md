---
title: Best practices for Synapse SQL pool in Azure Synapse Analytics (formerly SQL DW) 
description: Recommendations and best practices for developing solutions for SQL pool in Azure Synapse Analytics (formerly SQL DW). 
services: synapse-analytics
author: mlee3gsd
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 11/04/2019
ms.author: martinle
ms.reviewer: igorstan
---

# Best practices for Synapse SQL pool in Azure Synapse Analytics (formerly SQL DW)

This article is a collection of best practices to help you to achieve optimal performance from your [SQL pool](sql-data-warehouse-overview-what-is.md) deployment.  The purpose of this article is to give you some basic guidance and highlight important areas of focus.  

## Reduce cost with pause and scale

For more information about reducing costs through pausing and scaling, see the [Manage compute](sql-data-warehouse-manage-compute-overview.md).

## Maintain statistics

SQL pool can be configured to automatically detect and create statistics on columns.  The query plans created by the optimizer are only as good as the available statistics.  

We recommend that you enable AUTO_CREATE_STATISTICS for your databases and keep the statistics updated daily or after each load to ensure that statistics on columns used in your queries are always up to date.

If you find it is taking too long to update all of your statistics, you may want to try to be more selective about which columns need frequent statistics updates. For example, you might want to update date columns, where new values may be added, daily.

> [!TIP]
> You will gain the most benefit by having updated statistics on columns involved in joins, columns used in the WHERE clause and columns found in GROUP BY.

See also [Manage table statistics](sql-data-warehouse-tables-statistics.md), [CREATE STATISTICS](/sql/t-sql/statements/create-statistics-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), and [UPDATE STATISTICS](/sql/t-sql/statements/update-statistics-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

## Use DMVs to monitor and optimize your queries

SQL pool has several DMVs that can be used to monitor query execution.  The Monitor your workload using DMVs article details step-by-step instructions on how to look at the details of an executing query.  

To quickly find queries in these DMVs, using the LABEL option with your queries can help.

See also [Monitor your workload using DMVs](sql-data-warehouse-manage-monitor.md), [LABEL](sql-data-warehouse-develop-label.md), [OPTION](/sql/t-sql/queries/option-clause-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [sys.dm_exec_sessions](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sessions-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [sys.dm_pdw_request_steps](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [sys.dm_pdw_sql_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-sql-requests-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [sys.dm_pdw_dms_workers](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-workers-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [DBCC PDW_SHOWEXECUTIONPLAN](/sql/t-sql/database-console-commands/dbcc-pdw-showexecutionplan-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), and [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

## Tune query performance with new product enhancements

- [Performance tuning with materialized views](performance-tuning-materialized-views.md)
- [Performance tuning with ordered clustered columnstore index](performance-tuning-ordered-cci.md)
- [Performance tuning with result set caching](performance-tuning-result-set-caching.md)

## Group INSERT statements into batches

A one-time load to a small table with an INSERT statement or even a periodic reload of a look-up may perform well for your needs with a statement like `INSERT INTO MyLookup VALUES (1, 'Type 1')`.  

However, if you need to load thousands or millions of rows throughout the day, you might find that singleton INSERTS just can't keep up.  Instead, develop your processes so that they write to a file and another process periodically comes along and loads this file.

See also [INSERT](/sql/t-sql/statements/insert-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

## Use PolyBase to load and export data quickly

SQL pool supports loading and exporting data through several tools including Azure Data Factory, PolyBase, and BCP.  For small amounts of data where performance isn't critical, any tool may be sufficient for your needs.  However, when you are loading or exporting large volumes of data or fast performance is needed, PolyBase is the best choice.  

PolyBase is designed to leverage the MPP (Massively Parallel Processing) architecture and will load and export data magnitudes faster than any other tool.  PolyBase loads can be run using CTAS or INSERT INTO.  

> [!TIP]
> Using CTAS will minimize transaction logging and the fastest way to load your data.

Azure Data Factory also supports PolyBase loads and can achieve similar performance as CTAS.  PolyBase supports a variety of file formats including Gzip files.  
  
> [!NOTE]
> To maximize throughput when using gzip text files, break up files into 60 or more files to maximize parallelism of your load.  For faster total throughput, consider loading data concurrently.

See also [Load data](design-elt-data-loading.md), [Guide for using PolyBase](guidance-for-loading-data.md), [SQL pool loading patterns and strategies](https://blogs.msdn.microsoft.com/sqlcat/20../../), [Load Data with Azure Data Factory]( ../../data-factory/load-azure-sql-data-warehouse.md), [Move data with Azure Data Factory](../../data-factory/transform-data-using-machine-learning.md), [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), and [Create table as select (CTAS)](sql-data-warehouse-develop-ctas.md).

## Load then query external tables

While Polybase, also known as external tables, can be the fastest way to load data, it is not optimal for queries. Polybase tables currently only support Azure blob files and Azure Data Lake storage. These files do not have any compute resources backing them.  

As a result, SQL pool cannot offload this work and therefore must read the entire file by loading it to tempdb in order to read the data.  Therefore, if you have several queries that will be querying this data, it is better to load this data once and have queries use the local table.

See also [Guide for using PolyBase](guidance-for-loading-data.md).

## Hash distribute large tables

By default, tables are Round Robin distributed.  This makes it easy for users to get started creating tables without having to decide how their tables should be distributed.  Round Robin tables may perform sufficiently for some workloads, but in most cases selecting a distribution column will perform much better.  

The most common example of when a table distributed by a column will far outperform a Round Robin table is when two large fact tables are joined.  

For example, if you have an orders table, which is distributed by order_id, and a transactions table, which is also distributed by order_id, when you join your orders table to your transactions table on order_id, this query becomes a pass-through query, which means we eliminate data movement operations.  Fewer steps mean a faster query.  Less data movement also makes for faster queries.  

> [!TIP]
> When loading a distributed table, be sure that your incoming data is not sorted on the distribution key as this will slow down your loads.  

See the following links for more details on how selecting a distribution column can improve performance as well as how to define a distributed table in the WITH clause of your CREATE TABLE statement.

See also [Table overview](sql-data-warehouse-tables-overview.md), [Table distribution](sql-data-warehouse-tables-distribute.md), [Selecting table distribution](https://blogs.msdn.microsoft.com/sqlcat/20../../choosing-hash-distributed-table-vs-round-robin-distributed-table-in-azure-sql-dw-service/), [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

## Do not over-partition

While partitioning data can be effective for maintaining your data through partition switching or optimizing scans by with partition elimination, having too many partitions can slow down your queries.  Often a high granularity partitioning strategy, which may work well on SQL Server may not work well in SQL pool.  

Having too many partitions can also reduce the effectiveness of clustered columnstore indexes if each partition has fewer than 1 million rows.  Keep in mind that behind the scenes, SQL pool partitions your data for you into 60 databases, so if you create a table with 100 partitions, this actually results in 6000 partitions.  

Each workload is different so the best advice is to experiment with partitioning to see what works best for your workload.  Consider lower granularity than what may have worked for you in SQL Server.  For example, consider using weekly or monthly partitions rather than daily partitions.

See also [Table partitioning](sql-data-warehouse-tables-partition.md).

## Minimize transaction sizes

INSERT, UPDATE, and DELETE statements run in a transaction and when they fail they must be rolled back.  To minimize the potential for a long rollback, minimize transaction sizes whenever possible.  This can be done by dividing INSERT, UPDATE, and DELETE statements into parts.  

For example, if you have an INSERT that you expect to take 1 hour, if possible, break up the INSERT into four parts, which will each run in 15 minutes.  Leverage special Minimal Logging cases, like CTAS, TRUNCATE, DROP TABLE, or INSERT to empty tables, to reduce rollback risk.  

Another way to eliminate rollbacks is to use Metadata Only operations like partition switching for data management.  For example, rather than execute a DELETE statement to delete all rows in a table where the order_date was in October of 2001, you could partition your data monthly and then switch out the partition with data for an empty partition from another table (see [ALTER TABLE](/sql/t-sql/statements/alter-table-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) examples).  

For unpartitioned tables, consider using a CTAS to write the data you want to keep in a table rather than using DELETE.  If a CTAS takes the same amount of time, it is a much safer operation to run as it has minimal transaction logging and can be canceled quickly if needed.

See also [Understanding transactions](sql-data-warehouse-develop-transactions.md), [Optimizing transactions](sql-data-warehouse-develop-best-practices-transactions.md), [Table partitioning](sql-data-warehouse-tables-partition.md), [TRUNCATE TABLE](/sql/t-sql/statements/truncate-table-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [ALTER TABLE](/sql/t-sql/statements/alter-table-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), and [Create table as select (CTAS)](sql-data-warehouse-develop-ctas.md).

## Reduce query result sizes

This step helps you avoid client-side issues caused by large query result.  You can edit your query to reduce the number of rows returned. Some query generation tools allow you to add "top N" syntax to each query.  You can also CETAS the query result to a temporary table and then use PolyBase export for the downlevel processing.

## Use the smallest possible column size

When defining your DDL, using the smallest data type that will support your data will improve query performance.  This approach is particularly important for CHAR and VARCHAR columns.  

If the longest value in a column is 25 characters, then define your column as VARCHAR(25).  Avoid defining all character columns to a large default length.  In addition, define columns as VARCHAR when that is all that is needed rather than use NVARCHAR.

See also [Table overview](sql-data-warehouse-tables-overview.md), [Table data types](sql-data-warehouse-tables-data-types.md), [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

## Use temporary heap tables for transient data

When you are temporarily landing data, you may find that using a heap table will make the overall process faster.  If you are loading data only to stage it before running more transformations, loading the table to heap table will be much faster than loading the data to a clustered columnstore table.  

In addition, loading data to a temp table will also load much faster than loading a table to permanent storage.  Temporary tables start with a "#" and are only accessible by the session that created it, so they may only work in limited scenarios.

Heap tables are defined in the WITH clause of a CREATE TABLE.  If you do use a temporary table, remember to create statistics on that temporary table too.

See also [Temporary tables](sql-data-warehouse-tables-temporary.md), [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

## Optimize clustered columnstore tables

Clustered columnstore indexes are one of the most efficient ways you can store your data in SQL pool.  By default, tables in SQL pool are created as Clustered ColumnStore.  To get the best performance for queries on columnstore tables, having good segment quality is important.  

When rows are written to columnstore tables under memory pressure, columnstore segment quality may suffer.  Segment quality can be measured by number of rows in a compressed Row Group.  See the [Causes of poor columnstore index quality](sql-data-warehouse-tables-index.md#causes-of-poor-columnstore-index-quality) in the [Table indexes](sql-data-warehouse-tables-index.md) article for step-by-step instructions on detecting and improving segment quality for clustered columnstore tables.  

Because high-quality columnstore segments are important, it's a good idea to use users IDs that are in the medium or large resource class for loading data. Using lower [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md) means you want to assign a larger resource class to your loading user.

Since columnstore tables generally won't push data into a compressed columnstore segment until there are more than 1 million rows per table and each SQL pool table is partitioned into 60 tables, as a rule of thumb, columnstore tables won't benefit a query unless the table has more than 60 million rows.  For table with less than 60 million rows, it may not make any sense to have a columnstore index.  It also may not hurt.  

Furthermore, if you partition your data, then you will want to consider that each partition will need to have 1 million rows to benefit from a clustered columnstore index.  If a table has 100 partitions, then it will need to have at least 6 billion rows to benefit from a clustered columns store (60 distributions *100 partitions* 1 million rows).  

If your table does not have 6 billion rows in this example, either reduce the number of partitions or consider using a heap table instead.  It also may be worth experimenting to see if better performance can be gained with a heap table with secondary indexes rather than a columnstore table.

> [!TIP]
> When querying a columnstore table, queries will run faster if you select only the columns you need.  

See also [Table indexes](sql-data-warehouse-tables-index.md), [Columnstore indexes guide](/sql/relational-databases/indexes/columnstore-indexes-overview?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [Rebuilding columnstore indexes](sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality)

## Use larger resource class to improve query performance

SQL pool uses resource groups as a way to allocate memory to queries.  Out of the box, all users are assigned to the small resource class, which grants 100 MB of memory per distribution.  Since there are always 60 distributions and each distribution is given a minimum of 100 MB, system wide the total memory allocation is 6,000 MB, or just under 6 GB.  

Certain queries, like large joins or loads to clustered columnstore tables, will benefit from larger memory allocations.  Some queries, like pure scans, will yield no benefit.  However, utilizing larger resource classes reduces concurrency, so you will want to take this impact into consideration before moving all of your users to a large resource class.

See also [Resource classes for workload management](resource-classes-for-workload-management.md).

## Use Smaller Resource Class to Increase Concurrency

If you notice that user queries seem to have a long delay, it could be that your users are running in larger resource classes and are consuming many concurrency slots causing other queries to queue up.  To see if users queries are queued, run `SELECT * FROM sys.dm_pdw_waits` to see if any rows are returned.

See also [Resource classes for workload management](resource-classes-for-workload-management.md), [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

## Other resources

Also see our [Troubleshooting](sql-data-warehouse-troubleshoot.md) article for common issues and solutions.

If you didn't find what you are looking for in this article, try using the "Search for docs" on the left side of this page to search all of the Azure Synapse documents.  The [Microsoft Q&A question page for Azure Synapse](https://docs.microsoft.com/answers/topics/azure-synapse-analytics.html) is a place for you to post questions to other users and to the Azure Synapse Product Group. We actively monitor this forum to ensure that your questions are answered either by another user or one of us.  

If you prefer to ask your questions on Stack Overflow, we also have an [Azure Synapse Stack Overflow Forum](https://stackoverflow.com/questions/tagged/azure-sqldw).

Please use the [Azure Synapse Feedback](https://feedback.azure.com/forums/307516-sql-data-warehouse) page to make feature requests.  Adding your requests or up-voting other requests really helps us prioritize features.
