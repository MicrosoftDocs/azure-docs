---
title: Manage Azure file share backups
description: This article describes common tasks for managing and monitoring the Azure file shares that are backed up by Azure Backup.
ms.topic: conceptual
ms.date: 01/07/2020
---

# Manage Azure file share backups

This article describes common tasks for managing and monitoring the Azure file shares that are backed up by [Azure Backup](https://docs.microsoft.com/azure/backup/backup-overview). You'll learn how to do management tasks in the Recovery Services vault.

## Monitor jobs

When you trigger a backup or restore operation, the backup service creates a job for tracking. You can monitor the progress of all jobs on the **Backup Jobs** page.

To open the **Backup Jobs** page:

1. Open the Recovery Services vault you used to configure backup for your file shares. In the **Overview** pane, select **Backup Jobs** under the **Monitoring** section.

   ![Backup Jobs in Monitoring section](./media/manage-afs-backup/backup-jobs.png)

1. After you select **OK**, the **Backup Jobs** pane lists the status of all jobs. Select the workload name that corresponds to the file share you want to monitor.

   ![Workload name](./media/manage-afs-backup/workload-name.png)

## Create a new policy

You can create a new policy to back up Azure file shares from the **Backup policies** section of the Recovery Services vault. All policies created when you configured backup for file shares show up with the **Policy Type** as **Azure File Share**.

To view the existing backup policies:

1. Open the Recovery Services vault you used to configure the backup for the file share. On the Recovery Services vault menu, select **Backup policies** under the **Manage** section. All the backup policies configured in the vault appear.

   ![All backup policies](./media/manage-afs-backup/all-backup-policies.png)

1. To view policies specific to **Azure File Share**, select **Azure File Share** from the drop-down list on the upper right.

   ![Select Azure File Share](./media/manage-afs-backup/azure-file-share.png)

To create a new backup policy:

1. In the **Backup policies** pane, select **+ Add**.

   ![New backup policy](./media/manage-afs-backup/new-backup-policy.png)

1. In the **Add** pane, select **Azure File Share** as the **Policy Type**. The **Backup policy** pane for **Azure File Share** opens. Specify the policy name, backup frequency, and retention range for the recovery points. After you define the policy, select **OK**.

   ![Define the backup policy](./media/manage-afs-backup/define-backup-policy.png)

## Modify policy

You can modify a backup policy to change the backup frequency or retention range.

To modify a policy:

1. Open the Recovery Services vault you used to configure the backup for the file share. On the Recovery Services vault menu, select **Backup policies** under the **Manage** section. All the backup policies configured in the vault appear.

   ![All backup policies in vault](./media/manage-afs-backup/all-backup-policies-modify.png)

1. To view policies specific to an Azure file share, select **Azure File Share** from the drop-down list on the upper right. Select the backup policy you want to modify.

   ![Azure file share to modify](./media/manage-afs-backup/azure-file-share-modify.png)

1. The **Schedule** pane opens. Edit the **Backup schedule** and **Retention range** as required, and select **Save**. You'll see an "Update in Progress" message in the pane. After the policy changes update successfully, you'll see the message "Successfully updated the backup policy."

   ![Save the modified policy](./media/manage-afs-backup/save-policy.png)

## Stop protection on a file share

There are two ways to stop protecting Azure file shares:

* Stop all future backup jobs, and *delete all recovery points*.
* Stop all future backup jobs, but *leave the recovery points*.

There might be a cost associated with leaving the recovery points in storage, because the underlying snapshots created by Azure Backup will be retained. The benefit of leaving the recovery points is that you can restore the file share later. For information about the cost of leaving the recovery points, see the [pricing details](https://azure.microsoft.com/pricing/details/backup/). If you decide to delete all the recovery points, you can't restore the file share.

To stop protection for an Azure file share:

1. Open the Recovery Services vault that contains the file share recovery points. Select **Backup Items** under the **Protected Items** section. The list of backup item types appears.

   ![Backup Items](./media/manage-afs-backup/backup-items.png)

1. In the **Backup Management Type** list, select **Azure Storage (Azure Files)**. The **Backup Items (Azure Storage (Azure Files))** list appears.

   ![Select Azure Storage (Azure Files)](./media/manage-afs-backup/azure-storage-azure-files.png)

1. In the **Backup Items (Azure Storage (Azure Files))** list, select the backup item for which you want to stop protection.

1. Select the **Stop backup** option.

   ![Select Stop backup](./media/manage-afs-backup/stop-backup.png)

1. In the **Stop Backup** pane, select **Retain Backup Data** or **Delete Backup Data**. Then select **Stop backup**.

    ![Select Retain Backup Data or Delete Backup Data](./media/manage-afs-backup/retain-or-delete-backup-data.png)

## Resume protection on a file share

If the **Retain Backup Data** option was selected when protection for the file share was stopped, it's possible to resume protection. If the **Delete Backup Data** option was selected, protection for the file share can't resume.

To resume protection for the Azure file share:

1. Open the Recovery Services vault that contains the file share recovery points. Select **Backup Items** under the **Protected Items** section. The list of backup item types appears.

   ![Backup items for resume](./media/manage-afs-backup/backup-items-resume.png)

1. In the **Backup Management Type** list, select **Azure Storage (Azure Files)**. The **Backup Items (Azure Storage (Azure Files))** list appears.

   ![List of Azure Storage (Azure Files)](./media/manage-afs-backup/azure-storage-azure-files.png)

1. In the **Backup Items (Azure Storage (Azure Files))** list, select the backup item for which you want to resume protection.

1. Select the **Resume backup** option.

   ![Select Resume backup](./media/manage-afs-backup/resume-backup.png)

1. The **Backup Policy** pane opens. Select a policy of your choice to resume backup.

1. After you select a backup policy, select **Save**. You'll see an "Update in Progress" message in the portal. After the backup successfully resumes, you'll see the message "Successfully updated backup policy for the Protected Azure File Share."

   ![Successfully updated backup policy](./media/manage-afs-backup/successfully-updated.png)

## Delete backup data

You can delete the backup of a file share during the **Stop backup** job, or any time after you stop protection. It might be beneficial to wait days or even weeks before you delete the recovery points. When you delete backup data, you can't choose specific recovery points to delete. If you decide to delete your backup data, you delete all recovery points associated with the file share.

The following procedure assumes that the protection was stopped for the file share.

To delete backup data for the Azure file share:

1. After the backup job is stopped, the **Resume backup** and **Delete backup data** options are available in the **Backup Item** dashboard. Select the **Delete backup data** option.

   ![Delete backup data](./media/manage-afs-backup/delete-backup-data.png)

1. The **Delete Backup Data** pane opens. Enter the name of the file share to confirm deletion. Optionally, provide more information in the **Reason** or **Comments** boxes. After you're sure about deleting the backup data, select **Delete**.

   ![Confirm delete data](./media/manage-afs-backup/confirm-delete-data.png)

## Unregister a storage account

To protect your file shares in a particular storage account by using a different recovery services vault, first [stop protection for all file shares](#stop-protection-on-a-file-share) in that storage account. Then unregister the account from the current recovery services vault used for protection.

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

For more information, see [Troubleshoot Azure file shares backup](https://docs.microsoft.com/azure/backup/troubleshoot-azure-files).
