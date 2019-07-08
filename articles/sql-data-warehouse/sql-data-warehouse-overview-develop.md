---
title: Resources for developing a data warehouse in Azure | Microsoft Docs
description: Development concepts, design decisions, recommendations and coding techniques for SQL Data Warehouse.
services: sql-data-warehouse
author: XiaoyuL-Preview
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: development
ms.date: 08/29/2018
ms.author: xiaoyul
ms.reviewer: igorstan
---

# Design decisions and coding techniques for SQL Data Warehouse
Take a look through these development articles to better understand key design decisions, recommendations, and coding techniques for SQL Data Warehouse.

## Key design decisions
The following articles highlight concepts and design decisions for developing a distributed data warehouse using SQL Data Warehouse:

* [connections][connections]
* [concurrency][concurrency]
* [transactions][transactions]
* [user-defined schemas][user-defined schemas]
* [table distribution][table distribution]
* [table indexes][table indexes]
* [table partitions][table partitions]
* [CTAS][CTAS]
* [statistics][statistics]

## Development recommendations and coding techniques
These articles highlight specific coding techniques, tips, and recommendations for developing your SQL Data Warehouse:

* [stored procedures][stored procedures]
* [labels][labels]
* [views][views]
* [temporary tables][temporary tables]
* [dynamic SQL][dynamic SQL]
* [looping][looping]
* [group by options][group by options]
* [variable assignment][variable assignment]

## Next steps
For more reference information, see [SQL Data Warehouse T-SQL statements](sql-data-warehouse-reference-tsql-statements.md).

<!--Image references-->

<!--Article references-->
[concurrency]: ./resource-classes-for-workload-management.md
[connections]: ./sql-data-warehouse-connect-overview.md
[CTAS]: ./sql-data-warehouse-develop-ctas.md
[dynamic SQL]: ./sql-data-warehouse-develop-dynamic-sql.md
[group by options]: ./sql-data-warehouse-develop-group-by-options.md
[labels]: ./sql-data-warehouse-develop-label.md
[looping]: ./sql-data-warehouse-develop-loops.md
[statistics]: ./sql-data-warehouse-tables-statistics.md
[stored procedures]: ./sql-data-warehouse-develop-stored-procedures.md
[table distribution]: ./sql-data-warehouse-tables-distribute.md
[table indexes]: ./sql-data-warehouse-tables-index.md
[table partitions]: ./sql-data-warehouse-tables-partition.md
[temporary tables]: ./sql-data-warehouse-tables-temporary.md
[transactions]: ./sql-data-warehouse-develop-transactions.md
[user-defined schemas]: ./sql-data-warehouse-develop-user-defined-schemas.md
[variable assignment]: ./sql-data-warehouse-develop-variable-assignment.md
[views]: ./sql-data-warehouse-develop-views.md


<!--MSDN references-->
[renaming objects]: https://msdn.microsoft.com/library/mt631611.aspx

<!--Other Web references-->
