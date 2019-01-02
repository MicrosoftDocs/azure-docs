---
title: Using T-SQL views in Azure SQL Data Warehouse | Microsoft Docs
description: Tips for using T-SQL views in Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 04/17/2018
ms.author: rortloff
ms.reviewer: igorstan
---

# Views in Azure SQL Data Warehouse
Tips for using T-SQL views in Azure SQL Data Warehouse for developing solutions. 

## Why use views?
Views can be used in a number of different ways to improve the quality of your solution.  This article highlights a few examples of how to enrich your solution with views, as well as the limitations that need to be considered.

> [!NOTE]
> Syntax for CREATE VIEW is not discussed in this article. For more information, see the [CREATE VIEW](/sql/t-sql/statements/create-view-transact-sql) documentation.
> 
> 

## Architectural abstraction
A common application pattern is to re-create tables using CREATE TABLE AS SELECT (CTAS) followed by an object renaming pattern whilst loading data.

The following example adds new date records to a date dimension. Note how a new table, DimDate_New, is first created and then renamed to replace the original version of the table.

```sql
CREATE TABLE dbo.DimDate_New
WITH (DISTRIBUTION = ROUND_ROBIN
, CLUSTERED INDEX (DateKey ASC)
)
AS
SELECT *
FROM   dbo.DimDate  AS prod
UNION ALL
SELECT *
FROM   dbo.DimDate_stg AS stg
;

RENAME OBJECT DimDate TO DimDate_Old;
RENAME OBJECT DimDate_New TO DimDate;

```

However, this approach can result in tables appearing and disappearing from a user's view as well as "table does not exist" error messages. Views can be used to provide users with a consistent presentation layer whilst the underlying objects are renamed. By providing access to data through views, users do not need visibility to the underlying tables. This layer provides a consistent user experience while ensuring that the data warehouse designers can evolve the data model. Being able to evolve the underlying tables means designers can use CTAS to maximize performance during the data loading process.   

## Performance optimization
Views can also be utilized to enforce performance optimized joins between tables. For example, a view can incorporate a redundant distribution key as part of the joining criteria to minimize data movement. Another benefit of a view could be to force a specific query or joining hint. Using views in this manner guarantees that joins are always performed in an optimal fashion avoiding the need for users to remember the correct construct for their joins.

## Limitations
Views in SQL Data Warehouse are stored as metadata only. Consequently, the following options are not available:

* There is no schema binding option
* Base tables cannot be updated through the view
* Views cannot be created over temporary tables
* There is no support for the EXPAND / NOEXPAND hints
* There are no indexed views in SQL Data Warehouse

## Next steps
For more development tips, see [SQL Data Warehouse development overview](sql-data-warehouse-overview-develop.md).


