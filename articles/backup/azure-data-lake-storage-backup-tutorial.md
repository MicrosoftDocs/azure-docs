---
title: Tutorial - Back up Azure Data Lake Storage using the Azure portal
description: Learn how to back up Azure Data Lake Storage using  the Azure portal. 
ms.custom:
  - ignite-2025
ms.topic: tutorial
ms.date: 11/18/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As an IT administrator, I want to back up Azure Data Lake Storage using the portal so that I can ensure data protection against accidental or malicious deletions without maintaining on-premises infrastructure.
---

#  Tutorial: Back up Azure Data Lake Storage using the Azure portal

This tutorial describes how to back up (vaulted backup) Azure Data Lake Storage using  the Azure portal. 

Azure Backup provides a simple, secure, and cost-effective solution to protect your Azure Data Lake Storage accounts without the need to deploy and manage backup infrastructure. With vaulted backup, your data is stored in an isolated Backup vault, offering offsite protection, and long-term retention (10 years). This approach ensures resilience against accidental deletions and ransomware attacks. You can back up your data to a Backup vault in Azure and restore it when needed. Learn about [Azure Data Lake Storage vaulted backup and restore](azure-data-lake-storage-backup-overview.md), and the [supported scenarios](azure-data-lake-storage-backup-support-matrix.md).

## Prerequisites

Before you back up Azure Data Lake Storage, ensure the following prerequisites are met:

- The storage account must be of the required types and located in a supported region; this feature is currently available only in specific regions. See the [supported regions](azure-data-lake-storage-backup-support-matrix.md).
- The target account mustn't have containers with the  names same as the containers in a recovery point; otherwise, the restore operation fails.
- Identify or [create a Backup vault](create-manage-backup-vault.md#create-backup-vault) in the same region as the Azure Data Lake Storage account.
- [Create a backup policy for Azure Data Lake Storage](azure-data-lake-storage-backup-create-policy-quickstart.md?pivots=client-portal) to configure the backup schedule and retention.

>[!Note]
>You can restore vaulted backups to a different storage account only.

### Grant permissions to the Backup vault on storage accounts

A Backup vault needs specific permissions on the storage account for backup operations. The **Storage Account Backup Contributor** role consolidates these permissions for easy assignment. We recommend you grant this role to the Backup vault before configuring backup.

You can assign roles to the vault at the Subscription or Resource Group level based on your convenience. The role assignment can also be performed while configuring backup.

To assign the required role for storage accounts that you want to protect, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the storage account, and then select **Access Control (IAM)**.
1. On the **Access Control (IAM)** pane, select **Add role assignments** to assign the required role.

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/add-role-assignments.png" alt-text="Screenshot shows how to start assigning roles to the Backup vault." lightbox="./media/azure-data-lake-storage-configure-backup/add-role-assignments.png":::

1. On the **Add role assignment** pane, do the following steps:

   1. **Role**: Select **Storage Account Backup Contributor**.
   1. **Assign access to**: Select **User, group, or service principal**.
   1. **Members**: Click **+ Select members** and search for the Backup vault you created, and then select it from the search result to back up blobs in the underlying storage account.

1. Select **Save** to finish the role assignment.
 
The role assignment might take up to **30 minutes** to become effective.

[!INCLUDE [How to configure backup for Azure Data Lake Storage](../../includes/azure-data-lake-storage-configure-backup.md)]

## Monitor an Azure Data Lake Storage backup job

The Azure Backup service creates a job for a scheduled backup or when you trigger an on-demand backup operation, allowing you to monitor the job progress.

To check the backup job status, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Backup vault** > **Backup jobs**.

   :::image type="content" source="./media/azure-data-lake-storage-backup-manage/monitor-backup-jobs.png" alt-text="Screenshot shows how to monitor the backup jobs." lightbox="./media/azure-data-lake-storage-backup-manage/monitor-backup-jobs.png":::

1. On the **Backup jobs** pane, select the required time range and apply filters to narrow down the list of jobs.

   The **Backup jobs** dashboard shows the operation and status for the past seven days.

## Next steps

- [Restore Azure Data Lake Storage using Azure portal](azure-data-lake-storage-restore.md).
- [Manage vaulted backup for Azure Data Lake Storage using Azure portal](azure-data-lake-storage-backup-manage.md).
- [Troubleshoot Azure Data Lake Storage backup](azure-data-lake-storage-backup-troubleshoot.md). 


