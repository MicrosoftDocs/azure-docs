---
 title: storage-files-create-clean-up-portal
 description: Clean up after Azure Files quickstarts and tutorials.
 services: storage
 author: wmgries
 ms.service: storage
 ms.topic: include
 ms.date: 07/18/2022
 ms.author: wgries
 ms.custom: include file
---
When you're done, delete the resource group. Deleting the resource group deletes the storage account, the Azure file share, and any other resources deployed inside the resource group.

If there are locks on the storage account, you'll need to remove them first. Navigate to the storage account and select **Settings** > **Locks**. If any locks are listed, delete them.

You might also need to [delete the Azure Backup Recovery Services vault](../articles/backup/backup-azure-delete-vault.md) before you're allowed to delete the resource group.

1. Select **Home** and then **Resource groups**.
1. Select the resource group you want to delete.
1. Select **Delete resource group**. A window opens and displays a warning about the resources that will be deleted with the resource group.
1. Enter the name of the resource group, and then select **Delete**.
