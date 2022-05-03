---
 title: storage-files-create-storage-account-portal
 description: Create a storage account for Azure Files using the Azure portal.
 services: storage
 author: wmgries
 ms.service: storage
 ms.subservice: files
 ms.topic: include
 ms.date: 04/01/2022
 ms.author: wgries
 ms.custom: include file
---
A storage account is a shared pool of storage in which you can deploy an Azure file share or other storage resources, such as blobs or queues. A storage account can contain an unlimited number of shares. A share can store an unlimited number of files, up to the capacity limits of the storage account.

To create a storage account using the Azure portal:

1. Under **Azure services**, select **+** to create a resource.
1. Select **Storage account** to create a storage account.

    :::image type="content" source="../articles/storage/files/media/storage-how-to-use-files-portal/create-storage-account-1.png" alt-text="A screenshot of the storage account option in the create a resource blade." lightbox="../articles/storage/files/media/storage-how-to-use-files-portal/create-storage-account-1.png":::

1. Under **Project details**, select the Azure subscription in which to create the storage account. If you have only one subscription, it should be the default.
1. Select **Create new** to create a new resource group. For the name, enter *myResourceGroup*.
1. Under **Instance details**, provide a name for the storage account such as *mystorageacct* followed by a few random numbers to make it a globally unique name. A storage account name must be all lowercase and numbers, and must be between 3 and 24 characters. Make a note of your storage account name. You will use it later.
1. In **Region**, select **East US**.
1. In **Performance**, keep the default value of **Standard**.
1. In **Redundancy**, select **Locally redundant storage (LRS)**.

   :::image type="content" source="../articles/storage/files/media/storage-how-to-use-files-portal/create-storage-account-2.png" alt-text="Screenshot showing how to enter the project and instance details for a storage account using the Azure portal." lightbox="../articles/storage/files/media/storage-how-to-use-files-portal/create-storage-account-2.png":::

1. Select **Review + Create** to review your settings and create the storage account.
1. When you see the **Validation passed** notification, select **Create**. You should see a notification that deployment is in progress.
