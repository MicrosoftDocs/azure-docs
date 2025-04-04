---
title: Restore Azure Data Lake Storage Gen  2 using Azure portal (preview)
description: Learn how to restore Azure Data Lake Storage Gen 2 from vaulted  backups using Azure portal (preview).
ms.topic: how-to
ms.date: 04/16/2025
author: jyothisuri
ms.author: jsuri
---

# Restore Azure Data Lake Storage Gen  2 using Azure portal (preview)

This article describes how to restore Azure Data Lake Storage Gen 2 from vaulted  backups using Azure portal (preview).

## Prerequisites

Before you restore Azure Data Lake Storage Gen 2, ensure the following prerequisites are met:

- Vaulted backups only support restoring data to another storage account, which is different from the one that was backed up.
- The Backup vault must have the **Storage account backup contributor** role assigned to the target storage account to which the backup data needs to be restored.
- Cool and cold tier blobs are restored in hot tier.
- The target storage account selected for restore must not have any container with same name.
- The target storage account must be in same location as source storage account and vault.

Learn more about the [supported scenarios, limitations, and region availability for Azure Data Lake Storage Gen 2 backup/restore (preview)](azure-data-lake-storage-backup-support-matrix.md).

## Restore the storage data from vaulted backups

To  restore Azure Data Lake Storage Gen 2 from vaulted  backups, follow these steps:

1. In the Azure portal, go to the **Backup vault**, and then select **Backup Instances**.
1. On the **Backup Instances** pane, select the storage account with Data Lake Storage, and then select **Restore**. 
1. On the **Restore** pane, on the **Restore point** tab, under **Restore Point**, click **Select restore point** to choose an alternate restore point.

   By default, the latest restore point is selected. 

1. On the **Select restore point** pane, select the required restore point from the list.
1. On the **Restore parameters** tab, under **Restore configuration**, click **Select** to specify restore configuration parameters.
1. On the **Restore destination** pane, under **Select option to restore the blobs**,  choose one of these options:

   - **Restore all backed-up containers**: This option restores all backed-up containers in the storage account.
     Select the  **Target subscription**  in which the target storage account is present, and then select **Target storage account** where the data needs to be restored.

   - **Browse and select containers to restore**: This option allows you to browse and select up to **100 containers** to restore. 
    (Optional) Specify a set of prefixes to restore specific blobs within a container. To provide the list of prefixes, select **Add/Edit** containers corresponding to each container that you select for restore.
 
   >[!Note]
   >You must have sufficient permission to view the containers in the storage account, or you can't see the contents of the storage account. 

1. On the **Restore parameters** tab, select **Validate** to ensure that the required permissions to perform the restore are assigned to the backed-up storage accounts with Data Lake selections. 

   If the validation fails, select **Assign missing roles** to grant permissions. See the [prerequisites](#prerequisites) for the required roles.
1. After the validation succeeds, select **Review + restore** and restore the backups to the selected Data Lake Storage.
 
You can track the progress of restore under **Backup Jobs**. 
 
