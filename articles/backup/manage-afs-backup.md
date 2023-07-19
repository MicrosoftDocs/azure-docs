---
title: Manage Azure file share backups
description: This article describes common tasks for managing and monitoring the Azure file shares that are backed up by Azure Backup.
ms.topic: conceptual
ms.date: 11/03/2021
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick

---

# Manage Azure file share backups

This article describes common tasks for managing and monitoring the Azure file shares that are backed up by [Azure Backup](./backup-overview.md). You'll learn how to do management tasks in **Backup center**.

## Monitor jobs

When you trigger a backup or restore operation, the backup service creates a job for tracking. You can monitor the progress of all jobs on the **Backup Jobs** page.

To open the **Backup Jobs** page:

1. Go to **Backup center** and select **Backup Jobs** under the **Monitoring** section.

   :::image type="content" source="./media/manage-afs-backup/backup-center-jobs-list-inline.png" alt-text="Screenshot showing Backup Jobs in the Monitoring section." lightbox="./media/manage-afs-backup/backup-center-jobs-list-expanded.png":::

   The **Backup Jobs** pane lists the status of all jobs.

1. Select **Azure Files (Azure Storage)** as the datasource type and select any row to see details of the particular job.

   :::image type="content" source="./media/manage-afs-backup/backup-center-jobs-inline.png" alt-text="Screenshow showing the list of jobs." lightbox="./media/manage-afs-backup/backup-center-jobs-expanded.png":::
   
    >[!NOTE]
    >Since there is no data transferred to the vault, the data transferred in MB is 0 for backup jobs corresponding to Azure Files.

## Monitor using Azure Backup reports

