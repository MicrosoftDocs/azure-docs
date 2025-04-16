---
title: Azure Database for PostgreSQL- Flexible server support matrix
description: Provides a summary of support settings and limitations of Azure Database for PostgreSQL- Flexible server backup.
ms.topic: reference
ms.date: 04/11/2025
ms.custom: references_regions, ignite-2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Support matrix for Azure Database for PostgreSQL- Flexible Server

You can use [Azure Backup](./backup-overview.md) to protect Azure Database for PostgreSQL- Flexible Server. This article summarizes supported regions, scenarios, and the limitations.

## Supported regions

Azure Database for PostgreSQL - Flexible server backup is generally available in the following regions: East Asia, Central India, Southeast Asia, UK South, and UK West. However, this feature is currently in preview for other regions.

## Support scenarios

Consider the following support scenarios when you back up Azure Database for PostgreSQL – Flexible Server:

- Vaulted backup restores are only available as **Restore to Files** in user specified storage containers. You can restore this data as a new PostgreSQL - flexible server with the database native tools.
- Backups for the PostgreSQL server are supported when the Backup Vault is in the same or a different subscription as the database, provided they are within the same tenant and region. Restores are supported across regions (Azure Paired) and across subscriptions within the same tenant.
- For vaulted backups, entire server is backed up with all databases. Backup of specific databases isn't supported.
- Vaulted backups are supported for server size **<= 1 TB**. If backup is configured on server size larger than 1 TB, the backup operation fails.
- PostgreSQL - Flexible servers encrypted by Customer Managed Key are supported.
- Private endpoint-enabled Azure Database for PostgreSQL - Flexible servers can be backed up by allowing trusted Microsoft services in the network settings.
- Backups for PostgreSQL Flexible servers exclude databases owned by `azuresu` or `azure_pg_admin`, including the native PostgreSQL database. So, databases with these owners can't be backed up or restored.

## Limitation

Azure Database for PostgreSQL – Flexible Server backups include the following limitations:

- Vaulted backup doesn't support storage in archive tier.
- Vaulted backup isn't supported on replicas; backup can be configured only on primary servers.
- For restore operation, item level recovery (recovery of specific databases) isn't supported.
- Only one weekly backup is currently supported. If multiple vaulted backups are scheduled in a week, only the first backup operation of the week is executed, and the subsequent backup jobs in the same week fail.”
- Vaulted backups don't support tables containing a row with **BYTEA length exceeding 500 MB**.
- Vaulted backups support full backups only; incremental or differential backups aren't supported.



## Next steps

- [Back up Azure Database for PostgreSQL -Flexible Server using Azure portal](tutorial-create-first-backup-azure-database-postgresql-flex.md).
