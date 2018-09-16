---
title: Azure SQL Data Warehouse Release Notes May 2018 | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
author: twounder
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 07/23/2018
ms.author: twounder
ms.reviewer: twounder
---

# What's new in Azure SQL Data Warehouse? May 2018 
Azure SQL Data Warehouse receives improvements continually. This article describes the new features and changes that have been introduced in May 2018. 

## Gen 2 Instances
![alt](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/2528b41b-f09f-45b1-aa65-fc60d562d3bd.png)
Azure SQL Data Warehouse Compute Optimized Gen2 tier sets new performance standards for cloud data warehousing. Customers now get up to five times better query performance, four times more concurrency, and five times higher computing power compared to the current generation. It can now serve 128 concurrent queries from a single cluster, the highest of any cloud data warehousing service.

See the [Turbocharge cloud analytics with Azure SQL Data Warehouse](https://azure.microsoft.com/blog/turbocharge-cloud-analytics-with-azure-sql-data-warehouse/) blog announcement from Rohan Kumar, Corporate Vice President, Azure Data.

## Auto Statistics
Statistics are critical to optimize query plan generation in moderl cost-based optimizers such as the engine in SQL Data Warehouse. When all queries are known in advance, determining what statistics objects need to be created is an achievable task. However, when the system is faced with ad-hoc and random queries which is typical for the data warehousing workloads, system administrators may struggle to predict what statistics need to be created leading to potentially suboptimal query execution plans and longer query response times. One way to mitigate this problem is to create statistics objects on all the table columns in advance. However, that process comes with a penalty as statistics objects need to be maintained during table loading process, causing longer loading times.

SQL Data Warehouse now supports automatic creation of statistics objects providing greater flexibility, productivity, and ease of use for system administrators and developers, while ensuring the system continues to offer quality execution plans and best response times.

To enable or disable automatic statistics creation in SQL Data Warehouse, execute the following statement:
```sql
ALTER DATABASE { database_name } SET { AUTO_CREATE_STATISTICS { OFF | ON } } [;]
```

As a best practice and guidance, we recommend setting `AUTO_CREATE_STATISTICS` option to `ON`.

> [!NOTE]
> Automatic statistic creation is *enabled by default* for all new data warehouses.
>  

See the [ALTER DATABASE SET Options](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-set-options) article for additional details.

## Rejected Row Support
Customers often use [PolyBase (External Tables) to load data](design-elt-data-loading.md) into SQL Data Warehouse because of the high performance, parallel nature of data loading. PolyBase is the default loading model when loading data via [Azure Data Factory](http://azure.com/adf) as well. 

SQL Data Warehouse adds the ability to define a rejected row location via the `REJECTED_ROW_LOCATION` parameter with the [CREATE EXTERNAL TABLE](https://docs.microsoft.com/sql/t-sql/statements/create-external-table-transact-sql) statement. After the execution of a [CREATE TABLE AS SELECT (CTAS)](https://docs.microsoft.com/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse) from the external table, any rows that could not be loaded will be stored in a file near the source for further investigation. 

See the [Load confidently with SQL Data Warehouse PolyBase Rejected Row Location](https://azure.microsoft.com/blog/load-confidently-with-sql-data-warehouse-polybase-rejected-row-location/) blog for more details on the Rejected Row behavior.

The following example shows the new syntax for specifying Rejected Rows.

```sql
CREATE EXTERNAL TABLE [dbo].[Reject_Example]
(
    ...
)
WITH
(
    ...
    ,REJECTED_ROW_LOCATION=‘/Reject_Directory'
)
```

## ALTER VIEW
[ALTER VIEW](https://docs.microsoft.com/sql/t-sql/statements/alter-view-transact-sql) allows a user to modify a previously created view without having to DELETE/CREATE the view and reapply permissions. 

The following example modifies a previously created view.
```sql
ALTER VIEW test_view AS SELECT 1 [data];
```

## CONCAT_WS
The [CONCAT_WS()](https://docs.microsoft.com/sql/t-sql/functions/concat-ws-transact-sql) function returns a string resulting from the concatenation of two or more values in an end-to-end manner. It separates the concatenated values with the delimiter specified in the first argument. The `CONCAT_WS` function is useful for generating Comma-Separated Value (CSV) output.

The following example shows concatenating a set of int values with a comma.
```sql
SELECT CONCAT_WS(',', 1, 2, 3) [result];
```
The statement returns the following result:
```
result
---------
1,2,3
```
The following example shows concatenating a set of mixed data type values with a comma.
```sql
SELECT CONCAT_WS(',', 1, 2, 'String', NEWID()) [result]
```
The statement returns the following result:
```
result
---------
1,2,String,26E1F74D-5746-44DC-B47F-2FC1DA1B6E49
```

## SP_DATATYPE_INFO
The [sp_datatype_info](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-datatype-info-transact-sql) system stored procedure returns information about the data types supported by the current environment. It is commonly used by tools connecting through ODBC connections for data type investigation.

The following example retrieves details for all data types supported by SQL Data Warehouse.

```sql
EXEC sp_datatype_info
```

## SELECT INTO with ORDER BY Behavior Change
SQL Data Warehouse will now block `SELECT INTO` queries that contain an `ORDER BY` clause. Previously, this operation would succeed by first ordering the data in memory and then inserting into the target table reordering the data to match the table shape.

### Previous Behavior
The following statement would succeed with additional processing overhead.
```sql
SELECT * INTO table2 FROM table1 ORDER BY 1;
```

### Current Behavior
The following statement will throw an error indicating the `ORDER BY` clause is not supported in a `SELECT INTO` statement.
```sql
SELECT * INTO table2 FROM table1 ORDER BY 1;
```
The error statement returned:
```
Msg 104381, Level 16, State 1, Line 1
The ORDER BY clause is invalid in views, CREATE TABLE AS SELECT, INSERT SELECT, SELECT INTO, inline functions, derived tables, subqueries, and common table expressions, unless TOP or FOR XML is also specified.
```

## SET PARSEONLY ON query status (Behavior Change)
Using the `SET PARSEONLY ON` syntax allows a user to have the SQL Data Warehouse engine examine the syntax of each T-SQL statement and return any error messages without compiling or executing the statement. Previously, in the [sys.dm_pdw_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql) system view, the status for these statements would remain in the `Running` state. The `sys.dm_pdw_exec_requests` view will now return the status as `Complete`.

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