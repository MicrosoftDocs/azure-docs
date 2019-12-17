---
title: Resources for developing with Azure SQL Analytics
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
| [Connections](connect-overview.md)                               | Yes | Yes |
| [Resource classes and concurrency](workload-management-resource-classes.md) | Yes    | No |
| [Transactions](azure-synapse-development-transactions.md)                             | Yes | No |
| [User-defined schemas](azure-synapse-development-user-defined-schemas.md)             | Yes | Yes |
| [Table distribution](../../sql-data-warehouse/sql-data-warehouse-tables-distribute.md)               | Yes | No |
| [Table indexes](../../sql-data-warehouse/sql-data-warehouse-tables-index.md)                          | Yes | No |
| [Table partitions](../../sql-data-warehouse/sql-data-warehouse-tables-partition.md)                     | Yes | No |
| [Statistics](azure-synapse-development-tables-statistics.md)           | Yes | Yes |
| [CTAS](../../sql-data-warehouse/sql-data-warehouse-develop-ctas.md)                      | Yes | No |
| [External tables](development-tables-external-tables.md) | Yes | Yes |
| [CETAS](development-tables-cetas.md)                     | Yes | Yes |


## Development recommendations and coding techniques
The following articles highlight specific coding techniques, tips, and recommendations for development:

|                                            | SQL Analytics pool | SQL Analytics on-demand |
| ------------------------------------------ | ------------------ | ----------------------- |
| [Stored procedures](development-stored-procedures.md)     | Yes                | No                      |
| [Labels](development-label.md)                           | Yes                | No                      |
| [Views](azure-synapse-views.md)                            | Yes                | Yes                     |
| [Temporary tables](azure-synapse-development-tables-temporary.md)       | Yes                | Yes                     |
| [Dynamic SQL](development-dynamic-sql.md)                 | Yes                | Yes                     |
| [Looping](development-loops.md)                         | Yes                | Yes                     |
| [Group by options](development-group-by-options.md)       | Yes                | No                      |
| [Variable assignment](azure-synapse-variable-assignment.md) | Yes                | Yes                     |



## Next steps
For more reference information, see [SQL pool T-SQL statements](../../sql-data-warehouse/sql-data-warehouse-reference-tsql-statements.md).



