---
title: "Quickstart: Use Azure Storage Explorer to create a blob in object storage"
description: In this quickstart, you learn how to use Azure Storage Explorer to create a container and a blob. Next, you learn how to download the blob to your local computer, and how to view all of the blobs in a container. You also learn how to create a snapshot of a blob, manage container access policies, and create a shared access signature.
services: storage
author: roygara

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 12/04/2018
ms.author: rogarana
---

# How to: Set file and directory level ACLs using Azure Storage explorer

This article shows how to set file and directory level ACLs through the desktop version of Azure Storage explorer.

This article requires that you install Azure Storage Explorer. To install Azure Storage Explorer for Windows, Macintosh, or Linux, see [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

## Log in to Storage Explorer

On first launch, the **Microsoft Azure Storage Explorer - Connect** window is shown. Storage Explorer provides several ways to connect to storage accounts. The following table lists the different ways you can connect:

|Task|Purpose|
|---|---|
|Add an Azure Account | Redirects you to your organizations login page to authenticate you to Azure. |
|Use a connection string or shared access signature URI | Can be used to directly access a container or storage account with a SAS token or a shared connection string. |
|Use a storage account name and key| Use the storage account name and key of your storage account to connect to Azure storage.|

Select **Add an Azure Account** and click **Sign in.**. Follow the on-screen prompts to sign into your Azure account.

![Microsoft Azure Storage Explorer - Connect window](media/storage-quickstart-blobs-storage-explorer/connect.png)

When it completes connecting, Azure Storage Explorer loads with the **Explorer** tab shown. This view gives you insight to all of your Azure storage accounts as well as local storage configured through the [Azure Storage Emulator](../common/storage-use-emulator.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json), [Cosmos DB](../../cosmos-db/storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) accounts, or [Azure Stack](../../azure-stack/user/azure-stack-storage-connect-se.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) environments.

![Microsoft Azure Storage Explorer - Connect window](media/storage-quickstart-blobs-storage-explorer/mainpage.png)

## Set ACLs on a directory

You can set ACLs at the root of your filesystem, right click your filesystem and select **Manage Permissions**.

This wil bring up the **Manage Permission** prompt.

![Microsoft Azure Storage Explorer - Manage directory ACLs](media/storage-quickstart-blobs-storage-explorer/manageperms.png)

The **Manage Permission** prompt that will allow you to manage ACLs for existing users or add new users for whom you can then manage ACLs for. To learn about ACLs, including default ACLs, access ACLs, their behavior, and the permissions, see our article on [access control in data lake storage gen2](data-lake-storage-access-control.md#access-control-lists-on-files-and-directories). Making selections here will not set ACLs on any currently existing item inside the directory.

We recommend creating security groups and maintaining ACLs on the group rather than individual users. For details on this recommendation and other best practices, see our [best practices for data lake storage gen2](data-lake-storage-best-practices.md) article.

You can manage permissions on individual directories as well as individual files, allowing you fine grain access control. The process for managing ACLs on directories and files is the same as described above.

## Set ACLs on a file

If you have a file, you can set ACLs on it the same way you set ACLs on a directory.