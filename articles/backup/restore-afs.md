---
title: Restore Azure File shares
description: Learn how to use the Azure portal to restore an entire file share or specific files from a restore point created by Azure Backup.
ms.topic: how-to
ms.date: 04/05/2024
ms.service: backup
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure File shares

This article describes how to use the Azure portal to restore an entire file share or specific files from a restore point created by [Azure Backup](./backup-overview.md).

Azure Backup provides simple, reliable, and secure solution to configure protection for your enterprise file shares by using [snapshot backup](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted backup (preview)](azure-file-share-backup-overview.md?tabs=vault-standard) so that you can recover your data in case of any accidental or malicious deletion.

>[!Note]
>Vaulted backup for Azure File share is currently in preview.

## Restore the Azure File shares

This section describes how to restore:

- A full Azure file share
- Individual files or folders

>[!Note]
>Vaulted backup (preview) currently supports only full share recovery to an alternate location. The target file share selected for restore needs to be empty.

**Choose a restore option**:

# [Full share recovery](#tab/full-share-recovery)

You can use this restore option to restore the complete file share in the original location or an alternate location.

To restore the complete file share, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Backup center** and select **Restore**.

   :::image type="content" source="./media/restore-afs/backup-center-restore-inline.png" alt-text="Screenshot shows how to start the process to restore the Azure File share restore." lightbox="./media/restore-afs/backup-center-restore-expanded.png":::

1. On the **Start: Restore** blade, select **Azure Files (Azure Storage)** as the datasource type, select the file share that you want to restore, and then select **Continue**.

   :::image type="content" source="./media/restore-afs/azure-file-share-select-instance.png" alt-text="Screenshot showing to select Backup items.":::

   After you select the file share for restore, the **Restore** blade opens.

1. To select the restore point you want to use for performing the restore operation, choose  **Select** under **Restore Point**.

    ![Screenshot shows how to select restore point by choosing Select.](./media/restore-afs/select-restore-point.png)

   The **Select restore point** context blade opens on the right that lists the restore points available for the selected file share. 

1. On the **Select restore point** bladeSe, select the restore point you want to use to perform the restore operation, and then select **OK**.

   :::image type="content" source="./media/restore-afs/azure-file-share-select-restore-point-inline.png" alt-text="Screenshot shows how to select restore point." lightbox="./media/restore-afs/azure-file-share-select-restore-point-expanded.png":::

    >[!NOTE]
    >By default, the **Select restore point** blade lists restore points from the last 30 days. If you want to check the restore points created during a specific duration, specify the range by selecting the appropriate **Start Time** and **End Time** and select **Refresh**.

1. The next step is to choose the **Restore Location**. In the **Recovery Destination** section, specify where or how to restore the data. Select one of the following two options by using the toggle button:

    * **Original Location**: Restore the complete file share to the same location as the original source.
    * **Alternate Location**: Restore the complete file share to an alternate location and keep the original file share as is.

### Restore Azure file share to the original location (full share recovery)

To restore Azure file share in the original location, follow these steps:

1. Select **Original Location** as the **Recovery Destination**, and select whether to skip or overwrite if there are conflicts, by choosing the appropriate option from the **In case of Conflicts** drop-down list.

1. Select **Restore** to start the restore operation.

   :::image type="content" source="./media/restore-afs/azure-file-share-original-location-recovery.png" alt-text="Screenshot shows how to select Restore to start.":::
>[!Note]
>To restore data to the original location, choose a recovery point with the recovery tier **Snapshot** or **Snapshot and Vault-tier**. If the snapshot corresponding to the selected recovery point is not found, the restore fails. 

### Restore to an alternate location (full share recovery)

1. Select **Alternate Location** as the **Recovery Destination**.
1. Select the destination storage account where you want to restore the backed-up content from the **Storage Account** drop-down list.
1. The **Select File Share** drop-down list displays the file shares present in the storage account you selected in step 2. Select the file share where you want to restore the backed-up contents.
1. In the **Folder Name** box, specify a folder name you want to create in the destination file share with the restored contents.
1. Select whether to skip or overwrite if there are conflicts.
1. After you enter the appropriate values in all boxes, select **Restore** to start the restore operation.

   :::image type="content" source="./media/restore-afs/azure-file-share-alternate-location-recovery.png" alt-text="Screenshot shows how to select Alternate Location.":::

# [Item-level recovery](#tab/item-level-recovery)

You can use this restore option to restore individual files or folders in the original location or an alternate location.

To restore individual files or folders, follow these steps:

1. Go to **Backup center** and select **Backup Instances** from the menu, with the datasource type selected as **Azure Storage (Azure Files)**.
1. Select the file share for which you want to do an item-level recovery.

   The *backup item* menu appears with a **File Recovery** option.

    ![Screenshot shows how to select File Recovery.](./media/restore-afs/file-recovery.png)

