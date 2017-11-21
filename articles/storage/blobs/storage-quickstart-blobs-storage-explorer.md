---
title: Azure Quickstart - Transfer objects to/from Azure Blob storage using Azure Storage Explorer | Microsoft Docs
description: Quickly learn to transfer objects to/from Azure Blob storage using Azure Storage Explorer
services: storage
documentationcenter: storage
author: georgewallace
manager: jeconnoc
editor: ''

ms.assetid: 
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 11/15/2017
ms.author: gwallace
---

# Transfer objects to/from Azure Blob storage using Azure Storage Explorer

[Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) is a multi platform user interfact used to manager the contents of your storage accounts. This guide details using Azure Storage Explorer to transfer files between local disk and Azure Blob storage.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This quick start requires the Azure Storage Explorer to be installed, If you need to install it visit [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to download it for Windows, Macintosh, or Linux.

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

## Login to Storage Explorer

On first launch, the **Microsoft Azure Storage Explorer - Connect** window is shown

|Task|Purpose|
|---|---|
|Add an Azure Account | Redirects you to your organizations login page to authenticate you to Azure. |
|Use a connection string or shared access signature URI | Can we used to directly access a container or storage account. |
| Use a storage account name and key| Use the storage account name and key of your storage account to connect to Azure storage.|

![Microsoft Azure Storage Explorer - Connect window](media/storage-quickstart-blobs-storage-explorer/connect.png)

Follow the on screen prompts to sign into your Azure account.

When complete Azure Storage Explorer loads with the **Explorer** tab open. This view gives you insight to all of your Azure storage accounts as well as local storage configured through the [Azure Storage Emulator](../common/storage-use-emulator.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

![Microsoft Azure Storage Explorer - Connect window](media/storage-quickstart-blobs-storage-explorer/mainpage.png)

## Create a container

Blobs are always uploaded into a container. This allows you to organize groups of blobs like you organize your files on your computer in folders.

To create a container, expand your storage account you created in the preceeding step, select **Blob Containers**, right click and select **Create Blob Container**. Enter the name for your blob container. See the [container naming rules](storage-dotnet-how-to-use-blobs.md#create-a-container) section for a list of rules and restrictions on naming blob containers. When complete, press **Enter** when done to create the blob container. Once the blob container has been successfully created, it is displayed under the **Blob Containers** folder for the selected storage account.

## Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. VHD files used to back IaaS VMs are page blobs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Most files stored in Blob storage are block blobs. 

On the container ribbon select **Upload**. This gives you the option to upload a folder or a file.

Choose the files or folder to upload. Select the **blob type**.  Acceptable choices are **Append**, **Page**, or **Block** blob.

If uploading a .vhd or .vhdx file, choose **Upload .vhd/.vhdx files as page blobs (recommended)**.

In the **Upload to folder (optional)** field end a folder name to store the files or folders in a folder under the container. If no folder is chosen the files are uploaded directly under the container.

![Microsoft Azure Storage Explorer - upload a blob](media/storage-quickstart-blobs-storage-explorer/uploadblob.png)

When you select **OK**, the files selected are queued to upload, each file is uploaded. When the upload is complete the results are showed in the **Activities** window.

## View blobs in a container

In the **Azure Storage Explorer** application, select a container under a storage account. The main pane shows a list of the blobs in the selected container.

![Microsoft Azure Storage Explorer - list blobs in a container](media/storage-quickstart-blobs-storage-explorer/listblobs.png)

## Download blobs

To download blobs using **Azure Storage Explorer**, with a blob selected, select **Download** from the ribbon. A file dialog opens and provides you the ability to enter a file name. Select **Save** to start the download of a blob to the local location.

## Next steps

In this quick start, you learned how to transfer files between a local disk and Azure Blob storage using **Azure Storage Explorer**. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-how-to-use-blobs-powershell.md)
