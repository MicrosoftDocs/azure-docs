---
title: Azure Database for PostgreSQL server support matrix
description: Provides a summary of support settings and limitations of Azure Database for PostgreSQL server backup.
ms.topic: reference
ms.date: 09/09/2024
ms.custom: references_regions
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Azure Database for PostgreSQL server support matrix

You can use [Azure Backup](./backup-overview.md) to protect Azure Database for PostgreSQL server. This article summarizes supported regions, scenarios, and the limitations.

## Supported regions

Azure Database for PostgreSQL server backup is available in all regions, except for Germany Central (Sovereign), Germany Northeast (Sovereign) and China regions.

## Support scenarios

|Scenarios  | Details  |
|---------| ---------|
|Deployments   |  [Azure Database for PostgreSQL - Single Server](/azure/postgresql/overview#azure-database-for-postgresql---single-server)     |
|Azure PostgreSQL versions    |   9.5, 9.6, 10, 11    |

## Feature considerations and limitations

- Recommended limit for the maximum database size is 400 GB.
- Cross-region backup isn't supported. Therefore, you can't back up an Azure PostgreSQL server to a vault in another region. Similarly, you can only restore a backup to a server within the same region as the vault. However, we support cross-subscription backup and restore. 
- Private endpoint-enabled Azure PostgreSQL servers can be backed up by allowing trusted Microsoft services in the network settings.
- Only the data is recovered during restore; _roles_ aren't restored.
## Next steps

- [Back up Azure Database for PostgreSQL server](backup-azure-database-postgresql.md)
