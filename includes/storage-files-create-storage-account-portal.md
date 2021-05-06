---
 title: storage-files-create-storage-account-portal
 description: Create a storage account for Azure Files.
 services: storage
 author: wmgries
 ms.service: storage
 ms.topic: include
 ms.date: 04/15/2021
 ms.author: wgries
 ms.custom: include file
---
A storage account is a shared pool of storage in which you can deploy an Azure file share or other storage resources, such as blobs or queues. A storage account can contain an unlimited number of shares. A share can store an unlimited number of files, up to the capacity limits of the storage account.

To create a storage account:

1. In the left menu, select **+** to create a resource.
1. Select **Storage account** to create a storage account.

    :::image type="content" source="../articles/storage/files/media/storage-how-to-use-files-portal/create-storage-account-1.png" alt-text="A screenshot of the storage account option in the create a resource blade." lightbox="../articles/storage/files/media/storage-how-to-use-files-portal/create-storage-account-1.png":::

1. In **Name**, enter *mystorageacct* followed by a few random numbers, until you see a green check mark that indicates that it's a unique name. A storage account name must be all lowercase and globally unique. Make a note of your storage account name. You will use it later. 
1. In **Performance**, keep the default value of **Standard**.
1. In **Replication**, select **Locally redundant storage (LRS)**.
1. In **Subscription**, select the subscription that was used to create the storage account. If you have only one subscription, it should be the default.
1. In **Resource group**, select **Create new**. For the name, enter *myResourceGroup*.
1. In **Location**, select **East US**.
1. When you're finished, select **Create** to start the deployment.