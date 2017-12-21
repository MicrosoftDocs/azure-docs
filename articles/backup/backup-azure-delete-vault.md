---
title: ' Delete a Recovery Services vault in Azure | Microsoft Docs '
description: This article explains how to delete a Recovery Services vault. The article includes troubleshooting steps when you try to delete a vault, but can't. 
services: service-name
documentationcenter: dev-center-name
author: markgalioto
manager: carmonm
editor: ''

ms.assetid: 5fa08157-2612-4020-bd90-f9e3c3bc1806
ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 12/20/2017
ms.author: markgal;trinadhk

---
# Delete a Recovery Services vault
This article explains how to delete a Recovery Services vault in the Azure portal. If you had Backup vaults, they have been converted to Recovery Services vaults.   

Deleting a Recovery Services vault is a one-step process - *provided the vault doesn't contain any resources*. Before you can delete a Recovery Services vault, you must remove or delete all resources in the vault. If you attempt to delete a vault that contains resources, you get an error like the following image:

![Vault deletion error](./media/backup-azure-delete-vault/vault-deletion-error.png) <br/>

Until you have cleared the resources from the vault, clicking **Retry** produces the same error. If you're stuck on this error message, click **Cancel** and use the following steps to delete the resources in the vault.

## Removing items from a vault protecting a VM
If you already have the Recovery Services vault open, skip to the second step.

1. Open the Azure portal, and from the Dashboard open the vault you want to delete.

   If you don't have the Recovery Services vault pinned to the Dashboard, on the Hub menu, click **More Services** and in the list of resources, type **Recovery Services**. As you begin typing, the list filters based on your input. Click **Recovery Services vaults**.

   ![Create Recovery Services Vault step 1](./media/backup-azure-delete-vault/open-recovery-services-vault.png) <br/>

   The list of Recovery Services vaults is displayed. From the list, select the vault you want to delete.

   ![choose vault from list](./media/backup-azure-work-with-vaults/choose-vault-to-delete.png)
2. In the vault view, look at the **Essentials** pane. To delete a vault, there cannot be any protected items. If the **Backup Items** or **Backup management servers** do not show zero, you must remove those items. You can't delete the vault if it contains data.

    ![Look at Essentials pane for protected items](./media/backup-azure-delete-vault/contoso-bkpvault-settings.png)

    VMs and Files/Folders are considered Backup Items, and are listed in the **Backup Items** area of the Essentials pane. A DPM server is listed in the **Backup Management Server** area of the Essentials pane. **Replicated Items** pertain to the Azure Site Recovery service.
3. To begin removing the protected items from the vault, find the items in the vault. In the vault dashboard click **Settings**, and then click **Backup items** to open that menu.

    ![choose vault from list](./media/backup-azure-delete-vault/open-settings-and-backup-items.png)

    The **Backup Items** menu has separate lists, based on the Item Type: Azure Virtual Machines or File-Folders (see image). The default Item Type list shown is Azure Virtual Machines. To view the list of File-Folders items in the vault, select **File-Folders** from the drop-down menu.
4. Before you can delete an item from the vault protecting a VM, you must stop the item's backup job and delete the recovery point data. For each item in the vault, follow these steps:

    a. On the **Backup Items** menu, right-click the item, and from the context menu, select **Stop backup**.

    ![stop the backup job](./media/backup-azure-delete-vault/stop-the-backup-process.png)

    The Stop Backup menu opens.

    b. On the **Stop Backup** menu, from the **Choose an option** menu, select **Delete Backup Data** > type the name of the item > and click **Stop backup**.

    Type the name of the item, to verify you want to delete it. The **Stop Backup** button activates once you verify the item. If you do not see the dialog box to type the name of the backup item, you chose the **Retain Backup Data** option.

    ![delete backup data](./media/backup-azure-delete-vault/stop-backup-blade-delete-backup-data.png)

    Optionally, you can provide a reason why you are deleting the data, and add comments. After you click **Stop Backup**, allow the delete job to complete before attempting to delete the vault. To verify that the job has completed, check the Azure Messages ![delete backup data](./media/backup-azure-delete-vault/messages.png). <br/>
    Once the job is complete, the service sends a message: the backup process was stopped and the backup data was deleted.

    c. After deleting an item in the list, on the **Backup Items** menu, click **Refresh** to see the remaining items in the vault.

      ![delete backup data](./media/backup-azure-delete-vault/empty-items-list.png)

      When there are no items in the list, scroll to the **Essentials** pane in the Recovery Services vault menu. There shouldn't be any **Backup items**, **Backup management servers**, or **Replicated items** listed. If items still appear in the vault, return to step three and choose a different item type list.  
5. When there are no more items in the vault toolbar, click **Delete**.

    ![delete backup data](./media/backup-azure-delete-vault/delete-vault.png)
6. To verify that you want to delete the vault, click **Yes**.

    The vault is deleted and the portal returns to the **New** service menu.

