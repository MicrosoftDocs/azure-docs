---
title: Restore Azure Data Lake Storage using Azure Portal (preview)
description: Learn how to restore Azure Data Lake Storage vaulted  backups using Azure portal.
ms.topic: how-to
ms.date: 06/19/2025
author: jyothisuri
ms.author: jsuri
---

# Restore Azure Data Lake Storage using Azure portal (preview)

This article describes how to restore Azure Data Lake Storage vaulted  backups using Azure portal.

## Prerequisites

Before you restore Azure Data Lake Storage, ensure the following prerequisites are met:

- The Backup vault must have the **Storage account backup contributor** role assigned to the target storage account to which the backup data needs to be restored.
- Cool and cold tier blobs are restored in hot tier.
- The target storage account selected for restore must not have any container with same name.
- The target storage account must be in same location as source storage account and vault.

>[!Note]
>Vaulted backups only support restoring data to another storage account, which is different from the one that was backed up.

Learn more about the [supported scenarios, limitations, and region availability for Azure Data Lake Storage backup/restore](azure-data-lake-storage-backup-support-matrix.md).

## Restore the storage data from vaulted backups

To  restore Azure Data Lake Storage from vaulted  backups, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Backup vault**, and then select **Backup Instances**.
1. On the **Backup Instances** pane, select the storage account with Data Lake Storage, and then select **Restore**. 

   :::image type="content" source="./media/azure-data-lake-storage-restore/start-restore.png" alt-text="Screenshot shows how to initiate the restore operation." lightbox="./media/azure-data-lake-storage-restore/start-restore.png":::

1. On the **Restore** pane, on the **Restore point** tab, click **Select restore point**.
   By default, the latest restore point is selected. 

1. On the **Select restore point** pane, select the required restore point from the list.
1. On the **Restore** pane, on the **Restore parameters** tab, specify the restore configuration parameters by clicking **Select**.

   :::image type="content" source="./media/azure-data-lake-storage-restore/configure-restore-parameter.png" alt-text="Screenshot shows the configuration of restore parameters." lightbox="./media/azure-data-lake-storage-restore/configure-restore-parameter.png":::

1. On the **Restore destination** pane, under **Select option to restore the blobs**,  select one of these options:

   - **Restore all backed-up containers**: This option restores all backed-up containers in the storage account.
     Select the  **Target subscription**  in which the target storage account is present, and then select **Target storage account** where the data needs to be restored.

     :::image type="content" source="./media/azure-data-lake-storage-restore/restore-all-backed-up-containers.png" alt-text="Screenshot shows how to restore all backed-up containers." lightbox="./media/azure-data-lake-storage-restore/restore-all-backed-up-containers.png":::


   - **Browse and select containers to restore**: This option allows you to browse and select up to **100 containers** to restore. 
    (Optional) Specify a set of prefixes to restore specific blobs within a container. To provide the list of prefixes, select **Add/Edit** containers corresponding to each container that you select for restore.

     :::image type="content" source="./media/azure-data-lake-storage-restore/browse-containers.png" alt-text="Screenshot shows how to browse and select specific containers for restore." lightbox="./media/azure-data-lake-storage-restore/browse-containers.png":::

   >[!Note]
   >You must have the required permission to view the containers in the storage account; otherwise, the contents of the storage account don't appear. 

1. On the **Restore parameters** tab, select **Validate** to ensure that the required permissions to perform the restore are assigned to the backed-up storage accounts with Data Lake selections. 

   If the validation fails, select **Assign missing roles** to grant permissions. See the [prerequisites](#prerequisites) for the required roles.
1. After the validation succeeds, select **Review + restore** and restore the backups to the selected Data Lake Storage.
1. On the **Review + restore** tab, select **Restore** to start the restore operation.

You can track the progress of restore under **Backup Jobs**. 
 
## Related content

- [Overview of Azure Blob backup](blob-backup-overview.md).
- [Configure and manage backup for Azure Blob using Azure Backup](blob-backup-configure-manage.md).
- [Restore Azure Blob using Azure Backup](blob-restore.md).
