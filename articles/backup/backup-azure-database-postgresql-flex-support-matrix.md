---
title: Azure Database for PostgreSQL- Flexible server (Preview) support matrix
description: Provides a summary of support settings and limitations of Azure Database for PostgreSQL- Flexible server backup.
ms.topic: conceptual
ms.date: 11/06/2023
ms.custom: references_regions
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Azure Database for PostgreSQL- Flexible server (Preview)  support matrix

You can use [Azure Backup](./backup-overview.md) to protect Azure Database for PostgreSQL- Flexible server. This article summarizes supported regions, scenarios, and the limitations.

## Supported regions

Azure Database for PostgreSQL server backup is in preview. Currently, it is available in the following regions:

- East US
- Central India
- West Europe

## Support scenarios

PostgreSQL Flexible Server backup data can be recovered in user specified storage containers that can be used to re-build the PostgreSQL flexible server. Customers can restore this data as a new PostgreSQL flexible server with DB native tools. 

## Feature considerations and limitations

- Currently, backing up individual databases is not supported. You can only back up the entire server.


## Next steps

- [Back up Azure Database for PostgreSQL server](backup-azure-database-postgresql-flex.md)
