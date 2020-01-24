---
title: 'Use Azure Storage Explorer with Azure Data Lake Storage Gen2'
description: Learn how to use Azure Storage Explorer to manage files and folders in Azure Data Lake Storage Gen2.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 01/23/2019
ms.author: normesta
ms.reviewer: stewu
---

# Use Azure Storage Explorer with Azure Data Lake Storage Gen2

In this article, you'll learn how to use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to create a directory, upload and download files as well as view all files in a directory. 

## Prerequisites

These tasks depend on a few things.

* An Azure subscription. If you don't have one, create a [Free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A storage account that has the **hierarchical namespace** feature enabled. See [Create an Azure Storage account](storage-account-create).

* Azure Storage Explorer installed on your local computer. To install Azure Storage Explorer for Windows, Macintosh, or Linux, see [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

## Sign in to Storage Explorer

When you first start Storage Explorer, the **Microsoft Azure Storage Explorer - Connect** window appears. While Storage Explorer provides several ways to connect to storage accounts, only one way is currently supported for managing ACLs.

|Task|Purpose|
|---|---|
|Add an Azure Account | Redirects you to your organization's sign-in page to authenticate you to Azure. Currently this is the only supported authentication method if you want to manage and set ACLs.|
|Use a connection string or shared access signature URI | Can be used to directly access a container or storage account with a SAS token or a shared connection string. |
|Use a storage account name and key| Use the storage account name and key of your storage account to connect to Azure storage.|

Select **Add an Azure Account** and click **Sign in..**. Follow the on-screen prompts to sign into your Azure account.

![Microsoft Azure Storage Explorer - Connect window](media/storage-quickstart-blobs-storage-explorer/connect.png)

When it completes connecting, Azure Storage Explorer loads with the **Explorer** tab shown. This view gives you insight to all of your Azure storage accounts as well as local storage configured through the [Azure Storage Emulator](../common/storage-use-emulator.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json), [Cosmos DB](../../cosmos-db/storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) accounts, or [Azure Stack](/azure-stack/user/azure-stack-storage-connect-se?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) environments.

![Microsoft Azure Storage Explorer - Connect window](media/storage-quickstart-blobs-storage-explorer/mainpage.png)

## Create a container

A container holds directories and files. To create one, expand the storage account you created in the proceeding step. Select **Blob Containers**, right-click and select **Create Blob Container**. Enter the name for your container. See the [Create a container](storage-quickstart-blobs-dotnet.md#create-a-container) section for a list of rules and restrictions on naming containers. When complete, press **Enter** to create the container. Once the container has been successfully created, it is displayed under the **Blob Containers** folder for the selected storage account.

![Microsoft Azure Storage Explorer - Creating a container](media/data-lake-storage-explorer/creating-a-filesystem.png)

## Create a directory

To create a directory, select the container that you created in the proceeding step. In the container ribbon, choose the **New Folder** button. Enter the name for your directory. When complete, press **Enter** to create the directory. Once the directory has been successfully created, it appears in the editor window.

![Microsoft Azure Storage Explorer - Creating a directory](media/data-lake-storage-explorer/creating-a-directory.png)


## Upload blobs to the directory

On the directory ribbon, chose the **Upload** button. This operation gives you the option to upload a folder or a file.

Choose the files or folder to upload.

![Microsoft Azure Storage Explorer - upload a blob](media/data-lake-storage-explorer/upload-file.png)

When you select **OK**, the files selected are queued to upload, each file is uploaded. When the upload is complete, the results are shown in the **Activities** window.

## View blobs in a directory

In the **Azure Storage Explorer** application, select a directory under a storage account. The main pane shows a list of the blobs in the selected directory.

![Microsoft Azure Storage Explorer - list blobs in a directory](media/data-lake-storage-explorer/list-files.png)

## Download blobs

To download files by using **Azure Storage Explorer**, with a file selected, select **Download** from the ribbon. A file dialog opens and provides you the ability to enter a file name. Select **Save** to start the download of a file to the local location.

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Data Lake Storage Gen2 storage by using **Azure Storage Explorer**. Next, learn how to set ACLs on your files and directories..

> [!div class="nextstepaction"]
> [How to set ACLs on files and directories](data-lake-storage-how-to-set-permissions-storage-explorer.md)
