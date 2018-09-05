---
title: Defining data types - Azure SQL Data Warehouse | Microsoft Docs
description: Recommendations for defining table data types in Azure SQL Data Warehouse. 
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

# Table data types in Azure SQL Data Warehouse
Recommendations for defining table data types in Azure SQL Data Warehouse. 

## What are the data types?

SQL Data Warehouse supports the most commonly used data types. For a list of the supported data types, see [data types](/sql/t-sql/statements/create-table-azure-sql-data-warehouse#DataTypes) in the CREATE TABLE statement. 

## Minimize row length
Minimizing the size of data types shortens the row length, which leads to better query performance. Use the smallest data type that works for your data. 

- Avoid defining character columns with a large default length. For example, if the longest value is 25 characters, then define your column as VARCHAR(25). 
- Avoid using [NVARCHAR][NVARCHAR] when you only need VARCHAR.
- When possible, use NVARCHAR(4000) or VARCHAR(8000) instead of NVARCHAR(MAX) or VARCHAR(MAX).

If you are using PolyBase external tables to load your tables, the defined length of the table row cannot exceed 1 MB. When a row with variable-length data exceeds 1 MB, you can load the row with BCP, but not with PolyBase.

## Identify unsupported data types
If you are migrating your database from another SQL database, you might encounter data types that are not supported in SQL Data Warehouse. Use this query to discover unsupported data types in your existing SQL schema.

```sql
SELECT  t.[name], c.[name], c.[system_type_id], c.[user_type_id], y.[is_user_defined], y.[name]
FROM sys.tables  t
JOIN sys.columns c on t.[object_id]    = c.[object_id]
JOIN sys.types   y on c.[user_type_id] = y.[user_type_id]
WHERE y.[name] IN ('geography','geometry','hierarchyid','image','text','ntext','sql_variant','xml')
 AND  y.[is_user_defined] = 1;
```


## <a name="unsupported-data-types"></a>Workarounds for unsupported data types

The following list shows the data types that SQL Data Warehouse does not support and gives alternatives that you can use instead of the unsupported data types.

| Unsupported data type | Workaround |
| --- | --- |
| [geometry](/sql/t-sql/spatial-geometry/spatial-types-geometry-transact-sql) |[varbinary](/sql/t-sql/data-types/binary-and-varbinary-transact-sql) |
| [geography](/sql/t-sql/spatial-geography/spatial-types-geography) |[varbinary](/sql/t-sql/data-types/binary-and-varbinary-transact-sql) |
| [hierarchyid](/sql/t-sql/data-types/hierarchyid-data-type-method-reference) |[nvarchar](/sql/t-sql/data-types/nchar-and-nvarchar-transact-sql)(4000) |
| [image](/sql/t-sql/data-types/ntext-text-and-image-transact-sql) |[varbinary](/sql/t-sql/data-types/binary-and-varbinary-transact-sql) |
| [text](/sql/t-sql/data-types/ntext-text-and-image-transact-sql) |[varchar](/sql/t-sql/data-types/char-and-varchar-transact-sql) |
| [ntext](/sql/t-sql/data-types/ntext-text-and-image-transact-sql) |[nvarchar](/sql/t-sql/data-types/nchar-and-nvarchar-transact-sql) |
| [sql_variant](/sql/t-sql/data-types/sql-variant-transact-sql) |Split column into several strongly typed columns. |
| [table](/sql/t-sql/data-types/table-transact-sql) |Convert to temporary tables. |
| [timestamp](/sql/t-sql/data-types/date-and-time-types) |Rework code to use [datetime2](/sql/t-sql/data-types/datetime2-transact-sql) and the [CURRENT_TIMESTAMP](/sql/t-sql/functions/current-timestamp-transact-sql) function. Only constants are supported as defaults, therefore current_timestamp cannot be defined as a default constraint. If you need to migrate row version values from a timestamp typed column, then use [BINARY](/sql/t-sql/data-types/binary-and-varbinary-transact-sql)(8) or [VARBINARY](/sql/t-sql/data-types/binary-and-varbinary-transact-sql)(8) for NOT NULL or NULL row version values. |
| [xml](/sql/t-sql/xml/xml-transact-sql) |[varchar](/sql/t-sql/data-types/char-and-varchar-transact-sql) |
| [user-defined type](/sql/relational-databases/native-client/features/using-user-defined-types) |Convert back to the native data type when possible. |
| default values | Default values support literals and constants only. |


## Next steps
For more information on developing tables, see [Table Overview](sql-data-warehouse-tables-overview.md).
