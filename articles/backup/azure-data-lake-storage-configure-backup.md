---
title: Configure backup for Azure Data Lake Storage using Azure portal (preview)
description: Learn how to configure backup for Azure Data Lake Storage using Azure portal.
ms.topic: how-to
ms.date: 04/16/2025
author: jyothisuri
ms.author: jsuri
---

# Configure backup for Azure Data Lake Storage using Azure portal (preview)

This article describes how to configure backup for Azure Data Lake Storage using Azure portal (preview).

## Prerequisites

Before you configure backup for Azure Data Lake Storage, ensure the following prerequisites are met:

- The storage account must be in a supported region and of the required types. See the support matrix.
- Vaulted backup restores are only possible to a different storage account. Ensure the target account has no containers with the same names as those in a recovery point—any conflicts will cause the restore to fail.

For more information about the supported scenarios, limitations, and availability, see the support matrix.

## Create a Backup vault

To back up Azure Data Lake Storage Gen2, ensure you have a Backup Vault in the same region. You can use an existing vault, or create a new one. Learn how to [create a Backup vault](create-manage-backup-vault.md#create-backup-vault).

## Create a backup policy

A backup policy defines the schedule and frequency for backing up Azure Data Lake Storage. You can create a Backup policy on the go during the configure backup flow or create it from the Backup vault.

To create a backup policy for Azure Data Lake Storage from the Backup vault, follow these steps:

1. In the Azure portal, go to the **Backup vault** > **Backup policies**, and then select **+ Add**.
1. On the **Create Backup Policy** pane, on the **Basics** tab, provide a name for the new policy on **Policy name**
1. Select **Datasource type** as **Azure Data Lake Storage Gen2s (Preview)**, and then select **Continue**.
1. On the **Schedule + retention** tab, under the **Backup schedule** section, set the **Backup Frequency** as **Daily** or **Weekly** and the schedule for creating recovery points for vaulted backups.
1. Under the **Add retention** section,edit the default retention rule or add new rules to specify the retention of recovery points.
1. Select **Review + create**.
1. After the review succeeds, select **Create**.

### Grant permissions to the Backup vault on storage accounts

A Backup vault needs specific permissions on the storage account for backup operations. The **Storage Account Backup Contributor** role consolidates these permissions for easy assignment. We recommend you to grant this role to the Backup vault before configuring backup.

>[!Note]
>You can also perform the role assignment while configuring backup.

To assign the required role for storage accounts that you want to protect, follow these steps:

>[!Note]
>You can also assign the roles to the vault at the Subscription or Resource Group levels according to your convenience.

1. In the Azure portal, go to the storage account, and then select **Access Control (IAM)**.
1. On the **Access Control (IAM)** pane, select **Add role assignments** to assign the required role.
1. On the **Add role assignment** pane, do the following steps:

   - **Role**: Select **Storage Account Backup Contributor**.
   - **Assign access to**: Select **User, group, or service principal**.
   - **Backup vault selection**: Click **Select** and search for the Backup vault you created, and then select it from the search result to back up blobs in the underlying storage account.

1. Select **Save** to finish the role assignment.
 
>[!Note]
> The role assignment might take up to **30 minutes** to take effect.

## Configure backup on the Azure Data Lake Storage Gen2

You can configure backup on multiple Azure Data Lake Storage Gen2s.

To configure backup, follow these steps:

1. In the Azure portal, go to the **Backup vault**, and then select **+ Backup**. 
1. On the **Configure Backup** pane, on the **Backup policy** tab,under **Backup policy**, select the policy you want to use for data retention, and then select **Next**.
   If you want to create a new backup policy, select **Create new**.
 
1. On the **Datasources** tab, Select**Add**. 
1. On the **Select storage account container** pane, provide the **Backup Instance name**, and then click **Select**.
1. On the **Select hierarchical namespace enabled storage account** pane,select the storage accounts with Azure Data Lake Storage Gen2 across subscriptions from the list that are in the same region as that of the vault.
1. On the **Select storage account container** pane, choose to back up all containers or select specific ones.

   After you add the resources, backup readiness validation starts. If the necessary roles are present, the  validation succeeds with a check completion message.

If access permissions are missing,error messages appear. See the [required pre-requisites](#prerequisites).

   Validation errors appear if the selected storage accounts don't have the **Storage Account Backup Contributor** role. Assign the role based on your permissions. Review the error messages and take necessary actions.
   | Error | Cause | Recommendation |
   | --- | --- | --- |
   | **Role assignment not done** | The permissions to assign the Storage account backup contributor role and the other required roles for the storage account to the vault are present. | Select the roles, and then select **Assign missing roles** to automatically assign the required role to the Backup vault and trigger an auto revalidation. <br><br> If the role propagation takes more than **10 minutes**, then the validation might fail. In this scenario, you need to wait for a few minutes and select Revalidate to retry validation. <br><br> Note that  you need to assign the following types of permissions for various operations: <br><br> - Choose **Resource-level** permissions, if backing up a single account within a resource group. <br> - Choose **Resource group** or **Subscription-level** permissions, if backing up multiple accounts within a resource group. <br> - Choose higher-level permissions to reduce the number of role assignments needed. <br><br> Note that the maximum count of role assignments supported at the subscription level is **4,000**. Learn more about Azure Role-Based Access Control Limits. |
   | **Insufficient permissions for role assignment** | The vault doesn't have the required role to configure backups, and you don't have enough permissions to assign the required role. | Download the role assignment template, and then share with users with permissions to assign roles for storage accounts. |
 
1. Review the configuration details, and then select **Configure Backup**.

You can track the progress of the backup configuration under **Backup instances**. After the configuration of backup is complete, Azure Backup triggers the backup operation as per the backup policy you have scheduled to create the recovery points.

## Next steps

Restore Azure Data Lake Storage using Azure portal (preview)
 


