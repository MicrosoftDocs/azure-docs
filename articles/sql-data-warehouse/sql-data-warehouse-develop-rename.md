<properties
   pageTitle="Rename in SQL Data Warehouse | Microsoft Azure"
   description="Tips for renaming tables in Azure SQL Data Warehouse for developing solutions."
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
   ms.date="05/28/2016"
   ms.author="mausher;jrj;barbkess;sonyama"/>

# Rename in SQL Data Warehouse
SQL Data Warehouse uses the [RENAME][] statement to rename tables.  This is different than SQL Server, which uses `sp_rename`.

## Rename table

Currently, only tables can be renamed.  Databases and External tables cannot be renamed.  When renaming a table, all objects and properties associated with the table are updated to reference the new table name. For example, table definitions, indexes, constraints, and permissions are updated. Views are not updated.

The syntax to rename a table is:

```sql
RENAME OBJECT dbo.Customer TO NewCustomer;
```

## Change a table schema

To change the schema that an object belongs use ALTER SCHEMA:

```sql
ALTER SCHEMA dbo TRANSFER OBJECT::product.item;
```

## Table rename requires exclusive table lock

You cannot rename a table while it is in use.  A rename of a table requires an exclusive lock on the table.  If the table is in use, you may need to terminate the session using the table.  Use the [KILL][] command to terminate a session.  For example `KILL 'SID1234'`.  Use caution when using `KILL`, as as any uncommitted transactional work will be rolled back when a session is terminated.  See the connections article for more information on [sessions][].  See [Optimizing transactions for SQL Data Warehouse][] for more information on the impact of killing a transactional query and the effect of a roll back.


## Next steps
For more T-SQL references, see [T-SQL references][].

<!--Image references-->

<!--Article references-->
[development overview]: ./sql-data-warehouse-overview-develop.md
[sessions]: ./sql-data-warehouse-develop-connections.md
[T-SQL references]: ./sql-data-warehouse-reference-tsql-statements.md
[Optimizing transactions for SQL Data Warehouse]: ./sql-data-warehouse-develop-best-practices-transactions.md


<!--MSDN references-->
[KILL]: https://msdn.microsoft.com/library/ms173730.aspx
[RENAME]: https://msdn.microsoft.com/library/mt631611.aspx
