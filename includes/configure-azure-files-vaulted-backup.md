---
author: jyothisuri
ms.author: jsuri
ms.date: 03/05/2025
ms.topic: include
ms.service: azure-backup
---


## Configure backups

Azure Backup allows you to use a single backup policy to back up one or more Azure Files to the same vault in an Azure region.

To configure vaulted backup for storage accounts, follow these steps:

1. Go to **Business Continuity Center** > **Overview**, and then select **+ Configure protection**.

2. On the **Configure protection** pane, select **Resources managed by** as **Azure**, **Datasource type** as **Azure Files (Azure Storage)**, select **Solution** as **Azure Backup**, and then select **Continue**.
 
3. On the **Start: Configure Backup** pane, click **Select vault** under **Vault**.

   If a Recovery Services vault doesn't exist, [create a new one](../articles/backup/backup-create-recovery-services-vault.md#create-a-recovery-services-vault).

4. On the **Select a Vault** pane, select a **Recovery Services vault** from the list to associate with your storage accounts, and then select **Next**. 
 
5. On the **Configure Backup** pane, click **Select** under **Storage Account**.
6. On the **Select storage account** pane, select a storage account from the list that contains the file shares for backup.
The **Select storage account** pane lists a set of discovered supported storage accounts. By default, the list shows the storage accounts from the current subscription, or from a different subscription if you select an alternate one from the **Subscription** filter. They're either associated with this vault or present in the same region as the vault, but not yet associated with any Recovery Services vault.
 
   Select an account from the list, and then select **OK** to register the storage account with Recovery Services vault.
7. On the **Configure Backup** pane, under the **File Shares to Backup** section, select the File Shares type you want to back up, and then select **Add**.
 
8. On the Select file shares blade, from the file shares list, select one or more file shares you want to back up, and then select OK.

   >[!Note]
   >Azure searches the storage account for file shares to back up. Recently added file shares might take some time to appear.

9. On the **Configure Backup** pane, under **Policy Details**, select an existing backup policy from the list for your file share protection

   If a policy doesn't exist, [create a new one](../articles/backup/manage-afs-backup.md#create-a-new-policy).

10. To start protecting the file share, select **Enable Backup**.
 






