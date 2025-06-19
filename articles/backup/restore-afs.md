---
title: Restore Azure Files
description: Learn how to use the Azure portal to restore an entire File Share or specific files from a restore point created by Azure Backup.
ms.topic: how-to
ms.date: 05/22/2025
ms.service: azure-backup
ms.custom: engagement-fy23
author: jyothisuri
ms.author: jsuri
---

# Restore Azure Files

This article describes how to use the Azure portal to restore an entire File Share or specific files from a restore point created by [Azure Backup](./backup-overview.md). You can also restore Azure Files using [Azure PowerShell](restore-afs-powershell.md), [Azure CLI](restore-afs-cli.md), [REST API](restore-azure-file-share-rest-api.md).

Azure Backup offers a simple, reliable, and secure way to protect your enterprise File Shares using [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups, ensuring data recovery for accidental or malicious deletion.

## Restore the Azure Files

This section describes how to restore:

- A full Azure files
- Individual files or folders

>[!Note]
>Vaulted backup currently supports only full share recovery to an alternate location. The target File Share selected for restore needs to be empty.

**Choose a restore option**:

# [Full share recovery](#tab/full-share-recovery)

You can use this restore option to restore the complete File Share in the original location or an alternate location.

To restore the complete File Share, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Business Continuity Center** > **Protection inventory** > **Protected items**, and then select **Recover**.
1. On the **Recover** pane, select the **Azure Files (Azure Storage)** as the **Datasource type**, and then click **Select** under **Protected item**.

   The **Select restore point** context pane opens that lists the restore points available for the selected File Share. 

1. On the **Select restore point** pane, select the restore point you want to use to perform the restore operation, and then click **Select**.


    >[!NOTE]
    >By default, the **Select restore point** pane lists restore points from the last 30 days. If you want to check the restore points created during a specific duration, specify the range by selecting the appropriate **Start Time** and **End Time** and select **Refresh**.

1. The next step is to choose the **Restore Location**. In the **Recovery Destination** section, specify where or how to restore the data. Select one of the following two options by using the toggle button:

    * **Original Location**: Restore the complete File Share to the same location as the original source.
    * **Alternate Location**: Restore the complete File Share to an alternate location and keep the original File Share as is.

### Restore Azure files to the original location (full share recovery)

To restore Azure files in the original location, follow these steps:

1. Select **Original Location** as the **Recovery Destination**, and select whether to skip or overwrite if there are conflicts, by choosing the appropriate option from the **In case of Conflicts** drop-down list.

1. Select **Restore** to start the restore operation.

>[!Note]
>To restore data to the original location, choose a recovery point with the recovery tier **Snapshot** or **Snapshot and Vault-tier**. If the snapshot corresponding to the selected recovery point is not found, the restore fails. 

### Restore to an alternate location (full share recovery)

1. Select **Alternate Location** as the **Recovery Destination**.
1. Select the destination storage account where you want to restore the backed-up content from the **Storage Account** drop-down list.
1. The **Select File Share** drop-down list displays the File Shares present in the storage account you selected in step 2. Select the File Share where you want to restore the backed-up contents.
1. In the **Folder Name** box, specify a folder name you want to create in the destination File Share with the restored contents.
1. Select whether to skip or overwrite if there are conflicts.
1. After you enter the appropriate values in all boxes, select **Restore** to start the restore operation.

   :::image type="content" source="./media/restore-afs/azure-file-share-alternate-location-recovery.png" alt-text="Screenshot shows how to select Alternate Location." lightbox="./media/restore-afs/azure-file-share-alternate-location-recovery.png":::

# [Item-level recovery](#tab/item-level-recovery)

You can use this restore option to restore individual files or folders in the original location or an alternate location.

To restore individual files or folders, follow these steps:

1. Go to **Business Continuity Center**, and then select **Protected inventory** > **Protected items** from the menu, with the datasource type selected as **Azure Storage (Azure Files)**.
1. Select the File Share for which you want to do an item-level recovery.

   The *backup item* menu appears with a **File Recovery** option.

    ![Screenshot shows how to select File Recovery.](./media/restore-afs/file-recovery.png)

1. After you select **File Recovery**, the **Restore** pane opens. To select the restore point you want to use for performing the restore operation, select the **Select** link text below the **Restore Point** text box.

    ![Screenshot shows how to select restore point by choosing the Select link.](./media/restore-afs/select-restore-point.png)

   The **Select Restore Point** context pane opens that lists the restore points available for the selected File Share.
1. From the **Select Restore Point** pane, select the restore point you want to use to perform the restore operation, and select **OK**.

    ![Screenshot shows how to select restore point.](./media/restore-afs/restore-point.png)

1. On the **Restore** pane, choose the **Restore Location**. In the **Recovery Destination** section, specify where or how to restore the data. Select one of the following two options by using the toggle button:

    * **Original Location**: Restore selected files or folders to the same File Share as the original source.
    * **Alternate Location**: Restore selected files or folders to an alternate location and keep the original File Share contents as is.

### Restore to the original location (item-level recovery)

To perform item-level restore for Azure Files to the original location, follow these steps:

1. Select **Original Location** as the **Recovery Destination**, and select whether to skip or overwrite if there are conflicts by choosing the appropriate option from the **In case of conflicts** drop-down list.

    ![Screenshot shows the original location for item-level recovery.](./media/restore-afs/original-location-item-level.png)

1. To select the files or folders you want to restore, select **Add File**. A context pane opens listing the contents of the File Share recovery point you selected for restore.

    ![Screenshot shows how to choose Add File.](./media/restore-afs/add-file.png)

1. Select the checkbox that corresponds to the file or folder you want to restore, and choose **Select**.

    ![Screenshot shows how to select file or folder.](./media/restore-afs/select-file-folder.png)

1. Repeat steps 2 through 4 to select multiple files or folders for restore.
1. After you select all the items you want to restore, select **Restore** to start the restore operation.

    ![Screenshot shows how to select Restore to start.](./media/restore-afs/click-restore.png)

### Restore to an alternate location (item-level recovery)

To perform item-level restore for Azure Files to an alternate location, follow these steps:

1. Select **Alternate Location** as the **Recovery Destination**.
1. Select the destination storage account where you want to restore the backed-up content from the **Storage Account** drop-down list.
1. The **Select File Share** drop-down list displays the File Shares present in the storage account you selected in step 2. Select the File Share where you want to restore the backed-up contents.
1. In the **Folder Name** box, specify a folder name you want to create in the destination File Share with the restored contents.
1. Select whether to skip or overwrite if there are conflicts.
1. To select the files or folders you want to restore, select **Add File**. A context pane opens listing the contents of the File Share recovery point you selected for restore.

    ![Screenshot shows how to select items to restore to alternate location.](./media/restore-afs/restore-to-alternate-location.png)

1. Select the checkbox that corresponds to the file or folder you want to restore, and choose **Select**.

    ![Screenshot shows how to select recovery destination.](./media/restore-afs/recovery-destination.png)

1. Repeat steps 6 through 8 to select multiple files or folders for restore.
1. After you select all the items you want to restore, select **Restore** to start the restore operation.

    ![Screenshot shows how to select OK after selecting all files.](./media/restore-afs/after-selecting-all-items.png)

---

## Track a restore operation

After you trigger the restore operation, the backup service creates a job for tracking. Azure Backup displays notifications about the job in the portal. To view operations for the job, select the notifications hyperlink.

:::image type="content" source="./media/restore-afs/notifications-link.png" alt-text="Screenshot shows how to select notifications hyperlink." lightbox="./media/restore-afs/notifications-link.png":::

You can also monitor restore progress from the Recovery Services vault:

1. Go to **Business Continuity Center** and select **Monitoring + Reporting** > **Jobs** from the menu.
1. On the **Jobs** pane, filter the jobs for the required solution and datasource type.

 >[!NOTE]
 >- Folders are restored with original permissions if there is at least one file present in them.
 >- Trailing dots in any directory path can lead to failures in the restore.
>- Restore of a file or folder with length *>2 KB* or with characters `xFFFF` or `xFFFE` isn't supported from snapshots.

Learn more [about monitoring jobs across your business continuity estate](../business-continuity-center/tutorial-monitor-operate.md)

## Next steps

Manage Azure Files backups using [Azure portal](manage-afs-backup.md), [Azure PowerShell](manage-afs-powershell.md), [Azure CLI](manage-afs-backup-cli.md), [REST API](manage-azure-file-share-rest-api.md).
