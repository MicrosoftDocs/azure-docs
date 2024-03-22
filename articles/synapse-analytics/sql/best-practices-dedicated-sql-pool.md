---
title: Best practices for dedicated SQL pools
description: Recommendations and best practices you should know as you work with dedicated SQL pools.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 09/22/2022
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: conceptual
---

# Best practices for dedicated SQL pools in Azure Synapse Analytics

This article provides a collection of best practices to help you achieve optimal performance for dedicated SQL pools in Azure Synapse Analytics. If you're working with serverless SQL pool, see [Best practices for serverless SQL pools](best-practices-serverless-sql-pool.md) for specific guidance. Below, you'll find basic guidance and important areas to focus on as you build your solution. Each section introduces you to a concept and then points you to more detailed articles that cover the concept in more depth.

## Dedicated SQL pools loading

For dedicated SQL pools loading guidance, see [Guidance for loading data](data-loading-best-practices.md).

## Reduce cost with pause and scale

For more information about reducing costs through pausing and scaling, see [Manage compute](../sql-data-warehouse/sql-data-warehouse-manage-compute-overview.md?context=/azure/synapse-analytics/context/context).

## Maintain statistics

Dedicated SQL pool can be configured to automatically detect and create statistics on columns.  The query plans created by the optimizer are only as good as the available statistics.  

We recommend that you enable AUTO_CREATE_STATISTICS for your databases and keep the statistics updated daily or after each load to ensure that statistics on columns used in your queries are always up-to-date.

To shorten statistics maintenance time, be selective about which columns have statistics, or need the most frequent updating. For example, you might want to update date columns where new values may be added daily. Focus on having statistics for columns involved in joins, columns used in the WHERE clause, and columns found in GROUP BY.

Additional information on statistics can be found in the [Manage table statistics](develop-tables-statistics.md), [CREATE STATISTICS](/sql/t-sql/statements/create-statistics-transact-sql?view=azure-sqldw-latest&preserve-view=true), and [UPDATE STATISTICS](/sql/t-sql/statements/update-statistics-transact-sql?view=azure-sqldw-latest&preserve-view=true) articles.

## Tune query performance

- [Performance tuning with materialized views](../sql-data-warehouse/performance-tuning-materialized-views.md)
- [Performance tuning with ordered clustered columnstore index](../sql-data-warehouse/performance-tuning-ordered-cci.md)
- [Performance tuning with result set caching](../sql-data-warehouse/performance-tuning-result-set-caching.md)

## Group INSERT statements into batches

A one-time load to a small table with an INSERT statement such as `INSERT INTO MyLookup VALUES (1, 'Type 1')`may be the best approach depending on your needs. However, if you need to load thousands or millions of rows throughout the day, it's likely that singleton INSERTS aren't optimal.

One way to solve this issue is to develop one process that writes to a file, and then another process to periodically load this file. Refer to the [INSERT](/sql/t-sql/statements/insert-transact-sql?view=azure-sqldw-latest&preserve-view=true) article for more information.

## Use PolyBase to load and export data quickly

Dedicated SQL pool supports loading and exporting data through several tools including Azure Data Factory, PolyBase, and BCP.  For small amounts of data where performance isn't critical, any tool may be sufficient for your needs.  

> [!NOTE]
> PolyBase is the best choice when you are loading or exporting large volumes of data, or you need faster performance.

PolyBase loads can be run using CTAS or INSERT INTO. CTAS will minimize transaction logging and is the fastest way to load your data. Azure Data Factory also supports PolyBase loads and can achieve performance similar to CTAS. PolyBase supports various file formats including Gzip files.

To maximize throughput when using Gzip text files, break up files into 60 or more files to maximize parallelism of your load. For faster total throughput, consider loading data concurrently. Additional information relevant to this section is included in the following articles:

