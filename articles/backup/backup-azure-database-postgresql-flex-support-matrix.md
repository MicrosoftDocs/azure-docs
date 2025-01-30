---
title: Azure Database for PostgreSQL- Flexible server support matrix
description: Provides a summary of support settings and limitations of Azure Database for PostgreSQL- Flexible server backup.
ms.topic: reference
ms.date: 02/17/2025
ms.custom: references_regions, ignite-2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Support matrix for Azure Database for PostgreSQL- Flexible Server

You can use [Azure Backup](./backup-overview.md) to protect Azure Database for PostgreSQL- Flexible Server. This article summarizes supported regions, scenarios, and the limitations.

## Supported regions

Azure Database for PostgreSQL - Flexible server backup is now available in all public regions.

## Support scenarios

Consider the following support scenarios when you back up Azure Database for PostgreSQL – Flexible Server:

- PostgreSQL Flexible Server backup data can be recovered in user specified storage containers that can be used to rebuild the PostgreSQL flexible server. You can restore this data as a new PostgreSQL - flexible server with the database native tools.

- Backups for the PostgreSQL server are supported when the Backup Vault is in the same or a different subscription as the database, provided they are within the same tenant and region. Restores are supported across regions (Azure Paired) and across subscriptions within the same tenant.

- Recommended limit for the maximum server size is 4 TB.  

- PostgreSQL - Flexible servers encrypted by Customer Managed Key are supported.

- Private endpoint-enabled Azure PostgreSQL flexible servers can be backed up by allowing trusted Microsoft services in the network settings.

- Backups for PGSQLFlex will exclude databases owned by `azuresu` or `azure_pg_admin`, including the native `postgres` database. As a result, databases with these owners cannot be backed up or restored. 


## Limitation

Azure Database for PostgreSQL – Flexible Server backups include the following limitations:

- Restoring backups directly to the flexible server isn't supported.
- Backing up individual databases isn't supported; only the entire server can be backed up.

## Next steps

- [Back up Azure Database for PostgreSQL -flex server](backup-azure-database-postgresql-flex.md).
