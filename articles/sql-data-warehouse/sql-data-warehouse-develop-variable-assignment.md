---
title: Assign variables in Azure SQL Data Warehouse | Microsoft Docs
description: Tips for assigning T-SQL variables in Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
author: XiaoyuL-Preview 
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: development
ms.date: 04/17/2018
ms.author: xiaoyul
ms.reviewer: igorstan
---

# Assigning variables in Azure SQL Data Warehouse

Tips for assigning T-SQL variables in Azure SQL Data Warehouse for developing solutions.

## Setting variables with DECLARE

Variables in SQL Data Warehouse are set using the `DECLARE` statement or the `SET` statement. Initializing variables with DECLARE is one of the most flexible ways to set a variable value in SQL Data Warehouse.

```sql
DECLARE @v  int = 0
;
```

You can also use DECLARE to set more than one variable at a time. You cannot use SELECT or UPDATE to do the following:

```sql
DECLARE @v  INT = (SELECT TOP 1 c_customer_sk FROM Customer where c_last_name = 'Smith')
,       @v1 INT = (SELECT TOP 1 c_customer_sk FROM Customer where c_last_name = 'Jones')
;
```

You cannot initialize and use a variable in the same DECLARE statement. To illustrate the point, the following example is **not** allowed since @p1 is both initialized and used in the same DECLARE statement. The following example gives an error.

```sql
DECLARE @p1 int = 0
,       @p2 int = (SELECT COUNT (*) FROM sys.types where is_user_defined = @p1 )
;
```

## Setting values with SET

SET is a common method for setting a single variable.

The following statements are all valid ways to set a variable with SET:

```sql
SET     @v = (Select max(database_id) from sys.databases);
SET     @v = 1;
SET     @v = @v+1;
SET     @v +=1;
```

You can only set one variable at a time with SET. However, compound operators are permissible.

## Limitations

You cannot use UPDATE for variable assignment.

## Next steps

For more development tips, see [development overview](sql-data-warehouse-overview-develop.md).
