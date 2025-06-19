---
title: Manage Vaulted Backup for Azure Data Lake Storage using Azure portal (preview)
description: Learn how to manage vaulted backup for Azure Data Lake Storage using Azure portal.
ms.topic: how-to
ms.date: 06/19/2025
author: jyothisuri
ms.author: jsuri
---

# Manage vaulted backup for Azure Data Lake Storage using Azure portal (preview)

This article describes how to manage vaulted backup for Azure Data Lake Storage using Azure portal.

## Monitor an Azure Data Lake Storage backup job

The Azure Backup service creates a job for a scheduled backup or when you trigger an on-demand backup operation, allowing you to monitor the job progress.

To check the backup job status, follow these steps:

1. In the [Azure portal](), go to the **Backup vault** > **Backup jobs**.

   :::image type="content" source="./media/azure-data-lake-storage-backup-manage/monitor-backup-jobs.png" alt-text="Screenshot shows how to monitor the backup jobs." lightbox="./media/azure-data-lake-storage-backup-manage/monitor-backup-jobs.png":::

1. On the **Backup jobs** pane, select the required time range and apply filters to narrow down the list of jobs.

   The **Backup jobs** dashboard shows the operation and status for the past seven days.

## Modify the Azure Data Lake Storage backup instance

After the backup configuration, you can update the policy associated with a backup instance. For vaulted backups, you can also modify the selected backup containers.

To modify the backup instance, follow these steps:

1. Go to the **Backup vault**.
1. On the **Backup Items** tile, select **Azure Data Lake Storage (Preview)** as the **Datasource type**.
1. On the **Backup instance** pane, select the backup instance for which you want to change the Backup policy, and then select **Edit backup instance**.

   :::image type="content" source="./media/azure-data-lake-storage-backup-manage/edit-backup-instance.png" alt-text="Screenshot shows the option to modify the backup instance." lightbox="./media/azure-data-lake-storage-backup-manage/edit-backup-instance.png":::

1. On the **Edit backup instance** pane, under **Select policy**, select the appropriate policy from the dropdown list to apply it to the storage account blobs.

   :::image type="content" source="./media/azure-data-lake-storage-backup-manage/change-policy.png" alt-text="Screenshot shows how to change the policy for backup." lightbox="./media/azure-data-lake-storage-backup-manage/change-policy.png":::

1. Select **Save**.

## Stop protection for Azure Data Lake Storage

You can stop the vaulted backup for the storage account as per your requirements.

>[!Caution]
>When you remove backups, the object replication policy is removed from the source. The stop protection operation dissociates the storage account from the Backup vault and doesn’t disable any configured change feed.

To stop backup for a storage account, follow these steps: 

1. Go to the **Backup vault**.
1. On the **Backup Items** tile, select **Azure Data Lake Storage (Preview)** as the **Datasource type**. 
1. On the **Backup instance** pane, select the backup instance for which you want to stop backup from the list.
1. On the selected backup instance pane, select **Stop Backup**.

   :::image type="content" source="./media/azure-data-lake-storage-backup-manage/stop-backup.png" alt-text="Screenshot shows how to stop protection for Azure Data Lake Storage." lightbox="./media/azure-data-lake-storage-backup-manage/stop-backup.png":::

>[!Note]
>After the backup is stopped, you can disable other storage data protection capabilities (enabled for configuring backups) from the **data protection** pane of the storage account.

## Next steps

[Troubleshoot Azure Data Lake Storage vaulted backup and restore errors (preview)](azure-data-lake-storage-backup-troubleshoot.md).
 


