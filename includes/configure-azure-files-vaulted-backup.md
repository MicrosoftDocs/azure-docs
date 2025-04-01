---
author: jyothisuri
ms.author: jsuri
ms.date: 03/05/2025
ms.topic: include
ms.service: azure-backup
---


## Configure backup

Azure Backup allows you to use a single backup policy to back up one or more Azure Files to the same vault in an Azure region.

To configure backup for Azure Files, follow these steps:

1. Go to **Business Continuity Center** > **Overview**, and then select **+ Configure protection**.

   :::image type="content" source="./media/configure-azure-files-vaulted-backup/start-protection.png" alt-text="Screenshot shows how to start protecting Azure Files." lightbox="./media/configure-azure-files-vaulted-backup/start-protection.png":::

2. On the **Configure protection** pane, select **Resources managed by** as **Azure**, **Datasource type** as **Azure Files (Azure Storage)**, select **Solution** as **Azure Backup**, and then select **Continue**.
 
   :::image type="content" source="./media/configure-azure-files-vaulted-backup/select-datasource-type.png" alt-text="Screenshot shows the selection of datasource for protection." lightbox="./media/configure-azure-files-vaulted-backup/select-datasource-type.png":::

3. On the **Start: Configure Backup** pane, click **Select vault** under **Vault**.

   If a Recovery Services vault doesn't exist, [create a new one](../articles/backup/backup-create-recovery-services-vault.md#create-a-recovery-services-vault).

4. On the **Select a Vault** pane, select a **Recovery Services vault** from the list to associate with your storage accounts, and then select **Next**. 
 
   :::image type="content" source="./media/configure-azure-files-vaulted-backup/select-vault.png" alt-text="Screenshot shows the selection of a Recovery Services vault." lightbox="./media/configure-azure-files-vaulted-backup/select-vault.png":::

5. On the **Configure Backup** pane, click **Select** under **Storage Account**.

6. On the **Select storage account** pane, select a storage account from the list that contains the file shares for backup.

   :::image type="content" source="./media/configure-azure-files-vaulted-backup/select-storage-account.png" alt-text="Screenshot shows the selection of a storage account." lightbox="./media/configure-azure-files-vaulted-backup/select-storage-account.png":::

The **Select storage account** pane lists a set of discovered supported storage accounts. By default, the list shows the storage accounts from the current subscription, or from a different subscription if you select an alternate one from the **Subscription** filter. They're either associated with this vault or present in the same region as the vault, but not yet associated with any Recovery Services vault.
 
   Select an account from the list, and then select **OK** to register the storage account with Recovery Services vault.

7. On the **Configure Backup** pane, under the **File Shares to Backup** section, select **Add** to choose the File Shares you want to back up.

8. On the Select file shares blade, from the file shares list, select one or more file shares you want to back up, and then select **Next**.

   >[!Note]
   >Azure searches the storage account for file shares to back up. Recently added file shares might take some time to appear.

   :::image type="content" source="./media/configure-azure-files-vaulted-backup/select-file-shares-type.png" alt-text="Screenshot shows the selection of File Shares." lightbox="./media/configure-azure-files-vaulted-backup/select-file-shares-type.png":::

9. On the **Configure Backup** pane, under **Policy Details**, select an existing backup policy from the list for your file share protection

   If a policy doesn't exist, [create a new one](../articles/backup/quick-backup-azure-files-vault-tier-portal.md).

10. To start protecting the file share, select **Enable Backup**.
 
    :::image type="content" source="./media/configure-azure-files-vaulted-backup/enable-backup.png" alt-text="Screenshot shows how to enable protection.":::


>[!Note]
>You can also configure snapshot backup and vaulted backup (preview) for Azure Files from the [Recovery Services vault](../articles/backup/backup-azure-files.md?tabs=recovery-services-vault#configure-the-backup) or [File Share](../articles/backup/backup-azure-files.md?tabs=file-share-pane#configure-the-backup) panes.




