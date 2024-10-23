---
title: Azure Database for PostgreSQL- Flexible server support matrix (preview)
description: Provides a summary of support settings and limitations of Azure Database for PostgreSQL- Flexible server backup.
ms.topic: reference
ms.date: 09/09/2024
ms.custom: references_regions
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure Database for PostgreSQL- Flexible server (preview)

You can use [Azure Backup](./backup-overview.md) to protect Azure Database for PostgreSQL- Flexible server. This article summarizes supported regions, scenarios, and the limitations.

## Supported regions

Azure Database for PostgreSQL server backup (preview) is now available in all public regions.

## Support scenarios

PostgreSQL Flexible Server backup data can be recovered in user specified storage containers that can be used to re-build the PostgreSQL flexible server. You can restore this data as a new PostgreSQL - flexible server with the database native tools.

## Limitation

- Currently, backing up individual databases is not supported. You can only back up the entire server.


## Next steps

- [Back up Azure Database for PostgreSQL -flex server (preview)](backup-azure-database-postgresql-flex.md).
