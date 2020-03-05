---
title: Restore Azure file shares
description: Learn how to use the Azure portal to restore an entire file share or specific files from a restore point created by Azure Backup.
ms.topic: conceptual
ms.date: 01/12/2020
---

# Restore Azure file shares

This article explains how to use the Azure portal to restore an entire file share or specific files from a restore point created by [Azure Backup](https://docs.microsoft.com/azure/backup/backup-overview).

In this article, you'll learn how to:

* Restore a full Azure file share.
* Restore individual files or folders.
* Track the restore operation status.

## Steps to perform a restore operation

To perform a restore operation, follow these steps.

### Select the file share to restore

1. In the [Azure portal](https://portal.azure.com/), open the Recovery Services vault you used to configure backup for the file share.

1. In the overview pane, select **Backup items** under the **Protected items** section.

    ![Select Backup items](./media/restore-afs/backup-items.png)

1. After you select **Backup items**, a new pane that lists all backup management types opens next to the overview pane.

    ![Backup management types](./media/restore-afs/backup-management.png)

1. In the **Backup Items** pane, under **Backup Management Type**, select **Azure Storage (Azure Files)**. You'll see a list of all the file shares and their corresponding storage accounts backed up by using this vault.

    ![List of all file shares](./media/restore-afs/file-shares.png)

1. From the list of Azure file shares, select the file share for which you want to perform the restore operation.

### Full share recovery

You can use this restore option to restore the complete file share in the original location or an alternate location.

1. Select the **Restore Share** option in the **Backup Item** pane that appears after you selected the file share to restore in step 5 of the [Select the file share to restore](#select-the-file-share-to-restore) section.

   ![Select Restore Share](./media/restore-afs/restore-share.png)

1. After you select **Restore Share**, the **Restore** pane opens with a **Restore Point** menu that displays a list of restore points available for the selected file share.

1. Select the restore point you want to use to perform the restore operation, and select **OK**.

    ![Select restore point](./media/restore-afs/restore-point.png)

1. After you select **OK**, the **Restore** pane menu switches to **Restore Location**. In **Restore Location**, specify where or how to restore the data. Select one of the following two options:

    * **Original Location**: Restore the complete file share to the same location as the original source.
    * **Alternate Location**: Restore the complete file share to an alternate location and keep the original file share as is.

#### Restore to the original location

1. Select **Original Location** as the **Recovery Destination**, and select whether to skip or overwrite if there are conflicts. After you make the appropriate selection, select **OK**.

    ![Select Original Location](./media/restore-afs/original-location.png)

1. Select **Restore** to start the restore operation.

    ![Select Restore to start](./media/restore-afs/click-restore.png)

#### Restore to an alternate location

1. Select **Alternate Location** as the **Recovery Destination**.
1. Select the destination storage account where you want to restore the backed-up content from the **Storage Account** drop-down list.
1. The **Select File Share** drop-down list displays the file shares present in the storage account you selected in step 2. Select the file share where you want to restore the backed-up contents.
1. In the **Folder Name** box, specify a folder name you want to create in the destination file share with the restored contents.
1. Select whether to skip or overwrite if there are conflicts.
1. After you enter the appropriate values in all boxes, select **OK**.

    ![Select Alternate Location](./media/restore-afs/alternate-location.png)

1. Select **Restore** to start the restore operation.

    ![Select Restore to start](./media/restore-afs/click-restore.png)

### Item-level recovery

You can use this restore option to restore individual files or folders in the original location or an alternate location.

1. Select the **File Recovery** option in the **Backup Item** pane that appears after you selected the file share to restore in step 5 of the [Select the file share to restore](#select-the-file-share-to-restore) section.

    ![Select File Recovery](./media/restore-afs/file-recovery.png)

1. After you select **File Recovery**, the **Restore** pane opens with a **Restore point** menu that displays a list of restore points available for the selected file share.

1. Select the restore point you want to use to perform the restore operation, and select **OK**.

    ![Select restore point](./media/restore-afs/restore-point.png)

1. After you select **OK**, the restore pane menu switches to **Restore Location**. In **Restore Location**, specify where or how to restore the data. Select one of the following two options:

    * **Original Location**: Restore selected files or folders to the same file share as the original source.
    * **Alternate Location**: Restore selected files or folders to an alternate location and keep the original file share contents as is.

#### Restore to the original location

1. Select **Original Location** as the **Recovery Destination**, and select whether to skip or overwrite if there are conflicts.

    ![Original Location for item-level recovery](./media/restore-afs/original-location-item-level.png)

1. Choose **Select File** to select the files or folders you want to restore.

    ![Choose Select File](./media/restore-afs/select-file.png)

1. After you choose **Select File**, a file share pane displays the contents of the file share recovery point you selected for restore.

1. Select the check box that corresponds to the file or folder you want to restore, and choose **Select**.

    ![Select file or folder](./media/restore-afs/select-file-folder.png)

1. Repeat steps 2 through 4 to select multiple files or folders for restore.
1. After you select all the items you want to restore, select **OK**.

    ![After selecting all items to restore, select OK](./media/restore-afs/after-selecting-items.png)

1. Select **Restore** to start the restore operation.

    ![Select Restore to start](./media/restore-afs/click-restore.png)

#### Restore to an alternate location

1. Select **Alternate Location** as the **Recovery Destination**.
1. Select the destination storage account where you want to restore the backed-up content from the **Storage Account** drop-down list.
1. The **Select File Share** drop-down list displays the file shares present in the storage account you selected in step 2. Select the file share where you want to restore the backed-up contents.
1. In the **Folder Name** box, specify a folder name you want to create in the destination file share with the restored contents.
1. Select whether to skip or overwrite if there are conflicts.
1. Choose **Select File** to select the files or folders you want to restore.

    ![Select items to restore to alternate location](./media/restore-afs/restore-to-alternate-location.png)

1. When you choose **Select File**, a file share pane displays the contents of the file share recovery point you selected for restore.
1. Select the check box that corresponds to the file or folder you want to restore, and choose **Select**.

    ![Select recovery destination](./media/restore-afs/recovery-destination.png)

1. Repeat steps 6 through 8 to select multiple files or folders for restore.
1. After you select all the items you want to restore, select **OK**.

    ![Select OK after selecting all files](./media/restore-afs/after-selecting-all-items.png)

1. Select **Restore** to start the restore operation.

## Track a restore operation

After you trigger the restore operation, the backup service creates a job for tracking. Azure Backup displays notifications about the job in the portal. To view operations for the job, select the notifications hyperlink.

![Select notifications hyperlink](./media/restore-afs/notifications-link.png)

You can also monitor restore progress from the Recovery Services vault:

1. Open the Recovery Services vault from where you triggered the restore operation.
1. In the overview pane, select **Backup Jobs** under the **Monitoring** section to see the status of operations running against different workloads.

    ![Select Backup Jobs](./media/restore-afs/backup-jobs.png)

1. Select the workload name that corresponds to your file share to view more details about the restore operation, like **Data Transferred** and **Number of Restored Files**.

    ![See restored details](./media/restore-afs/restore-details.png)

## Next steps

* Learn how to [Manage Azure file share backups](manage-afs-backup.md).
