---
title: Using stored procedures
description: Tips for developing solutions by implementing stored procedures for dedicated SQL pools in Azure Synapse Analytics.
author: MSTehrani
ms.author: emtehran
ms.reviewer: wiassaf
ms.date: 04/02/2019
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: azure-synapse
---

# Using stored procedures for dedicated SQL pools in Azure Synapse Analytics

This article provides tips for developing dedicated SQL pool solutions by implementing stored procedures.

## What to expect

Dedicated SQL pool supports many of the T-SQL features that are used in SQL Server. More importantly, there are scale-out specific features that you can use to maximize the performance of your solution.

Also, to help you maintain the scale and performance of dedicated SQL pool, there are additional features and functionalities that have behavioral differences.

## Introducing stored procedures

Stored procedures are a great way for encapsulating your SQL code, which is stored close to your dedicated SQL pool data. Stored procedures also help developers modularize their solutions by encapsulating the code into manageable units, thus facilitating greater code reusability. Each stored procedure can also accept parameters to make them even more flexible.

Dedicated SQL pool provides a simplified and streamlined stored procedure implementation. The biggest difference compared to SQL Server is that the stored procedure isn't pre-compiled code.

In general, for data warehouses, the compilation time is small in comparison to the time it takes to run queries against large data volumes. It's more important to ensure the stored procedure code is correctly optimized for large queries.

> [!TIP]
> The goal is to save hours, minutes, and seconds, not milliseconds. So, it's helpful to think of stored procedures as containers for SQL logic.

When a dedicated SQL pool executes your stored procedure, the SQL statements are parsed, translated, and optimized at run time. During this process, each statement is converted into distributed queries. The SQL code that is executed against the data is different than the query submitted.

## Nesting stored procedures

When stored procedures call other stored procedures, or execute dynamic SQL, then the inner stored procedure or code invocation is said to be nested.

Dedicated SQL pool supports a maximum of eight nesting levels. In contrast, the nest level in SQL Server is 32.

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

Dedicated SQL pool doesn't currently support [@@NESTLEVEL](/sql/t-sql/functions/nestlevel-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true). As such, you need to track the nest level. It's unlikely that you'll exceed the eight nest level limit. But, if you do, you need to rework your code to fit the nesting levels within this limit.

## INSERT..EXECUTE

Dedicated SQL pool doesn't permit you to consume the result set of a stored procedure with an INSERT statement. There is, however, an alternative approach you can use. For an example, see the article on [temporary tables](sql-data-warehouse-tables-temporary.md).

## Limitations

There are some aspects of Transact-SQL stored procedures that aren't implemented in dedicated SQL pool, which are as follows:

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

For more development tips, see [development overview](sql-data-warehouse-overview-develop.md).