- [Load data](../sql-data-warehouse/design-elt-data-loading.md?context=/azure/synapse-analytics/context/context)
- [Guide for using PolyBase](data-loading-best-practices.md)
- [Dedicated SQL pool loading patterns and strategies](/archive/blogs/sqlcat/azure-sql-data-warehouse-loading-patterns-and-strategies)
- [Load Data with Azure Data Factory](../../data-factory/load-azure-sql-data-warehouse.md?context=/azure/synapse-analytics/context/context)
- [Move data with Azure Data Factory](../../data-factory/transform-data-using-machine-learning.md?context=/azure/synapse-analytics/context/context)
- [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [Create table as select (CTAS)](../sql-data-warehouse/sql-data-warehouse-develop-ctas.md?context=/azure/synapse-analytics/context/context)

## Load then query external tables

PolyBase isn't optimal for queries. PolyBase tables for dedicated SQL pools currently only support Azure blob files and Azure Data Lake storage. These files don't have any compute resources backing them. As a result, dedicated SQL pools cannot offload this work and must read the entire file by loading it to `tempdb` so it can read the data.

If you have several queries for querying this data, it's better to load this data once and have queries use the local table. Further PolyBase guidance is included in the  [Guide for using PolyBase](data-loading-best-practices.md) article.

## Hash distribute large tables

By default, tables are Round Robin distributed. This default makes it easy for users to start creating tables without having to decide how their tables should be distributed. Round Robin tables may perform sufficiently for some workloads. But, in most cases, a distribution column provides better performance.  

The most common example of a table distributed by a column outperforming a round robin table is when two large fact tables are joined.  

For example, if you have an orders table distributed by order_id, and a transactions table also distributed by order_id, when you join your orders table to your transactions table on order_id, this query becomes a pass-through query. Data movement operations are then eliminated. Fewer steps mean a faster query. Less data movement also makes for faster queries.

> [!TIP]
> When loading a distributed table, your incoming data shouldn't be sorted on the distribution key. Doing so will slow down your loads.

The article links provided below will give you additional details about improving performance via selecting a distribution column. Also, you'll find information about how to define a distributed table in the WITH clause of your CREATE TABLE statement:

- [Table overview](develop-tables-overview.md)
- [Table distribution](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md?context=/azure/synapse-analytics/context/context)
- [Selecting table distribution](/archive/blogs/sqlcat/choosing-hash-distributed-table-vs-round-robin-distributed-table-in-azure-sql-dw-service)
- [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?view=azure-sqldw-latest&preserve-view=true)
- [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?view=azure-sqldw-latest&preserve-view=true)

## Do not over-partition

While partitioning data can be effective for maintaining your data through partition switching or optimizing scans by with partition elimination, having too many partitions can slow down your queries.  Often a high granularity partitioning strategy that may work well on SQL Server may not work well on dedicated SQL pool.  

Having too many partitions can reduce the effectiveness of clustered columnstore indexes if each partition has fewer than 1 million rows. Dedicated SQL pools automatically partition your data into 60 databases. So, if you create a table with 100 partitions, the result will be 6000 partitions. Each workload is different, so the best advice is to experiment with partitioning to see what works best for your workload.  

One option to consider is using a granularity that is lower than what you've implemented using SQL Server. For example, consider using weekly or monthly partitions instead of daily partitions.

More information about partitioning is detailed in the [Table partitioning](../sql-data-warehouse/sql-data-warehouse-tables-partition.md?context=/azure/synapse-analytics/context/context) article.

## Minimize transaction sizes

INSERT, UPDATE, and DELETE statements run in a transaction. When they fail, they must be rolled back. To reduce the potential for a long rollback, minimize transaction sizes whenever possible.  Minimizing transaction sizes can be done by dividing INSERT, UPDATE, and DELETE statements into parts. For example, if you have an INSERT that you expect to take 1 hour, you can break up the INSERT into four parts. Each run will then be shortened to 15 minutes.  

> [!TIP]
> Leverage special Minimal Logging cases, like CTAS, TRUNCATE, DROP TABLE, or INSERT to empty tables to reduce rollback risk.  

Another way to eliminate rollbacks is to use Metadata Only operations like partition switching for data management.  For example, rather than execute a DELETE statement to delete all rows in a table where the order_date was in October of 2001, you could partition your data monthly. Then you can switch out the partition with data for an empty partition from another table (see ALTER TABLE examples).  

For tables that are not partitioned, consider using a CTAS to write the data you want to keep in a table rather than using DELETE.  If a CTAS takes the same amount of time, it's much safer to run since it has minimal transaction logging and can be canceled quickly if needed.

Further information on content related to this section is included in the articles below:

- [Create table as select (CTAS)](../sql-data-warehouse/sql-data-warehouse-develop-ctas.md?context=/azure/synapse-analytics/context/context)
- [Understanding transactions](develop-transactions.md)
- [Optimizing transactions](../sql-data-warehouse/sql-data-warehouse-develop-best-practices-transactions.md?context=/azure/synapse-analytics/context/context)
- [Table partitioning](../sql-data-warehouse/sql-data-warehouse-tables-partition.md?context=/azure/synapse-analytics/context/context)
- [TRUNCATE TABLE](/sql/t-sql/statements/truncate-table-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [ALTER TABLE](/sql/t-sql/statements/alter-table-transact-sql?view=azure-sqldw-latest&preserve-view=true)

## Reduce query result sizes

Reducing query results sizes helps you avoid client-side issues caused by large query results.  You can edit your query to reduce the number of rows returned. Some query generation tools allow you to add "top N" syntax to each query.  You can also CETAS the query result to a temporary table and then use PolyBase export for the downlevel processing.

## Use the smallest possible column size

When defining your DDL, use the smallest data type that will support your data as doing so will improve query performance.  This recommendation is particularly important for CHAR and VARCHAR columns.  If the longest value in a column is 25 characters, then define your column as VARCHAR(25).  Avoid defining all character columns to a large default length.  Additionally, define columns as VARCHAR when that is all that is needed rather than using NVARCHAR.

Please see the [Table overview](develop-tables-overview.md), [Table data types](develop-tables-data-types.md), and [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?view=azure-sqldw-latest&preserve-view=true) articles for a more detailed review of essential concepts relevant to the above information.

## Use temporary heap tables for transient data

When you're temporarily landing data on dedicated SQL pools, heap tables will generally make the overall process faster.  If you're loading data only to stage it before running more transformations, loading the table to a heap table will be quicker than loading the data to a clustered columnstore table.  

Loading data to a temp table will also load much faster than loading a table to permanent storage.  Temporary tables start with a "#" and are only accessible by the session that created it. Consequently, they may only work in limited scenarios. Heap tables are defined in the WITH clause of a CREATE TABLE.  If you do use a temporary table, remember to create statistics on that temporary table too.

For more information, see the [Temporary tables](/sql/t-sql/statements/alter-table-transact-sql?view=azure-sqldw-latest&preserve-view=true), [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?view=azure-sqldw-latest&preserve-view=true), and [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?view=azure-sqldw-latest&preserve-view=true) articles.

## Optimize clustered columnstore tables

Clustered columnstore indexes are one of the most efficient ways you can store your data in dedicated SQL pool.  By default, tables in dedicated SQL pool are created as Clustered ColumnStore.  To get the best performance for queries on columnstore tables, having good segment quality is important.  When rows are written to columnstore tables under memory pressure, columnstore segment quality may suffer.  

Segment quality can be measured by the number of rows in a compressed Row Group. See the [Causes of poor columnstore index quality](../sql-data-warehouse/sql-data-warehouse-tables-index.md?context=/azure/synapse-analytics/context/context#causes-of-poor-columnstore-index-quality) in the [Table indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?context=/azure/synapse-analytics/context/context) article for step-by-step instructions on detecting and improving segment quality for clustered columnstore tables.  

Because high-quality columnstore segments are important, it's a good idea to use users IDs that are in the medium or large resource class for loading data. Using lower [data warehouse units](resource-consumption-models.md) means you want to assign a larger resource class to your loading user.

Columnstore tables generally won't push data into a compressed columnstore segment until there are more than 1 million rows per table. Each dedicated SQL pool table is distributed into 60 different distributions. As such, columnstore tables won't benefit a query unless the table has more than 60 million rows.  

> [!TIP]
> For tables with less than 60 million rows, having a columnstore index may not be the optimal solution.  

If you partition your data, each partition will need to have 1 million rows to benefit from a clustered columnstore index.  For a table with 100 partitions, it needs to have at least 6 billion rows to benefit from a clustered columns store (60 distributions *100 partitions* 1 million rows).  

If your table doesn't have 6 billion rows, you have two main options. Either reduce the number of partitions or consider using a heap table instead.  It also may be worth experimenting to see if better performance can be gained by using a heap table with secondary indexes rather than a columnstore table.

When querying a columnstore table, queries will run faster if you select only the columns you need.  Further information on table and columnstore indexes and can be found in the articles below:
- [Table indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?context=/azure/synapse-analytics/context/context)
- [Columnstore indexes guide](/sql/relational-databases/indexes/columnstore-indexes-overview?view=azure-sqldw-latest&preserve-view=true)
- [Rebuilding columnstore indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?view=azure-sqldw-latest&preserve-view=true#rebuild-indexes-to-improve-segment-quality) 
- [Performance tuning with ordered clustered columnstore index](../sql-data-warehouse/performance-tuning-ordered-cci.md)

## Use larger resource class to improve query performance

SQL pools use resource groups as a way to allocate memory to queries. Initially, all users are assigned to the small resource class, which grants 100 MB of memory per distribution.  There are always 60 distributions. Each distribution is given a minimum of 100 MB. The total system-wide memory allocation is 6,000 MB, or just under 6 GB.  

Certain queries, like large joins or loads to clustered columnstore tables, will benefit from larger memory allocations.  Some queries, such as pure scans, will see no benefit. Utilizing larger resource classes impacts concurrency. So, you'll want to keep these facts in mind before moving all of your users to a large resource class.

For additional information on resource classes, refer to the [Resource classes for workload management](../sql-data-warehouse/resource-classes-for-workload-management.md?context=/azure/synapse-analytics/context/context) article.

## Use smaller resource class to increase concurrency

If you notice a long delay in user queries, your users might be running in larger resource classes. This scenario promotes the consumption of concurrency slots, which can cause other queries to queue up.  To determine if users queries are queued, run `SELECT * FROM sys.dm_pdw_waits` to see if any rows are returned.

The [Resource classes for workload management](../sql-data-warehouse/resource-classes-for-workload-management.md) and [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql?view=azure-sqldw-latest&preserve-view=true) articles will provide you with more information.

## Use DMVs to monitor and optimize your queries

Dedicated SQL pools have several DMVs that can be used to monitor query execution.  The monitoring article below walks you through step-by-step instructions on how to view details of an executing query.  To quickly find queries in these DMVs, using the LABEL option with your queries can help. For additional detailed information, please see the articles included in the list below:

- [Monitor your workload using DMVs](../sql-data-warehouse/sql-data-warehouse-manage-monitor.md?context=/azure/synapse-analytics/context/context)

- [LABEL](develop-label.md)
- [OPTION](/sql/t-sql/queries/option-clause-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_exec_sessions](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sessions-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_request_steps](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_sql_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-sql-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_dms_workers](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-workers-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [DBCC PDW_SHOWEXECUTIONPLAN](/sql/t-sql/database-console-commands/dbcc-pdw-showexecutionplan-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql?view=azure-sqldw-latest&preserve-view=true)

## Next steps

Also see the [Troubleshooting](../sql-data-warehouse/sql-data-warehouse-troubleshoot.md?context=/azure/synapse-analytics/context/context) article for common issues and solutions.

If you need information not provided in this article, search the [Microsoft Q&A question page for Azure Synapse](/answers/topics/azure-synapse-analytics.html) is a place for you to pose questions to other users and to the Azure Synapse Analytics Product Group.  

We actively monitor this forum to ensure that your questions are answered either by another user or one of us.  If you prefer to ask your questions on Stack Overflow, we also have an [Azure Synapse Analytics Stack Overflow Forum](https://stackoverflow.com/questions/tagged/azure-synapse).

