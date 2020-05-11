---
title: Transparent data encryption (T-SQL)
description: Transparent data encryption (TDE) in Azure Synapse Analytics (T-SQL)
services: synapse-analytics
author: julieMSFT
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 04/30/2019
ms.author: jrasnick
ms.reviewer: rortloff
ms.custom: seo-lt-2019
---

# Get started with Transparent Data Encryption (TDE)

> [!div class="op_single_selector"]
>
> * [Security Overview](sql-data-warehouse-overview-manage-security.md)
> * [Authentication](sql-data-warehouse-authentication.md)
> * [Encryption (Portal)](sql-data-warehouse-encryption-tde.md)
> * [Encryption (T-SQL)](sql-data-warehouse-encryption-tde-tsql.md)

## Required Permissions

To enable Transparent Data Encryption (TDE), you must be an administrator or a member of the dbmanager role.

## Enabling Encryption

Follow these steps to enable TDE:

1. Connect to the *master* database on the server hosting the database using a login that is an administrator or a member of the **dbmanager** role in the master database
2. Execute the following statement to encrypt the database.

```sql
ALTER DATABASE [AdventureWorks] SET ENCRYPTION ON;
```

## Disabling Encryption

Follow these steps to disable TDE:

1. Connect to the *master* database using a login that is an administrator or a member of the **dbmanager** role in the master database
2. Execute the following statement to encrypt the database.

```sql
ALTER DATABASE [AdventureWorks] SET ENCRYPTION OFF;
```

> [!NOTE]
> A paused SQL pool must be resumed before making changes to the TDE settings.

## Verifying Encryption

To verify encryption status, follow the steps below:

1. Connect to the *master* or instance database using a login that is an administrator or a member of the **dbmanager** role in the master database
2. Execute the following statement to encrypt the database.

```sql
SELECT
    [name],
    [is_encrypted]
FROM
    sys.databases;
```

A result of ```1``` indicates an encrypted database, ```0``` indicates a non-encrypted database.

## Encryption DMVs

* [sys.databases](/sql/relational-databases/system-catalog-views/sys-databases-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest)
* [sys.dm_pdw_nodes_database_encryption_keys](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-nodes-database-encryption-keys-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest)
