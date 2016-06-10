<properties
   pageTitle="Migrate your schema to SQL Data Warehouse | Microsoft Azure"
   description="Tips for migrating your schema to Azure SQL Data Warehouse for developing solutions."
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
   ms.date="05/14/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Migrate your schema to SQL Data Warehouse#

The following summaries will help you understand the differences between SQL Server and SQL Data Warehouse to help you migrate your database.

### Table features
SQL Data Warehouse does not use or support these features:

- Primary keys  
- Foreign keys  
- Check constraints  
- Unique constraints  
- Unique indexes  
- Computed columns  
- Sparse columns  
- User defined types  
- Indexed views  
- Identities  
- Sequences  
- Triggers  
- Synonyms  


### Data type differences
SQL Data Warehouse supports the common business data types:

- bigint
- binary
- bit
- char
- date
- datetime
- datetime2
- datetimeoffset
- decimal
- float
- int
- money
- nchar
- nvarchar
- numeric
- real
- smalldatetime
- smallint
- smallmoney
- sysname
- time
- tinyint
- varbinary
- varchar
- uniqueidentifier

You can use this query to identify columns in your data warehouse that contain incompatible types:

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

The query includes any user defined data types which are also not supported.

If you have unsupported types in your database do not worry. Some alternatives you can use instead are proposed below.

Instead of:

- **geometry**, use a varbinary type
- **geography**, use a varbinary type
- **hierarchyid**, this CLR type is not supported
- **image**, **text**, **ntext**, use varchar/nvarchar (smaller the better)
- **sql_variant**, split column into several strongly typed columns
- **table**, convert to temporary tables
- **timestamp**, re-work code to use datetime2 and `CURRENT_TIMESTAMP` function. Note you cannot have current_timestamp as a default constraint and the value will not automatically update. If you need to migrate rowversion values from a timestamp typed column then use binary(8) or varbinary(8) for NOT NULL or NULL row version values.
- **user defined types**, convert back to their native types where possible
- **xml**, use a varchar(max) or smaller for better performance. Split across columns if needed

For better performance, instead of:

- nvarchar(max), use nvarchar(4000) or smaller for better performance
- varchar(max), use varchar(8000) or smaller for better performance

Partial support:

- Default constraints support literals and constants only. Non-deterministic expressions or functions, such as `GETDATE()` or `CURRENT_TIMESTAMP`, are not supported.

> [AZURE.NOTE] If you are using Polybase to load your tables, define your tables so that the maximum possible row size, including the full length of variable length columns, does not exceed 32,767 bytes. While you can define a row with variable length data that can exceed this figure, and load rows with BCP, you will not be be able to us Polybase to load this data quite yet. Polybase support for wide rows will be added soon. Also, try to limit the size of your variable length columns for even better throughput for running queries.

## Next steps
Once you have successfully migrated your database schema to SQLDW you can proceed to one of the following articles:

- [Migrate your data][]
- [Migrate your code][]

For more development tips, see the [development overview][].

<!--Image references-->

<!--Article references-->
[Migrate your code]: sql-data-warehouse-migrate-code.md
[Migrate your data]: sql-data-warehouse-migrate-data.md
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->


<!--Other Web references-->
