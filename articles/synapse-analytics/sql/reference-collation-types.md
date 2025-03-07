---
title: Collation support
description: Collation types support for Synapse SQL in Azure Synapse Analytics.
author: filippopovic
ms.author: fipopovi
ms.reviewer: wiassaf
ms.date: 12/11/2024
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: reference
---

# Database collation support for Synapse SQL in Azure Synapse Analytics

Collations provide the locale, code page, sort order, and character sensitivity rules for character-based data types. Once chosen, all columns and expressions requiring collation information inherit the chosen collation from the database setting. The default inheritance can be overridden by explicitly stating a different collation for a character-based data type.

This article applies to dedicated SQL pools in Azure Synapse workspaces, for more information on dedicated SQL pools (formerly SQL DW), see [Collation types supported for dedicated SQL pool (formerly SQL DW)](../sql-data-warehouse/sql-data-warehouse-reference-collation-types.md).

You can change the default database collation from the Azure portal when you create a new dedicated SQL pool database. This capability makes it even easier to create a new database using one of the 3800 supported database collations.

You can specify the default serverless SQL pool database collation at creation time using CREATE DATABASE statement.

> [!NOTE]
> In Azure Synapse Analytics, query text (including variables, constants, etc.) is always handled using the database-level collation, and not the server-level collation as in other SQL Server offerings.

## Change collation

To change the default collation for dedicated SQL pool database, update to the **Collation** field in the provisioning experience. For example, if you wanted to change the default collation to case sensitive, you would change the collation from `SQL_Latin1_General_CP1_CI_AS` to `SQL_Latin1_General_CP1_CS_AS`. 

> [!NOTE]
> Collation cannot be changed on an existing dedicated SQL pool database. If you need to have a different collation at the dedicated SQL pool level, create a new dedicated SQL pool with the required collation. To specify a non-default collation when creating a dedicated SQL pool, use the Azure portal or PowerShell.

To change the default collation for a serverless SQL pool database, you can use ALTER DATABASE statement.

## Collation support

The following table shows which collation types are supported by which service.  

| Collation Type                            | Serverless SQL Pool | Dedicated SQL Pool - Database & Column Level | Dedicated SQL Pool - External Table (Native Support) | Dedicated SQL Pool - External Table (Hadoop/Polybase) |
|:-----------------------------------------:|:-------------------:|:-----------------------:|:------------------:|:------------------:|
| Non-UTF-8 Collations                      | Yes                 | Yes                     | Yes                | Yes                |
| UTF-8                                     | Yes                 | Yes                     | No                 | No                 |
| `Japanese_Bushu_Kakusu_140_*`               | Yes                 | Yes                     | No                 | No                 |
| `Japanese_XJIS_140_*`                       | Yes                 | Yes                     | No                 | No                 |
| `SQL_EBCDIC1141_CP1_CS_AS`                  | No                  | No                      | No                 | No                 |
| `SQL_EBCDIC277_2_CP1_CS_AS`                 | No                  | No                      | No                 | No                 |


## Check the current collation

To check the current collation for the database, you can run the following T-SQL snippet:

```sql
SELECT DATABASEPROPERTYEX(DB_NAME(), 'Collation') AS Collation;
```

When passed 'Collation' as the property parameter, the DatabasePropertyEx function returns the current collation for the database specified. For more information, see [DATABASEPROPERTYEX](/sql/t-sql/functions/databasepropertyex-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true).

## Check supported collation

To check the list of supported collations in your dedicated SQL pool:

```sql
USE master
GO
SELECT * FROM sys.fn_helpcollations();
```

Run the [sys.fn_helpcollations](/sql/relational-databases/system-functions/sys-fn-helpcollations-transact-sql?view=azure-sqldw-latest&preserve-view=true) function from the `master` database.

## Related content

Additional information on best practices for dedicated SQL pool and serverless SQL pool can be found in the following articles:

- [Best practices for dedicated SQL pools in Azure Synapse Analytics](best-practices-dedicated-sql-pool.md)
- [Best practices for serverless SQL pool in Azure Synapse Analytics](best-practices-serverless-sql-pool.md)
