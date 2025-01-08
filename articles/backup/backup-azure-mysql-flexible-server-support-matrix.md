---
title: Support Matrix for Azure Database for MySQL - Flexible Server Retention for the Long Term by Using Azure Backup
description: This article provides a summary of support settings and limitations when you're backing up Azure Database for MySQL - Flexible Server.
ms.topic: reference
ms.date: 11/21/2024
ms.custom: references_regions
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure Database for MySQL - Flexible Server protection by using Azure Backup (preview)

[!INCLUDE [Azure Database for MySQL - Flexible Server backup advisory](../../includes/backup-mysql-flexible-server-advisory.md)]

This article summarizes the supported scenarios, considerations, and limitations for Azure Database for MySQL - Flexible Server backup and long-term retention by using [Azure Backup](./backup-overview.md).

## Supported regions

Long-term retention for Azure Database for MySQL - Flexible Server (preview) is available in all Azure public cloud regions.

## Supported scenarios

- This feature backs up the entire Azure Database for MySQL flexible server to a Backup vault.
- You can recover the Azure Database for MySQL - Flexible Server long-term retention (LTR) data in the specified storage containers that you use to rebuild the Azure Database for MySQL flexible server. You can also restore this data as a new Azure Database for MySQL flexible server with database native tools.

## Limitations

- Individual database-level granular selection is currently not supported.
- End-to-end creation and restoration of Azure Database for MySQL - Flexible Server by using Azure Backup is currently not supported.

## Related content

- [Long-term retention for Azure Database for MySQL - Flexible Server by using Azure Backup](backup-azure-mysql-flexible-server-about.md)
- [Back up an Azure Database for MySQL flexible server (preview)](backup-azure-mysql-flexible-server.md)
- [Restore an Azure Database for MySQL flexible server (preview)](backup-azure-mysql-flexible-server-restore.md)
