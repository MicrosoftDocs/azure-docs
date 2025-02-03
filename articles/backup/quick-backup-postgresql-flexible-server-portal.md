---
title: "Quickstart: Configure Backup for an Azure PostgreSQL - Flexible Server using Azure portal"
description: Learn how to configure backup for your Azure PostgreSQL - Flexible Server with Azure portal.
ms.devlang: terraform
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 02/17/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

#  Quickstart: Configure backup for Azure Database for PostgreSQL - Flexible Server using Azure portal

This quickstart describes how to configure backup for Azure Database for PostgreSQL - Flexible Server to an Azure Backup Vault using Azure portal.

[!INCLUDE [Prerequisites for backup of Azure Database for PostgreSQL - Flexible Server.](../../includes/backup-postgresql-flexible-server-prerequisites.md)]

[!INCLUDE [Configure protection for Azure Database for PostgreSQL - Flexible Server.](../../includes/configure-postgresql-flexible-server-backup.md)]

To track the progress of the backup configuration, go to **Business Continuity Center** > **Monitoring + Reporting** > **Jobs**. Once the backup configuration is complete, you can [run an on-demand backup](backup-azure-database-postgresql-flex.md#run-an-on-demand-backup) to take the first full backup of the database.


## Next steps

[Restore Azure Database for PostgreSQL Flexible backups](./restore-azure-database-postgresql-flex.md)
