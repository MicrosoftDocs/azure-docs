---
title: Use Azure Storage Explorer with Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Use the Azure Storage Explorer to manage directories and file and directory access control lists (ACL) in storage accounts that has hierarchical namespace (HNS) enabled.
author: normesta

ms.service: azure-data-lake-storage
ms.topic: how-to
ms.date: 03/09/2023
ms.author: normesta
---

# Use Azure Storage Explorer to manage directories and files in Azure Data Lake Storage Gen2

This article shows you how to use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to create and manage directories and files in storage accounts that have hierarchical namespace (HNS) enabled.

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

Storage Explorer opens a webpage for you to sign in.

After you successfully sign in with an Azure account, the account and the Azure subscriptions associated with that account appear under **ACCOUNT MANAGEMENT**. Select the Azure subscriptions that you want to work with, and then select **Open Explorer**.

:::image type="content" alt-text="Screenshot that shows Microsoft Azure Storage Explorer, and highlights the Account Management pane and Open Explorer button." source="./media/data-lake-storage-explorer/storage-explorer-account-panel-sml.png"  lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-account-panel-sml.png":::

When it completes connecting, Azure Storage Explorer loads with the **Explorer** tab shown. This view gives you insight to all of your Azure storage accounts as well as local storage configured through the [Azurite storage emulator](../common/storage-use-azurite.md?toc=/azure/storage/blobs/toc.json) or [Azure Stack](/azure-stack/user/azure-stack-storage-connect-se?toc=/azure/storage/blobs/toc.json) environments.

:::image type="content" alt-text="Microsoft Azure Storage Explorer - Connect window" source="./media/data-lake-storage-explorer/storage-explorer-main-page-sml.png" lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-main-page-lrg.png":::

## Create a container

A container holds directories and files. To create one, expand the storage account you created in the proceeding step. Select **Blob Containers**, right-click, and select **Create Blob Container**. Alternatively, you can select **Blob Containers**, then select **Create Blob Container** in the **Actions** pane. 

:::image type="content" alt-text="Microsoft Azure Storage Explorer - Create a container" source="./media/data-lake-storage-explorer/creating-a-filesystem-sml.png" lightbox="./media/data-lake-storage-explorer/creating-a-filesystem-lrg.png" :::

Enter the name for your container. See the [Create a container](storage-quickstart-blobs-dotnet.md#create-a-container) section for a list of rules and restrictions on naming containers. When complete, press **Enter** to create the container. After the container has been successfully created, it's displayed under the **Blob Containers** folder for the selected storage account.

:::image type="content" alt-text="Microsoft Azure Storage Explorer - Container created" source="./media/data-lake-storage-explorer/container-created-sml.png" lightbox="./media/data-lake-storage-explorer/container-created-lrg.png" :::

## Create a directory

To create a directory, select the container that you created in the proceeding step. In the container ribbon, choose the **New Folder** button. Enter the name for your directory. When complete, press **Enter** to create the directory. After the directory has been successfully created, it appears in the editor window.

:::image type="content" alt-text="Microsoft Azure Storage Explorer - Create a directory" source="media/data-lake-storage-explorer/create-directory-sml.png" lightbox="media/data-lake-storage-explorer/create-directory-lrg.png" :::

## Upload blobs to the directory

On the directory ribbon, choose the **Upload** button. This operation gives you the option to upload a folder or a file.

Choose the files or folder to upload.

:::image type="content" alt-text="Microsoft Azure Storage Explorer - upload a blob" source="media/data-lake-storage-explorer/storage-explorer-upload-file-sml.png" lightbox="media/data-lake-storage-explorer/storage-explorer-upload-file-lrg.png" :::

When you select **Upload**, the files selected are queued, and each file is uploaded. When the upload is complete, the results are shown in the **Activities** window.

## View blobs in a directory

In the **Azure Storage Explorer** application, select a directory under a storage account. The main pane shows a list of the blobs in the selected directory.

:::image type="content" alt-text="Microsoft Azure Storage Explorer - list blobs in a directory" source="media/data-lake-storage-explorer/storage-explorer-list-files-sml.png" lightbox="media/data-lake-storage-explorer/storage-explorer-list-files-sml.png" :::"

## Download blobs

To download files by using **Azure Storage Explorer**, with a file selected, select **Download** from the ribbon. A file dialog opens and provides you with the ability to enter a file name. Select **Select Folder** to start the download of a file to the local location.

:::image type="content" alt-text="Microsoft Azure Storage Explorer - download blobs from a directory" source="media/data-lake-storage-explorer/storage-explorer-download-blob-sml.png" lightbox="media/data-lake-storage-explorer/storage-explorer-download-blob-sml.png" :::

## Next steps

Learn how to manage file and directory permission by setting access control lists (ACLs)

> [!div class="nextstepaction"]
> [Use Azure Storage Explorer to manage ACLs in Azure Data Lake Storage Gen2](./data-lake-storage-explorer-acl.md)
