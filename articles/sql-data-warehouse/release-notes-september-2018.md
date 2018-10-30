---
title: Azure SQL Data Warehouse Release Notes RSe 2018 | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
author: twounder
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 10/08/2018
ms.author: mausher
ms.reviewer: twounder
---

# What's new in Azure SQL Data Warehouse? September 2018
Azure SQL Data Warehouse receives improvements continually. This article describes the new features and changes that have been introduced in September 2018.

## New lower entry point for SQL Data Warehouse Gen2
In April 2018, [Microsoft annouced](https://azure.microsoft.com/blog/turbocharge-cloud-analytics-with-azure-sql-data-warehouse/) Azure SQL Data Warehouse Gen2 that offers 5x the performance, 5x the compute scale, 4x the concurrency, and unlimited storage. As noted in the [Data Warehouse in the cloud Benchmark](https://gigaom.com/report/data-warehouse-in-the-cloud-benchmark/) by Gigaom, SQL Data Warehouse Gen2 **outperforms Amazon Redshift by 42%**.

Gen2 is now generally available at a lower entry point of DWU500c allowing you to run a smaller sized data warehouse or dev/test environments with all of the latest service improvements. The new entry point retains all of the Gen2 features including [Adaptive Caching](https://azure.microsoft.com/blog/adaptive-caching-powers-azure-sql-data-warehouse-performance-gains/), [Lighting Fast Data Shuffling](https://azure.microsoft.com/blog/lightning-fast-query-performance-with-azure-sql-data-warehouse/), and support for [real-time data warehouse](https://azure.microsoft.com/blog/enabling-real-time-data-warehousing-with-azure-sql-data-warehouse/).

## Improved availability with query restartability
During query execution, any number of issues can occur that can cause a query to fail. A network outage, a hardware failure, or other disconnection can cause a disruption. SQL Data Warehouse now supports query restartability for step or statement-level SELECT queries. 

With Query Restartability, a query that is in flight that is disrupted due to a failure will automatically restart. Depending on the number of steps, the shape of the query, or where the query was halted during execution, the SQL Data Warehouse engine will either restart the full query or will resume from the last completed query step. From an end user viewpoint, the query just completes. 

## Maintenance Scheduling (Preview)
Azure SQL Data Warehouse Maintenance Scheduling is now in preview. This new feature seamlessly integrates the Service Health Planned Maintenance Notifications, Resource Health Check Monitor, and the Azure SQL Data Warehouse maintenance scheduling service. Maintenance scheduling lets you schedule a time window when it is convenient to receive new features, upgrades, and patches.

Maintenance Scheduling takes advantage of the Azure Monitor and allows customers to determine how they wish to be notified of impending maintenance events and which automated flows should be triggered to manage downtime and minimize the impact to their operations. The notifications can include an email or text. 

## Wide row support in Polybase
When loading data into SQL Data Warehouse, the general guidance is to use [PolyBase](https://docs.microsoft.com/azure/sql-data-warehouse/design-elt-data-loading#options-for-loading-with-polybase) with is support for parallel data loading. This release enables support for wider columns from 32K to 1MB - allowing you to load tables with wide row size. The support for wide rows simplifies the data loading process for tables with wide rows.

> [!Note]
> The total row size can't exceed 1 MB in size.

## Additional language support
This release introduces support for the following T-SQL language elements:

### STRING_SPLIT
The [STRING_SPLIT](https://docs.microsoft.com/sql/t-sql/functions/string-split-transact-sql) function splits a character string using the specified separator. STRING_SPLIT is useful in data loading scenarios where a column may have multiple values to parse and insert into another table.

#### Example
```sql
DECLARE @tags NVARCHAR(400) = 'clothing,road,,touring,bike';

SELECT
	value
FROM
	STRING_SPLIT(@tags, ',')
WHERE
	RTRIM(value) <> '';
```

### COMPRESS/DECOMPRESS Functions
The [COMPRESS](https://docs.microsoft.com/sql/t-sql/functions/compress-transact-sql) / [DECOMPRESS](https://docs.microsoft.com/sql/t-sql/functions/decompress-transact-sql) functions allow you to compress or decompress a string input using the GZIP algorithm.

#### Example

```sql
SELECT
	name [name_original]
	, COMPRESS(name) [name_compressed]
	, CAST(DECOMPRESS(COMPRESS(name)) AS NVARCHAR(MAX)) [name_decompressed]
FROM
	sys.objects;
```

### IF EXISTS clause for dropping views
The addition of the IF EXISTS clause in the [DROP VIEW](https://docs.microsoft.com/sql/t-sql/statements/drop-view-transact-sql) statement simplifies the T-SQL code required to remove a view from the data warehouse. The IF EXISTS syntax, when applied to a DROP VIEW statement will drop the view if it exists or will ignore the statement if the view does not exist.

#### Example
```sql
DROP VIEW IF EXISTS dbo.TestView;
```
```
Message
--------------------------------------------------
Commands completed successfully.

```

## Improved compilation time for Singleton Inserts and DDL Statements 
Following a traditional Extract, Transform, and Load (ETL) model for data insertion often leads to running a singleton-insert ([INSERT-VALUES](https://docs.microsoft.com/sql/t-sql/statements/insert-transact-sql)) into a table in the database. This release improves the performance of singleton-insert operations by reducing the compilation time required to execute this type of statement. In some cases, the observed compilation improvement is up to 3x faster. This improvement will decrease the time required to execute a singleton-insert statement. 

The improvement also benefits data warehouses with a large number of objects by similarly reducing the query compilation time for Data Definition Language (DDL) statements including CREATE, ALTER, and DELETE operations. 

Finally, the improvement reduces the overall execution of statements that execute over wide tables - tables that have a large number of columns. The improvement is a reduction in time in the query compilation step that reduces the overall execution time for queries.

## Bug fixes

| Title | Description |
|:---|:---|
| **Fix when creating statistics on distributions for unique constraints** | This fix addresses an error that users encounter when running UPDATE STATISTICS with only the Table specified, when the table had a unique constraint defined. |
| **Fix when compiling queries over external tables** | This fix addresses a defect that affected compilation time for queries involving external tables.|
| **Fix when executing a statement with large types** | Address a defect in prepared statement compilation with parameters declared as one of the *large* types (nvarchar(max), varchar(max), and varbinary(max)). |
| **Fix when an error occurs for deeply nested queries** | Provides a clear error message when a deeply nested query exceeds system limits.|
| **Fix for compile-time errors when a statement contains a correlated subquery and an execution time constant** |Addresses compile-time error for queries with a particular combination of correlated subqueries and execution-time constants (like GETDATE()).|
| **Address Timeout for acquiring PDW object locks and concurrency slot for autostats** |Fix adds lock timeout to prevent autostats requests from blocking the originating requests for a long time.|

## Next steps
Now that you know a bit about SQL Data Warehouse, learn how to quickly [create a SQL Data Warehouse][create a SQL Data Warehouse]. If you are new to Azure, you may find the [Azure glossary][Azure glossary] helpful as you encounter new terminology. Or look at some of these other SQL Data Warehouse Resources.  

* [Customer success stories]
* [Blogs]
* [Feature requests]
* [Videos]
* [Customer Advisory Team blogs]
* [Stack Overflow forum]
* [Twitter]


[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[Customer Advisory Team blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Customer success stories]: https://azure.microsoft.com/case-studies/?service=sql-data-warehouse
[Feature requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[Stack Overflow forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
[create a SQL Data Warehouse]: ./create-data-warehouse-portal.md
[Azure glossary]: ../azure-glossary-cloud-terminology.md
