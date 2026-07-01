---
title: Delete a Microsoft Azure Recovery Services Vault 
description: In this article, learn how to remove dependencies and then delete an Azure Backup Recovery Services vault.
ms.topic: how-to
ms.date: 12/09/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom:
  - devx-track-azurepowershell
  - sfi-image-nochange
# Customer intent: As a cloud administrator, I want to successfully delete a Recovery Services vault so that I can ensure the removal of unnecessary resources and maintain an organized backup infrastructure.
---
# Delete an Azure Backup Recovery Services vault

This article describes how to delete an [Azure Backup](backup-overview.md) Recovery Services vault. It contains instructions for removing dependencies and then deleting a vault.

## Before you start

You can't delete a Recovery Services vault that:

- Contains protected data sources. Examples include infrastructure as a service (IaaS) virtual machines (VMs), SQL databases, or Azure file shares.
- Contains backup data. After backup data is deleted, it goes into the soft-deleted state.
- Contains backup data in the soft-deleted state.
- Has registered storage accounts.

If you try to delete the vault without removing the dependencies, you encounter one of the following error messages:

- "Vault cannot be deleted as there are existing resources within the vault. Please ensure there are no backup items, protected servers, or backup management servers associated with this vault. Unregister the following containers associated with this vault before proceeding for deletion."
- "Recovery Services vault cannot be deleted as there are backup items in soft deleted state in the vault. The soft deleted items are permanently deleted after 14 days of delete operation. Please try vault deletion after the backup items are permanently deleted and there is no item in soft deleted state left in the vault."

For more information, see [Soft delete for Azure Backup](./backup-azure-security-feature-cloud.md).

Before you delete an Azure Backup protection policy from a vault, you must ensure that:

- The policy doesn't have any associated Azure Backup items.
- Each associated item is associated with some other policy.

## Delete a Recovery Services vault

