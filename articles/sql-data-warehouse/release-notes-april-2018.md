---
title: Azure SQL Data Warehouse Release Notes April 2018 | Microsoft Docs
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

# What's new in Azure SQL Data Warehouse? April 2018
Azure SQL Data Warehouse receives improvements continually. This article describes the new features and changes that have been introduced in April 2018.

## Ability to Truncate a Partition before a Switch
Customers often use partition switching as a pattern to load data from one table to another by changing the metadata of the table through the `ALTER TABLE SourceTable SWITCH PARTITION X TO TargetTable PARTITION X` syntax. SQL Data Warehouse doesn't support partition switching when the target partition contains data. If the target partition already contains data, the customer would need to truncate the target partition and then perform the switch.

SQL Data Warehouse now supports this operation in a single T-SQL statement.

```sql
ALTER TABLE SourceTable 
    SWITCH PARTITION X TO TargetTable PARTITION X
    WITH (TRUNCATE_TARGET_PARTITION = ON)
```
For more information, see the [ALTER TABLE](https://docs.microsoft.com/sql/t-sql/statements/alter-table-transact-sql) article.

## Improved Query Compilation Performance
SQL Data Warehouse introduced a set of changes to improve the query compilation step of distributed queries. These changes improve query compilation times up to **10x** reducing overall query execution runtimes. These changes are more evident on data warehouses with a large number of objects (tables, functions, views, procedures).

## DBCC Commands Do Not Consume Concurrency Slots (Behavior Change)
SQL Data Warehouse supports a subset of the T-SQL [DBCC Commands](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-transact-sql) such as [DBCC DROPCLEANBUFFERS](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-dropcleanbuffers-transact-sql). Previously, these commands would consume a [concurrency slot](https://docs.microsoft.com/azure/sql-data-warehouse/resource-classes-for-workload-management#concurrency-slots) reducing the number of user loads/queries that could be executed. The `DBCC` commands are now run in a local queue that do not consume a resource slot improving overall query execution performance.

## Updated Error Message for Excessive Literals (Behavior Change)
Previously, SQL Data Warehouse would include an *approximate* count when a query contained too many literals.
```
Msg 100086
Cannot have more than 20,000 literals in the query. The query contains [n] literals.
```

The error message has been updated to indicate only that you have hit the literal limit.
```
Msg 100086
The number of literals in the query is beyond the limit. Please rewrite your query.
```

For more information, see the [Queries](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-service-capacity-limits#queries) section of the [Capacity Limits](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-service-capacity-limits) article for additional details on maximum limits.

## Removed the SYS.PDW_DATABASE_MAPPINGS view (Behavior Change)
This `sys.pdw_database_mappings` view is unused in SQL Data Warehouse. Previously, a SELECT of this view would return no results. The view has been removed. 

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