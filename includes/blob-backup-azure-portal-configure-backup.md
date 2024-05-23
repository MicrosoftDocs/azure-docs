---
author: AbhishekMallick-MS
ms.service: backup
ms.topic: include
ms.date: 05/30/2024
ms.author: v-abhmallick
---

## Configure backups

You can use a single backup policy to back up one or more storage accounts to the same vault in an Azure region.

To configure backup for storage accounts, follow these steps:

1. Go to **Backup center** > **Overview**, and then select **+ Backup**.

   :::image type="content" source="./media/blob-backup-azure-portal-configure-backup/start-vaulted-backup.png" alt-text="Screenshot shows how to initiate vaulted blob backup.":::

2. On the **Initiate: Configure Backup** blade, choose **Azure Blobs (Azure Storage)** as the **Datasource type**.

   :::image type="content" source="./media/blob-backup-azure-portal-configure-backup/choose-datasource-for-vaulted-backup.png" alt-text="Screenshot shows how to initiate configuring vaulted blob backup.":::

3. On the **Configure Backup** page, on the **Basics** tab, choose **Azure Blobs (Azure Storage)** as the **Datasource type**, and then select the *Backup vault* that you want to associate with your storage accounts as the **Vault**.

   Review the **Selected backup vault details**, and then select **Next**.

   :::image type="content" source="./media/blob-backup-azure-portal-configure-backup/select-datasource-type-for-vaulted-backup.png" alt-text="Screenshot shows how to select datasource type to initiate vaulted blob backup.":::
 
4. On the **Backup policy** tab, select the *backup policy* you want to use for retention. You can also create a new backup policy, if needed.

   Review the **Selected policy details**, and then select **Next**.

   :::image type="content" source="./media/blob-backup-azure-portal-configure-backup/select-policy-for-vaulted-backup.png" alt-text="Screenshot shows how to select policy for vaulted blob backup.":::

5. On the **Configure Backup** page, on the **Datasources** tab, select the *storage accounts* you want to back up.

   You can select multiple storage accounts in the region to back up using the selected policy. Search or filter the storage accounts, if required.
  
   If you've chosen the vaulted backup policy in step 4, you can also select specific containers to back up. Select **Change** under the **Selected containers** column. In the context blade, choose **browse containers to backup** and unselect the ones you don't want to back up.

   When you select the storage accounts and containers to protect, Azure Backup performs the following validations to ensure all prerequisites are met.
   >[!Note]
   >The **Backup readiness** column shows if the Backup vault has enough permissions to configure backups for each storage account.

   1. The number of containers to be backed up is less than *100* in case of vaulted backups. By default, all containers are selected; however, you can exclude containers that shouldn't be backed up. If your storage account has *>100* containers, you must exclude containers to reduce the count to *100 or below*.

      >[!Note]
      >In case of vaulted backups, the storage accounts to be backed up must contain at least *1 container*. If the selected storage account doesn't contain any containers or if no containers are selected, you may get an error while configuring backups.

   1. The Backup vault has the required permissions to configure backup; the vault has the **Storage account backup contributor** role on all the selected storage accounts. If validation shows errors, then the selected storage accounts don't have **Storage account backup contributor** role. You can assign the required role, based on your current permissions. The error message helps you understand if you have the required permissions, and take the appropriate action:

      - **Role assignment not done**: Indicates that you (the user) have permissions to assign the **Storage account backup contributor** role and the other required roles for the storage account to the vault.

        Select the roles, and then select **Assign missing roles** on the toolbar to automatically assign the required role to the Backup vault, and trigger an autorevalidation.

        If the role propagation takes more than 10 minutes, then the validation will fail. In this scenario, you need to wait for a few minutes and select **Revalidate** to retry validation.

      - **Insufficient permissions for role assignment**: Indicates that the vault doesn't have the required role to configure backups, and you (the user) don't have enough permissions to assign the required role. To make the role assignment easier, Azure Backup allows you to download the role assignment template, which you can share with users with permissions to assign roles for storage accounts. 

        >[!Note]
        >The template contains details for selected storage accounts only. If there are multiple users that need to assign roles for different storage accounts, you can select and download different templates accordingly.

6. To assign the required roles, select the storage accounts, and then select **Download role assignment template** to download the template. Once the role assignments are complete, select **Revalidate** to validate the permissions again, and then configure backup.

   :::image type="content" source="./media/blob-backup-azure-portal-configure-backup/vaulted-backup-role-assignment-success.png" alt-text="Screenshot shows that the role assignment is successful.":::

   
7. Once validation succeeds, select the **Review + configure** tab.

8. Review the details on the **Review + configure** tab and select **Next** to initiate the *configure backup* operation.

You'll receive notifications about the status of protection configuration and its completion.