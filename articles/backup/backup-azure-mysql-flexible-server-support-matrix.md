---
title: Support matrix for Azure Database for MySQL - Flexible Server retention for long term by using Azure Backup
description: Provides a summary of support settings and limitations when backing up Azure Database for MySQL - Flexible Server.
ms.topic: conceptual
ms.date: 03/08/2024
ms.custom: references_regions
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure Database for MySQL - Flexible Server protection by using Azure Backup (preview)

This article summarizes  the supported scenarios, considerations, and limitations for Azure Database for MySQL - Flexible Server backup and retention for long term by using [Azure Backup](./backup-overview.md).

## Supported regions

Long-term retention for Azure Database for MySQL - Flexible Server (preview) is available in all Azure public cloud regions.

## Supported scenarios

- This feature backs up the entire MySQL - Flexible Server to the Backup vault.
- You can recover the MySQL - Flexible Server long-term retention (LTR) data in the specified storage containers that allow to rebuild the MySQL - Flexible Server. You can also restore this data as a new MySQL - Flexible Server with database native tools. 

## Limitations
- Individual database-level granular selection is currently not supported.
- End-to-end creation and restoration of MySQL - Flexible Server by using Azure Backup is currently not supported. 

## Next steps

- [About Azure Database for MySQL - Flexible Server retention for long term (preview)](backup-azure-mysql-flexible-server-about.md).
- [Back up an Azure Database for MySQL - Flexible Server (preview)](backup-azure-mysql-flexible-server.md).
- [Restore an Azure Database for MySQL - Flexible Server (preview)](backup-azure-mysql-flexible-server-restore.md).