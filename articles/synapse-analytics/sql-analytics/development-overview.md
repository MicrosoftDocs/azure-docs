---
title: Resources for developing with Azure SQL Analytics | Microsoft Docs
description: Development concepts, design decisions, recommendations and coding techniques for SQL Analytics.
services: synapse analytics
author: filippopovic
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 10/20/2019
ms.author: fipopovi
ms.reviewer: jrasnick
---

# Design decisions and coding techniques for SQL Analytics
The development articles below will help you to better understand key design decisions, recommendations, and coding techniques for SQL Analytics.

## Key design decisions
The following articles highlight concepts and design decisions for development using SQL Analytics:

|                                                          |   SQL Analytics pool   | SQL Analytics on-demand |
| -----------------------------------------------------    | ---- | ---- |
| [Connections][connections]                               | Yes | Yes |
| [Resource classes and concurrency][concurrency] | Yes    | No |
| [Transactions][transactions]                             | Yes | No |
| [User-defined schemas][user-defined schemas]             | Yes | Yes |
| [Table distribution][table distribution]                 | Yes | No |
| [Table indexes][table indexes]                           | Yes | No |
| [Table partitions][table partitions]                     | Yes | No |
| [Statistics][statistics]                                 | Yes | Yes |
| [CTAS][CTAS]                                             | Yes | No |
| [External tables](development-tables-external-tables.md) | Yes | Yes |
| [CETAS](development-tables-cetas.md)                     | Yes | Yes |


## Development recommendations and coding techniques
The following articles highlight specific coding techniques, tips, and recommendations for development:

|                                            | SQL Analytics pool | SQL Analytics on-demand |
| ------------------------------------------ | ------------------ | ----------------------- |
| [Stored procedures][stored procedures]     | Yes                | No                      |
| [Labels][labels]                           | Yes                | No                      |
| [Views][views]                             | Yes                | Yes                     |
| [Temporary tables][temporary tables]       | Yes                | Yes                     |
| [Dynamic SQL][dynamic SQL]                 | Yes                | Yes                     |
| [Looping][looping]                         | Yes                | Yes                     |
| [Group by options][group by options]       | Yes                | No                      |
| [Variable assignment][variable assignment] | Yes                | Yes                     |



## Next steps
For more reference information, see [SQL Analytics pool T-SQL statements](../../sql-data-warehouse/sql-data-warehouse-reference-tsql-statements.md).

<!--Image references-->

<!--Article references-->
[concurrency]: workload-management-resource-classes.md
[connections]: ../../sql-data-warehouse/sql-data-warehouse-connect-overview.md
[CTAS]: ../../sql-data-warehouse/sql-data-warehouse-develop-ctas.md
[dynamic SQL]: development-dynamic-sql.md
[group by options]: development-group-by-options.md
[labels]: development-label.md
[looping]: development-loops.md
[statistics]: development-tables-statistics.md
[stored procedures]: development-stored-procedures.md
[table distribution]: ../../sql-data-warehouse/sql-data-warehouse-tables-distribute.md
[table indexes]: ../../sql-data-warehouse/sql-data-warehouse-tables-index.md
[table partitions]: ../../sql-data-warehouse/sql-data-warehouse-tables-partition.md
[temporary tables]: development-tables-temporary.md
[transactions]: development-transactions.md
[user-defined schemas]: development-user-defined-schemas.md
[variable assignment]: development-variable-assignment.md
[views]: development-views.md


<!--MSDN references-->
[renaming objects]: https://msdn.microsoft.com/library/mt631611.aspx

<!--Other Web references-->
