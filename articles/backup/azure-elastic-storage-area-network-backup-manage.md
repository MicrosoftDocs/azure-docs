---
title: Manage Azure Elastic SAN backups using Azure portal (preview)
description: Learn how to manage Azure Elastic Storage Area Network (SAN)  backups (preview) using Azure portal.
ms.topic: how-to
ms.date: 04/16/2025
author: jyothisuri
ms.author: jsuri
---

# Manage Azure Elastic SAN backups using Azure portal (preview)

This article describes how to manage Azure Elastic Storage Area Network (SAN) backups (preview) using Azure portal.

Learn about the [supported scenarios, limitations, and region availability for Azure Elastic SAN backup/restore (preview)](azure-elastic-storage-area-network-backup-support-matrix.md).

## Run an on-demand backup

To run an on-demand backup for Azure Elastic SAN (preview), follow these steps:

1. Go to **Business Continuity Center**, and then select **Protection Inventory** > **Protected items**.
1. On the **Protected items** pane, filter **Datasource type** by **Elastic SAN volumes (Preview)**, and then select the Elastic SAN instance you want to back up.
1. On the selected **Elastic SAN instance** pane, select the associated protected item. 
1. On the selected **protected item** pane, select **Backup Now**.

When a backup job completes, a Managed Disk incremental snapshot (restore point) is created in the snapshot resource group with the name pattern `AzureBackup_<datasource guid>_<timestamp>`. The restore point is retained as per the retention duration set in the backup policy.


## View the Azure Elastic SAN backup and restore jobs (preview)

To view Elastic SAN backup and restore jobs (preview), follow these steps:

1. Go to **Business Continuity Center**, and then select **Monitoring + Reporting** > **Jobs**.
1. On the **Jobs** pane, filter **Datasource type** by **Elastic SAN volumes (Preview)**.

## Change the backup policy for an Azure Elastic SAN backup instance (preview)

To change the backup policy for Azure Elastic SAN backup instance (preview), follow these steps:

1. Go to **Business Continuity Center**, and then select **Protection Inventory** > **Protected items**.
1. On the **Protected items** pane, filter **Datasource type** by **Elastic SAN volumes (Preview)**, and then select the Elastic SAN instance for which you want to change the backup policy.
1. On the selected **Elastic SAN instance** pane, select **Change Policy**.
1. On the **Change Policy** pane, under the **Backup policies** section, choose a new policy from the list, and then select **Apply**.

>[!Note]
>The retention duration set in the new backup policy is applied to the new and existing restore points.

## Stop backups and retain data for an Azure Elastic SAN volume (preview)

To stop backups and retain data for an Azure Elastic SAN volume (preview), follow these steps:

1. Go to **Business Continuity Center**, and then select **Protection Inventory** > **Protected items**.
1. On the **Protected items** pane, filter **Datasource type** by **Elastic SAN volumes (Preview)**, and then select the Elastic SAN instance for which you want to stop protection.
1. On the selected **Elastic SAN instance** pane, select **Stop Backup**.
1. On the **Stop Backup** pane, under **Stop backup level**, choose **Retain Backup Data**.

   Azure Backup stops future backup jobs for Elastic SAN instances and retains existing restore points in the vault. You can use these restore points to restore the Elastic SAN instance. This option allows you to resume the backup operation as required.

1. Under **Backup data retention**, choose one of the following  retention options:

   - **Retain forever**: Retains the restore points forever.
   - **Retain as per policy**: Deletes restore points based on the backup policy's retention duration, except the last restore point that stays for ever.

1. Under **Reason**, choose a reason for stopping backup operation from the dropdown list.
1. Under **Comments**, enter more details for stopping backups.
1. Select **Stop backup**, and then select **Confirm**. 

## Stop backups and delete data for an Azure Elastic SAN volume (preview)

To stop backups and delete data for an Azure Elastic SAN volume (preview), follow these steps:

1. Go to **Business Continuity Center**, and then select **Protection Inventory** > **Protected items**.
1. On the **Protected items** pane, filter **Datasource type** by **Elastic SAN volumes (Preview)**, and then select the Elastic SAN instance for which you want to stop protection.
1. On the selected **Elastic SAN instance** pane, select **Stop Backup**.
1. On the **Stop Backup** pane, Under **Stop backup level**, choose **Delete Backup Data**.

   >[!Warning]
   >This is a destructive operation. After completing the delete operation, the backed-up data is retained in the **Soft deleted** state for 14 days, and then deletes for ever. After the backups are deleted, the restore operation for the Elastic SAN instance is not possible.
   >
   >If the immutability is enabled on the vault, the restore points are deleted only after all the recovery points are expired.

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


