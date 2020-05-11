---
title: Using stored procedures
description: Tips for implementing stored procedures in Synapse SQL pool (data warehouse) for developing solutions.
services: synapse-analytics
author: XiaoyuMSFT 
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 04/15/2020
ms.author: xiaoyul
ms.reviewer: igorstan
---

# Using stored procedures in SQL pool

Tips for implementing stored procedures in Synapse SQL pool (data warehouse) for developing solutions.

## What to expect

SQL pool supports many of the T-SQL features that are used in SQL Server. More importantly, there are scale-out specific features that you can use to maximize the performance of your solution.

However, to maintain the scale and performance of SQL pool there are also some features and functionality that have behavioral differences and others that are not supported.

## Introducing stored procedures

Stored procedures are a great way for encapsulating your SQL code; storing it close to your data in the data warehouse. Stored procedures help developers modularize their solutions by encapsulating the code into manageable units; facilitating greater reusability of code. Each stored procedure can also accept parameters to make them even more flexible.

SQL pool provides a simplified and streamlined stored procedure implementation. The biggest difference compared to SQL Server is that the stored procedure is not pre-compiled code. In data warehouses, the compilation time is small in comparison to the time it takes to run queries against large data volumes. It is more important to ensure the stored procedure code is correctly optimized for large queries. The goal is to save hours, minutes, and seconds, not milliseconds. It is therefore more helpful to think of stored procedures as containers for SQL logic.

When SQL pool executes your stored procedure, the SQL statements are parsed, translated, and optimized at run time. During this process, each statement is converted into distributed queries. The SQL code that is executed against the data is different than the query submitted.

## Nesting stored procedures

When stored procedures call other stored procedures, or execute dynamic SQL, then the inner stored procedure or code invocation is said to be nested.

SQL pool supports a maximum of eight nesting levels. This is slightly different to SQL Server. The nest level in SQL Server is 32.

The top-level stored procedure call equates to nest level 1.

```sql
EXEC prc_nesting
```

If the stored procedure also makes another EXEC call, the nest level increases to two.

```sql
CREATE PROCEDURE prc_nesting
AS
EXEC prc_nesting_2  -- This call is nest level 2
GO
EXEC prc_nesting
```

If the second procedure then executes some dynamic SQL, the nest level increases to three.

```sql
CREATE PROCEDURE prc_nesting_2
AS
EXEC sp_executesql 'SELECT 'another nest level'  -- This call is nest level 2
GO
EXEC prc_nesting
```

> [!NOTE]
> SQL pool does not currently support [@@NESTLEVEL](/sql/t-sql/functions/nestlevel-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest). You need to track the nest level. It is unlikely for you to exceed the eight nest level limit, but if you do, you need to rework your code to fit the nesting levels within this limit.

## INSERT..EXECUTE

SQL pool does not permit you to consume the result set of a stored procedure with an INSERT statement. However, there is an alternative approach you can use. For an example, see the article on [temporary tables](develop-tables-temporary.md).

## Limitations

There are some aspects of Transact-SQL stored procedures that are not implemented in SQL pool.

They are:

* temporary stored procedures
* numbered stored procedures
* extended stored procedures
* CLR stored procedures
* encryption option
* replication option
* table-valued parameters
* read-only parameters
* default parameters
* execution contexts
* return statement

## Next steps

For more development tips, see [development overview](develop-overview.md).
