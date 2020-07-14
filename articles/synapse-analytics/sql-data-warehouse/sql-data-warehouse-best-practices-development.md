---
title: Development best practices
description: Recommendations and best practices you should know as you develop solutions for Synapse SQL pool. 
services: synapse-analytics
author: XiaoyuMSFT
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 09/04/2018
ms.author: xiaoyul
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Development best practices for Synapse SQL pool

This article describes guidance and best practices as you develop your SQL pool solution.

## Tune query performance with new product enhancements

- [Performance tuning with materialized views](performance-tuning-materialized-views.md)
- [Performance tuning with ordered clustered columnstore index](performance-tuning-ordered-cci.md)
- [Performance tuning with result set caching](performance-tuning-result-set-caching.md)

## Reduce cost with pause and scale

For more information about reducing costs through pausing and scaling, see the [Manage compute](sql-data-warehouse-manage-compute-overview.md) article.

## Maintain statistics

SQL pool can be configured to automatically detect and create statistics on columns.  The query plans created by the optimizer are only as good as the available statistics.  

We recommend that you enable AUTO_CREATE_STATISTICS for your databases and keep the statistics updated daily or after each load to ensure that statistics on columns used in your queries are always up to date.

If you find it is taking too long to update all of your statistics, you may want to try to be more selective about which columns need frequent statistics updates. For example, you might want to update date columns, where new values may be added, daily.

> [!TIP]
> You will gain the most benefit by having updated statistics on columns involved in joins, columns used in the WHERE clause, and columns found in GROUP BY.

