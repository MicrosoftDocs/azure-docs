---
title: Using dynamic SQL in Azure SQL Data Warehouse | Microsoft Docs
description: Tips for using dynamic SQL in Azure SQL Data Warehouse for developing solutions.
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

# Dynamic SQL in SQL Data Warehouse
Tips for using dynamic SQL in Azure SQL Data Warehouse for developing solutions.

## Dynamic SQL Example

When developing application code for SQL Data Warehouse, you may need to use dynamic sql to help deliver flexible, generic, and modular solutions. SQL Data Warehouse does not support blob data types at this time. Not supporting blob data types might limit the size of your strings since blob data types include both varchar(max) and nvarchar(max) types. If you have used these types in your application code to build large strings, you need to break the code into chunks and use the EXEC statement instead.

A simple example:

```sql
DECLARE @sql_fragment1 VARCHAR(8000)=' SELECT name '
,       @sql_fragment2 VARCHAR(8000)=' FROM sys.system_views '
,       @sql_fragment3 VARCHAR(8000)=' WHERE name like ''%table%''';

EXEC( @sql_fragment1 + @sql_fragment2 + @sql_fragment3);
```

If the string is short, you can use [sp_executesql](/sql/relational-databases/system-stored-procedures/sp-executesql-transact-sql) as normal.

> [!NOTE]
> Statements executed as dynamic SQL will still be subject to all TSQL validation rules.
> 
> 

## Next steps
For more development tips, see [development overview](sql-data-warehouse-overview-develop.md).

