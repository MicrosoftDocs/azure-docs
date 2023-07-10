---
 title: storage-files-create-storage-account-portal
 description: Create a storage account for Azure Files using the Azure portal.
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 10/24/2022
 ms.author: kendownie
 ms.custom: include file
---
A storage account is a shared pool of storage in which you can deploy an Azure file share or other storage resources, such as blobs or queues. A storage account can contain an unlimited number of shares. A share can store an unlimited number of files, up to the capacity limits of the storage account.

To create a storage account using the Azure portal:

1. Under **Azure services**, select **Storage accounts**.
1. Select **+ Create** to create a storage account.
1. Under **Project details**, select the Azure subscription in which to create the storage account. If you have only one subscription, it should be the default.
1. If you want to create a new resource group, select **Create new** and enter a name such as *myexamplegroup*.
1. Under **Instance details**, provide a name for the storage account. You might need to add a few random numbers to make it a globally unique name. A storage account name must be all lowercase and numbers, and must be between 3 and 24 characters. Make a note of your storage account name. You'll use it later.
1. In **Region**, select the region you want to create your storage account in.
1. In **Performance**, keep the default value of **Standard**.
1. In **Redundancy**, select **Locally redundant storage (LRS)**.

   :::image type="content" source="media/storage-files-create-storage-account-portal/create-storage-account.png" alt-text="Screenshot showing how to enter the project and instance details for a storage account using the Azure portal." lightbox="media/storage-files-create-storage-account-portal/create-storage-account.png":::

1. Select **Review** to review your settings. Azure will run a final validation.
1. When validation is complete, select **Create**. You should see a notification that deployment is in progress.
