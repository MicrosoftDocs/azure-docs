<properties
   pageTitle="Views in SQL Data Warehouse | Microsoft Azure"
   description="Tips for using Transact-SQL views in Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="07/01/2016"
   ms.author="jrj;barbkess;sonyama"/>


# Views in SQL Data Warehouse

Views are particularly useful in SQL Data Warehouse. They can be used in a number of different ways to improve the quality of your solution.  This article highlights a few examples of how to enrich your solution with views, as well as the limitations that need to be considered.

> [AZURE.NOTE] Syntax for `CREATE VIEW` is not discussed in this article. Please refer to the [CREATE VIEW][] article on MSDN for this reference information.

## Architectural abstraction
A very common application pattern is to re-create tables using CREATE TABLE AS SELECT (CTAS) followed by an object renaming pattern whilst loading data.

The example below adds new date records to a date dimension. Note how a new tabble, DimDate_New, is first created and then renamed to replace the original version of the table.

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

However, this approach can result in tables appearing and disappearing from a user's view as well as "table does not exist" error messages. Views can be used to provide users with a consistent presentation layer whilst the underlying objects are renamed. By providing users access to the data through a views, means users don't need to have visibility of the underlying tables. This provides a consistent user experience while ensuring that the data warehouse designers can evolve the data model and maximize performance by using CTAS during the data loading process.    

## Performance optimization
Views can also be utilized to enforce performance optimized joins between tables. For example, a view can incorporate a redundant distribution key as part of the joining criteria to minimize data movement.  Another benefit of a view could be to force a specific query or joining hint. Using views in this manner guarantees that joins are always performed in an optimal fashion avoiding the need for users to remember the correct construct for their joins.

## Limitations
Views in SQL Data Warehouse are metadata only.  Consequently the following options are not available:

- 	There is no schema binding option
- 	Base tables cannot be updated through the view
- 	Views cannot be created over temporary tables
- 	There is no support for the EXPAND / NOEXPAND hints
- 	There are no indexed views in SQL Data Warehouse


## Next steps
For more development tips, see [SQL Data Warehouse development overview][].
For `CREATE VIEW` syntax please refer to [CREATE VIEW][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse development overview]: ./sql-data-warehouse-overview-develop.md

<!--MSDN references-->
[CREATE VIEW]: https://msdn.microsoft.com/en-us/library/ms187956.aspx

<!--Other Web references-->
