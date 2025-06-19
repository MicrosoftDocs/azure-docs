---
title: Manage Azure Elastic SAN backups using Azure portal (preview)
description: Learn how to manage Elastic SAN  backups using Azure portal.
ms.topic: how-to
ms.date: 06/20/2025
author: jyothisuri
ms.author: jsuri
---

# Manage Azure Elastic SAN backups using Azure portal (preview)

This article describes how to manage Elastic SAN backups using Azure portal.

Learn about the [supported scenarios, limitations, and region availability for Elastic SAN backup/restore](azure-elastic-storage-area-network-backup-support-matrix.md).

## Run an on-demand backup

To run an on-demand backup for Elastic SAN, follow these steps:

1. Go to **Business Continuity Center**, and then select **Protection Inventory** > **Protected items**.
1. On the **Protected items** pane, filter **Datasource type** by **Elastic SAN volumes (Preview)**, and then select the Elastic SAN instance you want to back up.
1. On the selected **Elastic SAN instance** pane, under **Associated items**, select a protected item from the list. 

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-manage/select-protected-item-to-back-up.png" alt-text="Screenshot shows the selection of a backup instance to trigger backup." lightbox="./media/azure-elastic-storage-area-network-backup-manage/select-protected-item-to-back-up.png":::

1. On the selected **protected item** pane, select **Backup Now**.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-manage/trigger-backup.png" alt-text="Screenshot shows how to start backup." lightbox="./media/azure-elastic-storage-area-network-backup-manage/trigger-backup.png":::


When a backup job completes, a Managed Disk incremental snapshot (restore point) is created in the snapshot resource group with the name pattern `AzureBackup_<datasource guid>_<timestamp>`. The restore point is retained as per the retention duration set in the backup policy.


## View the Elastic SAN backup and restore jobs

To view Elastic SAN backup and restore jobs, follow these steps:

1. Go to **Business Continuity Center**, and then select **Monitoring + Reporting** > **Jobs**.
1. On the **Jobs** pane, filter **Datasource type** by **Elastic SAN volumes (Preview)**.

## Change the backup policy for an Elastic SAN backup instance

To change the backup policy for Elastic SAN backup instance, follow these steps:

1. Go to **Business Continuity Center**, and then select **Protection Inventory** > **Protected items**.
1. On the **Protected items** pane, filter **Datasource type** by **Elastic SAN volumes (Preview)**, and then select the Elastic SAN instance for which you want to change the backup policy.
1. On the selected **Elastic SAN instance** pane, select **Change Policy**.
1. On the **Change Policy** pane, under the **Backup policies** section, choose a new policy from the list, and then select **Apply**.

>[!Caution]
>Both existing and future restore points follow the retention duration set in the new backup policy.

## Stop Elastic SAN backup

Azure Backup provides the following options to stop protection of Elastic SAN:

- **Stop protection and retain backup data (Retain forever)**: Stops all future backup jobs from protecting an Elastic SAN and retains the existing backup data in the Backup vault forever. This retention incurs a storage fee as per [Azure Backup pricing](https://azure.microsoft.com/pricing/details/managed-disks/). If needed, you can use the backup data to restore the Elastic SAN and use the **Resume backup** option to resume protection.
- **Stop protection and retain backup data (Retain as per policy)**: Stops all future backup jobs from protecting an Elastic SAN and retains the existing backup data in the Backup vault as per policy. However, the latest recovery point is retained forever. This retention incurs a storage fee as per [Azure Backup pricing](https://azure.microsoft.com/pricing/details/managed-disks/). If needed, you can use the backup data to restore the Elastic SAN and use the **Resume backup** option to resume protection.
- **Stop protection and delete backup data**: Stops future backup jobs for Elastic SAN and deletes all backup data. You can't restore the Elastic SAN or use the **Resume backup** option.

To stop protection for Elastic SAN, follow these steps:

1. Go to **Business Continuity Center**, and then select **Protection Inventory** > **Protected items**.
1. On the **Protected items** pane, filter **Datasource type** by **Elastic SAN volumes (Preview)**, and then select the Elastic SAN instance for which you want to stop protection.
1. On the selected **Elastic SAN instance** pane, select **Stop Backup**.

### Stop protection and retain backup data for an Elastic SAN

To stop backups and retain data for an Elastic SAN, follow these steps:

1. On the **Stop Backup** pane, under **Stop backup level**, choose **Retain Backup Data**.

   Azure Backup stops future backup jobs for Elastic SAN instances and retains existing restore points. You can use these restore points to restore the Elastic SAN instance. This option allows you to resume the backup operation as required.

1. Under **Backup data retention**, choose one of the retention options - **Retain forever** or **Retain as per policy**.

1. Under **Reason**, choose a reason for stopping backup operation from the dropdown list.
1. Under **Comments**, enter more details for stopping backups.
1. Select **Stop backup**, and then select **Confirm**. 

### Stop protection and delete backup data for an Elastic SAN

To stop backups and delete data for an Elastic SAN, follow these steps:

1. On the **Stop Backup** pane, Under **Stop backup level**, choose **Delete Backup Data**.

   >[!Warning]
   >This is a destructive operation. After completing the delete operation, the backed-up data is retained in the **Soft deleted** state for 14 days, and then deletes for ever. After the backups are deleted, the restore operation for the Elastic SAN instance is not possible.
   >
   >If the immutability is enabled on the vault, the restore points are deleted only after all the recovery points have expired.

1. Select **Stop backup**, and then select **Confirm**. 
1. On the **Delete Backup Data** pane, under **Type the name of Backup Item**, enter the Elastic SAN instance name that you want to delete.
1. Under **Reason**, choose a reason for deletion from the dropdown list.
1. Under **Comments**, enter more details about deletion.
1. Select **Delete**. 

## Related content

- [About Azure Files backup](azure-file-share-backup-overview.md).
- [Back up Azure Files using Azure portal](backup-azure-files.md).
- [Restore Azure Files using Azure portal](restore-afs.md).
- [Manage Azure Files backup using Azure portal](manage-afs-backup.md).


