---
title: Delete a Recovery Services vault in Azure
description: Describes how to delete a Recovery Services vault.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 06/13/2019
ms.author: raynew
---
# Delete a Recovery Services vault

This article describes how to delete an [Azure Backup](backup-overview.md) Recovery Services vault. It contains instructions for removing dependencies and then deleting a vault, and deleting a vault by force.


## Before you start

Before you start, it's important to understand that you can't delete a Recovery Services vault that has servers registered in it, or that holds backup data.

- To gracefully delete a vault, unregister servers it contains, remove vault data, and then delete the vault.
- If you try to delete a vault that still has dependencies, an error message is issued, and you will need to manually remove the vault dependencies, including:
    - Backed up items
    - Protected servers
    - Backup management servers (Azure Backup Server, DPM)
    ![select your vault to open its dashboard](./media/backup-azure-delete-vault/backup-items-backup-infrastructure.png)
- If you don't want to retain any data in the Recovery Services vault, and want to delete the vault, you can delete the vault by force.
- If you try to delete a vault, but can't, the vault is still configured to receive backup data.


## Delete a vault from the Azure portal

1. Open the vault dashboard.  
2. In the dashboard, click **Delete**. Verify that you want to delete.

    ![select your vault to open its dashboard](./media/backup-azure-delete-vault/contoso-bkpvault-settings.png)

