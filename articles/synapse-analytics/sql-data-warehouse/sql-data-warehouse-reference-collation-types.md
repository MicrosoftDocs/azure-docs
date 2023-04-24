---
title: Data warehouse collation types
description: Collation types supported for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics.
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: conceptual
ms.date: 02/15/2023
author: WilliamDAssafMSFT 
ms.author: wiassaf
ms.reviewer: sngun, kecona
ms.custom: azure-synapse
---

# Database collation support for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics 

You can change the default database collation from the Azure portal when you create a new dedicated SQL pool (formerly SQL DW). This capability makes it even easier to create a new database using one of the 3800 supported database collations.

This article applies to dedicated SQL pools (formerly SQL DW), for more information on dedicated SQL pools in Azure Synapse workspaces, see [Collation types supported for Synapse SQL](../sql/reference-collation-types.md).

Collations provide the locale, code page, sort order and character sensitivity rules for character-based data types. Once chosen, all columns and expressions requiring collation information inherit the chosen collation from the database setting. The default inheritance can be overridden by explicitly stating a different collation for a character-based data type.

> [!NOTE]
> In Azure Synapse Analytics, query text (including variables, constants, etc.) is always handled using the database-level collation, and not the server-level collation as in other SQL Server offerings.

## Changing collation

To change the default collation, update to the **Collation** field in the provisioning experience.

For example, if you wanted to change the default collation to case sensitive, change the collation from `SQL_Latin1_General_CP1_CI_AS` to `SQL_Latin1_General_CP1_CS_AS`.

## Collation support

The following table shows which collation types are supported by which service.  

| Collation Type                            | Serverless SQL Pool | Dedicated SQL Pool - Database & Column Level | Dedicated SQL Pool - External Table (Native Support) | Dedicated SQL Pool - External Table (Hadoop/Polybase) |
|:-----------------------------------------:|:-------------------:|:-----------------------:|:------------------:|:------------------:|
| Non-UTF-8 Collations                      | Yes                 | Yes                     | Yes                | Yes                |
| UTF-8                                     | Yes                 | Yes                     | No                 | No                 |
| Japanese_Bushu_Kakusu_140_*               | Yes                 | Yes                     | No                 | No                 |
| Japanese_XJIS_140_*                       | Yes                 | Yes                     | No                 | No                 |
| SQL_EBCDIC1141_CP1_CS_AS                  | No                  | No                      | No                 | No                 |
| SQL_EBCDIC277_2_CP1_CS_AS                 | No                  | No                      | No                 | No                 |

## Checking the current collation

To check the current collation for the database, you can run the following T-SQL snippet:

```sql
SELECT DATABASEPROPERTYEX(DB_NAME(), 'Collation') AS Collation;
```

When passed 'Collation' as the property parameter, the DatabasePropertyEx function returns the current collation for the database specified. For more information, see [DATABASEPROPERTYEX](/sql/t-sql/functions/databasepropertyex-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true).


## Next steps

Additional information on best practices for dedicated SQL pool and serverless SQL pool can be found in the following articles:

- [Best practices for dedicated SQL pool](../sql/best-practices-dedicated-sql-pool.md)
- [Best practices for serverless SQL pool](../sql/best-practices-serverless-sql-pool.md)