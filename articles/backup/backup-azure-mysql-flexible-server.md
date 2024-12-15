---
title: Back Up an Azure Database for MySQL Flexible Server by Using Azure Backup
description: Learn how to back up an Azure Database for MySQL flexible server.
ms.topic: how-to
ms.date: 11/21/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up an Azure Database for MySQL flexible server by using Azure Backup (preview)

[!INCLUDE [Azure Database for MySQL - Flexible Server backup advisory](../../includes/backup-mysql-flexible-server-advisory.md)]

This article describes how to back up your Azure Database for MySQL flexible server by using Azure Backup.

Here are important considerations for this preview feature:

- Currently, this feature supports only the *weekly backup* option. However, you can schedule the backups on multiple days of the week.

- Retention duration ranges from 7 days to 10 years in the backup data store.

- Each retention rule requires inputs for specific backups, data store, and retention duration for the backups.

- The retention rules are evaluated in a predetermined order of priority. The priority is the highest for the yearly rule, followed by the monthly rule, and then the weekly rule.

  Default retention settings are applied when no other rules qualify. For example, the same recovery point might be the first successful backup taken every week in addition to the first successful backup taken every month. However, because the priority of the monthly rule is higher than the priority of the weekly rule, the retention that corresponds to the first successful backup taken every month applies.

- By default, the retention rule is set to 3 months if no retention rule is set.
  
Learn more about the [supported scenarios, considerations, and limitations](backup-azure-mysql-flexible-server-support-matrix.md).

## Create a backup policy for Azure Database for MySQL - Flexible Server

To create a backup policy, follow these steps:

1. [Create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

2. Go to the Backup vault, and then select **+Backup** to open the **Configure backup** pane.

3. Under **Backup policy**, select **Create new**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/create-backup-policy.png" alt-text="Screenshot that shows how to start creating a new backup policy." lightbox="./media/backup-azure-mysql-flexible-server/create-backup-policy.png":::

4. On the **Create Backup Policy** pane, enter a name for the new policy, and then select **Azure Database for MySQL (Preview)** for **Datasource type**.

5. On the **Schedule + retention** tab, select the **Backup schedule** values.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/schedule-retention-final.png" alt-text="Screenshot that shows the process to configure a backup schedule." lightbox="./media/backup-azure-mysql-flexible-server/schedule-retention-final.png":::

   Select the **Retention settings** values.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/add-retention.png" alt-text="Screenshot that shows how to configure a retention duration." lightbox="./media/backup-azure-mysql-flexible-server/add-retention.png":::

   You can add one or more retention rules. To add more retention rules, select **Add**.

6. You can move the backups from the backup data store to an archive data store after they expire according to the backup policy. To archive backups on expiry, select **On-expiry**.

7. Select **Review + create**.

## Configure a backup on Azure Database for MySQL - Flexible Server

You can configure a backup for the entire Azure Database for MySQL - Flexible Server instance.

To configure a backup, follow these steps:

1. In the Azure portal, go to the Backup vault, and then select **+Backup**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/configure-backup.png" alt-text="Screenshot that shows how to start a backup configuration." lightbox="./media/backup-azure-mysql-flexible-server/configure-backup.png":::

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/configure-backup-basic.png" alt-text="Screenshot that shows the Basics tab on the pane for configuring a backup." lightbox="./media/backup-azure-mysql-flexible-server/configure-backup-basic.png":::

   Alternatively, go to **Business Continuity Center** >  **+Backup**.

2. Select the backup policy that you created, which defines the backup schedule and the retention duration.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/configure-backup-policy.png" alt-text="Screenshot that shows the selection of a backup policy." lightbox="./media/backup-azure-mysql-flexible-server/configure-backup-policy.png":::

3. Select the Azure Database for MySQL - Flexible Server instance to back up.

   You can choose an Azure Database for MySQL flexible server across subscriptions if it's in the same region as that of the vault.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/datasources-select-resources.png" alt-text="Screenshot that shows the selection of a database server for a backup." lightbox="./media/backup-azure-mysql-flexible-server/datasources-select-resources.png":::

4. Select **Add** and choose the Azure Database for MySQL flexible server that you want to back up.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/datasources.png" alt-text="Screenshot that shows the selection of a datasource type." lightbox="./media/backup-azure-mysql-flexible-server/datasources.png":::

   After the selection, the backup readiness check validates that the configuration is correct.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/datasources-readiness-check.png" alt-text="Screenshot that shows a successful validation." lightbox="./media/backup-azure-mysql-flexible-server/datasources-readiness-check.png":::

5. To resolve any access problems, select **Assign missing roles**.

6. Review  the configuration details, and then select **Configure backup**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/create-backup-policy-final.png" alt-text="Screenshot that shows how to finish a backup configuration." lightbox="./media/backup-azure-mysql-flexible-server/create-backup-policy-final.png":::

   To track the progress, go to **Backup Instances**.

## Run an on-demand backup

To trigger an on-demand backup (a backup that's not in the schedule specified in the policy), follow these steps:

1. Go to the Backup vault, select **Backup instances**, and then select the backup instance for which you want to take a backup.

2. Select **Backup Now**.

   :::image type="content" source="./media/backup-azure-mysql-flexible-server/backup-instances.png" alt-text="Screenshot that shows how to run an on-demand backup." lightbox="./media/backup-azure-mysql-flexible-server/backup-instances.png":::

3. On the **MySQL database instance** pane, choose a retention rule from the list.

4. Select **Backup now**.

## Monitor a backup job

Azure Backup creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. To view the backup job's status, go to **Backup jobs**.

:::image type="content" source="./media/backup-azure-mysql-flexible-server/track-backup-jobs.png" alt-text="Screenshot that shows a list of backup jobs." lightbox="./media/backup-azure-mysql-flexible-server/track-backup-jobs.png":::

The **Backup jobs** dashboard shows the operations and status for the *past 7 days*. You can select the time range and other filters to narrow down your selection.

To view the status of all backup jobs, select **All** for **Status**. The ongoing and past jobs of the backup instance appear.

:::image type="content" source="./media/backup-azure-mysql-flexible-server/review-track-backup-jobs.png" alt-text="Screenshot that shows how to view all jobs." lightbox="./media/backup-azure-mysql-flexible-server/review-track-backup-jobs.png":::

## Next step

> [!div class="nextstepaction"]
> [Restore an Azure Database for MySQL flexible server (preview)](backup-azure-mysql-flexible-server-restore.md)
