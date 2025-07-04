---
title: Tutorial - Back up Azure Database for PostgreSQL - Flexible Server using Azure portal
description: Learn how to back up Azure Database for PostgreSQL - Flexible Server using Azure portal.
ms.topic: tutorial
ms.date: 02/28/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a database administrator, I want to back up Azure Database for PostgreSQL - Flexible Server using the Azure portal, so that I can ensure data protection and recovery in case of unexpected data loss."
---

# Tutorial: Back up Azure Database for PostgreSQL - Flexible Server using Azure portal

This tutorial describes how to back up Azure Database for PostgreSQL - Flexible Server using the Azure portal. 

## Prerequisites

Before you back up Azure Database for PostgreSQL - Flexible Server, ensure the following prerequisites are met:

[!INCLUDE [Prerequisites for backup of Azure Database for PostgreSQL - Flexible Server.](../../includes/backup-postgresql-flexible-server-prerequisites.md)]


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

[Restore Azure Database for PostgreSQL - Flexible Server using Azure portal](./restore-azure-database-postgresql-flex.md).
