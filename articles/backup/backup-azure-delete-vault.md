<properties
   pageTitle="Delete an Azure Backup vault. Troubleshooting why you can't delete a backup vault"
   description="How to delete an Azure Backup vault."
   services="service-name"
   documentationCenter="dev-center-name"
   authors="markgalioto"
   manager="cfreeman"
   editor=""/>

<tags
   ms.service="backup"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="storage-backup-recovery"
   ms.date="08/25/2016"
   ms.author="markgal;trinadhk"/>

# Delete an Azure Backup vault

Deleting a Recovery Services vault can seem difficult. The Azure Backup service has two types of vaults - the Backup vault and the Recovery Services vault. The Backup vault came first. Then the Recovery Services vault came along to support the expanded Resource Manager deployments. Because of the expanded capabilities and the information dependencies that must be stored in the vault, deleting a Recovery Services vault can seem harder than it has to be.

|**Deployment**|**Portal**|**Vault**|
|--------------|----------|---------|
|Classic|Classic|Backup vault|
|Resource Manager|Azure|Recovery Services vault|


> [AZURE.NOTE] Backup vaults cannot protect Resource Manager-deployed solutions. However, you can use a Recovery Services vault to protect classically-deployed servers and VMs.  

In this article, we'll use the term, vault, to refer to the generic form of the Backup vault or Recovery Services vault. We'll provide the formal name, Backup vault or Recovery Services vault, when it is necessary to create a distinction between the types of vault.



## Deleting a Recovery Services vault

Deleting a Recovery Services vault is a one-step process - *provided the vault doesn't contain any resources*. Before you can delete a Recovery Services vault, you must remove or delete all resources in the vault. If you attempt to delete a vault that contains resources, you'll get an error like the one below.

![Vault deletion error](./media/backup-azure-delete-vault/vault-deletion-error.png) <br/>

Until you have cleared the resources from the vault, clicking **Retry** will produce the same error. If you're stuck on this error message, click **Cancel** and follow the steps below to delete the resources in a Recovery Services vault.

### Removing the items in a Recovery Services vault

If you already have the Recovery Services vault open, skip to the second step.

1.  Open the Azure portal, and from the Dashboard open the vault you want to delete.

    If you don't have the Recovery Services vault pinned to the Dashboard, on the Hub menu, click **More Services** and in the list of resources, type **Recovery Services**. As you begin typing, the list will filter based on your input. Click **Recovery Services vaults**.

    ![Create Recovery Services Vault step 1](./media/backup-azure-delete-vault/open-recovery-services-vault.png) <br/>

    The list of Recovery Services vaults is displayed. From the list, select the vault you want to delete.

    ![choose vault from list](./media/backup-azure-work-with-vaults/choose-vault-to-delete.png)

2. In the vault view, look at the **Essentials** pane. To delete a vault, there cannot be any protected items. If you see a number other than zero, under either **Backup Items**, **Backup management servers**, or **Replicated items**, you must remove those items before you can delete the vault.

    ![Look at Essentials pane for protected items](./media/backup-azure-delete-vault/contoso-bkpvault-settings.png)

3. To begin removing the protected items from the vault, find the items in the vault. In the vault dashboard click **Settings**, and then click **Backup items** to open that blade.

    ![choose vault from list](./media/backup-azure-delete-vault/open-settings-and-backup-items.png)

    The **Backup Items** blade has separate lists, based on the Item Type: Azure Virtual Machines or File-Folders (see image). The default Item Type list shown is Azure Virtual Machines. To view the list of File-Folders items in the vault, select **File-Folders** from the drop-down menu.

