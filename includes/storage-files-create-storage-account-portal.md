---
 title: storage-files-create-storage-account-portal
 description: Create a storage account for Azure Files.
 services: storage
 author: wmgries
 ms.service: storage
 ms.topic: include
 ms.date: 03/28/2018
 ms.author: wgries
 ms.custom: include file
---
A storage account is a shared pool of storage in which you can deploy an Azure file share or other storage resources, such as blobs or queues. A storage account can contain an unlimited number of shares. A share can store an unlimited number of files, up to the capacity limits of the storage account.

To create a storage account:

1. In the left menu, select **+** to create a resource.
2. In the search box, enter **storage account**, select **Storage account - blob, file, table, queue**, and then select **Create**.
	![A screenshot of what the storage account entry should look like in the resource search dialog](../articles/storage/files/media/storage-how-to-use-files-portal/create-storage-account-1.png)

3. In **Name**, enter *mystorageacct* followed by a few random numbers, until you see a green check mark that indicates that it's a unique name. A storage account name must be all lowercase and globally unique. Make a note of your storage account name. You will use it later. 
4. In **Deployment model**, leave the default value of **Resource Manager**. To learn more about the differences between Azure Resource Manager and the classic deployment model, see [Understand deployment models and the state of your resources](../articles/azure-resource-manager/resource-manager-deployment-model.md).
5. In **Account kind**, select **StorageV2**. To learn more about the different kinds of storage accounts, see [Understand Azure storage accounts](../articles/storage/common/storage-account-options.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).
6. In **Performance**, keep the default value of **Standard storage**. Azure Files currently supports only standard storage; even if you select Azure Premium Storage, your file share is stored in standard storage.
7. In **Replication**, select **Locally redundant storage (LRS)**. 
8. In **Secure transfer required**, we recommend that you always select **Enabled**. To learn more about this option, see [Understand encryption in-transit](../articles/storage/common/storage-require-secure-transfer.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).
9. In **Subscription**, select the subscription that was used to create the storage account. If you have only one subscription, it should be the default.
10. In **Resource group**, select **Create new**. For the name, enter *myResourceGroup*.
11. In **Location**, select **East US**.
12. In **Virtual networks**, leave the default option as **Disabled**. 
13. To make the storage account easier to find, select **Pin to dashboard**.
14. When you're finished, select **Create** to start the deployment.