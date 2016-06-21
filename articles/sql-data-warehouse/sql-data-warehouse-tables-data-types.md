<properties
   pageTitle="Data Types for Tables in SQL Data Warehouse | Microsoft Azure"
   description="Data Types for Tables in SQL Data Warehouse in Azure SQL Data Warehouse."
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
   ms.date="06/21/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Data types for tables in SQL Data Warehouse

> [AZURE.SELECTOR]
- [Overview][]
- [Distribute][]
- [Index][]
- [Partition][]
- [Data Types][]
- [Statistics][]

This article will introduce you to data types for SQL Data Warehouse tables.

## Supported data types
SQL Data Warehouse supports the common business data types:

- **bigint**
- **binary**
- **bit**
- **char**
- **date**
- **datetime**
- **datetime2**
- **datetimeoffset**
- **decimal**
- **float**
- **int**
- **money**
- **nchar**
- **nvarchar**
- **real**
- **smalldatetime**
- **smallint**
- **smallmoney**
- **sysname**
- **time**
- **tinyint**
- **uniqueidentifier**
- **varbinary**
- **varchar**

You can identify columns in your data warehouse that contain incompatible types using the following query:

```sql
SELECT  t.[name]
,       c.[name]
,       c.[system_type_id]
,       c.[user_type_id]
,       y.[is_user_defined]
,       y.[name]
FROM sys.tables  t
JOIN sys.columns c on t.[object_id]    = c.[object_id]
JOIN sys.types   y on c.[user_type_id] = y.[user_type_id]
WHERE y.[name] IN
                (   'geography'
                ,   'geometry'
                ,   'hierarchyid'
                ,   'image'
                ,   'ntext'
                ,   'sql_variant'
                ,   'text'
                ,   'timestamp'
                ,   'xml'
                )
AND  y.[is_user_defined] = 1
;

```

The query includes any user-defined data types, which are not supported.  Below are some alternatives you can use in place of unsupported data types.

Instead of:

- **geometry**, use a varbinary type
- **geography**, use a varbinary type
- **hierarchyid**, CLR type not native
- **image**, **text**, **ntext** when text based use varchar/nvarchar (smaller the better)
- **sql_variant**, split column into several strongly typed columns
- **table**, convert to temporary tables
- **timestamp**, re-work code to use datetime2 and `CURRENT_TIMESTAMP` function. Note you cannot have current_timestamp as a default constraint and the value will not automatically update. If you need to migrate rowversion values from a timestamp typed column then use BINARY(8) or VARBINARY(8) for NOT NULL or NULL row version values.
- **user defined types**, convert back to their native types where possible
- **xml**, use a varchar(max) or smaller for better performance

For better performance, instead of:

- **nvarchar(max)**, use nvarchar(4000) or smaller for better performance
- **varchar(max)**, use varchar(8000) or smaller for better performance

Partial support:

- Default constraints support literals and constants only. Non-deterministic expressions or functions, such as `GETDATE()` or `CURRENT_TIMESTAMP`, are not supported.

> [AZURE.NOTE] If you are using Polybase to load your tables, define your tables so that the maximum possible row size, including the full length of variable length columns, does not exceed 32,767 bytes. While you can define a row with variable length data that can exceed this figure, and load rows with BCP, you will not be be able to us Polybase to load this data quite yet.  Polybase support for wide rows will be added soon. Also, try to limit the size of your variable length columns for even better throughput for running queries.


<!--Article references-->
[Overview]: ./sql-data-warehouse-tables-overview.md
[Distribute][] ./sql-data-warehouse-tables-distribute.md
[Index][] ./sql-data-warehouse-tables-index.md
[Partition][] ./sql-data-warehouse-tables-partition.md
[Data Types][] ./sql-data-warehouse-tables-data-types.md
[Statistics][] ./sql-data-warehouse-tables-statistics.md
