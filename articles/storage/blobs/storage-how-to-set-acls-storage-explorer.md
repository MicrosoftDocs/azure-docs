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

If you don't already have you, you can create a filesystem by right clicking **Blob containers** and selecting **Create a blob container**. Then, select that container and select **New folder**, enter a name. This will create a directory.

Now that you've done that, you may click the folder and select **Manage permissions**.

This will open a prompt that will allow you to manage ACLs for existing users or add new users for whom you can then manage ACLs for. Making selections here will not set ACLs on any existing item inside the directory.

Setting **default ACLs** on a parent folder will, only on subsequent creation, set those same ACLs on any child or children folder and its contents. You may individually change those ACLs after creating those items.

## Set ACLs on a file

If you have a file, you can set ACLs on it the same way you set ACLs on a directory.