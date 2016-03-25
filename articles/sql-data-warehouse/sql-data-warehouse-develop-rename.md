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
   ms.date="03/23/2016"
   ms.author="mausher;jrj;barbkess;sonyama"/>

# Rename in SQL Data Warehouse
While SQL Server supports database renaming via the stored procedure `sp_renamedb`, SQL Data Warehouse uses DDL syntax to achieve the same goal.  The DDL command is `RENAME OBJECT`.

## Rename table

Currently, only tables can be renamed.  The syntax to rename a table is:

```sql
RENAME OBJECT dbo.Customer TO NewCustomer;
```

When renaming a table, all objects and properties associated with the table are updated to reference the new table name. For example, table definitions, indexes, constraints, and permissions are updated. Views are not updated.

## Rename external table

Renaming an external table changes the table name within SQL Data Warehouse. It does not effect the location of the external data for the table.

## Change a table schema
If the intent is to change the schema that an object belongs to then that is achieved via ALTER SCHEMA:

```sql
ALTER SCHEMA dbo TRANSFER OBJECT::product.item;
```

## Table rename requires exclusive table lock

It is important to remember that you cannot rename a table while it is in use.  A rename of a table requires an exclusive lock on the table.  If the table is in use, you may need to terminate the session using the table.  To terminate a session you need to use the [KILL][] command.  Take care when using `KILL` as when a session is terminated and any uncommitted work will be rolled back.  Sessions in SQL Data Warehouse are prefixed by 'SID'.  You will need to include this and the session number when invoking the KILL command.  For example `KILL 'SID1234'`. Refer to the connections article for more information on [sessions]


## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md
[sessions]: sql-data-warehouse-develop-connections.md


<!--MSDN references-->
[KILL]:https://msdn.microsoft.com/library/ms173730.aspx