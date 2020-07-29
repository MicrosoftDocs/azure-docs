---
title: Best practices for SQL pools
description: Recommendations and best practices you should know as you work with SQL pools. 
services: synapse-analytics
author: mlee3gsd
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 04/15/2020
ms.author: martinle
ms.reviewer: igorstan
---

# Best practices for SQL pools in Azure Synapse Analytics

This article provides a collection of best practices to help you achieve optimal performance for SQL pools in Azure Synapse Analytics. Below you'll find basic guidance and important areas to focus on as you build your solution. Each section introduces you to a concept and then points you to more detailed articles that cover the concept in more depth.

## SQL pools loading

For SQL pools loading guidance, see [Guidance for loading data](data-loading-best-practices.md).

## Reduce cost with pause and scale

For more information about reducing costs through pausing and scaling, see [Manage compute](../sql-data-warehouse/sql-data-warehouse-manage-compute-overview.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

## Maintain statistics

While SQL Server automatically detects and creates or updates statistics on columns, SQL pools require manual maintenance of statistics. You'll want to maintain your statistics to ensure that the SQL pool plans are optimized.  The plans created by the optimizer are only as good as the available statistics.

> [!TIP]
> Creating sampled statistics on every column is an easy way to get started with statistics.  

It's equally important to update statistics as significant changes happen to your data.  A conservative approach may be to update your statistics daily or after each load.  There are always trade-offs between performance and the cost to create and update statistics.

To shorten statistics maintenance time, be selective about which columns have statistics, or need the most frequent updating. For example, you might want to update date columns where new values may be added daily. Focus on having statistics for columns involved in joins, columns used in the WHERE clause, and columns found in GROUP BY.

Additional information on statistics can be found in the [Manage table statistics](develop-tables-statistics.md), [CREATE STATISTICS](/sql/t-sql/statements/create-statistics-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), and [UPDATE STATISTICS](/sql/t-sql/statements/update-statistics-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) articles.

## Group INSERT statements into batches

A one-time load to a small table with an INSERT statement such as `INSERT INTO MyLookup VALUES (1, 'Type 1')`may be the best approach depending on your needs. However, if you need to load thousands or millions of rows throughout the day, it's likely that singleton INSERTS aren't optimal.

One way to solve this issue is to develop one process that writes to a file, and then another process to periodically load this file. Refer to the [INSERT](/sql/t-sql/statements/insert-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) article for more information.

## Use PolyBase to load and export data quickly

SQL pool supports loading and exporting data through several tools including Azure Data Factory, PolyBase, and BCP.  For small amounts of data where performance isn't critical, any tool may be sufficient for your needs.  

> [!NOTE]
> Polybase is the best choice when you are loading or exporting large volumes of data, or you need faster performance.

PolyBase loads can be run using CTAS or INSERT INTO. CTAS will minimize transaction logging and is the fastest way to load your data. Azure Data Factory also supports PolyBase loads and can achieve performance similar to CTAS. PolyBase supports various file formats including Gzip files.

To maximize throughput when using Gzip text files, break up files into 60 or more files to maximize parallelism of your load. For faster total throughput, consider loading data concurrently. Additional information for the topics relevant to this section is included in the following articles:

- [Load data](../sql-data-warehouse/design-elt-data-loading.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
- [Guide for using PolyBase](data-loading-best-practices.md)
- [Azure SQL pool loading patterns and strategies](https://blogs.msdn.microsoft.com/sqlcat/20../../azure-sql-data-warehouse-loading-patterns-and-strategies/)
- [Load Data with Azure Data Factory](../../data-factory/load-azure-sql-data-warehouse.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
- [Move data with Azure Data Factory](../../data-factory/transform-data-using-machine-learning.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
- [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [Create table as select (CTAS)](../sql-data-warehouse/sql-data-warehouse-develop-ctas.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)

## Load then query external tables

Polybase isn't optimal for queries. Polybase tables for SQL pools currently only support Azure blob files and Azure Data Lake storage. These files don't have any compute resources backing them. As a result, SQL pools can't offload this work and must read the entire file by loading it to tempdb so it can read the data.

If you have several queries for querying this data, it's better to load this data once and have queries use the local table. Further Polybase guidance is included in the  [Guide for using PolyBase](data-loading-best-practices.md) article.

## Hash distribute large tables

By default, tables are Round Robin distributed.   This default makes it easy for users to start creating tables without having to decide how their tables should be distributed. Round Robin tables may perform sufficiently for some workloads. But, in most cases, a distribution column provides better performance.  

The most common example of a table distributed by a column outperforming a Round Robin table is when two large fact tables are joined.  

For example, if you have an orders table distributed by order_id, and a transactions table also distributed by order_id, when you join your orders table to your transactions table on order_id, this query becomes a pass-through query. Data movement operations are then eliminated. Fewer steps mean a faster query. Less data movement also makes for faster queries.

> [!NOTE]
> When loading a distributed table, your incoming data shouldn't be sorted on the distribution key. Doing so will slow down your loads.

The article links provided below will give you additional details about improving performance via selecting a distribution column. Also, you'll find information about how to define a distributed table in the WITH clause of your CREATE TABLE statement:

- [Table overview](develop-tables-overview.md)
- [Table distribution](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
- [Selecting table distribution](https://blogs.msdn.microsoft.com/sqlcat/20../../choosing-hash-distributed-table-vs-round-robin-distributed-table-in-azure-sql-dw-service/)
- [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)

## Do not over-partition

While partitioning data can be effective for maintaining your data through partition switching or optimizing scans by with partition elimination, having too many partitions can slow down your queries.  Often a high granularity partitioning strategy that may work well on SQL Server may not work well on SQL pool.  

Having too many partitions can reduce the effectiveness of clustered columnstore indexes if each partition has fewer than 1 million rows. SQL pools automatically partition your data into 60 databases. So, if you create a table with 100 partitions, the result will be 6000 partitions. Each workload is different, so the best advice is to experiment with partitioning to see what works best for your workload.  

One option to consider is using a granularity that is lower than what you've implemented using SQL Server. For example, consider using weekly or monthly partitions instead of daily partitions.

More information about partitioning is detailed in the [Table partitioning](../sql-data-warehouse/sql-data-warehouse-tables-partition.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) article.

## Minimize transaction sizes

INSERT, UPDATE, and DELETE statements run in a transaction. When they fail, they must be rolled back. To reduce the potential for a long rollback, minimize transaction sizes whenever possible.  Minimizing transaction sizes can be done by dividing INSERT, UPDATE, and DELETE statements into parts. For example, if you have an INSERT that you expect to take 1 hour, you can break up the INSERT into four parts. Each run will then be shortened to 15 minutes.  

> [!TIP]
> Leverage special Minimal Logging cases, like CTAS, TRUNCATE, DROP TABLE, or INSERT to empty tables to reduce rollback risk.  

Another way to eliminate rollbacks is to use Metadata Only operations like partition switching for data management.  For example, rather than execute a DELETE statement to delete all rows in a table where the order_date was in October of 2001, you could partition your data monthly. Then you can switch out the partition with data for an empty partition from another table (see ALTER TABLE examples).  

For unpartitioned tables, consider using a CTAS to write the data you want to keep in a table rather than using DELETE.  If a CTAS takes the same amount of time, it's much safer to run since it has minimal transaction logging and can be canceled quickly if needed.

Further information on content related to this section is included in the articles below:

- [Create table as select (CTAS)](../sql-data-warehouse/sql-data-warehouse-develop-ctas.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
- [Understanding transactions](develop-transactions.md)
- [Optimizing transactions](../sql-data-warehouse/sql-data-warehouse-develop-best-practices-transactions.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
- [Table partitioning](../sql-data-warehouse/sql-data-warehouse-tables-partition.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
- [TRUNCATE TABLE](/sql/t-sql/statements/truncate-table-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [ALTER TABLE](/sql/t-sql/statements/alter-table-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)

## Reduce query result sizes

Reducing query results sizes helps you avoid client-side issues caused by large query results.  You can edit your query to reduce the number of rows returned. Some query generation tools allow you to add "top N" syntax to each query.  You can also CETAS the query result to a temporary table and then use PolyBase export for the downlevel processing.

## Use the smallest possible column size

When defining your DDL, use the smallest data type that will support your data as doing so will improve query performance.  This recommendation is particularly important for CHAR and VARCHAR columns.  If the longest value in a column is 25 characters, then define your column as VARCHAR(25).  Avoid defining all character columns to a large default length.  Additionally, define columns as VARCHAR when that is all that is needed rather than using NVARCHAR.

Please see the [Table overview](develop-tables-overview.md), [Table data types](develop-tables-data-types.md), and [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) articles for a more detailed review of essential concepts relevant to the above information.

## Use temporary heap tables for transient data

When you're temporarily landing data on SQL pools, heap tables will generally make the overall process faster.  If you're loading data only to stage it before running more transformations, loading the table to a heap table will be quicker than loading the data to a clustered columnstore table.  

Loading data to a temp table will also load much faster than loading a table to permanent storage.  Temporary tables start with a "#" and are only accessible by the session that created it. Consequently, they may only work in limited scenarios. Heap tables are defined in the WITH clause of a CREATE TABLE.  If you do use a temporary table, remember to create statistics on that temporary table too.

For additional guidance, refer to the [Temporary tables](/sql/t-sql/statements/alter-table-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), and [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) articles.

## Optimize clustered columnstore tables

Clustered columnstore indexes are one of the most efficient ways you can store your data in SQL pool.  By default, tables in SQL pool are created as Clustered ColumnStore.  To get the best performance for queries on columnstore tables, having good segment quality is important.  When rows are written to columnstore tables under memory pressure, columnstore segment quality may suffer.  

Segment quality can be measured by the number of rows in a compressed Row Group. See the [Causes of poor columnstore index quality](../sql-data-warehouse/sql-data-warehouse-tables-index.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json#causes-of-poor-columnstore-index-quality) in the [Table indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) article for step-by-step instructions on detecting and improving segment quality for clustered columnstore tables.  

Because high-quality columnstore segments are important, it's a good idea to use users IDs that are in the medium or large resource class for loading data. Using lower [data warehouse units](resource-consumption-models.md) means you want to assign a larger resource class to your loading user.

Columnstore tables generally won't push data into a compressed columnstore segment until there are more than 1 million rows per table. Each SQL pool table is partitioned into 60 tables. As such, columnstore tables won't benefit a query unless the table has more than 60 million rows.  

> [!TIP]
> For tables with less than 60 million rows, having a columnstore index may not be the optimal solution.  

If you partition your data, each partition will need to have 1 million rows to benefit from a clustered columnstore index.  For a table with 100 partitions, it needs to have at least 6 billion rows to benefit from a clustered columns store (60 distributions *100 partitions* 1 million rows).  

If your table doesn't have 6 billion rows, you have two main options. Either reduce the number of partitions or consider using a heap table instead.  It also may be worth experimenting to see if better performance can be gained by using a heap table with secondary indexes rather than a columnstore table.

When querying a columnstore table, queries will run faster if you select only the columns you need.  More information on table and columnstore indexes and can be found within the [Table indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json), [Columnstore indexes guide](/sql/relational-databases/indexes/columnstore-indexes-overview?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), and [Rebuilding columnstore indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest#rebuilding-indexes-to-improve-segment-quality) articles.

## Use larger resource class to improve query performance

SQL pools use resource groups as a way to allocate memory to queries. Initially, all users are assigned to the small resource class, which grants 100 MB of memory per distribution.  There are always 60 distributions. Each distribution is given a minimum of 100 MB. The total system-wide memory allocation is 6,000 MB, or just under 6 GB.  

Certain queries, like large joins or loads to clustered columnstore tables, will benefit from larger memory allocations.  Some queries, such as pure scans, will see no benefit. Utilizing larger resource classes impacts concurrency. So, you'll want to keep these facts in mind before moving all of your users to a large resource class.

For additional information on resource classes, refer to the [Resource classes for workload management](../sql-data-warehouse/resource-classes-for-workload-management.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) article.

## Use smaller resource class to increase concurrency

If you notice a long delay in user queries, your users might be running in larger resource classes. This scenario promotes the consumption of concurrency slots, which can cause other queries to queue up.  To determine if users queries are queued, run `SELECT * FROM sys.dm_pdw_waits` to see if any rows are returned.

The [Resource classes for workload management](../sql-data-warehouse/resource-classes-for-workload-management.md) and [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) articles will provide you with more information.

## Use DMVs to monitor and optimize your queries

SQL pools have several DMVs that can be used to monitor query execution.  The monitoring article below walks you through step-by-step instructions on how to view details of an executing query.  To quickly find queries in these DMVs, using the LABEL option with your queries can help. For additional detailed information, please see the articles included in the list below:

- [Monitor your workload using DMVs](../sql-data-warehouse/sql-data-warehouse-manage-monitor.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)

- [LABEL](develop-label.md)
- [OPTION](/sql/t-sql/queries/option-clause-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [sys.dm_exec_sessions](/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sessions-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [sys.dm_pdw_request_steps](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [sys.dm_pdw_sql_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-sql-requests-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [sys.dm_pdw_dms_workers](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-dms-workers-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [DBCC PDW_SHOWEXECUTIONPLAN](/sql/t-sql/database-console-commands/dbcc-pdw-showexecutionplan-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [sys.dm_pdw_waits](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-waits-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)

## Next steps

Also see the [Troubleshooting](../sql-data-warehouse/sql-data-warehouse-troubleshoot.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) article for common issues and solutions.

If you need information not provided in this article, search the [Microsoft Q&A question page for Azure Synapse](https://docs.microsoft.com/answers/topics/azure-synapse-analytics.html) is a place for you to pose questions to other users and to the SQL pool Product Group.  

We actively monitor this forum to ensure that your questions are answered either by another user or one of us.  If you prefer to ask your questions on Stack Overflow, we also have an [Azure SQL pool Stack Overflow Forum](https://stackoverflow.com/questions/tagged/azure-sqldw).

For feature requests, use the [Azure SQL pool Feedback](https://feedback.azure.com/forums/307516-sql-data-warehouse) page.  Adding your requests or up-voting other requests helps us to focus on the most in-demand features.
