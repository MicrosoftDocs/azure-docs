---
title: Development best practices for Azure SQL Data Warehouse | Microsoft Docs
description: Recommendations and best practices you should know as you develop solutions for Azure SQL Data Warehouse. 
services: sql-data-warehouse
author: XiaoyuL-Preview
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: development
ms.date: 09/04/2018
ms.author: xiaoyul
ms.reviewer: igorstan
---

# Development best practices for Azure SQL Data Warehouse
This article describes guidance and best practices as you develop your data warehouse solution. 

## Reduce cost with pause and scale
For more information about reducing costs through pausing and scaling, see the [Manage compute](sql-data-warehouse-manage-compute-overview.md). 


## Maintain statistics
Ensure you update your statistics daily or after each load.  There are always trade-offs between performance and the cost to create and update statistics. If you find it is taking too long to maintain all of your statistics, you may want to try to be more selective about which columns have statistics or which columns need frequent updating.  For example, you might want to update date columns, where new values may be added, daily. **You will gain the most benefit by having statistics on columns involved in joins, columns used in the WHERE clause and columns found in GROUP BY.**

See also [Manage table statistics][Manage table statistics], [CREATE STATISTICS][CREATE STATISTICS], [UPDATE STATISTICS][UPDATE STATISTICS]

## Hash distribute large tables
By default, tables are Round Robin distributed.  This makes it easy for users to get started creating tables without having to decide how their tables should be distributed.  Round Robin tables may perform sufficiently for some workloads, but in most cases selecting a distribution column will perform much better.  The most common example of when a table distributed by a column will far outperform a Round Robin table is when two large fact tables are joined.  For example, if you have an orders table, which is distributed by order_id, and a transactions table, which is also distributed by order_id, when you join your orders table to your transactions table on order_id, this query becomes a pass-through query, which means we eliminate data movement operations.  Fewer steps mean a faster query.  Less data movement also makes for faster queries.  This explanation only scratches the surface. When loading a distributed table, be sure that your incoming data is not sorted on the distribution key as this will slow down your loads.  See the below links for much more details on how selecting a distribution column can improve performance as well as how to define a distributed table in the WITH clause of your CREATE TABLES statement.

See also [Table overview][Table overview], [Table distribution][Table distribution], [Selecting table distribution][Selecting table distribution], [CREATE TABLE][CREATE TABLE], [CREATE TABLE AS SELECT][CREATE TABLE AS SELECT]

## Do not over-partition
While partitioning data can be very effective for maintaining your data through partition switching or optimizing scans by with partition elimination, having too many partitions can slow down your queries.  Often a high granularity partitioning strategy which may work well on SQL Server may not work well on SQL Data Warehouse.  Having too many partitions can also reduce the effectiveness of clustered columnstore indexes if each partition has fewer than 1 million rows.  Keep in mind that behind the scenes, SQL Data Warehouse partitions your data for you into 60 databases, so if you create a table with 100 partitions, this actually results in 6000 partitions.  Each workload is different so the best advice is to experiment with partitioning to see what works best for your workload.  Consider lower granularity than what may have worked for you in SQL Server.  For example, consider using weekly or monthly partitions rather than daily partitions.

See also [Table partitioning][Table partitioning]

## Minimize transaction sizes
INSERT, UPDATE, and DELETE statements run in a transaction and when they fail they must be rolled back.  To minimize the potential for a long rollback, minimize transaction sizes whenever possible.  This can be done by dividing INSERT, UPDATE, and DELETE statements into parts.  For example, if you have an INSERT which you expect to take 1 hour, if possible, break the INSERT up into 4 parts, which will each run in 15 minutes.  Leverage special Minimal Logging cases, like CTAS, TRUNCATE, DROP TABLE or INSERT to empty tables, to reduce rollback risk.  Another way to eliminate rollbacks is to use Metadata Only operations like partition switching for data management.  For example, rather than execute a DELETE statement to delete all rows in a table where the order_date was in October of 2001, you could partition your data monthly and then switch out the partition with data for an empty partition from another table (see ALTER TABLE examples).  For unpartitioned tables consider using a CTAS to write the data you want to keep in a table rather than using DELETE.  If a CTAS takes the same amount of time, it is a much safer operation to run as it has very minimal transaction logging and can be canceled quickly if needed.

