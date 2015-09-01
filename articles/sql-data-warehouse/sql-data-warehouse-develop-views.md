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
   ms.date="06/22/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

 
# Views in SQL Data Warehouse

Views are particularly useful in SQL Data Warehouse. They can be used in a number of different ways to improve the quality of your solution.

This article highlights a few examples of how to enrich your solution by implementing with views. There are some limitations that also need to be considered.

## Architectural abstraction
A very common application pattern is to re-create tables using CREATE TABLE AS SELECT (CTAS) followed by an object renaming pattern whilst loading data. 

The example below adds new date records to a date dimension. Note how a new object, DimDate_New, is first created and then renamed to replace the original version of the object. 

```
CREATE TABLE dbo.DimDate_New
WITH (DISTRIBUTION = REPLICATE
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

However, this can result in table objects appearing and disappearing from a user's view in the SSDT SQL Server Object Explorer. Views can be used to provide warehouse data consumers with a consistent presentation layer whilst the underlying objects are renamed. Providing access to the data through a view means users don't need to have visibility of the underlying tables. This provides a consistent user experience whilst ensuring that the data warehouse designers can evolve the data model and also maximise performance by using CTAS during the data loading process.    

## Performance optimization
Views are a smart way to enforce performance optimized joins between tables. For example the view can incorporate a redundant distribution key as part of the joining criteria to minimize data movement.  Another reason might be to force a specific query or joining hint. This guarantees that the join is always performed in an optimal fashion and is not dependent on the user remembering to construct the join correctly.

## Limitations
Views in SQL Data Warehouse are metadata only. 

Consequently the following options aren't available:
- 	There is no schema binding option
- 	Base tables cannot be updated through the view
- 	Views cannot be created over temporary tables
- 	There is no support for the EXPAND / NOEXPAND Hints
- 	There are no indexed views in SQL Data Warehouse


## Next steps
For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other Web references-->


