---
title: Tutorial - Back up Azure Database for PostgreSQL - Flexible Server via Azure Backup
description: Learn how to back up Azure Database for PostgreSQL - Flexible Server.
ms.topic: tutorial
ms.date: 02/28/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# Tutorial: Back up Azure Database for PostgreSQL - Flexible Server

This tutorial describes how to back up Azure Database for PostgreSQL - Flexible Server using the Azure portal. 

## Prerequisites

Before you back up Azure Database for PostgreSQL - Flexible Server, ensure the following prerequisites are met:

- [Review the supported scenarios and known limitations](backup-azure-database-postgresql-flex-support-matrix.md) of Azure Database for PostgreSQL Flexible server backup.
- Identify or [create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault) in the same region where you want to back up the Azure Database for PostgreSQL Server instance.
- Check that Azure Database for PostgreSQL Server is named in accordance with naming guidelines for Azure Backup. Learn about the [naming conventions](/previous-versions/azure/postgresql/single-server/tutorial-design-database-using-azure-portal#create-an-azure-database-for-postgresql).
- Provide [database user's backup privileges on the database](backup-azure-database-postgresql-overview.md#database-users-backup-privileges-on-the-database).
- Allow access permissions for PostgreSQL - Flexible Server. Learn about the [access permissions](backup-azure-database-postgresql-overview.md#access-permissions-on-the-azure-postgresql-server).
- [Create a back up policy](quick-backup-postgresql-flexible-server-portal.md).

[!INCLUDE [Configure protection for Azure Database for PostgreSQL - Flexible Server.](../../includes/configure-postgresql-flexible-server-backup.md)]

[!INCLUDE [Run an on-demand backup for Azure Database for PostgreSQL - Flexible Server.](../../includes/postgresql-flexible-server-on-demand-backup.md)]


## Track a backup job

Azure Backup service creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. 

To view the backup job status, follow these steps:

1. Go to **Business Continuity Center** > **Monitoring + Reporting** > **Jobs**.

   The **Jobs** pane appears that shows the operation and status for the past **24 hours**.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/view-jobs.png" alt-text="screenshot shows how to view the jobs." lightbox="./media/backup-azure-database-postgresql-flex/view-jobs.png":::

2. Review the list of backup and restore jobs and their status. To view the job details, select a job from the list.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/view-job-details.png" alt-text="screenshot shows how to view the job details." lightbox="./media/backup-azure-database-postgresql-flex/view-job-details.png":::

## Next steps

[Restore Azure Database for PostgreSQL Flexible backups](./restore-azure-database-postgresql-flex.md)
