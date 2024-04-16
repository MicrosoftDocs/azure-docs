---
title: sys.sp_cleanup_data_retention (Transact-SQL) - Azure SQL Edge
description: sys.sp_cleanup_data_retention performs cleanup of obsolete records from tables that have data retention policies enabled.
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: reference
keywords:
  - sys.sp_cleanup_data_retention (Transact-SQL)
  - SQL Edge
---
# sys.sp_cleanup_data_retention (Transact-SQL)

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

Performs cleanup of obsolete records from tables that have data retention policies enabled. For more information, see [Data Retention](data-retention-overview.md).

## Syntax

```syntaxsql
sys.sp_cleanup_data_retention
    { [ @schema_name = ] 'schema_name' } ,
    { [ @table_name = ] 'table_name' } ,
    [ [ @rowcount = ] rowcount OUTPUT ]
```

## Arguments

#### [ @schema_name = ] '*schema_name*'

The name of the owning schema for the table on which cleanup needs to be performed. *schema_name* is a required parameter of type **sysname**.

#### [ @table_name = ] '*table_name*'

The name of the table on which cleanup operation needs to be performed. *table_name* is a required parameter of type **sysname**.

## Output parameter

#### [ @rowcount = ] rowcount OUTPUT

An optional OUTPUT parameter that represents the number of records cleanup from the table. *rowcount* is **int**.

## Permissions

Requires **db_owner** permissions.

## Next steps

- [Data Retention and Automatic Data Purging](data-retention-overview.md)
- [Manage historical data with retention policy](data-retention-cleanup.md)
- [Enable and disable data retention](data-retention-enable-disable.md)
