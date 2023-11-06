---
title: Back up Azure Database for PostgreSQL Flexible server backup
description: Learn about Azure Database for PostgreSQL Flexible server backup with long-term retention
ms.topic: conceptual
ms.date: 11/06/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Azure Database for PostgreSQL Flexible server backup with long-term retention

This article describes how to back up Azure Database for PostgreSQL-Flex server. Before you begin, review the [supported configurations, feature considerations and known limitations](./backup-azure-database-postgresql-flex-support-matrix.md)

## Configure backup on Azure PostgreSQL-Flexible server databases

To configure backup on the Azure PostgreSQL-flex databases using Azure Backup, follow these steps:

1. Go to **Backup vault** > **+Backup**.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/adding-backup-inline.png" alt-text="Screenshot showing the option to add a backup.":::

   Alternatively, you can navigate to this page from the [Backup center](./backup-center-overview.md). 

1. Select the data source type as **Azure Database for PostgreSQL flexible servers (Preview)**
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/create-or-add-backup-policy-inline.png" alt-text="Screenshot showing the option to add a backup policy.":::

1. Select or [create](#create-backup-policy) a Backup Policy that defines the backup schedule and the retention duration.
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/backup-policy.png" alt-text="Screenshot showing the option to edit a backup policy.":::

1. Select **Next** to choose the Azure PostgreSQL-Flex server to back up. Then select **Add** to select the PostgreSQL-Flex server to be backed up.
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/select-server.png" alt-text="Screenshot showing the select server option.":::

1. Choose one of the Azure PostgreSQL-Flex servers across subscriptions if they're in the same region as that of the vault. Expand the arrow to see the list of databases within a server.
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/select-resources.png" alt-text="Screenshot showing the select resources option.":::

1. After the selection, the validation starts. The backup readiness check ensures the vault has sufficient permissions for backup operations. Resolve any access issues by selecting **Assign missing roles** action button in the top action menu to grant permissions.
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/assign-missing-roles.png" alt-text="Screenshot showing the **Assign missing roles** option.":::

1. Submit the configure backup operation and track the progress under **Backup instances**.
     

## Create Backup policy

You can create a Backup policy on the go during the configure backup flow. Alternatively, go to **Backup center** -> **Backup policies** -> **Add**.

1. Enter a name for the new policy.

1. Select the data source type as **Azure Database for PostgreSQL flexible servers (Preview)** 
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/select-datasource.png" alt-text="Screenshot showing the select datasource process.":::

1. Define the Backup schedule.

   Currently, only Weekly backup option is available. However, you can schedule the backups on multiple days of the week.
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/schedule.png" alt-text="Screenshot showing the schedule process for the new policy.":::

1. Define **Retention** settings.

   You can add one or more retention rules. Each retention rule assumes inputs for specific backups, and data store and retention duration for those backups.
    
    >[!Note]
    > Retention duration ranges from seven days to 10 years in the Backup data store.

>[!Note]
>The retention rules are evaluated in a pre-determined order of priority. The priority is the highest for the yearly rule, followed by the monthly, and then the weekly rule. Default retention settings are applied when no other rules qualify. For example, the same recovery point may be the first successful backup taken every week as well as the first successful backup taken every month. However, as the monthly rule priority is higher than that of the weekly rule, the retention corresponding to the first successful backup taken every month applies.


## Run an on-demand backup

To trigger a backup not in the schedule specified in the policy, go to **Backup instances** -> **Backup Now**.
Choose from the list of retention rules that were defined in the associated Backup policy.

:::image type="content" source="./media/backup-azure-database-postgresql/navigate-to-retention-rules-inline.png" alt-text="Screenshot showing the option to navigate to the list of retention rules that were defined in the associated Backup policy." lightbox="./media/backup-azure-database-postgresql/navigate-to-retention-rules-expanded.png":::


## Track a backup job

Azure Backup service creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. To view the backup job status:

1. Go to the **Backup instance** screen.

   It shows the jobs dashboard with operation and status for the past seven days.

   :::image type="content" source="./media/backup-azure-database-postgresql/postgre-jobs-dashboard-inline.png" alt-text="Screenshot showing the Jobs dashboard." lightbox="./media/backup-azure-database-postgresql/postgre-jobs-dashboard-expanded.png":::

1. To view the status of the backup job, select **View all** to see ongoing and past jobs of this backup instance.

   :::image type="content" source="./media/backup-azure-database-postgresql/postgresql-jobs-view-all-inline.png" alt-text="Screenshot showing to select the View all option." lightbox="./media/backup-azure-database-postgresql/postgresql-jobs-view-all-expanded.png":::

## Next steps

- [Azure Backup pricing information for PostgreSQL](https://azure.microsoft.com/pricing/details/backup/)
- [Troubleshoot PostgreSQL database backup by using Azure Backup](backup-azure-database-postgresql-troubleshoot.md)