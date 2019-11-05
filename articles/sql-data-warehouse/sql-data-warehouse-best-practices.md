---
title: Best practices for SQL Analytics in Azure Synapse Analytics (formerly SQL DW) | Microsoft Docs
description: Recommendations and best practices for developing solutions for SQL Analytics in Azure Synapse Analytics (formerly SQL DW). 
services: sql-data-warehouse
author: mlee3gsd
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: design
ms.date: 11/04/2019
ms.author: martinle
ms.reviewer: igorstan
---

# Best practices for SQL Analytics in Azure Synapse Analytics (formerly SQL DW)

This article is a collection of best practices to help you to achieve optimal performance from your [SQL Analytics](sql-data-warehouse-overview-what-is.md#sql-analytics-and-sql-pool-in-azure-synapse) deployment.  The purpose of this article is to give you some basic guidance and highlight important areas of focus.  Each section introduces you to a concept and then points you to more detailed articles that cover the concept in more depth. The sequence of topics is in the order of importance. 

## Reduce cost with pause and scale

For more information about reducing costs through pausing and scaling, see the [Manage compute](sql-data-warehouse-manage-compute-overview.md). 

## Maintain statistics
Azure SQL Data Warehouse can be configured to automatically detect and create statistics on columns.  The query plans created by the optimizer are only as good as the available statistics.  We recommend that you enable AUTO_CREATE_STATISTICS for your databases and keep the statistics updated daily or after each load to ensure that statistics on columns used in your queries are always up-to-date. 

If you find it is taking too long to update all of your statistics, you may want to try to be more selective about which columns need frequent statistics updates. For example, you might want to update date columns, where new values may be added, daily. **You will gain the most benefit by having updated statistics on columns involved in joins, columns used in the WHERE clause and columns found in GROUP BY.**

See also [Manage table statistics][Manage table statistics], [CREATE STATISTICS][CREATE STATISTICS], [UPDATE STATISTICS][UPDATE STATISTICS]

## Use DMVs to monitor and optimize your queries
SQL Analytics has several DMVs that can be used to monitor query execution.  The monitoring article below walks through step-by-step instructions on how to look at the details of an executing query.  To quickly find queries in these DMVs, using the LABEL option with your queries can help.

See also [Monitor your workload using DMVs][Monitor your workload using DMVs], [LABEL][LABEL], [OPTION][OPTION], [sys.dm_exec_sessions][sys.dm_exec_sessions], [sys.dm_pdw_exec_requests][sys.dm_pdw_exec_requests], [sys.dm_pdw_request_steps][sys.dm_pdw_request_steps], [sys.dm_pdw_sql_requests][sys.dm_pdw_sql_requests], [sys.dm_pdw_dms_workers], [DBCC PDW_SHOWEXECUTIONPLAN][DBCC PDW_SHOWEXECUTIONPLAN], [sys.dm_pdw_waits][sys.dm_pdw_waits]

## Tune query performance with new product enhancements
- [Performance tuning with materialized views](https://docs.microsoft.com/azure/sql-data-warehouse/performance-tuning-materialized-views)
- [Performance tuning with ordered clustered columnstore index](https://docs.microsoft.com/azure/sql-data-warehouse/performance-tuning-ordered-cci)
- [Performance tuning with result set caching](https://docs.microsoft.com/azure/sql-data-warehouse/performance-tuning-result-set-caching)

## Group INSERT statements into batches
A one-time load to a small table with an INSERT statement or even a periodic reload of a look-up may perform just fine for your needs with a statement like `INSERT INTO MyLookup VALUES (1, 'Type 1')`.  However, if you need to load thousands or millions of rows throughout the day, you might find that singleton INSERTS just can't keep up.  Instead, develop your processes so that they write to a file and another process periodically comes along and loads this file.

See also [INSERT][INSERT]

## Use PolyBase to load and export data quickly

 SQL Analytics supports loading and exporting data through several tools including Azure Data Factory, PolyBase, and BCP.  For small amounts of data where performance isn't critical, any tool may be sufficient for your needs.  However, when you are loading or exporting large volumes of data or fast performance is needed, PolyBase is the best choice.  
 
 PolyBase is designed to leverage the MPP (Massively Parallel Processing) architecture and will load and export data magnitudes faster than any other tool.  PolyBase loads can be run using CTAS or INSERT INTO.  **Using CTAS will minimize transaction logging and the fastest way to load your data.** 
 
  Azure Data Factory also supports PolyBase loads and can achieve similar performance as CTAS.  PolyBase supports a variety of file formats including Gzip files.  **To maximize throughput when using gzip text files, break up files into 60 or more files to maximize parallelism of your load.**  For faster total throughput, consider loading data concurrently.

See also [Load data][Load data], [Guide for using PolyBase][Guide for using PolyBase], [SQL pool loading patterns and strategies][Azure SQL Data Warehouse loading patterns and strategies], [Load Data with Azure Data Factory][Load Data with Azure Data Factory], [Move data with Azure Data Factory][Move data with Azure Data Factory], [CREATE EXTERNAL FILE FORMAT][CREATE EXTERNAL FILE FORMAT], [Create table as select (CTAS)][Create table as select (CTAS)]

## Load then query external tables
While Polybase, also known as external tables, can be the fastest way to load data, it is not optimal for queries. Polybase tables currently only support Azure blob files and Azure Data Lake storage. These files do not have any compute resources backing them.  

As a result, SQL Analytics cannot offload this work and therefore must read the entire file by loading it to tempdb in order to read the data.  Therefore, if you have several queries that will be querying this data, it is better to load this data once and have queries use the local table.

See also [Guide for using PolyBase][Guide for using PolyBase]

## Hash distribute large tables
By default, tables are Round Robin distributed.  This makes it easy for users to get started creating tables without having to decide how their tables should be distributed.  Round Robin tables may perform sufficiently for some workloads, but in most cases selecting a distribution column will perform much better.  The most common example of when a table distributed by a column will far outperform a Round Robin table is when two large fact tables are joined.  

For example, if you have an orders table, which is distributed by order_id, and a transactions table, which is also distributed by order_id, when you join your orders table to your transactions table on order_id, this query becomes a pass-through query, which means we eliminate data movement operations.  Fewer steps mean a faster query.  Less data movement also makes for faster queries.  

When loading a distributed table, be sure that your incoming data is not sorted on the distribution key as this will slow down your loads.  See the below links for more details on how selecting a distribution column can improve performance as well as how to define a distributed table in the WITH clause of your CREATE TABLE statement.

See also [Table overview][Table overview], [Table distribution][Table distribution], [Selecting table distribution][Selecting table distribution], [CREATE TABLE][CREATE TABLE], [CREATE TABLE AS SELECT][CREATE TABLE AS SELECT]

## Do not over-partition
While partitioning data can be effective for maintaining your data through partition switching or optimizing scans by with partition elimination, having too many partitions can slow down your queries.  Often a high granularity partitioning strategy, which may work well on SQL Server may not work well in SQL Analytics.  

Having too many partitions can also reduce the effectiveness of clustered columnstore indexes if each partition has fewer than 1 million rows.  Keep in mind that behind the scenes, SQL Analytics partitions your data for you into 60 databases, so if you create a table with 100 partitions, this actually results in 6000 partitions.  

Each workload is different so the best advice is to experiment with partitioning to see what works best for your workload.  Consider lower granularity than what may have worked for you in SQL Server.  For example, consider using weekly or monthly partitions rather than daily partitions.

See also [Table partitioning][Table partitioning]

## Minimize transaction sizes
INSERT, UPDATE, and DELETE statements run in a transaction and when they fail they must be rolled back.  To minimize the potential for a long rollback, minimize transaction sizes whenever possible.  This can be done by dividing INSERT, UPDATE, and DELETE statements into parts.  

For example, if you have an INSERT that you expect to take 1 hour, if possible, break up the INSERT into four parts, which will each run in 15 minutes.  Leverage special Minimal Logging cases, like CTAS, TRUNCATE, DROP TABLE or INSERT to empty tables, to reduce rollback risk.  

Another way to eliminate rollbacks is to use Metadata Only operations like partition switching for data management.  For example, rather than execute a DELETE statement to delete all rows in a table where the order_date was in October of 2001, you could partition your data monthly and then switch out the partition with data for an empty partition from another table (see ALTER TABLE examples).  

For unpartitioned tables, consider using a CTAS to write the data you want to keep in a table rather than using DELETE.  If a CTAS takes the same amount of time, it is a much safer operation to run as it has minimal transaction logging and can be canceled quickly if needed.

See also [Understanding transactions][Understanding transactions], [Optimizing transactions][Optimizing transactions], [Table partitioning][Table partitioning], [TRUNCATE TABLE][TRUNCATE TABLE], [ALTER TABLE][ALTER TABLE], [Create table as select (CTAS)][Create table as select (CTAS)]

## Reduce query result sizes  
This step helps you avoid client-side issues caused by large query result.  You can edit your query to reduce the number of rows returned. Some query generation tools allow you to add “top N” syntax to each query.  You can also CETAS the query result to a temporary table and then use PolyBase export for the downlevel processing.

## Use the smallest possible column size
When defining your DDL, using the smallest data type that will support your data will improve query performance.  This is especially important for CHAR and VARCHAR columns.  If the longest value in a column is 25 characters, then define your column as VARCHAR(25).  Avoid defining all character columns to a large default length.  In addition, define columns as VARCHAR when that is all that is needed rather than use NVARCHAR.

See also [Table overview][Table overview], [Table data types][Table data types], [CREATE TABLE][CREATE TABLE]

## Use temporary heap tables for transient data
When you are temporarily landing data, you may find that using a heap table will make the overall process faster.  If you are loading data only to stage it before running more transformations, loading the table to heap table will be much faster than loading the data to a clustered columnstore table.  

In addition, loading data to a temp table will also load much faster than loading a table to permanent storage.  Temporary tables start with a "#" and are only accessible by the session that created it, so they may only work in limited scenarios.   Heap tables are defined in the WITH clause of a CREATE TABLE.  If you do use a temporary table, remember to create statistics on that temporary table too.

See also [Temporary tables][Temporary tables], [CREATE TABLE][CREATE TABLE], [CREATE TABLE AS SELECT][CREATE TABLE AS SELECT]

## Optimize clustered columnstore tables
Clustered columnstore indexes are one of the most efficient ways you can store your data in SQL Analytics.  By default, tables in SQL Analytics are created as Clustered ColumnStore.  To get the best performance for queries on columnstore tables, having good segment quality is important.  

When rows are written to columnstore tables under memory pressure, columnstore segment quality may suffer.  Segment quality can be measured by number of rows in a compressed Row Group.  See the [Causes of poor columnstore index quality][Causes of poor columnstore index quality] in the [Table indexes][Table indexes] article for step by step instructions on detecting and improving segment quality for clustered columnstore tables.  

Because high-quality columnstore segments are important, it's a good idea to use users IDs that are in the medium or large resource class for loading data. Using lower [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md) means you want to assign a larger resource class to your loading user.

Since columnstore tables generally won't push data into a compressed columnstore segment until there are more than 1 million rows per table and each SQL Analytics table is partitioned into 60 tables, as a rule of thumb, columnstore tables won't benefit a query unless the table has more than 60 million rows.  For table with less than 60 million rows, it may not make any sense to have a columnstore index.  It also may not hurt.  

Furthermore, if you partition your data, then you will want to consider that each partition will need to have 1 million rows to benefit from a clustered columnstore index.  If a table has 100 partitions, then it will need to have at least 6 billion rows to benefit from a clustered columns store (60 distributions * 100 partitions * 1 million rows).  

If your table does not have 6 billion rows in this example, either reduce the number of partitions or consider using a heap table instead.  It also may be worth experimenting to see if better performance can be gained with a heap table with secondary indexes rather than a columnstore table.

When querying a columnstore table, queries will run faster if you select only the columns you need.  

See also [Table indexes][Table indexes], [Columnstore indexes guide][Columnstore indexes guide], [Rebuilding columnstore indexes][Rebuilding columnstore indexes]

## Use larger resource class to improve query performance
SQL Analytics uses resource groups as a way to allocate memory to queries.  Out of the box, all users are assigned to the small resource class, which grants 100 MB of memory per distribution.  Since there are always 60 distributions and each distribution is given a minimum of 100 MB, system wide the total memory allocation is 6,000 MB, or just under 6 GB.  

Certain queries, like large joins or loads to clustered columnstore tables, will benefit from larger memory allocations.  Some queries, like pure scans, will see no benefit.  On the flip side, utilizing larger resource classes reduces concurrency, so you will want to take this impact into consideration before moving all of your users to a large resource class.

See also [Resource classes for workload management](resource-classes-for-workload-management.md)

## Use Smaller Resource Class to Increase Concurrency
If you are noticing that user queries seem to have a long delay, it could be that your users are running in larger resource classes and are consuming many concurrency slots causing other queries to queue up.  To see if users queries are queued, run `SELECT * FROM sys.dm_pdw_waits` to see if any rows are returned.

See also [Resource classes for workload management](resource-classes-for-workload-management.md), [sys.dm_pdw_waits][sys.dm_pdw_waits]

## Other resources
Also see our [Troubleshooting][Troubleshooting] article for common issues and solutions.

If you didn't find what you are looking for in this article, try using the "Search for docs" on the left side of this page to search all of the Azure Synapse documents.  The [Azure Synapse Forum][Azure SQL Data Warehouse MSDN Forum] is a place for you to ask questions to other users and to the Azure Synapse Product Group. 

We actively monitor this forum to ensure that your questions are answered either by another user or one of us.  If you prefer to ask your questions on Stack Overflow, we also have an [Azure Synapse Stack Overflow Forum][Azure SQL Data Warehouse Stack Overflow Forum].

Finally, please do use the [Azure Synapse Feedback][Azure SQL Data Warehouse Feedback] page to make feature requests.  Adding your requests or up-voting other requests really helps us prioritize features.

<!--Image references-->

<!--Article references-->
[Create a support ticket]: ./sql-data-warehouse-get-started-create-support-ticket.md
[Create table as select (CTAS)]: ./sql-data-warehouse-develop-ctas.md
[Table overview]: ./sql-data-warehouse-tables-overview.md
[Table data types]: ./sql-data-warehouse-tables-data-types.md
[Table distribution]: ./sql-data-warehouse-tables-distribute.md
[Table indexes]: ./sql-data-warehouse-tables-index.md
[Causes of poor columnstore index quality]: ./sql-data-warehouse-tables-index.md#causes-of-poor-columnstore-index-quality
[Rebuilding columnstore indexes]: ./sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality
[Table partitioning]: ./sql-data-warehouse-tables-partition.md
[Manage table statistics]: ./sql-data-warehouse-tables-statistics.md
[Temporary tables]: ./sql-data-warehouse-tables-temporary.md
[Guide for using PolyBase]: ./guidance-for-loading-data.md
[Load data]: ./design-elt-data-loading.md
[Move data with Azure Data Factory]: ../data-factory/transform-data-using-machine-learning.md
[Load data with Azure Data Factory]: ../data-factory/load-azure-sql-data-warehouse.md
[Load data with bcp]: /sql/tools/bcp-utility
[Load data with PolyBase]: ./load-data-wideworldimportersdw.md
[Monitor your workload using DMVs]: ./sql-data-warehouse-manage-monitor.md
[Pause compute resources]: ./sql-data-warehouse-manage-compute-overview.md#pause-compute-bk
[Resume compute resources]: ./sql-data-warehouse-manage-compute-overview.md#resume-compute-bk
[Scale compute resources]: ./sql-data-warehouse-manage-compute-overview.md#scale-compute
[Understanding transactions]: ./sql-data-warehouse-develop-transactions.md
[Optimizing transactions]: ./sql-data-warehouse-develop-best-practices-transactions.md
[Troubleshooting]: ./sql-data-warehouse-troubleshoot.md
[LABEL]: ./sql-data-warehouse-develop-label.md

<!--MSDN references-->
[ALTER TABLE]: https://msdn.microsoft.com/library/ms190273.aspx
[CREATE EXTERNAL FILE FORMAT]: https://msdn.microsoft.com/library/dn935026.aspx
[CREATE STATISTICS]: https://msdn.microsoft.com/library/ms188038.aspx
[CREATE TABLE]: https://msdn.microsoft.com/library/mt203953.aspx
[CREATE TABLE AS SELECT]: https://msdn.microsoft.com/library/mt204041.aspx
[DBCC PDW_SHOWEXECUTIONPLAN]: https://msdn.microsoft.com/library/mt204017.aspx
[INSERT]: https://msdn.microsoft.com/library/ms174335.aspx
[OPTION]: https://msdn.microsoft.com/library/ms190322.aspx
[TRUNCATE TABLE]: https://msdn.microsoft.com/library/ms177570.aspx
[UPDATE STATISTICS]: https://msdn.microsoft.com/library/ms187348.aspx
[sys.dm_exec_sessions]: https://msdn.microsoft.com/library/ms176013.aspx
[sys.dm_pdw_exec_requests]: https://msdn.microsoft.com/library/mt203887.aspx
[sys.dm_pdw_request_steps]: https://msdn.microsoft.com/library/mt203913.aspx
[sys.dm_pdw_sql_requests]: https://msdn.microsoft.com/library/mt203889.aspx
[sys.dm_pdw_dms_workers]: https://msdn.microsoft.com/library/mt203878.aspx
[sys.dm_pdw_waits]: https://msdn.microsoft.com/library/mt203893.aspx
[Columnstore indexes guide]: https://msdn.microsoft.com/library/gg492088.aspx

<!--Other Web references-->
[Selecting table distribution]: https://blogs.msdn.microsoft.com/sqlcat/20../../choosing-hash-distributed-table-vs-round-robin-distributed-table-in-azure-sql-dw-service/
[Azure SQL Data Warehouse Feedback]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[Azure SQL Data Warehouse MSDN Forum]: https://social.msdn.microsoft.com/Forums/sqlserver/home?forum=AzureSQLDataWarehouse
[Azure SQL Data Warehouse Stack Overflow Forum]:  https://stackoverflow.com/questions/tagged/azure-sqldw
[Azure SQL Data Warehouse loading patterns and strategies]: https://blogs.msdn.microsoft.com/sqlcat/20../../azure-sql-data-warehouse-loading-patterns-and-strategies/
