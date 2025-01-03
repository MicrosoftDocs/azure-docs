---
title: Azure Database for PostgreSQL- Flexible server support matrix
description: Provides a summary of support settings and limitations of Azure Database for PostgreSQL- Flexible server backup.
ms.topic: reference
ms.date: 12/17/2024
ms.custom: references_regions, ignite-2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure Database for PostgreSQL- Flexible server (preview)

You can use [Azure Backup](./backup-overview.md) to protect Azure Database for PostgreSQL- Flexible server. This article summarizes supported regions, scenarios, and the limitations.

## Supported regions

Azure Database for PostgreSQL - Flexible server backup is now available in all public regions.

## Support scenarios

- PostgreSQL Flexible Server backup data can be recovered in user specified storage containers that can be used to rebuild the PostgreSQL flexible server. You can restore this data as a new PostgreSQL - flexible server with the database native tools.

- Only weekly backups are supported with option to opt for one day in the week on which backup is initiated.

- Both Cross Region and Cross Subscription backups are supported.

- Recommended limit for the maximum server size is 4 TB.

- Recommended backup frequency for backing up a server is Weekly. In case you opt for Daily backup and observe failures, we recommend decreasing the frequency while relying on automated backup solution to achieve required RPO.  

- PostgreSQL - Flexible servers encrypted by Customer Managed Key are supported.

- Private endpoint-enabled Azure PostgreSQL flexible servers can be backed up by allowing trusted Microsoft services in the network settings.


## Limitation

-  Currently, restoring backups directly to flexible server isn't supported.

-  Currently, backing up individual databases isn't supported. You can only back up the entire server.


## Next steps

- [Back up Azure Database for PostgreSQL -flex server](backup-azure-database-postgresql-flex.md).
