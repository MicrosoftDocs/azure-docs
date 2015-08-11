<properties
   pageTitle="Assign variables in SQL Data Warehouse | Microsoft Azure"
   description="Tips for assigning Transact-SQL variables in Azure SQL Data Warehouse for developing solutions."
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
   ms.date="06/26/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Assign variables in SQL Data Warehouse
Variables in SQL Data Warehouse are set using the `DECLARE` statement or the `SET` statement. 

All of the following are perfectly valid ways to set a variable value:

## Setting variables with DECLARE

Initializing variables with DECLARE is one of the most flexible ways to set a variable value in SQL Data Warehouse.

```
DECLARE @v  int = 0
;
```

You can also use DECLARE to set more than one variable at a time. You cannot use `SELECT` or `UPDATE` to do this:

```
DECLARE @v  INT = (SELECT TOP 1 c_customer_sk FROM Customer where c_last_name = 'Smith')
,       @v1 INT = (SELECT TOP 1 c_customer_sk FROM Customer where c_last_name = 'Jones')
;
```

You cannot initialise and use a variable in the same DECLARE statement. To illustrate the point the example below is **not** allowed as @p1 is both initialized and used in the same DECLARE statement. This will result in an error.

```
DECLARE @p1 int = 0
,       @p2 int = (SELECT COUNT (*) FROM sys.types where is_user_defined = @p1 )
;
```

## Setting values with SET
Set is a very common method for setting a single variable.

All of the examples below are valid ways of setting a variable with SET:

```
SET     @v = (Select max(database_id) from sys.databases);
SET     @v = 1;
SET     @v = @v+1;
SET     @v +=1;
```

You can only set one variable at a time with SET. However, as can be seen above compound operators are permissable.

## Limitations
You cannot use SELECT or UPDATE for variable assignment.


## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other Web references-->