See also [Manage table statistics](sql-data-warehouse-tables-statistics.md), [CREATE STATISTICS](sql-data-warehouse-tables-statistics.md), and [UPDATE STATISTICS](sql-data-warehouse-tables-statistics.md#update-statistics).

## Hash distribute large tables

By default, tables are Round Robin distributed.  This design makes it easy for users to get started creating tables without having to decide how their tables should be distributed.  

Round Robin tables may perform sufficiently for some workloads, but in most cases selecting a distribution column will perform much better.  The most common example of when a table distributed by a column will far outperform a Round Robin table is when two large fact tables are joined.  

For example, if you have an orders table, which is distributed by order_id, and a transactions table, which is also distributed by order_id, when you join your orders table to your transactions table on order_id, this query becomes a pass-through query, which means we eliminate data movement operations.  Fewer steps mean a faster query.  Less data movement also makes for faster queries.  

When loading a distributed table, be sure that your incoming data is not sorted on the distribution key as this will slow down your loads.  The articles that follow give further details on improving performance by selecting a distribution column and how to define a distributed table in the WITH clause of your CREATE TABLES statement.

See also [Table overview](sql-data-warehouse-tables-overview.md), [Table distribution](sql-data-warehouse-tables-distribute.md), [Selecting table distribution](https://blogs.msdn.microsoft.com/sqlcat/20../../choosing-hash-distributed-table-vs-round-robin-distributed-table-in-azure-sql-dw-service/), [CREATE TABLE](sql-data-warehouse-tables-overview.md), and [CREATE TABLE AS SELECT](sql-data-warehouse-develop-ctas.md)

## Do not over-partition

While partitioning data can be effective for maintaining your data through partition switching or optimizing scans by with partition elimination, having too many partitions can slow down your queries.  

Frequently, a high granularity partitioning strategy that may work well on SQL Server may not work well on SQL pool.  Having too many partitions can also reduce the effectiveness of clustered columnstore indexes if each partition has fewer than 1 million rows.  

Keep in mind that behind the scenes, SQL pool partitions your data for you into 60 databases, so if you create a table with 100 partitions, this actually results in 6000 partitions.  Each workload is different so the best advice is to experiment with partitioning to see what works best for your workload.  

> [!TIP]
> Consider using a lower granularity than what may have worked for you in SQL Server.  For example, consider using weekly or monthly partitions rather than daily partitions.

See also [Table partitioning](sql-data-warehouse-tables-partition.md).

## Minimize transaction sizes

INSERT, UPDATE, and DELETE statements run in a transaction and when they fail they must be rolled back.  To minimize the potential for a long rollback, minimize transaction sizes whenever possible.  This can be done by dividing INSERT, UPDATE, and DELETE statements into parts.  

For example, if you have an INSERT, which you expect to take 1 hour, if possible, break up the INSERT into four parts, which will each run in 15 minutes.  Leverage special Minimal Logging cases, like CTAS, TRUNCATE, DROP TABLE, or INSERT to empty tables, to reduce rollback risk.  

Another way to eliminate rollbacks is to use Metadata Only operations like partition switching for data management.  For example, rather than execute a DELETE statement to delete all rows in a table where the order_date was in October of 2001, you could partition your data monthly and then switch out the partition with data for an empty partition from another table (see ALTER TABLE examples).  

For unpartitioned tables, consider using a CTAS to write the data you want to keep in a table rather than using DELETE.  If a CTAS takes the same amount of time, it is a much safer operation to run as it has minimal transaction logging and can be canceled quickly if needed.

See also [Understanding transactions](sql-data-warehouse-develop-transactions.md), [Optimizing transactions](sql-data-warehouse-develop-best-practices-transactions.md), [Table partitioning](sql-data-warehouse-tables-partition.md), [TRUNCATE TABLE](/sql/t-sql/statements/truncate-table-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [ALTER TABLE](/sql/t-sql/statements/alter-table-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), and [Create table as select (CTAS)](sql-data-warehouse-develop-ctas.md).

## Use the smallest possible column size

When defining your DDL, using the smallest data type that will support your data will improve query performance.  This approach is especially important for CHAR and VARCHAR columns.  

If the longest value in a column is 25 characters, then define your column as VARCHAR(25).  Avoid defining all character columns to a large default length.  In addition, define columns as VARCHAR when that is all that is needed rather than use NVARCHAR.

See also [Table overview](sql-data-warehouse-tables-overview.md), [Table data types](sql-data-warehouse-tables-data-types.md), and [CREATE TABLE](sql-data-warehouse-tables-overview.md).

## Optimize clustered columnstore tables

Clustered columnstore indexes are one of the most efficient ways you can store your data in SQL pool.  By default, tables in SQL pool are created as Clustered ColumnStore.  

> [!NOTE]
> To achieve optimal performance for queries on columnstore tables, having good segment quality is important.  

When rows are written to columnstore tables under memory pressure, columnstore segment quality may suffer.  Segment quality can be measured by number of rows in a compressed Row Group.  

See the [Causes of poor columnstore index quality](sql-data-warehouse-tables-index.md#causes-of-poor-columnstore-index-quality) in the [Table indexes](sql-data-warehouse-tables-index.md) article for step-by-step instructions on detecting and improving segment quality for clustered columnstore tables.  

Because high-quality columnstore segments are important, it's a good idea to use users IDs that are in the medium or large resource class for loading data. Using lower [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md) means you want to assign a larger resource class to your loading user.

Since columnstore tables generally won't push data into a compressed columnstore segment until there are more than 1 million rows per table and each SQL pool table is partitioned into 60 tables, generally, columnstore tables won't benefit a query unless the table has more than 60 million rows.  

For a table with less than 60 million rows, it may not make any sense to have a columnstore index.  It also may not hurt.  

Furthermore, if you partition your data, then you will want to consider that each partition will need to have 1 million rows to benefit from a clustered columnstore index.  If a table has 100 partitions, then it will need to have at least 6 billion rows to benefit from a clustered columns store (60 distributions *100 partitions* 1 million rows).  

If your table does not have 6 billion rows in this example, either reduce the number of partitions or consider using a heap table instead.  It also may be worth experimenting to see if better performance can be gained with a heap table with secondary indexes rather than a columnstore table.

> [!TIP]
> When querying a columnstore table, queries will run faster if you select only the columns you need.  

See also [Table indexes](sql-data-warehouse-tables-index.md), [Columnstore indexes guide](/sql/relational-databases/indexes/columnstore-indexes-overview?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), and [Rebuilding columnstore indexes](sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality).

## Next steps

If you don't find what you are looking for in this article, try using the "Search for docs" on the left side of this page to search all of the Azure Synapse documents.  

The [Microsoft Q&A question page for Azure Synapse](https://docs.microsoft.com/answers/topics/azure-synapse-analytics.html) is a place for you to post questions to other users and to the Azure Synapse Product Group.  We actively monitor this forum to ensure that your questions are answered either by another user or one of us.  

If you prefer to ask your questions on Stack Overflow, we also have an [Azure SQL Data Warehouse Stack Overflow Forum](https://stackoverflow.com/questions/tagged/azure-sqldw).

Use the [Azure Synapse Feedback](https://feedback.azure.com/forums/307516-sql-data-warehouse) page to make feature requests.  Adding your requests or up-voting other requests really helps us prioritize features.