4. Before you can delete an item from the vault, you must stop the item's backup job and delete the recovery point data. For each item in the vault, follow these steps:

    1. On the **Backup Items** blade, right-click the item, and from the context menu, select **Stop backup**.

        ![stop the backup job](./media/backup-azure-delete-vault/stop-the-backup-process.png)

        The Stop Backup blade opens.

    2. On the **Stop Backup** blade, from the **Choose an option** menu, select **Delete Backup Data** > type the name of the item > and click **Stop backup**.

        Type the name of the item to verify you want to delete it. The **Stop Backup** button will not activate until you verify the item to stop. If you do not see the dialog box to type the name of the backup item, you have chosen the **Retain Backup Data** option.

        ![delete backup data](./media/backup-azure-delete-vault/stop-backup-blade-delete-backup-data.png)

        Optionally, you can provide a reason why you are deleting the data, and add comments. After you click **Stop Backup**, allow the delete job to complete before attempting to delete the vault. To verify that the job has completed, check the Azure Messages ![delete backup data](./media/backup-azure-delete-vault/messages.png). <br/>
        Once the job is complete, you'll receive a message stating the backup process was stopped and the backup data was deleted for that item.

    3. After deleting an item in the list, on the **Backup Items** menu, click **Refresh** to see the remaining items in the vault.

    ![delete backup data](./media/backup-azure-delete-vault/empty-items-list.png)

    When there are no items in the list, scroll to the **Essentials** pane in the Backup vault blade. There shouldn't be any **Backup items**, **Backup management servers**, or **Replicated items** listed. If items still appear in the vault, return to step 3 and choose a different item type list.  

5. When there are no more items in the vault toolbar, click **Delete**.

    ![delete backup data](./media/backup-azure-delete-vault/delete-vault.png)

6. When asked to verify that you want to delete the vault, click **Yes**.

    The vault is deleted and the portal returns to the **New** service menu.


### What if I stopped the backup process but retained the data?

If you accidentally stopped the backup process but *retained* the data, you must delete the backup data before you can delete the vault. To delete the backup data:

1. On the **Backup Items** blade, right-click the item, and on the context menu click **Delete backup data**.

    ![delete backup data](./media/backup-azure-delete-vault/delete-backup-data-menu.png)

    The **Delete Backup Data** blade opens.

2. On the **Delete Backup Data** blade, type the name of the item, and click **Delete**.

    ![delete backup data](./media/backup-azure-delete-vault/delete-retained-vault.png)

## Delete a Backup vault

The following instructions are for deleting a Backup vault in the classic portal. The premise for deleting a Backup vault is the same as deleting a Recovery Services vault: you must delete the items and the data from the Backup vault before you can delete it.

1. Open the Classic portal.

2. From the list of backup vaults, select the vault you want to delete.

    ![delete backup data](./media/backup-azure-delete-vault/classic-portal-delete-vault-open-vault.png)

    The vault dashboard opens. Look at the number of Windows Servers and/or Azure virtual machines associated with the vault. Also, look at the total storage consumed in Azure. You'll need to stop any backup jobs and delete existing data before deleting the vault.

3. Click the **Protected Items** tab, and then click **Stop Protection**

    ![delete backup data](./media/backup-azure-delete-vault/classic-portal-delete-vault-stop-protect.png)

    The **Stop protection of 'your vault'** dialog appears.

4. In the **Stop protection of 'your vault'** dialog, check **Delete associated backup data** and click ![checkmark](./media/backup-azure-delete-vault/checkmark.png). <br/>
    Optionally, you can choose a reason for stopping protection, and provide a comment.

    ![delete backup data](./media/backup-azure-delete-vault/classic-portal-delete-vault-verify-stop-protect.png)

    After deleting the items in the vault, the vault will be empty.

    ![delete backup data](./media/backup-azure-delete-vault/classic-portal-delete-vault-post-delete-data.png)

5. In the list of tabs, click **Registered Items**. For each item registered in the vault, select the item, and click **Unregister**.

    ![delete backup data](./media/backup-azure-delete-vault/classic-portal-unregister.png)

6. In the list of tabs, click **Dashboard** to open that tab. Verify there are no registered servers or Azure virtual machines protected in the cloud. Also, verify there is no data in storage. Click **Delete** to delete the vault.

    ![delete backup data](./media/backup-azure-delete-vault/classic-portal-list-of-tabs-dashboard.png)

    The Delete Backup vault confirmation screen opens. Select an option why you're deleting the vault, and click ![checkmark](./media/backup-azure-delete-vault/checkmark.png). <br/>

    ![delete backup data](./media/backup-azure-delete-vault/classic-portal-delete-vault-confirmation-1.png)

    The vault is deleted, and you return to the classic portal dashboard.

### Next steps
