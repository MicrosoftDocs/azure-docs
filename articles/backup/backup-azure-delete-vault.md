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

| Deployment|Portal|Vault|
|-----------|------|-----|
|Classic|Classic|Backup vault|
|Resource Manager|Azure|Recovery Services vault|


> [AZURE.NOTE] Backup vaults cannot protect Resource Manager-deployed solutions. However, you can use a Recovery Services vault to protect classically-deployed servers and VMs.  

In this article, we'll use the term, vault, to refer to the generic form of the Backup vault or Recovery Services vault. We'll provide the formal name, Backup vault or Recovery Services, when it is necessary to create a distinction between the types of vault.



## Delete a Recovery Services vault

Deleting a Recovery Services vault is a simple process - *provided that it doesn't contain any resources*. Before you can delete a Recovery Services vault, you must remove or delete all resources in the vault. If you attempt to delete a vault that contains resources, you'll get an error like the one below.

![Vault deletion error](./media/backup-azure-delete-vault/vault-deletion-error.png) <br/>

Until you have cleared the resources from the vault, clicking **Retry** will produce the same error. Click **Cancel** and follow the steps to Delete the resources in a Recovery Services vault.

Delete the resources in a Recovery Services vault:

1. Open the Azure portal, and from the Dashboard open the vault you want to delete.
   If you don't have the Recovery Services vault pinned to the Dashboard, on the Hub menu, click **More Services** and in the list of resources, type **Recovery Services**. As you begin typing, the list will filter based on your input. Click **Recovery Services vaults**.

    ![Create Recovery Services Vault step 1](./media/backup-azure-delete-vault/open-recovery-services-vault.png) <br/>

    The list of Recovery Services vaults is displayed. From the list, select the vault you want to delete.

    ![choose vault from list](./media/backup-azure-work-with-vaults/choose-vault-to-delete.png)

2. In the vault view, look at the **Essentials** pane. To delete a vault, there cannot be any protected items. If you see a number other than zero, under either **Backup Items**, **Backup management servers**, or **Replicated items**, you must remove those items before you can delete the vault.

    ![Look at Essentials pane for protected items](./media/backup-azure-work-with-vaults/vault-settings.png)

3. To begin removing the protected items from the vault, in the vault dashboard click **Settings** to open the **Settings** blade, and then click **Backup items** to open that blade.

    ![choose vault from list](./media/backup-azure-delete-vault/open-settings-and-backup-items.png)

    The Backup Items blade lists the items in the vault, based on the Item Type. There are two Item Types: Azure Virtual Machines and File-Folders. The default item type shown is Azure Virtual Machines. To view the list of File-Folders items in the vault, select File-Folders from the drop-down menu.

4. You must stop each item's backup job before you can delete it. For each item in the vault, follow these steps:

    1. On the **Backup Items** blade, right-click the item, and in the context menu, click **Stop backup**.

    ![stop the backup job](./media/backup-azure-delete-vault/stop-the-backup-process.png)

    The Stop Backup blade opens.

    2. On the **Stop Backup** blade, from the **Choose an option** menu, select **Delete Backup Data**, type the name of the item, and click **Stop backup**. You must correctly type the name of the item to verify you want to delete it. The **Stop Backup** button will not activate until you verify the item to stop. If you do not see the box to type the name of the backup item, then you have chosen the **Retain Backup Data** option.

    ![delete backup data](./media/backup-azure-delete-vault/stop-backup-blade-delete-backup-data.png)

    Optionally, you can provide a reason why you are deleting the data, and add comments. After you click **Stop Backup**, allow the delete job to complete before attempting to delete the vault. To verify that the job has completed, check Messages ![delete backup data](./media/backup-azure-delete-vault/messages.png). <br/>
    Once the job is complete, you'll receive a message stating the backup process was stopped and the backup data was deleted for that item.
    If you accidentally stop the backup process but retain the data, you must delete the backup data before you can delete the vault. To delete the backup data, on the **Backup Items** blade, right-click the item, and on the context menu click **Delete backup data**. On the **Delete Backup Data** blade, type the name of the item, and click **Delete**.
    scroll to the Essentials pane in the Backup vault blade. There shouldn't be any VMs or servers listed.


3. In the vault toolbar, click **Delete**.

![delete backup data](./media/backup-azure-delete-vault/delete-vault.png)

## Create a backup vault

## Delete a backup vault

### Next steps