1. After you select **File Recovery**, the **Restore** blade opens. To select the restore point you want to use for performing the restore operation, select the **Select** link text below the **Restore Point** text box.

    ![Screenshot shows how to select restore point by choosing the Select link.](./media/restore-afs/select-restore-point.png)

   The **Select Restore Point** context blade opens on the right that lists the restore points available for the selected file share.
1. From the **Select Restore Point** blade, select the restore point you want to use to perform the restore operation, and select **OK**.

    ![Screenshot shows how to select restore point.](./media/restore-afs/restore-point.png)

1. On the **Restore** blade, choose the **Restore Location**. In the **Recovery Destination** section, specify where or how to restore the data. Select one of the following two options by using the toggle button:

    * **Original Location**: Restore selected files or folders to the same file share as the original source.
    * **Alternate Location**: Restore selected files or folders to an alternate location and keep the original file share contents as is.

### Restore to the original location (item-level recovery)

To perform item-level restore for Azure File share to the original location, follow these steps:

1. Select **Original Location** as the **Recovery Destination**, and select whether to skip or overwrite if there are conflicts by choosing the appropriate option from the **In case of conflicts** drop-down list.

    ![Screenshot shows the original location for item-level recovery.](./media/restore-afs/original-location-item-level.png)

1. To select the files or folders you want to restore, select **Add File**. This will open a context blade on the right, displaying the contents of the file share recovery point you selected for restore.

    ![Screenshot shows how to choose Add File.](./media/restore-afs/add-file.png)

1. Select the checkbox that corresponds to the file or folder you want to restore, and choose **Select**.

    ![Screenshot shows how to select file or folder.](./media/restore-afs/select-file-folder.png)

1. Repeat steps 2 through 4 to select multiple files or folders for restore.
1. After you select all the items you want to restore, select **Restore** to start the restore operation.

    ![Screenshot shows how to select Restore to start.](./media/restore-afs/click-restore.png)

### Restore to an alternate location (item-level recovery)

To perform iten-level restore for Azure File share to an alternate location, follow these steps:

1. Select **Alternate Location** as the **Recovery Destination**.
1. Select the destination storage account where you want to restore the backed-up content from the **Storage Account** drop-down list.
1. The **Select File Share** drop-down list displays the file shares present in the storage account you selected in step 2. Select the file share where you want to restore the backed-up contents.
1. In the **Folder Name** box, specify a folder name you want to create in the destination file share with the restored contents.
1. Select whether to skip or overwrite if there are conflicts.
1. To select the files or folders you want to restore, select **Add File**. This will open a context blade on the right displaying the contents of the file share recovery point you selected for restore.

    ![Screenshot shows how to select items to restore to alternate location.](./media/restore-afs/restore-to-alternate-location.png)

1. Select the checkbox that corresponds to the file or folder you want to restore, and choose **Select**.

    ![Screenshot shows how to select recovery destination.](./media/restore-afs/recovery-destination.png)

1. Repeat steps 6 through 8 to select multiple files or folders for restore.
1. After you select all the items you want to restore, select **Restore** to start the restore operation.

    ![Screenshot shows how to select OK after selecting all files.](./media/restore-afs/after-selecting-all-items.png)

---

## Track a restore operation

After you trigger the restore operation, the backup service creates a job for tracking. Azure Backup displays notifications about the job in the portal. To view operations for the job, select the notifications hyperlink.

![Screenshot shows how to select notifications hyperlink.](./media/restore-afs/notifications-link.png)

You can also monitor restore progress from the Recovery Services vault:

1. Go to **Backup center** and select **Backup Jobs** from the menu.
1. On the **Backup jobs** blade, filter the jobs for the required datasource type and job status.

   :::image type="content" source="./media/restore-afs/backup-center-jobs-inline.png" alt-text="Screenshot shows how to select Backup Jobs." lightbox="./media/restore-afs/backup-center-jobs-expanded.png":::

1. On the **Restore** blade, select the workload name that corresponds to your file share to view more details about the restore operation, like **Data Transferred** and **Number of Restored Files**.

    ![Screenshot shows how to see restored details.](./media/restore-afs/restore-details.png)
    
 >[!NOTE]
 >- Folders will be restored with original permissions if there is atleast one file present in them.
 >- Trailing dots in any directory path can lead to failures in the restore.
>- Restore of a file or folder with length *>2 KB* or with characters `xFFFF` or `xFFFE` isn't supported from snapshots.
 

## Next steps

* [Manage Azure file share backups](manage-afs-backup.md).
