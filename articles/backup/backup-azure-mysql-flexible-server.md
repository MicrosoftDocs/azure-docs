---
title: Back up the Azure Database for MySQL - Flexible Server by using Azure Backup
description: Learn how to back up the Azure Database for MySQL - Flexible Server.
ms.topic: how-to
ms.date: 03/08/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up the Azure Database for MySQL - Flexible Server by using Azure Backup (preview)

This article describes how to back up the Azure Database for MySQL - Flexible Server by using Azure Backup.

>[!Important]
>- Currently, this feature supports only the *Weekly backup* option. However, you can schedule the backups on multiple days of the week. 
>- Retention duration ranges from *7 days* to *10 years* in the *Backup data store*.
>- Each retention rule requires inputs for specific backups, data store, and retention duration for the backups.
>- The retention rules are evaluated in a pre-determined order of priority. The priority is the highest for the yearly rule, followed by the monthly, and then the weekly rule. Default retention settings are applied when no other rules qualify. For example, the same recovery point may be the first successful backup taken every week as well as the first successful backup taken every month. However, as the monthly rule priority is higher than that of the weekly rule, the retention corresponding to the first successful backup taken every month applies.
>- By default, the retention rule is set to *3 months* if no retention rule is set.
  

Learn more about the [supported scenarios. considerations, and limitations](backup-azure-mysql-flexible-server-support-matrix.md).

## Create a backup policy for the Azure MySQL - Flexible Server database backup

To create a backup policy, follow these steps:

1. [Create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

2. Go to the *Backup vault* > **+Backup** to open the **Configure backup** page.
3. To create a new backup policy, under **Backup policy**, select **Create new**.


   :::image type="content" source="./media/backup-azure-mysql-flexible-server/create-backup-policy.png" alt-text="Screenshot shows how to start creating the new backup policy." lightbox="./media/backup-azure-mysql-flexible-server/create-backup-policy.png":::

4. On the **Create Backup Policy** page, enter a name for the new policy, and then select **Azure Database for MySQL (Preview)** as the **Datasource type**.

5. On the **Schedule + retention** tab, define the **Backup schedule**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/schedule-retention-final.png" alt-text="Screenshot shows the process to configure the backup schedule." lightbox="./media/backup-azure-mysql-flexible-server/schedule-retention-final.png":::

   

   Define the **Retention** settings.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/add-retention.png" alt-text="Screenshot shows how to configure the retention duration." lightbox="./media/backup-azure-mysql-flexible-server/add-retention.png":::

   You can add one or more retention rules. To add more retention rules, select **Add**.

6. You can move the backups from *backup data store* to *archive data store* once they expire as per the backup policy.

   To archive backups on expiry, select **On-expiry**.

      >[!Note]
   >- Retention duration ranges from *7 days* to *10 years* in the *Backup data store*.
   >- As per the pre-determined order of priority, the retention with the *yearly* rule selected has the highest priority, followed by the monthly, and then the weekly rule. By default, the retention rule is set to *3 months* if no retention rule is set. 

7. Select **Review + create**.   

## Configure backup on Azure Database for MySQL - Flexible Server

You can configure backup for the entire Azure databases for MySQL - Flexible Server.

To configure backup, follow these steps:

1. On the **Azure portal**, go to *Backup vault* > **+Backup**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/configure-backup.png" alt-text="Screenshot shows how to start the backup configuration." lightbox="./media/backup-azure-mysql-flexible-server/configure-backup.png":::

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/configure-backup-basic.png" alt-text="Screenshot shows the Basic tab on the configuration page." lightbox="./media/backup-azure-mysql-flexible-server/configure-backup-basic.png":::

   Alternatively, go to **Backup center** >  **+Backup**.
 
2. Select the backup policy you created, which defines the backup schedule and the retention duration.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/configure-backup-policy.png" alt-text="Screenshot shows the selection of the backup policy." lightbox="./media/backup-azure-mysql-flexible-server/configure-backup-policy.png":::

3. Select the **Azure Database for MySQL - Flexible Server** to back up.

   You can choose an Azure Database for MySQL - Flexible Servers across subscriptions if they're in the same region as that of the vault.   

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/datasources-select-resources.png" alt-text="Screenshot shows the selection of the database server for backup." lightbox="./media/backup-azure-mysql-flexible-server/datasources-select-resources.png":::

4. Select **Add** and choose the Azure Database for MySQL - Flexible Server that you want to back up.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/datasources.png" alt-text="Screenshot shows the selection of the datasource type." lightbox="./media/backup-azure-mysql-flexible-server/datasources.png":::

   After the selection, the backup readiness check validates to ensure the configuration is correct. 

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/datasources-readiness-check.png" alt-text="Screenshot shows the validation is successful." lightbox="./media/backup-azure-mysql-flexible-server/datasources-readiness-check.png":::

5. To resolve any access issues, select **Assign missing roles**.  
 
 
6. Review  the configuration details, and then select **Configure Backup**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/create-backup-policy-final.png" alt-text="Screenshot shows how to finish the backup configuration." lightbox="./media/backup-azure-mysql-flexible-server/create-backup-policy-final.png":::

   To track the progress, go to **Backup Instances**.

## Run an on-demand backup

To trigger an on-demand backup (that's not in the schedule specified in the policy), follow these steps:

1. Go to the *Backup vault* > **Backup Instances**, and then select the *backup instance* for which you want to take backup.

2. Select **Backup Now**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/backup-instances.png" alt-text="Screenshot shows how to run an on-demand backup." lightbox="./media/backup-azure-mysql-flexible-server/backup-instances.png":::

3. On the *MySQL database instance* page, choose a retention rule from the list.
4. Select **Backup now**.

## Monitor a backup job

Azure Backup creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. To view the backup job status, go to **Backup jobs**.

:::image type="content" source="./media/backup-azure-mysql-flexible-server/track-backup-jobs.png" alt-text="Screenshot shows the list of backup jobs." lightbox="./media/backup-azure-mysql-flexible-server/track-backup-jobs.png":::

It shows the **Backup jobs** dashboard with the operations and status for the *past seven days*. You can select the time range and other filters to narrow down your selection.
 
To view the status of all backup jobs, select **All** as the **Status**. The ongoing and past jobs of the backup instance appear.

:::image type="content" source="./media/backup-azure-mysql-flexible-server/review-track-backup-jobs.png" alt-text="Screenshot shows how to view all jobs." lightbox="./media/backup-azure-mysql-flexible-server/review-track-backup-jobs.png":::


## Next steps

- [Restore the Azure Database for MySQL - Flexible Server (preview)](backup-azure-mysql-flexible-server-restore.md).
 