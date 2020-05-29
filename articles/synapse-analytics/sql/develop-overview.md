---
title: Resources for developing Synapse SQL features
description: Development concepts, design decisions, recommendations, and coding techniques for Synapse SQL.
services: synapse-analytics
author: filippopovic
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 04/15/2020
ms.author: fipopovi
ms.reviewer: jrasnick
---

# Design decisions and coding techniques for Synapse SQL features in Azure Synapse Analytics
In this article, you'll find a list of resources for SQL pool and SQL on-demand (preview) functions of Synapse SQL. The recommended articles are split up into two sections: Key design decisions and Development and coding techniques.

The goal of these articles is to help you develop the optimal technical approach for the Synapse SQL components within Synapse Analytics.

## Key design decisions
The articles below highlight concepts and design decisions for Synapse SQL development:

|                                                          |   SQL pool   | SQL on-demand |
| -----------------------------------------------------    | ---- | ---- |
| [Connections](connect-overview.md)                    | Yes | Yes |
| [Resource classes and concurrency](../sql-data-warehouse/resource-classes-for-workload-management.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) | Yes    | No |
| [Transactions](develop-transactions.md)              | Yes | No |
| [User-defined schemas](develop-user-defined-schemas.md) | Yes | Yes |
| [Table distribution](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)                 | Yes | No |
| [Table indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)                           | Yes | No |
| [Table partitions](../sql-data-warehouse/sql-data-warehouse-tables-partition.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)                     | Yes | No |
| [Statistics](develop-tables-statistics.md)            | Yes | Yes |
| [CTAS](../sql-data-warehouse/sql-data-warehouse-develop-ctas.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)                                             | Yes | No |
| [External tables](develop-tables-external-tables.md) | Yes | Yes |
| [CETAS](develop-tables-cetas.md)                     | Yes | Yes |


## Recommendations

Below you'll find essential articles that emphasize specific coding techniques, tips, and recommendations for development:

|                                            | SQL pool | SQL on-demand |
| ------------------------------------------ | ------------------ | ----------------------- |
| [Stored procedures](develop-stored-procedures.md)  | Yes                | No                      |
| [Labels](develop-label.md)                           | Yes                | No                      |
| [Views](develop-views.md)                             | Yes                | Yes                     |
| [Temporary tables](develop-tables-temporary.md)       | Yes                | Yes                     |
| [Dynamic SQL](develop-dynamic-sql.md)                 | Yes                | Yes                     |
| [Looping](develop-loops.md)                         | Yes                | Yes                     |
| [Group by options](develop-group-by-options.md)       | Yes                | No                      |
| [Variable assignment](develop-variable-assignment.md) | Yes                | Yes                     |

## Next steps
For more reference information, see [SQL pool T-SQL statements](../sql-data-warehouse/sql-data-warehouse-reference-tsql-statements.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

