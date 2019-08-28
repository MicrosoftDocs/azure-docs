---
title: Delete a Recovery Services vault in Azure
description: Describes how to delete a Recovery Services vault.

author: dcurwin
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 07/29/2019
ms.author: dacurwin
---
# Delete a Recovery Services vault

This article describes how to delete an [Azure Backup](backup-overview.md) Recovery Services vault. It contains instructions for removing dependencies and then deleting a vault.


## Before you start

You cannot delete a Recovery Services vault that has dependencies such as protected servers or backup management servers associated with the vault.

- Vault containing backup data cannot be deleted (that is, even if you have stopped protection but retained the backup data).

- If you delete a vault that contains dependencies, then it will display the following error:

  ![Delete vault error](./media/backup-azure-delete-vault/error.png)

- If you delete an on-premises protected item (MARS, MABS or DPM to Azure) from portal containing dependencies, a warning message is displayed:

  ![Delete protected server error](./media/backup-azure-delete-vault/error-message.jpg)

  
To gracefully delete the vault, choose the scenario that matches your setup and follow the recommended steps:

Scenario | Steps to remove dependencies to delete vault |
-- | --
I have on-premises Files and Folders protected using Azure Backup Agent (MARS) backing up to Azure | Perform the steps in Delete backup data and backup items - [For MARS agent](#delete-backup-items-from-mars-management-console)
I have on-premises machines protected using MABS (Microsoft Azure Backup Server) or DPM to Azure (System Center Data Protection Manager) | Perform the steps in Delete backup data and backup items - [For MABS agent](#delete-backup-items-from-mabs-management-console)
I have protected items in cloud (ex. laaS VM, Azure File Share etc.)  | Perform the steps in Delete backup data and backup items - [For Protected items in Cloud](#delete-protected-items-in-cloud)
I have protected items both on-premises and cloud | Perform the steps in Delete backup data and backup items in the below sequence: <br> - [For Protected items in Cloud](#delete-protected-items-in-cloud)<br> - [For MARS agent](#delete-backup-items-from-mars-management-console) <br> - [For MABS agent](#delete-backup-items-from-mabs-management-console)
I don't have any protected items on-premises or cloud; however, I am still getting the Vault deletion error | Perform the steps in [Delete the Recovery Services vault using Azure Resource Manager client](#delete-the-recovery-services-vault-using-azure-resource-manager-client)


## Delete protected items in Cloud

Before you continue read **[this](#before-you-start)** section to understand the dependencies and vault deletion process.

To stop protection and delete the backup data, perform the below:

1. From portal > **Recovery Services vault** > **Backup Items**, choose the protected items in cloud (for example AzureVirtual Machine, Azure Storage (Azure Files), SQL on Azure VM, and so on).

    ![select the backup type](./media/backup-azure-delete-vault/azure-storage-selected.png)

2. Right-click on the backup item. Depending on whether the backup item is protected or not, the menu will display **Stop Backup** or **Delete backup data**.

    - For **Stop backup**, select **Delete Backup Data** from the drop-down. Enter the **Name** of the Backup item (case sensitive), select a **Reason**, enter **Comments**, and click **Stop backup**.

        ![select the backup type](./media/backup-azure-delete-vault/stop-backup-item.png)

    - For **Delete backup data**, enter the Name of the Backup item (case sensitive), select a **Reason**, enter **Comments**, and click **Delete**. 

         ![delete backup data](./media/backup-azure-delete-vault/stop-backup-blade-delete-backup-data.png)

5. Check the **Notification** ![delete backup data](./media/backup-azure-delete-vault/messages.png). After the completion, the service displays the message: **Stopping backup and deleting backup data for "*Backup Item*"**. **Successfully completed the operation**.
6. Click **Refresh** on the **Backup Items** menu, to check if the Backup item is removed.

      ![delete backup data](./media/backup-azure-delete-vault/empty-items-list.png)

## Delete protected items on-premises

Before you proceed further read **[this](#before-you-start)** section to understand the dependencies and vault deletion process.

1. From the vault dashboard menu, click **Backup Infrastructure**.
2. Depending on your on-premises scenario choose the below option:

      - For **Azure Backup Agent**, choose **Protected Servers** > **Azure Backup Agent** and select the server that you want to delete. 

        ![select your vault to open its dashboard](./media/backup-azure-delete-vault/identify-protected-servers.png)

      - For **Azure Backup Server**/**DPM**, choose **Backup Management Servers**. Select the server that you want to delete. 


          ![select vault to open its dashboard](./media/backup-azure-delete-vault/delete-backup-management-servers.png)

3. The **Delete** blade appears with the warning message.

     ![delete backup data](./media/backup-azure-delete-vault/delete-protected-server.png)

     Review the warning message and the instructions provided in the consent check box.
    
    > [!NOTE]
    >- If the protected server is in sync with Azure Service and backup items exist, then the consent check box will display number of dependent backup items and the link to view the backup items.
    >- If the protected server is not in sync with Azure Service and backup items exist, then the consent check box will display number of backup items.
    >- If backup items does not exist, then the consent check box will ask for deletion.

4. Select the consent check box and click **Delete**.




5. Check the **Notification** ![delete backup data](./media/backup-azure-delete-vault/messages.png). After the completion, the service displays the message: **Stopping backup and deleting backup data for "*Backup Item*"**. **Successfully completed the operation**.
6. Click **Refresh** on the **Backup Items** menu, to check if the Backup item is removed.

You can now proceed to delete the backup items from management console:
    
   - [Items protected using MARS](#delete-backup-items-from-mars-management-console)
    - [Items protected using MABS ](#delete-backup-items-from-mabs-management-console)


### Delete backup items from MARS Management console

To delete backup items from MARS Management console

- Launch the MARS Management console, go to the **Actions** pane and choose **Schedule Backup**.
- From **Modify or Stop a Scheduled Backup** wizard, choose the option **Stop using this backup schedule and delete all the stored backups** and click **Next**.

    ![Modify or Stop a Scheduled Backup](./media/backup-azure-delete-vault/modify-schedule-backup.png)

- From **Stop a Scheduled Backup** wizard, click **Finish**.

    ![Stop a Scheduled Backup](./media/backup-azure-delete-vault/stop-schedule-backup.png)
- You are prompted to enter a Security Pin. To generate the PIN, perform the below steps:
  - Sign in to the Azure portal.
  - Browse to **Recovery Services vault** > **Settings** > **Properties**.
  - Under **Security PIN**, click **Generate**. Copy this PIN. (This PIN is valid for only five minutes.)
- In the Management Console (client app) paste the PIN and click **Ok**.

  ![Security Pin](./media/backup-azure-delete-vault/security-pin.png)

- In the **Modify Backup Progress** wizard, you will see *Deleted backup data will be retained for 14 day. After that time, backup data will be permanently deleted.*  

    ![Delete Backup Infrastructure](./media/backup-azure-delete-vault/deleted-backup-data.png)

Now that you have deleted the backup items from on-premises, complete the next steps from the portal.

### Delete backup items from MABS Management console

To delete backup items from MABS Management console

**Method 1**
To stop protection and delete backup data, perform the below steps:

1.	In DPM Administrator Console, click **Protection** on the navigation bar.
2.	In the display pane, select the protection group member that you want to remove. Right-click to choose **Stop Protection of Group Members** option.
3.	From the **Stop Protection** dialog box, select **Delete protected data** > **Delete storage online** check box and then click **Stop Protection**.

    ![Delete storage online](./media/backup-azure-delete-vault/delete-storage-online.png)

The protected member status is now changed to **Inactive replica available**.

4. Right-click the inactive protection group and select **Remove inactive protection**.

    ![Remove inactive protection](./media/backup-azure-delete-vault/remove-inactive-protection.png)

5. From the **Delete Inactive Protection** window, select **Delete online storage** and click **Ok**.

    ![Remove replicas on disk and online](./media/backup-azure-delete-vault/remove-replica-on-disk-and-online.png)

**Method 2**
Launch the **MABS Management** console. In the **Select data protection method** section, unselect **I want online protection**.

  ![select data protection method](./media/backup-azure-delete-vault/data-protection-method.png)

Now that you have deleted the backup items from on-premises, complete the next steps from the portal.


## Delete the Recovery Services vault

1. When all dependencies have been removed, scroll to the **Essentials** pane in the vault menu.
2. Verify that there aren't any **Backup items**, **Backup management servers**, or **Replicated items** listed. If items still appear in the vault, refer the [Before you start](#before-you-start) section.

3. When there are no more items in the vault, on the vault dashboard click **Delete**.

    ![delete backup data](./media/backup-azure-delete-vault/vault-ready-to-delete.png)

4. To verify that you want to delete the vault, click **Yes**. The vault is deleted and the portal returns to the **New** service menu.

## Delete the Recovery Services vault using Azure Resource Manager client

This option to delete the Recovery Services vault is only recommended when all the dependencies are removed and you are still getting the *Vault deletion error*.

- From the **Essentials** pane in the vault menu, verify that there aren't any **Backup items**, **Backup management servers**, or **Replicated items** listed. If there are backup items, refer the [Before you start](#before-you-start) section..
- Retry [deleting the vault from portal](#delete-the-recovery-services-vault).
- If all the dependencies are removed and you are still getting the *Vault deletion error*, then use ARMClient tool to perform the steps given below;

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

1. Install chocolatey from [here](https://chocolatey.org/) and to install ARMClient run the below command:

   `choco install armclient --source=https://chocolatey.org/api/v2/`
2. Sign in to your Azure account, and run this command:

    `ARMClient.exe login [environment name]`

3. In the Azure portal, gather the subscription ID and resource group name for the vault you want to delete.

For more information on ARMClient command, refer this [document](https://github.com/projectkudu/ARMClient/blob/master/README.md).

### Use Azure Resource Manager client to delete Recovery Services vault

1. Run the following command using your subscription ID, resource group name, and vault name. When you run the command, it deletes the vault if you don’t have any dependencies.

   ```azurepowershell
   ARMClient.exe delete /subscriptions/<subscriptionID>/resourceGroups/<resourcegroupname>/providers/Microsoft.RecoveryServices/vaults/<recovery services vault name>?api-version=2015-03-15
   ```
2. If the vault is not empty, you will receive the error "Vault cannot be deleted as there are existing resources within this vault". To remove a protected items / container within a vault, do the following:

   ```azurepowershell
   ARMClient.exe delete /subscriptions/<subscriptionID>/resourceGroups/<resourcegroupname>/providers/Microsoft.RecoveryServices/vaults/<recovery services vault name>/registeredIdentities/<container name>?api-version=2016-06-01
   ```

3. In the Azure portal, verify that the vault is deleted.


## Next steps

[Learn about](backup-azure-recovery-services-vault-overview.md) Recovery Services vaults.<br/>
[Learn about](backup-azure-manage-windows-server.md) monitor and manage Recovery Services vaults.
