---
title: sys.sp_cleanup_data_retention (Transact-SQL) - Azure SQL Edge
description: Learn about using sys.sp_cleanup_data_retention (Transact-SQL) in Azure SQL Edge
keywords: sys.sp_cleanup_data_retention (Transact-SQL), SQL Edge
services: sql-edge
ms.service: sql-edge
ms.topic: reference
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 09/22/2020
---

# sys.sp_cleanup_data_retention (Transact-SQL)

**Applies to:** Azure SQL Edge

Performs cleanup of obsolete records from tables that have data retention policies enabled. For more information, see [Data Retention](data-retention-overview.md).

## Syntax

```syntaxsql
sys.sp_cleanup_data_retention
    { [@schema_name = ] 'schema_name' },
    { [@table_name = ] 'table_name' },
    [ [@rowcount =] rowcount OUTPUT ]

```

## Arguments
`[ @schema_name = ] schema_name`
 Is the name of the owning schema for the table on which cleanup needs to be performed. *schema_name* is a required parameter of type **sysname**.

`[ @table_name = ] 'table_name'`
 Is the name of the table on which cleanup operation needs to be performed. *table_name* is a required parameter of type **sysname**.

## Output parameter

`[ @rowcount = ] rowcount OUTPUT`
 rowcount is an optional OUTPUT parameter that represents the number of records cleanup from the table. *rowcount* is int.

## Permissions
 Requires db_owner permissions.

## Next steps
- [Data Retention and Automatic Data Purging](data-retention-overview.md)
- [Manage historical data with retention policy](data-retention-cleanup.md)
- [Enable and disable data retention](data-retention-enable-disable.md)
