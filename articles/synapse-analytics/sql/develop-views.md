---
title: T-SQL views using SQL pools
description: Tips for using T-SQL views and developing solutions with dedicated SQL pool and serverless SQL pool in Azure Synapse Analytics..
author: azaricstefan 
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql
ms.date: 04/15/2020 
ms.author: stefanazaric 
ms.reviewer: sngun
---

# T-SQL views with dedicated SQL pool and serverless SQL pool in Azure Synapse Analytics

In this article, you'll find tips for using T-SQL views and developing solutions with dedicated SQL pool and serverless SQL pool in Azure Synapse Analytics.

## Why use views

Views can be used in a number of different ways to improve the quality of your solution.  This article highlights a few examples of how to enrich your solution with views and includes the limitations that need to be considered.

### SQL pool - create view

> [!NOTE]
> Syntax for CREATE VIEW is not discussed in this article. For more information, see the [CREATE VIEW](/sql/t-sql/statements/create-view-transact-sql?view=azure-sqldw-latest&preserve-view=true) documentation.

## Architectural abstraction

A common application pattern is to re-create tables using [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?view=azure-sqldw-latest&preserve-view=true) (CTAS), which is followed by an object renaming pattern while loading data.

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

Keep in mind that this approach can result in tables appearing and disappearing from a user's view, and prompts "table does not exist" error messages. Views can be used to provide users with a consistent presentation layer while the underlying objects are renamed.

By providing access to data through views, users don't need visibility to the underlying tables. In addition to a consistent user experience, this layer ensures that analytics designers can evolve the data model. The ability to evolve the underlying tables means designers can use CTAS to maximize performance during the data loading process.

## Performance optimization

Views can also be used to enforce performance optimized joins between tables. For example, a view can incorporate a redundant distribution key as part of the joining criteria to minimize data movement.

Forcing a specific query or joining hint is another benefit of using T-SQL views. As such, the views capability ensures that joins are always performed in an optimal fashion. You'll avoid the need for users to remember the correct construct for their joins.

## Limitations

Views in Synapse SQL are only stored as metadata. Consequently, the following options aren't available:

* There isn't a schema binding option
* Base tables can't be updated through the view
* Views can't be created over temporary tables
* There's no support for the EXPAND / NOEXPAND hints
* There are no indexed views in Synapse SQL

## Next steps

For more development tips, see [Synapse SQL development overview](develop-overview.md).