Azure Backup provides a reporting solution that uses [Azure Monitor logs](../azure-monitor/logs/log-analytics-tutorial.md) and [Azure workbooks](../azure-monitor/visualize/workbooks-overview.md). These resources help you get rich insights into your backups. You can leverage these reports to gain visibility into Azure Files backup items, jobs at item level and details of active policies. Using the Email Report feature available in Backup Reports, you can create automated tasks to receive periodic reports via email. [Learn](./configure-reports.md#get-started) how to configure and view Azure Backup reports.

## Create a new policy

You can create a new policy to back up Azure file shares from the **Backup policies** section of **Backup center**. All policies created when you configured backup for file shares show up with the **Policy Type** as **Azure File Share**.

To create a new backup policy, follow these steps:

1. In the **Backup policies** pane of the **Backup center**, select **+Add**.

   :::image type="content" source="./media/manage-afs-backup/backup-center-add-policy-inline.png" alt-text="Screenshot showing the option to start creating a new backup policy." lightbox="./media/manage-afs-backup/backup-center-add-policy-expanded.png":::

1. Select **Azure Files (Azure Storage)** as the datasource type, select the vault under which the policy should be created, and then click **Continue**.

   :::image type="content" source="./media/manage-afs-backup/azure-file-share-select-vault-for-policy.png" alt-text="Screenshot showing to select Azure File share as the policy type.":::

1. As the **Backup policy** pane for **Azure File Share** opens, specify the policy name.

1. In **Backup schedule**,  select an appropriate frequency for the backups - **Daily** or **Hourly**.

   :::image type="content" source="./media/manage-afs-backup/backup-frequency-types.png" alt-text="Screenshot showing the frequency types for backups.":::

   - **Daily**: Triggers one backup per day. For daily frequency, select the appropriate values for:

     - **Time**: The timestamp when the backup job needs to be triggered.
     - **Time zone**: The corresponding time zone for the backup job.

   - **Hourly**: Triggers multiple backups per day. For hourly frequency, select the appropriate values for:
   
     - **Schedule**: The time interval (in hours) between the consecutive backups.
     - **Start time**: The time when the first backup job of the day needs to be triggered.
     - **Duration**: Represents the backup window (in hours), that is, the time span in which the backup jobs need to be triggered as per the selected schedule.
     - **Time zone**: The corresponding time zone for the backup job.
     
     For example, you’ve the RPO (recovery point objective) requirement of 4 hours and your working hours are 9 AM to 9 PM. To meet these requirements, the configuration for backup schedule would be:
    
     - Schedule: Every 4 hours
     - Start time: 9 AM 
     - Duration: 12 hours 
     
     :::image type="content" source="./media/manage-afs-backup/hourly-backup-frequency-values-scenario.png" alt-text="Screenshot showing an example of hourly backup frequency values.":::

     Based on your selection, the backup job details (the time stamps when backup job would be triggered) display on the backup policy blade.

1. In **Retention range**, specify appropriate retention values for backups - tagged as daily, weekly, monthly, or yearly.

1. After defining all attributes of the policy, click **Create**.
  
### View policy

To view the existing backup policies:

1. Go to **Backup center** and select **Backup policies** under the **Manage** section.

   All Backup policies configured across your vault appear.

   :::image type="content" source="./media/manage-afs-backup/backup-center-policies-list-inline.png" alt-text="Screenshot showing the all backup policies." lightbox="./media/manage-afs-backup/backup-center-policies-list-expanded.png":::

1. To view policies specific to **Azure Files (Azure Storage)**, select **Azure File Share** as the datasource type.

## Modify policy

You can modify a backup policy to change the backup frequency or retention range.

To modify a policy:

1. Go to **Backup center** and select **Backup policies** under the **Manage** section.

   All Backup policies configured across your vaults appear.

   :::image type="content" source="./media/manage-afs-backup/backup-center-policies-list-inline.png" alt-text="Screenshot showing all Backup policies in vault." lightbox="./media/manage-afs-backup/backup-center-policies-list-expanded.png":::

1. To view policies specific to an Azure file share, select **Azure Files (Azure Storage)** as the datasource type.

   Click the policy you want to update.

1. The **Schedule** pane opens. Edit the **Backup schedule** and **Retention range** as required, and select **Save**.

   You'll see an _Update in Progress_ message in the pane. After the policy changes update successfully, you'll see the message _Successfully updated the backup policy._

   ![Save the modified policy](./media/manage-afs-backup/save-policy.png)

## Stop protection on a file share

There are two ways to stop protecting Azure file shares:

* Stop all future backup jobs, and *delete all recovery points*.
* Stop all future backup jobs, but *leave the recovery points*.

There might be a cost associated with leaving the recovery points in storage, because the underlying snapshots created by Azure Backup will be retained. The benefit of leaving the recovery points is that you can restore the file share later. For information about the cost of leaving the recovery points, see the [pricing details](https://azure.microsoft.com/pricing/details/backup/). If you decide to delete all the recovery points, you can't restore the file share.

To stop protection for an Azure file share:

1. Go to **Backup center**, select **Backup Instances** from the menu, and then select **Azure Files (Azure Storage)** as the datasource type.

   :::image type="content" source="./media/manage-afs-backup/azure-file-share-backup-instances-inline.png" alt-text="Screenshot showing to select Azure Files as the data type." lightbox="./media/manage-afs-backup/azure-file-share-backup-instances-expanded.png":::

1. Select the backup item for which you want to stop protection.

1. Select the **Stop backup** option.

   ![Select Stop backup](./media/manage-afs-backup/stop-backup.png)

1. In the **Stop Backup** pane, select **Retain Backup Data** or **Delete Backup Data**. Then select **Stop backup**.

    ![Select Retain Backup Data or Delete Backup Data](./media/manage-afs-backup/retain-or-delete-backup-data.png)

## Resume protection on a file share

If the **Retain Backup Data** option was selected when protection for the file share was stopped, it's possible to resume protection. If the **Delete Backup Data** option was selected, protection for the file share can't resume.

To resume protection for the Azure file share:

1. Go to **Backup center**, select **Backup Instances** from the menu, and then select **Azure Files (Azure Storage)** as the datasource type.

   :::image type="content" source="./media/manage-afs-backup/azure-file-share-backup-instances-inline.png" alt-text="Screenshot showing to select Azure Files as the datasource type." lightbox="./media/manage-afs-backup/azure-file-share-backup-instances-expanded.png":::

1. Select the backup item for which you want to resume protection.

1. Select the **Resume backup** option.

   ![Select Resume backup](./media/manage-afs-backup/resume-backup.png)

1. The **Backup Policy** pane opens. Select a policy of your choice to resume backup.

1. After you select a backup policy, select **Save**.

   You'll see an _Update in Progress_ message in the portal. After the backup successfully resumes, you'll see the message _Successfully updated backup policy for the Protected Azure File Share._

   ![Successfully updated backup policy](./media/manage-afs-backup/successfully-updated.png)

## Delete backup data

You can delete the backup of a file share during the **Stop backup** job, or anytime after you stop protection. It might be beneficial to wait days or even weeks before you delete the recovery points. When you delete backup data, you can't choose specific recovery points to delete. If you decide to delete your backup data, you delete all recovery points associated with the file share.

The following procedure assumes that the protection was stopped for the file share.

To delete backup data for the Azure file share:

1. After the backup job is stopped, the **Resume backup** and **Delete backup data** options are available in the **Backup Item** dashboard. Select the **Delete backup data** option.

   ![Delete backup data](./media/manage-afs-backup/delete-backup-data.png)

1. The **Delete Backup Data** pane opens. Enter the name of the file share to confirm deletion. Optionally, provide more information in the **Reason** or **Comments** boxes. After you're sure about deleting the backup data, select **Delete**.

   ![Confirm delete data](./media/manage-afs-backup/confirm-delete-data.png)

## Unregister a storage account

To protect your file shares in a particular storage account by using a different Recovery Services vault, first [stop protection for all file shares](#stop-protection-on-a-file-share) in that storage account. Then unregister the account from the current Recovery Services vault used for protection.

The following procedure assumes that the protection was stopped for all file shares in the storage account you want to unregister.

To unregister the storage account:

1. Open the Recovery Services vault where your storage account is registered.
1. On the **Overview** pane, select the **Backup Infrastructure** option under the **Manage** section.

   ![Select Backup Infrastructure](./media/manage-afs-backup/backup-infrastructure.png)

1. The **Backup Infrastructure** pane opens. Select **Storage Accounts** under the **Azure Storage Accounts** section.

   ![Select Storage Accounts](./media/manage-afs-backup/storage-accounts.png)

1. After you select **Storage Accounts**, a list of storage accounts registered with the vault appears.
1. Right-click the storage account you want to unregister, and select **Unregister**.

   ![Select Unregister](./media/manage-afs-backup/select-unregister.png)

## Next steps

For more information, see [Troubleshoot Azure file shares backup](./troubleshoot-azure-files.md).
