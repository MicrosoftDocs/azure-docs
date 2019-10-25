---
title: Resources for developing an Azure SQL Data Warehouse | Microsoft Docs
description: Development concepts, design decisions, recommendations and coding techniques for SQL Data Warehouse.
services: sql-data-warehouse
author: XiaoyuMSFT
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
For more reference information, see [SQL Data Warehouse T-SQL statements](../../sql-data-warehouse/sql-data-warehouse-reference-tsql-statements.md).

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