> [!VIDEO https://www.youtube.com/embed/xg_TnyhK34o]

Choose a client:

# [Azure portal](#tab/portal)

>[!WARNING]
>The following operation is destructive and can't be undone. All backup data and backup items associated with the protected server will be permanently deleted. Proceed with caution.

If you're sure that all backed-up items in the vault are no longer required and you want to delete them all at once without reviewing, [run this PowerShell script](./scripts/delete-recovery-services-vault.md). The script deletes all backup items recursively and eventually deletes the entire vault.

To delete a vault, follow these steps:

- **Step 1:** Go to the vault **Overview**, select **Delete**, and then follow the instructions to remove Azure Backup and Azure Site Recovery items for vault deletion. Each link calls the respective pane to perform the corresponding vault-deletion steps.

  To understand the process, see the instructions in the following steps. You can also go to each pane to delete vaults.

  :::image type="content" source="./media/backup-azure-delete-vault/delete-vault-manually-inline.png" alt-text="Screenshot that shows how to delete a vault manually." lightbox="./media/backup-azure-delete-vault/delete-vault-manually-expanded.png":::

  Alternatively, go to the panes manually by following these steps:

- <a id="portal-mua">**Step 2:**</a> If multiuser authorization (MUA) is enabled, seek necessary permissions from the security administrator before vault deletion. [Learn more](./multi-user-authorization.md#authorize-critical-protected-operations-using-azure-active-directory-privileged-identity-management).

- <a id="portal-disable-soft-delete">**Step 3:**</a> Disable the soft delete and security features.

  1. Go to **Properties** > **Security Settings** and disable **Soft Delete**, if enabled. For more information, see [how to disable soft delete](./backup-azure-security-feature-cloud.md#enable-and-disable-soft-delete).
  1. Go to **Properties** > **Security Settings** and disable **Security Features**, if enabled. [Learn more](./backup-azure-security-feature.md).

- <a id="portal-delete-cloud-protected-items">**Step 4:**</a> Delete cloud-protected items.

  1. After you disable soft delete, check if any items remain in the soft-deleted state. If there are items in the soft-deleted state, restore them and then delete them again. To find soft-deleted items and permanently delete them, [follow these steps](./backup-azure-security-feature-cloud.md?tabs=azure-portal#delete-soft-deleted-backup-items-permanently).

     :::image type="content" source="./media/backup-azure-delete-vault/delete-items-in-soft-delete-state-inline.png" alt-text="Screenshot that shows the process to delete items in a soft-deleted state." lightbox="./media/backup-azure-delete-vault/delete-items-in-soft-delete-state-expanded.png":::

  1. Go to the vault dashboard menu and select **Backup Items**. Select **Stop Backup** to stop the backups of all listed items, and then select **Delete Backup Data**. To remove those items, [follow these steps](#delete-protected-items-in-the-cloud).

  > [!NOTE]
  > You don't need to delete the VM or policy. You only need to stop backup to the vault.
      
- <a id="portal-delete-backup-servers">**Step 5:**</a> Delete backup servers.

  Before you delete the vault, ensure that all on-premises backup servers are unregistered from the vault. To unregister the servers, follow these steps based on your on-premises scenario:

  1. Go to the vault dashboard menu and select **Backup Infrastructure** > **Protected Servers**. On **Protected Servers**, select the backup management type from the list. To delete the vault, you must unregister all the servers. On the selected backup management pane, select the **More** icon (**...**) that corresponds to each protected server and select **Unregister**.
  
  1. **Microsoft Azure Recovery Services (MARS) protected servers**: Go to the vault dashboard menu and select **Backup Infrastructure** > **Protected Servers**. If you used MARS to protect the servers, all servers listed here must be deleted along with their backup data. To delete MARS-protected servers, [follow these steps](#delete-protected-items-on-premises).
  
  1. **Microsoft Azure Backup Server (MABS) or Data Protection Manager (DPM) management servers**: Go to the vault dashboard menu and select **Backup Infrastructure** > **Backup Management Servers**. If you have DPM or MABS, all items listed here must be deleted or unregistered along with their backup data. To delete the management servers, [follow these steps](#delete-protected-items-on-premises).

  Deleting MARS, MABS, or DPM servers also removes the corresponding backup items protected in the vault.

- <a id="portal-unregister-storage-accounts">**Step 6:**</a> Unregister storage accounts.

  Ensure that all registered storage accounts are unregistered for successful vault deletion. Go to the vault dashboard menu and select **Backup Infrastructure** > **Storage Accounts**. If you have storage accounts listed here, you must unregister all of them. Learn more about how to [unregister a storage account](manage-afs-backup.md#unregister-a-storage-account).

- <a id="portal-remove-private-endpoints">**Step 7:**</a> Remove private endpoints.

  Ensure that no private endpoints were created for the vault. Go to the vault dashboard menu, select **Settings** > **Networking**, and then select **Private access**. Check if the vault has any private endpoint connections that were created or attempted to be created. Ensure that they're removed before you proceed with the vault delete.

- **Step 8:** Delete the vault.

  After you finish these steps, continue to [delete the vault](?tabs=portal#delete-the-recovery-services-vault).

  If you're *still unable to delete the vaults* that contain no dependencies, follow the steps in [Delete a vault by using the Azure Resource Manager client](?tabs=arm#tabpanel_1_arm).

### Delete protected items in the cloud

First, read the [Before you start](#before-you-start) section to understand the dependencies and vault-deletion process.

To stop protection and delete the backup data, follow these steps:

1. In the portal, go to **Recovery Services vault**, and then go to **Backup items**. Then, in the **Backup Management Type** list, select the protected items in the cloud (for example, Azure Virtual Machines, Azure Storage, Azure Files, or SQL Server on Azure Virtual Machines).

   :::image type="content" source="./media/backup-azure-delete-vault/azure-storage-selected-inline.png" alt-text="Screenshot that shows selecting the backup type." lightbox="./media/backup-azure-delete-vault/azure-storage-selected-expanded.png":::

1. In the list of all the items for the category, right-click to select the backup item. Depending on whether the backup item is protected or not, the menu displays either the **Stop Backup** pane or the **Delete Backup Data** pane.

    - If the **Stop Backup** pane appears, select **Delete Backup Data** from the dropdown menu. Enter the name of the backup item (this field is case sensitive), and then select a reason from the dropdown menu. Enter your comments, if you have any, and then select **Stop backup**.

      :::image type="content" source="./media/backup-azure-delete-vault/stop-backup-item-inline.png" alt-text="Screenshot that shows the Stop Backup pane." lightbox="./media/backup-azure-delete-vault/stop-backup-item-expanded.png":::

    - If the **Delete Backup Data** pane appears, enter the name of the backup item (this field is case sensitive), and then select a reason from the dropdown menu. Enter your comments, if you have any, and then select **Delete**.

      :::image type="content" source="./media/backup-azure-delete-vault/stop-backup-blade-delete-backup-data-inline.png" alt-text="Screenshot that shows the Delete Backup Data pane." lightbox="./media/backup-azure-delete-vault/stop-backup-blade-delete-backup-data-expanded.png":::

   This option deletes scheduled backups and also deletes on-demand backups.
1. Check the **Notification** icon: ![The Notification icon.](./media/backup-azure-delete-vault/messages.png). After the process finishes, the service displays the following message: **Stopping backup and deleting backup data for Backup Item. Successfully completed the operation.**
1. On the **Backup Items** menu, select **Refresh** to make sure that the backup item was deleted.

   :::image type="content" source="./media/backup-azure-delete-vault/empty-items-list-inline.png" alt-text="Screenshot that shows the Backup Items page." lightbox="./media/backup-azure-delete-vault/empty-items-list-expanded.png":::

### Delete protected items on-premises

First, read the [Before you start](#before-you-start) section to understand the dependencies and vault-deletion process.

1. On the vault dashboard menu, select **Backup Infrastructure**.
1. Depending on your on-premises scenario, choose one of the following options:

      - For MARS, select **Protected Servers**, and then select **Azure Backup Agent**. Then, select the server that you want to delete.

        ![Screenshot that shows, for MARS, selecting your vault to open its dashboard.](./media/backup-azure-delete-vault/identify-protected-servers.png)

      - For MABS or DPM, select **Backup Management Servers**. Then, select the server that you want to delete.

          ![Screenshot that shows, for MABS or DPM, selecting your vault to open its dashboard.](./media/backup-azure-delete-vault/delete-backup-management-servers.png)

1. The **Delete** pane appears with a warning message.

     ![Screenshot that shows the Delete pane.](./media/backup-azure-delete-vault/delete-protected-server.png)

     Review the warning message and the instructions in the consent checkbox.

    > [!NOTE]
    >- If the protected server is synced with Azure services and backup items exist, the consent checkbox shows the number of dependent backup items and the link to view the backup items.
    >- If the protected server isn't synced with Azure services and backup items exist, the consent checkbox shows only the number of backup items.
    >- If there are no backup items, the consent checkbox asks for deletion.

1. Select the consent checkbox, and then select **Delete**.

1. Check the **Notification** icon: ![Notification icon.](./media/backup-azure-delete-vault/messages.png). After the operation finishes, the service displays the following message: **Stopping backup and deleting backup data for Backup Item. Successfully completed the operation.**
1. On the **Backup Items** menu, select **Refresh** to make sure that the backup item is deleted.

If you delete an on-premises protected item from a portal that contains dependencies, you receive the following warning: "Deleting server's registration is a destructive operation and cannot be undone. All backup data (recovery points required to restore the data) and Backup items associated with protected server will be permanently deleted."

After this process finishes, you can delete the backup items from the management console:

- [Delete backup items from the MARS management console](#delete-backup-items-from-the-mars-management-console)
- [Delete backup items from the MABS or DPM management console](#delete-backup-items-from-the-mabs-or-dpm-management-console)

### Delete backup items from the MARS management console

If you deleted or lost the source machine without stopping the backup, the next scheduled backup fails. The old recovery point expires according to the policy, but the last single recovery point is always retained until you stop the backup and delete the data. Follow the steps in [this section](#delete-protected-items-on-premises).

1. Open the MARS management console, go to the **Actions** pane, and select **Schedule Backup**.
1. On the **Modify or Stop a Scheduled Backup** pane, select **Stop using this backup schedule and delete all of the stored backups**. Then, select **Next**.

    ![Screenshot that shows modifying or stopping a scheduled backup.](./media/backup-azure-delete-vault/modify-schedule-backup.png)

1. On the **Stop a Scheduled Backup** page, select **Finish**.

    ![Screenshot that shows stopping a scheduled backup.](./media/backup-azure-delete-vault/stop-schedule-backup.png)
   You're prompted to enter a security personal identification number (PIN), which you must generate manually:

   1. Sign in to the Azure portal.
   1. Go to **Recovery Services vault** > **Settings** > **Properties**.
   1. Under **Security PIN**, select **Generate**. Copy this PIN. The PIN is valid for only five minutes.
1. In the management console, paste the PIN, and then select **OK**.

    ![Screenshot that shows generating a security PIN.](./media/backup-azure-delete-vault/security-pin.png)

1. On the **Modify Backup Progress** page, the following message appears: **Deleted backup data will be retained for 14 days. After that time, backup data will be permanently deleted.**

    ![Screenshot that shows deleting the backup infrastructure.](./media/backup-azure-delete-vault/deleted-backup-data.png)

After you delete the on-premises backup items, follow the next steps from the portal.

### Delete backup items from the MABS or DPM management console

If you deleted or lost the source machine without stopping the backup, the next scheduled backup fails. The old recovery point expires according to the policy, but the last single recovery point is always retained until you stop the backup and delete the data. Follow the steps in [this section](#delete-protected-items-on-premises).

There are two methods you can use to delete backup items from the MABS or DPM management console.

#### Method 1

To stop protection and delete backup data, follow these steps:

1. Open the DPM administrator console, and on the left pane, select **Protection**.
1. On the display pane, select the protection group member that you want to remove. Right-click the **Stop Protection of Group Members** option.
1. In the **Stop Protection** dialog, select **Delete protected data**, and then select the **Delete storage online** checkbox. Then, select **Stop Protection**.

    ![Screenshot that shows selecting the Delete protected data option in the Stop Protection pane.](./media/backup-azure-delete-vault/delete-storage-online.png)

    For the following versions, you're prompted to enter a security PIN, which you must generate manually:

    - DPM 2019 UR1 and later
    - DPM 2016 UR9 and later
    - MABS V3 UR1 and later

    To generate the PIN, follow these steps:

    1. Sign in to the Azure portal.
    1. Go to **Recovery Services vault** > **Settings** > **Properties**.
    1. Under **Security PIN**, select **Generate**.
    1. Copy the PIN. The PIN is valid for only five minutes.

  1. In the management console, paste the PIN, and then select **Submit**.
  
       ![Screenshot that shows entering the security PIN to delete backup items from the MABS and DPM management console.](./media/backup-azure-delete-vault/enter-security-pin.png)

1. If you previously selected **Delete storage online** in the **Stop Protection** dialog, ignore this step. Right-click the inactive protection group and select **Remove inactive protection**.

    ![Screenshot that shows removing inactive protection.](./media/backup-azure-delete-vault/remove-inactive-protection.png)

1. In the **Delete Inactive Protection** dialog, select the **Delete online storage** checkbox, and then select **OK**.

    ![Screenshot that shows deleting online storage.](./media/backup-azure-delete-vault/remove-replica-on-disk-and-online.png)

    For the following versions, you're prompted to enter a security PIN, which you must generate manually:

    - DPM 2019 UR1 and later
    - DPM 2016 UR9 and later
    - MABS V3 UR1 and later

    To generate the PIN, follow these steps:

    1. Sign in to the Azure portal.
    1. Go to **Recovery Services vault** > **Settings** > **Properties**.
    1. Under **Security PIN**, select **Generate**.
    1. Copy the PIN. The PIN is valid for only five minutes.

1. In the management console, paste the PIN, and then select **Submit**.

      ![Screenshot that shows entering the security PIN to delete backup items from the MABS and DPM management console.](./media/backup-azure-delete-vault/enter-security-pin.png)

     The protected member status changes to **Inactive replica available**.

#### Method 2

Open the **MABS management** or **DPM management** console. Under **Select data protection method**, clear the  **I want online protection** checkbox.

  ![Screenshot that shows selecting the data protection method.](./media/backup-azure-delete-vault/data-protection-method.png)

After you delete the on-premises backup items, follow the next steps from the portal.

### Delete the Recovery Services vault

1. After you remove all dependencies, scroll to the **Essentials** pane in the vault menu.
1. Verify that there aren't any backup items, backup management servers, or replicated items listed. If items still appear in the vault, refer to the [Before you start](#before-you-start) section.

1. When there are no more items in the vault, select **Delete** on the vault dashboard.

    ![Screenshot that shows selecting Delete on the vault dashboard.](./media/backup-azure-delete-vault/vault-ready-to-delete.png)

1. Select **Yes** to verify that you want to delete the vault. The vault is deleted. The portal returns to the **New** service menu.

# [PowerShell](#tab/powershell)

First, read the [Before you start](#before-you-start) section to understand the dependencies and vault-deletion process.

To download the PowerShell file to delete your vault, go to the vault **Overview** and select **Delete** > **Delete using PowerShell Script**. Select **Generate and Download Script** to create a customized script specific to the vault. It requires no other changes. To run the script in the PowerShell console, switch to the downloaded script's directory and run the file by entering **.\NameofFile.ps1**.

Ensure that PowerShell version 7 or later is installed. To install the same, see the [installation instructions website](?tabs=powershell#powershell-install-az-module).

If you're sure that all the items backed up in the vault are no longer required and you want to delete them all at once without reviewing, you can run the PowerShell script directly in this section. The script deletes all the backup items recursively and eventually deletes the entire vault.

:::image type="content" source="./media/backup-azure-delete-vault/generate-delete-vault-powershell-script-inline.png" alt-text="Screenshot that shows the process to generate the delete vault PowerShell script." lightbox="./media/backup-azure-delete-vault/generate-delete-vault-powershell-script-expanded.png":::

Follow these steps:

- **Step 1:** Seek the necessary permissions from the security administrator to delete the vault if MUA was enabled against the vault. [Learn more](./multi-user-authorization.md#authorize-critical-protected-operations-using-azure-active-directory-privileged-identity-management).

- <a id="powershell-install-az-module">**Step 2:**</a> Upgrade to the PowerShell 7 version:

  1. Upgrade to PowerShell 7 and run the following command in your console:
  
     ```azurepowershell-interactive
     iex "& { $(irm https://aka.ms/install-powershell.ps1) } -UseMSI"
     ```

  1. Open PowerShell 7 as an administrator.

- **Step 3:** Save the PowerShell script in .ps1 format. Then, to run the script in your PowerShell console, enter **./NameOfFile.ps1**. This script recursively deletes all backup items and eventually deletes the entire Recovery Services vault.

To access the PowerShell script for vault deletion, see [PowerShell script to delete a Recovery Services vault](./scripts/delete-recovery-services-vault.md).

#### Run the script in the PowerShell console

The script performs the following actions:

- Disables soft delete and security features
- Deletes backup items
- Unregisters servers and storage accounts
- Deletes disaster recovery items
- Removes private endpoints

To delete an individual backup item or write your own script, use the following PowerShell commands:

- Stop protection and delete the backup data:

  If you use SQL in Azure VMs backup and enable autoprotection for SQL instances, first disable the autoprotection.

    ```PowerShell
        Disable-AzRecoveryServicesBackupAutoProtection
           [-InputItem] <ProtectableItemBase>
           [-BackupManagementType] <BackupManagementType>
           [-WorkloadType] <WorkloadType>
           [-PassThru]
           [-VaultId <String>]
           [-DefaultProfile <IAzureContextContainer>]
           [-WhatIf]
           [-Confirm]
           [<CommonParameters>]
    ```

  [Learn more](/powershell/module/az.recoveryservices/disable-azrecoveryservicesbackupautoprotection) about how to disable protection for an item protected by Azure Backup.

- Stop protection and delete data for all backup-protected items in the cloud (for example, IaaS VMs and Azure file share):

    ```PowerShell
       Disable-AzRecoveryServicesBackupProtection
       [-Item] <ItemBase>
       [-RemoveRecoveryPoints]
       [-Force]
       [-VaultId <String>]
       [-DefaultProfile <IAzureContextContainer>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
    ```

    [Learn more](/powershell/module/az.recoveryservices/disable-azrecoveryservicesbackupprotection) about how to disable protection for an Azure Backup-protected item.

After you delete the backed-up data, unregister any on-premises containers and management servers:

- For on-premises files and folders protected by using the Azure Backup agent (MARS) backing up to Azure:

    ```PowerShell
    Unregister-AzRecoveryServicesBackupContainer
              [-Container] <ContainerBase>
              [-PassThru]
              [-VaultId <String>]
              [-DefaultProfile <IAzureContextContainer>]
              [-WhatIf]
              [-Confirm]
              [<CommonParameters>]
    ```

    [Learn more](/powershell/module/az.recoveryservices/unregister-azrecoveryservicesbackupcontainer) about how to unregister a Windows Server or other container from the vault.

- For on-premises machines protected by using MABS or System Center DPM to Azure:

    ```PowerShell
        Unregister-AzRecoveryServicesBackupManagementServer
          [-AzureRmBackupManagementServer] <BackupEngineBase>
          [-PassThru]
          [-VaultId <String>]
          [-DefaultProfile <IAzureContextContainer>]
          [-WhatIf]
          [-Confirm]
          [<CommonParameters>]
    ```

    [Learn more](/powershell/module/az.recoveryservices/unregister-azrecoveryservicesbackupcontainer) about unregistering an Azure Backup management container from the vault.

After you permanently delete backed-up data and unregister all containers, proceed to delete the vault.

To delete a Recovery Services vault:

   ```PowerShell
       Remove-AzRecoveryServicesVault
      -Vault <ARSVault>
      [-DefaultProfile <IAzureContextContainer>]
      [-WhatIf]
      [-Confirm]
      [<CommonParameters>]
   ```

[Learn more](/powershell/module/az.recoveryservices/remove-azrecoveryservicesvault) about how to delete a Recovery Services vault.

# [CLI](#tab/cli)

First, read the [Before you start](#before-you-start) section to understand the dependencies and vault-deletion process.

> [!NOTE]
> Currently, the Azure Backup CLI supports managing only Azure VM backups, so the following command to delete the vault works only if the vault contains Azure VM backups. You can't delete a vault by using the Azure Backup CLI if the vault contains any backup item of type other than Azure VMs.

To delete an existing Recovery Services vault, follow these steps:

- To stop protection and delete the backup data:

    ```azurecli
    az backup protection disable --container-name
                             --item-name
                             [--delete-backup-data {false, true}]
                             [--ids]
                             [--resource-group]
                             [--subscription]
                             [--vault-name]
                             [--yes]
    ```

    For more information, see [az backup protection disable](/cli/azure/backup/protection#az-backup-protection-disable).

- Delete an existing Recovery Services vault:

    ```azurecli
    az backup vault delete [--force]
                       [--ids]
                       [--name]
                       [--resource-group]
                       [--subscription]
                       [--yes]
    ```

    For more information, see [az backup vault](/cli/azure/backup/vault).

# [Azure Resource Manager](#tab/arm)

We recommend that you use Azure Resource Manager to delete the Recovery Services vault only if all the dependencies are removed and you're still getting the *Vault deletion error*. Try any or all of the following tips:

- On the **Essentials** pane in the vault menu, verify that there aren't any backup items, backup management servers, or replicated items listed. If there are backup items, refer to the [Before you start](#before-you-start) section.
- Try [deleting the vault from the portal](#delete-the-recovery-services-vault) again.
- If all the dependencies are removed and you still get the *Vault deletion error*, use the ARMClient tool to perform the following steps:

  1. Go to [chocolatey.org](https://chocolatey.org/) to download and install Chocolatey. Then, install the ARMClient tool by running the following command:

      `choco install armclient --source=https://chocolatey.org/api/v2/`
  1. Sign in to your Azure account, and then run the following command:

      `ARMClient.exe login [environment name]`

  1. In the Azure portal, gather the subscription ID and resource group name for the vault you want to delete.

For more information on the ARMClient command, see [ARMClient README](https://github.com/projectkudu/ARMClient/blob/master/README.md).

### Use the Azure Resource Manager client to delete a Recovery Services vault

1. Run the following command by using your subscription ID, resource group name, and vault name. If you don't have any dependencies, the vault is deleted when you run the following command:

   ```azurepowershell
   ARMClient.exe delete /subscriptions/<subscriptionID>/resourceGroups/<resourcegroupname>/providers/Microsoft.RecoveryServices/vaults/<Recovery Services vault name>?api-version=2015-03-15
   ```

1. If the vault isn't empty, you receive the following error message: "Vault cannot be deleted as there are existing resources within this vault." To remove a protected item or container within a vault, run the following command:

   ```azurepowershell
   ARMClient.exe delete /subscriptions/<subscriptionID>/resourceGroups/<resourcegroupname>/providers/Microsoft.RecoveryServices/vaults/<Recovery Services vault name>/registeredIdentities/<container name>?api-version=2016-06-01
   ```

1. In the Azure portal, make sure that the vault is deleted.

---

## Related content

- [Learn about Recovery Services vaults](backup-azure-recovery-services-vault-overview.md)
- [Learn about monitoring and managing Recovery Services vaults](backup-azure-manage-windows-server.md)
- [Update the soft delete state for Recovery Services vaults by using the REST API](use-restapi-update-vault-properties.md)
