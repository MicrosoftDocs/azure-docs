---
title: Development best practices for Synapse SQL
description: Recommendations and best practices you should know as you develop for Synapse SQL. 
services: synapse-analytics
author: XiaoyuMSFT
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 04/15/2020
ms.author: xiaoyul
ms.reviewer: igorstan
---

# Development best practices for Synapse SQL
This article describes guidance and best practices as you develop your data warehouse solution. 

## SQL pool development best practices

### Reduce cost with pause and scale

For more information about reducing costs through pausing and scaling, see the [Manage compute](../sql-data-warehouse/sql-data-warehouse-manage-compute-overview.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

### Maintain statistics

Ensure you update your statistics daily or after each load.  There are always trade-offs between performance and the cost to create and update statistics. If you find it is taking too long to maintain all of your statistics, be more selective about which columns have statistics or which columns need frequent updating.  

For example, you might want to update date columns, where new values may be added on a daily basis. 

> [!NOTE]
> You will gain the most benefit by having statistics on columns involved in joins, columns used in the WHERE clause, and columns found in GROUP BY.

See also [Manage table statistics](develop-tables-statistics.md), [CREATE STATISTICS](/sql/t-sql/statements/create-statistics-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), [UPDATE STATISTICS](/sql/t-sql/statements/update-statistics-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest).

### Hash distribute large tables

By default, tables are Round Robin distributed.  This makes it easy for users to start creating tables without having to decide how their tables should be distributed.  Round Robin tables may perform sufficiently for some workloads. But, in most cases, selecting a distribution column will perform much better.  

The most common example of when a table distributed by a column will far outperform a Round Robin table is when two large fact tables are joined.  

For example, if you have an orders table, which is distributed by order_id, and a transactions table, which is also distributed by order_id, when you join your orders table to your transactions table on order_id, this query becomes a pass-through query. 

This means we eliminate data movement operations.  Fewer steps mean a faster query.  Less data movement also makes for faster queries.

> [!TIP]
> When loading a distributed table, be sure that your incoming data is not sorted on the distribution key as this will slow down your loads.  

See the following links for additional details on how selecting a distribution column can improve performance as well as how to define a distributed table in the WITH clause of your CREATE TABLES statement.

See also [Table overview](develop-tables-overview.md), [Table distribution](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json), [Selecting table distribution](https://blogs.msdn.microsoft.com/sqlcat/20../../choosing-hash-distributed-table-vs-round-robin-distributed-table-in-azure-sql-dw-service/), [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), and [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest).

### Do not over-partition
While partitioning data can be effective for maintaining your data through partition switching or optimizing scans by with partition elimination, having too many partitions can slow down your queries.  Often a high granularity partitioning strategy that may work well on SQL Server may not work well on SQL pool.  

> [!NOTE]
> Often a high granularity partitioning strategy that may work well on SQL Server may not work well on SQL pool.  

Having too many partitions can also reduce the effectiveness of clustered columnstore indexes if each partition has fewer than 1 million rows. SQL pool partitions your data for you into 60 databases. 

So, if you create a table with 100 partitions, the result will be 6000 partitions.  Each workload is different so the best advice is to experiment with partitioning to see what works best for your workload.  

One option to consider is using a granularity that is lower than what may have worked for you in SQL Server.  For example, consider using weekly or monthly partitions rather than daily partitions.

See also [Table partitioning](../sql-data-warehouse/sql-data-warehouse-tables-partition.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

### Minimize transaction sizes

INSERT, UPDATE, and DELETE statements run in a transaction and when they fail they must be rolled back.  To minimize the potential for a long rollback, minimize transaction sizes whenever possible.  This can be done by dividing INSERT, UPDATE, and DELETE statements into parts.  

For example, if you have an INSERT that you expect to take 1 hour, you can break up the INSERT into four parts, thereby shortening each run to 15 minutes.

> [!TIP]
> Leverage special Minimal Logging cases, like CTAS, TRUNCATE, DROP TABLE or INSERT to empty tables, to reduce rollback risk.  

Another way to eliminate rollbacks is to use Metadata Only operations like partition switching for data management.  

For example, rather than execute a DELETE statement to delete all rows in a table where the order_date was in October of 2001, you could partition your data monthly and then switch out the partition with data for an empty partition from another table (see ALTER TABLE examples).  

For unpartitioned tables consider using a CTAS to write the data you want to keep in a table rather than using DELETE.  If a CTAS takes the same amount of time, it is a much safer operation to run as it has very minimal transaction logging and can be canceled quickly if needed.

See also [Understanding transactions](develop-transactions.md), [Optimizing transactions](../sql-data-warehouse/sql-data-warehouse-develop-best-practices-transactions.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json), [Table partitioning](../sql-data-warehouse/sql-data-warehouse-tables-partition.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json), [TRUNCATE TABLE](/sql/t-sql/statements/truncate-table-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), [ALTER TABLE](/sql/t-sql/statements/alter-table-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), and [Create table as select (CTAS)](../sql-data-warehouse/sql-data-warehouse-develop-ctas.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

### Use the smallest possible column size

When defining your DDL, using the smallest data type which will support your data will improve query performance.  This is especially important for CHAR and VARCHAR columns.  

If the longest value in a column is 25 characters, then define your column as VARCHAR(25).  Avoid defining all character columns to a large default length.  In addition, define columns as VARCHAR when that is all that is needed rather than use NVARCHAR.

See also [Table overview](develop-tables-overview.md), [Table data types](develop-tables-data-types.md), and [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest).

### Optimize clustered columnstore tables

Clustered columnstore indexes are one of the most efficient ways you can store your data in SQL pool.  By default, tables in SQL pool are created as Clustered ColumnStore.  

To get the best performance for queries on columnstore tables, having good segment quality is important.  When rows are written to columnstore tables under memory pressure, columnstore segment quality may suffer.  

Segment quality can be measured by number of rows in a compressed Row Group.  See the [Causes of poor columnstore index quality](../sql-data-warehouse/sql-data-warehouse-tables-index.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json#causes-of-poor-columnstore-index-quality) and [Table indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) article for step by step instructions on detecting and improving segment quality for clustered columnstore tables.  

Because high-quality columnstore segments are important, it's a good idea to use users IDs which are in the medium or large resource class for loading data. Using lower [data warehouse units](resource-consumption-models.md) means you want to assign a larger resource class to your loading user.

Since columnstore tables generally won't push data into a compressed columnstore segment until there are more than 1 million rows per table, and each SQL pool table is partitioned into 60 tables, columnstore tables won't benefit a query unless the table has more than 60 million rows.  

> [!TIP]
> For tables with less than 60 million rows, having a columnstore index may not be the optimal solution.  

Furthermore, if you partition your data, then you will want to consider that each partition will need to have 1 million rows to benefit from a clustered columnstore index.  If a table has 100 partitions, then it will need to have at least 6 billion rows to benefit from a clustered columns store (60 distributions *100 partitions* 1 million rows).  

If your table does not have 6 billion rows, either reduce the number of partitions or consider using a heap table instead.  It also may be worth experimenting to see if better performance can be gained by using a heap table with secondary indexes rather than a columnstore table.

When querying a columnstore table, queries will run faster if you select only the columns you need.  

See also [Table indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json), [Columnstore indexes guide](/sql/relational-databases/indexes/columnstore-indexes-overview?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), [Rebuilding columnstore indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json#rebuilding-indexes-to-improve-segment-quality).

## SQL on-demand development best practices

### General considerations

SQL on-demand allows you to query files in your Azure storage accounts. It doesn't have local storage or ingestion capabilities, meaning that all files that the query targets are external to SQL on-demand. Therefore, everything related to reading files from storage might have an impact on query performance.

### Colocate Azure Storage account and SQL on-demand

To minimize latency, colocate your Azure storage account and your SQL on-demand endpoint. Storage accounts and endpoints provisioned during workspace creation are located in the same region.

For optimal performance, if you access other storage accounts with SQL on-demand, make sure they are in the same region. Otherwise, there will be increased latency for the data's network transfer from the remote region to the endpoint's region.

### Azure Storage throttling

Multiple applications and services may access your storage account. When the combined IOPS or throughput generated by applications, services, and SQL on-demand workload exceed the limits of the storage account,storage throttling occurs. When storage throttling occurs, there is a substantial negative effect on query performance.

Once throttling is detected, SQL on-demand has built-in handling of this scenario. SQL on-demand will make requests to storage at a slower pace until throttling is resolved. 

However, for optimal query execution, it is advised that you not stress the storage account with other workloads during query execution.

### Prepare files for querying

If possible, you can prepare files for better performance:

- Convert CSV to Parquet – Parquet is columnar format. Since it is compressed, it has smaller file sizes than CSV files with the same data, and SQL on-demand will need less time and storage requests to read it.
- If a query targets a single large file, you will benefit from splitting it to multiple smaller files.
- Try keeping your CSV file size below 10GB.
- It is preferred to have equally sized files for a single OPENROWSET path or an external table LOCATION.
- Partition your data by storing partitions to different folders or file names - check [use filename and filepath functions to target specific partitions](#use-fileinfo-and-filepath-functions-to-target-specific-partitions).

### Use fileinfo and filepath functions to target specific partitions

Data is often organized in partitions. You can instruct SQL on-demand to query particular folders and files. This will reduce the number of files and amount of data the query needs to read and process. 

Consequently, you will achieve better performance. For more information, check [filename](query-data-storage.md#filename-function) and [filepath](query-data-storage.md#filepath-function) functions and examples on how to [query specific files](query-specific-files.md).

If your data in storage is not partitioned, consider partitioning it so you can use these functions to optimize queries targeting those files.

When [querying partitioned Apache Spark for Azure Synapse external tables](develop-storage-files-spark-tables.md) from SQL on-demand, the query will automatically target only files needed.

### Use CETAS to enhance query performance and joins

[CETAS](develop-tables-cetas.md) is one of the most important features available in SQL on-demand. CETAS is a parallel operation that creates external table metadata and exports the result of the SELECT query to a set of files in your storage account.

You can use CETAS to store often used part of queries, like joined reference tables, to a  new set of files. Later on, you can join to this single external table instead of repeating common joins in multiple queries. 

As CETAS generates Parquet files, statistics will be automatically created when the first query targets this external table and you will gain improved performance.

### Next steps

If you need information not provided in this article, use the "Search for docs" on the left side of this page to search all of the SQL pool documents.  The [Microsoft Q&A question page for SQL pool](https://docs.microsoft.com/answers/topics/azure-synapse-analytics.html) is a place for you to pose questions to other users and to the SQL pool Product Group.  

We actively monitor this forum to ensure that your questions are answered either by another user or one of us.  If you prefer to ask your questions on Stack Overflow, we also have an [Azure SQL pool Stack Overflow Forum](https://stackoverflow.com/questions/tagged/azure-sqldw).
 
