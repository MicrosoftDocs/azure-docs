---
author: AbhishekMallick-MS
ms.service: azure-backup
ms.topic: include
ms.date: 11/18/2025
ms.author: v-mallicka
---

## Configure vaulted backup for the Azure Data Lake Storage

You can configure backup on multiple Azure Data Lake Storage.

To configure vaulted backup, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Backup vault**, and then select **+ Backup**. 
1. On the **Configure Backup** pane, on the **Basics** tab, review the **Datasource type** is selected as **Azure Data Lake Storage**.
1. On the **Backup policy** tab, under **Backup policy**, select the policy you want to use for data retention, and then select **Next**.
   If you want to create a new backup policy, select **Create new**. learn how to [create a backup policy](../articles/backup/azure-data-lake-storage-backup-create-policy-quickstart.md?pivots=client-portal).
 
1. On the **Datasources** tab, Select **Add**. 

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/add-resource-for-backup.png" alt-text="Screenshot shows how to add resources for backup." lightbox="./media/azure-data-lake-storage-configure-backup/add-resource-for-backup.png":::

1. On the **Select storage account container** pane, provide the **Backup instance name**, and then click **select** under **Storage account**.

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/specify-backup-instance-name.png" alt-text="Screenshot shows how to provide the backup instance name." lightbox="./media/azure-data-lake-storage-configure-backup/specify-backup-instance-name.png":::

1. On the **Select hierarchical namespace enabled storage account** pane, select the storage accounts with Azure Data Lake Storage across subscriptions from the list that are in the region same as the vault.

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/select-storage-account.png" alt-text="Screenshot shows the selection of storage accounts." lightbox="./media/azure-data-lake-storage-configure-backup/select-storage-account.png":::

1. On the **Select storage account container** pane, you can back up all containers or select specific ones.

   After you add the resources, backup readiness validation starts. If the required roles are assigned, the  validation succeeds with the **Success** message.

   :::image type="content" source="./media/azure-data-lake-storage-configure-backup/role-assign-message-success.png" alt-text="Screenshot shows the success message for role assignments." lightbox="./media/azure-data-lake-storage-configure-backup/role-assign-message-success.png":::

   Error messages appear when access permissions are missing. See the [Grant permissions section](../articles/backup/azure-data-lake-storage-backup-tutorial.md#grant-permissions-to-the-backup-vault-on-storage-accounts).

   Validation errors appear if the selected storage accounts don't have the **Storage Account Backup Contributor** role. Review the error messages and take necessary actions.

   | Error | Cause | Recommended action |
   | --- | --- | --- |
   | **Role assignment not done** | The **Storage account backup contributor** role and the other required roles for the storage account to the vault aren't assigned. | Select the roles, and then select **Assign missing roles** to automatically assign the required role to the Backup vault and trigger an auto revalidation. <br><br> If the role propagation takes more than **10 minutes**, then the validation might fail. In this scenario, you need to wait for a few minutes and select Revalidate to retry validation. <br><br> You need to assign the following types of permissions for various operations: <br><br> - **Resource-level** permissions: For backing up a single account within a resource group. <br> - **Resource group** or **Subscription-level** permissions: For backing up multiple accounts within a resource group. <br> - **Higher-level** permissions: For reducing the number of role assignments needed. <br><br> The maximum count of role assignments supported at the subscription level is **4,000**. Learn more [about Azure Role-Based Access Control Limits](/azure/role-based-access-control/troubleshoot-limits). |
   | **Insufficient permissions for role assignment** | The vault doesn't have the required role to configure backups, and you don't have enough permissions to assign the required role. | Download the role assignment template, and then share with users with permissions to assign roles for storage accounts. |
 
1. Review the configuration details, and then select **Configure Backup**.

You can track the progress of the backup configuration under **Backup instances**. After the configuration of backup is complete, Azure Backup triggers the backup operation as per the backup policy schedule to create the recovery points. Backup might take a minimum of 30–40 minutes, as backups rely on snapshots, which are taken in every 15 minutes and require two snapshots to detect changes before triggering the backup.