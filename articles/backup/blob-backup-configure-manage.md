---
title: Configure and manage backup for Azure Blobs using Azure Backup
description: Learn how to configure and manage operational and vaulted backups for Azure Blobs.
ms.topic: how-to
ms.date: 02/13/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Configure and manage backup for Azure Blobs using Azure Backup

Azure Backup allows you to configure operational and vaulted backups to protect block blobs in your storage accounts. This article describes how to configure and manage backups on one or more storage accounts using the Azure portal. You can also [configure backup using REST API](backup-azure-dataprotection-use-rest-api-backup-blobs.md).

## Before you start

# [Operational backup](#tab/operational-backup)

- Operational backup of blobs is a local backup solution that maintains data for a specified duration in the source storage account itself. This solution doesn't maintain an additional copy of data in the vault. This solution allows you to retain your data for restore for up to 360 days. Long retention durations can, however, lead to longer time taken during the restore operation.
- The solution can be used to perform restores to the source storage account only and can result in data being overwritten.
- If you delete a container from the storage account by calling the *Delete Container operation*, that container can't be restored with a restore operation. Rather than deleting an entire container, delete individual blobs if you want to restore them later. Also, Microsoft recommends enabling soft delete for containers, in addition to operational backup, to protect against accidental deletion of containers.
- Ensure that the **Microsoft.DataProtection** provider is registered for your subscription.

For more information about the supported scenarios, limitations, and availability, see the [support matrix](blob-backup-support-matrix.md).

# [Vaulted backup](#tab/vaulted-backup)

- Vaulted backup of blobs is a managed offsite backup solution that transfers data to the backup vault and retains as per the retention configured in the backup policy. You can retain data for a maximum of *10 years*.
- Currently, you can use the vaulted backup solution to restore data to a different storage account only. While performing restores, ensure that the target storage account doesn't contain any *containers* with the same name as those backed up in a recovery point. If any conflicts arise due to the same name of containers, the restore operation fails.

For more information about the supported scenarios, limitations, and availability, See the [support matrix](blob-backup-support-matrix.md).

---

## Create a Backup vault

A [Backup vault](backup-vault-overview.md) is a management entity that stores recovery points created over time and provides an interface to perform backup related operations. These include taking on-demand backups, performing restores, and creating backup policies. Though operational backup of blobs is a local backup and doesn't "store" data in the vault, the vault is required for various management operations.

>[!NOTE]
>The Backup vault is a new resource that is used for backing up new supported workloads and is different from the already existing Recovery Services vault.

