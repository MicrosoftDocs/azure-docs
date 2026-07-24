---
title: "Use Azure Storage Explorer to manage files in Azure Data Lake Storage"
titleSuffix: Azure Storage
description: "Use Azure Storage Explorer to create and manage directories and files in Azure Data Lake Storage with hierarchical namespace enabled. Get started today."
author: normesta

ms.service: azure-data-lake-storage
ms.topic: how-to
ms.date: 07/07/2026
ms.author: normesta
# Customer intent: As a data engineer, I want to use Azure Storage Explorer to manage directories and files in Azure Data Lake Storage, so that I can efficiently organize and control access to my data in a hierarchical storage structure.
---

# Use Azure Storage Explorer to manage directories and files in Azure Data Lake Storage

This article shows you how to use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to create and manage directories and files in storage accounts that have hierarchical namespace (HNS) enabled.

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow [these instructions](../common/storage-account-create.md) to create one.

- Azure Storage Explorer installed on your local computer. To install Azure Storage Explorer for Windows, macOS, or Linux, see [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

> [!NOTE]
> Storage Explorer uses both the Blob (blob) and Data Lake Storage (dfs) [endpoints](../common/storage-account-overview.md#standard-endpoints) when working with Azure Data Lake Storage. If you configure access to Azure Data Lake Storage by using private endpoints, make sure you create two private endpoints for the storage account: one with the target sub-resource `blob` and the other with the target sub-resource `dfs`.

## Sign in to Storage Explorer

When you first start Storage Explorer, the **Microsoft Azure Storage Explorer - Connect to Azure Storage** window appears. While Storage Explorer provides several ways to connect to storage accounts, only the **Subscription** connection method supports managing ACLs.

In the **Select Resource** panel, select **Subscription**.

:::image type="content" source="./media/data-lake-storage-explorer/storage-explorer-connect-sml.png" alt-text="Screenshot of the Microsoft Azure Storage Explorer Connect to Azure Storage window with the Select Resource panel visible." lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-connect-lrg.png":::

In the **Select Azure Environment** panel, select an Azure environment to sign in to. You can sign in to global Azure, a national cloud, or an Azure Stack instance. Then select **Next**.

:::image type="content" alt-text="Screenshot of Microsoft Azure Storage Explorer with the Select Azure Environment panel highlighted." source="./media/data-lake-storage-explorer/storage-explorer-select-sml.png" lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-select-sml.png":::

Storage Explorer opens a webpage for you to sign in.

After you successfully sign in with an Azure account, the account and the Azure subscriptions associated with that account appear under **ACCOUNT MANAGEMENT**. Select the Azure subscriptions that you want to work with, and then select **Open Explorer**.

:::image type="content" alt-text="Screenshot of Microsoft Azure Storage Explorer showing the Account Management pane with the Open Explorer button highlighted." source="./media/data-lake-storage-explorer/storage-explorer-account-panel-sml.png" lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-account-panel-sml.png":::

When it completes connecting, Azure Storage Explorer loads with the **Explorer** tab shown. This view gives you insight into all of your Azure storage accounts as well as local storage configured through the [Azurite storage emulator](../common/storage-use-azurite.md?toc=/azure/storage/blobs/toc.json) or [Azure Stack](/azure-stack/user/azure-stack-storage-connect-se?toc=/azure/storage/blobs/toc.json) environments.

:::image type="content" alt-text="Screenshot of the Microsoft Azure Storage Explorer main page with the Explorer tab displayed showing Azure storage accounts." source="./media/data-lake-storage-explorer/storage-explorer-main-page-sml.png" lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-main-page-lrg.png":::

## Create a container

A container holds directories and files. To create one, expand the storage account you created in the preceding step. Select **Blob Containers**, right-click, and select **Create Blob Container**. Alternatively, you can select **Blob Containers**, and then select **Create Blob Container** in the **Actions** pane. 

:::image type="content" alt-text="Screenshot of Azure Storage Explorer showing the Blob Containers context menu with Create Blob Container option selected." source="./media/data-lake-storage-explorer/creating-a-filesystem-sml.png" lightbox="./media/data-lake-storage-explorer/creating-a-filesystem-lrg.png":::

Enter the name for your container. See the [Create a container](storage-quickstart-blobs-dotnet.md#create-a-container) section for a list of rules and restrictions on naming containers. When complete, press **Enter** to create the container. After the container is created, it appears under the **Blob Containers** folder for the selected storage account.

:::image type="content" alt-text="Screenshot of Azure Storage Explorer showing a newly created container listed under the Blob Containers folder." source="./media/data-lake-storage-explorer/container-created-sml.png" lightbox="./media/data-lake-storage-explorer/container-created-lrg.png":::

## Create a directory

To create a directory, select the container that you created in the [Create a container](#create-a-container) section. In the container ribbon, select the **New Folder** button. Enter the name for your directory. When complete, press **Enter** to create the directory. After the directory is created, it appears in the main pane.

## Upload blobs to the directory

On the directory ribbon, select the **Upload** button. You can upload a folder or a file.

Select the files or folder to upload.

:::image type="content" alt-text="Screenshot of Azure Storage Explorer displaying the upload options for selecting a file or folder to upload to a directory." source="media/data-lake-storage-explorer/storage-explorer-upload-file-sml.png" lightbox="media/data-lake-storage-explorer/storage-explorer-upload-file-lrg.png":::

When you select **Upload**, the files you selected are queued, and each file is uploaded. When the upload finishes, the results show in the **Activities** window.

## View blobs in a directory

In the **Azure Storage Explorer** application, select a directory under a storage account. The main pane shows a list of the blobs in the selected directory.

:::image type="content" alt-text="Screenshot of Azure Storage Explorer showing a list of blobs in a selected directory within a storage account." source="media/data-lake-storage-explorer/storage-explorer-list-files-sml.png" lightbox="media/data-lake-storage-explorer/storage-explorer-list-files-sml.png":::

## Download blobs

To download a file, select it and then select **Download** from the ribbon. A file dialog opens where you can enter a file name. Select **Select Folder** to start the download of a file to the local location.

:::image type="content" alt-text="Screenshot of Azure Storage Explorer with a file selected and the Download option highlighted in the ribbon." source="media/data-lake-storage-explorer/storage-explorer-download-blob-sml.png" lightbox="media/data-lake-storage-explorer/storage-explorer-download-blob-sml.png":::

## Next steps

Learn how to manage file and directory permission by setting access control lists (ACLs).

> [!div class="nextstepaction"]
> [Use Azure Storage Explorer to manage ACLs in Azure Data Lake Storage](./data-lake-storage-explorer-acl.md)
