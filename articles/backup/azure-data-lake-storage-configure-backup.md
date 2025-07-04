---
title: Configure Vaulted Backup for Azure Data Lake Storage using Azure Portal (preview)
description: Learn how to configure vaulted backup for Azure Data Lake Storage (preview) using Azure portal.
ms.topic: how-to
ms.date: 04/16/2025
author: jyothisuri
ms.author: jsuri
# Customer intent: As a cloud administrator, I want to configure vaulted backup for Azure Data Lake Storage, so that I can ensure data protection and recovery capabilities are in place for my storage accounts.
---

# Configure vaulted backup for Azure Data Lake Storage using Azure portal (preview)

This article describes how to configure vaulted backup for Azure Data Lake Storage (preview) using Azure portal.

## Prerequisites

Before you configure backup for Azure Data Lake Storage, ensure the following prerequisites are met:

- The storage account must be in a [supported region and of the required types](azure-data-lake-storage-backup-support-matrix.md).
- The target account mustn't have containers with the  names same as the containers in a recovery point; otherwise, the restore operation fails.

>[!Note]
>Vaulted backup restores are only possible to a different storage account.

For more information about the supported scenarios, limitations, and availability, see the [support matrix](azure-data-lake-storage-backup-support-matrix.md).

## Create a Backup vault

To back up Azure Data Lake Storage, ensure you have a Backup Vault in the same region. You can use an existing vault, or [create a new one](create-manage-backup-vault.md#create-backup-vault).

## Create a backup policy for Azure Data Lake Storage (preview)

A backup policy defines the schedule and frequency for backing up Azure Data Lake Storage. You can either create a backup policy from the Backup vault, or create it on the go during the backup configuration.

To create a backup policy for Azure Data Lake Storage from the Backup vault, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Backup vault** > **Backup policies**, and then select **+ Add**.
1. On the **Create Backup Policy** pane, on the **Basics** tab, provide a name for the new policy on **Policy name**, and then select **Datasource type** as **Azure Data Lake Storage (Preview)**.

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/create-policy.png" alt-text="Screenshot shows how to start creating a backup policy." lightbox="./media/azure-data-lake-storage-configure-backup/create-policy.png":::

1. On the **Schedule + retention** tab, under the **Backup schedule** section, set the **Backup Frequency** as **Daily** or **Weekly** and the schedule for creating recovery points for vaulted backups.
1. Under the **Add retention** section, edit the default retention rule or add new rules to specify the retention of recovery points.
1. Select **Review + create**.
1. After the review succeeds, select **Create**.

### Grant permissions to the Backup vault on storage accounts

A Backup vault needs specific permissions on the storage account for backup operations. The **Storage Account Backup Contributor** role consolidates these permissions for easy assignment. We recommend you to grant this role to the Backup vault before configuring backup.

>[!Note]
>You can also perform the role assignment while configuring backup.

To assign the required role for storage accounts that you want to protect, follow these steps:

>[!Note]
>You can also assign the roles to the vault at the Subscription or Resource Group levels according to your convenience.

1. In the [Azure portal](https://portal.azure.com/), go to the storage account, and then select **Access Control (IAM)**.
1. On the **Access Control (IAM)** pane, select **Add role assignments** to assign the required role.

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/add-role-assignments.png" alt-text="Screenshot shows how to start assigning roles to the Backup vault." lightbox="./media/azure-data-lake-storage-configure-backup/add-role-assignments.png":::

1. On the **Add role assignment** pane, do the following steps:

   1. **Role**: Select **Storage Account Backup Contributor**.
   1. **Assign access to**: Select **User, group, or service principal**.
   1. **Members**: Click **+ Select members** and search for the Backup vault you created, and then select it from the search result to back up blobs in the underlying storage account.

1. Select **Save** to finish the role assignment.
 
>[!Note]
> The role assignment might take up to **30 minutes** to take effect.

## Configure backup for the Azure Data Lake Storage (preview)

You can configure backup on multiple Azure Data Lake Storage.

To configure backup, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Backup vault**, and then select **+ Backup**. 
1. On the **Configure Backup** pane, on the **Basics** tab, review the **Datasource type** is selected as **Azure Data Lake Storage (preview)**.
1. On the **Backup policy** tab, under **Backup policy**, select the policy you want to use for data retention, and then select **Next**.
   If you want to create a new backup policy, select **Create new**. learn how to [create a backup policy](#create-a-backup-policy-for-azure-data-lake-storage-preview).
 
1. On the **Datasources** tab, Select**Add**. 

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/add-resource-for-backup.png" alt-text="Screenshot shows how to add resources for backup." lightbox="./media/azure-data-lake-storage-configure-backup/add-resource-for-backup.png":::

1. On the **Select storage account container** pane, provide the **Backup instance name**, and then click **select** under **Storage account**.

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/specify-backup-instance-name.png" alt-text="Screenshot shows how to provide the backup instance name." lightbox="./media/azure-data-lake-storage-configure-backup/specify-backup-instance-name.png":::

1. On the **Select hierarchical namespace enabled storage account** pane, select the storage accounts with Azure Data Lake Storage across subscriptions from the list that are in the region same as the vault.

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/select-storage-account.png" alt-text="Screenshot shows the selection of storage accounts." lightbox="./media/azure-data-lake-storage-configure-backup/select-storage-account.png":::

1. On the **Select storage account container** pane, you can back up all containers or select specific ones.

   After you add the resources, backup readiness validation starts. If the required roles are assigned, the  validation succeeds with the **Success** message.

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/role-assign-message-success.png" alt-text="Screenshot shows the success message for role assignments." lightbox="./media/azure-data-lake-storage-configure-backup/role-assign-message-success.png":::

   If access permissions are missing, error messages appear. See the [prerequisites](#prerequisites).

   Validation errors appear if the selected storage accounts don't have the **Storage Account Backup Contributor** role. Review the error messages and take necessary actions.

   | Error | Cause | Recommended action |
   | --- | --- | --- |
   | **Role assignment not done** | The **Storage account backup contributor** role and the other required roles for the storage account to the vault are not assigned. | Select the roles, and then select **Assign missing roles** to automatically assign the required role to the Backup vault and trigger an auto revalidation. <br><br> If the role propagation takes more than **10 minutes**, then the validation might fail. In this scenario, you need to wait for a few minutes and select Revalidate to retry validation. <br><br> You need to assign the following types of permissions for various operations: <br><br> - **Resource-level** permissions: For backing up a single account within a resource group. <br> - **Resource group** or **Subscription-level** permissions: For backing up multiple accounts within a resource group. <br> - **Higher-level** permissions: For reducing the number of role assignments needed. <br><br> Note that the maximum count of role assignments supported at the subscription level is **4,000**. Learn more [about Azure Role-Based Access Control Limits](/azure/role-based-access-control/troubleshoot-limits). |
   | **Insufficient permissions for role assignment** | The vault doesn't have the required role to configure backups, and you don't have enough permissions to assign the required role. | Download the role assignment template, and then share with users with permissions to assign roles for storage accounts. |
 
1. Review the configuration details, and then select **Configure Backup**.

You can track the progress of the backup configuration under **Backup instances**. After the configuration of backup is complete, Azure Backup triggers the backup operation as per the backup policy schedule to create the recovery points.

## Next steps

[Restore Azure Data Lake Storage using Azure portal (preview)](azure-data-lake-storage-restore.md).
 