See also [Understanding transactions][Understanding transactions], [Optimizing transactions][Optimizing transactions], [Table partitioning][Table partitioning], [TRUNCATE TABLE][TRUNCATE TABLE], [ALTER TABLE][ALTER TABLE], [Create table as select (CTAS)][Create table as select (CTAS)]

## Use the smallest possible column size
When defining your DDL, using the smallest data type which will support your data will improve query performance.  This is especially important for CHAR and VARCHAR columns.  If the longest value in a column is 25 characters, then define your column as VARCHAR(25).  Avoid defining all character columns to a large default length.  In addition, define columns as VARCHAR when that is all that is needed rather than use NVARCHAR.

See also [Table overview][Table overview], [Table data types][Table data types], [CREATE TABLE][CREATE TABLE]

## Optimize clustered columnstore tables
Clustered columnstore indexes are one of the most efficient ways you can store your data in SQL Data Warehouse.  By default, tables in SQL Data Warehouse are created as Clustered ColumnStore.  To get the best performance for queries on columnstore tables, having good segment quality is important.  When rows are written to columnstore tables under memory pressure, columnstore segment quality may suffer.  Segment quality can be measured by number of rows in a compressed Row Group.  See the [Causes of poor columnstore index quality][Causes of poor columnstore index quality] in the [Table indexes][Table indexes] article for step by step instructions on detecting and improving segment quality for clustered columnstore tables.  Because high-quality columnstore segments are important, it's a good idea to use users IDs which are in the medium or large resource class for loading data. Using lower [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md) means you want to assign a larger resource class to your loading user.

Since columnstore tables generally won't push data into a compressed columnstore segment until there are more than 1 million rows per table and each SQL Data Warehouse table is partitioned into 60 tables, as a rule of thumb, columnstore tables won't benefit a query unless the table has more than 60 million rows.  For table with less than 60 million rows, it may not make any sense to have a columnstore index.  It also may not hurt.  Furthermore, if you partition your data, then you will want to consider that each partition will need to have 1 million rows to benefit from a clustered columnstore index.  If a table has 100 partitions, then it will need to have at least 6 billion rows to benefit from a clustered columns store (60 distributions * 100 partitions * 1 million rows).  If your table does not have 6 billion rows in this example, either reduce the number of partitions or consider using a heap table instead.  It also may be worth experimenting to see if better performance can be gained with a heap table with secondary indexes rather than a columnstore table.

When querying a columnstore table, queries will run faster if you select only the columns you need.  

See also [Table indexes][Table indexes], [Columnstore indexes guide][Columnstore indexes guide], [Rebuilding columnstore indexes][Rebuilding columnstore indexes]

## Next steps
If you didn't find what you were looking for in this article, try using the "Search for docs" on the left side of this page to search all of the Azure SQL Data Warehouse documents.  The [Azure SQL Data Warehouse Forum][Azure SQL Data Warehouse MSDN Forum] is a place for you to ask questions to other users and to the SQL Data Warehouse Product Group.  We actively monitor this forum to ensure that your questions are answered either by another user or one of us.  If you prefer to ask your questions on Stack Overflow, we also have an [Azure SQL Data Warehouse Stack Overflow Forum][Azure SQL Data Warehouse Stack Overflow Forum].

Finally, please do use the [Azure SQL Data Warehouse Feedback][Azure SQL Data Warehouse Feedback] page to make feature requests.  Adding your requests or up-voting other requests really helps us prioritize features.

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
