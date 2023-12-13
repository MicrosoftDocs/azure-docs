---
title: Resources for developing Synapse SQL features
description: Development concepts, design decisions, recommendations, and coding techniques for Synapse SQL.
author: filippopovic
ms.author: fipopovi
ms.reviewer: sngun
ms.date: 03/23/2022
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: conceptual
---

# Design decisions and coding techniques for Synapse SQL features in Azure Synapse Analytics
In this article, you'll find a list of resources for dedicated SQL pool and serverless SQL pool functions of Synapse SQL. The recommended articles are split up into two sections: Key design decisions and development and coding techniques.

The goal of these articles is to help you develop the optimal technical approach for the Synapse SQL components within Azure Synapse Analytics.

## Key design decisions
The articles below highlight concepts and design decisions for Synapse SQL development:

| Article | dedicated SQL pool | serverless SQL pool |
| ------- | -------- | ------------- |
| [Connections](connect-overview.md)                    | Yes | Yes |
| [Resource classes and concurrency](../sql-data-warehouse/resource-classes-for-workload-management.md?context=/azure/synapse-analytics/context/context) | Yes    | No |
| [Transactions](develop-transactions.md)              | Yes | No |
| [User-defined schemas](develop-user-defined-schemas.md) | Yes | Yes |
| [Table distribution](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md?context=/azure/synapse-analytics/context/context)                 | Yes | No |
| [Table indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?context=/azure/synapse-analytics/context/context)                           | Yes | No |
| [Table partitions](../sql-data-warehouse/sql-data-warehouse-tables-partition.md?context=/azure/synapse-analytics/context/context)                     | Yes | No |
| [Statistics](develop-tables-statistics.md)            | Yes | Yes |
| [CTAS](../sql-data-warehouse/sql-data-warehouse-develop-ctas.md?context=/azure/synapse-analytics/context/context)                                             | Yes | No |
| [External tables](develop-tables-external-tables.md) | Yes | Yes |
| [CETAS](develop-tables-cetas.md)                     | Yes | Yes |

## Recommendations

Below you'll find essential articles that emphasize specific coding techniques, tips, and recommendations for development:

| Article | dedicated SQL pool | serverless SQL pool |
| ------- | -------- | ------------- |
| [Stored procedures](develop-stored-procedures.md)  | Yes                | Yes                      |
| [Labels](develop-label.md)                           | Yes                | No                      |
| [Views](develop-views.md)                             | Yes                | Yes                     |
| [Temporary tables](develop-tables-temporary.md)       | Yes                | Yes                     |
| [Dynamic SQL](develop-dynamic-sql.md)                 | Yes                | Yes                     |
| [Looping](develop-loops.md)                         | Yes                | Yes                     |
| [Group by options](develop-group-by-options.md)       | Yes                | No                      |
| [Variable assignment](develop-variable-assignment.md) | Yes                | Yes                     |

## Benefits & best practices

* To learn more on which scenarios are suited for Serverless SQL pool, see [Serverless SQL pool benefits](on-demand-workspace-overview.md#serverless-sql-pool-benefits) article.

* [Best practices for using serverless SQL pool](best-practices-serverless-sql-pool.md)

* [Best practices for optimal performance using dedicated SQL pools](best-practices-dedicated-sql-pool.md)

## T-SQL feature support

Transact-SQL language is used in serverless SQL pool and dedicated model can reference different objects and has some differences in the set of supported features. For more information, see [Transact-SQL features supported in Azure Synapse SQL](overview-features.md) article.

## Next steps
For more reference information, see [SQL pool T-SQL statements](../sql-data-warehouse/sql-data-warehouse-reference-tsql-statements.md?context=/azure/synapse-analytics/context/context).

