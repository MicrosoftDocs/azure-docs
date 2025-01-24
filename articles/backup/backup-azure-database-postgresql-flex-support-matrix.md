---
title: Azure Database for PostgreSQL- Flexible Server support matrix
description: Provides a summary of support settings and limitations of Azure Database for PostgreSQL- Flexible Server backup.
ms.topic: reference
ms.date: 02/17/2025
ms.custom: references_regions, ignite-2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Support matrix for Azure Database for PostgreSQL- Flexible Server

You can use [Azure Backup](backup-overview.md) to protect Azure Database for PostgreSQL – Flexible Server. This article summarizes supported regions, scenarios, and the limitations.

## Supported regions

Azure Database for PostgreSQL – Flexible Server backup is now available in all public regions.

## Support scenarios

PostgreSQL – Flexible Server backup data can be recovered in specified storage containers to rebuild the server. Restore this data as a new server using the database's native tools.

## Limitation

Here are some important limitations about PostgreSQL – Flexible Server backups:

- Backing up individual databases is currently not supported; only the entire server can be backed up.
- Long-term retention is currently supported only with Vault-Standard tier backup.


## Next steps

- [Back up Azure Database for PostgreSQL -flex server](backup-azure-database-postgresql-flex.md).