## What if I stopped the backup process but retained the data?
If you stopped the backup process but accidentally *retained* the data, you must delete the backup data before you can delete the vault. To delete the backup data:

1. On the **Backup Items** menu, right-click the item, and on the context menu click **Delete backup data**.

    ![delete backup data](./media/backup-azure-delete-vault/delete-backup-data-menu.png)

    The **Delete Backup Data** menu opens.
2. On the **Delete Backup Data** menu, type the name of the item, and click **Delete**.

    ![delete backup data](./media/backup-azure-delete-vault/delete-retained-vault.png)

    Once you have deleted the data, return to step 4c and continue with the process.

## Delete a vault used to protect a DPM server
Before you can delete a vault used to protect a DPM server, you must clear any recovery points that have been created, and then unregister the server from the vault.

To delete the data associated with a protection group:

1. In the DPM Administrator Console, click **Protection** > select a protection group > select the Protection Group Member > and in the tool ribbon, click **Remove**.

  Select the Protection Group Member to activate the **Remove** button in the tool ribbon. In the example, the member is **dummyvm9**. To select multiple members in the protection group, hold down the Ctrl key while clicking on the members.

    ![delete backup data](./media/backup-azure-delete-vault/az-portal-delete-protection-group.png)

    The **Stop Protection** dialog opens.
2. In the **Stop Protection** dialog, select **Delete protected data**, and click **Stop Protection**.

    ![delete backup data](./media/backup-azure-delete-vault/delete-dpm-protection-group.png)

    To delete a vault, you must clear, or delete, the vault of protected data. If there are many recovery points, and data in the protection group, it can take several minutes to delete the data. The **Stop Protection** dialog shows when the job has completed.

    ![delete backup data](./media/backup-azure-delete-vault/success-deleting-protection-group.png)
3. Continue this process for all members in all protection groups.

    Remove all protected data and protection groups.
4. After deleting all members from the protection group, switch to the Azure portal. Open the vault dashboard, and make sure there are no **Backup Items**, **Backup management servers**, or **Replicated items**. On the vault toolbar, click **Delete**.

    ![delete backup data](./media/backup-azure-delete-vault/delete-vault.png)

    If there are Backup management servers registered to the vault, you can't delete the vault even if there is no data in the vault. If you deleted the Backup management servers associated with the vault, but there are servers listed in the **Essentials** pane, see [Find the Backup management servers registered to the vault](backup-azure-delete-vault.md#find-the-backup-management-servers-registered-to-the-vault).
5. To verify that you want to delete the vault, click **Yes**.

    The vault is deleted and the portal returns to the **New** service menu.

## Delete a vault used to protect a Production server
Before you can delete a vault used to protect a Production server, you must delete or unregister the server from the vault.

To delete the Production server associated with the vault:

1. In the Azure portal, open the vault dashboard and click **Settings** > **Backup Infrastructure** > **Production Servers**.

    ![open Production Servers menu](./media/backup-azure-delete-vault/delete-production-server.png)

    The **Production Servers** menu opens and lists all Production servers in the vault.

    ![list of Production Servers](./media/backup-azure-delete-vault/list-of-production-servers.png)
2. On the **Production Servers** menu, right-click on the server, and click **Delete**.

    ![delete production server ](./media/backup-azure-delete-vault/delete-server-on-production-server-blade.png)

    The **Delete** menu opens.

    ![delete production server ](./media/backup-azure-delete-vault/delete-blade.png)
3. On the **Delete** menu, confirm the server name, and click **Delete**. You must correctly name the server, to activate the **Delete** button.

    Once the vault is deleted, you receive a message stating the vault has been deleted. After deleting all servers in the vault, scroll back to the Essentials pane in the vault dashboard.
4. In the vault dashboard, make sure there are no **Backup Items**, **Backup management servers**, or **Replicated items**. On the vault toolbar, click **Delete**.
5. To verify that you want to delete the vault, click **Yes**.

    The vault is deleted and the portal returns to the **New** service menu.

## Find the Backup Management servers registered to the vault
If you have multiple servers registered to a vault, it can be difficult to remember them. To see the servers registered to the vault, and delete them:

1. Open the vault dashboard.
2. In the **Essentials** pane, click **Settings** to open that menu.

    ![open settings menu](./media/backup-azure-delete-vault/backup-vault-click-settings.png)
3. On the **Settings** menu, click **Backup Infrastructure**.
4. On the **Backup Infrastructure** menu, click **Backup Management Servers**. The Backup Management Servers menu opens.

    ![list of backup management servers](./media/backup-azure-delete-vault/list-of-backup-management-servers.png)
5. To delete a server from the list, right-click the name of the server and then click **Delete**.
    The **Delete** menu opens.
6. On the **Delete** menu, provide the name of the server. If it is a long name, you can copy and paste it from the list of Backup Management Servers. Then click **Delete**.  
