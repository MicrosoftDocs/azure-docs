---
title: Tutorial - Create the first full backup for Azure Database for PostgreSQL Flexible Server via Azure Backup
description: Learn how to create the first full backup for Azure Database for PostgreSQL Flexible Server.
ms.topic: tutorial
ms.date: 02/17/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# Tutorial: Create the first full backup for Azure Database for PostgreSQL - Flexible Server

This tutorial describes how to create the first full backup for Azure Database for PostgreSQL - Flexible Server using the Azure portal. 

## Prerequisites

Before you configure backup for Azure Database for PostgreSQL Flexible Server, ensure that the following prerequisites are met:

- [Review the supported scenarios and known limitations](./backup-azure-database-postgresql-flex-support-matrix.md) of Azure Database for PostgreSQL Flexible server backup.
- Identify or [create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault) in the same region where you want to back up the Azure Database for PostgreSQL Server instance.
- Check that Azure Database for PostgreSQL Server is named in accordance with naming guidelines for Azure Backup. Learn about the [naming conventions](/previous-versions/azure/postgresql/single-server/tutorial-design-database-using-azure-portal#create-an-azure-database-for-postgresql)
- Provide [database user's backup privileges on the database](backup-azure-database-postgresql-overview.md#database-users-backup-privileges-on-the-database).
- Allow access permissions for PostgreSQL - Flexible Server. Learn about the [access permissions](backup-azure-database-postgresql-overview.md#access-permissions-on-the-azure-postgresql-server).
- [Create a back up policy](backup-azure-database-postgresql-flex.md#create-a-backup-policy).

[!INCLUDE [Configure protection for Azure Database for PostgreSQL - Flexible Server.](../../includes/configure-postgresql-flexible-server-backup.md)]

[!INCLUDE [Run an on-demand backup for Azure Database for PostgreSQL - Flexible Server.](../../includes/postgresql-flexible-server-on-demand-backup.md)]

To track the progress of the on-demand backup, see [this section](backup-azure-database-postgresql-flex.md#track-a-backup-job). 

## Next steps

[Restore Azure Database for PostgreSQL Flexible backups](./restore-azure-database-postgresql-flex.md)
