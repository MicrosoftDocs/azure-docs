---
title: Using dynamic SQL 
description: Tips for development solutions using dynamic SQL in Synapse SQL pool.
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

# Dynamic SQL in Synapse SQL pool

Included in this article are tips for development solutions using dynamic SQL in SQL pool.

## Dynamic SQL Example

When developing application code for SQL pool, you may need to use dynamic SQL to help deliver flexible, generic, and modular solutions. SQL pool doesn't support blob data types at this time.

Not supporting blob data types might limit the size of your strings since blob data types include both varchar(max) and nvarchar(max) types.

If you've used these types in your application code to build large strings, you need to break the code into chunks and use the EXEC statement instead.

A simple example:

```sql
DECLARE @sql_fragment1 VARCHAR(8000)=' SELECT name '
,       @sql_fragment2 VARCHAR(8000)=' FROM sys.system_views '
,       @sql_fragment3 VARCHAR(8000)=' WHERE name like ''%table%''';

EXEC( @sql_fragment1 + @sql_fragment2 + @sql_fragment3);
```

If the string is short, you can use [sp_executesql](/sql/relational-databases/system-stored-procedures/sp-executesql-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) as normal.

> [!NOTE]
> Statements executed as dynamic SQL will still be subject to all T-SQL validation rules.

## Next steps

For more development tips, see [development overview](sql-data-warehouse-overview-develop.md).
