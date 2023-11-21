---
title: Back up Azure Database for PostgreSQL Flexible server with long-term retention (preview) 
description: Learn about Azure Database for PostgreSQL Flexible server backup with long-term retention.
ms.topic: conceptual
ms.date: 11/06/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure Database for PostgreSQL Flexible server with long-term retention (preview) 

This article describes how to back up Azure Database for PostgreSQL-Flex server. 

[Learn about](./backup-azure-database-postgresql-flex-support-matrix.md) the supported scenarios and known limitations of Azure Database for PostgreSQL Flexible server backup.

## Configure backup 

To configure backup on the Azure PostgreSQL-flex databases using Azure Backup, follow these steps:

1. Create a [Backup vault](./create-manage-backup-vault.md#create-a-backup-vault).

1. Go to **Backup vault** > **+Backup**.

   :::image type="content" source="./media/backup-azure-database-postgresql-flex/adding-backup-inline.png" alt-text="Screenshot showing the option to add a backup.":::

   Alternatively, go to **Backup center** and select **+Backup**. 

1. Select the data source type as **Azure Database for PostgreSQL flexible servers (Preview)**.
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/create-or-add-backup-policy-inline.png" alt-text="Screenshot showing the option to add a backup policy.":::

1. Select or [create](#create-a-backup-policy) a Backup Policy to define the backup schedule and the retention duration.
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/backup-policy.png" alt-text="Screenshot showing the option to edit a backup policy.":::

1. Select **Next** then select **Add** to select the PostgreSQL-Flex server that you want to back up.
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/select-server.png" alt-text="Screenshot showing the select server option.":::

1. Choose one of the Azure PostgreSQL-Flex servers across subscriptions if they're in the same region as that of the vault. Expand the arrow to see the list of databases within a server.
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/select-resources.png" alt-text="Screenshot showing the select resources option.":::

1. After the selection, the validation starts. The backup readiness check ensures the vault has sufficient permissions for backup operations. Resolve any access issues by granting appropriate [permissions](/azure/backup/backup-azure-database-postgresql-flex-overview) to the vault MSI and re-triggering the validation.
1. Submit the configure backup operation and track the progress under **Backup instances**.
     

## Create a backup policy

To create a backup policy, follow these steps: 

1. In the Backup vault you created, go to **Backup policies** and select **Add**. Alternatively, go to **Backup center** > **Backup policies** > **Add**.

1. Enter a name for the new policy.

1. Select the data source type as **Azure Database for PostgreSQL flexible servers (Preview)**. 
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/select-datasource.png" alt-text="Screenshot showing the select datasource process.":::

1. Specify the Backup schedule.

   Currently, only Weekly backup option is available. However, you can schedule the backups on multiple days of the week.
   :::image type="content" source="./media/backup-azure-database-postgresql-flex/schedule.png" alt-text="Screenshot showing the schedule process for the new policy.":::

1. Specify **Retention** settings.

   You can add one or more retention rules. Each retention rule assumes inputs for specific backups, and data store and retention duration for those backups.
    
    >[!Note]
    > Retention duration ranges from seven days to 10 years in the Backup data store.

    >[!Note]
    >The retention rules are evaluated in a pre-determined order of priority. The priority is the highest for the yearly rule, followed by the monthly, and then the weekly rule. Default retention settings are applied when no other rules qualify. For example, the same recovery point may be the first successful backup taken every week as well as the first successful backup taken every month. However, as the monthly rule priority is higher than that of the weekly rule, the retention corresponding to the first successful backup taken every month applies.
    

## Run an on-demand backup

To trigger a backup not in the schedule specified in the policy, go to **Backup instances** > **Backup Now**.
Choose from the list of retention rules that were defined in the associated Backup policy.

:::image type="content" source="./media/backup-azure-database-postgresql/navigate-to-retention-rules-inline.png" alt-text="Screenshot showing the option to navigate to the list of retention rules that were defined in the associated Backup policy." lightbox="./media/backup-azure-database-postgresql/navigate-to-retention-rules-expanded.png":::


## Track a backup job

Azure Backup service creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. 

To view the backup job status:

1. Go to the **Backup instance** screen.

   It shows the jobs dashboard with operation and status for the past seven days.

   :::image type="content" source="./media/backup-azure-database-postgresql/postgre-jobs-dashboard-inline.png" alt-text="Screenshot showing the Jobs dashboard." lightbox="./media/backup-azure-database-postgresql/postgre-jobs-dashboard-expanded.png":::

1. To view the status of the backup job, select **View all** to see ongoing and past jobs of this backup instance.

   :::image type="content" source="./media/backup-azure-database-postgresql/postgresql-jobs-view-all-inline.png" alt-text="Screenshot showing to select the View all option." lightbox="./media/backup-azure-database-postgresql/postgresql-jobs-view-all-expanded.png":::

## Next steps

[Restore Azure Database for PostgreSQL Flexible backups (preview)](./restore-azure-database-postgresql-flex.md)