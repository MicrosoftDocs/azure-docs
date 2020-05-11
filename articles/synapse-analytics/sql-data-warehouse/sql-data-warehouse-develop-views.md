---
title: Using T-SQL views
description: Tips for using T-SQL views and developing solutions in Synapse SQL pool.
services: synapse-analytics
author: XiaoyuMSFT 
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 04/17/2018
ms.author: xiaoyul
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Views in Synapse SQL pool

Views can be used in a number of different ways to improve the quality of your solution.

SQL pool supports both standard and materialized views. Both are virtual tables created with SELECT expressions and presented to queries as logical tables.

Views encapsulate the complexity of common data computation and add an abstraction layer to computation changes so there's no need to rewrite queries.

## Standard view

A standard view computes its data each time when the view is used. There's no data stored on disk. People typically use standard views as a tool that helps organize the logical objects and queries in a database.

To use a standard view, a query needs to make direct reference to it. For more information, see the [CREATE VIEW](/sql/t-sql/statements/create-view-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) documentation.

Views in SQL pool are stored as metadata only. Consequently, the following options aren't available:

* There is no schema binding option
* Base tables can't be updated through the view
* Views can't be created over temporary tables
* There is no support for the EXPAND / NOEXPAND hints
* There are no indexed views in SQL pool

Standard views can  be utilized to enforce performance optimized joins between tables. For example, a view can incorporate a redundant distribution key as part of the joining criteria to minimize data movement.

Another benefit of a view could be to force a specific query or joining hint. Using views in this manner guarantees that joins are always performed in an optimal fashion avoiding the need for users to remember the correct construct for their joins.

## Materialized view

A materialized view pre-computes, stores, and maintains its data in SQL pool just like a table. There's no recomputation needed each time when a materialized view is used.

As the data gets loaded into base tables, SQL pool synchronously refreshes the materialized views.  The query optimizer automatically uses deployed materialized views to improve query performance even if the views aren't referenced in the query.  

Queries benefiting most from materialized views are complex queries (typically queries with joins and aggregations) on large tables that produce small result set.  

For details on the materialized view syntax and other requirements, refer to [CREATE MATERIALIZED VIEW AS SELECT](/sql/t-sql/statements/create-materialized-view-as-select-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).  

For query tuning guidance, check [Performance tuning with materialized views](performance-tuning-materialized-views.md).

## Example

A common application pattern is to re-create tables using CREATE TABLE AS SELECT (CTAS) followed by an object renaming pattern while loading data.  

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
FROM   dbo.DimDate_stg AS stg;

RENAME OBJECT DimDate TO DimDate_Old;
RENAME OBJECT DimDate_New TO DimDate;

```

However, this approach can result in tables appearing and disappearing from a user's view along with issuing a "table does not exist" error messages.

Views can be used to provide users with a consistent presentation layer while the underlying objects are renamed. By providing access to data through views, users don't need visibility to the underlying tables.

This layer provides a consistent user experience while ensuring that the data warehouse designers can evolve the data model. Being able to evolve the underlying tables means designers can use CTAS to maximize performance during the data loading process.

## Next steps

For more development tips, see [SQL pool development overview](sql-data-warehouse-overview-develop.md).
