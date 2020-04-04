---
title: Transparent Data Encryption (Portal)
description: Transparent Data Encryption (TDE) in Azure Synapse Analytics
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

To enable TDE, follow the steps below:

1. Open the database in the [Azure portal](https://portal.azure.com)
2. In the database blade, click the **Settings** button
3. Select the **Transparent data encryption** option
   ![portal settings](./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings.png)
4. Select the **On** setting
   ![portal settings on](./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings-on.png)
5. Select **Save**
   ![portal settings save](./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings-save.png)  

## Disabling Encryption

To disable TDE, follow the steps below:

1. Open the database in the [Azure portal](https://portal.azure.com)
2. In the database blade, click the **Settings** button
3. Select the **Transparent data encryption** option
   ![portal settings](./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings.png)
4. Select the **Off** setting
   ![portal settings off](./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings-off.png)
5. Select **Save**
   ![portal setting save 2](./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings-save2.png)  

## Encryption DMVs

Encryption can be confirmed with the following DMVs:

* [sys.databases](/sql/relational-databases/system-catalog-views/sys-databases-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest)
* [sys.dm_pdw_nodes_database_encryption_keys](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-nodes-database-encryption-keys-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest)
