---
title: Use Azure Storage Explorer with Azure Data Lake Storage Gen2
description: Use the Azure Storage Explorer to manage directories and file and directory access control lists (ACL) in storage accounts that has hierarchical namespace (HNS) enabled.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 10/28/2021
ms.author: normesta
ms.reviewer: stewu
---

# Use Azure Storage Explorer to manage directories and files in Azure Data Lake Storage Gen2

This article shows you how to use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to create and manage directories and files in storage accounts that has hierarchical namespace (HNS) enabled.

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow [these](../common/storage-account-create.md) instructions to create one.

- Azure Storage Explorer installed on your local computer. To install Azure Storage Explorer for Windows, Macintosh, or Linux, see [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

> [!NOTE]
> Storage Explorer makes use of both the Blob (blob) & Data Lake Storage Gen2 (dfs) [endpoints](../common/storage-private-endpoints.md#private-endpoints-for-azure-storage) when working with Azure Data Lake Storage Gen2. If access to Azure Data Lake Storage Gen2 is configured using private endpoints, ensure that two private endpoints are created for the storage account: one with the target sub-resource `blob` and the other with the target sub-resource `dfs`.

## Sign in to Storage Explorer

When you first start Storage Explorer, the **Microsoft Azure Storage Explorer - Connect to Azure Storage** window appears. While Storage Explorer provides several ways to connect to storage accounts, only one way is currently supported for managing ACLs.

In the **Select Resource** panel, select **Subscription**.

:::image type="content" source="./media/data-lake-storage-explorer/storage-explorer-connect-sml.png" alt-text="Screenshot that shows the Microsoft Azure Storage Explorer - Select Resource pane" lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-connect-lrg.png":::

In the **Select Azure Environment** panel, select an Azure environment to sign in to. You can sign in to global Azure, a national cloud or an Azure Stack instance. Then select **Next**.

:::image type="content" alt-text="Screenshot that shows Microsoft Azure Storage Explorer, and highlights the Select Azure Environment option." source="./media/data-lake-storage-explorer/storage-explorer-select-sml.png"  lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-select-sml.png":::

Storage Explorer will open a webpage for you to sign in.

After you successfully sign in with an Azure account, the account and the Azure subscriptions associated with that account appear under **ACCOUNT MANAGEMENT**. Select the Azure subscriptions that you want to work with, and then select **Open Explorer**.

:::image type="content" alt-text="Screenshot that shows Microsoft Azure Storage Explorer, and highlights the Account Management pane and Open Explorer button." source="./media/data-lake-storage-explorer/storage-explorer-account-panel-sml.png"  lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-account-panel-sml.png":::

When it completes connecting, Azure Storage Explorer loads with the **Explorer** tab shown. This view gives you insight to all of your Azure storage accounts as well as local storage configured through the [Azurite storage emulator](../common/storage-use-azurite.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json), [Cosmos DB](../../cosmos-db/storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) accounts, or [Azure Stack](/azure-stack/user/azure-stack-storage-connect-se?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) environments.

:::image type="content" alt-text="Microsoft Azure Storage Explorer - Connect window" source="./media/data-lake-storage-explorer/storage-explorer-main-page-sml.png" lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-main-page-lrg.png":::

## Create a container

A container holds directories and files. To create one, expand the storage account you created in the proceeding step. Select **Blob Containers**, right-click, and select **Create Blob Container**. Enter the name for your container. See the [Create a container](storage-quickstart-blobs-dotnet.md#create-a-container) section for a list of rules and restrictions on naming containers. When complete, press **Enter** to create the container. Once the container has been successfully created, it is displayed under the **Blob Containers** folder for the selected storage account.

![Microsoft Azure Storage Explorer - Creating a container](media/data-lake-storage-explorer/creating-a-filesystem.png)

## Create a directory

To create a directory, select the container that you created in the proceeding step. In the container ribbon, choose the **New Folder** button. Enter the name for your directory. When complete, press **Enter** to create the directory. Once the directory has been successfully created, it appears in the editor window.

![Microsoft Azure Storage Explorer - Creating a directory](media/data-lake-storage-explorer/creating-a-directory.png)

## Upload blobs to the directory

On the directory ribbon, choose the **Upload** button. This operation gives you the option to upload a folder or a file.

Choose the files or folder to upload.

![Microsoft Azure Storage Explorer - upload a blob](media/data-lake-storage-explorer/upload-file.png)

When you select **OK**, the files selected are queued to upload, each file is uploaded. When the upload is complete, the results are shown in the **Activities** window.

## View blobs in a directory

In the **Azure Storage Explorer** application, select a directory under a storage account. The main pane shows a list of the blobs in the selected directory.

![Microsoft Azure Storage Explorer - list blobs in a directory](media/data-lake-storage-explorer/list-files.png)

## Download blobs

To download files by using **Azure Storage Explorer**, with a file selected, select **Download** from the ribbon. A file dialog opens and provides you the ability to enter a file name. Select **Save** to start the download of a file to the local location.

## Next steps

Learn how to manage file and directory permission by setting access control lists (ACLs)

> [!div class="nextstepaction"]
> [Use Azure Storage Explorer to manage ACLs in Azure Data Lake Storage Gen2](./data-lake-storage-explorer-acl.md)
