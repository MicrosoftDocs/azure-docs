---
title: Collation support
description: Collation types support for Synapse SQL in Azure Synapse Analytics
author: filippopovic
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: sql
ms.date: 04/15/2020
ms.author: fipopovi
ms.reviewer: fipopovi
---

# Database collation support for Synapse SQL in Azure Synapse Analytics 

Collations provide the locale, code page, sort order, and character sensitivity rules for character-based data types. Once chosen, all columns and expressions requiring collation information inherit the chosen collation from the database setting. The default inheritance can be overridden by explicitly stating a different collation for a character-based data type.

You can change the default database collation from the Azure portal when you create a new dedicated SQL pool database. This capability makes it even easier to create a new database using one of the 3800 supported database collations.

You can specify the default serverless SQL pool database collation at creation time using CREATE DATABASE statement.

> [!NOTE]
> In Azure Synapse Analytics, query text (including variables, constants, etc.) is always handled using the database-level collation, and not the server-level collation as in other SQL Server offerings.

## Change collation
To change the default collation for dedicated SQL pool database, update to the Collation field in the provisioning experience. For example, if you wanted to change the default collation to case sensitive, you would rename the Collation from SQL_Latin1_General_CP1_CI_AS to SQL_Latin1_General_CP1_CS_AS. 

To change the default collation for a serverless SQL pool database, you can use ALTER DATABASE statement.

## Special Collation type support

The following table shows which special collation types are supported by which service.  If a Collation Types is not listed, it should be supported across the options in the table.

| Collation Type                            | Serverless SQL Pool | Dedicated SQL Pool - Database & Column Level | Dedicated SQL Pool - External Table (Native Support) | Dedicated SQL Pool - External Table (Hadoop/Polybase) |
|:-----------------------------------------:|:-------------------:|:-----------------------:|:------------------:|:------------------:|
| UTF-8                                     | Yes                 | Yes                     | Yes                | No                 |
| Japanese_Bushu_Kakusu_140_*               | Yes                 | Yes                     | Yes                | No                 |
| Japanese_XJIS_140_*                       | Yes                 | Yes                     | Yes                | No                 |
| Non-UTF-8 Collations                      | Yes                 | Yes                     | Yes                | No                 |
| SQL_EBCDIC1141_CP1_CS_AS                  | No                  | No                      | No                 | No                 |
| SQL_EBCDIC277_2_CP1_CS_AS                 | No                  | No                      | No                 | No                 |


## Check the current collation
To check the current collation for the database, you can run the following T-SQL snippet:
```sql
SELECT DATABASEPROPERTYEX(DB_NAME(), 'Collation') AS Collation;
```
When passed 'Collation' as the property parameter, the DatabasePropertyEx function returns the current collation for the database specified. You can learn more about the DatabasePropertyEx function on MSDN.

## Next steps

Additional information on best practices for dedicated SQL pool and serverless SQL pool can be found in the following articles:

- [Best Practices for dedicated SQL pool](./best-practices-dedicated-sql-pool.md)
- [Best practices for serverless SQL pool](./best-practices-serverless-sql-pool.md)
