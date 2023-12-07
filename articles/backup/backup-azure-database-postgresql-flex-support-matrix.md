---
title: Azure Database for PostgreSQL- Flexible server support matrix (preview)
description: Provides a summary of support settings and limitations of Azure Database for PostgreSQL- Flexible server backup.
ms.topic: conceptual
ms.date: 11/06/2023
ms.custom: references_regions
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure Database for PostgreSQL- Flexible server (preview)

You can use [Azure Backup](./backup-overview.md) to protect Azure Database for PostgreSQL- Flexible server. This article summarizes supported regions, scenarios, and the limitations.

## Supported regions

Azure Database for PostgreSQL server backup (preview) currently supports East US, Central India, and West Europe regions.

## Support scenarios

PostgreSQL Flexible Server backup data can be recovered in user specified storage containers that can be used to re-build the PostgreSQL flexible server. Customers can restore this data as a new PostgreSQL flexible server with DB native tools. 

## Limitation

- Currently, backing up individual databases is not supported. You can only back up the entire server.


## Next steps

- [Back up Azure Database for PostgreSQL -flex server (preview)](backup-azure-database-postgresql-flex.md).