If you receive an error, remove [backup items](#remove-backup-items), [infrastructure servers](#remove-backup-management-servers), and [recovery points](#remove-azure-backup-agent-recovery-points), and then delete the vault.

![delete vault error](./media/backup-azure-delete-vault/error.png)


## Delete the Recovery Services vault using Azure Resource Manager client

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

1. Install chocolatey from [here](https://chocolatey.org/) and to install ARMClient run the below command:

   ` choco install armclient --source=https://chocolatey.org/api/v2/ `
2. Login to Azure account, running the below command

    ` ARMClient.exe login [environment name] `

3. In the Azure portal, gather the subscription ID and resource group name for the vault you want to delete.

For more information on ARMClient command, refer this [document](https://github.com/projectkudu/ARMClient/blob/master/README.md).

### Use Azure Resource Manager client to delete Recovery Services vault

1. Run the following command using your subscription ID, resource group name, and vault name. When you run the command it deletes the vault if you don’t have any dependencies.

   ```
   ARMClient.exe delete /subscriptions/<subscriptionID>/resourceGroups/<resourcegroupname>/providers/Microsoft.RecoveryServices/vaults/<recovery services vault name>?api-version=2015-03-15
   ```
2. If the vault's not empty, you receive the error "Vault cannot be deleted as there are existing resources within this vault". To remove a protected items / container within a vault, do the following:

   ```
   ARMClient.exe delete /subscriptions/<subscriptionID>/resourceGroups/<resourcegroupname>/providers/Microsoft.RecoveryServices/vaults/<recovery services vault name>/registeredIdentities/<container name>?api-version=2016-06-01
   ```

3. In the Azure portal, verify that the vault is deleted.


## Remove vault items and delete the vault

These procedures provide some examples for removing backup data and infrastructure servers. After everything's removed from a vault, you can delete it.

### Remove backup items

This procedure provides an example that shows you how to remove backup data from Azure Files.

1. Click **Backup Items** > **Azure Storage (Azure Files)**

    ![select the backup type](./media/backup-azure-delete-vault/azure-storage-selected-list.png)

2. Right-click each Azure Files item to remove, and click  **Stop backup**.

    ![select the backup type](./media/backup-azure-delete-vault/stop-backup-item.png)


3. In **Stop Backup** > **Choose an option**, select **Delete Backup Data**.
4. Type the name of the item, and click **Stop backup**.
   - This verifies that you want to delete the item.
   - The **Stop Backup** button activates after you verify.
   - If you retain and don't delete the data, you won't be able to delete the vault.

     ![delete backup data](./media/backup-azure-delete-vault/stop-backup-blade-delete-backup-data.png)

5. Optionally, provide a reason why you're deleting the data, and add comments.
6. To verify that the delete job completed, check the Azure Messages ![delete backup data](./media/backup-azure-delete-vault/messages.png).
7. After the job completes, the service sends a message: **the backup process was stopped and the backup data was deleted**.
8. After deleting an item in the list, on the **Backup Items** menu, click **Refresh** to see the items in the vault.

      ![delete backup data](./media/backup-azure-delete-vault/empty-items-list.png)


### Remove Backup Management Servers

1. In the vault dashboard menu, click **Backup Infrastructure**.
2. Click **Backup Management Servers** to view servers.

    ![select your vault to open its dashboard](./media/backup-azure-delete-vault/delete-backup-management-servers.png)

3. Right-click the item > **Delete**.
4. On the **Delete** menu, type the name of the server, and click **Delete**.

     ![delete backup data](./media/backup-azure-delete-vault/delete-protected-server-dialog.png)
5.  Optionally, provide a reason why you're deleting the data, and add comments.

> [!NOTE]
> Backup items associated with a Backup Management Server or Azure Backup Agent server must be deleted before those server’s registrations are deleted. To remove Backup items, navigate to the SC DPM, MABS or the MARS management console on the server as applicable, and select the relevant options to stop protection and delete backups. If any backup items are still associated, you will see the following error:
> 
>![deletion failed](./media/backup-azure-delete-vault/deletion-failed.png)

6. To verify that the delete job completed, check the Azure Messages ![delete backup data](./media/backup-azure-delete-vault/messages.png).
7. After the job completes, the service sends a message: **the backup process was stopped and the backup data was deleted**.
8. After deleting an item in the list, on the **Backup Infrastructure** menu, click **Refresh** to see the items in the vault.


### Remove Azure Backup agent recovery points

1. In the vault dashboard menu, click **Backup Infrastructure**.
2. Click **Protected Servers** to view the infrastructure servers.

    ![select your vault to open its dashboard](./media/backup-azure-delete-vault/identify-protected-servers.png)

3. In the **Protected Servers** list, click Azure Backup Agent.

    ![select the backup type](./media/backup-azure-delete-vault/list-of-protected-server-types.png)

4. Click the server in the list of servers protected using Azure Backup agent.

    ![select the specific protected server](./media/backup-azure-delete-vault/azure-backup-agent-protected-servers.png)

5. On the selected server dashboard, click **Delete**.

    ![delete the selected server](./media/backup-azure-delete-vault/selected-protected-server-click-delete.png)

6. On the **Delete** menu, type the name of the server, and click **Delete**.

     ![delete backup data](./media/backup-azure-delete-vault/delete-protected-server-dialog.png)

7. Optionally, provide a reason why you're deleting the data, and add comments.

> [!NOTE]
> Backup items associated with a Backup Management Server or Azure Backup Agent server must be deleted before those server’s registrations are deleted. To remove Backup items, navigate to the SC DPM, MABS or the MARS management console on the server as applicable, and select the relevant options to stop protection and delete backups. If any backup items are still associated, you will see the following error:
> 
> 
>![deletion failed](./media/backup-azure-delete-vault/deletion-failed.png)

1. To verify that the delete job completed, check the Azure Messages ![delete backup data](./media/backup-azure-delete-vault/messages.png).
1. After deleting an item in the list, on the **Backup Infrastructure** menu, click **Refresh** to see the items in the vault.

### Delete the vault after removing dependencies

1. When all dependencies have been removed, scroll to the **Essentials** pane in the vault menu.
2. Verify that there aren't any **Backup items**, **Backup management servers**, or **Replicated items** listed. If items still appear in the vault, remove them.

3. When there are no more items in the vault, on the vault dashboard click **Delete**.

    ![delete backup data](./media/backup-azure-delete-vault/vault-ready-to-delete.png)

4. To verify that you want to delete the vault, click **Yes**. The vault is deleted and the portal returns to the **New** service menu.

## What if I stop the backup process but retain the data?

If you stop the backup process but accidentally retain the data, you must delete the backup data as described in the previous sections.

## Next steps

[Learn about](backup-azure-recovery-services-vault-overview.md) Recovery Services vaults.