For instructions on how to create a Backup vault, see the [Backup vault documentation](create-manage-backup-vault.md#create-a-backup-vault).

## Grant permissions to the Backup vault on storage accounts

Operational backup also protects the storage account (that contains the blobs to be protected) from any accidental deletions by applying a Backup-owned Delete Lock. This requires the Backup vault to have certain permissions on the storage accounts that need to be protected. For convenience of use, these minimum permissions have been consolidated under the **Storage Account Backup Contributor** role. 

We recommend you to assign this role to the Backup vault before you configure backup. However, you can also perform the role assignment while configuring backup.  

To assign the required role for storage accounts that you need to protect, follow these steps:

>[!NOTE]
>You can also assign the roles to the vault at the Subscription or Resource Group levels according to your convenience.

1. In the storage account that needs to be protected, go to the **Access Control (IAM)** tab on the left navigation blade.
1. Select **Add role assignments** to assign the required role.

    ![Add role assignments](./media/blob-backup-configure-manage/add-role-assignments.png)

1. In the Add role assignment blade:

    1. Under **Role**, choose **Storage Account Backup Contributor**.
    1. Under **Assign access to**, choose **User, group or service principal**.
    1. Search for the Backup vault you want to use for backing up blobs in this storage account, and then select it from the search results.
    1. Select **Save**.

        ![Role assignment options](./media/blob-backup-configure-manage/role-assignment-options.png)

        >[!NOTE]
        >The role assignment might take up to 30 minutes to take effect.


[!INCLUDE [blob-backup-azure-portal-create-policy.md](../../includes/blob-backup-azure-portal-create-policy.md)]


[!INCLUDE [blob-backup-azure-portal-configure-backup.md](../../includes/blob-backup-azure-portal-configure-backup.md)]

### Using Data protection settings of the storage account to configure backup

You can configure backup for blobs in a storage account directly from the ‘Data Protection’ settings of the storage account. 

1. Go to the storage account for which you want to configure backup for blobs, and then go to **Data Protection** in left blade (under **Data management**).

1. In the available data protection options, the first one allows you to enable operational backup using Azure Backup.

    ![Operational backup using Azure Backup](./media/blob-backup-configure-manage/operational-backup-using-azure-backup.png)

1. Select the checkbox corresponding to **Enable operational backup with Azure Backup**. Then select the Backup vault and the Backup policy you want to associate.
   You can select the existing vault and policy, or create new ones, as required.

    >[!IMPORTANT]
    >You should have assigned the **Storage account backup contributor** role to the selected vault. Learn more about [Grant permissions to the Backup vault on storage accounts](#grant-permissions-to-the-backup-vault-on-storage-accounts).
    
    - If you've already assigned the required role, select **Save** to finish configuring backup. Follow the portal notifications to track the progress of configuring backup.
    - If you haven’t assigned it yet, select **Manage identity**  and Follow the steps below to assign the roles. 

        ![Enable operational backup with Azure Backup](./media/blob-backup-configure-manage/enable-operational-backup-with-azure-backup.png)


        1. On selecting **Manage identity**, brings you to the Identity blade of the storage account. 
        
        1. Select **Add role assignment** to initiate the role assignment.

            ![Add role assignment to initiate the role assignment](./media/blob-backup-configure-manage/add-role-assignment-to-initiate-role-assignment.png)


        1. Choose the scope, the subscription, the resource group, or the storage account you want to assign to the role.<br><br>We recommend  you to assign the role at resource group level if you want to configure operational backup for blobs for multiple storage accounts.

        1. From the **Role** drop-down, select the **Storage account backup contributor** role.

            ![Select Storage account backup contributor role](./media/blob-backup-configure-manage/select-storage-account-backup-contributor-role.png)


        1. Select **Save** to finish role assignment.
        
           You'll receive notification through the portal once this completes successfully. You can also see the new role added to the list of existing ones for the selected vault.

            ![Finish role assignment](./media/blob-backup-configure-manage/finish-role-assignment.png)

        1. Select the cancel icon (**x**) on the top right corner to return to the **Data protection** blade of the storage account.<br><br>Once back, continue configuring backup.

## Effects on backed-up storage accounts

# [Vaulted backup](#tab/vaulted-backup)

- In storage accounts (for which you've configured vaulted backups), the object replication rules get created under the **Object replication** item in the left blade.
- Object replication requires versioning and change-feed capabilities. So, Azure Backup service enables these features on the source storage account.

# [Operational backup](#tab/operational-backup)

Once backup is configured, changes taking place on block blobs in the storage accounts are tracked and data is retained according to the backup policy. You'll notice the following changes in the storage accounts for which backup is configured:

- The following capabilities are enabled on the storage account. These can be viewed in the **Data Protection** tab of the storage account.
  - Point in time restore for containers: With retention as specified in the backup policy
  - Soft delete for blobs: With retention as specified in the backup policy +5 days
  - Versioning for blobs
  - Blob change feed

  If the storage account configured for backup already had  **Point in time restore for containers** or **Soft delete for blobs** enabled (before backup was configured), Backup ensures that the retention is at least as defined in the backup policy. Therefore, for each property:

  - If the retention in the backup policy is greater than the retention originally present in the storage account: The retention on the storage account is modified according to the backup policy
  - If the retention in the backup policy is less than the retention originally present in the storage account: The retention on the storage account is left unchanged at the originally set duration.

  ![Data protection tab](./media/blob-backup-configure-manage/data-protection.png)

- A **Delete Lock** is applied by Backup on the protected Storage Account. The lock is intended to safeguard against cases of accidental deletion of the storage account. This can be viewed under **Storage Account** > **Locks**.

    ![Delete locks](./media/blob-backup-configure-manage/delete-lock.png)

---

## Manage backups

You can use [Azure Business Continuity Center](../business-continuity-center/business-continuity-center-overview.md) as your single blade of glass for managing all your backups. Regarding backup for Azure Blobs, you can use Azure Business Continuity Center to do the following operations:

- As we've seen above, you can use it for creating Backup vaults and policies. You can also view all vaults and policies under the selected subscriptions.
- Azure Business Continuity Center gives you an easy way to [monitor the state of protection](../business-continuity-center/tutorial-monitor-protection-summary.md) of protected storage accounts as well as storage accounts for which [backup isn't currently configured](../business-continuity-center/quick-understand-protection-estate.md#identify-unprotected-resources).
- You can configure backup for any storage accounts using the **+Configure protection** button.
- You can initiate restores using the **Restore** button and track restores using **Jobs**. For more information on performing restores, see [Restore Azure Blobs](blob-restore.md?tabs=vaulted-backup).
- Analyze your backup usage using Backup reports.

    :::image type="content" source="./media/blob-backup-configure-manage/manage-azure-blob-backup.png" alt-text="Screenshot shows the Azure Business  Continuity Center console to manage the Azure Blob backups." lightbox="./media/blob-backup-configure-manage/manage-azure-blob-backup.png":::

For more information, see [Overview of Azure Business Continuity Center](../business-continuity-center/business-continuity-center-overview.md).

## Stop protection

You can stop operational backup for your storage account according to your requirement.

>[!NOTE]
>When you remove backups, the **object replication policy** isn't removed from the source. So, you need to remove the policy separately. Stopping protection only dissociates the storage account from the Backup vault (and the backup tools, such as Backup center), and doesn’t disable blob point-in-time restore, versioning, and change feed that were configured.

To stop backup for a storage account, follow these steps:

1.Go to the backup instance for the storage account being backed up.

   You can go to the backup instance from the storage account via **Storage account** > **Data protection** > **Manage backup settings**, or directly from the Business Continuity Center  via **Business Continuity Center** > **Protected Items** , and then select **Azure Backup** as a **Solution** in the filter. 

   :::image type="content" source="./media/blob-backup-configure-manage/storage-account-location.png" alt-text="Screenshot shows the Storage account location.":::
   
1. Select **stop backup** from the menu.
 
   :::image type="content" source="./media/blob-backup-configure-manage/stop-operational-backup.png" alt-text="Screenshot shows how to stop operational backup." lightbox="./media/blob-backup-configure-manage/stop-operational-backup.png":::

After stopping backup, you can disable other storage data protection capabilities (enabled for configuring backups) from the data protection blade of the storage account.

## Update the backup instance

After you have configured the backup, you can change the associated policy with a backup instance. For vaulted backups, you can even change the containers selected for backup.
To update the backup instance, follow these steps:
 
1. Go to the **Backup vault** dashboard.
1. On the **Backup Items** tile, select **Azure Blobs (Azure Storage)** as the datasource type.
1. On the **Backup instance** blade, select the backup instance for which you want to change the Backup policy, and then select **Edit backup instance**.
 
   :::image type="content" source="./media/blob-backup-configure-manage/edit-backup-instance.png" alt-text="Screenshot shows  how to edit a backup instance." lightbox="./media/blob-backup-configure-manage/edit-backup-instance.png":::

1. Select the new policy that you want to apply to the storage account blobs.
 
   :::image type="content" source="./media/blob-backup-configure-manage/change-backup-policy.png" alt-text="Screenshot shows  how to change a backup policy." lightbox="./media/blob-backup-configure-manage/change-backup-policy.png":::

1. Select **Save**.



## Next steps

[Restore Azure Blobs](blob-restore.md)
